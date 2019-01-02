---
title: Set up sign-up and sign-in with a Google account using Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with Google accounts in your applications using Azure Active Directory B2C.
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

# Set up sign-up and sign-in with a Google account using Azure Active Directory B2C

## Create a Google application

To use a Google account as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a Google account you can get it at [https://accounts.google.com/SignUp](https://accounts.google.com/SignUp).

1. Sign in to the [Google Developers Console](https://console.developers.google.com/) with your Google account credentials.
2. Select **Create project**, and then click **Create**. If you have created projects before, select the project list, and then select **New Project**.
3. Enter a **Project Name**, click **Create**, and then make sure you are using the new project.
3. Select **Credentials** in the left menu, and then select **Create credentials** > **Oauth client ID**.
4. Select **Configure consent screen**.
5. Select or specify a valid **Email address**, provide a **Product name shown to users**, add `b2clogin.com` to **Authorized domains**, and click **Save**.
6. Under **Application type**, select **Web application**.
7. Enter a **Name** for your application, enter `https://your-tenant-name.b2clogin.com` in **Authorized JavaScript origins**, and `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in **Authorized redirect URIs**. Replace `your-tenant-name` with the name of your tenant. You need to use all lowercase letters when entering your tenant name even if the tenant is defined with uppercase letters in Azure AD B2C.
8. Click **Create**.
9. Copy the values of **Client ID** and **Client secret**. You will need both of them to configure Google as an identity provider in your tenant. **Client secret** is an important security credential.

## Configure a Google account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Enter a **Name**. For example, enter *Google*.
6. Select **Identity provider type**, select **Google**, and click **OK**.
7. Select **Set up this identity provider** and enter the Client ID that you recorded earlier as the **Client ID** and enter the Client Secret that you recorded as the **Client secret** of the Google application that you created earlier.
8. Click **OK** and then click **Create** to save your Google configuration.

