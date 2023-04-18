---
title: How-to - Register an app in Azure AD for customers
description: Learn about how to register an app in the customer tenant.
services: active-directory
author: csmulligan
ms.author: cmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/18/2023
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about how to register an app on the Azure portal.
---
# Register your app in your customer tenant

Azure AD for customers enables your organization to manage customers’ identities, and securely control access to your public facing applications and APIs. Applications where your customers can buy your products, subscribe to your services, or access their account and data.  Your customers only need to sign in on a device or a web browser once and have access to all your applications you granted them permissions.
Integrating an application in your customer tenant is a four-step process:

:::image type="content" source="media/how-to-register-ciam-app/app-integration-in-customer-tenant.png" alt-text="Diagram showing the app integration process in the customer tenant.":::

1. Create an application or use an existing one.
2. Add Microsoft Authentication Library (MSAL).
3. Register your application in Azure AD for customers.
4. Create a user flow and associate it with the application you registered.

Azure AD for customers supports authentication for various modern application architectures. The interaction of each application type with the customer tenant is different, therefore, you must specify the type of application you want to register.

In this article, you’ll learn how to register an application in your customer tenant.

## Prerequisites

- An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your Azure AD for customers tenant. [Create a custom tenant](how-to-create-ciam-tenant.md).
- Your application that uses Microsoft Authentication Library (MSAL).

## Choose your app type

# [Single-page app (SPA)](#tab/spa)

How to register your Single-page app?

[!INCLUDE [How to register a SPA?](../customers/includes/register-app/register-client-app-common.md )]

If you want to use Vanilla JS follow the steps below:

[!INCLUDE [Vanilla JS](../customers/includes/register-app/add-platform-redirect-url-vanilla-js.md)]

If you want to use React JS follow the steps below:

[!INCLUDE [React JS](../customers/includes/register-app/add-platform-redirect-url-react.md)]

If you want to use Angular JS follow the steps below:

[!INCLUDE [Angular JS](../customers/includes/register-app/add-platform-redirect-url-angular.md)]

# [Web app](#tab/webapp)

How to register your Web app?

[!INCLUDE [How to register a Web app?](../customers/includes/register-app/register-client-app-common.md)]

If you want to use Node.js follow the steps below:

[!INCLUDE [Node.](../customers/includes/register-app/add-platform-redirect-url-node.md)]

If you need an application or client secret, follow the steps below:

[!INCLUDE [Client secret.](../customers/includes/register-app/add-app-client-secret.md)]

Optionally if that client needs to call an API you can grant permissions: 

[!INCLUDE [Optional permissions.](../customers/includes/register-app/grant-api-permission-call-api.md)]

# [Web API](#tab/webapi)

How to register your Web app?

[!INCLUDE [Register Web API.](../customers/includes/register-app/register-api-app.md)]

If you want to add permissions follow the steps below:

[!INCLUDE [Add permissions.](../customers/includes/register-app/add-api-scopes.md)]



## Next steps
 
- [Create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md)