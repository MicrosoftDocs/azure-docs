---
title: Set up sign-up and sign-in with an Amazon account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Amazon accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/05/2020
ms.author: mimart
ms.subservice: B2C
---

# Set up sign-up and sign-in with an Amazon account using Azure Active Directory B2C

## Create an app in the Amazon developer console

To use an Amazon account as a federated identity provider in Azure Active Directory B2C (Azure AD B2C), you need to create an application in your [Amazon Developer Services and Technologies](https://developer.amazon.com). If you don't already have an Amazon account, you can sign up at [https://www.amazon.com/](https://www.amazon.com/).

> [!NOTE]  
> Use the following URLs in **step 8** below, replacing `your-tenant-name` with the name of your tenant. When entering your tenant name, use all lowercase letters, even if the tenant is defined with uppercase letters in Azure AD B2C.
> - For **Allowed Origins**, enter `https://your-tenant-name.b2clogin.com` 
> - For **Allowed Return URLs**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`

[!INCLUDE [identity-provider-amazon-idp-register.md](../../includes/identity-provider-amazon-idp-register.md)]

## Configure an Amazon account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Amazon**.
1. Enter a **Name**. For example, *Amazon*.
1. For the **Client ID**, enter the Client ID of the Amazon application that you created earlier.
1. For the **Client secret**, enter the Client Secret that you recorded.
1. Select **Save**.
