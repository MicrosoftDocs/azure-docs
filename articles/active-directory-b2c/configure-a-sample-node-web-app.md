---
title: Configure authentication in a sample Node.js web application by using Azure AD B2C
description: Follow this article to learn how to enable sign in, sign out, password reset and profile update on a sample Node.js application using Azure AD B2C 
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

This sample article uses a sample Node.js application to show how to add Azure Active Directory B2C (Azure AD B2C) authentication to a Node.js web application. The sample application enables you to sign in, sign out, update profile and reset password using Azure AD B2C user flows. The sample web application uses [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to handle authentication and authorization. 

In this article, you'll be able to: 
- Register a web application in the Azure portal.
- Create combined **Sign in and sign up**, **Profile editing**, and **Password reset** user flows for the app in the Azure portal.
- Update a sample Node application to use your own Azure AD B2C application and user flows.
- Test the sample application. 

## Prerequisites

- [Node.js](https://nodejs.org).
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.
- Azure AD B2C tenant. If you haven't already created your own, follow the steps in [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md) and record your tenant name.

## Step 1: Configure your user flows 

When you sign in to your app, the app starts an authentication request to the authorization endpoint via a user flow. The [user flow](user-flow-overview.md) defines and controls the user experience. After you complete the user flow, Azure AD B2C generates a token and then redirects users back to your application.

To create a user flow, follow the steps in [Tutorial: Create user flows and custom policies in Azure Active Directory B2C](tutorial-create-user-flows.md?pivots=b2c-user-flow). Repeat the steps to create three separate user flows as follows: 
- A combined **Sign in and sign up** user flow, such as `susi_node_app`. This user flow also supports the **Forgot your password** experience.
- A **Profile editing** user flow, such as `edit_profile_node_app`.
- A **Password reset** user flow, such as `reset_password_node_app`.

Azure AD B2C prepends `B2C_1_` to the user flow name. For example, `susi_node_app` becomes `B2C_1_susi_node_app`.

## Step 2: Register a web application

To enable your application sign in with Azure AD B2C, register your app in the Azure AD B2C directory. The app registration establishes a trust relationship between the app and Azure AD B2C.  

During app registration, you'll specify the *Redirect URI*. The redirect URI is the endpoint to which you're redirected by Azure AD B2C after they authenticate with Azure AD B2C. The app registration process generates an *Application ID*, also known as the *client ID*, that uniquely identifies your app. After your app is registered, Azure AD B2C uses both the application ID and the redirect URI to create authentication requests. 

### Step 2.1: Register the app 

To create the web app registration, use the following steps

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Under **Name**, enter a name for the application (for example, *webapp1*).
1. Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**. 
1. Under **Redirect URI**, select **Web** and then, in the URL box, enter `http://localhost:3000/redirect`.
1. Under **Permissions**, select the **Grant admin consent to openid and offline_access permissions** checkbox.
1. Select **Register**.
1. Select **Overview**.
1. Record the **Application (client) ID** for later use, when you configure the web application.

    ![Screenshot of the web app Overview page for recording your web app ID.](./media/configure-authentication-sample-python-web-app/get-azure-ad-b2c-app-id.png)

### Step 2.2: Create a web app client secret

[!INCLUDE [active-directory-b2c-app-integration-client-secret](../../includes/active-directory-b2c-app-integration-client-secret.md)]


## Step 3: Get the sample web app 


To clone the sample Node.js web app from GitHub, run the following command:

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

## Step 4: Configure the sample web app

1. In your terminal, change directory into your Node app folder, such as `cd active-directory-b2c-msal-node-sign-in-sign-out-webapp`, and then run the following commands to install app dependencies:
    ```
        npm install && npm update
    ```
1. Open your web app in a code editor such as Visual Studio Code. The `.env` file should look similar to the following sample:

    :::code language="text" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/.env":::

1. Update the `.env` file as follows: 

|Key  |Value  |
|---------|---------|
|`SERVER_PORT`|The HTTP port on which the Node server runs. Leave the value as is.|
|`APP_CLIENT_ID`| |
|`APP_CLIENT_ID`|The **Application (client) ID** for the web app you registered in [step 2.1](#step-21-register-the-app).|
|`SESSION_SECRET`|The express session secret. Leave the value as is or use a random string. |
|`APP_CLIENT_SECRET`|The client secret for the web app you created in [step 2.2](#step-22-create-a-web-app-client-secret) |
|`SIGN_UP_SIGN_IN_POLICY_AUTHORITY`|The **Sign in and sign up** user flow authority such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<sign-in-sign-up-user-flow-name>`. Replace `<your-tenant-name>` with the name of your tenant. Also, replace `<sign-in-sign-up-user-flow-name>` with the name of your Sign in and Sign up user flow such as `B2C_1_susi_node_app`. Learn how to [Get your tenant name](tenant-management.md#get-your-tenant-name). If you're using a custom domain, replace `<tenant-name>.b2clogin.com` with your domain, such as `contoso.com`. |
|`RESET_PASSWORD_POLICY_AUTHORITY`| The **Reset password** user flow authority such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<reset-password-user-flow-name>`. Replace `<your-tenant-name>` with the name of your tenant. Also, replace `<reset-password-user-flow-name>` with the name of your Reset password user flow such as `B2C_1_reset_password_node_app`.|
|`EDIT_PROFILE_POLICY_AUTHORITY`|The **Profile editing** user flow authority such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<profile-edit-user-flow-name>`. Replace `<your-tenant-name>` with the name of your tenant. Also, replace `<reset-password-user-flow-name>` with the name of your reset password user flow such as `B2C_1_edit_profile_node_app`. |
|`AUTHORITY_DOMAIN`| The Azure AD B2C authority domain such as `https://<your-tenant-name>.b2clogin.com`. Replace `<your-tenant-name>` with the name of your tenant.|
|`APP_REDIRECT_URI`| The application redirect URI where Azure AD B2C will return authentication responses (tokens). It matches the **Redirect URI** you set when you registered your app in Azure portal, and it must be publicly accessible. Leave the value as is.|
|`LOGOUT_ENDPOINT`| The Azure AD B2C sign out  endpoint such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<sign-in-sign-up-user-flow-name>/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000`. Replace `<your-tenant-name>` with the name of your tenant. Also, replace `<sign-in-sign-up-user-flow-name>` with the name of your Sign in and Sign up user flow such as `B2C_1_susi_node_app`.|
|| |
    
## Run the sample web app

You can now test the sample app. You need to start the Node server and access it through your browser on `http://localhost:300`. 

1. In your terminal, run the following code to start the Node.js web server:
 
   ```
   node index.js
   ``` 

2. In your browser, go to `http://localhost:3000` or `http://localhost:port`, where `port` is the port that your web server is listening on. You should see the page with a **Sign in** button.

   :::image type="content" source="./media/configure-a-sample-node-web-app/tutorial-login-page.png" alt-text="Screenshot shows app sign-in page.":::

### Test sign in

1. After the page with the **Sign in** button finishes loading, select **Sign in**. You're prompted to sign in.
1. Enter your sign-in credentials, such as email address and password. If you don't have an account, select **Sign up now** to create an account. If you have an account but have forgotten your password, select **Forgot your password?** to recover your password. After you successfully sign in or sign up, you should see the following page that shows sign-in status.

   :::image type="content" source="./media/configure-a-sample-node-web-app/tutorial-dashboard-page.png" alt-text="Screenshot shows web app sign-in status.":::

### Test profile editing

1. After you sign in, select **Edit profile**. 
1. Enter new changes as required, and then select **Continue**. You should see the page with sign-in status with the new changes, such as **Given Name**. 

### Test password reset

1. After you sign in, select **Reset password**. 
1. In the next dialog that appears, you can cancel the operation by selecting **Cancel**. Alternatively, enter your email address, and then select **Send verification code**. You'll receive a verification code to your email account. Copy the verification code in your email, enter it into the password reset dialog, and then select **Verify code**.
1. Select **Continue**.
1. Enter your new password, confirm it, and then select **Continue**. You should see the page that shows sign-in status.

### Test sign out 

After you sign in, select **Sign out**. You should see the page that has a **Sign in** button. 


## Next steps
- Learn how to [Enable authentication in your own Node web application using Azure AD B2C](enable-authentication-in-node-web-app.md).