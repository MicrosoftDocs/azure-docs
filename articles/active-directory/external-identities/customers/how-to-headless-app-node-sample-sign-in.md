---
title: Sign in users in a sample Node.js headless application by using Microsoft Entra
description: Learn how to configure a sample headless application to sign in and sign out users by using Microsoft Entra.
services: active-directory
author: Dickson-Mwendia
manager: mwongerapk

ms.author: dmwendia
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/30/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to configure a sample Node.js headless application to authenticate users with my Azure Active Directory (Azure AD) for customers tenant
---

# Authenticate users in a sample Node.js headless application by using Microsoft Entra

This how-to guide uses a sample Node.js headless application to show how to add authentication to a headless application by using Microsoft Entra. The sample application uses the device code flow to authenticate users against Azure Active Directory (Azure AD) CIAM.

In this article, you do the following tasks:

- Register a headless application in the Microsoft Entra admin center. 

- Create a sign in and sign out user flow in Microsoft Entra admin center.

- Associate your headless application with the user flow. 

- Update a sample Node.js headless application using your own Azure AD for customers tenant.

- Run and test the sample headless application.

## Prerequisites

- [Node.js](https://nodejs.org).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](https://developer.microsoft.com/identity/customers). 

<!--Awaiting this link http://developer.microsoft.com/identity/customers to go live on Developer hub-->


## Register the headless app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-platform-redirect-url-node.md)]  

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the headless application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Clone or download sample headless application

To get the headless app sample code, you can do either of the following tasks:

- [Download the .zip file](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/archive/refs/heads/main.zip) or clone the sample headless application from GitHub by running the following command:

    ```powershell
        git clone https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial.git
    ```
If you choose to download the `.zip` file, extract the sample app file to a folder where the total length of the path is 260 or fewer characters.

## Install project dependencies 

1. Open a console window, and change to the directory that contains the Node.js sample app. For example:

    ```powershell
        cd 1-Authentication\5-sign-in-express\App
    ```
1. Run the following commands to install app dependencies:

    ```powershell
        npm install && npm update
    ```

## Configure the sample headless app

1. In your code editor, open `App\authConfig.js` file. 

1. Find the placeholder: 
    
    1. `Enter_the_Application_Id_Here` and replace it with the Application (client) ID of the app you registered earlier.
    
    1. `Enter_the_Tenant_Info_Here` and replace it with the Directory (tenant) ID you copied earlier.

## Run and test sample headless app 

You can now test the sample Node.js headless app. You need to start the Node.js server and access it through your browser at `http://localhost:3000`.

1. In your terminal, run the following command:

    ```powershell
        npm start 
    ```

1. Open your browser, then go to http://localhost:3000. You should see the page similar to the following screenshot:


1. After the page completes loading, select **Sign in** link. You're prompted to sign in.

1. On the sign-in page, type your **Email address**. If you don't have an account, select **No account? Create one**, which starts the sign-up flow.

1. If you choose the sign-up option, after filling in your email, one-time passcode, new password and more account details, you complete the whole sign-up flow. You see a page similar to the following screenshot. You see a similar page if you choose the sign-in option.

1. Select **Sign out** to sign user out of the headless app or select **View ID token claims** to view ID token claims returned by Microsoft Entra. 

## Next steps

Learn how to: 

- [Sign in users in your own Node.js headless application by using Microsoft Entra](how-to-headless-app-node-sign-in-overview.md)