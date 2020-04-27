---
title: Set up sign-in for an Azure AD organization
titleSuffix: Azure AD B2C
description: Set up sign-in for a specific Azure Active Directory organization in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/20/2020
ms.author: mimart
ms.subservice: B2C
ms.custom: fasttrack-edit
---

# Set up sign-in for a specific Azure Active Directory organization in Azure Active Directory B2C

To use an Azure Active Directory (Azure AD) as an [identity provider](authorization-code-flow.md) in Azure AD B2C, you need to create an application that represents it. This article shows you how to enable sign-in for users from a specific Azure AD organization using a user flow in Azure AD B2C.

[!INCLUDE [active-directory-b2c-identity-provider-azure-ad](../../includes/active-directory-b2c-identity-provider-azure-ad.md)]

## Configure Azure AD as an identity provider

1. Make sure you're using the directory that contains Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your Azure AD B2C tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *Contoso Azure AD*.
1. For **Metadata url**, enter the following URL replacing `{tenant}` with the domain name of your Azure AD tenant:

    ```
    https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration
    ```

    For example, `https://login.microsoftonline.com/contoso.onmicrosoft.com/v2.0/.well-known/openid-configuration`.

1. For **Client ID**, enter the application ID that you previously recorded.
1. For **Client secret**, enter the client secret that you previously recorded.
1. For the **Scope**, enter the `openid profile`.
1. Leave the default values for **Response type**, and **Response mode**.
1. (Optional) For the **Domain hint**, enter `contoso.com`. For more information, see [Set up direct sign-in using Azure Active Directory B2C](direct-signin.md#redirect-sign-in-to-a-social-provider).
1. Under **Identity provider claims mapping**, select the following claims:

    * **User ID**: *oid*
    * **Display name**: *name*
    * **Given name**: *given_name*
    * **Surname**: *family_name*
    * **Email**: *unique_name*

1. Select **Save**.
