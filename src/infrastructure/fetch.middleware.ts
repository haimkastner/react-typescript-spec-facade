import { JobFlag, JobFunction, JobStatus } from "../generated/swagger/api";
import sleep from 'sleep-promise';

/**
 * Await to get to be finished, get status by pulling
 * @param jobId The job id to query
 * @param jobFunction The pulling function
 * @returns The job result on finished
 */
async function awaitForAJob(jobId: string, jobFunction: JobFunction) : Promise<any> {
    // Start the pulling loop
    while (true) {
        // Run the pulling function *NOT AS A JOB*
        // Thh requirement for this injection instead of calling get job API is due to circular import. 
        const jobState = await jobFunction.method.apply(jobFunction.theThis, [JobFlag.Off, jobId]);
        
        console.log(`New update for job "${jobId}" arrived status "${jobState.status}" with progress ${jobState.progress.percentage}% msg:"${jobState.progress.message || ''}" `);
        // If consumer provided a callback to be called on update, execute it with the new state arrived from server.
        jobFunction.requestOptions?.progressCallback?.(jobState.progress);
        switch (jobState.status) {
            case JobStatus.Done: // If process finished return the 
                return jobState.results;
            case JobStatus.Failed: // IF pulling failed, throw an exception
                throw new Error(`Job ${jobId} failed`);
            default:
                break;
        }
        // Sleep for a while till the next pulling
        await sleep(1000 * 5);
        // TODO: implement some kind of timeout.
    }
}

/**
 * A middleware for browser's fetch, to handle job processing. 
 * @param url The request URL
 * @param jobFunction The job status fetch by pulling function with the params for it
 * @param options The fetch HTTP options
 * @returns The object contained the HTTP Response
 */
export async function fetchMiddleware(url: string, jobFunction: JobFunction, options?: any): Promise<Response> {

    // Start by calling the original fetch 
    const response = await fetch(url, options);

    // Look after the job flag in the responded headers
    const isJob = response.headers.get('x-job-flag') === JobFlag.On;

    // If it's not a job, just return the original object and basically do nothing.
    if (!isJob) {
        return response;
    }

    // If it's do a job, ready payload to get the job id
    const jobInfo = await response.json();
    // Await to the job to be done
    const jobResults = await awaitForAJob(jobInfo.jobId, jobFunction);
    // Replace the "get json payload" of the original request with a function that will return the payload arrived from the job
    // This is what the consumer is want, not the job id in the original request :) 
    response.json = () => jobResults;
    // Return it back to the consumer
    return response;
}
