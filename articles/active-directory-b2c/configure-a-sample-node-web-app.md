---
title: Configure authentication in a sample Node.js web application by using Azure AD B2C
description: Follow this how to guide to learn how to enable sign in, sign out, password reset and profile update on a sample Node.js application using Azure AD B2C 
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 25/01/2022
ms.author: kengaderdus
ms.subservice: B2C
---


# Configure authentication in a sample Node.js web application by using Azure AD B2C

This sample article uses a sample Node.js applications to show how to add Azure Active Directory B2C (Azure AD B2C) authentication to your Node.js web applications. The sample application enables users to sign in, sign out, update profile and reset password using Azure AD B2C user flows. The sample web applications uses [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to handle authentication and authorization. 

In this article, you will accomplish the following: 
- Register a web application in the Azure portal.
- Create combined **Sign in and sign up**, **Profile editing**, and **Password reset** user flows for the app in the Azure portal.
- Update a sample Node application to use your own Azure AD B2C application and user flows.
- Configure the sample application to authenticate users with a Google account.
- Test the sample application. 

## Prerequisites
- [Node.js](https://nodejs.org).
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.
- Azure AD B2C tenant. If you haven't already created your own, follow the steps in [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md) and record your tenant name.

## Register the web application in the Azure portal
Register the web application in the Azure portal so that Azure AD B2C can provide an authentication service for your application and its users.

First, complete the steps in [Tutorial: Register a web application in Azure Active Directory B2C](tutorial-register-applications.md) to register the web app. 

Use the following settings for your app registration:
- For **Name**, enter **WebAppNode** (suggested).
- For **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.
- For **Redirect URI**, select **Web**, and then enter `http://localhost:3000/redirect` in the URL text box.
- After you generate a **Client secret** value, record the value as advised, because it appears only once.

At this point, you have the application (client) ID and client secret.

## Create Azure AD B2C user flows 

Follow the steps in [Tutorial: Create user flows and custom policies in Azure Active Directory B2C](tutorial-create-user-flows.md?pivots=b2c-user-flow) to create a user flow. Repeat the steps to create three separate user flows as follows: 
- A combined **Sign in and sign up** user flow, such as `susi_node_app`. This user flow also supports the **Forgot your password** experience.
- A **Profile editing** user flow, such as `edit_profile_node_app`.
- A **Password reset** user flow, such as `reset_password_node_app`.

Azure AD B2C prepends `B2C_1_` to the user flow name. For example, `susi_node_app` becomes `B2C_1_susi_node_app`.

## Get and update the sample Node code

1. Clone the sample node web app from GitHub by running the following command:

    ```
    git clone https://github.com/Azure-Samples/active-directory-b2c-msal-node-sign-in-sign-out-webapp.git
    ```
    You'll get a web app with the following directory structure:
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

1. In your terminal, change directory into your Node app folder, such as `cd active-directory-b2c-msal-node-sign-in-sign-out-webapp`, and then run the following commands to install app dependencies:
    ```
        npm install && npm update
    ```
1. Open your web app in a code editor such as Visual Studio Code and update the `.env` file as follows: 
    1. **SERVER_PORT**: The HTTP port on which the Node server runs. Leave the value as is.
    1. **APP_CLIENT_ID**: The application ID for the web app you registered in Azure portal. 
    1. **SESSION_SECRET**: The express session secret. Leave the value as is or use a random string. 
    1. **APP_CLIENT_SECRET**: The client secret for the web app you registered in Azure portal.
    1. **SIGN_UP_SIGN_IN_POLICY_AUTHORITY**: The Sign in and Sign up user flow authority such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<sign-in-sign-up-user-flow-name>`. Replace `<your-tenant-name>` with the name of your tenant and <sign-in-sign-up-user-flow-name> with the name of your Sign in and Sign up user flow such as `B2C_1_susi_node_app`.
    1. **RESET_PASSWORD_POLICY_AUTHORITY**: The Reset password user flow authority such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<reset-password-user-flow-name>`. Replace `<your-tenant-name>` with the name of your tenant and <reset-password-user-flow-name> with the name of your Reset password user flow such as `B2C_1_reset_password_node_app`.
    1. **EDIT_PROFILE_POLICY_AUTHORITY**: The Profile edit user flow authority such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<profile-edit-user-flow-name>`. Replace `<your-tenant-name>` with the name of your tenant and <reset-password-user-flow-name> with the name of your reset password user flow such as `B2C_1_edit_profile_node_app`.
    1. **AUTHORITY_DOMAIN**: The Azure AD B2C authority domain. Leave the value as is. 
    1. **APP_REDIRECT_URI**: The application redirect URI where Azure AD B2C will return authentication responses (tokens). It matches the **Redirect URI** you set while registering your app in Azure portal. Leave the value as is.
    1. **LOGOUT_ENDPOINT**: The Azure AD B2C logout endpoint such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<sign-in-sign-up-user-flow-name>/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000`. Replace `<your-tenant-name>` with the name of your tenant and <sign-in-sign-up-user-flow-name> with the name of your Sign in and Sign up user flow such as `B2C_1_susi_node_app`.
    
    After the update, your resulting code should look similar to following sample:

    :::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/.env":::

