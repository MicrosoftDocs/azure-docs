---
title: Azure Active Directory certificate-based authentication on mobile devices (Android and iOS) - Azure Active Directory
description: Learn about Azure Active Directory certificate-based authentication on mobile devices (Android and iOS)

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
# Azure Active Directory certificate-based authentication on mobile devices (Android and iOS) (Preview)

Android and iOS devices can use certificate-based authentication (CBA) to authenticate to Azure Active Directory using a client certificate on their device when connecting to:

- Office mobile applications such as Microsoft Outlook and Microsoft Word
- Exchange ActiveSync (EAS) clients

Azure AD certificate-based authentication (CBA) is supported for certificates on-device on native browsers as well as on Microsoft first-party applications on both iOS and Android devices. 

Azure AD CBA eliminates the need to enter a username and password combination into certain mail and Microsoft Office applications on your mobile device.

## Prerequisites

- For Android device, OS version must be Android 5.0 (Lollipop) and above.
- For iOS device, OS version must be iOS 9 or above.
- Microsoft Authenticator is required for Office applications on iOS.

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

Certain Exchange ActiveSync applications on Android 5.0 (Lollipop) or later are supported. 

To determine if your email application supports this feature, contact your application developer.

## Known issue

On iOS, users will see a double prompt, where they must click the option to use certificate-based authentication twice. We are working on making the user experience better.

## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)   
- [Limitations with Azure AD CBA](concept-certificate-based-authentication-limitations.md)
- [Windows SmartCard logon using Azure AD CBA](concept-certificate-based-authentication-smartcard.md)
- [FAQ](certificate-based-authentication-faq.yml)
- [Troubleshoot Azure AD CBA](troubleshoot-certificate-based-authentication.md)


