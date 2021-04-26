---
title: "Quickstart: Sign in users in JavaScript single-page apps (SPA) with auth code | Azure"
titleSuffix: Microsoft identity platform
description: In this quickstart, learn how a JavaScript single-page application (SPA) can sign in users of personal accounts, work accounts, and school accounts by using the authorization code flow.
services: active-directory
author: hahamil
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 07/17/2020
ms.author: hahamil
ms.custom: aaddev, scenarios:getting-started, languages:JavaScript, devx-track-js
#Customer intent: As an app developer, I want to learn how to get access tokens and refresh tokens by using the Microsoft identity platform so that my JavaScript app can sign in users of personal accounts, work accounts, and school accounts.
---

# Quickstart: Sign in users and get an access token in a JavaScript SPA using the auth code flow with PKCE

In this quickstart, you download and run a code sample that demonstrates how a JavaScript single-page application (SPA) can sign in users and call Microsoft Graph using the authorization code flow with Proof Key for Code Exchange (PKCE). The code sample demonstrates how to get an access token to call the Microsoft Graph API or any web API.

See [How the sample works](#how-the-sample-works) for an illustration.

This quickstart uses MSAL.js v2 with the authorization code flow. For a similar quickstart that uses MSAL.js v1 with the implicit flow, see [Quickstart: Sign in users in JavaScript single-page apps](./quickstart-v2-javascript.md).

## Prerequisites

* Azure subscription - [Create an Azure subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/download) or another code editor

> [!div renderon="docs"]
> ## Register and download your quickstart application
> To start your quickstart application, use either of the following options.
>
> ### Option 1 (Express): Register and auto configure your app and then download your code sample
>
> 1. Go to the <a href="https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType/JavascriptSpaQuickstartPage/sourceType/docs" target="_blank">Azure portal - App registrations</a>.
> 1. Enter a name for your application.
> 1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
> 1. Select **Register**.
> 1. Go to the quickstart pane and follow the instructions to download and automatically configure your new application.
>
> ### Option 2 (Manual): Register and manually configure your application and code sample
>
> #### Step 1: Register your application
>
> 1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
> 1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant in which you want to register an application.
> 1. Search for and select **Azure Active Directory**.
> 1. Under **Manage**, select **App registrations** > **New registration**.
> 1. Enter a **Name** for your application. Users of your app might see this name, and you can change it later.
> 1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
> 1. Select **Register**. On the app **Overview** page, note the **Application (client) ID** value for later use.
> 1. Under **Manage**, select **Authentication**.
> 1. Under **Platform configurations**, select **Add a platform**. In the pane that opens select **Single-page application**.
> 1. Set the **Redirect URI** value to `http://localhost:3000/`.
> 1. Select **Configure**.

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 1: Configure your application in the Azure portal
> For the code sample in this quickstart to work, add a **Redirect URI** of `http://localhost:3000/`.
> > [!div renderon="portal" id="makechanges" class="nextstepaction"]
> > [Make these changes for me]()
>
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-javascript/green-check.png) Your application is configured with these attributes.

#### Step 2: Download the project

