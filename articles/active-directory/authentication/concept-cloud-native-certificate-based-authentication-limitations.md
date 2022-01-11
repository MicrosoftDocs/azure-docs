---
title: Limitations with cloud native certificate-based authentication without federation - Azure Active Directory
description: Learn supported and unsupported scenarios for cloud native certificate-based authentication in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/11/2022

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: tommma

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Limitations with cloud native certificate-based authentication in Azure Active Directory

This topic covers supported and unsupported scenarios for cloud native certificate-based authentication in Azure Active Directory.

## Supported scenarios

The following scenarios are supported:

- User sign-ins to web browser-based applications.
- User sign-ins to Outlook clients.
- User sign-ins on mobile native browsers for managed accounts.
- User sign-ins on Office 365 apps <!---Which ones should we list as Peter tested some and it worked--->
- Support for strong authentication with multifactor authentication.
- Certificate to user account binding configurations using the subject field and issuer is supported.

## Unsupported scenarios

The following scenarios are not supported:

- Public Key Infrastructure for creating client certificates. Customers need to configure their own Public Key Infrastructure (PKI) and provision certificates to their users/devices. 
- Certificate Authority hints are not supported so that the list of certs in the client certificate picker UI is not scoped down for users.
- Windows login using smart cards on Windows devices
- Only one Certificate Distribution Point for a trusted CA is supported.
- Certificate Distribution Point can be only HTTP URLs. We do not support OSCP, or LDAP URLs.
- Other certificate to user account binding configurations such as using the subject field, or keyid + issuer, aren’t available in this release.
- Currently, Password cannot be disabled with Certificate-based authentication is enabled and option to login will still be present.

## Next steps

[Overview of cloud native certificate-based authentication](concept-cloud-native-certificate-based-authentication.md)
[Get started with cloud native certificate-based authentication](how-to-certificate-based-authentication.md)
[FAQ](cloud-native-certificate-based-authentication-faq.yml)
[Troubleshoot cloud native certificate-based authentication](troubleshoot-cloud-native-certificate-based-authentication.md)


