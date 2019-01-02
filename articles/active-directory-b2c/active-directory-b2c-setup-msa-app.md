---
title: Set up sign-up and sign-in with a Microsoft account using Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with Microsoft accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/21/2018
ms.author: davidmu
ms.component: B2C
---

# Set up sign-up and sign-in with a Microsoft account using Azure Active Directory B2C

## Create a Microsoft account application

To use a Microsoft account as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a Microsoft account, you can get it at [https://www.live.com/](https://www.live.com/).

1. Sign in to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList) with your Microsoft account credentials.
2. In the upper-right corner, select **Add an app**.
3. Enter a **Name** for your application. For example, *MSAapp1*.
4. Select **Generate New Password** and make sure that you copy the password to use when you configure the identity provider. Also copy the **Application Id**. 
5. Select **Add platform**, and then and choose **Web**.
4. Enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in **Redirect URLs**. Replace `your-tenant-name` with the name of your tenant.
5. Select **Save**.

## Configure a Microsoft account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Provide a **Name**. For example, enter *MSA*.
6. Select **Identity provider type**, select **Microsoft Account**, and click **OK**.
7. Select **Set up this identity provider** and enter the Application Id that you recorded earlier as the **Client ID** and enter the password that you recorded as the **Client secret** of the Microsoft account application that you created earlier.
8. Click **OK** and then click **Create** to save your Microsoft account configuration.

