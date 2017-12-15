---
title: 'Add an Azure AD identity provider using built-in policies - Azure AD B2C | Microsoft Docs'
description: Learn how to add an Open ID Connect identity provider (Azure AD)
services: active-directory-b2c
documentationcenter: ''
author: parakhj
manager: krassk
editor: parakhj

ms.assetid: 7dac9545-d5f1-4136-a04d-1c5740aea499
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 01/04/2017
ms.author: parja

---
# Azure Active Directory B2C: Sign in using Azure AD accounts through a built-in policy

> [!NOTE]
> **This feature is in preview.**  Contact [AADB2CPreview@microsoft.com](mailto:AADB2CPreview@microsoft.com) to have your test tenant enabled with this feature.  Do not use this on production tenants.

This article shows you how to enable sign-in for users from a specific Azure Active Directory (Azure AD) organization using built-in policies.

## Create an Azure AD app

To enable sign-in for users from a specific Azure AD organization, you need to register an application within the organizational Azure AD tenant.

>[!NOTE]
> We use "contoso.com" for the organizational Azure AD tenant and "fabrikamb2c.onmicrosoft.com" as the Azure AD B2C tenant in the following instructions.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the top bar, select your account. From the **Directory** list, choose the organizational Azure AD tenant where you want to register your application (contoso.com).
1. Select **More services** in the left pane, and search for "App registrations."
1. Select **New application registration**.
1. Enter a name for your application (for example, `Azure AD B2C App`).
1. Select **Web app / API** for the application type.
1. For **Sign-on URL**, enter the following URL, where `yourtenant` is replaced by the name of your Azure AD B2C tenant (`fabrikamb2c.onmicrosoft.com`):

    >[!NOTE]
    >The value for "yourtenant" must be all lowercase in the **Sign-on URL**.

    ```Console
    https://login.microsoftonline.com/te/yourtenant.onmicrosoft.com/oauth2/authresp
    ```

1. Save the application ID.
1. Select the newly created application.
1. Under the **Settings** blade, select **Keys**.
1. Create a new **Password** by adding a **Description** and setting the **Duration** to **Never expires**, and save it. You will use the resulting **Value** in the next section for the client secret.

## Configure Azure AD as an identity provider in your Azure AD B2C tenant

1. Follow these steps to [navigate to the B2C features blade](active-directory-b2c-app-registration.md#navigate-to-b2c-settings) on the Azure portal.
1. On the B2C features blade, click **Identity providers**.
1. Click **+Add** at the top of the blade.
1. Provide a friendly **Name** for the identity provider configuration. For example, enter "Azure AD".
1. Click **Identity provider type**, select **Custom Open ID Connect**, and click **OK**.
1. Click **Set up this identity provider**.

    1. Set **Metadata url** to `https://login.windows.net/yourAzureADtenant/.well-known/openid-configuration`, where `yourAzureADtenant` is your Azure AD tenant name (e.g. contoso.com).
    1. Set **Domain hint** to the value you want to use for the `domain_hint` parameter. This parameter is used to automatically select the identity provider for the user to sign in with. 
    1. Enter the client ID and client secret of the Azure AD application that you created in the previous section.
    1. Set **Scope** to `openid` or the set of privileges that you would like to obtain from Azure AD.
    1. Keep the default values for **Response type** and **Response mode**.

1. Click **Map this identity provider's claims**.

    1. Set **User ID** to `oid`.
    1. Keep the rest of the fields as their default value.

1. Click **OK** and then click **Create** to save your Azure AD configuration.

## Next steps

Create or edit a [built-in policy](active-directory-b2c-reference-policies.md) and add Azure AD as an identity provider.