---
title: Tutorial - Register an application - Azure Active Directory B2C
description: Learn how to register a web application in Azure Active Directory B2C using the Azure portal.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: article
ms.date: 08/23/2019
ms.author: marsma
ms.subservice: B2C
---

# Tutorial: Register an application in Azure Active Directory B2C

Before your [applications](active-directory-b2c-apps.md) can interact with Azure Active Directory (Azure AD) B2C, they must be registered in a tenant that you manage. This tutorial shows you how to register a web application using the Azure portal.

In this article, you learn how to:

> [!div class="checklist"]
> * Register a web application
> * Create a client secret

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

If you haven't already created your own [Azure AD B2C Tenant](tutorial-create-tenant.md), create one now. You can use an existing Azure AD B2C tenant.

## Register a web application

1. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Applications**, and then select **Add**.
1. Enter a name for the application. For example, *webapp1*.
1. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
1. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. For example, you could set it to listen locally at `https://localhost:44316`. If you don't yet know the port number, you can enter a placeholder value and change it later.

    For testing purposes like this tutorial you can set it to `https://jwt.ms` which displays the contents of a token for inspection. For this tutorial, set the **Reply URL** to `https://jwt.ms`.

    The following restrictions apply to reply URLs:

    * The reply URL must begin with the scheme `https`.
    * The reply URL is case-sensitive. Its case must match the case of the URL path of your running application. For example, if your application includes as part of its path `.../abc/response-oidc`,  do not specify `.../ABC/response-oidc` in the reply URL. Because the web browser treats paths as case-sensitive, cookies associated with `.../abc/response-oidc` may be excluded if redirected to the case-mismatched `.../ABC/response-oidc` URL.

1. Click **Create** to complete the application registration.

## Create a client secret

If your application exchanges a code for a token, you need to create an application secret.

1. In the **Azure AD B2C - Applications** page, select the application you created, for example *webapp1*.
1. Select **Keys** and then select **Generate key**.
1. Select **Save** to view the key. Make note of the **App key** value. You use this value as the application secret in your application's code.

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Register a web application
> * Create a client secret

Next, learn how to create user flows to enable your users to sign up, sign in, and manage their profiles.

> [!div class="nextstepaction"]
> [Create user flows in Azure Active Directory B2C >](tutorial-create-user-flows.md)
