---
author: mmacy
ms.service: active-directory-b2c
ms.topic: include
ms.date: 10/09/2019
ms.author: marsma
# Used by the web API tutorial articles for .NET and SPA
---
Web API resources need to be registered in your tenant before they can accept and respond to protected resource requests by client applications that present an access token.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **Applications (Preview)**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *webapi1*.
1. Under **Redirect URI**, select **Web**, and then enter an endpoint where Azure AD B2C should return any tokens that your application requests. In this tutorial, the sample runs locally and listens at `http://localhost:5000`.
1. Select **Register**
1. Record the **Application (client) ID** for use in a later step.

Next, enable the implicit grant flow:

1. Under **Manage**, select **Authentication**.
1. Select **Try out the new experience** (if shown).
1. Under **IMPLICIT GRANT**, select both the **Access tokens** and **ID tokens** check boxes.
1. Select **Save**.