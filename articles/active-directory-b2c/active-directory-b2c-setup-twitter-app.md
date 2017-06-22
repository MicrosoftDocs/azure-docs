---
title: 'Azure Active Directory B2C: Twitter configuration | Microsoft Docs'
description: Provide sign-up and sign-in to consumers with Twitter accounts in your applications that are secured by Azure Active Directory B2C.
services: active-directory-b2c
documentationcenter: ''
author: parakhj
manager: krassk
editor: parakhj

ms.assetid: 579a6841-9329-45b8-a351-da4315a6634e
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/06/2017
ms.author: parakhj

---

# Azure Active Directory B2C: Provide sign-up and sign-in to consumers with Twitter accounts

> [!NOTE]
> This feature is in preview.
> 

## Create a Twitter application
To use Twitter as an identity provider in Azure Active Directory (Azure AD) B2C, you need to create a Twitter application and supply it with the right parameters. You need a Twitter developer account to do this. If you don’t have one, you can get it at [https://dev.twitter.com/](https://dev.twitter.com/).

1. Go to the [Twitter developer's website](https://dev.twitter.com/) and sign in with your credentials.
2. Click **My apps** under **Tools & Support** and then click **Create New App**. 
3. In the form, provide a value for the **Name**, **Description**, and **Website**.
4. For the **Callback URL**, enter `https://login.microsoftonline.com/te/{tenant}/oauth2/authresp`. Make sure to replace **{tenant}** with your tenant's name (for example, contosob2c.onmicrosoft.com).
5. Check the box to agree to the **Developer Agreement** and click **Create your Twitter application**.
6. Once the app is created, click **Keys and Access Tokens**.
7. Copy the value of **Consumer Key** and **Consumer Secret**. You will need both of them to configure Twitter as an identity provider in your tenant.

## Configure Twitter as an identity provider in your tenant
1. Follow these steps to [navigate to the B2C features blade](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade) on the Azure portal.
2. On the B2C features blade, click **Identity providers**.
3. Click **+Add** at the top of the blade.
4. Provide a friendly **Name** for the identity provider configuration. For example, enter "Twitter".
5. Click **Identity provider type**, select **Twitter**, and click **OK**.
6. Click **Set up this identity provider** and enter the Twitter **Consumer Key** for the **Client id** and the Twitter **Consumer Secret** for the **Client secret**.
7. Click **OK**, and then click **Create** to save your Twitter configuration.

