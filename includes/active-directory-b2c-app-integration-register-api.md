---
author: kengaderdus
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 08/04/2021
ms.author: kengaderdus
# Used by Azure AD B2C app integration articles under "App integration".
---

To create the web API app registration (**App ID: 2**), follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon on the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. Search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. For **Name**, enter a name for the application (for example, **my-api1**). Leave the default values for **Redirect URI**. 
1. Select **Register**.
1. After the app registration is completed, select **Overview**.
1. Record the **Application (client) ID** value for later use when you configure the web application.

    ![Screenshot that demonstrates how to get a web A P I application I D.](./media/active-directory-b2c-app-integration-register-api/get-azure-ad-b2c-web-api-app-id.png)
