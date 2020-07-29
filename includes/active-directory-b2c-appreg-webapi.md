---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 10/16/2019
ms.author: mimart
# Used by the web API tutorial articles for .NET desktop (native) and SPA
---
Web API resources need to be registered in your tenant before they can accept and respond to protected resource requests by client applications that present an access token.

To register an application in your Azure AD B2C tenant, you can use our new unified **App registrations** experience or our legacy  **Applications (Legacy)** experience. [Learn more about the new experience](https://aka.ms/b2cappregtraining).

#### [App registrations](#tab/app-reg-ga/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *webapi1*.
1. Under **Redirect URI**, select **Web**, and then enter an endpoint where Azure AD B2C should return any tokens that your application requests. In this tutorial, the sample runs locally and listens at `http://localhost:5000`.
1. Select **Register**.
1. Record the **Application (client) ID** for use in a later step.

Next, enable the implicit grant flow:

1. Under **Manage**, select **Authentication**.
1. Select **Try out the new experience** (if shown).
1. Under **Implicit grant**, select both the **Access tokens** and **ID tokens** check boxes.
1. Select **Save**.

#### [Applications](#tab/applications/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **Applications (Legacy)**, and then select **Add**.
1. Enter a name for the application. For example, *webapi1*.
1. For **Web App / Web API**, select **Yes**.
1. For **Allow implicit flow**, select **Yes**.
1. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. In this tutorial, the sample runs locally and listens at `https://localhost:5000`.
1. For **App ID URI**, add an API endpoint identifier to the URI shown. For this tutorial, enter `api`, so that the full URI is similar to `https://contosob2c.onmicrosoft.com/api`.
1. Select **Create**.
1. Record the **APPLICATION ID** for use in a later step.