---
title: Limitations with Microsoft Entra certificate-based authentication without federation
description: Learn supported and unsupported scenarios for Microsoft Entra certificate-based authentication

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Limitations with Microsoft Entra certificate-based authentication 

This topic covers supported and unsupported scenarios for Microsoft Entra certificate-based authentication.

## Supported scenarios

The following scenarios are supported:

- User sign-ins to web browser-based applications on all platforms.
- User sign-ins to Office mobile apps, including Outlook, OneDrive, and so on.
- User sign-ins on mobile native browsers.
- Support for granular authentication rules for multifactor authentication by using the certificate issuer **Subject** and **policy OIDs**.
- Configuring certificate-to-user account bindings by using any of the certificate fields:
  - Subject Alternate Name (SAN) PrincipalName and SAN RFC822Name
  - Subject Key Identifier (SKI) and SHA1PublicKey
- Configuring certificate-to-user account bindings by using any of the user object attributes:
  - User Principal Name
  - onPremisesUserPrincipalName
  - CertificateUserIds

## Unsupported scenarios

The following scenarios aren't supported:

- Public Key Infrastructure for creating client certificates. Customers need to configure their own Public Key Infrastructure (PKI) and provision certificates to their users and devices. 
- Certificate Authority hints aren't supported, so the list of certificates that appears for users in the UI isn't scoped.
- Only one CRL Distribution Point (CDP) for a trusted CA is supported.
- The CDP can be only HTTP URLs. We don't support Online Certificate Status Protocol (OCSP), or Lightweight Directory Access Protocol (LDAP) URLs.
- Configuring other certificate-to-user account bindings, such as using the **subject + issuer** or **Issuer + Serial Number**, aren’t available in this release.
- Currently, password can't be disabled when CBA is enabled and the option to sign in using a password is displayed.

## Supported operating systems

| Operating system | Certificate on-device/Derived PIV |       Smart cards      |
|:-----------------|:---------------------------------:|:----------------------:|
| Windows          |          &#x2705;                 |        &#x2705;        |
| macOS            |          &#x2705;                 |        &#x2705;        |
| iOS              |          &#x2705;                 | Supported vendors only |
| Android          |          &#x2705;                 | Supported vendors only |


## Supported browsers

| Operating system |  Chrome certificate on-device   |  Chrome smart card   |   Safari certificate on-device  |   Safari  smart card |    Edge certificate on-device    |    Edge smart card    |
|:-----------------|:----------:|:----------:|:----------:|:----------:|:-----------------|:----------:|
| Windows          |  &#x2705;  |  &#x2705;  |  &#x2705;  |  &#x2705;  |     &#x2705;     |  &#x2705;  |  
| macOS            |  &#x2705;  |  &#x2705;  |  &#x2705;  |  &#x2705;  |     &#x2705;     |  &#x2705;  | 
| iOS              |  &#10060;  |  &#10060;  |  &#x2705;  |  Supported vendors only  |      &#10060;     |  &#10060; |
| Android          | &#x2705;  | &#10060;    |  N/A       | N/A        |    &#10060;     | &#10060;  |

>[!NOTE]
> On iOS and Android mobile, Edge browser users can sign into Edge to set up a profile by using the Microsoft Authentication Library (MSAL), like the Add account flow. When logged in to Edge with a profile, CBA is supported with on-device certificates and smart cards.

## Smart card providers

|Provider  |  Windows   |   Mac OS   |    iOS     |   Android  |
|:---------|:----------:|:----------:|:----------:|:----------:|
|YubiKey   |  &#x2705;  |  &#x2705;  |  &#x2705;  |  &#x2705;  |


## Next steps

- [Overview of Microsoft Entra CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Microsoft Entra CBA](concept-certificate-based-authentication-technical-deep-dive.md)   
- [How to configure Microsoft Entra CBA](how-to-certificate-based-authentication.md)
- [Windows SmartCard logon using Microsoft Entra CBA](concept-certificate-based-authentication-smartcard.md)
- [Microsoft Entra CBA on mobile devices (Android and iOS)](./concept-certificate-based-authentication-mobile-ios.md)
- [CertificateUserIDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [FAQ](certificate-based-authentication-faq.yml)
