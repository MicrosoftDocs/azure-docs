---
title: "Quickstart: Sign in users in JavaScript single-page apps"
description: In this quickstart, you learn how a JavaScript app can call an API that requires access tokens issued by the Microsoft identity platform.
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 04/11/2019
ms.author: owenrichards
ms.custom: aaddev, identityplatformtop40, "scenarios:getting-started", "languages:JavaScript", devx-track-js, mode-api
#Customer intent: As an app developer, I want to learn how to get access tokens by using the Microsoft identity platform so that my JavaScript app can sign in users of personal accounts, work accounts, and school accounts.
---

# Quickstart: Sign in users and get an access token in a JavaScript SPA

In this quickstart, you download and run a code sample that demonstrates how a JavaScript single-page application (SPA) can sign in users and call Microsoft Graph. The code sample also demonstrates how to get an access token to call the Microsoft Graph API or any web API.

See [How the sample works](#how-the-sample-works) for an illustration.

## Prerequisites

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/download) (to edit project files)

> [!div renderon="docs"]
> ## Register and download your quickstart application
> To start your quickstart application, use either of the following options.
>
> ### Option 1 (Express): Register and auto configure your app and then download your code sample
>
> 1. Sign in to the <a href="https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType/JavascriptSpaQuickstartPage/sourceType/docs" target="_blank">Azure portal - App registrations</a> quickstart experience.
> 1. Enter a name for your application.
> 1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
> 1. Select **Register**.
> 1. Follow the instructions to download and automatically configure your new application.
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
> 1. This quickstart requires the [Implicit grant flow](v2-oauth2-implicit-grant-flow.md) to be enabled. Under **Manage**, select **Authentication**.
> 1. Under **Platform Configurations** > **Add a platform**. Select **Web**.
> 1. Set the **Redirect URI** value to `http://localhost:3000/`.
> 1. Select **Access Tokens** and **ID Tokens** under the **Implicit grant and hybrid flows**  .
> 1. Select **Configure**.

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 1: Configure your application in the Azure portal
> For the code sample in this quickstart to work, add a **Redirect URI** of `http://localhost:3000/` and enable **Implicit grant**.
> > [!div renderon="portal" id="makechanges" class="nextstepaction"]
> > [Make these changes for me]()
>
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-javascript/green-check.png) Your application is configured with these attributes.

#### Step 2: Download the project

> [!div renderon="docs"]
> To run the project with a web server by using Node.js, [download the core project files](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/quickstart.zip).

> [!div renderon="portal" class="sxs-lookup"]
> Run the project with a web server by using Node.js

