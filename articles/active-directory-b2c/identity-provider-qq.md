---
title: Set up sign-up and sign-in with a QQ account using Azure Active Directory B2C
description: Provide sign-up and sign-in to customers with QQ accounts in your applications using Azure Active Directory B2C.
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

# Set up sign-up and sign-in with a QQ account using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

## Create a QQ application

To use a QQ account as an identity provider in Azure Active Directory B2C (Azure AD B2C), you need to create an application in your tenant that represents it. If you don't already have a QQ account, you can sign up at [https://ssl.zc.qq.com/en/index.html?type=1&ptlang=1033](https://ssl.zc.qq.com/en/index.html?type=1&ptlang=1033).

### Register for the QQ developer program

1. Sign in to the [QQ developer portal](http://open.qq.com) with your QQ account credentials.
1. After signing in, go to [https://open.qq.com/reg](https://open.qq.com/reg) to register yourself as a developer.
1. Select **个人** (individual developer).
1. Enter the required information and select **下一步** (next step).
1. Complete the email verification process. You will need to wait a few days to be approved after registering as a developer.

### Register a QQ application

1. Go to [https://connect.qq.com/index.html](https://connect.qq.com/index.html).
1. Select **应用管理** (app management).
1. Select **创建应用** (create app) and enter the required information.
1. Enter `https://your-tenant-name.b2clogin.com/your-tenant-name}.onmicrosoft.com/oauth2/authresp` in **授权回调域** (callback URL). For example, if your `tenant_name` is contoso, set the URL to be `https://contoso.b2clogin.com/contoso.onmicrosoft.com/oauth2/authresp`.
1. Select **创建应用** (create app).
1. On the confirmation page, select **应用管理** (app management) to return to the app management page.
1. Select **查看** (view) next to the app you created.
1. Select **修改** (edit).
1. Copy the **APP ID** and **APP KEY**. You need both of these values to add the identity provider to your tenant.

## Configure QQ as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **QQ (Preview)**.
1. Enter a **Name**. For example, *QQ*.
1. For the **Client ID**, enter the APP ID of the QQ application that you created earlier.
1. For the **Client secret**, enter the APP KEY that you recorded.
1. Select **Save**.
