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
ms.date: 08/08/2019
ms.author: mimart
ms.subservice: B2C
ms.custom: fasttrack-edit
---

# Set up sign-in for a specific Azure Active Directory organization in Azure Active Directory B2C

To use an Azure Active Directory (Azure AD) as an [identity provider](authorization-code-flow.md) in Azure AD B2C, you need to create an application that represents it. This article shows you how to enable sign-in for users from a specific Azure AD organization using a user flow in Azure AD B2C.

## Create an Azure AD app

To enable sign-in for users from a specific Azure AD organization, you need to register an application within the organizational Azure AD tenant, which is not the same as your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your Azure AD tenant. This is not the same tenant as your Azure AD B2C tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
4. Select **New registration**.
5. Enter a name for your application. For example, `Azure AD B2C App`.
6. Accept the selection of **Accounts in this organizational directory only** for this application.
7. For the **Redirect URI**, accept the value of **Web**, and enter the following URL in all lowercase letters, where `your-B2C-tenant-name` is replaced with the name of your Azure AD B2C tenant. For example, `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/oauth2/authresp`:

    ```
    https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp
    ```

    All URLs should now be using [b2clogin.com](b2clogin.md).

8. Click **Register**. Copy the **Application (client) ID** to be used later.
9. Select **Certificates & secrets** in the application menu, and then select **New client secret**.
10. Enter a name for the client secret. For example, `Azure AD B2C App Secret`.
11. Select the expiration period. For this application, accept the selection of **In 1 year**.
12. Select **Add** and copy the value of the new client secret that is displayed to be used later.

## Configure Azure AD as an identity provider

1. Make sure you're using the directory that contains Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your Azure AD B2C tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *Contoso Azure AD*.
1. For **Metadata url**, enter the following URL replacing `your-AD-tenant-domain` with the domain name of your Azure AD tenant:

    ```
    https://login.microsoftonline.com/your-AD-tenant-domain/.well-known/openid-configuration
    ```

    For example, `https://login.microsoftonline.com/contoso.onmicrosoft.com/.well-known/openid-configuration`.

    **Do not** use the Azure AD v2.0 metadata endpoint, for example `https://login.microsoftonline.com/contoso.onmicrosoft.com/v2.0/.well-known/openid-configuration`. Doing so results in an error similar to `AADB2C: A claim with id 'UserId' was not found, which is required by ClaimsTransformation 'CreateAlternativeSecurityId' with id 'CreateAlternativeSecurityId' in policy 'B2C_1_SignUpOrIn' of tenant 'contoso.onmicrosoft.com'` when attempting to sign in.

1. For **Client ID**, enter the application ID that you previously recorded.
1. For **Client secret**, enter the client secret that you previously recorded.
1. Leave the default values for **Scope**, **Response type**, and **Response mode**.
1. (Optional) Enter a value for **Domain_hint**. For example, *ContosoAD*. This is the value to use when referring to this identity provider using *domain_hint* in the request.
1. Under **Identity provider claims mapping**, enter the following claims mapping values:

    * **User ID**: *oid*
    * **Display name**: *name*
    * **Given name**: *given_name*
    * **Surname**: *family_name*
    * **Email**: *unique_name*

1. Select **Save**.
