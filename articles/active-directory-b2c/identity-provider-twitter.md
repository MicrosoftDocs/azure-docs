---
title: Set up sign-up and sign-in with a Twitter account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Twitter accounts in your applications using Azure Active Directory B2C.
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

# Set up sign-up and sign-in with a Twitter account using Azure Active Directory B2C

## Create an application

To use Twitter as an identity provider in Azure AD B2C, you need to create a Twitter application. If you don't already have a Twitter account, you can sign up at [https://twitter.com/signup](https://twitter.com/signup).

1. Sign in to the [Twitter Developers](https://developer.twitter.com/en/apps) website with your Twitter account credentials.
1. Select  **Create an app**.
1. Enter an **App name** and an **Application description**.
1. In **Website URL**, enter `https://your-tenant.b2clogin.com`. Replace `your-tenant` with the name of your tenant. For example, `https://contosob2c.b2clogin.com`.
1. For the **Callback URL**, enter `https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/your-user-flow-Id/oauth1/authresp`. Replace `your-tenant` with the name of your tenant name and `your-user-flow-Id` with the identifier of your user flow. For example, `b2c_1A_signup_signin_twitter`. You need to use all lowercase letters when entering your tenant name and user flow id even if they are defined with uppercase letters in Azure AD B2C.
1. At the bottom of the page, read and accept the terms, and then select **Create**.
1. On the **App details** page, select **Edit > Edit details**, check the box for **Enable Sign in with Twitter**, and then select **Save**.
1. Select **Keys and tokens** and record the **Consumer API Key** and the **Consumer API secret key** values to be used later.

## Configure Twitter as an identity provider in your tenant

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Twitter**.
1. Enter a **Name**. For example, *Twitter*.
1. For the **Client ID**, enter the Consumer API Key of the Twitter application that you created earlier.
1. For the **Client secret**, enter the Consumer API secret key that you recorded.
1. Select **Save**.
