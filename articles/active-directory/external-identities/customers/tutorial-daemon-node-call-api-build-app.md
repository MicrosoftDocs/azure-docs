---
title: "Tutorial: Call a web API from your Node.js daemon application"
description: Learn about how to prepare your Node.js client daemon app, then configure it to acquire an access token for calling a web API.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: tutorial
ms.date: 07/26/2023
ms.custom: developer, devx-track-js
---

# Tutorial: Call a web API from your Node.js daemon application

This tutorial demonstrates how to prepare your Node.js daemon client app, then configure it to acquire an access token for calling a web API. The application you build uses [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to simplify adding authorization to your node daemon application.

The [OAuth 2.0 client credentials grant flow](../../develop/v2-oauth2-client-creds-grant-flow.md) permits a web service (confidential client) to use its own credentials, instead of impersonating a user, to authenticate before calling another web service. The client credentials grant flow is commonly used for server-to-server interactions that must run in the background, without immediate interaction with a user.

In this tutorial, you'll:

> [!div class="checklist"]
> - Create a Node.js app, then install dependencies.
> - Enable the Node.js app to acquire an access token for calling a web API. 

## Prerequisites


- [Node.js](https://nodejs.org).
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.
- Registration details for the Node.js daemon app and web API you created in the [prepare tenant tutorial](tutorial-daemon-node-call-api-prepare-tenant.md).
- A protected web API that is running and ready to accept requests. If you haven't created one, see the [create a protected web API tutorial](./tutorial-protect-web-api-dotnet-core-build-app.md). Ensure this web API is using the app registration details you created in the [prepare tenant tutorial](tutorial-daemon-node-call-api-prepare-tenant.md). Make sure your web API exposes the following endpoints via https:
    - `GET /api/todolist` to get all todos.
    - `POST /api/todolist` to add a todo.

## Create the Node.js daemon project

Create a folder to host your Node.js daemon application, such as `ciam-call-api-node-daemon`:

1. In your terminal, change directory into your Node daemon app folder, such as `cd ciam-call-api-node-daemon`, then run `npm init -y`. This command creates a default package.json file for your Node.js project. This command creates a default `package.json` file for your Node.js project.

1. Create additional folders and files to achieve the following project structure:

    ```
        ciam-call-api-node-daemon/
        ├── auth.js
        └── authConfig.js
        └── fetch.js
        └── index.js 
        └── package.json
    ```

## Install app dependencies

In your terminal, install `axios`, `yargs` and `@azure/msal-node` packages by running the following command:

```console
npm install axios yargs @azure/msal-node   
```

## Create MSAL configuration object

In your code editor, open *authConfig.js* file, then add the following code:

```javascript
require('dotenv').config();

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */    
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID || 'Enter_the_Application_Id_Here', // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
        authority: process.env.AUTHORITY || 'https://Enter_the_Tenant_Subdomain_Here.ciamlogin.com/', // Replace "Enter_the_Tenant_Subdomain_Here" with your tenant subdomain
        clientSecret: process.env.CLIENT_SECRET || 'Enter_the_Client_Secret_Here', // Client secret generated from the app 
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 'Info',
        },
    },
};    
const protectedResources = {
    apiToDoList: {
        endpoint: process.env.API_ENDPOINT || 'https://localhost:44351/api/todolist',
        scopes: [process.env.SCOPES || 'api://Enter_the_Web_Api_Application_Id_Here'],
    },
};

module.exports = {
    msalConfig,
    protectedResources,
};
```
The `msalConfig` object contains a set of configuration options that you use to customize the behavior of your authorization flow. 

In your *authConfig.js* file, replace: 

- `Enter_the_Application_Id_Here` with the Application (client) ID of the client daemon app that you registered earlier.

- `Enter_the_Tenant_Subdomain_Here` and replace it with the Directory (tenant) subdomain. For example, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

- `Enter_the_Client_Secret_Here` with the client daemon app secret value that you copied earlier.

- `Enter_the_Web_Api_Application_Id_Here` with the Application (client) ID of the web API app that you copied earlier.

Notice that the `scopes` property in the `protectedResources` variable is the resource identifier (application ID URI) of the [web API](tutorial-daemon-node-call-api-prepare-tenant.md#register-a-web-api-application) that you registered earlier. The complete scope URI looks similar to `api://Enter_the_Web_Api_Application_Id_Here/.default`.

## Acquire an access token

In your code editor, open *auth.js* file, then add the following code:

```javascript
const msal = require('@azure/msal-node');
const { msalConfig, protectedResources } = require('./authConfig');
/**
 * With client credentials flows permissions need to be granted in the portal by a tenant administrator.
 * The scope is always in the format '<resource-appId-uri>/.default'. For more, visit:
 * https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow
 */
const tokenRequest = {
    scopes: [`${protectedResources.apiToDoList.scopes}/.default`],
};

const apiConfig = {
    uri: protectedResources.apiToDoList.endpoint,
};

/**
 * Initialize a confidential client application. For more info, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md
 */
const cca = new msal.ConfidentialClientApplication(msalConfig);
/**
 * Acquires token with client credentials.
 * @param {object} tokenRequest
 */
async function getToken(tokenRequest) {
    return await cca.acquireTokenByClientCredential(tokenRequest);
}

module.exports = {
    apiConfig: apiConfig,
    tokenRequest: tokenRequest,
    getToken: getToken,
};
```
In the code: 

- Prepare the `tokenRequest` and `apiConfig` object. The `tokenRequest` contains the scope for which you request an access token. The scope looks something like `api://Enter_the_Web_Api_Application_Id_Here/.default`. The `apiConfig` object contains the endpoint to your web API. Learn more about [OAuth 2.0 client credentials flow](../../develop/v2-oauth2-client-creds-grant-flow.md).

- You create a confidential client instance by passing the `msalConfig` object to the [ConfidentialClientApplication](/javascript/api/%40azure/msal-node/confidentialclientapplication#constructors) class' constructor.

    ```javascript
    const cca = new msal.ConfidentialClientApplication(msalConfig);
    ```

- You then use the [acquireTokenByClientCredential](/javascript/api/%40azure/msal-node/confidentialclientapplication#@azure-msal-node-confidentialclientapplication-acquiretokenbyclientcredential) function to acquire an access token. You implement this logic in the `getToken` function: 

    ```javascript
    cca.acquireTokenByClientCredential(tokenRequest);
    ``` 
Once you acquire an access token, you can proceed to call an API.

## Call an API

In your code editor, open *fetch.js* file, then add the following code:

```javascript
const axios = require('axios');

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint 
 * @param {string} accessToken 
 */
async function callApi(endpoint, accessToken) {

    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log('request made to web API at: ' + new Date().toString());

    try {
        const response = await axios.get(endpoint, options);
        return response.data;
    } catch (error) {
        console.log(error)
        return error;
    }
};

module.exports = {
    callApi: callApi
};
```
In this code, you make a call to the web API, by passing the access token as a bearer token in the request `Authorization` header:

```javascript
 Authorization: `Bearer ${accessToken}`
```

You use the access token that you acquired earlier in [Acquire an access token](#acquire-an-access-token). 

Once the web API receives the request, it evaluates it then determines that it's an application request. If the access token is valid, the web API returns requested data. Otherwise, the API returns a `401 Unauthorized` HTTP error.

## Finalize your daemon app

In your code editor, open *index.js* file, then add the following code:

```javascript
#!/usr/bin/env node

// read in env settings

require('dotenv').config();

const yargs = require('yargs');
const fetch = require('./fetch');
const auth = require('./auth');

const options = yargs
    .usage('Usage: --op <operation_name>')
    .option('op', { alias: 'operation', describe: 'operation name', type: 'string', demandOption: true })
    .argv;

async function main() {
    console.log(`You have selected: ${options.op}`);

    switch (yargs.argv['op']) {
        case 'getToDos':
            try {
                const authResponse = await auth.getToken(auth.tokenRequest);
                const todos = await fetch.callApi(auth.apiConfig.uri, authResponse.accessToken);                
            } catch (error) {
                console.log(error);
            }

            break;
        default:
            console.log('Select an operation first');
            break;
    }
};

main();
```

This code is the entry point to your app. You use the [yargs js](https://www.npmjs.com/package/yargs) command-line argument parsing library for Node.js apps to interactively fetch an access token, then call API. You use the `getToken` and `callApi` functions you defined earlier:

```javascript            
const authResponse = await auth.getToken(auth.tokenRequest);
const todos = await fetch.callApi(auth.apiConfig.uri, authResponse.accessToken);                
```
## Run and test daemon app and API

At this point, you're ready to test your client daemon app and web API:

1. Use the steps you learned in [Secure an ASP.NET web API](./tutorial-protect-web-api-dotnet-core-build-app.md) tutorial to start your web API. Your web API is now ready to serve client requests. If you don't run your web API on port `44351` as specified in the *authConfig.js* file, make sure you update the *authConfig.js* file to use the correct web API's port number. 

1. In your terminal, make sure you're in the project folder that contains your daemon Node.js app such as `ciam-call-api-node-daemon`, then run the following command: 

    ```console
    node . --op getToDos
    ```

If your daemon app and web API run successfully, you should find the data returned by the web API endpoint `todos` variable, similar to the following JSON array, in your console window: 

```json
{
    id: 1,
    owner: '3e8....-db63-43a2-a767-5d7db...',
    description: 'Pick up grocery'
},
{
    id: 2,
    owner: 'c3cc....-c4ec-4531-a197-cb919ed.....',
    description: 'Finish invoice report'
},
{
    id: 3,
    owner: 'a35e....-3b8a-4632-8c4f-ffb840d.....',
    description: 'Water plants'
}
```

## Next steps

Learn how to [Use client certificate instead of a secret for authentication in your Node.js confidential app](how-to-web-app-node-use-certificate.md).
