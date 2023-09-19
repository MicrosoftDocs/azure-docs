---
title: Sign in users in a sample Node.js browserless application using the Device Code flow
description: Learn how to configure a sample browserless application to sign in users in an Azure Active Directory (Azure AD) for customers tenant
services: active-directory
author: Dickson-Mwendia
manager: mwongerapk

ms.author: dmwendia
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: sample
ms.date: 06/23/2023
ms.custom: developer, devx-track-js
#Customer intent: As a dev, devops, I want to learn about how to configure a sample Node.js browserless application to authenticate users with my Azure Active Directory (Azure AD) for customers tenant
---

# Authenticate users in a sample Node.js browserless application using the Device Code flow

This how-to guide uses a sample Node.js application to show how to sign in users in a browserless application. The sample application uses the device code flow to sign in  users in an Azure Active Directory (Azure AD) for customers tenant. 

In this article, you complete the following tasks:

- Register an application in the Microsoft Entra admin center. 

- Create a sign-in and sign-out user flow in Microsoft Entra admin center.

- Associate your browserless application with the user flow. 

- Update a sample Node.js browserless application using your own Azure AD for customers tenant.

- Run and test the sample browserless application.

## Prerequisites

- [Node.js](https://nodejs.org).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>. 

## Register the browserless app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)] 
[!INCLUDE [active-directory-b2c-enable-public-client-flow](./includes/register-app/enable-public-client-flow.md)]  

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the browserless application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Clone or download sample browserless application

To get the browserless app sample code, you can do either [download the .zip file](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/archive/refs/heads/main.zip) or clone the sample browserless application from GitHub by running the following command:

```powershell
    git clone https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial.git
```

## Install project dependencies 

1. Open a console window, and navigate to the directory that contains the Node.js sample app. For example:

    ```powershell
        cd 1-Authentication\4-sign-in-device-code\App
    ```
1. Run the following command to install app dependencies:

    ```powershell
        npm install
    ```

## Update the sample app to use its Azure app registration details

1. In your code  editor, open the `App\authConfig.js` file. 

1. Find the placeholder: 
    
    1. `Enter_the_Application_Id_Here` and replace it with the Application (client) ID of the app you registered earlier.
    
    1. Find the placeholder `Enter_the_Tenant_Subdomain_Here` and replace it with the Directory (tenant) subdomain. For instance, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant domain name,  [learn how to read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

## Run and test sample browserless app 

You can now test the sample Node.js browserless app.

1. In your terminal, run the following command:

    ```powershell
        npm start 
    ```

1. Open your browser, then go to the URL suggested from the message in the terminal, https://microsoft.com/devicelogin. You should see a page similar to the following screenshot:

     :::image type="content" source="media/how-to-browserless-app-node-sample-sign-in/browserless-app-node-sign-in-enter-code.png" alt-text="Screenshot of the enter code prompt in a node browserless application using the device code flow.":::

1. To authenticate, copy the device code from the message in the terminal then paste it in the **Enter Code** prompt. After entering the code, you'll be redirected to the sign-in page as follows:

     :::image type="content" source="media/how-to-browserless-app-node-sample-sign-in/browserless-app-node-sign-in-page.png" alt-text="Screenshot showing the sign in page in a node browserless application.":::

1. On the sign-in page, type your **Email address**. If you don't have an account, select **No account? Create one**, which starts the sign-up flow.

1. If you choose the sign-up option, after filling in your email, one-time passcode, new password and more account details, you complete the whole sign-up flow. After completing the sign up flow and signing in, you see a page similar to the following screenshot:

     :::image type="content" source="media/how-to-browserless-app-node-sample-sign-in/browserless-app-node-signed-in-user.png" alt-text="Screenshot showing a signed-in user in a node browserless application.":::

1. Move back to the terminal and see your authentication information including the ID token claims returned by Microsoft Entra.

## Next steps 

Learn how to: 

- [Sign in users in your own Node.js browserless application by using Microsoft Entra](how-to-browserless-app-node-sign-in-overview.md)
