---
title: Sign in users in a sample vanilla JavaScript single-page application
description: Learn how to configure a sample JavaSCript single-page application (SPA) to sign in and sign out users.
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.author: owenrichards
ms.service: active-directory
ms.subservice: ciam
ms.custom: devx-track-js
ms.topic: sample
ms.date: 06/23/2023
#Customer intent: As a dev, devops, I want to learn about how to configure a sample vanilla JS SPA to sign in and sign out users with my Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in a sample vanilla JavaScript single-page application

This how-to guide uses a sample vanilla JavaScript single-page Application (SPA) to demonstrate how to add authentication to a SPA. The SPA enables users to sign in and sign out by using their own Azure Active Directory (AD) for customers tenant. The sample uses the [Microsoft Authentication Library for JavaScript (MSAL.js)](https://github.com/AzureAD/microsoft-authentication-library-for-js) to handle authentication.

## Prerequisites

* Although any IDE that supports vanilla JS applications can be used, **Visual Studio Code** is recommended for this guide. It can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads) page.
* [Node.js](https://nodejs.org/en/download/).
* Azure AD for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>.

## Register the SPA in the Microsoft Entra admin center

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-platform-redirect-url-vanilla-js.md)]

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
        cd 1-Authentication\0-sign-in-vanillajs\App
    ```

1. Install the project dependencies:

    ```powershell
        npm install
    ```

## Configure the sample SPA

1. Open `authConfig.js`.
1. Find `Enter_the_Tenant_Name_Here` and replace it with the name of your tenant.
1. In **Authority**, find `Enter_the_Tenant_Subdomain_Here` and replace it with the subdomain of your tenant. For example, if your tenant primary domain is *caseyjensen@onmicrosoft.com*, the value you should enter is *casyjensen*.
1. Save the file.

## Run your project and sign in

1. Open a new terminal and run the following command to start your express web server.

    ```powershell
    npm start
    ```

1. Open a web browser and navigate to `http://localhost:3000/`.
1. Select **No account? Create one**, which starts the sign-up flow.
1. In the **Create account** window, enter the email address registered to your customer tenant, which starts the sign-up flow as a user for your application.
1. After entering a one-time passcode from the customer tenant, enter a new password and more account details, this sign-up flow is completed.
1. If a window appears prompting you to **Stay signed in**, choose either **Yes** or **No**.
1. The SPA will now display a button saying **Request Profile Information**. Select it to display profile data.

    :::image type="content" source="media/how-to-spa-vanillajs-sign-in-sign-in-out/display-vanillajs-welcome.png" alt-text="Screenshot of sign in into a vanilla JS SPA." lightbox="media/how-to-spa-vanillajs-sign-in-sign-in-out/display-vanillajs-welcome.png":::

## Sign out of the application

1. To sign out of the application, select **Sign out** in the navigation bar.
1. A window appears asking which account to sign out of.
1. Upon successful sign out, a final window appears advising you to close all browser windows.

## Next steps

> [!div class="nextstepaction"]
> [Enable self-service password reset](./how-to-enable-password-reset-customers.md)
