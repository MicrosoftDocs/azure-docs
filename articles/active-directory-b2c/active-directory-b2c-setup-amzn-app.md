---
title: Set up sign-up and sign-in with an Amazon account - Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with Amazon accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/21/2018
ms.author: marsma
ms.subservice: B2C
---

# Set up sign-up and sign-in with an Amazon account using Azure Active Directory B2C

## Create an Amazon application

To use an Amazon account as an [identity provider](active-directory-b2c-reference-oauth-code.md) in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have an Amazon account you can get it at [https://www.amazon.com/](https://www.amazon.com/).

1. Sign in to the [Amazon Developer Center](https://login.amazon.com/) with your Amazon account credentials.
2. If you have not already done so, click **Sign Up**, follow the developer registration steps, and accept the policy.
3. Select **Register new application**.
4. Enter a **Name**, **Description**, and **Privacy Notice URL**, and then click **Save**. The privacy notice is a page that you manage that provides privacy information to users.
5. In the **Web Settings** section, copy the values of **Client ID**. Select **Show Secret** to get the client secret and then copy it. You need both of them to configure an Amazon account as an identity provider in your tenant. **Client Secret** is an important security credential.
6. In the **Web Settings** section, select **Edit**, and then enter `https://your-tenant-name.b2clogin.com` in **Allowed JavaScript Origins** and `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in **Allowed Return URLs**. Replace `your-tenant-name` with the name of your tenant. You need to use all lowercase letters when entering your tenant name even if the tenant is defined with uppercase letters in Azure AD B2C.
7. Click **Save**.

## Configure an Amazon account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Enter a **Name**. For example, enter *Amazon*.
6. Select **Identity provider type**, select **Amazon**, and click **OK**.
7. Select **Set up this identity provider** and enter the Client ID that you recorded earlier as the **Client ID** and enter the Client Secret that you recorded as the **Client secret** of the Amazon application that you created earlier.
8. Click **OK** and then click **Create** to save your Amazon configuration.

