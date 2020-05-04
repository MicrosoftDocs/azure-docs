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

[!INCLUDE [active-directory-b2c-identity-provider-amazon](../../includes/active-directory-b2c-identity-provider-amazon.md)]

## Configure an Amazon account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Amazon**.
1. Enter a **Name**. For example, *Amazon*.
1. For the **Client ID**, enter the Client ID of the Amazon application that you created earlier.
1. For the **Client secret**, enter the Client Secret that you recorded.
1. Select **Save**.
