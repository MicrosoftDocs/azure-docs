---
title: Tutorial - Register an application - Azure Active Directory B2C
description: Learn how to register a web application in Azure Active Directory B2C using the Azure portal.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: article
ms.date: 06/07/2019
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
2. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
3. Select **Applications**, and then select **Add**.
4. Enter a name for the application. For example, *webapp1*.
5. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
6. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. For example, you could set it to listen locally at `https://localhost:44316`. If you don't yet know the port number, you can enter a placeholder value and change it later.

    For testing purposes like this tutorial you can set it to `https://jwt.ms` which displays the contents of a token for inspection. For this tutorial, set the **Reply URL** to `https://jwt.ms`.

    The reply URL must begin with the scheme `https`, and all reply URL values must share a single DNS domain. For example, if the application has a reply URL of `https://login.contoso.com`, you can add to it like this URL `https://login.contoso.com/new`. Or, you can refer to a DNS subdomain of `login.contoso.com`, such as `https://new.login.contoso.com`. If you want to have an application with `login-east.contoso.com` and `login-west.contoso.com` as reply URLs, you must add those reply URLs in this order: `https://contoso.com`, `https://login-east.contoso.com`, `https://login-west.contoso.com`. You can add the latter two because they're subdomains of the first reply URL, `contoso.com`.

7. Click **Create**.

## Create a client secret

If your application exchanges a code for a token, you need to create an application secret.

1. In the **Azure AD B2C - Applications** page, select the application you created, for example *webapp1*.
2. Select **Keys** and then select **Generate key**.
3. Select **Save** to view the key. Make note of the **App key** value. You use this value as the application secret in your application's code.

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Register a web application
> * Create a client secret

Next, learn how to create user flows to enable your users to sign up, sign in, and manage their profiles.

> [!div class="nextstepaction"]
> [Create user flows in Azure Active Directory B2C >](tutorial-create-user-flows.md)
