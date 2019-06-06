---
title: Set up sign-up and sign-in with a GitHub account - Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with GitHub accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 12/07/2018
ms.author: marsma
ms.subservice: B2C
---

# Set up sign-up and sign-in with a GitHub account using Azure Active Directory B2C

> [!NOTE]
> This feature is in preview.
> 

To use a GitHub account as an [identity provider](active-directory-b2c-reference-oauth-code.md) in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a GitHub account, you can get it at [https://www.github.com/](https://www.github.com/).

## Create a GitHub OAuth application

1. Sign in to the [GitHub Developer](https://github.com/settings/developers) website with your GitHub credentials.
2. Select **OAuth Apps** and then select **New OAuth App**.
3. Enter an **Application name** and your **Homepage URL**.
4. Enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in **Authorization callback URL**. Replace `your-tenant-name` with the name of your Azure AD B2C tenant. Use all lowercase letters when entering your tenant name even if the tenant is defined with uppercase letters in Azure AD B2C.
5. Click **Register application**.
6. Copy the values of **Client ID** and **Client Secret**. You need both to add the identity provider to your tenant.

## Configure a GitHub account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Provide a **Name**. For example, enter *GitHub*.
6. Select **Identity provider type**, select **GitHub (Preview)**, and click **OK**.
7. Select **Set up this identity provider** and enter the Client Id that you recorded earlier as the **Client ID** and enter the Client Secret that you recorded as the **Client secret** of the GitHub account application that you created earlier.
8. Click **OK** and then click **Create** to save your GitHub account configuration.
