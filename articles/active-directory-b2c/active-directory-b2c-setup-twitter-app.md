---
title: Set up sign-up and sign-in with a Twitter account using Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with Twitter accounts in your applications using Azure Active Directory B2C.
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

# Set up sign-up and sign-in with a Twitter account using Azure Active Directory B2C

## Create a Twitter application

To use a Twitter account as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a Twitter account, you can get it at [https://twitter.com/signup](https://twitter.com/signup).

1. Sign in to the [Twitter Apps](https://apps.twitter.com/) with your Twitter credentials.
2. Select **Create an app**.
3. Enter the **App name**, **Application description**, and **Website URL**.
4. Enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/your-policy-name/oauth1/authresp` in **Callback URLs**. Replace `your-tenant-name` with the name of your tenant and `your-policy-name` with the name of your policy. For example, `b2c_1_signupsignin`. You need to use all lowercase letters when entering your tenant name and policy name even if they were defined with uppercase letters in Azure AD B2C.
5. Agree to the **Developer Agreement** and select **Create**.
7. Select the **Keys and Access Tokens** tab.
8. Copy the values of **API Key** and **API secret key**. You need both of them to configure a Twitter account as an identity provider in your tenant.

## Configure Twitter as an identity provider in your tenant

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.  

    ![Switch to your Azure AD B2C tenant](./media/active-directory-b2c-setup-twitter-app/switch-directories.png)

3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Provide a **Name**. For example, enter *Twitter*.
6. Select **Identity provider type**, select **Twitter**, and click **OK**.
7. Select **Set up this identity provider** and enter the API Key for the **Client ID** and the API secret key for the **Client secret**.
8. Click **OK**, and then click **Create** to save your Twitter configuration.