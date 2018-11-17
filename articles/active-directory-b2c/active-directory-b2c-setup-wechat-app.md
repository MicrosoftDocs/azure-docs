---
title: Set up sign-up and sign-in with a WeChat account using Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with WeChat accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/11/2018
ms.author: davidmu
ms.component: B2C
---

# Set up sign-up and sign-in with a WeChat account using Azure Active Directory B2C

> [!NOTE]
> This feature is in preview.
> 

## Create a WeChat application

To use a WeChat account as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a WeChat account, you can get information at [http://kf.qq.com/faq/161220Brem2Q161220uUjERB.html](http://kf.qq.com/faq/161220Brem2Q161220uUjERB.html).

### Register a WeChat application

1. Sign in to [https://open.weixin.qq.com/](https://open.weixin.qq.com/) with your WeChat credentials.
2. Select **管理中心** (management center).
3. Follow the steps to register a new application.
4. Enter `https://your-tenant_name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in **授权回调域** (callback URL). For example, if your tenant name is contoso, set the URL to be `https://contoso.b2clogin.com/contoso.onmicrosoft.com/oauth2/authresp`.
5. Copy the **APP ID** and **APP KEY**. You will need these to add the identity provider to your tenant.

## Configure WeChat as an identity provider in your tenant

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Provide a **Name**. For example, enter *WeChat*.
6. Select **Identity provider type**, select **WeChat (Preview)**, and click **OK**.
7. Select **Set up this identity provider** and enter the APP ID that you recorded earlier as the **Client ID** and enter the APP KEY that you recorded as the **Client secret** of the WeChat application that you created earlier.
8. Click **OK** and then click **Create** to save your WeChat configuration.

