---
title: Enable authentication in your own Node web application using Azure Active Directory B2C
description: This article explains how to enable authentication in your own Node.js web application using Azure AD B2C 
titleSuffix: Azure AD B2C

author: kengaderdus
manager: CelesteDG
ms.service: active-directory

ms.custom: devx-track-js
ms.topic: how-to
ms.date: 02/02/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Enable authentication in your own Node web application using Azure Active Directory B2C

In this article, you'll learn how to add Azure Active Directory B2C (Azure AD B2C) authentication in your own Node.js web application. You'll enable users to sign in, sign out, update profile and reset password using Azure AD B2C user flows. This article uses [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to simplify adding authentication to your node web application. 

The aim of this article is to substitute the sample application you used in [Configure authentication in a sample Node.js web application by using Azure AD B2C](configure-a-sample-node-web-app.md) with your own Node.js web application. 

This article uses Node.js and [Express](https://expressjs.com/) to create a basic Node.js web app. The application's views uses [Handlebars](https://handlebarsjs.com/). 

## Prerequisites 

- Complete the steps in [Configure authentication in a sample Node.js web application by using Azure AD B2C](configure-a-sample-node-web-app.md). You'll create Azure AD B2C user flows and register a web application in Azure portal. 

## Step 1: Create the node project

Create a folder to host your node application, such as  `active-directory-b2c-msal-node-sign-in-sign-out-webapp`.

1. In your terminal, change directory into your Node app folder, such as `cd active-directory-b2c-msal-node-sign-in-sign-out-webapp`, and run `npm init -y`. This command creates a default `package.json` file for your Node.js project.
1. In your terminal, run `npm install express`. This command installs the Express framework.
1. Create more folders and files to achieve the following project structure:

   ```
   active-directory-b2c-msal-node-sign-in-sign-out-webapp/
   ├── index.js
   └── package.json
   └── .env
   └── views/
       └── layouts/
           └── main.hbs
       └── signin.hbs
   ```

The `views` folder contains Handlebars files for the app's UI.

## Step 2: Install app dependencies 

In your terminal, install the `dotenv`, `express-handlebars`, `express-session`, and `@azure/msal-node` packages by running the following commands:

```
npm install dotenv
npm install express-handlebars
npm install express-session
npm install @azure/msal-node
```

## Step 3: Build app UI components 

In the `main.hbs` file, add the following code:

:::code language="HTML" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/views/layouts/main.hbs":::

The `main.hbs` file is in the `layout` folder. It should contain any HTML code that's required throughout your application. Any UI that changes from one view to another, such as in `signin.hbs`, is placed in the placeholder shown as `{{{body}}}`. 

The `main.hbs` file implements UI built with the Bootstrap 5 CSS framework. You'll see the **Edit password**, **Reset password**, and **Sign out** UI components (buttons) when signed in. You'll see **Sign in** when signed out. This behavior is controlled by the `showSignInButton` Boolean variable, which the app server sends. 

In the `signin.hbs` file, add the following code:

:::code language="HTML" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/views/signin.hbs":::

## Step 4: Configure the web server and MSAL client

1. In the `.env` file, add the following code and update it as explained in [Configure the sample web app](configure-a-sample-node-web-app.md#step-5-configure-the-sample-web-app).

    :::code language="text" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/.env":::    

1. In your `index.js` file, add the following code to use your app dependencies: 

    :::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/index.js" id="ms_docref_use_app_dependencies":::

1. In your `index.js` file, add the following code to configure the authentication library:
    
    :::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/index.js" id="ms_docref_configure_msal":::
    
    `confidentialClientConfig` is the MSAL configuration object used to connect to your Azure AD B2C tenant's authentication endpoints.

1. To add more global variables in the `index.js` file, add the following code:

    :::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/index.js" id="ms_docref_global_variable":::

    1. `APP_STATES`: Used to differentiate between responses received from Azure AD B2C by tagging requests. There's only one redirect URI for any number of requests sent to Azure AD B2C.  
    1. `authCodeRequest`: The configuration object that's used to retrieve the authorization code. 
    1. `tokenRequest`: The configuration object that's used to acquire a token by authorization code.
    1. `sessionConfig`: The configuration object for the Express session.

1. To set the view template engine and Express session configuration, add the following code in the `index.js` file:
    
    :::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/index.js" id="ms_docref_view_tepmplate_engine":::

## Step 5: Add express routes

Before you add the app route, add the logic that retrieves the authorization code URL, which is the first leg of authorization code grant flow. In the `index.js` file, add the following code:

:::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/index.js" id="ms_docref_authorization_code_url":::

The `authCodeRequest` object has the properties `redirectUri`, `authority`, `scopes`, and `state`. The object is passed to the `getAuthCodeUrl` method as a parameter. 

In the `index.js` file, add the following code:

:::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/index.js" id="ms_docref_app_endpoints":::

The express routes are:
- `/`:
    - It's used to enter the web app.
    - It renders the `signin` page.
- `/signin`:
    - It's used when you signs in.
    - It calls the `getAuthCode()` method and passes `authority` for the **Sign in and sign up** user flow/policy, `APP_STATES.LOGIN`, and an empty `scopes` array to it.  
    - If necessary, it causes a challenge on you to enter your credentials. If you don't have an account, it prompts you to sign up.
    - The final response that results from this route includes an authorization code from Azure AD B2C posted back to the `/redirect` route. 
- `/password`:
    - It's used when you reset a password.
    - It calls the `getAuthCode()` method and passes `authority` for the **Password reset** user flow/policy, `APP_STATES.PASSWORD_RESET`, and an empty `scopes` array to it.
    - It enables you to change your password by using the password reset experience, or they can cancel the operation.
    - The final response that results from this route includes an authorization code from Azure AD B2C posted back to the `/redirect` route. If you cancel the operation, an error is posted back. 
- `/profile`: 
    - It's used when you update your profile.
    - It calls the `getAuthCode()` method and passes `authority` for the **Profile editing** user flow/policy, `APP_STATES.EDIT_PROFILE`, and an empty `scopes` array to it.
    - It enables you to update your profile, and you use the profile-editing experience. 
    - The final response that results from this route includes an authorization code from Azure AD B2C posted back to the `/redirect` route. 
- `/signout`:
    - It's used when you sign out.
    - The web app clears the session, and makes an HTTP call to the Azure AD B2C sign out endpoint. 
- `/redirect`:
    - It's the route set as Redirect URI for the web app in Azure portal.
    - It uses the `state` query parameter in the request from Azure AD B2C to differentiate between requests that are made from the web app. It handles all redirects from Azure AD B2C, except for sign out.
    - If the app state is `APP_STATES.LOGIN`, the acquired authorization code is used to retrieve a token through the `acquireTokenByCode()` method. This token includes `idToken` and `idTokenClaims`, which are used for user identification.
    - If the app state is `APP_STATES.PASSWORD_RESET`, it handles any error, such as `user cancelled the operation`. The`AADB2C90091` error code identifies this error. Otherwise, it decides the next user experience. 
    - If the app state is `APP_STATES.EDIT_PROFILE`, it uses the authorization code to acquire a token. The token contains `idTokenClaims`, which includes the new changes. 

## Step 6: Start the Node server 
To start the Node server, add the following code in the `index.js` file:

:::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/index.js" id="ms_docref_start_node_server":::

After you make all the changes required in `index.js` file, it should look similar to the following file:

:::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/index.js":::

## Step 7: Run your web app

Follow the steps in [Run your web app](configure-a-sample-node-web-app.md#run-the-sample-web-app) to test your Node.js web app. 

## Next steps

- Learn how to [customize and enhance the Azure AD B2C authentication experience for your web app](enable-authentication-in-node-web-app-options.md)
