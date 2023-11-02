---
title: Configure authentication in a sample Node.js web application by using Azure Active Directory B2C (Azure AD B2C)
description: This article discusses how to use Azure Active Directory B2C to sign in and sign up users in a Node.js web application. 
titleSuffix: Azure AD B2C
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.custom: devx-track-js, devx-track-linux
ms.topic: how-to
ms.date: 07/07/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Configure authentication in a sample Node.js web application by using Azure Active Directory B2C

This sample article uses a sample Node.js application to show how to add Azure Active Directory B2C (Azure AD B2C) authentication to a Node.js web application. The sample application enables users to sign in, sign out, update profile and reset password using Azure AD B2C user flows. The sample web application uses [Microsoft Authentication Library (MSAL) for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to handle authentication and authorization. 

In this article, you’ll do the following tasks:

- Register a web application in the Azure portal.
- Create combined **Sign in and sign up**, **Profile editing**, and **Password reset** user flows for the app in the Azure portal.
- Update a sample Node application to use your own Azure AD B2C application and user flows.
- Test the sample application. 

## Prerequisites

- [Node.js](https://nodejs.org).
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.
- Azure AD B2C tenant. If you haven't already created your own, follow the steps in [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md) and record your tenant name.

## Step 1: Configure your user flows

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](../../includes/active-directory-b2c-app-integration-add-user-flow.md)] 

## Step 2: Register a web application

To enable your application sign in with Azure AD B2C, register your app in the Azure AD B2C directory. The app registration establishes a trust relationship between the app and Azure AD B2C.  

During app registration, you'll specify the *Redirect URI*. The redirect URI is the endpoint to which the user is redirected by Azure AD B2C after they authenticate with Azure AD B2C. The app registration process generates an *Application ID*, also known as the *client ID*, that uniquely identifies your app. After your app is registered, Azure AD B2C uses both the application ID, and the redirect URI to create authentication requests. 

### Step 2.1: Register the app 

To register the web app, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Under **Name**, enter a name for the application (for example, *webapp1*).
1. Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**. 
1. Under **Redirect URI**, select **Web** and then, in the URL box, enter `http://localhost:3000/redirect`.
1. Under **Permissions**, select the **Grant admin consent to openid and offline_access permissions** checkbox.
1. Select **Register**.
1. Select **Overview**.
1. Record the **Application (client) ID** for later use, when you configure the web application.

    ![Screenshot of the web app Overview page for recording your web app I D.](./media/configure-authentication-sample-python-web-app/get-azure-ad-b2c-app-id.png)

### Step 2.2: Create a web app client secret

[!INCLUDE [active-directory-b2c-app-integration-client-secret](../../includes/active-directory-b2c-app-integration-client-secret.md)]

## Step 3: Get the sample web app

