---
title: "Tutorial: Sign-in users in a Node.js & Express web app | Azure"
titleSuffix: Microsoft identity platform
description: In this tutorial, you add support for signing-in users in a web app.
services: active-directory
author: derisen
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.date: 02/17/2021
ms.author: v-doeris
---

# Tutorial: Sign-in users in a Node.js & Express web app

In this tutorial, you build a web app that signs-in users. The web app you build uses the [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node).

Follow the steps in this tutorial to:

> [!div class="checklist"]
> - Register the application in the Azure portal
> - Create an Express web app project
> - Install the authentication library packages
> - Add app registration details
> - Add code for user login
> - Test the app

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor

## Register the application

First, complete the steps in [Register an application with the Microsoft identity platform](quickstart-register-app.md) to register your app.

Use the following settings for your app registration:

- Name: `ExpressWebApp` (suggested)
- Supported account types: **Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**
- Platform type: **Web**
- Redirect URI: `http://localhost:3000/redirect`
- Client secret: `*********` (record this value for use in a later step - it's shown only once)

## Create the project

Create a folder to host your application, for example *ExpressWebApp*.

1. First, change to your project directory in your terminal and then run the following `npm` commands:

```console
    npm init -y
    npm install --save express
```

2. Next, create file named *index.js* and add the following code:

```JavaScript
    const express = require("express");
    const msal = require('@azure/msal-node');

    const SERVER_PORT = process.env.PORT || 3000;

    // Create Express App and Routes
    const app = express();

    app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`))
```

You now have a simple web server running on port 3000. The file and folder structure of your project should look similar to the following:

```
ExpressWebApp/
├── index.js
└── package.json
```

## Install the auth library

Locate the root of your project directory in a terminal and install the MSAL Node package via NPM.

```console
    npm install --save @azure/msal-node
```

## Add app registration details

In the *index.js* file you've created earlier, add the following code:

```JavaScript
    // Before running the sample, you will need to replace the values in the config,
    // including the clientSecret
    const config = {
        auth: {
            clientId: "Enter_the_Application_Id",
            authority: "Enter_the_Cloud_Instance_Id_Here/Enter_the_Tenant_Id_here",
            clientSecret: "Enter_the_Client_secret"
        },
        system: {
            loggerOptions: {
                loggerCallback(loglevel, message, containsPii) {
                    console.log(message);
                },
                piiLoggingEnabled: false,
                logLevel: msal.LogLevel.Verbose,
            }
        }
    };
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
- `Enter_the_Client_secret`: Replace this value with the client secret you created earlier. To generate a new key, use **Certificates & secrets** in the app registration settings in the Azure portal.

> [!WARNING]
> Any plaintext secret in source code poses an increased security risk. This article uses a plaintext client secret for simplicity only. Use [certificate credentials](active-directory-certificate-credentials.md) instead of client secrets in your confidential client applications, especially those apps you intend to deploy to production.

## Add code for user login

In the *index.js* file you've created earlier, add the following code:

```JavaScript
    // Create msal application object
    const cca = new msal.ConfidentialClientApplication(config);

    app.get('/', (req, res) => {
        const authCodeUrlParameters = {
            scopes: ["user.read"],
            redirectUri: "http://localhost:3000/redirect",
        };

        // get url to sign user in and consent to scopes needed for application
        cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
            res.redirect(response);
        }).catch((error) => console.log(JSON.stringify(error)));
    });

    app.get('/redirect', (req, res) => {
        const tokenRequest = {
            code: req.query.code,
            scopes: ["user.read"],
            redirectUri: "http://localhost:3000/redirect",
        };

        cca.acquireTokenByCode(tokenRequest).then((response) => {
            console.log("\nResponse: \n:", response);
            res.sendStatus(200);
        }).catch((error) => {
            console.log(error);
            res.status(500).send(error);
        });
    });
```

## Test sign in

You've completed creation of the application and are now ready to test the app's functionality.

1. Start the Node.js console app by running the following command from within the root of your project folder:

```console
   node index.js
```

2. Open a browser window and navigate to `http://localhost:3000`. You should see a sign-in screen:

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/sign-in-screen.png" alt-text="Azure AD sign-in screen displaying":::

3. Once you enter your credentials, you should see a consent screen asking you to approve the permissions for the app.

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/consent-screen.png" alt-text="Azure AD consent screen displaying":::

## How the application works

In this tutorial, you initialized an MSAL Node [ConfidentialClientApplication](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md) object by passing it a configuration object (*msalConfig*) that contains parameters obtained from your Azure AD app registration on Azure portal. The web app you created uses the [OAuth 2.0 Authorization code grant flow](./v2-oauth2-auth-code-flow.md) to sign-in users and obtain ID and access tokens.

## Next steps

If you'd like to dive deeper into Node.js & Express web application development on the Microsoft identity platform, see our multi-part scenario series:

> [!div class="nextstepaction"]
> [Scenario: Web app that signs in users](scenario-web-app-sign-user-overview.md)