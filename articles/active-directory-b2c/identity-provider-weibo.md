---
title: Set up sign-up and sign-in with a Weibo account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Weibo accounts in your applications using Azure Active Directory B2C.
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

# Set up sign-up and sign-in with a Weibo account using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

## Create a Weibo application

To use a Weibo account as an identity provider in Azure Active Directory B2C (Azure AD B2C), you need to create an application in your tenant that represents it. If you don't already have a Weibo account, you can sign up at [https://weibo.com/signup/signup.php?lang=en-us](https://weibo.com/signup/signup.php?lang=en-us).

1. Sign in to the [Weibo developer portal](https://open.weibo.com/) with your Weibo account credentials.
1. After signing in, select your display name in the top-right corner.
1. In the dropdown, select **编辑开发者信息** (edit developer information).
1. Enter the required information and select **提交** (submit).
1. Complete the email verification process.
1. Go to the [identity verification page](https://open.weibo.com/developers/identity/edit).
1. Enter the required information and select **提交** (submit).

### Register a Weibo application

1. Go to the [new Weibo app registration page](https://open.weibo.com/apps/new).
1. Enter the necessary application information.
1. Select **创建** (create).
1. Copy the values of **App Key** and **App Secret**. You need both of these to add the identity provider to your tenant.
1. Upload the required photos and enter the necessary information.
1. Select **保存以上信息** (save).
1. Select **高级信息** (advanced information).
1. Select **编辑** (edit) next to the field for OAuth2.0 **授权设置** (redirect URL).
1. Enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` for OAuth2.0 **授权设置** (redirect URL). For example, if your tenant name is contoso, set the URL to be `https://contoso.b2clogin.com/contoso.onmicrosoft.com/oauth2/authresp`.
1. Select **提交** (submit).

## Configure a Weibo account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Weibo (Preview)**.
1. Enter a **Name**. For example, *Weibo*.
1. For the **Client ID**, enter the App Key of the Weibo application that you created earlier.
1. For the **Client secret**, enter the App Secret that you recorded.
1. Select **Save**.