> [!div renderon="portal" id="autoupdate" class="sxs-lookup nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/quickstart.zip)

> [!div renderon="docs"]
> #### Step 3: Configure your JavaScript app
>
> In the *JavaScriptSPA* folder, edit *authConfig.js*, and set the `clientID`, `authority` and `redirectUri` values under `msalConfig`.
>
> ```javascript
>
>  // Config object to be passed to Msal on creation
>  const msalConfig = {
>    auth: {
>      clientId: "Enter_the_Application_Id_Here",
>      authority: "Enter_the_Cloud_Instance_Id_Here/Enter_the_Tenant_Info_Here",
>      redirectUri: "Enter_the_Redirect_Uri_Here",
>    },
>    cache: {
>      cacheLocation: "sessionStorage", // This configures where your cache will be stored
>      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
>    }
>  };
>
>```

> [!div class="sxs-lookup" renderon="portal"]
> > [!NOTE]
> > `Enter_the_Supported_Account_Info_Here`

> [!div renderon="docs"]
>
> Where:
> - `Enter_the_Application_Id_Here` is the **Application (client) ID** for the application you registered.
>
>    To find the value of **Application (client) ID**, go to the app's **Overview** page in the Azure portal.
> - `Enter_the_Cloud_Instance_Id_Here` is the instance of the Azure cloud. For the main or global Azure cloud, simply enter `https://login.microsoftonline.com/`. For **national** clouds (for example, China), see [National clouds](./authentication-national-cloud.md).
> - `Enter_the_Tenant_info_here` is set to one of the following options:
>    - If your application supports *accounts in this organizational directory*, replace this value with the **Tenant ID** or **Tenant name** (for example, `contoso.microsoft.com`).
>
>    To find the value of the **Directory (tenant) ID**, go to the app registration's **Overview** page in the Azure portal.
>    - If your application supports *accounts in any organizational directory*, replace this value with `organizations`.
>    - If your application supports *accounts in any organizational directory and personal Microsoft accounts*, replace this value with `common`. To restrict support to *personal Microsoft accounts only*, replace this value with `consumers`.
>
>    To find the value of **Supported account types**, go to the app registration's **Overview** page in the Azure portal.
> - `Enter_the_Redirect_Uri_Here` is `http://localhost:3000/`.
>
> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Your app is configured and ready to run
> We have configured your project with values of your app's properties.

> [!div renderon="docs"]
>
> Then, still in the same folder, edit *graphConfig.js* file to set the `graphMeEndpoint` and `graphMeEndpoint` for the `apiConfig` object.
> ```javascript
>   // Add here the endpoints for MS Graph API services you would like to use.
>   const graphConfig = {
>     graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me",
>     graphMailEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me/messages"
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
> Where:
> - *\<Enter_the_Graph_Endpoint_Here>* is the endpoint that API calls will be made against. For the main or global Microsoft Graph API service, simply enter `https://graph.microsoft.com/`. For more information, see [National cloud deployment](/graph/deployments)
>
> #### Step 4: Run the project

Run the project with a web server by using [Node.js](https://nodejs.org/en/download/):

1. To start the server, run the following command from the project directory:
    ```cmd
    npm install
    npm start
    ```
1. Open a web browser and go to `http://localhost:3000/`.

1. Select **Sign In** to start the sign-in, and then call Microsoft Graph API.

After the browser loads the application, select **Sign In**. The first time that you sign in, you're prompted to provide your consent to allow the application to access your profile and to sign you in. After you're signed in successfully, your user profile information should be displayed on the page.

## More information

### How the sample works

![How the sample JavaScript SPA works: 1. The SPA initiates sign in. 2. The SPA acquires an ID token from the Microsoft identity platform. 3. The SPA calls acquire token. 4. The Microsoft identity platform returns an Access token to the SPA. 5. The SPA makes and HTTP GET request with the Access Token to the Microsoft Graph API. 6. The Graph API returns an HTTP response to the SPA.](media/quickstart-v2-javascript/javascriptspa-intro.svg)

### msal.js

The MSAL library signs in users and requests the tokens that are used to access an API that's protected by Microsoft identity platform. The quickstart *index.html* file contains a reference to the library:

```html
<script type="text/javascript" src="https://alcdn.msftauth.net/lib/1.2.1/js/msal.js" integrity="sha384-9TV1245fz+BaI+VvCjMYL0YDMElLBwNS84v3mY57pXNOt6xcUYch2QLImaTahcOP" crossorigin="anonymous"></script>
```

You can replace the preceding version with the latest released version under [MSAL.js releases](https://github.com/AzureAD/microsoft-authentication-library-for-js/releases).

Alternatively, if you have Node.js installed, you can download the latest version through Node.js Package Manager (npm):

```cmd
npm install msal
```

### MSAL initialization

The quickstart code also shows how to initialize the MSAL library:

```javascript
  // Config object to be passed to Msal on creation
  const msalConfig = {
    auth: {
      clientId: "75d84e7a-40bx-f0a2-91b9-0c82d4c556aa", // this is a fake id
      authority: "https://login.microsoftonline.com/common",
      redirectUri: "http://localhost:3000/",
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };

const myMSALObj = new Msal.UserAgentApplication(msalConfig);
```

|Where  | Description |
|---------|---------|
|`clientId`     | The application ID of the application that's registered in the Azure portal.|
|`authority`    | (Optional) The authority URL that supports account types, as described previously in the configuration section. The default authority is `https://login.microsoftonline.com/common`. |
|`redirectUri`     | The application registration's configured reply/redirectUri. In this case, `http://localhost:3000/`. |
|`cacheLocation`  | (Optional) Sets the browser storage for the auth state. The default is sessionStorage.   |
|`storeAuthStateInCookie`  | (Optional) The library that stores the authentication request state that's required for validation of the authentication flows in the browser cookies. This cookie is set for IE and Edge browsers to mitigate certain [known issues](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser#issues). |

For more information about available configurable options, see [Initialize client applications](msal-js-initializing-client-applications.md).

### Sign in users

The following code snippet shows how to sign in users:

```javascript
// Add scopes for the id token to be used at Microsoft identity platform endpoints.
const loginRequest = {
    scopes: ["openid", "profile", "User.Read"],
};

myMSALObj.loginPopup(loginRequest)
    .then((loginResponse) => {
    //Login Success callback code here
}).catch(function (error) {
    console.log(error);
});
```

|Where  | Description |
|---------|---------|
| `scopes`   | (Optional) Contains scopes that are being requested for user consent at sign-in time. For example, `[ "user.read" ]` for Microsoft Graph or `[ "<Application ID URL>/scope" ]` for custom web APIs (that is, `api://<Application ID>/access_as_user`). |

Alternatively, you might want to use the `loginRedirect` method to redirect the current page to the sign-in page instead of a pop-up window.

### Request tokens

MSAL uses three methods to acquire tokens: `acquireTokenRedirect`, `acquireTokenPopup`, and `acquireTokenSilent`

#### Get a user token silently

The `acquireTokenSilent` method handles token acquisitions and renewal without any user interaction. After the `loginRedirect` or `loginPopup` method is executed for the first time, `acquireTokenSilent` is the method commonly used to obtain tokens that are used to access protected resources for subsequent calls. Calls to request or renew tokens are made silently.

```javascript

const tokenRequest = {
    scopes: ["Mail.Read"]
};

myMSALObj.acquireTokenSilent(tokenRequest)
    .then((tokenResponse) => {
        // Callback code here
        console.log(tokenResponse.accessToken);
    }).catch((error) => {
        console.log(error);
    });
```

|Where  | Description |
|---------|---------|
| `scopes`   | Contains scopes being requested to be returned in the access token for API. For example, `[ "mail.read" ]` for Microsoft Graph or `[ "<Application ID URL>/scope" ]` for custom web APIs (that is, `api://<Application ID>/access_as_user`).|

#### Get a user token interactively

There are situations where you force users to interact with the Microsoft identity platform. For example:
* Users might need to reenter their credentials because their password has expired.
* Your application is requesting access to additional resource scopes that the user needs to consent to.
* Two-factor authentication is required.

The usual recommended pattern for most applications is to call `acquireTokenSilent` first, then catch the exception, and then call `acquireTokenPopup` (or `acquireTokenRedirect`) to start an interactive request.

Calling the `acquireTokenPopup` results in a pop-up window for signing in. (Or `acquireTokenRedirect` results in redirecting users to the Microsoft identity platform). In that window, users need to interact by confirming their credentials, giving the consent to the required resource, or completing the two-factor authentication.

```javascript
// Add here scopes for access token to be used at MS Graph API endpoints.
const tokenRequest = {
    scopes: ["Mail.Read"]
};

myMSALObj.acquireTokenPopup(requestObj)
    .then((tokenResponse) => {
        // Callback code here
        console.log(tokenResponse.accessToken);
    }).catch((error) => {
        console.log(error);
    });
```

> [!NOTE]
> This quickstart uses the `loginRedirect` and `acquireTokenRedirect` methods with Microsoft Internet Explorer, because of a [known issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser#issues) related to the handling of pop-up windows by Internet Explorer.

## Next steps

For a more detailed step-by-step guide on building the application for this quickstart, see:

> [!div class="nextstepaction"]
> [Tutorial: Sign in users and call the Microsoft Graph API from a JavaScript single-page application (SPA)](tutorial-v2-javascript-spa.md)
