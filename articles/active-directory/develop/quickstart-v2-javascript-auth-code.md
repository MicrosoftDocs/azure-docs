---
title: Sign in users in JavaScript single-page apps (SPA) with auth code | Azure
titleSuffix: Microsoft identity platform
description: Learn how a JavaScript app can call an API that requires access tokens using the Microsoft identity platform.
services: active-directory
author: hahamil
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 05/19/2020
ms.author: hahamil
ms.custom: aaddev, scenarios:getting-started, languages:JavaScript
#Customer intent: As an app developer, I want to learn how to get access tokens and refresh tokens by using the Microsoft identity platform endpoint so that my JavaScript app can sign in users of personal accounts, work accounts, and school accounts.
---

# Quickstart: Sign in users and get an access token in a JavaScript SPA using the auth code flow

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature might change before general availability (GA).

In this quickstart, you run a code sample that demonstrates how a JavaScript single-page application (SPA) can sign in users of personal accounts, work accounts, and school accounts by using the authorization code flow. The code sample also demonstrates obtaining an access token to call a web API, in this case the Microsoft Graph API. See [How the sample works](#how-the-sample-works) for an illustration.

This quickstart uses MSAL.js 2.0 with the authorization code flow. For a similar quickstart that uses MSAL.js 1.0 with the implicit flow, see [Quickstart: Sign in users in JavaScript single-page apps](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v2-javascript).

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
> 1. Sign in to the [Azure portal](https://portal.azure.com).
> 1. If your account gives you access to more than one tenant, select the account at the top right, and then set your portal session to the Azure Active Directory (Azure AD) tenant you want to use.
> 1. Select [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType/JavascriptSpaQuickstartPage/sourceType/docs).
> 1. Enter a name for your application.
> 1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
> 1. Select **Register**.
> 1. Go to the quickstart pane and follow the instructions to download and automatically configure your new application.
>
> ### Option 2 (Manual): Register and manually configure your application and code sample
>
> #### Step 1: Register your application
>
> 1. Sign in to the [Azure portal](https://portal.azure.com).
> 1. If your account gives you access to more than one tenant, select your account at the top right, and then set your portal session to the Azure AD tenant you want to use.
> 1. Select [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908).
> 1. Select **New registration**.
> 1. When the **Register an application** page appears, enter a name for your application.
> 1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
> 1. Select **Register**. On the app **Overview** page, note the **Application (client) ID** value for later use.
> 1. In the left pane of the registered application, select **Authentication**.
> 1. Under **Platform configurations**, select **Add a platform**. In the pane that opens select **Single-page application**.
> 1. Set the **Redirect URI** value to `http://localhost:3000/`.
> 1. Select **Configure**.

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 1: Configure your application in the Azure portal
> To make the code sample in this quickstart work, you need to add a `redirectUri` as `http://localhost:3000/`.
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
> In the *app* folder, open the *authConfig.js* file and update the `clientID`, `authority`, and `redirectUri` values in the `msalConfig` object.
>
> ```javascript
> // Config object to be passed to Msal on creation
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
> Modify the values in the `msalConfig` section as described here:
>
> - `Enter_the_Application_Id_Here` is the **Application (client) ID** for the application you registered.
> - `Enter_the_Cloud_Instance_Id_Here` is the instance of the Azure cloud. For the main or global Azure cloud, enter `https://login.microsoftonline.com/`. For **national** clouds (for example, China), see [National clouds](authentication-national-cloud.md).
> - `Enter_the_Tenant_info_here` is set to one of the following:
>   - If your application supports *accounts in this organizational directory*, replace this value with the **Tenant ID** or **Tenant name**. For example, `contoso.microsoft.com`.
>   - If your application supports *accounts in any organizational directory*, replace this value with `organizations`.
>   - If your application supports *accounts in any organizational directory and personal Microsoft accounts*, replace this value with `common`. **For this quickstart**, use `common`.
>   - To restrict support to *personal Microsoft accounts only*, replace this value with `consumers`.
> - `Enter_the_Redirect_Uri_Here` is `http://localhost:3000/`.
>
> The `authority` value in your *authConfig.js* should be similar to the following if you're using the main (global) Azure cloud:
>
> ```javascript
> authority: "https://login.microsoftonline.com/common",
> ```
>
> > [!TIP]
> > To find the values of **Application (client) ID**, **Directory (tenant) ID**, and **Supported account types**, go to the app registration's **Overview** page in the Azure portal.
>
> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Your app is configured and ready to run
> We have configured your project with values of your app's properties.

> [!div renderon="docs"]
>
> Then, still in the same folder, edit the *graphConfig.js* file and update the `graphMeEndpoint` and `graphMailEndpoint` values in the `apiConfig` object.
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
> `Enter_the_Graph_Endpoint_Here` is the endpoint that API calls will be made against. For the main (global) Microsoft Graph API service, enter `https://graph.microsoft.com/` (include the trailing forward-slash). For more information about Microsoft Graph on national clouds, see [National cloud deployment](https://docs.microsoft.com/graph/deployments).
>
> The `graphMeEndpoint` and `graphMailEndpoint` values in the *graphConfig.js* file should be similar to the following if you're using the main (global) Microsoft Graph API service:
>
> ```javascript
> graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
> graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages"
> ```
>
> #### Step 4: Run the project

Run the project with a web server by using Node.js:

1. To start the server, run the following commands from within the project directory:
    ```console
    npm install
    npm start
    ```
1. Browse to `http://localhost:3000/`.

1. Select **Sign In** to start the sign-in process and then call the Microsoft Graph API.

    The first time you sign in, you're prompted to provide your consent to allow the application to access your profile and sign you in. After you're signed in successfully, your user profile information should be displayed on the page.

## More information

### How the sample works

:::image type="content" source="media/quickstart-v2-javascript-auth-code/diagram-01-auth-code-flow.png" alt-text="Diagram showing the authorization code flow for a single-page application":::

### msal.js

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
> [Tutorial to sign in and call MS Graph >](https://docs.microsoft.com/azure/active-directory/develop/tutorial-v2-javascript-auth-code)
