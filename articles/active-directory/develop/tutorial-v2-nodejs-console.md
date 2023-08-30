---
title: "Tutorial: Call Microsoft Graph in a Node.js console daemon app"
description: In this tutorial, you build a console daemon app for calling Microsoft Graph.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.custom: devx-track-js
ms.topic: tutorial
ms.date: 12/12/2021
ms.author: cwerner
---

# Tutorial: Call the Microsoft Graph API in a Node.js console daemon app

In this tutorial, you build a console daemon app that calls Microsoft Graph API using its own identity. The daemon app you build uses the [Microsoft Authentication Library (MSAL) for Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node).

Follow the steps in this tutorial to:

> [!div class="checklist"]
> - Register the application in the Azure portal
> - Create a Node.js console daemon app project
> - Add authentication logic to your app
> - Add app registration details
> - Add a method to call a web API
> - Test the app

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor

## Register the application

First, complete the steps in [Register an application with the Microsoft identity platform](quickstart-register-app.md) to register your app.

Use the following settings for your app registration:

- Name: `NodeDaemonApp` (suggested)
- Supported account types: **Accounts in this organizational directory only**
- API permissions: **Microsoft APIs** > **Microsoft Graph** > **Application Permissions** > `User.Read.All`
- Client secret: `*********` (record this value for use in a later step - it's shown only once)

## Create the project


1. Start by creating a directory for this Node.js tutorial project. For example, *NodeDaemonApp*.

1. In your terminal, change into the directory you created (the project root), and then run the following commands:

    ```console
    npm init -y
    npm install --save dotenv yargs axios @azure/msal-node
    ```

1. Next, edit the *package.json* file in the project root and prefix the value of `main` with `bin/`, like this:

    ```json
    "main": "bin/index.js",
    ```

1. Now create the *bin* directory, and inside *bin*, add the following code to a new file named *index.js*:

    ```JavaScript
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
            case 'getUsers':

                try {
                    // here we get an access token
                    const authResponse = await auth.getToken(auth.tokenRequest);

                    // call the web API with the access token
                    const users = await fetch.callApi(auth.apiConfig.uri, authResponse.accessToken);

                    // display result
                    console.log(users);
                } catch (error) {
                    console.log(error);
                }

                break;
            default:
                console.log('Select a Graph operation first');
                break;
        }
    };

    main();
    ```

The *index.js* file you just created references two other node modules that you'll create next:

- *auth.js* - Uses MSAL Node for acquiring access tokens from the Microsoft identity platform.
- *fetch.js* - Requests data from the Microsoft Graph API by including access tokens (acquired in *auth.js*) in HTTP requests to the API.

At the end of the tutorial, your project's file and directory structure should look similar to this:

```
NodeDaemonApp/
├── bin
│   ├── auth.js
│   ├── fetch.js
│   ├── index.js
├── package.json
└── .env
```

## Add authentication logic

Inside the *bin* directory, add the following code to a new file named *auth.js*. The code in *auth.js* acquires an access token from the Microsoft identity platform for including in Microsoft Graph API requests.

```JavaScript
const msal = require('@azure/msal-node');

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: process.env.AAD_ENDPOINT + '/' + process.env.TENANT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    }
};

/**
 * With client credentials flows permissions need to be granted in the portal by a tenant administrator.
 * The scope is always in the format '<resource>/.default'. For more, visit:
 * https://learn.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow
 */
const tokenRequest = {
    scopes: [process.env.GRAPH_ENDPOINT + '/.default'],
};

const apiConfig = {
    uri: process.env.GRAPH_ENDPOINT + '/v1.0/users',
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
    getToken: getToken
};
```

In the code snippet above, we first create a configuration object (*msalConfig*) and pass it to initialize an MSAL [ConfidentialClientApplication](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md). Then we create a method for acquiring tokens via **client credentials** and finally expose this module to be accessed by *main.js*. The configuration parameters in this module are drawn from an environment file, which we will create in the next step.

## Add app registration details

Create an environment file to store the app registration details that will be used when acquiring tokens. To do so, create a file named *.env* inside the root folder of the sample (*NodeDaemonApp*), and add the following code:

```
# Credentials
TENANT_ID=Enter_the_Tenant_Id_Here
CLIENT_ID=Enter_the_Application_Id_Here
CLIENT_SECRET=Enter_the_Client_Secret_Here

# Endpoints
AAD_ENDPOINT=Enter_the_Cloud_Instance_Id_Here/
GRAPH_ENDPOINT=Enter_the_Graph_Endpoint_Here/
```

Fill in these details with the values you obtain from Azure app registration portal:

- `Enter_the_Tenant_Id_here` should be one of the following:
  - If your application supports *accounts in this organizational directory*, replace this value with the **Tenant ID** or **Tenant name**. For example, `contoso.microsoft.com`.
  - If your application supports *accounts in any organizational directory*, replace this value with `organizations`.
  - If your application supports *accounts in any organizational directory and personal Microsoft accounts*, replace this value with `common`.
  - To restrict support to *personal Microsoft accounts only*, replace this value with `consumers`.
- `Enter_the_Application_Id_Here`: The **Application (client) ID** of the application you registered.
- `Enter_the_Cloud_Instance_Id_Here`: The Azure cloud instance in which your application is registered.
  - For the main (or *global*) Azure cloud, enter `https://login.microsoftonline.com`.
  - For **national** clouds (for example, China), you can find appropriate values in [National clouds](authentication-national-cloud.md).
- `Enter_the_Graph_Endpoint_Here` is the instance of the Microsoft Graph API the application should communicate with.
  - For the **global** Microsoft Graph API endpoint, replace both instances of this string with `https://graph.microsoft.com`.
  - For endpoints in **national** cloud deployments, see [National cloud deployments](/graph/deployments) in the Microsoft Graph documentation.

## Add a method to call a web API

Inside the *bin* folder, create another file named *fetch.js* and add the following code for making REST calls to the Microsoft Graph API:

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

Here, the `callApi` method is used to make an HTTP `GET` request against a protected resource that requires an access token. The request then returns the content to the caller. This method adds the acquired token in the *HTTP Authorization header*. The protected resource here is the Microsoft Graph API [users endpoint](/graph/api/user-list) which displays the users in the tenant where this app is registered.

## Test the app

You've completed creation of the application and are now ready to test the app's functionality.

Start the Node.js console daemon app by running the following command from within the root of your project folder:

```console
node . --op getUsers
```

This should result in some JSON response from Microsoft Graph API and you should see an array of user objects in the console:

```console
You have selected: getUsers
request made to web API at: Fri Jan 22 2021 09:31:52 GMT-0800 (Pacific Standard Time)
{
    '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users',
    value: [
        {
            displayName: 'Adele Vance'
            givenName: 'Adele',
            jobTitle: 'Retail Manager',
            mail: 'AdeleV@msaltestingjs.onmicrosoft.com',
            mobilePhone: null,
            officeLocation: '18/2111',
            preferredLanguage: 'en-US',
            surname: 'Vance',
            userPrincipalName: 'AdeleV@msaltestingjs.onmicrosoft.com',
            id: 'a6a218a5-f5ae-462a-acd3-581af4bcca00'
        }
    ]
}
```
:::image type="content" source="media/tutorial-v2-nodejs-console/screenshot.png" alt-text="Command-line interface displaying Graph response":::

## How the application works

This application uses [OAuth 2.0 client credentials grant](./v2-oauth2-client-creds-grant-flow.md). This type of grant is commonly used for server-to-server interactions that must run in the background, without immediate interaction with a user. The credentials grant flow permits a web service (confidential client) to use its own credentials, instead of impersonating a user, to authenticate when calling another web service. The type of applications supported with this authentication model are usually **daemons** or **service accounts**.

The scope to request for a client credential flow is the name of the resource followed by `/.default`. This notation tells Azure Active Directory (Azure AD) to use the application-level permissions declared statically during application registration. Also, these API permissions must be granted by a **tenant administrator**.

## Next steps

If you'd like to dive deeper into Node.js daemon application development on the Microsoft identity platform, see our multi-part scenario series:

> [!div class="nextstepaction"]
> [Scenario: Daemon application](scenario-daemon-overview.md)
