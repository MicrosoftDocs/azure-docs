---
author: mmacy
ms.service: active-directory-b2c
ms.topic: include
ms.date: 09/27/2019
ms.author: marsma
# Used by the identity provider (IdP) setup articles under "Custom policy"
---
Communication with Azure AD B2C occurs through an application that you register in your B2C tenant. This section lists optional steps you can complete to create a test application if you haven't already done so.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **Applications**, and then select **Add**.
1. Enter a name for the application. For example, *testapp1*.
1. For **Web App / Web API**, select **Yes**.
1. For **Reply URL**, enter `https://jwt.ms`
1. Select **Create**.
