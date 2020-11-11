---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 04/07/2020
ms.author: mimart
---
## Register an Azure AD app

To enable sign-in for users from a specific Azure AD organization, you need to register an application within the organizational Azure AD tenant.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your organizational Azure AD tenant (for example, contoso.com). Select the **Directory + subscription filter** in the top menu, and then choose the directory that contains your Azure AD tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
1. Select **New registration**.
1. Enter a **Name** for your application. For example, `Azure AD B2C App`.
1. Accept the default selection of **Accounts in this organizational directory only** for this application.
1. For the **Redirect URI**, accept the value of **Web**, and enter the following URL in all lowercase letters, where `your-B2C-tenant-name` is replaced with the name of your Azure AD B2C tenant.

    ```
    https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp
    ```

    For example, `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/oauth2/authresp`.

1. Select **Register**. Record the **Application (client) ID** for use in a later step.
1. Select **Certificates & secrets**, and then select **New client secret**.
1. Enter a **Description** for the secret, select an expiration, and then select **Add**. Record the **Value** of the secret for use in a later step.

### Configuring optional claims

If you want to get the `family_name` and `given_name` claims from Azure AD, you can configure optional claims for your application in the Azure portal UI or application manifest. For more information, see [How to provide optional claims to your Azure AD app](/azure/active-directory/develop/active-directory-optional-claims).

1. Sign in to the [Azure portal](https://portal.azure.com). Search for and select **Azure Active Directory**.
1. From the **Manage** section, select **App registrations**.
1. Select the application you want to configure optional claims for in the list.
1. From the **Manage** section, select **Token configuration**.
1. Select **Add optional claim**.
1. For the **Token type**, select **ID**.
1. Select the optional claims to add, `family_name` and `given_name`.
1. Click **Add**.