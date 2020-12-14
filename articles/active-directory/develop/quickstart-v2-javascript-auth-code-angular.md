---
title: "Quickstart: Sign in users in JavaScript Angular single-page apps (SPA) with auth code | Azure"
titleSuffix: Microsoft identity platform
description: In this quickstart, learn how a JavaScript Angular single-page application (SPA) can sign in users of personal accounts, work accounts, and school accounts by using the authorization code flow.
services: active-directory
author: hahamil
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 12/14/2020
ms.author: jmantu
ms.custom: aaddev, scenarios:getting-started, languages:JavaScript, devx-track-js
#Customer intent: As an app developer, I want to learn how to get access tokens and refresh tokens by using the Microsoft identity platform endpoint so that my JavaScript Angular app can sign in users of personal accounts, work accounts, and school accounts.
---

# Quickstart: Sign in users and get an access token in a JavaScript Angular SPA using the auth code flow

In this quickstart, you download and run a code sample that demonstrates how a JavaScript Angular single-page application (SPA) can sign in users and call Microsoft Graph using the authorization code flow. The code sample demonstrates how to get an access token to call the Microsoft Graph API or any web API. 

See [How the sample works](#how-the-sample-works) for an illustration.

This quickstart uses MSAL.js 2.0 with the authorization code flow. For a similar quickstart that uses MSAL.js 1.0 with the implicit flow, see [Quickstart: Sign in users in JavaScript single-page apps](./quickstart-v2-javascript.md).

## Prerequisites

* Azure subscription - [Create an Azure subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/download) or another code editor

> [!div renderon="docs"]
> ## Register and download your quickstart application
> To start your quickstart application, use either of the following options.

<!--
##The azure portal dows not have an option to auto-configure the auth code flow. Only implicit flow.
## For the reason above, this section has been excluded.
> ### Option 1 (Express): Register and auto configure your app and then download your code sample
>
> 1. Sign in to the [Azure portal](https://portal.azure.com).
> 1. If your account gives you access to more than one tenant, select the account at the top right, and then set your portal session to the Azure Active Directory (Azure AD) tenant you want to use.
> 1. Select [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType/JavascriptSpaQuickstartPage/sourceType/docs).
> 1. Enter a name for your application.
> 1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
> 1. Select **Register**.
> 1. Go to the quickstart pane and follow the instructions to download and automatically configure your new application.
-->
> ### Option 1 (Manual): Register and manually configure your application and code sample
>
> #### Step 1: Register your application
>
> 1. Sign in to the [Azure portal](https://portal.azure.com).
> 1. If your account gives you access to more than one tenant, select your account at the top right, and then set your portal session to the Azure AD tenant you want to use.
> 1. Select [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908).
> 1. Select **New registration**.
> 1. When the **Register an application** page appears, enter a name for your application.
> 1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
> 1. Under **Redirect URI** select `Single-page application (SPA)`.
> 1. Set the **Redirect URI** value to `http://localhost:4200/`. This is the default port NodeJS will listen on your local machine. We’ll return the authentication response to this URI after successfully authenticating the user 
> 1. Select **Register**. On the app **Overview** page, note the **Application (client) ID** value for later use.
> 1. In the left pane of the registered application, select **Authentication**.
> 1. Under **Platform Configurations** expand **Single-page application**.
> 1. Confirm that under **Grant types** ![Already configured](media/quickstart-v2-javascript/green-check.png)Your Redirect URI is eligible for the Authorization Code Flow with PKCE.

#### Step 2: Download the project

> [!div renderon="docs"]
> To run the project with a web server by using Node.js, [download the core project files](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa/archive/main.zip).

> [!div renderon="portal" class="sxs-lookup"]
> Run the project with a web server by using Node.js

> [!div renderon="portal" class="sxs-lookup" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa/archive/main.zip)

> [!div renderon="docs"]
> #### Step 3: Configure your JavaScript app
>
> In the *app* folder, open the *source* folder then open the *app.module.ts* file and update the `clientID`, `authority`, and `redirectUri` values in the `auth` object.
>
> ```javascript
> // Config object to be passed to Msal on creation
> export function MSALInstanceFactory(): IPublicClientApplication {
>   return new PublicClientApplication({
>     auth: {
>       clientId: 'Enter_the_Application_Id_Here',
>       authority: 'Enter_the_Cloud_Instance_Id_HereEnter_the_Tenant_Info_Here',
>       redirectUri: 'Enter_the_Redirect_Uri_Here'
>     },
>     cache: {
>       cacheLocation: BrowserCacheLocation.LocalStorage,
>       storeAuthStateInCookie: isIE, // set to true for IE 11
>     },
>   });
> }
> ```

> [!div renderon="portal" class="sxs-lookup"]
> > [!NOTE]
> > `Enter_the_Supported_Account_Info_Here`

> [!div renderon="docs"]
>
> Modify the values in the `auth` section as described here:
>
> - `Enter_the_Application_Id_Here` is the **Application (client) ID** for the application you registered.
> - `Enter_the_Cloud_Instance_Id_Here` is the instance of the Azure cloud. For the main or global Azure cloud, enter `https://login.microsoftonline.com/`. For **national** clouds (for example, China), see [National clouds](authentication-national-cloud.md).
> - `Enter_the_Tenant_info_here` is set to one of the following:
>   - If your application supports *accounts in this organizational directory*, replace this value with the **Tenant ID** or **Tenant name**. For example, `contoso.microsoft.com`.
>   - If your application supports *accounts in any organizational directory*, replace this value with `organizations`.
>   - If your application supports *accounts in any organizational directory and personal Microsoft accounts*, replace this value with `common`. **For this quickstart**, use `common`.
>   - To restrict support to *personal Microsoft accounts only*, replace this value with `consumers`.
> - `Enter_the_Redirect_Uri_Here` is `http://localhost:4200/`.
>
> The `authority` value in your *app.module.ts* should be similar to the following if you're using the main (global) Azure cloud:
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
> Scroll down in the same file and update the `graphMeEndpoint`. 
> - Replace the string `Enter_the_Graph_Endpoint_Herev1.0/me` with `https://graph.microsoft.com/v1.0/me`
> - `Enter_the_Graph_Endpoint_Herev1.0/me` is the endpoint that API calls will be made against. For the main (global) Microsoft Graph API service, enter `https://graph.microsoft.com/` (include the trailing forward-slash). For more information, see the [documentation](https://docs.microsoft.com/en-us/graph/deployments))

>
> ```javascript
> export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
>   const protectedResourceMap = new Map<string, Array<string>>();
>   protectedResourceMap.set('Enter_the_Graph_Endpoint_Herev1.0/me', ['user.read']);
>
>   return {
>     interactionType: InteractionType.Redirect,
>     protectedResourceMap
>   };
> }
> ```
>
>
> #### Step 4: Run the project

Run the project with a web server by using Node.js:

1. To start the server, run the following commands from within the project directory:
    ```console
    npm install
    npm start
    ```
1. Browse to `http://localhost:4200/`.

1. Select **Login** to start the sign-in process and then call the Microsoft Graph API.

    The first time you sign in, you're prompted to provide your consent to allow the application to access your profile and sign you in. After you're signed in successfully, click the **Profile** button to display your user information on the page.

## More information

### How the sample works

![Diagram showing the authorization code flow for a single-page application.](media/quickstart-v2-javascript-auth-code/diagram-01-auth-code-flow.png)

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
> [Tutorial to sign in and call MS Graph](./tutorial-v2-javascript-auth-code.md)
