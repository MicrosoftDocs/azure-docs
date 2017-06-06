---
title: 'Azure Active Directory B2C: QQ configuration | Microsoft Docs'
description: Provide sign-up and sign-in to consumers with QQ accounts in your applications that are secured by Azure Active Directory B2C.
services: active-directory-b2c
documentationcenter: ''
author: parakhj
manager: krassk
editor: parakhj

ms.assetid: 18c2cf94-8004-4de1-81c2-e45be65ce12d
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 3/26/2017
ms.author: parakhj

---
# Azure Active Directory B2C: Provide sign-up and sign-in to consumers with QQ accounts

> [!NOTE]
> This feature is in preview.
> 

## Create a QQ application

To use QQ as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create a QQ application and supply it with the right parameters. You need a QQ account to do this. If you don’t have one, you can get one at [https://ssl.zc.qq.com/en/index.html?type=1&ptlang=1033](https://ssl.zc.qq.com/en/index.html?type=1&ptlang=1033).

### Register for the QQ developer program

1. Go to the [QQ developer portal](http://open.qq.com) and sign in with your QQ account credentials.
2. After signing in, go to [http://open.qq.com/reg](http://open.qq.com/reg) to register yourself as a developer.
3. In the menu, select **个人** (individual developer).
4. Enter the required information into the form and click **下一步** (next step).
5. Complete the email verification process.

> [!NOTE]
> You will need to wait a few days to be approved after registering as a developer. 

### Register a QQ application

1. Go to [https://connect.qq.com/index.html](https://connect.qq.com/index.html).
2. Click on **应用管理** (app management).
3. Click on **创建应用** (create app).
4. Enter the necessary app information.
5. Click on **创建应用** (create app).
6. Enter the required information.
7. For the **授权回调域** (callback URL) field, enter `https://login.microsoftonline.com/te/{tenant_name}/oauth2/authresp`. For example, if your `tenant_name` is contoso.onmicrosoft.com, set the URL to be `https://login.microsoftonline.com/te/contoso.onmicrosoft.com/oauth2/authresp`.
8. Click on **创建应用** (create app).
9. On the confirmation page, click on **应用管理** (app management) to return to the app management page.
10. Click on **查看** (view) next to the app you just created.
11. Click on **修改** (edit).
12. From the top of the page, copy the **APP ID** and **APP KEY**.

## Configure QQ as an identity provider in your tenant
1. Follow these steps to [navigate to the B2C features blade](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade) on the Azure portal.
2. On the B2C features blade, click **Identity providers**.
3. Click **+Add** at the top of the blade.
4. Provide a friendly **Name** for the identity provider configuration. For example, enter "QQ".
5. Click **Identity provider type**, select **QQ**, and click **OK**.
6. Click **Set up this identity provider**
7. Enter the **App Key** that you copied earlier as the **Client ID**.
8. Enter the **App Secret** that you copied earlier as the **Client Secret**.
9. Click **OK** and then click **Create** to save your QQ configuration.

