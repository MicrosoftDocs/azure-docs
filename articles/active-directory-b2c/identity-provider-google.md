---
title: Set up sign-up and sign-in with a Google account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Google accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 08/08/2019
ms.author: mimart
ms.subservice: B2C
---

# Set up sign-up and sign-in with a Google account using Azure Active Directory B2C

## Create a Google application

To use a Google account as an [identity provider](authorization-code-flow.md) in Azure Active Directory B2C (Azure AD B2C), you need to create an application in your Google Developers Console. If you don't already have a Google account you can sign up at [https://accounts.google.com/SignUp](https://accounts.google.com/SignUp).

1. Sign in to the [Google Developers Console](https://console.developers.google.com/) with your Google account credentials.
1. In the upper-left corner of the page, select the project list, and then select **New Project**.
1. Enter a **Project Name**, select **Create**.
1. Make sure you are using the new project by selecting the project drop-down in the top-left of the screen, select your project by name, then select **Open**.
1. Select **OAuth consent screen** in the left menu, select **External**, and then select **Create**.
Enter a **Name** for your application. Enter *b2clogin.com* in the **Authorized domains** section and select **Save**.
1. Select **Credentials** in the left menu, and then select **Create credentials** > **Oauth client ID**.
1. Under **Application type**, select **Web application**.
1. Enter a **Name** for your application, enter `https://your-tenant-name.b2clogin.com` in **Authorized JavaScript origins**, and `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in **Authorized redirect URIs**. Replace `your-tenant-name` with the name of your tenant. You need to use all lowercase letters when entering your tenant name even if the tenant is defined with uppercase letters in Azure AD B2C.
1. Click **Create**.
1. Copy the values of **Client ID** and **Client secret**. You will need both of them to configure Google as an identity provider in your tenant. **Client secret** is an important security credential.

## Configure a Google account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Google**.
1. Enter a **Name**. For example, *Google*.
1. For the **Client ID**, enter the Client ID of the Google application that you created earlier.
1. For the **Client secret**, enter the Client Secret that you recorded.
1. Select **Save**.
