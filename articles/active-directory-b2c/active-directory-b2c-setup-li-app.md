---
title: Set up sign-up and sign-in with a LinkedIn account - Azure Active Directory B2C | Microsoft Docs
description: Provide sign-up and sign-in to customers with LinkedIn accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/01/2019
ms.author: marsma
ms.subservice: B2C
---

# Set up sign-up and sign-in with a LinkedIn account using Azure Active Directory B2C

## Create a LinkedIn application

To use a LinkedIn account as an [identity provider](active-directory-b2c-reference-oauth-code.md) in Azure Active Directory (Azure AD) B2C, you need to create an application in your tenant that represents it. If you don’t already have a LinkedIn account, you can get it at [https://www.linkedin.com/](https://www.linkedin.com/).

1. Sign in to the [LinkedIn Developers website](https://www.developer.linkedin.com/) with your LinkedIn account credentials.
2. Select **My Apps**, and then click **Create Application**.
3. Enter **Company Name**, **Application Name**, **Application Description**, **Application Logo**, **Application Use**, **Website URL**, **Business Email**, and **Business Phone**.
4. Agree to the **LinkedIn API Terms of Use** and click **Submit**.
5. Copy the values of **Client ID** and **Client Secret**. You can find them under **Authentication Keys**. You will need both of them to configure LinkedIn as an identity provider in your tenant. **Client Secret** is an important security credential.
6. Enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in **Authorized Redirect URLs**. Replace `your-tenant-name` with the name of your tenant. You need to use all lowercase letters when entering your tenant name even if the tenant is defined with uppercase letters in Azure AD B2C. Select **Add**, and then click **Update**.

## Configure a LinkedIn account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
4. Select **Identity providers**, and then select **Add**.
5. Provide a **Name**. For example, enter *LinkedIn*.
6. Select **Identity provider type**, select **LinkedIn**, and click **OK**.
7. Select **Set up this identity provider** and enter the Client Id that you recorded earlier as the **Client ID** and enter the Client Secret that you recorded as the **Client secret** of the LinkedIn account application that you created earlier.
8. Click **OK** and then click **Create** to save your LinkedIn account configuration.

## Migration from v1.0 to v2.0

LinkedIn recently [updated their API's from v1.0 to v2.0](https://engineering.linkedin.com/blog/2018/12/developer-program-updates). As part of the migration, Azure AD B2C is only able to obtain the full name of the LinkedIn user during the sign-up. If an email address is one of the attributes that is collected during sign-up, the user must manually enter the email address and validate it.
