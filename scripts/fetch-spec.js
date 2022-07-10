import fse from 'fs-extra';
import path from 'path';
import jsZip from 'jszip';
import nodeFetch from 'node-fetch';


const BRANCH = process.env.BRANCH || 'main';

const dashboardDist = path.join('src/generated');

async function downloadAndUnpackZip(dashboardArtifact, distDir) {
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
    console.log(`[fetch-api] Fetching API Spec form server "${BRANCH}" branch...`);

    // Download the swagger API spec from the API server CI latest artifact https://github.com/haimkastner/node-api-spec-boilerplate/actions/workflows/actions.yml
    // Using https://nightly.link/ for download latest build dist
    await downloadAndUnpackZip(`https://nightly.link/haimkastner/node-api-spec-boilerplate/workflows/actions/${BRANCH}/swagger-spec.zip`, dashboardDist);
})();