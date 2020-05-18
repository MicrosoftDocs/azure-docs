---
title: Set up sign-up and sign-in with a Microsoft Account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Microsoft Accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 05/12/2020
ms.author: mimart
ms.subservice: B2C
---

# Set up sign-up and sign-in with a Microsoft account using Azure Active Directory B2C

## Create a Microsoft account application

To use a Microsoft account as an [identity provider](openid-connect.md) in Azure Active Directory B2C (Azure AD B2C), you need to create an application in the Azure AD tenant. The Azure AD tenant is not the same as your Azure AD B2C tenant. If you don't already have a Microsoft account, you can get one at [https://www.live.com/](https://www.live.com/).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your Azure AD tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
1. Select **New registration**.
1. Enter a **Name** for your application. For example, *MSAapp1*.
1. Under **Supported account types**, select **Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**.

   For more information on the different account type selections, see [Quickstart: Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md).
1. Under **Redirect URI (optional)**, select **Web** and enter `https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/oauth2/authresp` in the text box. Replace `<tenant-name>` with your Azure AD B2C tenant name.
1. Select **Register**
1. Record the **Application (client) ID** shown on the application Overview page. You need this when you configure the identity provider in the next section.
1. Select **Certificates & secrets**
1. Click **New client secret**
1. Enter a **Description** for the secret, for example *Application password 1*, and then click **Add**.
1. Record the application password shown in the **Value** column. You need this when you configure the identity provider in the next section.

## Configure a Microsoft account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Microsoft Account**.
1. Enter a **Name**. For example, *MSA*.
1. For the **Client ID**, enter the Application (client) ID of the Azure AD application that you created earlier.
1. For the **Client secret**, enter the client secret that you recorded.
1. Select **Save**.
