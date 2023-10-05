---
title: "Tutorial: Create a JavaScript single-page app that uses auth code flow"
description: In this tutorial, you create a JavaScript SPA that can sign in users and use the auth code flow to obtain an access token from the Microsoft identity platform and call the Microsoft Graph API.
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.workload: identity
ms.date: 10/12/2021
ms.author: owenrichards
ms.custom: aaddev, devx-track-js
---

# Tutorial: Sign in users and call the Microsoft Graph API from a JavaScript single-page app (SPA) using auth code flow

In this tutorial, you build a JavaScript single-page application (SPA) that signs in users and calls Microsoft Graph by using the authorization code flow with PKCE. The SPA you build uses the Microsoft Authentication Library (MSAL) for JavaScript v2.0.

In this tutorial:
> [!div class="checklist"]
> * Perform the OAuth 2.0 authorization code flow with PKCE
> * Sign in personal Microsoft accounts as well as work and school accounts
> * Acquire an access token
> * Call Microsoft Graph or your own API that requires access tokens obtained from the Microsoft identity platform

MSAL.js 2.0 improves on MSAL.js 1.0 by supporting the authorization code flow in the browser instead of the implicit grant flow. MSAL.js 2.0 does **NOT** support the implicit flow.

## Prerequisites

* [Node.js](https://nodejs.org/en/download/) for running a local webserver
* [Visual Studio Code](https://code.visualstudio.com/download) or another code editor

## How the tutorial app works

:::image type="content" source="media/tutorial-v2-javascript-auth-code/diagram-01-auth-code-flow.png" alt-text="Diagram showing the authorization code flow in a single-page application":::

The application you create in this tutorial enables a JavaScript SPA to query the Microsoft Graph API by acquiring security tokens from the the Microsoft identity platform. In this scenario, after a user signs in, an access token is requested and added to HTTP requests in the authorization header. Token acquisition and renewal are handled by the Microsoft Authentication Library for JavaScript (MSAL.js).

This tutorial uses the following library:

[msal.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser) the Microsoft Authentication Library for JavaScript v2.0 browser package

## Get the completed code sample

Prefer to download this tutorial's completed sample project instead? Clone the [ms-identity-javascript-v2](https://github.com/Azure-Samples/ms-identity-javascript-v2) repository. 

`git clone https://github.com/Azure-Samples/ms-identity-javascript-v2`

To run the downloaded project on your local development environment, start by creating a localhost server for your application as described in step 1 of [create your project](#create-your-project). Once done, you can configure the code sample by skipping to the [configuration step](#register-your-application).

To continue with the tutorial and build the application yourself, move on to the next section, [Create your project](#create-your-project).

## Create your project

Once you have [Node.js](https://nodejs.org/en/download/) installed, create a folder to host your application, such as `msal-spa-tutorial`.

Next, implement a small [Express](https://expressjs.com/) web server to serve your *index.html* file.

1. First, change to your project directory in your terminal and then run the following `npm` commands:
    ```console
    npm init -y
    npm install @azure/msal-browser
    npm install express
    npm install morgan
    npm install yargs
    ```
2. Next, create file named *server.js* and add the following code:
 
   :::code language="js" source="~/ms-identity-javascript-v2/server.js":::

## Create the SPA UI

1. Create an *app* folder in your project directory, and in it create an *index.html* file for your JavaScript SPA. This file implements a UI built with the **Bootstrap 4 Framework** and imports script files for configuration, authentication, and API calls.

    In the *index.html* file, add the following code:

    :::code language="html" source="~/ms-identity-javascript-v2/app/index.html":::

2. Next, also in the *app* folder, create a file named *ui.js* and add the following code. This file will access and update DOM elements.

    :::code language="js" source="~/ms-identity-javascript-v2/app/ui.js":::

## Register your application

Follow the steps in [Single-page application: App registration](scenario-spa-app-registration.md) to create an app registration for your SPA.

In the [Redirect URI: MSAL.js 2.0 with auth code flow](scenario-spa-app-registration.md#redirect-uri-msaljs-20-with-auth-code-flow) step, enter `http://localhost:3000`, the default location where this tutorial's application runs.

If you'd like to use a different port, enter `http://localhost:<port>`, where `<port>` is your preferred TCP port number. If you specify a port number other than `3000`, also update *server.js* with your preferred port number.

### Configure your JavaScript SPA

Create a file named *authConfig.js* in the *app* folder to contain your configuration parameters for authentication, and then add the following code:

:::code language="js" source="~/ms-identity-javascript-v2/app/authConfig.js":::

Still in the *app* folder, create a file named *graphConfig.js*. Add the following code to provide your application the configuration parameters for calling the Microsoft Graph API:

:::code language="js" source="~/ms-identity-javascript-v2/app/graphConfig.js":::

Modify the values in the `graphConfig` section as described here:

- `Enter_the_Graph_Endpoint_Here` is the instance of the Microsoft Graph API the application should communicate with.
  - For the **global** Microsoft Graph API endpoint, replace both instances of this string with `https://graph.microsoft.com`.
  - For endpoints in **national** cloud deployments, see [National cloud deployments](/graph/deployments) in the Microsoft Graph documentation.

The `graphMeEndpoint` and `graphMailEndpoint` values in your *graphConfig.js* should be similar to the following if you're using the global endpoint:

```javascript
graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages"
```

## Use the Microsoft Authentication Library (MSAL) to sign in user

### Pop-up

In the *app* folder, create a file named *authPopup.js* and add the following authentication and token acquisition code for the login pop-up:

:::code language="js" source="~/ms-identity-javascript-v2/app/authPopup.js":::

### Redirect

Create a file named *authRedirect.js* in the *app* folder and add the following authentication and token acquisition code for login redirect:

:::code language="js" source="~/ms-identity-javascript-v2/app/authRedirect.js":::

### How the code works

When a user selects the **Sign In** button for the first time, the `signIn` method calls `loginPopup` to sign in the user. The `loginPopup` method opens a pop-up window with the *Microsoft identity platform endpoint* to prompt and validate the user's credentials. After a successful sign-in, *msal.js* initiates the [authorization code flow](v2-oauth2-auth-code-flow.md).

At this point, a PKCE-protected authorization code is sent to the CORS-protected token endpoint and is exchanged for tokens. An ID token, access token, and refresh token are received by your application and processed by *msal.js*, and the information contained in the tokens is cached.

The ID token contains basic information about the user, like their display name. If you plan to use any data provided by the ID token, your back-end server *must* validate it to guarantee the token was issued to a valid user for your application.

The access token has a limited lifetime and expires after 24 hours. The refresh token can be used to silently acquire new access tokens.

The SPA you've created in this tutorial calls `acquireTokenSilent` and/or `acquireTokenPopup` to acquire an *access token* used to query the Microsoft Graph API for user profile info. If you need a sample that validates the ID token, see the [active-directory-javascript-singlepageapp-dotnet-webapi-v2](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi-v2) sample application on GitHub. The sample uses an ASP.NET web API for token validation.

#### Get a user token interactively

After their initial sign-in, your app shouldn't ask users to reauthenticate every time they need to access a protected resource (that is, to request a token). To prevent such reauthentication requests, call `acquireTokenSilent`. There are some situations, however, where you might need to force users to interact with the Microsoft identity platform. For example:

- Users need to re-enter their credentials because the password has expired.
- Your application is requesting access to a resource and you need the user's consent.
- Two-factor authentication is required.

Calling `acquireTokenPopup` opens a pop-up window (or `acquireTokenRedirect` redirects users to the Microsoft identity platform). In that window, users need to interact by confirming their credentials, giving consent to the required resource, or completing the two-factor authentication.

#### Get a user token silently

The `acquireTokenSilent` method handles token acquisition and renewal without any user interaction. After `loginPopup` (or `loginRedirect`) is executed for the first time, `acquireTokenSilent` is the method commonly used to obtain tokens used to access protected resources for subsequent calls. (Calls to request or renew tokens are made silently.)
`acquireTokenSilent` may fail in some cases. For example, the user's password may have expired. Your application can handle this exception in two ways:

1. Make a call to `acquireTokenPopup` immediately to trigger a user sign-in prompt. This pattern is commonly used in online applications where there is no unauthenticated content in the application available to the user. The sample generated by this guided setup uses this pattern.
1. Visually indicate to the user that an interactive sign-in is required so the user can select the right time to sign in, or the application can retry `acquireTokenSilent` at a later time. This technique is commonly used when the user can use other functionality of the application without being disrupted. For example, there might be unauthenticated content available in the application. In this situation, the user can decide when they want to sign in to access the protected resource, or to refresh the outdated information.

> [!NOTE]
> This tutorial uses the `loginPopup` and `acquireTokenPopup` methods by default. If you're using Internet Explorer, we recommend that you use the `loginRedirect` and `acquireTokenRedirect` methods due to a [known issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser#issues) with Internet Explorer and pop-up windows. For an example of achieving the same result by using redirect methods, see [*authRedirect.js*](https://github.com/Azure-Samples/ms-identity-javascript-v2/blob/master/app/authRedirect.js) on GitHub.

## Call the Microsoft Graph API

Create file named *graph.js* in the *app* folder and add the following code for making REST calls to the Microsoft Graph API:

:::code language="js" source="~/ms-identity-javascript-v2/app/graph.js":::

In the sample application created in this tutorial, the `callMSGraph()` method is used to make an HTTP `GET` request against a protected resource that requires a token. The request then returns the content to the caller. This method adds the acquired token in the *HTTP Authorization header*. In the sample application created in this tutorial, the protected resource is the Microsoft Graph API *me* endpoint which displays the signed-in user's profile information.

## Test your application

You've completed creation of the application and are now ready to launch the Node.js web server and test the app's functionality.

1. Start the Node.js web server by running the following command from within the root of your project folder:

   ```console
   npm start
   ```
1. In your browser, navigate to `http://localhost:3000` or `http://localhost:<port>`, where `<port>` is the port that your web server is listening on. You should see the contents of your *index.html* file and the **Sign In** button.

### Sign in to the application

After the browser loads your *index.html* file, select **Sign In**. You're prompted to sign in with the Microsoft identity platform:

:::image type="content" source="media/tutorial-v2-javascript-auth-code/spa-01-signin-dialog.png" alt-text="Web browser displaying sign-in dialog":::

### Provide consent for application access

The first time you sign in to your application, you're prompted to grant it access to your profile and sign you in:

:::image type="content" source="media/tutorial-v2-javascript-auth-code/spa-02-consent-dialog.png" alt-text="Content dialog displayed in web browser":::

If you consent to the requested permissions, the web applications displays your user name, signifying a successful login:

:::image type="content" source="media/tutorial-v2-javascript-auth-code/spa-03-signed-in.png" alt-text="Results of a successful sign-in in the web browser":::

### Call the Graph API

After you sign in, select **See Profile** to view the user profile information returned in the response from the call to the Microsoft Graph API:

:::image type="content" source="media/tutorial-v2-javascript-auth-code/spa-04-see-profile.png" alt-text="Profile information from Microsoft Graph displayed in the browser":::

### More information about scopes and delegated permissions

The Microsoft Graph API requires the *user.read* scope to read a user's profile. By default, this scope is automatically added in every application that's registered in the Microsoft Entra admin center. Other APIs for Microsoft Graph, as well as custom APIs for your back-end server, might require additional scopes. For example, the Microsoft Graph API requires the *Mail.Read* scope in order to list the user's email.

As you add scopes, your users might be prompted to provide additional consent for the added scopes.

If a back-end API doesn't require a scope, which isn't recommended, you can use `clientId` as the scope in the calls to acquire tokens.

[!INCLUDE [Help and support](./includes/error-handling-and-tips/help-support-include.md)]

## Next steps

If you'd like to dive deeper into JavaScript single-page application development on the Microsoft identity platform, see our multi-part scenario series:

> [!div class="nextstepaction"]
> [Scenario: Single-page application](scenario-spa-overview.md)
