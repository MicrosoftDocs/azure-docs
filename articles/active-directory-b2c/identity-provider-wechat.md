---
title: Set up sign-up and sign-in with a WeChat account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with WeChat accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 08/08/2019
ms.author: mimart
ms.subservice: B2C
---

# Set up sign-up and sign-in with a WeChat account using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

## Create a WeChat application

To use a WeChat account as an identity provider in Azure Active Directory B2C (Azure AD B2C), you need to create an application in your tenant that represents it. If you don't already have a WeChat account, you can get information at [https://kf.qq.com/faq/161220Brem2Q161220uUjERB.html](https://kf.qq.com/faq/161220Brem2Q161220uUjERB.html).

### Register a WeChat application

1. Sign in to [https://open.weixin.qq.com/](https://open.weixin.qq.com/) with your WeChat credentials.
1. Select **管理中心** (management center).
1. Follow the steps to register a new application.
1. Enter `https://your-tenant_name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in **授权回调域** (callback URL). For example, if your tenant name is contoso, set the URL to be `https://contoso.b2clogin.com/contoso.onmicrosoft.com/oauth2/authresp`.
1. Copy the **APP ID** and **APP KEY**. You will need these to add the identity provider to your tenant.

## Configure WeChat as an identity provider in your tenant

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **WeChat (Preview)**.
1. Enter a **Name**. For example, *WeChat*.
1. For the **Client ID**, enter the APP ID of the WeChat application that you created earlier.
1. For the **Client secret**, enter the APP KEY that you recorded.
1. Select **Save**.