[Download the zip file](https://github.com/Azure-Samples/active-directory-b2c-msal-node-sign-in-sign-out-webapp/archive/refs/heads/main.zip), or clone the sample web application from GitHub.

```bash
git clone https://github.com/Azure-Samples/active-directory-b2c-msal-node-sign-in-sign-out-webapp.git
```

Extract the sample file to a folder. You'll get a web app with the following directory structure:

```output
active-directory-b2c-msal-node-sign-in-sign-out-webapp/
├── index.js
└── package.json
└── .env
└── views/
    └── layouts/
        └── main.hbs
    └── signin.hbs
```

The `views` folder contains Handlebars files for the application's user interface.

## Step 4: Install dependencies

1. Open a console window, and change to the directory that contains the Node.js sample app. For example:

    ```bash
    cd active-directory-b2c-msal-node-sign-in-sign-out-webapp
    ```

1. Run the following commands to install app dependencies:

    ```bash
    npm install && npm update
    ```

## Step 5: Configure the sample web app

Open your web app in a code editor such as Visual Studio Code. Under the project root folder, open the *.env* file. This file contains information about your Azure AD B2C identity provider. Update the following app settings properties:  

|Key  |Value  |
|---------|---------|
|`APP_CLIENT_ID`|The **Application (client) ID** for the web app you registered in [step 2.1](#step-2-register-a-web-application). |
|`APP_CLIENT_SECRET`|The client secret value for the web app you created in [step 2.2](#step-22-create-a-web-app-client-secret) |
|`SIGN_UP_SIGN_IN_POLICY_AUTHORITY`|The **Sign in and sign up** user flow authority such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<sign-in-sign-up-user-flow-name>`. Replace `<your-tenant-name>` with the name of your tenant and `<sign-in-sign-up-user-flow-name>` with the name of your Sign in and Sign up user flow such as `B2C_1_susi`. Learn how to [Get your tenant name]( tenant-management-read-tenant-name.md#get-your-tenant-name). |
|`RESET_PASSWORD_POLICY_AUTHORITY`| The **Reset password** user flow authority such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<reset-password-user-flow-name>`. Replace `<your-tenant-name>` with the name of your tenant and `<reset-password-user-flow-name>` with the name of your Reset password user flow such as `B2C_1_reset_password_node_app`.|
|`EDIT_PROFILE_POLICY_AUTHORITY`|The **Profile editing** user flow authority such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<profile-edit-user-flow-name>`. Replace `<your-tenant-name>` with the name of your tenant and `<reset-password-user-flow-name>` with the name of your reset password user flow such as `B2C_1_edit_profile_node_app`. |
|`AUTHORITY_DOMAIN`| The Azure AD B2C authority domain such as `https://<your-tenant-name>.b2clogin.com`. Replace `<your-tenant-name>` with the name of your tenant.|
|`APP_REDIRECT_URI`| The application redirect URI where Azure AD B2C will return authentication responses (tokens). It matches the **Redirect URI** you set while registering your app in Azure portal, and it must be publicly accessible. Leave the value as is.|
|`LOGOUT_ENDPOINT`| The Azure AD B2C sign-out endpoint such as `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<sign-in-sign-up-user-flow-name>/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000`. Replace `<your-tenant-name>` with the name of your tenant and `<sign-in-sign-up-user-flow-name>` with the name of your Sign in and Sign up user flow such as `B2C_1_susi`.|

Your final configuration file should look like the following sample:

:::code language="text" source="~/active-directory-b2c-msal-node-sign-in-sign-out-webapp/.env":::


## Run the sample web app

You can now test the sample app. You need to start the Node server and access it through your browser on `http://localhost:3000`.

1. In your terminal, run the following code to start the Node.js web server:
 
   ```bash
   node index.js
   ```

2. In your browser, go to `http://localhost:3000`. You should see the page with a **Sign in** button.

   :::image type="content" source="./media/configure-a-sample-node-web-app/tutorial-login-page.png" alt-text="Screenshot that shows a Node web app sign in page.":::

### Test sign in

1. After the page with the **Sign in** button completes loading, select **Sign in**. You're prompted to sign in.
1. Enter your sign-in credentials, such as email address and password. If you don't have an account, select **Sign up now** to create an account. After you successfully sign in or sign up, you should see the following page that shows sign-in status.

   :::image type="content" source="./media/configure-a-sample-node-web-app/tutorial-dashboard-page.png" alt-text="Screenshot shows web app sign-in status.":::

### Test profile editing

1. After you sign in, select **Edit profile**. 
1. Enter new changes as required, and then select **Continue**. You should see the page with sign-in status with the new changes, such as **Given Name**. 

### Test password reset

1. After you sign in, select **Reset password**. 
1. In the next dialog that appears, you can cancel the operation by selecting **Cancel**. Alternatively, enter your email address, and then select **Send verification code**. You'll receive a verification code to your email account. Copy the verification code in your email, enter it into the password reset dialog, and then select **Verify code**.
1. Select **Continue**.
1. Enter your new password, confirm it, and then select **Continue**. You should see the page that shows sign-in status.

### Test sign-out

After you sign in, select **Sign out**. You should see the page that has a **Sign in** button. 

## Next steps

- Learn how to [customize and enhance the Azure AD B2C authentication experience for your web app](enable-authentication-in-node-web-app-options.md).
- Learn how to [Enable authentication in your own Node web application using Azure AD B2C](enable-authentication-in-node-web-app.md).
