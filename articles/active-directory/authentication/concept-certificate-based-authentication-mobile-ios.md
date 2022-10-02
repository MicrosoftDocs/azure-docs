---
title: Azure Active Directory certificate-based authentication on iOS devices - Azure Active Directory
description: Learn about Azure Active Directory certificate-based authentication on iOS devices

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/30/2022

ms.author: justinha
author: vimrang
manager: daveba
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Azure Active Directory certificate-based authentication on iOS

Devices that run iOS can use certificate-based authentication (CBA) to authenticate to Azure Active Directory (Azure AD) using a client certificate on their device when connecting to:

- Office mobile applications such as Microsoft Outlook and Microsoft Word
- Exchange ActiveSync (EAS) clients

Azure AD CBA is supported for certificates on-device on native browsers as well as on Microsoft first-party applications on iOS devices. 

## Prerequisites

- iOS version must be iOS 9 or later.
- Microsoft Authenticator is required for Office applications and Outlook on iOS.

## Support for on-device certificates and external storage

On-device certificates are provisioned on the device. Customers can use Mobile Device Management (MDM) to provision the certificates on the device. Since iOS does not support hardware protected keys out of the box, customers can use external storage devices for certificates.

**Advantages of external storage for certificates**

Customers can use external security keys to store their certificates. Security keys with certificate 

1. enable the usage on any device and does not require the provision on every device the user has.
1. is hardware secured with a PIN which makes them phishing resistant
1. provides MFA (multi factor authentication) with a PIN as second factor to access the private key of the certificate in the key
1. satisfies the industry requirement to have MFA on seperate device
1. future proofing where multiple credentials can be stored including FIDO2 keys.

## Supported platforms**

1. Only native browsers are support. 
1. applications using latest MSAL libraries or Microsoft Authenticator can do CBA
1. Edge with profile, when users add account and logged in a profile will support CBA
1. Microsoft first party apps with latest MSAL libraries or Microsoft Authenticator can do CBA

**Browsers**

|Edge | chrome | safari | firefox |
|--------|---------|------|-------|
|&#10060; | &#10060; | &#x2705; |&#10060; |

**Vendors for External storage**

Azure AD CBA will support certificates on YubiKeys. Users can install YubiKey authenticator application from YubiKey and do Azure AD CBA. For applications not on latest MSAL libraries need to also install Microsoft authenticator.

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

On iOS 9 or later, the native iOS mail client is supported. 

To determine if your email application supports Azure AD CBA, contact your application developer.

## Known issue

On iOS, users will see a "double prompt", where they must click the option to use certificate-based authentication twice. We're working to create a seamless user experience.

## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [Azure AD CBA on Android devices](concept-certificate-based-authentication-mobile-android.md)
- [Windows smart card logon using Azure AD CBA](concept-certificate-based-authentication-smartcard.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [Advanced features](concept-certificate-based-authentication-advanced-features.md)
- [FAQ](certificate-based-authentication-faq.yml)
