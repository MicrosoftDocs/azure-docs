---
title: Prepare your tenant - Sign in users to an ASP.NET web app
description: Learn about how to prepare your Azure Active Directory (AD) for customers tenant for customers to sign in users in your own ASP.NET web application by using Azure AD for customers tenant.
services: active-directory
author: cilwerner
manager: celestedg

ms.author: cwerner
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/23/2023
ms.custom: developer
#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own ASP.NET web app with Azure Active Directory (Azure AD) for customers tenant
---

# Prepare your tenant: Sign in users to an ASP.NET web app using an Azure Active Directory (AD) for customers tenant

This how-to guide demonstrates how to prepare your Azure Active Directory (Azure AD) for customers tenant for authentication. You'll register a web application in the Microsoft Entra admin center, and record its identifiers. You'll then create a sign in and sign out user flow in the Microsoft Entra admin center and associate your web application with the user flow.

## Prerequisites

- Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl).

If you have already registered a web application in the Microsoft Entra admin center, and associated it with a user flow, you can skip the steps in this article and move to [Prepare your application](how-to-web-app-dotnet-sign-in-prepare-app.md).

## Register the web app

[!INCLUDE [ciam-register-app](./includes/register-app/register-client-app-common.md)]

## Define the platform and URLs

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
> [Prepare your application](how-to-web-app-dotnet-sign-in-prepare-app.md)
