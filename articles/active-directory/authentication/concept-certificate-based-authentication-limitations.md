---
title: Limitations with Azure AD certificate-based authentication without federation - Azure Active Directory
description: Learn supported and unsupported scenarios for Azure AD certificate-based authentication

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 06/07/2022

ms.author: justinha
author: vimrang
manager: daveba
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Limitations with Azure AD certificate-based authentication 

This topic covers supported and unsupported scenarios for Azure Active Directory (Azure AD) certificate-based authentication.

>[!NOTE]
>Azure AD certificate-based authentication is currently in public preview. Some features might not be supported or have limited capabilities. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 

## Supported scenarios

The following scenarios are supported:

- User sign-ins to web browser-based applications on all platforms.
- User sign-ins on mobile native browsers.
- Support for granular authentication rules for multifactor authentication by using the certificate issuer **Subject** and **policy OIDs**.
- Configuring certificate-to-user account bindings by using the certificate Subject Alternate Name (SAN) principal name and SAN RFC822 name.

## Unsupported scenarios

The following scenarios aren't supported:

- Public Key Infrastructure for creating client certificates. Customers need to configure their own Public Key Infrastructure (PKI) and provision certificates to their users and devices. 
- Certificate Authority hints aren't supported, so the list of certificates that appears for users in the UI isn't scoped.
- Only one CRL Distribution Point (CDP) for a trusted CA is supported.
- The CDP can be only HTTP URLs. We don't support Online Certificate Status Protocol (OCSP), or Lightweight Directory Access Protocol (LDAP) URLs.
- Configuring other certificate-to-user account bindings, such as using the **subject field**, or **keyid** and **issuer**, aren’t available in this release.
- Currently, password can't be disabled when CBA is enabled and the option to sign in using a password is displayed.

## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)   
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [FAQ](certificate-based-authentication-faq.yml)
- [Troubleshoot Azure AD CBA](troubleshoot-certificate-based-authentication.md)

