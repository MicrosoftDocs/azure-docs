---
title: Set up sign-up and sign-in with a Google account using Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with Google accounts in your applications using Azure Active Directory B2C.
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

# Set up sign-up and sign-in with a Google account using Azure Active Directory B2C

## Create a Google application

To use a Google account as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a Google account you can get it at [https://accounts.google.com/SignUp](https://accounts.google.com/SignUp).

1. Sign in to the [Google Developers Console](https://console.developers.google.com/) with your Google account credentials.
2. Select **Create project**, and then click **Create**. If you have created projects before, select the project list, and then select **New Project**.
3. Enter a **Project name**, and then click **Create**.
3. Select **Credentials** in the left menu, and then select **Create credentials** > **Oauth client ID**.
4. Select **Configure consent screen**.
5. Select or specify a valid **Email address**, provide a **Product name shown to users**, and click **Save**.
6. Under **Application type**, select **Web application**.
7. Enter a **Name** for your application, enter `https://{tenant}.b2clogin.com` in **Authorized JavaScript origins**, and `https://{tenant}.b2clogin.com/te/{tenant}.onmicrosoft.com/oauth2/authresp` in **Authorized redirect URIs**. Replace **{tenant}** with your tenant's name (for example, contosob2c).
8. Click **Create**.
9. Copy the values of **Client ID** and **Client secret**. You will need both of them to configure Google as an identity provider in your tenant. **Client secret** is an important security credential.

## Configure a Google account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by switching to it in the top-right corner of the Azure portal. Select your subscription information, and then select **Switch Directory**. 

    ![Switch to your Azure AD B2C tenant](./media/active-directory-b2c-setup-fb-app/switch-directories.png)

    Choose the directory that contains your tenant.

    ![Select directory](./media/active-directory-b2c-setup-fb-app/select-directory.png)

3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Enter a **Name**. For example, enter *Google*.
6. Select **Identity provider type**, select **Google**, and click **OK**.
7. Select **Set up this identity provider** and enter the Client ID that you recorded earlier as the **Client ID** and enter the Client Secret that you recorded as the **Client secret** of the Google application that you created earlier.
8. Click **OK** and then click **Create** to save your Google configuration.

