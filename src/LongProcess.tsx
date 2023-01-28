import React, { useState } from 'react';
import './App.css';
import { ApiFacade, JobFlag, JobProgress, LongPong } from './generated/swagger/api';

export function LongProcess() {

  // The processing state, true if currently there is a process request in the air.
  const [processing, setProcessing] = useState<boolean>(false);
  // The processing results, stores the last processing responded from the API server.
  const [processResults, setProcessResults] = useState<LongPong>();
  // The failed/error state, has some error message value, if the last ping request failed.
  const [failed, setFailed] = useState<string | undefined>();
  // The processing job progress 
  const [processProgress, setProcessProgress] = useState<JobProgress>();

  async function sendLongPing() {
    // Before sending ping, update relevant states.
    setProcessing(true);
    setFailed(undefined);
    setProcessResults(undefined);
    try {
      // Call the API as a job just with the flag on as parameter, how easy it, haa?
      const pong = await ApiFacade.StatusApi.longPing(JobFlag.On, {
        progressCallback: setProcessProgress // This is optional, pass the set progress set state to be updated
      });
      // Update state with the processing results
      setProcessResults(pong);
    } catch (error: any) {
      console.log(`The processing failed with error: ${error?.message}`);
      // Update failed error due to the failure.
      setFailed(error?.message || 'unknown error');
    }
    // Mark processing state as finished
    setProcessing(false);
  }

  return (
    <div style={{ width: '30vw' }}>
      <p>
        <p >
          For triggering an long processing API call using Job infrastructure, please press "Start Process"
        </p>
        <div>
          <div>
            {/* The form submit input, available if no other process in the air, once clicked, the ping request will be triggered */}
            <input type={'submit'} value={'Start Process'} disabled={processing} onClick={sendLongPing} />
          </div>
        </div>

      </p>
      {
        // Show progress and the job response
        !processResults && !processing ?
          (failed ? 'Failed to get process response' : '---No process started yet---') :
          <p>
            Progress {processProgress?.percentage}% -{processProgress?.message || ''}-
            {processResults && <p>Job finished within {processResults.timeTook / 1000} sec</p>}
          </p>
      }
    </div>
  );
}
