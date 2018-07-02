---
title: Twitter configuration for Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with Twitter accounts in your applications that are secured by Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: article
ms.date: 6/13/2018
ms.author: davidmu
ms.component: B2C
---

# Provide sign-up and sign-in to consumers with Twitter accounts using Azure AD B2C

## Create a Twitter application

To use Twitter as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create a Twitter application and supply it with the right parameters. You need a Twitter account to do this. If you don’t have one, you can get it at [https://twitter.com/signup](https://twitter.com/signup).

1. Go to the [Twitter Apps](https://apps.twitter.com/) and sign in with your credentials.
2. Click **Create New App**.
3. In the form, provide a value for the **Name**, **Description**, and **Website**.
4. For the **Callback URL**, enter `https://login.microsoftonline.com/te/{tenant}/{policyId}/oauth1/authresp`. Make sure to replace **{tenant}** with your tenant's name (for example, contosob2c.onmicrosoft.com) and {policyId} with your policy id (for example, b2c_1_policy).  This callback URL needs to be in all lowercase. You should add a callback URL for all policies that use the Twitter login. Make sure to use `b2clogin.com` instead of ` login.microsoftonline.com` if you are using it in your application.
5. Check the box to agree to the **Developer Agreement** and click **Create your Twitter application**.
6. After the app is created, select it in the list, select the **Settings** tab, and then click **Update settings**.
7. Select the **Keys and Access Tokens** tab.
8. Copy the value of **Consumer Key** and **Consumer Secret**. You will need both of them to configure Twitter as an identity provider in your tenant.

## Configure Twitter as an identity provider in your tenant

1. Log in to the [Azure portal](https://portal.azure.com/) as the Global Administrator of the Azure AD B2C tenant. 
2. To switch to your Azure AD B2C tenant, select the Azure AD B2C directory in the top-right corner of the portal.
3. Click **All services**, and then select **Azure AD B2C** from the services list under **Security + Identity**.
4. Click **Identity providers**.
5. Provide a friendly **Name** for the identity provider configuration. For example, enter "Twitter".
6. Click **Identity provider type**, select **Twitter (Preview)**, and click **OK**.
7. Click **Set up this identity provider** and enter the Twitter **Consumer Key** for the **Client id** and the Twitter **Consumer Secret** for the **Client secret**.
8. Click **OK**, and then click **Create** to save your Twitter configuration.

## Next steps

Create or edit a [built-in policy](active-directory-b2c-reference-policies.md) and add Twitter as an identity provider.