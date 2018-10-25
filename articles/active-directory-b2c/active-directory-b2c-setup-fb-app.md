---
title: Set up sign-up and sign-in with a Facebook account using Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with Facebook accounts in your applications using Azure Active Directory B2C.
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

# Set up sign-up and sign-in with a Facebook account using Azure Active Directory B2C

## Create a Facebook application

To use a Facebook account as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a Facebook account, you can get it at [https://www.facebook.com/](https://www.facebook.com/).

1. Sign in to [Facebook for developers](https://developers.facebook.com/) with your Facebook account credentials.
2. If you have not already done so, you need to register as a Facebook developer. To do this, select **Register** on the upper-right corner of the page, accept Facebook's policies, and complete the registration steps.
3. Select **My Apps** and then click **Add a New App**. 
4. Enter a **Display Name** and a valid **Contact Email**.
5. Click **Create App ID**. This may require you to accept Facebook platform policies and complete an online security check.
6. Select **Settings** > **Basic**.
7. Choose a **Category**, for example `Business and Pages`. This value is required by Facebook, but not used for Azure AD B2C.
8. At the bottom of the page, select **Add Platform**, and then select **Website**.
9. In **Site URL**, enter `https://your-tenant-name.b2clogin.com/` replacing `your-tenant-name` with the name of your tenant. Enter a URL for the **Privacy Policy URL**, for example `http://www.contoso.com`. The policy URL is a page you maintain to provide privacy information for your application.
10. Select **Save Changes**.
11. At the top of the page, copy the value of **App ID**. 
12. Click **Show** and copy the value of **App Secret**. You use both of them to configure Facebook as an identity provider in your tenant. **App Secret** is an important security credential.
13. Select **Products**, and then select **Set up** under **Facebook Login**.
14. Select **Settings** under **Facebook Login**.
15. In **Valid OAuth redirect URIs**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-tenant-name` with the name of your tenant. Click **Save Changes** at the bottom of the page.
16. To make your Facebook application available to Azure AD B2C, select **App Review**, set **Make My Application public?** to **YES**,  and then click **Confirm**.

## Configure a Facebook account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant. 
3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Enter a **Name**. For example, enter *Facebook*.
6. Select **Identity provider type**, select **Facebook**, and click **OK**.
7. Select **Set up this identity provider** and enter the App ID that you recorded earlier as the **Client ID** and enter the App Secret that you recorded as the **Client secret** of the Facebook application that you created earlier.
8. Click **OK** and then click **Create** to save your Facebook configuration.