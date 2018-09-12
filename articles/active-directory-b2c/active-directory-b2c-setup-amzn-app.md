---
title: Set up sign-up and sign-in with an Amazon account using Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with Amazon accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/06/2018
ms.author: davidmu
ms.component: B2C
---

# Set up sign-up and sign-in with an Amazon account using Azure Active Directory B2C

## Create an Amazon application

To use an Amazon account as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a Amazon account you can get it at [http://www.amazon.com/](http://www.amazon.com/).

1. Sign in to the [Amazon Developer Center](https://login.amazon.com/) with your Amazon account credentials.
2. If you have not already done so, click **Sign Up**, follow the developer registration steps, and accept the policy.
3. Select **Register new application**.
4. Enter a **Name**, **Description**, and **Privacy Notice URL**, and then click **Save**.
5. In the **Web Settings** section, copy the values of **Client ID**. Select **Show Secret** to get the client secret and then copy it. You need both of them to configure an Amazon account as an identity provider in your tenant. **Client Secret** is an important security credential.
6. In the **Web Settings** section, select **Edit**, and then enter `https://{tenant}.b2clogin.com` in **Allowed JavaScript Origins** and `https://{tenant}.b2clogin.com/te/{tenant}.onmicrosoft.com/oauth2/authresp` in **Allowed Return URLs**. Replace **{tenant}** with your tenant's name (for example, contosob2c). 
7. Click **Save**.

## Configure an Amazon account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by switching to it in the top-right corner of the Azure portal. Select your subscription information, and then select **Switch Directory**. 

    ![Switch to your Azure AD B2C tenant](./media/active-directory-b2c-setup-fb-app/switch-directories.png)

    Choose the directory that contains your tenant.

    ![Select directory](./media/active-directory-b2c-setup-fb-app/select-directory.png)

3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Enter a **Name**. For example, enter *Amazon*.
6. Select **Identity provider type**, select **Amazon**, and click **OK**.
7. Select **Set up this identity provider** and enter the Client ID that you recorded earlier as the **Client ID** and enter the Client Secret that you recorded as the **Client secret** of the Amazon application that you created earlier.
8. Click **OK** and then click **Create** to save your Amazon configuration.

