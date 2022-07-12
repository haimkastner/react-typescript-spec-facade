# React TypeScript Spec Facade

An example project of building API facade from API Server OpenAPI spec.



API Spec fetched from the [node-api-spec-boilerplate](https://github.com/haimkastner/node-api-spec-boilerplate) artifactory.

API facade built by [openapi-generator-cli](https://github.com/OpenAPITools/openapi-generator-cli) tool with custom [api.mustache](./resources/openapi/templates/typescript-axios/api.mustache) template based on [typescript-fetch](https://github.com/swagger-api/swagger-codegen/blob/master/modules/swagger-codegen/src/main/resources/typescript-fetch/api.mustache) template.

---

✨ Application Live [Demo](https://react-typescript-spec-facade.castnet.club/) ✨

---

Explorer the API Spec on [SwaggerHub](https://app.swaggerhub.com/apis/haimkastner/node-api-spec-boilerplate)

### `Configuration`

All config by env vars, see for all options in [./env.example](./.env.example):
* `REACT_APP_API_SERVER_URL`: The API Server URL, as default it's `http://127.0.0.1:8080`   
* `API_SERVER_SPEC_BRANCH`: As default spec fetched from Server API [Actions artifactory](https://github.com/haimkastner/node-api-spec-boilerplate/actions) branch `main`, set this env var to other specific branch.
* `API_SERVER_SPEC_PATH`: As default Api spec will be fetched from [node-api-spec-boilerplate artifactory](https://github.com/haimkastner/node-api-spec-boilerplate/actions), set this env var to copy from machine file-system instead, used for local debug and build.

Hosting front UI on [Netlify](https://react-typescript-spec-facade.castnet.club/)


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

---
Project based on [Create React App](https://github.com/facebook/create-react-app) template.