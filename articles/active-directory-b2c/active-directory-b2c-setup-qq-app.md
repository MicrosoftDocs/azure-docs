---
title: Set up sign-up and sign-in with a QQ account using Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with QQ accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/11/2018
ms.author: marsma
ms.subservice: B2C
---

# Set up sign-up and sign-in with a QQ account using Azure Active Directory B2C

> [!NOTE]
> This feature is in preview.
> 

## Create a QQ application

To use a QQ account as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a QQ account, you can get it at [https://ssl.zc.qq.com/en/index.html?type=1&ptlang=1033](https://ssl.zc.qq.com/en/index.html?type=1&ptlang=1033).

### Register for the QQ developer program

1. Sign in to the [QQ developer portal](http://open.qq.com) with your QQ account credentials.
2. After signing in, go to [http://open.qq.com/reg](http://open.qq.com/reg) to register yourself as a developer.
3. Select **个人** (individual developer).
4. Enter the required information and select **下一步** (next step).
5. Complete the email verification process. You will need to wait a few days to be approved after registering as a developer. 

### Register a QQ application

1. Go to [https://connect.qq.com/index.html](https://connect.qq.com/index.html).
2. Select **应用管理** (app management).
5. Select **创建应用** (create app) and enter the required information.
7. Enter `https://your-tenant-name.b2clogin.com/your-tenant-name}.onmicrosoft.com/oauth2/authresp` in **授权回调域** (callback URL). For example, if your `tenant_name` is contoso, set the URL to be `https://contoso.b2clogin.com/contoso.onmicrosoft.com/oauth2/authresp`.
8. Select **创建应用** (create app).
9. On the confirmation page, select **应用管理** (app management) to return to the app management page.
10. Select **查看** (view) next to the app you created.
11. Select **修改** (edit).
12. Copy the **APP ID** and **APP KEY**. You need both of these values to add the identity provider to your tenant.

## Configure QQ as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Provide a **Name**. For example, enter *QQ*.
6. Select **Identity provider type**, select **QQ (Preview)**, and click **OK**.
7. Select **Set up this identity provider** and enter the APP ID that you recorded earlier as the **Client ID** and enter the APP Key that you recorded as the **Client secret** of the QQ application that you created earlier.
8. Click **OK** and then click **Create** to save your QQ configuration.

