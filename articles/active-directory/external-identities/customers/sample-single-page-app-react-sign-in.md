---
title: Sign in users in a sample React single-page application
description: Learn how to configure a sample React single-page app (SPA) to sign in and sign out users.
services: active-directory
author: garrodonnell
manager: celestedg
ms.author: godonnell
ms.service: active-directory
ms.subservice: ciam
ms.topic: sample
ms.date: 06/23/2023

#Customer intent: As a dev, devops, I want to learn about how to configure a sample React single-page app to sign in and sign out users with my Microsoft Entra ID for customers tenant
---

# Sign in users in a sample React single-page app (SPA) 

This guide uses a sample React single-page application (SPA) to demonstrate how to add authentication to a SPA. This SPA enables users to sign in and sign out by using you Microsoft Entra ID for customers tenant. The sample uses the [Microsoft Authentication Library for JavaScript (MSAL.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js) to handle authentication.

## Prerequisites
* Although any IDE that supports React applications can be used, **Visual Studio Code** is used for this guide. It can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads) page.
* [Node.js](https://nodejs.org/en/download/).
* Microsoft Entra ID for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>.


## Register the SPA in the Microsoft Entra admin center

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-platform-redirect-url-react.md)]

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)]

## Create a user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)]

## Associate the SPA with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

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
    cd 1-Authentication\1-sign-in-react\SPA
    ```

1. Install the project dependencies:

    ```powershell
    npm install
    ```

## Configure the sample SPA

1. Open _SPA\src\authConfig.js_ and replace the following with the values obtained from the Microsoft Entra admin center
    * `clientId` - The identifier of the application, also referred to as the client. Replace `Enter_the_Application_Id_Here` with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
    * `authority` - The identity provider instance and sign-in audience for the app. Replace `Enter_the_Tenant_Name_Here` with the name of your Microsoft Entra ID for customers tenant.
    * The *Tenant ID* is the identifier of the tenant where the application is registered. Replace the `_Enter_the_Tenant_Info_Here` with the **Directory (tenant) ID** value that was recorded earlier from the overview page of the registered application.
1. Save the file.

## Run your project and sign in
All the required code snippets have been added, so the application can now be called and tested in a web browser.

1. Open a new terminal by selecting **Terminal** > **New Terminal**.
1. Run the following command to start your web server.

    ```powershell
    cd 1-Authentication\1-sign-in-react\SPA
    npm start
    ```

1. Open a web browser and navigate to `http://localhost:3000/`.

1. Sign-in with an account registered to the Microsoft Entra ID for customers tenant.

1. Once signed in the display name is shown next to the **Sign out** button.

## Next steps
> [!div class="nextstepaction"]
> [Enable self-service password reset](./how-to-enable-password-reset-customers.md)
