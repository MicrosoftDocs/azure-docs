---
title: Register an app in a customer tenant
description: Learn how to register an app in your customer tenant.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: overview
ms.date: 03/03/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Add and register an app in your customer tenant

Before your applications can interact with Azure AD, they must be registered in your customer tenant. This tutorial shows you how to register a single page application (SPA) using the Azure portal. 

Single-page apps refer to modern web apps that are built as client-side single-page applications. Developers write them by using JavaScript or an SPA framework such as Angular, Vue, and React. These applications are published to web servers, such as [Azure Static Web Apps](https://azure.microsoft.com/products/app-service/static). In this tutorial, you learn how to register and run a SPA app locally on your machine.

> [!TIP]
> Check out the [Microsoft identity platform code samples](https://learn.microsoft.com/azure/active-directory/develop/sample-v2-code) for guidance how to register and configure [mobile apps](https://learn.microsoft.com/azure/active-directory/develop/sample-v2-code#mobile), [desktop apps](https://learn.microsoft.com/azure/active-directory/develop/sample-v2-code#desktop), [single-page apps](https://learn.microsoft.com/azure/active-directory/develop/sample-v2-code#single-page-applications) or [traditional web apps](https://learn.microsoft.com/azure/active-directory/develop/sample-v2-code#web-applications). 

## Overview

OpenID Connect (OIDC) is an authentication protocol that's built on OAuth 2.0. You can use it to securely sign a user into an application. This SPA sample uses [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser) and the OpenID Connect PKCE flow. MSAL.js is a Microsoft provided library that simplifies adding authentication and authorization support to SPAs.

## Prerequisites

- If you haven't already created your own Azure AD customer tenant, create one now<!--](1-Create-a-CIAM-tenant.md)-->.
- To run and test the SPA application, make sure that your computer is running [Visual Studio Code](https://code.visualstudio.com/) or another code editor.

## Step 1. Register SPA application

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. If you have access to multiple tenants, use the **Directories + subscriptions** filter in the top menu to switch to the customer tenant created earlier.

1. In the Azure portal, search for and select **Azure Active Directory**.

1. Under **Manage**, select **App registrations** > **New registration**.

1. Enter a display Name for your application. For example, *My test app*. Customers of your application might see the display name when they use the app, for example during sign-in. You can change the display name at any time and multiple app registrations can share the same display name. 

1. Under **Supported account types**, specify who can use the application, sometimes called its sign-in audience. For customer applications, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.

1. Under **Redirect URI**, select **Single page application (SPA)**, and then enter `http://localhost:3000` in the URL text box.

1. Select **Register** to complete the app registration.

    The following screenshot shows you how to register a SPA app.

<!--    ![Screenshot that shows how to register a single page application in Azure portal.](./media/ciam-pp1/register-spa-app.png)-->

1. When registration finishes, the Azure portal displays the app registration's **Overview** pane. Record the **Application (client) ID**, and the **Directory (tenant) ID** to use later, when you configure the SPA application. The client ID uniquely identifies your application in the Microsoft identity platform. 

<!--    ![Screenshot that shows how to copy the application ID.](./media/ciam-pp1/app-registration-overview.png)-->

## Step 2. Get the SPA sample code

In this tutorial we user a sample application that demonstrates how a single-page application, which lets users sign-in or sign-up to Azure AD using the Microsoft Authentication Library for JavaScript (MSAL.js). To get the SPA sample code, complete either of the following steps:

- [Download a zip file.](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/archive/refs/heads/main.zip)
- Clone the sample from GitHub by running the following command:

    ```bash
    git clone https://github.com/Azure-Samples/ms-identity-javascript-tutorial
    ```

You can found the sample code for this article in the [1-Authentication/1-sign-in](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/1-Authentication/1-sign-in) folder.

<!--## Next steps

In this tutorial you learned how to register and download a SPA application. There's one more step you need to complete before you can run and test the app. Continue to the next step, [quickstart step 3: Create a sign-up and sign-in user flow](3-Create-sign-up-and-sign-in-user-flow.md)-->
