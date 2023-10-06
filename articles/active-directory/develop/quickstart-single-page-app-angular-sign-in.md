---
title: "Quickstart: Sign in users in a single-page app (SPA) and call the Microsoft Graph API using Angular"
description: In this quickstart, learn how a JavaScript Angular single-page application (SPA) can sign in users of personal accounts, work accounts, and school accounts by using the authorization code flow and call Microsoft Graph.
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart

ms.date: 10/06/2023
ms.author: henrymbugua
ms.reviewer: j-mantu
ms.custom: aaddev, "scenarios:getting-started", "languages:JavaScript", devx-track-js
#Customer intent: As an app developer, I want to learn how to get access tokens and refresh tokens by using the Microsoft identity platform so that my JavaScript Angular app can sign in users of personal accounts, work accounts, and school accounts.
---

# Quickstart: Sign in users in a single-page app (SPA) and call the Microsoft Graph API using Angular

This quickstart uses a sample Angular single-page app (SPA) to show you how to sign in users by using the [authorization code flow](/azure/active-directory/develop/v2-oauth2-auth-code-flow) with Proof Key for Code Exchange (PKCE) and call the Microsoft Graph API. The sample uses the [Microsoft Authentication Library for JavaScript](/javascript/api/@azure/msal-react) to handle authentication.

## Prerequisites

* An Azure account with an active subscription. If you don't already have one, [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) or [Visual Studio Code](https://code.visualstudio.com/)

## Register the application in the Microsoft Entra admin center

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Developer](../roles/permissions-reference.md#application-developer).
1. If access to multiple tenants is available, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which you want to register the application.
1. Browse to **Identity** > **Applications** > **App registrations**.
1. Select **New registration**.
1. When the **Register an application** page appears, enter a name for your application, such as *identity-client-app*.
1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
1. Select **Register**.
1. The application's Overview pane displays upon successful registration. Record the **Application (client) ID** and **Directory (tenant) ID** to be used in your application source code.

## Add a redirect URI

1. Under **Manage**, select **Authentication**.
1. Under **Platform configurations**, select **Add a platform**. In the pane that opens, select **Single-page application**.
1. Set the **Redirect URIs** value to `http://localhost:4200/`. This is the default port NodeJS will listen on your local machine. We’ll return the authentication response to this URI after successfully authenticating the user.
1. Select **Configure** to apply the changes.
1. Under **Platform Configurations** expand **Single-page application**.
1. Confirm that for **Grant types** ![Already configured](media/quickstart-v2-javascript/green-check.png), your **Redirect URI** is eligible for the Authorization Code Flow with PKCE.

## Clone or download the sample application

To obtain the sample application, you can either clone it from GitHub or download it as a .zip file.

- To clone the sample, open a command prompt and navigate to where you wish to create the project, and enter the following command:

    ```console
    git clone https://github.com/Azure-Samples/ms-identity-docs-code-javascript.git
    ```
- [Download the .zip file](https://github.com/Azure-Samples/ms-identity-docs-code-javascript/archive/refs/heads/main.zip). Extract it to a file path where the length of the name is fewer than 260 characters.

## Configure the project

1. In your IDE, open the project folder, *ms-identity-docs-code-javascript/angular-spa*, containing the sample.
1. Open *src/app/app.module.ts* and update the following values with the information recorded earlier in the admin center.

    :::code language="JavaScript" source="~/ms-identity-docs-code-javascript/angular-spa/src/app/app.module.ts":::

    * `clientId` - The identifier of the application, also referred to as the client. Replace the text in quotes with the **Directory (tenant) ID** value that was recorded earlier from the overview page of the registered application.
    * `authority` - The identifier of the tenant where the application is registered. Replace the text in quotes with the **Directory (tenant) ID** that was recorded earlier from the overview page of the registered application.
    * `redirectUri` - The **Redirect URI** of the application. If necessary, replace the text in quotes with the redirect URI that was recorded earlier from the overview page of the registered application.

## Run the application and sign in

Run the project with a web server by using Node.js:

1. To start the server, run the following commands from within the project directory:

    ```console
    npm install
    npm start
    ```

1. Copy the https URL that appears in the terminal, for example, `https://localhost:4200`, and paste it into a browser address bar. We recommend using a private or incognito browser session.
1. Follow the steps and enter the necessary details to sign in with your Microsoft account. You'll be requested an email address so a one time passcode can be sent to you. Enter the code when prompted.
1. The application will request permission to maintain access to data you have given it access to, and to sign you in and read your profile. Select **Accept**. The following screenshot appears, indicating that you have signed in to the application and have accessed your profile details from the Microsoft Graph API.

    :::image type="content" source="./media/quickstarts/angular-spa/quickstart-angular-spa-sign-in.png" alt-text="Screenshot of JavaScript App depicting the results of the API call.":::

## Sign out from the application

1. Find the **Sign out** button in the top right corner of the page, and select it.
1. You'll be prompted to pick an account to sign out from. Select the account you used to sign in.

A message appears indicating that you have signed out. You can now close the browser window.

## Related content

- [Quickstart: Protect an ASP.NET Core web API with the Microsoft identity platform](./quickstart-web-api-aspnet-core-protect-api.md)

- Learn more by building this Angular SPA from scratch with the following series - [Tutorial: Sign in users and call Microsoft Graph](./tutorial-v2-angular-auth-code.md)