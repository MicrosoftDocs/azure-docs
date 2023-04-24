---
title: Sign in users in your own ASP.NET web application by using Microsoft Entra - Prepare your tenant
description: Learn about how to prepare your CIAM tenant for customers to sign in users in your own ASP.NET web application by using Microsoft Entra.
services: active-directory
author: cilwerner
manager: celestedg

ms.author: cwerner
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/14/2023
ms.custom: developer
#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own ASP.NET web app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your own ASP.NET web application by using Microsoft Entra - Prepare your tenant

This how-to guide will demonstrate how to, you prepare your Azure Active Directory (Azure AD) for customers tenant for authentication. You will register a web application in the Microsoft Entra admin center, and record its identifiers. You will then create a sign in and sign out user flow in the Microsoft Entra admin center and associate your web application with the user flow.

## Prerequisites

- Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-hub-free-trial).

If you have already registered a web application in the Microsoft Entra admin center, and associated it with a user flow, you can skip the steps in this article and move to [Sign in users in your own ASP.NET web application by using Microsoft Entra - Prepare your application](how-to-web-app-dotnet-sign-in-prepare-app.md).

## Register the web app

[!INCLUDE [ciam-register-app](./includes/register-app/register-client-app-common.md)]

## Define the platform and URLs

1. In the Microsoft Entra admin center, under **Manage**, select **App registrations**, and then select the application that was previously created.
1. In the left menu, under **Manage**, select **Authentication**.
1. In **Platform configurations**, select **Add a platform**, and then select **Web**.
1. Under **Redirect URIs**, enter the `applicationURL` and the `CallbackPath`, `/signin-oidc`, in the form of `https://localhost:{port}/signin-oidc`.
1. Under **Front-channel logout URL**, enter the following URL for signing out, `https://localhost:{port}/signout-callback-oidc`.
1. Under **Implicit grant and hybrid flows**, select the **ID tokens** checkbox.
1. Select **Configure**.

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
> [Sign in users in your own ASP.NET web application by using Microsoft Entra - Prepare your application](how-to-web-app-dotnet-sign-in-prepare-app.md)