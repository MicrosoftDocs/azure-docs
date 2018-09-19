---
title: Add an Azure AD provider using built-in policies in Azure Active Directory B2C | Microsoft Docs
description: Learn how to add an Open ID Connect identity provider (Azure AD).
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/27/2018
ms.author: davidmu
ms.component: B2C
---

# Azure Active Directory B2C: Sign in using Azure AD accounts through a built-in policy

>[!NOTE]
> This feature is in public preview. Do not use the feature in production environments.

This article shows you how to enable sign-in for users from a specific Azure Active Directory (Azure AD) organization built-in policies.

## Create an Azure AD app

To enable sign-in for users from a specific Azure AD organization, you need to register an application within the organizational Azure AD tenant.

>[!NOTE]
> We use "contoso.com" for the organizational Azure AD tenant and "fabrikamb2c.onmicrosoft.com" as the Azure AD B2C tenant in the following instructions.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the top bar, select your account. From the **Directory** list, choose the organizational Azure AD tenant where you will register your application (contoso.com).
1. Select **All services** in the left pane, and search for "App registrations."
1. Select **New application registration**.
1. Enter a name for your application (for example, `Azure AD B2C App`).
1. Select **Web app / API** for the application type.
1. For **Sign-on URL**, enter the following URL, where `yourtenant` is replaced by the name of your Azure AD B2C tenant (`fabrikamb2c`):

    >[!NOTE]
    >The value for "yourtenant" must be all lowercase in the **Sign-on URL**.

    ```Console
    https://yourtenant.b2clogin.com/te/yourtenant.onmicrosoft.com/oauth2/authresp
    ```

1. Save the application ID, which you will use in the next section as the client ID.
1. Under the **Settings** blade, select **Keys**.
1. Enter a **Key description** under the **Passwords** section and set the **Duration** to "Never expires". 
1. Click **Save**, and note down the resulting key **Value**, which you will use in the next section as the client secret.

## Configure Azure AD as an identity provider in your tenant

1. On the top bar, select your account. From the **Directory** list, choose the Azure AD B2C tenant (fabrikamb2c.onmicrosoft.com).
1. [Navigate to the Azure AD B2C settings menu](active-directory-b2c-app-registration.md#navigate-to-b2c-settings) in the Azure portal.
1. In the Azure AD B2C settings menu, click on **Identity providers**.
1. Click **+Add** at the top of the blade.
1. Provide a friendly **Name** for the identity provider configuration. For example, enter "Contoso Azure AD".
1. Click **Identity provider type**, select **Open ID Connect**, and click **OK**.
1. Click **Set up this identity provider**
1. For **Metadata url**, enter the following URL, where `yourtenant` is replaced by the name of your Azure AD tenant (e.g. `contoso.com`):

    ```Console
    https://login.microsoftonline.com/yourtenant/.well-known/openid-configuration
    ```
1. For the **Client ID** and **Client secret**, enter the Application ID and Key from the previous section.
1. Keep the default value for **Scope**, which should be set to `openid`.
1. Keep the default value for **Response type**, which should be set to `code`.
1. Keep the default value for **Response mode**, which should be set to `form_post`.
1. Optionally, enter a value for **Domain** (e.g. `ContosoAD`). This is the value to use when referring to this identity provider using *domain_hint* in the request. 
1. Click **OK**.
1. Click on **Map this identity provider's claims**.
1. For **User ID**, enter `oid`.
1. For **Display Name**, enter `name`.
1. For **Given name**, enter `given_name`.
1. For **Surname**, enter `family_name`.
1. For **Email**, enter `unique_name`
1. Click **OK**, and then **Create** to save your configuration.

## Next steps

Add the newly created Azure AD identity provider to a built-in policy and provide feedback to [AADB2CPreview@microsoft.com](mailto:AADB2CPreview@microsoft.com).
