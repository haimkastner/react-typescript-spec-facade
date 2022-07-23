import fse from 'fs-extra';
import path from 'path';
import jsZip from 'jszip';
import nodeFetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// The API owner
const API_SPEC_OWNER = 'haimkastner';
// The API name
const API_SPEC_NAME = 'node-api-spec-boilerplate';

//  The branch to take spec from, as default use main branch
const API_SERVER_SPEC_BRANCH = process.env.API_SERVER_SPEC_BRANCH || 'main';

// The Local spec file path, if set the spec will be taken from machine's FS and not be fetched by GitHub artifactory 
const API_SERVER_SPEC_PATH = process.env.API_SERVER_SPEC_PATH;

// The spec file name
const SPEC_FILE_NAME = 'swagger.json';

// The directory to save the fetched spec
const SPEC_FILE_DEST_DIR = path.join('src/generated');

async function downloadSpec() {

    console.log(`[fetch-api] Fetching API spec form git...`);

    // Download the swagger API spec from the API server CI latest artifact https://github.com/haimkastner/node-api-spec-boilerplate/actions/workflows/actions.yml
    // Using https://nightly.link/ for download latest build dist
    const latestArtifact = await nodeFetch(`https://nightly.link/${API_SPEC_OWNER}/${API_SPEC_NAME}/workflows/actions/${API_SERVER_SPEC_BRANCH}/swagger-spec.zip`);
    
    // Get res buffer data
    const artifactBuffer = await latestArtifact.arrayBuffer();

    // Load buffer as a zip archive
    const artifactZip = await jsZip.loadAsync(artifactBuffer);

    // Fetch the archived spec file
    const archivedSpecFile = artifactZip.file(SPEC_FILE_NAME);

    // Extract file content as buffer
    const fileBuffer = await archivedSpecFile.async('nodebuffer');

    // Build the file full path
    const fileDist = path.join(SPEC_FILE_DEST_DIR, SPEC_FILE_NAME);

    console.log(`[fetch-api] Saving API Spec to "${fileDist}"`);

    // Create generated dir if not yet exists
    await fse.promises.mkdir(path.dirname(fileDist), { recursive: true });
    // Save the fetched spec into it
    fse.outputFileSync(fileDist,  fileBuffer);
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

    console.log(`[fetch-api] Fetching API Spec form server "${API_SERVER_SPEC_BRANCH}" branch...`);
    await downloadSpec();
    console.log(`[fetch-api] API Spec fetched successfully`);
})();