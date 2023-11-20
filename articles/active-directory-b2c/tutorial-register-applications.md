---
title: "Tutorial: Register a web application in Azure Active Directory B2C"
titleSuffix: Azure AD B2C
description: Follow this tutorial to learn how to register a web application in Azure Active Directory B2C using the Azure portal.
services: active-directory-b2c
author: garrodonnell
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 10/26/2022
ms.custom: project-no-code
ms.author: godonnell
ms.subservice: B2C
---

# Tutorial: Register a web application in Azure Active Directory B2C

Before your [applications](application-types.md) can interact with Azure Active Directory B2C (Azure AD B2C), they must be registered in a tenant that you manage. This tutorial shows you how to register a web application using the Azure portal. 

A "web application" refers to a traditional web application that performs most of the application logic on the server. They may be built using frameworks like ASP.NET Core, Spring (Java), Flask (Python), and Express (Node.js).

> [!IMPORTANT]
> If you're using a single-page application ("SPA") instead (e.g. using Angular, Vue, or React), learn [how to register a single-page application](tutorial-register-spa.md).
> 
> If you're using a native app instead (e.g. iOS, Android, mobile & desktop), learn [how to register a native client application](add-native-application.md).

## Prerequisites
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

If you haven't already created your own [Azure AD B2C Tenant](tutorial-create-tenant.md), create one now. You can use an existing Azure AD B2C tenant.

## Register a web application

To register a web application in your Azure AD B2C tenant, you can use our new unified **App registrations** experience or our legacy  **Applications (Legacy)** experience. [Learn more about the new experience](./app-registrations-training-guide.md).

#### [App registrations](#tab/app-reg-ga/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *webapp1*.
1. Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.
1. Under **Redirect URI**, select **Web**, and then enter `https://jwt.ms` in the URL text box.

    The redirect URI is the endpoint to which the user is sent by the authorization server (Azure AD B2C, in this case) after completing its interaction with the user, and to which an access token or authorization code is sent upon successful authorization. In a production application, it's typically a publicly accessible endpoint where your app is running, like `https://contoso.com/auth-response`. For testing purposes like this tutorial, you can set it to `https://jwt.ms`, a Microsoft-owned web application that displays the decoded contents of a token (the contents of the token never leave your browser). During app development, you might add the endpoint where your application listens locally, like `https://localhost:5000`. You can add and modify redirect URIs in your registered applications at any time.

    The following restrictions apply to redirect URIs:

    * The reply URL must begin with the scheme `https`, unless you use a localhost redirect URL.
    * The reply URL is case-sensitive. Its case must match the case of the URL path of your running application. For example, if your application includes as part of its path `.../abc/response-oidc`,  do not specify `.../ABC/response-oidc` in the reply URL. Because the web browser treats paths as case-sensitive, cookies associated with `.../abc/response-oidc` may be excluded if redirected to the case-mismatched `.../ABC/response-oidc` URL.
    * The reply URL should include or exclude the trailing forward slash as your application expects it. For example, `https://contoso.com/auth-response` and `https://contoso.com/auth-response/` might be treated as nonmatching URLs in your application.

1. Under **Permissions**, select the *Grant admin consent to openid and offline_access permissions* check box.
1. Select **Register**.

#### [Applications (Legacy)](#tab/applications-legacy/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **Applications (Legacy)**, and then select **Add**.
1. Enter a name for the application. For example, *webapp1*.
1. For **Include web app/ web API**, select **Yes**.
1. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. For example, you could set it to listen locally at `http://localhost:5000`. You can add and modify redirect URIs in your registered applications at any time.

    The following restrictions apply to redirect URIs:

    * The reply URL must begin with the scheme `https`, unless using `localhost`.
    * The reply URL is case-sensitive. Its case must match the case of the URL path of your running application. For example, if your application includes as part of its path `.../abc/response-oidc`,  do not specify `.../ABC/response-oidc` in the reply URL. Because the web browser treats paths as case-sensitive, cookies associated with `.../abc/response-oidc` may be excluded if redirected to the case-mismatched `.../ABC/response-oidc` URL.
    * The reply URL should include or exclude the trailing forward slash as your application expects it. For example, `https://contoso.com/auth-response` and `https://contoso.com/auth-response/` might be treated as nonmatching URLs in your application.

1. Select **Create** to complete the application registration.

* * *

> [!TIP]
> If you don't see the app(s) you created under **App registrations**, refresh the portal.

## Create a client secret

For a web application, you need to create an application secret. The client secret is also known as an *application password*. The secret will be used by your application to exchange an authorization code for an access token.

#### [App registrations](#tab/app-reg-ga/)

1. In the **Azure AD B2C - App registrations** page, select the application you created, for example *webapp1*.
1. In the left menu, under **Manage**, select **Certificates & secrets**.
1. Select **New client secret**.
1. Enter a description for the client secret in the **Description** box. For example, *clientsecret1*.
1. Under **Expires**, select a duration for which the secret is valid, and then select **Add**.
1. Record the secret's **Value** for use in your client application code. This secret value is never displayed again after you leave this page. You use this value as the application secret in your application's code.

#### [Applications (Legacy)](#tab/applications-legacy/)

1. In the **Azure AD B2C - Applications** page, select the application you created, for example *webapp1*.
1. Select **Keys** and then select **Generate key**.
1. Select **Save** to view the key. Make note of the **App key** value. You use this value as the application secret in your application's code.

* * *

> [!NOTE]
> For security purposes, you can roll over the application secret periodically, or immediately in case of emergency. Any application that integrates with Azure AD B2C should be prepared to handle a secret rollover event, no matter how frequently it may occur. You can set two application secrets, allowing your application to keep using the old secret during an application secret rotation event. To add another client secret, repeat steps in this section. 

## Enable ID token implicit grant

If you register this app and configure it with [https://jwt.ms/](https://jwt.ms/) app for testing a user flow or custom policy, you need to enable the implicit grant flow in the app registration:

1. In the left menu, under **Manage**, select **Authentication**.

1. Under **Implicit grant and hybrid flows**, select both the **Access tokens (used for implicit flows)** and **ID tokens (used for implicit and hybrid flows)** check boxes.

1. Select **Save**.

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Register a web application
> * Create a client secret

Learn how to [Create user flows in Azure Active Directory B2C](tutorial-create-user-flows.md)
