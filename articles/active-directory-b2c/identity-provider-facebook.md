---
title: Set up sign-up and sign-in with a Facebook account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Facebook accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/26/2019
ms.author: mimart
ms.subservice: B2C
---

# Set up sign-up and sign-in with a Facebook account using Azure Active Directory B2C

## Create a Facebook application

To use a Facebook account as an [identity provider](authorization-code-flow.md) in Azure Active Directory B2C (Azure AD B2C), you need to create an application in your tenant that represents it. If you don't already have a Facebook account, you can sign up at [https://www.facebook.com/](https://www.facebook.com/).

1. Sign in to [Facebook for developers](https://developers.facebook.com/) with your Facebook account credentials.
1. If you have not already done so, you need to register as a Facebook developer. To do this, select **Get Started** on the upper-right corner of the page, accept Facebook's policies, and complete the registration steps.
1. Select **My Apps** and then **Create App**.
1. Enter a **Display Name** and a valid **Contact Email**.
1. Select **Create App ID**. This may require you to accept Facebook platform policies and complete an online security check.
1. Select **Settings** > **Basic**.
1. Choose a **Category**, for example `Business and Pages`. This value is required by Facebook, but not used for Azure AD B2C.
1. At the bottom of the page, select **Add Platform**, and then select **Website**.
1. In **Site URL**, enter `https://your-tenant-name.b2clogin.com/` replacing `your-tenant-name` with the name of your tenant. Enter a URL for the **Privacy Policy URL**, for example `http://www.contoso.com`. The policy URL is a page you maintain to provide privacy information for your application.
1. Select **Save Changes**.
1. At the top of the page, copy the value of **App ID**.
1. Select **Show** and copy the value of **App Secret**. You use both of them to configure Facebook as an identity provider in your tenant. **App Secret** is an important security credential.
1. Select the plus sign next to **PRODUCTS**, and then select **Set up** under **Facebook Login**.
1. Under **Facebook Login**, select **Settings**.
1. In **Valid OAuth redirect URIs**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-tenant-name` with the name of your tenant. Select **Save Changes** at the bottom of the page.
1. To make your Facebook application available to Azure AD B2C, select the Status selector at the top right of the page and turn it **On** to make the Application public, and then select **Switch Mode**.  At this point the Status should change from **Development** to **Live**.

## Configure a Facebook account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Facebook**.
1. Enter a **Name**. For example, *Facebook*.
1. For the **Client ID**, enter the App ID of the Facebook application that you created earlier.
1. For the **Client secret**, enter the App Secret that you recorded.
1. Select **Save**.
