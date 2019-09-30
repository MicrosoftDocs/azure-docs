---
author: mmacy
ms.service: active-directory-b2c
ms.topic: include
ms.date: 09/30/2019
ms.author: marsma
# Used by the web API tutorial articles for .NET and SPA
---
Web API resources need to be registered in your tenant before they can accept and respond to protected resource requests by client applications that present an access token.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **Applications**, and then select **Add**.
1. Enter a name for the application. For example, *webapi1*.
1. For **Web App / Web API**, select **Yes**.
1. For **Allow implicit flow**, select **Yes**.
1. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. In this tutorial, the sample runs locally and listens at `https://localhost:5000`.
1. For **App ID URI**, add an API endpoint identifier to the URI shown. For this tutorial, enter `api`, so that the full URI is similar to `https://contosob2c.onmicrosoft.com/api`.
1. Select **Create**.
1. Record the **APPLICATION ID** for use in a later step.
