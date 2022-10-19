---
title: "Tutorial: Sign in users and call the Microsoft Graph API in an Electron desktop app"
description: In this tutorial, you build an Electron desktop app that can sign in users and use the auth code flow to obtain an access token from the Microsoft identity platform and call the Microsoft Graph API.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.date: 02/17/2021
ms.author: cwerner
---

# Tutorial: Sign in users and call the Microsoft Graph API in an Electron desktop app

In this tutorial, you build an Electron desktop application that signs in users and calls Microsoft Graph by using the authorization code flow with PKCE. The desktop app you build uses the [Microsoft Authentication Library (MSAL) for Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node).

Follow the steps in this tutorial to:

> [!div class="checklist"]
>
> - Register the application in the Azure portal
> - Create an Electron desktop app project
> - Add authentication logic to your app
> - Add a method to call a web API
> - Add app registration details
> - Test the app

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Electron](https://www.electronjs.org/)
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor

## Register the application

First, complete the steps in [Register an application with the Microsoft identity platform](quickstart-register-app.md) to register your app.

Use the following settings for your app registration:

- Name: `ElectronDesktopApp` (suggested)
- Supported account types: **Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**
- Platform type: **Mobile and desktop applications**
- Redirect URI: `msal{Your_Application/Client_Id}://auth`

## Create the project

Create a folder to host your application, for example *ElectronDesktopApp*.

1. First, change to your project directory in your terminal and then run the following `npm` commands:

    ```console
    npm init -y
    npm install --save @azure/msal-node axios bootstrap dotenv jquery popper.js
    npm install --save-dev babel electron@18.2.3 webpack
    ```

2. Then, create a folder named *App*. Inside this folder, create a file named *index.html* that will serve as UI. Add the following code there:

    :::code language="html" source="~/ms-identity-JavaScript-nodejs-desktop/App/index.html":::

3. Next, create file named *main.js* and add the following code:

    :::code language="js" source="~/ms-identity-JavaScript-nodejs-desktop/App/main.js":::

In the code snippet above, we initialize an Electron main window object and create some event handlers for interactions with the Electron window. We also import configuration parameters, instantiate *authProvider* class for handling sign-in, sign-out and token acquisition, and call the Microsoft Graph API.

4. In the same folder (*App*), create another file named *renderer.js* and add the following code:

    :::code language="js" source="~/ms-identity-JavaScript-nodejs-desktop/App/renderer.js":::

The renderer methods are exposed by the preload script found in the *preload.js* file in order to give the renderer access to the `Node API` in a secure and controlled way

5. Then, create a new file *preload.js* and add the following code:

    :::code language="js" source="~/ms-identity-JavaScript-nodejs-desktop/App/preload.js":::

This preload script exposes a renderer methods to give the renderer process controlled access to some `Node APIs` by applying IPC channels that have been configured for communication between the main and renderer processes.

6. Next, create *UIManager.js* class inside the *App* folder and add the following code:

    :::code language="js" source="~/ms-identity-JavaScript-nodejs-desktop/App/UIManager.js":::

7. After that, create *CustomProtocolListener.js* class and add the following code there:

    :::code language="js" source="~/ms-identity-JavaScript-nodejs-desktop/App/CustomProtocolListener.js":::

*CustomProtocolListener* class can be instantiated in order to register and unregister a custom typed protocol on which MSAL Node can listen for Auth Code responses.

8. Finally, create a file named *constants.js* that will store the strings constants for describing the application **events**:

    :::code language="js" source="~/ms-identity-JavaScript-nodejs-desktop/App/constants.js":::

You now have a simple GUI and interactions for your Electron app. After completing the rest of the tutorial, the file and folder structure of your project should look similar to the following:

```
ElectronDesktopApp/
├── App
│   ├── AuthProvider.js
│   ├── constants.js
│   ├── CustomProtocolListener.js
│   ├── fetch.js
│   ├── index.html
|   ├── main.js
|   ├── preload.js
|   ├── renderer.js
│   ├── UIManager.js
│   ├── authConfig.js
├── package.json
```

## Add authentication logic to your app

In *App* folder, create a file named *AuthProvider.js*. The *AuthProvider.js* file will contain an authentication provider class that will handle login, logout, token acquisition, account selection and related authentication tasks using MSAL Node. Add the following code there:

:::code language="js" source="~/ms-identity-JavaScript-nodejs-desktop/App/AuthProvider.js":::

In the code snippet above, we first initialized MSAL Node `PublicClientApplication` by passing a configuration object (`msalConfig`). We then exposed `login`, `logout` and `getToken` methods to be called by main module (*main.js*). In `login` and `getToken`, we acquire ID and access tokens, respectively, by first requesting an authorization code and then exchanging this with a token using MSAL Node `acquireTokenByCode` public API.

## Add a method to call a web API

Create another file named *fetch.js*. This file will contain an Axios HTTP client for making REST calls to the Microsoft Graph API.

:::code language="js" source="~/ms-identity-JavaScript-nodejs-desktop/App/fetch.js":::

## Add app registration details

Finally, create an environment file to store the app registration details that will be used when acquiring tokens. To do so, create a file named *authConfig.js* inside the root folder of the sample (*ElectronDesktopApp*), and add the following code:

:::code language="js" source="~/ms-identity-JavaScript-nodejs-desktop/App/authConfig.js":::

Fill in these details with the values you obtain from Azure app registration portal:

- `Enter_the_Tenant_Id_here` should be one of the following:
  - If your application supports *accounts in this organizational directory*, replace this value with the **Tenant ID** or **Tenant name**. For example, `contoso.microsoft.com`.
  - If your application supports *accounts in any organizational directory*, replace this value with `organizations`.
  - If your application supports *accounts in any organizational directory and personal Microsoft accounts*, replace this value with `common`.
  - To restrict support to *personal Microsoft accounts only*, replace this value with `consumers`.
- `Enter_the_Application_Id_Here`: The **Application (client) ID** of the application you registered.
- `Enter_the_Cloud_Instance_Id_Here`: The Azure cloud instance in which your application is registered.
  - For the main (or *global*) Azure cloud, enter `https://login.microsoftonline.com/`.
  - For **national** clouds (for example, China), you can find appropriate values in [National clouds](authentication-national-cloud.md).
- `Enter_the_Redirect_Uri_Here`: The Redirect Uri of the application you registered `msal{Your_Application/Client_Id}:///auth`.
- `Enter_the_Graph_Endpoint_Here` is the instance of the Microsoft Graph API the application should communicate with.
  - For the **global** Microsoft Graph API endpoint, replace both instances of this string with `https://graph.microsoft.com/`.
  - For endpoints in **national** cloud deployments, see [National cloud deployments](/graph/deployments) in the Microsoft Graph documentation.

## Test the app

You've completed creation of the application and are now ready to launch the Electron desktop app and test the app's functionality.

1. Start the app by running the following command from within the root of your project folder:

```console
electron App/main.js
```

2. In application main window, you should see the contents of your *index.html* file and the **Sign In** button.

## Test sign in and sign out

After the *index.html* file loads, select **Sign In**. You're prompted to sign in with the Microsoft identity platform:

:::image type="content" source="media/tutorial-v2-nodejs-desktop/desktop-01-signin-prompt.png" alt-text="sign-in prompt":::

If you consent to the requested permissions, the web applications displays your user name, signifying a successful login:

:::image type="content" source="media/tutorial-v2-nodejs-desktop/desktop-03-after-signin.png" alt-text="successful sign-in":::

## Test web API call

After you sign in, select **See Profile** to view the user profile information returned in the response from the call to the Microsoft Graph API:

:::image type="content" source="media/tutorial-v2-nodejs-desktop/desktop-04-profile.png" alt-text="profile information from Microsoft Graph":::

Select **Read Mails** to view the messages in user's account. You'll be presented with a consent screen:

:::image type="content" source="media/tutorial-v2-nodejs-desktop/desktop-05-consent-mail.png" alt-text="consent screen for read.mail permission":::

After consent, you'll view the messages returned in the response from the call to the Microsoft Graph API:

:::image type="content" source="media/tutorial-v2-nodejs-desktop/desktop-06-mails.png" alt-text="mail information from Microsoft Graph":::

## How the application works

When a user selects the **Sign In** button for the first time, get `getTokenInteractive` method of *AuthProvider.js* is called. This method redirects the user to sign-in with the Microsoft identity platform endpoint and validates the user's credentials, and then obtains an **authorization code**. This code is then exchanged for an access token using `acquireTokenByCode` public API of MSAL Node.

At this point, a PKCE-protected authorization code is sent to the CORS-protected token endpoint and is exchanged for tokens. An ID token, access token, and refresh token are received by your application and processed by MSAL Node, and the information contained in the tokens is cached.

The ID token contains basic information about the user, like their display name. The access token has a limited lifetime and expires after 24 hours. If you plan to use these tokens for accessing protected resource, your back-end server *must* validate it to guarantee the token was issued to a valid user for your application.

The desktop app you've created in this tutorial makes a REST call to the Microsoft Graph API using an access token as bearer token in request header ([RFC 6750](https://tools.ietf.org/html/rfc6750)).

The Microsoft Graph API requires the *user.read* scope to read a user's profile. By default, this scope is automatically added in every application that's registered in the Azure portal. Other APIs for Microsoft Graph, and custom APIs for your back-end server, might require extra scopes. For example, the Microsoft Graph API requires the *Mail.Read* scope in order to list the user's email.

As you add scopes, your users might be prompted to provide another consent for the added scopes.

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

If you'd like to dive deeper into Node.js and Electron desktop application development on the Microsoft identity platform, see our multi-part scenario series:

> [!div class="nextstepaction"]
> [Scenario: Desktop app that calls web APIs](scenario-desktop-overview.md)
