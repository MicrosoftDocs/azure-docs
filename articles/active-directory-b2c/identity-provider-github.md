---
title: Set up sign-up and sign-in with a GitHub account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with GitHub accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 08/08/2019
ms.author: mimart
ms.subservice: B2C
---

# Set up sign-up and sign-in with a GitHub account using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

## Create a GitHub OAuth application

To use a GitHub account as an [identity provider](authorization-code-flow.md) in Azure Active Directory B2C (Azure AD B2C), you need to create an application in your tenant that represents it. If you don't already have a GitHub account, you can sign up at [https://www.github.com/](https://www.github.com/).

1. Sign in to the [GitHub Developer](https://github.com/settings/developers) website with your GitHub credentials.
1. Select **OAuth Apps** and then select **New OAuth App**.
1. Enter an **Application name** and your **Homepage URL**.
1. Enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in **Authorization callback URL**. Replace `your-tenant-name` with the name of your Azure AD B2C tenant. Use all lowercase letters when entering your tenant name even if the tenant is defined with uppercase letters in Azure AD B2C.
1. Click **Register application**.
1. Copy the values of **Client ID** and **Client Secret**. You need both to add the identity provider to your tenant.

## Configure a GitHub account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **GitHub (Preview)**.
1. Enter a **Name**. For example, *GitHub*.
1. For the **Client ID**, enter the Client ID of the GitHub application that you created earlier.
1. For the **Client secret**, enter the Client Secret that you recorded.
1. Select **Save**.
