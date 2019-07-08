---
title: Set up sign-in for an Azure Active Directory organization - Azure Active Directory B2C
description: Set up sign-in for a specific Azure Active Directory organization in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/08/2019
ms.author: marsma
ms.subservice: B2C
---

# Set up sign-in for a specific Azure Active Directory organization in Azure Active Directory B2C

>[!NOTE]
> This feature is in public preview. Do not use the feature in production environments.

To use an Azure Active Directory (Azure AD) as an [identity provider](active-directory-b2c-reference-oauth-code.md) in Azure AD B2C, you need to create an application that represents it. This article shows you how to enable sign-in for users from a specific Azure AD organization using a user flow in Azure AD B2C.

## Create an Azure AD app

To enable sign-in for users from a specific Azure AD organization, you need to register an application within the organizational Azure AD tenant, which is not the same as your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD tenant. Select the **Directory and subscription filter** in the top menu and choose the directory that contains your Azure AD tenant. This is not the same tenant as your Azure AD B2C tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
4. Select **New registration**.
5. Enter a name for your application. For example, `Azure AD B2C App`.
6. Accept the selection of **Accounts in this organizational directory only** for this application.
7. For the **Redirect URI**, accept the value of **Web**, and enter the following URL in all lowercase letters, where `your-B2C-tenant-name` is replaced with the name of your Azure AD B2C tenant. For example, `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/oauth2/authresp`:

    ```
    https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp
    ```

    All URLs should now be using [b2clogin.com](b2clogin.md).

8. Click **Register**. Copy the **Application (client) ID** to be used later.
9. Select **Certificates & secrets** in the application menu, and then select **New client secret**.
10. Enter a name for the client secret. For example, `Azure AD B2C App Secret`.
11. Select the expiration period. For this application, accept the selection of **In 1 year**.
12. Select **Add** and copy the value of the new client secret that is displayed to be used later.

## Configure Azure AD as an identity provider

1. Make sure you're using the directory that contains Azure AD B2C tenant. Select the **Directory and subscription filter** in the top menu and choose the directory that contains your Azure AD B2C tenant.
2. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
3. Select **Identity providers**, and then select **Add**.
4. Enter a **Name**. For example, enter `Contoso Azure AD`.
5. Select **Identity provider type**, select **Open ID Connect (Preview)**, and then click **OK**.
6. Select **Set up this identity provider**
7. For **Metadata url**, enter the following URL replacing `your-AD-tenant-domain` with the domain name of your Azure AD tenant. For example `https://login.microsoftonline.com/contoso.onmicrosoft.com/.well-known/openid-configuration`:

    ```
    https://login.microsoftonline.com/your-AD-tenant-domain/.well-known/openid-configuration
    ```

8. For **Client ID**, enter the application ID that you previously recorded and for **Client secret**, enter the client secret that you previously recorded.
9. Optionally, enter a value for **Domain_hint**. For example, `ContosoAD`. This is the value to use when referring to this identity provider using *domain_hint* in the request.
10. Click **OK**.
11. Select **Map this identity provider's claims** and set the following claims:

    - For **User ID**, enter `oid`.
    - For **Display Name**, enter `name`.
    - For **Given name**, enter `given_name`.
    - For **Surname**, enter `family_name`.
    - For **Email**, enter `unique_name`.

12. Click **OK**, and then click **Create** to save your configuration.
