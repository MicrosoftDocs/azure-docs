---
title: Azure Active Directory certificate-based authentication on Android devices - Azure Active Directory
description: Learn about Azure Active Directory certificate-based authentication on Android devices

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 10/05/2022

ms.author: justinha
author: vimrang
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Azure Active Directory certificate-based authentication on Android devices

Android devices can use a client certificate on their device for certificate-based authentication (CBA) to Azure Active Directory (Azure AD). CBA can be used to connect to:

- Office mobile applications such as Microsoft Outlook and Microsoft Word
- Exchange ActiveSync (EAS) clients

Azure AD CBA is supported for certificates on-device on native browsers, and on Microsoft first-party applications on Android devices. 

## Prerequisites

- Android version must be Android 5.0 (Lollipop) or later.

## Support for on-device certificates

On-device certificates are provisioned on the device. Customers can use Mobile Device Management (MDM) to provision the certificates on the device. 

## Supported platforms

- Applications using latest MSAL libraries or Microsoft Authenticator can do CBA
- Edge with profile, when users add account and sign in with a profile, will support CBA
- Microsoft first-party apps with latest MSAL libraries or Microsoft Authenticator can do CBA

## Microsoft mobile applications support

| Applications | Support | 
|:---------|:------------:|
|Azure Information Protection app|  &#x2705; |
|Company Portal	 |  &#x2705; |
|Microsoft Teams |  &#x2705; |
|Office (mobile) |  &#x2705; |
|OneNote |  &#x2705; |
|OneDrive |  &#x2705; |
|Outlook |  &#x2705; |
|Power BI |  &#x2705; |
|Skype for Business	 |  &#x2705; |
|Word / Excel / PowerPoint	 |  &#x2705; |
|Yammer	 |  &#x2705; |

## Support for Exchange ActiveSync clients

Certain Exchange ActiveSync applications on Android 5.0 (Lollipop) or later are supported. 

To determine if your email application supports Azure AD CBA, contact your application developer.

## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [Azure AD CBA on iOS devices](concept-certificate-based-authentication-mobile-ios.md)
- [Windows SmartCard logon using Azure AD CBA](concept-certificate-based-authentication-smartcard.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [FAQ](certificate-based-authentication-faq.yml)