> [!div renderon="docs"]
> To run the project with a web server by using Node.js, [download the core project files](https://github.com/Azure-Samples/ms-identity-javascript-v2/archive/master.zip).

> [!div renderon="portal" class="sxs-lookup"]
> Run the project with a web server by using Node.js

> [!div renderon="portal" class="sxs-lookup" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/ms-identity-javascript-v2/archive/master.zip)

> [!div renderon="docs"]
> #### Step 3: Configure your JavaScript app
>
> In the *app* folder, open the *authConfig.js* file, and then update the `clientID`, `authority`, and `redirectUri` values in the `msalConfig` object.
>
> ```javascript
> // Config object to be passed to MSAL on creation
> const msalConfig = {
>   auth: {
>     clientId: "Enter_the_Application_Id_Here",
>     authority: "Enter_the_Cloud_Instance_Id_HereEnter_the_Tenant_Info_Here",
>     redirectUri: "Enter_the_Redirect_Uri_Here",
>   },
>   cache: {
>     cacheLocation: "sessionStorage", // This configures where your cache will be stored
>     storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
>   }
> };
> ```

> [!div renderon="portal" class="sxs-lookup"]
> > [!NOTE]
> > `Enter_the_Supported_Account_Info_Here`

> [!div renderon="docs"]
>
> Modify the values in the `msalConfig` section:
>
> - `Enter_the_Application_Id_Here` is the **Application (client) ID** for the application you registered.
>
>    To find the value of **Application (client) ID**, go to the app registration's **Overview** page in the Azure portal.
> - `Enter_the_Cloud_Instance_Id_Here` is the Azure cloud instance. For the main or global Azure cloud, enter `https://login.microsoftonline.com/`. For **national** clouds (for example, China), see [National clouds](authentication-national-cloud.md).
> - `Enter_the_Tenant_info_here` is one of the following:
>   - If your application supports *accounts in this organizational directory*, replace this value with the **Tenant ID** or **Tenant name**. For example, `contoso.microsoft.com`.
>
>    To find the value of the **Directory (tenant) ID**, go to the app registration's **Overview** page in the Azure portal.
>   - If your application supports *accounts in any organizational directory*, replace this value with `organizations`.
>   - If your application supports *accounts in any organizational directory and personal Microsoft accounts*, replace this value with `common`. **For this quickstart**, use `common`.
>   - To restrict support to *personal Microsoft accounts only*, replace this value with `consumers`.
>
>    To find the value of **Supported account types**, go to the app registration's **Overview** page in the Azure portal.
> - `Enter_the_Redirect_Uri_Here` is `http://localhost:3000/`.
>
> The `authority` value in your *authConfig.js* should be similar to the following if you're using the main (global) Azure cloud:
>
> ```javascript
> authority: "https://login.microsoftonline.com/common",
> ```
>

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Your app is configured and ready to run
>
> We have configured your project with values of your app's properties.

> [!div renderon="docs"]
>
> Next, open the *graphConfig.js* file to update the `graphMeEndpoint` and `graphMailEndpoint` values in the `apiConfig` object.
>
> ```javascript
>   // Add here the endpoints for MS Graph API services you would like to use.
>   const graphConfig = {
>     graphMeEndpoint: "Enter_the_Graph_Endpoint_Herev1.0/me",
>     graphMailEndpoint: "Enter_the_Graph_Endpoint_Herev1.0/me/messages"
>   };
>
>   // Add here scopes for access token to be used at MS Graph API endpoints.
>   const tokenRequest = {
>       scopes: ["Mail.Read"]
>   };
> ```
>
> [!div renderon="docs"]
>
> `Enter_the_Graph_Endpoint_Here` is the endpoint that API calls are made against. For the main (global) Microsoft Graph API service, enter `https://graph.microsoft.com/` (include the trailing forward-slash). For more information about Microsoft Graph on national clouds, see [National cloud deployment](/graph/deployments).
>
> If you're using the main (global) Microsoft Graph API service, the `graphMeEndpoint` and `graphMailEndpoint` values in the *graphConfig.js* file should be similar to the following:
>
> ```javascript
> graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
> graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages"
> ```
>
> #### Step 4: Run the project

Run the project with a web server by using Node.js.

1. To start the server, run the following commands from within the project directory:

    ```console
    npm install
    npm start
    ```

1. Go to `http://localhost:3000/`.

1. Select **Sign In** to start the sign-in process and then call the Microsoft Graph API.

    The first time you sign in, you're prompted to provide your consent to allow the application to access your profile and sign you in. After you're signed in successfully, your user profile information is displayed on the page.

## More information

### How the sample works

![Diagram showing the authorization code flow for a single-page application.](media/quickstart-v2-javascript-auth-code/diagram-01-auth-code-flow.png)

### MSAL.js

The MSAL.js library signs in users and requests the tokens that are used to access an API that's protected by Microsoft identity platform. The sample's *index.html* file contains a reference to the library:

```html
<script type="text/javascript" src="https://alcdn.msauth.net/browser/2.0.0-beta.0/js/msal-browser.js" integrity=
"sha384-r7Qxfs6PYHyfoBR6zG62DGzptfLBxnREThAlcJyEfzJ4dq5rqExc1Xj3TPFE/9TH" crossorigin="anonymous"></script>
```

If you have Node.js installed, you can download the latest version by using the Node.js Package Manager (npm):

```console
npm install @azure/msal-browser
```

## Next steps

For a more detailed step-by-step guide on building the application used in this quickstart, see the following tutorial:

> [!div class="nextstepaction"]
> [Tutorial to sign in and call MS Graph](./tutorial-v2-javascript-auth-code.md)
