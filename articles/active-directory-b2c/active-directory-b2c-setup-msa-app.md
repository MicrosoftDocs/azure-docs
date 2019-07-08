---
title: Set up sign-up and sign-in with a Microsoft account - Azure Active Directory B2C
description: Provide sign-up and sign-in to customers with Microsoft accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/08/2019
ms.author: marsma
ms.subservice: B2C
---

# Set up sign-up and sign-in with a Microsoft account using Azure Active Directory B2C

## Create a Microsoft account application

To use a Microsoft account as an [identity provider](active-directory-b2c-reference-oidc.md) in Azure Active Directory (Azure AD) B2C, you need to create an application in the Azure AD tenant. The Azure AD tenant is not the same as your Azure AD B2C tenant. If you don’t already have a Microsoft account, you can get one at [https://www.live.com/](https://www.live.com/).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your Azure AD tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
1. Select **New registration**.
1. Enter a **Name** for your application. For example, *MSAapp1*.
1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**. This option targets the widest set of Microsoft identities.

   For more information on the different account type selections, see [Quickstart: Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md).
1. Under **Redirect URI (optional)**, select **Web** and enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in the text box. Replace `your-tenant-name` with your Azure AD B2C tenant name.
1. Select **Register**
1. Record the **Application (client) ID** shown on the application Overview page. You need this when you configure the identity provider in the next section.
1. Select **Certificates & secrets**
1. Click **New client secret**
1. Enter a **Description** for the secret, for example *Application password 1*, and then click **Add**.
1. Record the application password shown in the **VALUE** column. You need this when you configure the identity provider in the next section.

## Configure a Microsoft account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **Add**.
1. Provide a **Name**. For example, enter *MSA*.
1. Select **Identity provider type**, select **Microsoft Account**, and click **OK**.
1. Select **Set up this identity provider** and enter the Application (client) ID that you recorded earlier in the **Client ID** text box, and enter the client secret that you recorded in the **Client secret** text box.
1. Click **OK** and then click **Create** to save your Microsoft account configuration.
