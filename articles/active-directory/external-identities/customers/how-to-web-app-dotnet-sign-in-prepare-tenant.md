---
title: Tutorial - Prepare your customer tenant to authenticate users in an ASP.NET web app
description: Learn how to configure your Azure Active Directory (Azure AD) for customers tenant for authentication with an ASP.NET web application
services: active-directory
author: cilwerner
manager: celestedg

ms.author: cwerner
ms.service: active-directory
ms.subservice: ciam
ms.custom: devx-track-dotnet
ms.topic: tutorial
ms.date: 05/23/2023
#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own ASP.NET web app with Azure Active Directory (Azure AD) for customers tenant
---

# Tutorial: Prepare your customer tenant to authenticate users in an ASP.NET web app

This tutorial series demonstrates how to build an ASP.NET web application from scratch and prepare it for authentication using the Microsoft Entra admin center. You'll use the [Microsoft Authentication Library for .NET](/entra/msal/dotnet) and [Microsoft Identity Web](/dotnet/api/microsoft-authentication-library-dotnet/confidentialclient) libraries to authenticate your app with your Azure Active Directory (Azure AD) for customers tenant. Finally, you'll run the application and test the sign-in and sign-out experiences.

In this tutorial, you'll;

> [!div class="checklist"]
> * Register a web application in the Microsoft Entra admin center, and record its identifiers
> * Create a client secret for the web application
> * Define the platform and URLs
> * Grant permissions to the web application to access the Microsoft Graph API
> * Create a sign in and sign out user flow in the Microsoft Entra admin center
> * Associate your web application with the user flow

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- This Azure account must have permissions to manage applications. Any of the following Azure AD roles include the required permissions:
    * Application administrator
    * Application developer
    * Cloud application administrator

- An Azure AD for customers tenant. If you haven't already, [create one now](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl). You can use an existing customer tenant if you have one.

## Register the web app and record identifiers

[!INCLUDE [ciam-register-app](./includes/register-app/register-client-app-common.md)]

## Add a platform redirect URL

[!INCLUDE [ciam-register-app](./includes/register-app/add-platform-redirect-url-dotnet.md)]

## Add app client secret

[!INCLUDE [ciam-add-client-secret](./includes/register-app/add-app-client-secret.md)]

## Grant API permissions

[!INCLUDE [ciam-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)]

## Create a user flow

[!INCLUDE [ciam-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)]

## Associate the web application with the user flow

[!INCLUDE [ciam-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Next steps

> [!div class="nextstepaction"]
> [Prepare ASP.NET web app](how-to-web-app-dotnet-sign-in-prepare-app.md)
