---
title: "Tutorial: Register an application"
titleSuffix: Azure AD B2C
description: Learn how to register a web application in Azure Active Directory B2C using the Azure portal.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: article
ms.date: 10/16/2019
ms.author: marsma
ms.subservice: B2C
---

# Tutorial: Register an application in Azure Active Directory B2C

Before your [applications](active-directory-b2c-apps.md) can interact with Azure Active Directory B2C (Azure AD B2C), they must be registered in a tenant that you manage. This tutorial shows you how to register a web application using the Azure portal.

In this article, you learn how to:

> [!div class="checklist"]
> * Register a web application
> * Create a client secret

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

If you haven't already created your own [Azure AD B2C Tenant](tutorial-create-tenant.md), create one now. You can use an existing Azure AD B2C tenant.

## Register a web application

To register an application in your Azure AD B2C tenant, you can use the current **Applications** experience, or our new unified **App registrations (Preview)** experience. [Learn more about the new experience](https://aka.ms/b2cappregintro).

#### [Applications](#tab/applications/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **Applications**, and then select **Add**.
1. Enter a name for the application. For example, *webapp1*.
1. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
1. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. For example, you could set it to listen locally at `https://localhost:44316`. If you don't yet know the port number, you can enter a placeholder value and change it later.

    For testing purposes like this tutorial you can set it to `https://jwt.ms` which displays the contents of a token for inspection. For this tutorial, set the **Reply URL** to `https://jwt.ms`.

    The following restrictions apply to reply URLs:

    * The reply URL must begin with the scheme `https`.
    * The reply URL is case-sensitive. Its case must match the case of the URL path of your running application. For example, if your application includes as part of its path `.../abc/response-oidc`,  do not specify `.../ABC/response-oidc` in the reply URL. Because the web browser treats paths as case-sensitive, cookies associated with `.../abc/response-oidc` may be excluded if redirected to the case-mismatched `.../ABC/response-oidc` URL.

1. Select **Create** to complete the application registration.

#### [App registrations (Preview)](#tab/app-reg-preview/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **App registrations (Preview)**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *webapp1*.
1. Select **Accounts in any organizational directory or any identity provider**.
1. Under **Redirect URI**, select **Web**, and then enter `https://jwt.ms` in the URL text box.

    The redirect URI is the endpoint to which the user is sent by the authorization server (Azure AD B2C, in this case) after completing its interaction with the user, and to which an access token or authorization code is sent upon successful authorization. In a production application, it's typically a publicly accessible endpoint where your app is running, like `https://contoso.com/auth-response`. For testing purposes like this tutorial, you can set it to `https://jwt.ms`, a Microsoft-owned web application that displays the decoded contents of a token (the contents of the token never leave your browser). During app development, you might add the endpoint where your application listens locally, like `https://localhost:5000`. You can add and modify redirect URIs in your registered applications at any time.

    The following restrictions apply to redirect URIs:

    * The reply URL must begin with the scheme `https`.
    * The reply URL is case-sensitive. Its case must match the case of the URL path of your running application. For example, if your application includes as part of its path `.../abc/response-oidc`,  do not specify `.../ABC/response-oidc` in the reply URL. Because the web browser treats paths as case-sensitive, cookies associated with `.../abc/response-oidc` may be excluded if redirected to the case-mismatched `.../ABC/response-oidc` URL.

1. Under **Permissions**, select the *Grant admin consent to openid and offline_access permissions* check box.
1. Select **Register**.

Once the application registration is complete, enable the implicit grant flow:

1. Under **Manage**, select **Authentication**.
1. Select **Try out the new experience** (if shown).
1. Under **Implicit grant**, select both the **Access tokens** and **ID tokens** check boxes.
1. Select **Save**.

* * *

## Create a client secret

If your application exchanges an authorization code for an access token, you need to create an application secret.

#### [Applications](#tab/applications/)

1. In the **Azure AD B2C - Applications** page, select the application you created, for example *webapp1*.
1. Select **Keys** and then select **Generate key**.
1. Select **Save** to view the key. Make note of the **App key** value. You use this value as the application secret in your application's code.

#### [App registrations (Preview)](#tab/app-reg-preview/)

1. In the **Azure AD B2C - App registrations (Preview)** page, select the application you created, for example *webapp1*.
1. Under **Manage**, select **Certificates & secrets**.
1. Select **New client secret**.
1. Enter a description for the client secret in the **Description** box. For example, *clientsecret1*.
1. Under **Expires**, select a duration for which the secret is valid, and then select **Add**.
1. Record the secret's **Value**. You use this value as the application secret in your application's code.

* * *

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Register a web application
> * Create a client secret

Next, learn how to create user flows to enable your users to sign up, sign in, and manage their profiles.

> [!div class="nextstepaction"]
> [Create user flows in Azure Active Directory B2C >](tutorial-create-user-flows.md)
