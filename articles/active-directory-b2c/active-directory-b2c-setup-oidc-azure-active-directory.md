---
title: Set up sign-in Azure Active Directory accounts a built-in policy in Azure Active Directory B2C | Microsoft Docs
description: Set up sign-in Azure Active Directory accounts a built-in policy in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/21/2018
ms.author: davidmu
ms.component: B2C
---

# Set up sign-in Azure Active Directory accounts a built-in policy in Azure Active Directory B2C

>[!NOTE]
> This feature is in public preview. Do not use the feature in production environments.

This article shows you how to enable sign-in for users from a specific Azure Active Directory (Azure AD) organization using a built-in policy in Azure Active Directory (Azure AD) B2C.

## Create an Azure AD app

To enable sign-in for users from a specific Azure AD organization, you need to register an application within the organizational Azure AD tenant.

>[!NOTE]
>`Contoso.com` is used for the organizational Azure AD tenant and `fabrikamb2c.onmicrosoft.com` is used as the Azure AD B2C tenant in the following instructions.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD tenant (contoso.com) by clicking the Directory and subscription filter in the top menu and choosing the directory that contains your Azure AD tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
4. Select **New application registration**.
5. Enter a name for your application. For example, `Azure AD B2C App`.
6. For the **Application type**, select `Web app / API`.
7. For the **Sign-on URL**, enter the following URL in all lowercase letters, where `your-tenant` is replaced with the name of your Azure AD B2C tenant (fabrikamb2c.onmicrosoft.com):

    ```
    https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/oauth2/authresp
    ```

    All URLs should now be using [b2clogin.com](b2clogin.md).

8. Click **Create**. Copy the **Application ID** to be used later.
9. Select the application, and then select **Settings**.
10. Select **Keys**, enter the key description, select a duration, and then click **Save**. Copy the value of the key that is displayed to be used later.

## Configure Azure AD as an identity provider in your tenant

1. Make sure you're using the directory that contains Azure AD B2C tenant (fabrikamb2c.onmicrosoft.com) by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your  Azure AD B2C tenant.
2. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
3. Select **Identity providers**, and then select **Add**.
4. Enter a **Name**. For example, enter "Contoso Azure AD".
5. Select **Identity provider type**, select **Open ID Connect (Preview)**, and then click **OK**.
6. Click **Set up this identity provider**
7. For **Metadata url**, enter the following URL replacing `your-tenant` with the name of your Azure AD tenant:

    ```
    https://login.microsoftonline.com/your-tenant/.well-known/openid-configuration
    ```
8. For **Client id**, enter the application ID that you previously recorded and for **Client secret**, enter the key value that you previously recorded.
9. Optionally, enter a value for **Domain_hint** (e.g. `ContosoAD`). This is the value to use when referring to this identity provider using *domain_hint* in the request. 
10. Click **OK**.
11. Select **Map this identity provider's claims** and set the following claims:
    
    - For **User ID**, enter `oid`.
    - For **Display Name**, enter `name`.
    - For **Given name**, enter `given_name`.
    - For **Surname**, enter `family_name`.
    - For **Email**, enter `unique_name`.

12. Click **OK**, and then click **Create** to save your configuration.
