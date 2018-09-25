---
title: Set up sign-up and sign-in with a Twitter account using Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with Twitter accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/19/2018
ms.author: davidmu
ms.component: B2C
---

# Set up sign-up and sign-in with a Twitter account using Azure Active Directory B2C

## Create an application

To use Twitter as an identity provider in Azure AD B2C, you need to create a Twitter application. If you don’t already have a Twitter account, you can get it at [https://twitter.com/signup](https://twitter.com/signup).

1. Sign in to the [Twitter Developers](https://developer.twitter.com/en/apps) website with your Twitter account credentials.
2. Select  **Create an app**.
3. Enter an **App name** and an **Application description**.
4. In **Website URL**, enter `https://your-tenant.b2clogin.com`. Replace `your-tenant` with the name of your tenant. For example, https://contosob2c.b2clogin.com.
5. For the **Callback URL**, enter `https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/your-policy-Id/oauth1/authresp`. Replace `your-tenant` with the name of your tenant name and `your-policy-Id` with the identifier of your policy. For example, `b2c_1A_signup_signin_twitter`. You need to use all lowercase letters when entering your tenant name even if the tenant is defined with uppercase letters in Azure AD B2C.
6. At the bottom of the page, read and accept the terms, and then select **Create**.
7. On the **App details** page, select **Edit > Edit details**, check the box for **Enable Sign in with Twitter**, and then select **Save**.
8. Select **Keys and tokens** and record the **Consumer API Key** and the **Consumer API secret key** values to be used later.

## Configure Twitter as an identity provider in your tenant

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Provide a **Name**. For example, enter *Twitter*.
6. Select **Identity provider type**, select **Twitter**, and click **OK**.
7. Select **Set up this identity provider** and enter the API Key for the **Client ID** and the API secret key for the **Client secret**.
8. Click **OK**, and then click **Create** to save your Twitter configuration.