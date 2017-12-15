---
title: 'Azure Active Directory B2C: Add an Azure AD provider using built-in policies | Microsoft Docs'
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
1. Create a new key, and save it. You will use it in the steps in the next section.

## Configure Google+ as an identity provider in your tenant

1. Follow these steps to [navigate to the B2C features blade](active-directory-b2c-app-registration.md#navigate-to-b2c-settings) on the Azure portal.
1. On the B2C features blade, click **Identity providers**.
1. Click **+Add** at the top of the blade.
1. Provide a friendly **Name** for the identity provider configuration. For example, enter "G+".
1. Click **Identity provider type**, select **Google**, and click **OK**.
1. Click **Set up this identity provider** and enter the client ID and client secret of the Google+ application that you created earlier.
1. Click **OK** and then click **Create** to save your Google+ configuration.

## Next steps

Provide feedback to [AADB2CPreview@microsoft.com](mailto:AADB2CPreview@microsoft.com).
