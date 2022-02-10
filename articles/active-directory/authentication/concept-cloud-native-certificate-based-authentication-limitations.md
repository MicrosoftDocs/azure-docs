---
title: Limitations with cloud native certificate-based authentication without federation - Azure Active Directory
description: Learn supported and unsupported scenarios for cloud native certificate-based authentication in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 02/08/2022

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: tommma

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Limitations with cloud native certificate-based authentication in Azure Active Directory

This topic covers supported and unsupported scenarios for cloud native certificate-based authentication in Azure Active Directory.

>[!NOTE]
>Cloud-native certificate-based authentication is currently in public preview. Some features might not be supported or have limited capabilities. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 

## Supported scenarios

The following scenarios are supported:

- User sign-ins to web browser-based applications on all platforms.
- User sign-ins on mobile Native browsers.
- Support for granular authentication rules for multifactor authentication by using the certificate issuer **Subject** and **policy OIDs**.
- Configuring certificate-to-user account bindings by using the certificate Subject Alternate Name (SAN) principal name and SAN RFC822 name.

## Unsupported scenarios

The following scenarios aren't supported:

- Public Key Infrastructure for creating client certificates. Customers need to configure their own Public Key Infrastructure (PKI) and provision certificates to their users and devices. 
- Certificate Authority hints are not supported so the list of certificates that appears for users in the UI isn't scoped.
- Windows login using smart cards on Windows devices.
- Only one Certificate Distribution Point for a trusted CA is supported.
- The Certificate Distribution Point can be only HTTP URLs. We don't support Online Certificate Status Protocol (OSCP), or Lightweight Directory Access Protocol (LDAP) URLs.
- Configuring other certificate-to-user account bindings, such as using the **subject field**, or **keyid** and **issuer**, aren’t available in this release.
- Currently, password can't be disabled when CBA is enabled and the option to sign in using a password is displayed.

## Next steps

- [Overview of cloud native CBA](concept-cloud-native-certificate-based-authentication.md)
- [Technical deep dive for cloud-native CBA](concept-cloud-native-certificate-based-authentication-technical-deep-dive.md)   
- [How to configure cloud native CBA](how-to-certificate-based-authentication.md)
- [FAQ](cloud-native-certificate-based-authentication-faq.yml)
- [Troubleshoot cloud native CBA](troubleshoot-cloud-native-certificate-based-authentication.md)

