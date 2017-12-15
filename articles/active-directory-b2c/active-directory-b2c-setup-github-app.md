---
title: 'GitHub identity provider configuration | Microsoft Docs'
description: Provide sign-up and sign-in to customers with GitHub accounts in your applications that are secured by Azure Active Directory B2C.
services: active-directory-b2c
documentationcenter: ''
author: parakhj
manager: krassk
editor: parakhj

ms.assetid: 5518e135-36b3-4f86-9a01-be25f021ed22
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/16/2017
ms.author: parja

---
# Azure Active Directory B2C: Provide sign-up and sign-in to consumers with GitHub accounts

This article shows you how to enable sign-in for users with a GitHub account.

## Create a GitHub OAuth application

To use GitHub as an identity provider in Azure AD B2C, you need to create a GitHub OAuth app and supply it with the right parameters.

1. Go to the [GitHub Developer settings](https://github.com/settings/developers) after signing into GitHub.
1. Click **New OAuth App**
1. Enter an **Application name** and your **Homepage URL**.
1. For the **Authorization callback URL**, enter `https://login.microsoftonline.com/te/{tenant}/oauth2/authresp`. Replace **{tenant}** with your tenant's name (for example, contosob2c.onmicrosoft.com).
1. Click **Register application**.
1. Copy the values of **Client ID** and **Client Secret**. You will need both of them to configure GitHub as an identity provider for your Azure AD B2C tenant.

## Configure GitHub as an identity provider in your Azure AD B2C tenant

1. Follow these steps to [navigate to the B2C features blade](active-directory-b2c-app-registration.md#navigate-to-b2c-settings) on the Azure portal.
2. On the B2C features blade, click **Identity providers**.
3. Click **+Add** at the top of the blade.
4. Provide a friendly **Name** for the identity provider configuration. For example, enter "GitHub".
5. Click **Identity provider type**, select **GitHub**, and click **OK**.
6. Click **Set up this identity provider** and enter the client ID and client secret of the GitHub OAuth application that you copied earlier.
7. Click **OK** and then click **Create** to save your GitHub configuration.

## Next steps

Create or edit a [built-in policy](active-directory-b2c-reference-policies.md) and add GitHub as an identity provider.
