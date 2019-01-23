---
title: Tutorial - Register your applications in Azure Active Directory B2C | Microsoft Docs
description: Learn how to register your applications in Azure Active Directory B2C using the Azure portal.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory-b2c
ms.workload: identity
ms.topic: article
ms.date: 01/11/2019
ms.author: davidmu

---
# Tutorial: Register your applications in Azure Active Directory B2C

Before your [applications](active-directory-b2c-apps.md) can interact with Azure Active Directory (Azure AD) B2C, they must be registered in a tenant that you manage. This tutorial shows you how to register applications using the Azure portal.

In this article, you learn how to:

> [!div class="checklist"]
> * Register a web application
> * Register a web API
> * Register a mobile or native application

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

If you haven't already created your own [Azure AD B2C Tenant](tutorial-create-tenant.md), create one now. You can use an existing tenant.

## Register a web application

1. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.

    ![Switch to subscription directory](./media/tutorial-register-applications/switch-directories.png)

2. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
3. Select **Applications**, and then select **Add**.

    ![Add application](./media/tutorial-register-applications/add-application.png)

4. Enter a name for the application. For example, *webapp1*.
5. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
6. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. For example, you can set it to listen locally at `https://localhost:44316` If you don't yet know the port number, you can enter a placeholder value and change it later. For testing purposes you could set it to `https://jwt.ms`, which displays the contents of a token for inspection. For this tutorial, set it to `https://jwt.ms`. 

    The reply URL must begin with the scheme `https`, and all reply URL values must share a single DNS domain. For example, if the application has a reply URL of `https://login.contoso.com`, you can add to it like this URL `https://login.contoso.com/new`. Or, you can refer to a DNS subdomain of `login.contoso.com`, such as `https://new.login.contoso.com`. If you want to have an application with `login-east.contoso.com` and `login-west.contoso.com` as reply URLs, you must add those reply URLs in this order: `https://contoso.com`, `https://login-east.contoso.com`, `https://login-west.contoso.com`. You can add the latter two because they're subdomains of the first reply URL, `contoso.com`.

7. Click **Create**.

    ![Set application properties](./media/tutorial-register-applications/application-properties.png)

### Create a client secret

If you’re application exchanges a code for a token, you need to create an application secret.

1. Select **Keys** and then click **Generate key**.

    ![Generate keys](./media/tutorial-register-applications/generate-keys.png)

2. Select **Save** to view the key. Make note of the **App key** value. You use the value as the application secret in your application's code.

    ![Save the key](./media/tutorial-register-applications/save-key.png)
    
3. Select **API Access**, click **Add**, and select your web API and scopes (permissions).

    ![Configure API access](./media/tutorial-register-applications/api-access.png)

## Register a web API

1. Select **Applications**, and then select **Add**.
3. Enter a name for the application. For example, *webapi1*.
4. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
5. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. For example, you can set it to listen locally at `https://localhost:44316`. If you don't yet know the port number, you can enter a placeholder value and change it later.
6. For **App ID URI**, enter the identifier used for your web API. The full identifier URI including the domain is generated for you. For example, `https://contosotenant.onmicrosoft.com/api`.
7. Click **Create**.
8. Select the *webapi1* application that you created and then select **Published scopes** to add more scopes as necessary. By default, the `user_impersonation` scope is defined. The `user_impersonation` scope gives other applications the ability to access this API on behalf of the signed-in user. If you wish, the `user_impersonation` scope can be removed.

    ![Set published scopes](./media/tutorial-register-applications/published-scopes.png)


## Register a mobile or native application

1. Select **Applications**, and then select **Add**.
2. Enter a name for the application. For example, *nativeapp1*.
3. For **Include web app/ web API**, select **No**.
4. For **Include native client**, select **Yes**.
5. For **Redirect URI**, enter a valid redirect URI with a custom scheme. There are two important considerations when choosing a redirect URI:

    - **Unique** - The scheme of the redirect URI should be unique for every application. In the example `com.onmicrosoft.contoso.appname://redirect/path`, `com.onmicrosoft.contoso.appname` is the scheme. This pattern should be followed. If two applications share the same scheme, the user is given a choice to choose an application. If the user makes an incorrect choice, the sign-in fails.
    - **Complete** - The redirect URI must have a scheme and a path. The path must contain at least one forward slash after the domain. For example, `//contoso/` works and `//contoso` fails. Make sure that the redirect URI doesn't include special characters, such as underscores.

6. Click **Create**.

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Register a web application
> * Register a web API
> * Register a mobile or native application

> [!div class="nextstepaction"]
> [Create user flows in Azure Active Directory B2C](tutorial-create-user-flows.md)