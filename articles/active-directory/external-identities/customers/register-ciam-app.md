---
title: How-to - Register an app in CIAM
description: Learn about how to register a single page application (SPA) using the Azure portal.
services: active-directory
author: csmulligan
ms.author: cmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 03/06/2023
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about how to register a single page application (SPA) on the Azure portal.
---
# Add and register an app in your customer tenant

Before your applications can interact with Azure AD, they must be registered in your customer tenant. This article shows you how to register a single page application (SPA) using the Azure portal. 

Single-page apps refer to modern web apps that are built as client-side single-page applications (SPA). Developers write them by using JavaScript or an SPA framework such as Angular, Vue, and React. These applications are published to web servers, such as [Azure Static Web Apps](/azure/static-web-apps/overview). In this article, you'll learn how to register and run a SPA app locally on your machine.

> [!TIP]
> Check out the [Microsoft identity platform code samples](/azure/active-directory/develop/sample-v2-code) for guidance how to register and configure [mobile apps](/azure/active-directory/develop/sample-v2-code#mobile), [desktop apps](/azure/active-directory/develop/sample-v2-code#desktop), [single-page apps](/azure/active-directory/develop/sample-v2-code#single-page-applications) or [traditional web apps](/azure/active-directory/develop/sample-v2-code#web-applications). 

## Overview

OpenID Connect (OIDC) is an authentication protocol that's built on OAuth 2.0. You can use it to securely sign a user into an application. This SPA sample uses [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser) and the OpenID Connect PKCE flow. MSAL.js is a Microsoft provided library that simplifies adding authentication and authorization support to SPAs.

## Prerequisites

- If you haven't already created your own Azure AD customer tenant, [create one now](quickstart-customer-tenant-portal.md).
- To run and test the SPA application, make sure that your computer is running [Visual Studio Code](https://code.visualstudio.com/) or another code editor.

## How to register SPA application

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. If you have access to multiple tenants, use the **Directories + subscriptions** filter in the top menu to switch to the CIAM tenant created earlier.

1. In the Azure portal, search for and select **Azure Active Directory**.

1. Under **Manage**, select **App registrations** > **New registration**.

1. Enter a display Name for your application. For example, *My test app*. Customers of your application might see the display name when they use the app, for example during sign-in. You can change the display name at any time and multiple app registrations can share the same display name. 

1. Under **Supported account types**, specify who can use the application, sometimes called its sign-in audience. For customer applications, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.

1. Under **Redirect URI**, select **Single page application (SPA)**, and then enter `http://localhost:3000` in the URL text box.

1. Select **Register** to complete the app registration.

1. When registration finishes, the Azure portal displays the app registration's **Overview** pane. Record the **Application (client) ID**, and the **Directory (tenant) ID** to use later, when you configure the SPA application. The client ID uniquely identifies your application in the Microsoft identity platform. 

## Get the SPA sample code

In this article, we use a sample application that demonstrates how a single-page application, which lets users sign in or sign up to Azure AD using the Microsoft Authentication Library for JavaScript (MSAL.js). To get the SPA sample code, you can do either of the following:

- [Download a zip file.](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/archive/refs/heads/main.zip)
- Clone the sample from GitHub by running the following command:

    ```bash
    git clone https://github.com/Azure-Samples/ms-identity-javascript-tutorial
    ```

You can found the sample code for this article in the [1-Authentication/1-sign-in](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/tree/main/1-Authentication/1-sign-in) folder.

## Next steps

In this article you learned how to register and download a SPA application. To run and test the app, you have to add it to a [user flow](how-to-user-flow-sign-up-sign-in-customers.md). You can also [customize the app's sign-in and sign-up page branding](how-to-customize-branding-customers.md) for your customers. 
