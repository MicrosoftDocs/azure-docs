---
title: Set up sign-up and sign-in with a LinkedIn account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with LinkedIn accounts in your applications using Azure Active Directory B2C.
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

# Set up sign-up and sign-in with a LinkedIn account using Azure Active Directory B2C

## Create a LinkedIn application

To use a LinkedIn account as an [identity provider](authorization-code-flow.md) in Azure Active Directory B2C (Azure AD B2C), you need to create an application in your tenant that represents it. If you don't already have a LinkedIn account, you can sign up at [https://www.linkedin.com/](https://www.linkedin.com/).

1. Sign in to the [LinkedIn Developers website](https://www.developer.linkedin.com/) with your LinkedIn account credentials.
1. Select **My Apps**, and then click **Create Application**.
1. Enter **Company Name**, **Application Name**, **Application Description**, **Application Logo**, **Application Use**, **Website URL**, **Business Email**, and **Business Phone**.
1. Agree to the **LinkedIn API Terms of Use** and click **Submit**.
1. Copy the values of **Client ID** and **Client Secret**. You can find them under **Authentication Keys**. You will need both of them to configure LinkedIn as an identity provider in your tenant. **Client Secret** is an important security credential.
1. Enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp` in **Authorized Redirect URLs**. Replace `your-tenant-name` with the name of your tenant. You need to use all lowercase letters when entering your tenant name even if the tenant is defined with uppercase letters in Azure AD B2C. Select **Add**, and then click **Update**.

## Configure a LinkedIn account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **LinkedIn**.
1. Enter a **Name**. For example, *LinkedIn*.
1. For the **Client ID**, enter the Client ID of the LinkedIn application that you created earlier.
1. For the **Client secret**, enter the Client Secret that you recorded.
1. Select **Save**.

## Migration from v1.0 to v2.0

LinkedIn recently [updated their APIs from v1.0 to v2.0](https://engineering.linkedin.com/blog/2018/12/developer-program-updates). As part of the migration, Azure AD B2C is only able to obtain the full name of the LinkedIn user during the sign-up. If an email address is one of the attributes that is collected during sign-up, the user must manually enter the email address and validate it.
