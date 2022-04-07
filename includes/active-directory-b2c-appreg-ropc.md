---
author: kengaderdus
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 10/08/2021
ms.author: kengaderdus
# Used by the ROPC configuration articles for both user flows and custom policies.
---
To register an application in your Azure AD B2C tenant, you can use our new unified **App registrations** experience or our legacy  **Applications (Legacy)** experience. [Learn more about the new experience](../articles/active-directory-b2c/app-registrations-training-guide.md).

#### [App registrations](#tab/app-reg-ga/)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant:
    1. Select the **Directories + subscriptions** icon in the portal toolbar.
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. In the Azure portal, search for and select **Azure AD B2C**
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *ROPC_Auth_app*.
1. Leave the other values as they are, and then select **Register**.
1. Record the **Application (client) ID** for use in a later step.
1. Under **Manage**, select **Authentication**.
1. Select **Try out the new experience** (if shown).
1. Under **Advanced settings**, and section **Enable the following mobile and desktop flows**, select **Yes** to treat the application as a public client. This setting is required for the ROPC flow.
1. Select **Save**.
1. In the left menu, select **Manifest** to open the manifest editor. 
1. Set the **oauth2AllowImplicitFlow** attribute to *true*:
    ```json
    "oauth2AllowImplicitFlow": true,
    ```
1. Select **Save**.

#### [Applications (Legacy)](#tab/applications-legacy/)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant:
    1. Select the **Directories + subscriptions** icon in the portal toolbar.
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. In the Azure portal, search for and select **Azure AD B2C**
1. Select **Applications (Legacy)**, and then select **Add**.
1. Enter a name for the application. For example, *ROPC_Auth_app*.
1. For **Native client**, select **Yes**.
1. Leave the other values as they are, and then select **Create**.
1. Record the **APPLICATION ID** for use in a later step.