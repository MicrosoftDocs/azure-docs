---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 06/11/2021
ms.author: mimart
# Used by Azure AD B2C app integration articles under "App integration".
---
## Use a custom domain

By using a [custom domain](../articles/active-directory-b2c/custom-domain.md), you can fully brand the authentication URL. From a user perspective, the user remains on your domain during the authentication process, rather than being redirected to the Azure AD B2C b2clogin.com domain name.

You can also replace your B2C tenant name (contoso.onmicrosoft.com) in the authentication request URL with your tenant ID GUID to remove all references to "b2c" in the URL. For example, you can change `https://fabrikamb2c.b2clogin.com/contoso.onmicrosoft.com/` to `https://account.contosobank.co.uk/<tenant ID GUID>/`.
