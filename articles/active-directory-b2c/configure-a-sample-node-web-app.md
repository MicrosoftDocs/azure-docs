---
title: Configure authentication in a sample Node.js web application by using Azure AD B2C
description: Follow this how to guide to learn how to enable sign in, sign out, password reset and profile update on a sample Node.js application using Azure AD B2C 
titleSuffix: Azure AD B2C
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/25/2022
ms.author: kengaderdus
ms.subservice: B2C
---


# Configure authentication in a sample Node.js web application by using Azure AD B2C

This sample article uses a sample Node.js applications to show how to add Azure Active Directory B2C (Azure AD B2C) authentication to a Node.js web applications. The sample application enables users to sign in, sign out, update profile and reset password using Azure AD B2C user flows. The sample web applications uses [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to handle authentication and authorization. 

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

## Get and update the sample Node web app code

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
    1. **APP_CLIENT_ID**: The **Application (client) ID** for the web app you registered in Azure portal. 
    1. **SESSION_SECRET**: The express session secret. Leave the value as is or use a random string. 
    1. **APP_CLIENT_SECRET**: The client secret for the web app you registered in Azure portal.
    1. **SIGN_UP_SIGN_IN_POLICY_AUTHORITY**: The **Sign in and sign up** user flow authority such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<sign-in-sign-up-user-flow-name>`. Replace `<your-tenant-name>` with the name of your tenant and `<sign-in-sign-up-user-flow-name>` with the name of your Sign in and Sign up user flow such as `B2C_1_susi_node_app`. Learn how to [Get your tenant name](tenant-management.md#get-your-tenant-name). If you're using a custom domain, replace `<tenant-name>.b2clogin.com` with your domain, such as `contoso.com`.
    1. **RESET_PASSWORD_POLICY_AUTHORITY**: The **Reset password **user flow authority such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<reset-password-user-flow-name>`. Replace `<your-tenant-name>` with the name of your tenant and `<reset-password-user-flow-name>` with the name of your Reset password user flow such as `B2C_1_reset_password_node_app`.
    1. **EDIT_PROFILE_POLICY_AUTHORITY**: The **Profile editing** user flow authority such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<profile-edit-user-flow-name>`. Replace `<your-tenant-name>` with the name of your tenant and `<reset-password-user-flow-name>` with the name of your reset password user flow such as `B2C_1_edit_profile_node_app`.
    1. **AUTHORITY_DOMAIN**: The Azure AD B2C authority domain such as `https://<your-tenant-name>.b2clogin.com`. Replace `<your-tenant-name>` with the name of your tenant. 
    1. **APP_REDIRECT_URI**: The application redirect URI where Azure AD B2C will return authentication responses (tokens). It matches the **Redirect URI** you set while registering your app in Azure portal, and it must be publicly accessible. Leave the value as is.
    1. **LOGOUT_ENDPOINT**: The Azure AD B2C logout endpoint such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<sign-in-sign-up-user-flow-name>/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000`. Replace `<your-tenant-name>` with the name of your tenant and `<sign-in-sign-up-user-flow-name>` with the name of your Sign in and Sign up user flow such as `B2C_1_susi_node_app`.
    
After the update, your resulting code should look similar to following sample:

:::code language="JavaScript" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/.env":::

## Run your web app

You can now test the sample app. You need to start the Node server and access it through your browser on `http://localhost:300`. 

1. In your terminal, run the following code to start the Node.js web server:
 
   ```
   node index.js
   ``` 

2. In your browser, go to `http://localhost:3000` or `http://localhost:port`, where `port` is the port that your web server is listening on. You should see the page with a **Sign in** button.

   :::image type="content" source="./media/configure-a-sample-node-web-app/tutorial-login-page.png" alt-text="Screenshot that shows a Node web app sign-in page.":::

### Test sign in
1. After the page with the **Sign in** button finishes loading, select **Sign in**. You're prompted to sign in.
1. Enter your sign-in credentials, such as email address and password. If you don't have an account, select **Sign up now** to create an account. If you have an account but have forgotten your password, select **Forgot your password?** to recover your password. After you successfully sign in or sign up, you should see the following page that shows sign-in status.

   :::image type="content" source="./media/configure-a-sample-node-web-app/tutorial-dashboard-page.png" alt-text="Screenshot that shows Node web app sign-in status.":::

### Test profile editing
1. After you sign in, select **Edit profile**. 
1. Enter new changes as required, and then select **Continue**. You should see the page with sign-in status showing the new changes, such as **Given Name**. 

### Test password reset
1. After you sign in, select **Reset password**. 
1. In the next dialog that appears, you can cancel the operation by selecting **Cancel**. Alternatively, enter your email address, and then select **Send verification code**. Azure AD B2C sends a verification code to your email account. Copy the verification code from your email, enter the code in the Azure AD B2C password reset dialog, and then select **Verify code**.
1. Select **Continue**.
1. Enter your new password, confirm it, and then select **Continue**. You should see the page that shows sign-in status.

### Test sign out 
After you sign in, select **Sign out**. You should see the page that has a **Sign in** button. 

## (Optional)Authenticate users with a Google account 
You can enable users to sign in to the Node web app without adding any code to your app.

Complete the steps in [Set up sign-up and sign-in with a Google account using Azure Active Directory B2C](identity-provider-google.md#create-a-google-application). Be sure to [add a Google identity provider](identity-provider-google.md#add-google-identity-provider-to-a-user-flow) to your **Sign in and sign up** user flow, such as `B2C_1_susi_node_app`.

Test the Google identity provider:
1. After you sign out, select **Sign in** again. You should see a **Sign in and sign up** experience with a Google sign-in option under **Sign in with your social account**.
1. Select **Google**, and then select the Google account that you want to sign in with. 
1. Complete your profile by entering required details, such as **Given Name**, and then select **Continue**. You should see the page that shows sign-in status.

When you use a social identity provider such as Google, that provider manages the user's identity. The following considerations apply:
- You can't reset your password the same way as you can with a local account.  
- When you sign out the user in your web app, you don't also sign out the user from the identity provider.  


## Next steps
- Learn how to [Enable authentication in your own Node web application using Azure AD B2C](enable-authentication-in-node-web-app.md).

