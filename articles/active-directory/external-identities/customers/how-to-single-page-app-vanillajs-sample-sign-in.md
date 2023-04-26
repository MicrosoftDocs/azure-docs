---
title: Sign in users in a sample vanilla JavaScript single-page application by using Microsoft Entra
description: Learn how to configure a sample SPA to sign in and sign out users by using Microsoft Entra.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.author: owenrichards
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/26/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to configure a sample vanilla JS SPA to sign in and sign out users with my Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in a sample vanilla JavaScript single-page application by using Microsoft Entra

This how-to guide uses a sample vanilla JavaScript Single Page Application (SPA) to demonstrate how to add authentication to a SPA by using Microsoft Entra. The SPA enables users to sign in and sign out by using their own Azure AD for customers tenant. The sample uses the [Microsoft Authentication Library for JavaScript (MSAL.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js) to handle authentication.

In this article:

> [!div class="checklist"]
>
> * Register a web application in the Microsoft Entra admin center.
> * Create a sign in and sign out user flow in Microsoft Entra admin center.
> * Associate your web application with the user flow.
> * Update a vanilla JavaScript SPA web application using your own Azure Active Directory (Azure AD) for customers tenant details.
> * Run and test the sample web application.

## Prerequisites

* Although any IDE that supports vanilla JS applications can be used, **Visual Studio Code** is used for this guide. It can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads) page.
* [Node.js](https://nodejs.org/en/download/).
* Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-hub-free-trial).

## Register the SPA in the Microsoft Entra admin center

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-platform-redirect-url-vanilla-js.md)]

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](/includes/register-app/grant-api-permission-sign-in.md)]

## Create a user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)]

## Associate the SPA with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](.s/includes/configure-user-flow/add-app-user-flow.md)]

## Clone or download sample SPA

To get the sample SPA, you can choose one of the following options:

* Clone the repository using Git:

    ```powershell
        git clone https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial.git
    ```

* [Download the sample](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/archive/refs/heads/main.zip)

If you choose to download the `.zip` file, extract the sample app file to a folder where the total length of the path is 260 or fewer characters.

## Install project dependencies

1. Open a terminal window in the root directory of the sample project, and enter the following snippet to navigate to the project folder:

    ```powershell
        cd 1-Authentication\0-sign-in-vanillajs\App
    ```

1. Install the project dependencies:

    ```powershell
        npm install
    ```

## Configure the sample SPA

1. Open `authConfig.js`.
1. Replace the following values with the values from the Admin center.
    * `clientId` - The identifier of the application, also referred to as the client. Replace `Enter_the_Application_Id_Here` with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
    * `authority` - This is composed of two parts:
        * The *Instance* is endpoint of the cloud provider. Check with the different available endpoints in [National clouds](../develop\authentication-national-cloud.md#azure-ad-authentication-endpoints).
        * The *Tenant ID* is the identifier of the tenant where the application is registered. Replace the `_Enter_the_Tenant_Info_Here` with the **Directory (tenant) ID** value that was recorded earlier from the overview page of the registered application.
1. Save the file.

## Run your project and sign in

All the required code snippets have been added, so the application can now be called and tested in a web browser.

1. Open a new terminal by selecting **Terminal** > **New Terminal**.
1. Run the following command to start your express web server.

    ```powershell
    npm start
    ```

1. Open a web browser and navigate to `http://localhost:3000/`.

1. Sign-in with an account registered to the CIAM tenant.

1. Once signed in the display name is shown next to the **Sign out** button as shown in the following screenshot.

<!-- SCREENSHOT -->

## Next steps

Learn how to use the Microsoft Authentication Library (MSAL) for JavaScript to sign in users and acquire tokens to call Microsoft Graph.
