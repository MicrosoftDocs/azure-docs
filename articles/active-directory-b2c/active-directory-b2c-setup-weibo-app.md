---
title: Set up sign-up and sign-in with a Weibo account using Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with Weibo accounts in your applications using Azure Active Directory B2C.
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

# Set up sign-up and sign-in with a Weibo account using Azure Active Directory B2C

> [!NOTE]
> This feature is in preview.
> 

## Create a Weibo application

To use a Weibo account as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a Weibo account, you can get it at [http://weibo.com/signup/signup.php?lang=en-us](http://weibo.com/signup/signup.php?lang=en-us).

1. Sign in to the [Weibo developer portal](http://open.weibo.com/) with your Weibo account credentials.
2. After signing in, select your display name in the top-right corner.
3. In the dropdown, select **编辑开发者信息** (edit developer information).
4. Enter the required information and select **提交** (submit).
5. Complete the email verification process.
6. Go to the [identity verification page](http://open.weibo.com/developers/identity/edit).
7. Enter the required information and select **提交** (submit).

### Register a Weibo application

1. Go to the [new Weibo app registration page](http://open.weibo.com/apps/new).
2. Enter the necessary application information.
3. Select **创建** (create).
4. Copy the values of **App Key** and **App Secret**. You need both of these to add the identity provider to your tenant.
5. Upload the required photos and enter the necessary information.
6. Select **保存以上信息** (save).
7. Select **高级信息** (advanced information).
8. Select **编辑** (edit) next to the field for OAuth2.0 **授权设置** (redirect URL).
9. Enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` for OAuth2.0 **授权设置** (redirect URL). For example, if your tenant name is contoso, set the URL to be `https://contoso.b2clogin.com/contoso.onmicrosoft.com/oauth2/authresp`.
10. Select **提交** (submit).  

## Configure a Weibo account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Provide a **Name**. For example, enter *Weibo*.
6. Select **Identity provider type**, select **Weibo (Preview)**, and click **OK**.
7. Select **Set up this identity provider** and enter the App Key that you recorded earlier as the **Client ID** and enter the App Secret that you recorded as the **Client secret** of the Weibo application that you created earlier.
8. Click **OK** and then click **Create** to save your Weibo configuration.
