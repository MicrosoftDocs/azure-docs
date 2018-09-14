---
title: Set up sign-up and sign-in with a Microsoft account using Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with Microsoft accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/05/2018
ms.author: davidmu
ms.component: B2C
---

# Set up sign-up and sign-in with a Microsoft account using Azure Active Directory B2C

## Create a Microsoft account application

To use a Microsoft account as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a Microsoft account, you can get it at [https://www.live.com/](https://www.live.com/).

1. Sign in to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList) with your Microsoft account credentials.
2. In the upper-right corner, select **Add an app**.
3. Provide a **Name** for your application and click **Create**.
4. On the registration page, copy the value of **Application Id**. You use it to configure your Microsoft account as an identity provider in your tenant.
5. Select **Add platform**, and then and choose **Web**.
6. Enter `https://{tenant}.b2clogin.com/te/{tenant}.onmicrosoft.com/oauth2/authresp` in **Redirect URLs**. Replace **{tenant}** with your tenant's name (for example, contosob2c).
7. Select **Generate New Password** under **Application Secrets**. Copy the new password displayed on screen. You need it to configure a Microsoft account as an identity provider in your tenant. This password is an important security credential.

## Configure a Microsoft account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by switching to it in the top-right corner of the Azure portal. Select your subscription information, and then select **Switch Directory**. 

    ![Switch to your Azure AD B2C tenant](./media/active-directory-b2c-setup-msa-app/switch-directories.png)

    Choose the directory that contains your tenant.

    ![Select directory](./media/active-directory-b2c-setup-msa-app/select-directory.png)

3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Provide a **Name**. For example, enter *MSA*.
6. Select **Identity provider type**, select **Microsoft Account**, and click **OK**.
7. Select **Set up this identity provider** and enter the Application Id that you recorded earlier as the **Client ID** and enter the password that you recorded as the **Client secret** of the Microsoft account application that you created earlier.
8. Click **OK** and then click **Create** to save your Microsoft account configuration.

