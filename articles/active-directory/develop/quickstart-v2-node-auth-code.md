---
title: "Quickstart: Add Authentication to a Node web app with MSAL Node | Azure"
titleSuffix: Microsoft identity platform
description: In this quickstart, you learn how to implement authentication with a Node.js web app and MSAL Node.
services: active-directory
author: amikuma
manager: saeeda

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 10/1/2020
ms.author: amikuma
ms.custom: aaddev, scenarios:getting-started, languages:js, devx-track-js
#Customer intent: As an application developer, I want to know how to set up authentication in a web application built using Node.js.
---

# Quickstart: Sign in users and get an access token in a Node Web App using the auth code flow

In this quickstart, you run a code sample that demonstrates how a Node.js web app can sign in users of personal accounts, work accounts, and school accounts by using the authorization code flow. The code sample also demonstrates obtaining an access token to call a web API, in this case the Microsoft Graph API. See [How the sample works](#how-the-sample-works) for an illustration.

This quickstart uses MSAL Node with the authorization code flow.

> [!NOTE]
> This feature is in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

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
> 1. Select [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType/NodeWebAppQuickstartPage/sourceType/docs).
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
> To run the project with a web server by using Node.js, [download the core project files](https://github.com/Azure-Samples/ms-identity-node/archive/main.zip).

> [!div renderon="portal" class="sxs-lookup"]
> Run the project with a web server by using Node.js

> [!div renderon="portal" class="sxs-lookup" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/ms-identity-node/archive/master.zip)

> [!div renderon="docs"]
> #### Step 3: Configure your Node app
>
> In the *app* folder, open the *authConfig.js* file and update the `clientID`, `authority`, and `redirectUri` values in the `config` object.
>
>```javascript
>const config = {
>    auth: {
>        clientId: "Enter_the_Application_Id_Here",
>        authority: "Enter_the_Cloud_Instance_Id_HereEnter_the_Tenant_Info_Here",
>        clientSecret: ""
>    },
>    system: {
>        loggerOptions: {
>            loggerCallback(loglevel, message, containsPii) {
>                console.log(message);
>            },
>            piiLoggingEnabled: false,
>            logLevel: msal.LogLevel.Verbose,
>        }
>    }
>};
>
> ```

> [!div renderon="portal" class="sxs-lookup"]
> > [!NOTE]
> > `Enter_the_Supported_Account_Info_Here`

> [!div renderon="docs"]
>
> Modify the values in the `config` section as described here:
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
>
> [!div renderon="docs"]
>
> #### Step 4: Run the project

Run the project by using Node.js:

1. To start the server, run the following commands from within the project directory:
    ```console
    npm install
    npm start
    ```
1. Browse to `http://localhost:3000/`.

1. Select **Sign In** to start the sign-in process.

    The first time you sign in, you're prompted to provide your consent to allow the application to access your profile and sign you in. After you're signed in successfully, you will see a log message in the command line.

## More information

### How the sample works

The sample, when run, hosts a web server on localhost, port 3000.  When a web browser accesses this site, the sample immediately redirects the user to a Microsoft authentication page.  Because of this, the sample does not contain any *html* or display elements.  Authentication success or failure is shown at the command line.

### MSAL Node

The MSAL Node library signs in users and requests the tokens that are used to access an API that's protected by Microsoft identity platform. You can download the latest version by using the Node.js Package Manager (npm):

```console
npm install @azure/msal-browser
```

> [!div class="nextstepaction"]
> [Extend a web app to call MS Graph >](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/standalone-samples/on-behalf-of/web-app/readme.md)
