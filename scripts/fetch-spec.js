import fse from 'fs-extra';
import path from 'path';
import jsZip from 'jszip';
import nodeFetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_SERVER_SPEC_BRANCH = process.env.API_SERVER_SPEC_BRANCH || 'main';
const API_SERVER_SPEC_PATH = process.env.API_SERVER_SPEC_PATH;

const SPEC_FILE_NAME = 'swagger.json';

const dashboardDist = path.join('src/generated');

async function downloadAndUnpackZip(dashboardArtifact, distDir) {

    if (API_SERVER_SPEC_PATH) {
        console.log(`[fetch-api] Coping API Spec from local path "${API_SERVER_SPEC_PATH}"...`);
        await fse.promises.mkdir(path.dirname(distDir), { recursive: true });
        await fse.promises.copyFile(path.join(API_SERVER_SPEC_PATH), path.join(distDir, SPEC_FILE_NAME));
        return;
    }

    const latestArtifact = await nodeFetch(dashboardArtifact);
    const artifactBuffer = await latestArtifact.arrayBuffer();

    const artifactZip = await jsZip.loadAsync(artifactBuffer);

    for (const [filename, file] of Object.entries(artifactZip.files)) {
        if (file.dir) {
            continue;
        }

        const fileBuffer = await file.async('nodebuffer');


        const fileDist = path.join(distDir, filename);
        await fse.promises.mkdir(path.dirname(fileDist), { recursive: true });
        fse.outputFileSync(fileDist, fileBuffer);
    }
}

(async () => {
    console.log(`[fetch-api] Fetching API Spec form server "${API_SERVER_SPEC_BRANCH}" branch...`);

    // Download the swagger API spec from the API server CI latest artifact https://github.com/haimkastner/node-api-spec-boilerplate/actions/workflows/actions.yml
    // Using https://nightly.link/ for download latest build dist
    await downloadAndUnpackZip(`https://nightly.link/haimkastner/node-api-spec-boilerplate/workflows/actions/${API_SERVER_SPEC_BRANCH}/swagger-spec.zip`, dashboardDist);
})();