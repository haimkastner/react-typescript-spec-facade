import fse from 'fs-extra';
import path from 'path';
import nodeFetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// The API owner
const API_SPEC_OWNER = 'haimkastner';
// The API name
const API_SPEC_NAME = 'node-api-spec-boilerplate';

// The Local spec file path, if set the spec will be taken from machine's FS and not be fetched by swagger API 
const API_SERVER_SPEC_PATH = process.env.API_SERVER_SPEC_PATH;

// The spec file name
const SPEC_FILE_NAME = 'swagger.json';

// The directory to save the fetched spec
const SPEC_FILE_DEST_DIR = path.join('./src/generated');

async function downloadSpec() {

    console.log(`[fetch-api] Fetching API versions form SwaggerHub...`);

    // Fetch all available versions from SwaggerHub API
    const allSpecsRes = await nodeFetch(`https://api.swaggerhub.com/apis/${API_SPEC_OWNER}/${API_SPEC_NAME}`);
    // Get info as JSON
    const allSpecs = await allSpecsRes.json();

    // Get the latest API available
    const latestVersionInfo = allSpecs.apis[allSpecs.apis.length - 1];

    // Find the SWagger property, where there is the URL to the spec 
    const latestVersionUrl = latestVersionInfo.properties.find(prop => prop.type === 'Swagger')?.url;

    console.log(`[fetch-api] Fetching API Spec form SwaggerHub URL "${latestVersionUrl}"`);

    // Fetch the spec
    const latestSpecRes = await nodeFetch(latestVersionUrl);
    // Get spec as JSON
    const latestSpec = await latestSpecRes.json();

    // Build the s file full path
    const fileDist = path.join(SPEC_FILE_DEST_DIR, SPEC_FILE_NAME);

    console.log(`[fetch-api] Saving API Spec to "${fileDist}"`);

    // Create generated dir if not yet exists
    await fse.promises.mkdir(path.dirname(fileDist), { recursive: true });
    // Save the fetched spec into it
    fse.outputJSONSync(fileDist, latestSpec);
}

(async () => {
    // If local path has been set, use it
    if (API_SERVER_SPEC_PATH) {
        console.log(`[fetch-api] Coping API Spec from local path "${API_SERVER_SPEC_PATH}"...`);

        // Create generated dir if not yet exists
        await fse.promises.mkdir(SPEC_FILE_DEST_DIR, { recursive: true });

        // And copy spec file
        await fse.promises.copyFile(path.join(API_SERVER_SPEC_PATH), path.join(SPEC_FILE_DEST_DIR, SPEC_FILE_NAME));
        return;
    }

    console.log(`[fetch-api] About to download spec form SwaggerHub API`);
    await downloadSpec();
    console.log(`[fetch-api] API Spec fetched successfully`);
})();