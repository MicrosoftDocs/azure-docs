---
title: "Tutorial: Sign in users in a Node.js & Express web app"
description: In this tutorial, you add support for signing-in users in a web app.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.date: 11/09/2022
ms.author: cwerner
ms.custom: engagement-fy23, devx-track-js
---

# Tutorial: Sign in users and acquire a token for Microsoft Graph in a Node.js & Express web app

In this tutorial, you build a web app that signs-in users and acquires access tokens for calling Microsoft Graph. The web app you build uses the [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node).

Follow the steps in this tutorial to:

> [!div class="checklist"]
> - Register the application in the Azure portal
> - Create an Express web app project
> - Install the authentication library packages
> - Add app registration details
> - Add code for user login
> - Test the app

For more information, see the [sample code](https://github.com/Azure-Samples/ms-identity-node) that shows how to use MSAL Node to sign in, sign out and acquire an access token for a protected resource such as Microsoft Graph.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor

## Register the application

First, complete the steps in [Register an application with the Microsoft identity platform](quickstart-register-app.md) to register your app.

Use the following settings for your app registration:

- Name: `ExpressWebApp` (suggested)
- Supported account types: **Accounts in this organizational directory only**
- Platform type: **Web**
- Redirect URI: `http://localhost:3000/auth/redirect`
- Client secret: `*********` (record this value for use in a later step - it's shown only once)

## Create the project

Use the [Express application generator tool](https://expressjs.com/en/starter/generator.html) to create an application skeleton.

1. First, install the [express-generator](https://www.npmjs.com/package/express-generator) package:

```console
    npm install -g express-generator
```

2. Then, create an application skeleton as follows: 
 
```console
    express --view=hbs /ExpressWebApp && cd /ExpressWebApp
    npm install
```

You now have a simple Express web app. The file and folder structure of your project should look similar to the following folder structure:

```
ExpressWebApp/
├── bin/
|    └── wwww
├── public/
|    ├── images/
|    ├── javascript/
|    └── stylesheets/
|        └── style.css
├── routes/
|    ├── index.js
|    └── users.js
├── views/
|    ├── error.hbs
|    ├── index.hbs
|    └── layout.hbs
├── app.js
└── package.json
```

## Install the auth library

Locate the root of your project directory in a terminal and install the MSAL Node package via npm.

```console
    npm install --save @azure/msal-node
```

## Install other dependencies

The web app sample in this tutorial uses the [express-session](https://www.npmjs.com/package/express-session) package for session management, [dotenv](https://www.npmjs.com/package/dotenv) package for reading environment parameters during development, and [axios](https://www.npmjs.com/package/axios) for making network calls to the Microsoft Graph API. Install these via npm:

```console
    npm install --save express-session dotenv axios
```

## Add app registration details

1. Create an *.env.dev* file in the root of your project folder. Then add the following code:

:::code language="text" source="~/ms-identity-node/App/.env.dev":::

Fill in these details with the values you obtain from Azure app registration portal:

- `Enter_the_Cloud_Instance_Id_Here`: The Azure cloud instance in which your application is registered.
  - For the main (or *global*) Azure cloud, enter `https://login.microsoftonline.com/` (include the trailing forward-slash).
  - For **national** clouds (for example, China), you can find appropriate values in [National clouds](authentication-national-cloud.md).
- `Enter_the_Tenant_Info_here` should be one of the following parameters:
  - If your application supports *accounts in this organizational directory*, replace this value with the **Tenant ID** or **Tenant name**. For example, `contoso.microsoft.com`.
  - If your application supports *accounts in any organizational directory*, replace this value with `organizations`.
  - If your application supports *accounts in any organizational directory and personal Microsoft accounts*, replace this value with `common`.
  - To restrict support to *personal Microsoft accounts only*, replace this value with `consumers`.
- `Enter_the_Application_Id_Here`: The **Application (client) ID** of the application you registered.
- `Enter_the_Client_secret`: Replace this value with the client secret you created earlier. To generate a new key, use **Certificates & secrets** in the app registration settings in the Azure portal.

> [!WARNING]
> Any plaintext secret in source code poses an increased security risk. This article uses a plaintext client secret for simplicity only. Use [certificate credentials](./certificate-credentials.md) instead of client secrets in your confidential client applications, especially those apps you intend to deploy to production.

- `Enter_the_Graph_Endpoint_Here`: The Microsoft Graph API cloud instance that your app will call. For the main (global) Microsoft Graph API service, enter `https://graph.microsoft.com/` (include the trailing forward-slash).
- `Enter_the_Express_Session_Secret_Here` the secret used to sign the Express session cookie. Choose a random string of characters to replace this string with, such as your client secret.


2. Next, create a file named *authConfig.js* in the root of your project for reading in these parameters. Once created, add the following code there:

:::code language="js" source="~/ms-identity-node/App/authConfig.js":::

## Add code for user sign-in and token acquisition

1. Create a new folder named *auth*, and add a new file named *AuthProvider.js* under it. This will contain the **AuthProvider** class, which encapsulates the necessary authentication logic using MSAL Node. Add the following code there:

:::code language="js" source="~/ms-identity-node/App/auth/AuthProvider.js":::

1. Next, create a new file named *auth.js* under the *routes* folder and add the following code there:

:::code language="js" source="~/ms-identity-node/App/routes/auth.js":::

2. Update the *index.js* route by replacing the existing code with the following code snippet:

:::code language="js" source="~/ms-identity-node/App/routes/index.js":::

3. Finally, update the *users.js* route by replacing the existing code with the following code snippet:

:::code language="js" source="~/ms-identity-node/App/routes/users.js":::

## Add code for calling the Microsoft Graph API

Create a file named *fetch.js* in the root of your project and add the following code:

:::code language="js" source="~/ms-identity-node/App/fetch.js":::

## Add views for displaying data

1. In the *views* folder, update the *index.hbs* file by replacing the existing code with the following:

:::code language="hbs" source="~/ms-identity-node/App/views/index.hbs":::

2. Still in the same folder, create another file named *id.hbs* for displaying the contents of user's ID token:

:::code language="hbs" source="~/ms-identity-node/App/views/id.hbs":::

3. Finally, create another file named *profile.hbs* for displaying the result of the call made to Microsoft Graph:

:::code language="hbs" source="~/ms-identity-node/App/views/profile.hbs":::

## Register routers and add state management

In the *app.js* file in the root of the project folder, register the routes you've created earlier and add session support for tracking authentication state using the **express-session** package. Replace the existing code there with the following code snippet:

:::code language="js" source="~/ms-identity-node/App/app.js":::

## Test sign in and call Microsoft Graph

You've completed creation of the application and are now ready to test the app's functionality.

1. Start the Node.js console app by running the following command from within the root of your project folder:

```console
   npm start
```

2. Open a browser window and navigate to `http://localhost:3000`. You should see a welcome page:

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/welcome-screen.png" alt-text="Web app welcome page displaying":::

3. Select **Sign in** link. You should see the Microsoft Entra sign-in screen:

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/sign-in-screen.png" alt-text="Microsoft Entra sign-in screen displaying":::

4. Once you enter your credentials, you should see a consent screen asking you to approve the permissions for the app.

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/consent-screen.png" alt-text="Microsoft Entra consent screen displaying":::

5. Once you consent, you should be redirected back to application home page. 

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/post-sign-in-screen.png" alt-text="Web app welcome page after sign-in displaying":::

6. Select the **View ID Token** link for displaying the contents of the signed-in user's ID token.

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/id-token-screen.png" alt-text="User ID token screen displaying":::

7. Go back to the home page, and select the **Acquire an access token and call the Microsoft Graph API** link. Once you do, you should see the response from Microsoft Graph /me endpoint for the signed-in user.

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/graph-call-screen.png" alt-text="Graph call screen displaying":::

8. Go back to the home page, and select the **Sign out** link. You should see the Microsoft Entra sign-out screen.

:::image type="content" source="media/tutorial-v2-nodejs-webapp-msal/sign-out-screen.png" alt-text="Microsoft Entra sign-out screen displaying":::

## How the application works

In this tutorial, you instantiated an MSAL Node [ConfidentialClientApplication](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md) object by passing it a configuration object (*msalConfig*) that contains parameters obtained from your Microsoft Entra app registration on Azure portal. The web app you created uses the [OpenID Connect protocol](./v2-protocols-oidc.md) to sign-in users and the [OAuth 2.0 authorization code flow](./v2-oauth2-auth-code-flow.md) to obtain access tokens.

## Next steps

If you'd like to dive deeper into Node.js & Express web application development on the Microsoft identity platform, see our multi-part scenario series:

> [!div class="nextstepaction"]
> [Scenario: Web app that signs in users](scenario-web-app-sign-user-overview.md)
