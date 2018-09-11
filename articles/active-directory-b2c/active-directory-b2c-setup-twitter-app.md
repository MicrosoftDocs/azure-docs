---
title: Set up sign-up and sign-in with a Twitter account using Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with Twitter accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/09/2018
ms.author: davidmu
ms.component: B2C
---

# Set up sign-up and sign-in with a Twitter account using Azure Active Directory B2C

## Create a Twitter application

To use a Twitter account as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a Twitter account, you can get it at [https://twitter.com/signup](https://twitter.com/signup).

1. Sign in to the [Twitter Apps](https://apps.twitter.com/) with your Twitter credentials.
2. Select **Create New App**.
3. Enter the **Name**, **Description**, and **Website**.
4. Enter `https://{tenant}.b2clogin.com/te/{tenant}.onmicrosoft.com/{policyId}/oauth1/authresp` in **Callback URLs**. Replace **{tenant}** with your tenant's name (for example, contosob2c) and **{policyId}** with your policy ID (for example, b2c_1_policy). You should add a callback URL for all policies that use the Twitter account. 
5. Agree to the **Developer Agreement** and select **Create your Twitter application**.
7. Select the **Keys and Access Tokens** tab.
8. Copy the value of **Consumer Key** and **Consumer Secret**. You need both of them to configure a Twitter account as an identity provider in your tenant.

## Configure Twitter as an identity provider in your tenant

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by switching to it in the top-right corner of the Azure portal. Select your subscription information, and then select **Switch Directory**. 

    ![Switch to your Azure AD B2C tenant](./media/active-directory-b2c-setup-twitter-app/switch-directories.png)

    Choose the directory that contains your tenant.

    ![Select directory](./media/active-directory-b2c-setup-twitter-app/select-directory.png)

3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Provide a **Name**. For example, enter *Twitter*.
6. Select **Identity provider type**, select **Twitter**, and click **OK**.
7. Select **Set up this identity provider** and enter the Consumer Key for the **Client ID** and the **Consumer Secret** for the **Client secret**.
8. Click **OK**, and then click **Create** to save your Twitter configuration.