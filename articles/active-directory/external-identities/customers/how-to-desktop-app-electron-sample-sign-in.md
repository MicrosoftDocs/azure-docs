---
title: Sign in users in a sample Electron desktop application.
description: Learn how to configure a sample Electron desktop to sign in and sign out users.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/22/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to configure a sample Electron desktop app to sign in and sign out users with my Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in a sample Electron desktop application

This how-to guide uses a sample Electron desktop application to show how to add authentication to a desktop application. The sample application enables users to sign in and sign out. The sample web application uses [Microsoft Authentication Library (MSAL)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) for Node to handle authentication.

In this article, you do the following tasks:

- Register a desktop application in the Microsoft Entra admin center. 

- Create a sign-in and sign-out user flow in Microsoft Entra admin center.

- Associate your web application with the user flow. 

- Update a sample Electron desktop application using your own Azure Active Directory (Azure AD) for customers tenant details.

- Run and test the sample desktop application.

## Prerequisites

- [Node.js](https://nodejs.org).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>.
<!--Awaiting this link http://developer.microsoft.com/identity/customers to go live on Developer hub-->

## Register desktop app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-platform-redirect-url-electron.md)] 

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Configure optional claims

[!INCLUDE [active-directory-configure-optional-claims](./includes/register-app/add-optional-claims-id.md)] 
 
## Create a user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the web application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Clone or download sample web application

To get the desktop app sample code, [download the .zip file](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/archive/refs/heads/main.zip) or clone the sample web application from GitHub by running the following command:

```powershell
git clone https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial.git
```

If you choose to download the `.zip` file, extract the sample app file to a folder where the total length of the path is 260 or fewer characters.

## Install project dependencies

1. Open a console window, and change to the directory that contains the Electron sample app:

    ```powershell
    cd 1-Authentication\3-sign-in-electron\App
    ```
1. Run the following commands to install app dependencies:

    ```powershell
    npm install && npm update
    ```

## Configure the sample web app

1. In your code editor, open `App\authConfig.js` file.

1. Find the placeholder:
 
    1. `Enter_the_Application_Id_Here` and replace it with the Application (client) ID of the app you registered earlier.

    1. `Enter_the_Tenant_Subdomain_Here` and replace it with the Directory (tenant) subdomain. For example, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

## Run and test sample web app

You can now test the sample Electron desktop app. After you run the app, the desktop app window appears automatically:

1. In your terminal, run the following command:

    ```powershell
    npm start
    ```

    :::image type="content" source="media/how-to-desktop-app-electron-sample-sign-in/desktop-app-electron-sign-in.png" alt-text="Screenshot of sign in into an electron desktop app.":::

1. On the desktop window that appears, select the **Sign In** or **Sign up** button. A browser window opens, and you're prompted to sign in.

1. On the browser sign-in page, type your **Email address**, select **Next**, type your **Password**, then select **Sign in**. If you don't have an account, select **No account? Create one** link, which starts the sign-up flow.

1. If you choose the sign-up option, after filling in your email, one-time passcode, new password and more account details, you complete the whole sign-up flow. You see a page similar to the following screenshot. You see a similar page if you choose the sign-in option. The page displays token ID claims.

    :::image type="content" source="media/how-to-desktop-app-electron-sample-sign-in/desktop-app-electron-view-claims.png" alt-text="Screenshot of view token claims in an electron desktop app.":::

## Next steps

- [Enable password reset](how-to-enable-password-reset-customers.md).

- [Customize the default branding](how-to-customize-branding-customers.md).

- [Configure sign-in with Google](how-to-google-federation-customers.md).

- [Explore the Electron desktop app sample code](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/tree/main/1-Authentication/3-sign-in-electron#about-the-code).
