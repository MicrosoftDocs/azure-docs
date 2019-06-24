---
title: Certificate-based authentication on iOS - Azure Active Directory
description: Learn about the supported scenarios and the requirements for configuring certificate-based authentication in solutions with iOS devices

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: article
ms.date: 01/15/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: annaba

ms.collection: M365-identity-device-management
---
# Azure Active Directory certificate-based authentication on iOS

iOS devices can use certificate-based authentication (CBA) to authenticate to Azure Active Directory using a client certificate on their device when connecting to:

* Office mobile applications such as Microsoft Outlook and Microsoft Word
* Exchange ActiveSync (EAS) clients

Configuring this feature eliminates the need to enter a username and password combination into certain mail and Microsoft Office applications on your mobile device.

This topic provides you with the requirements and the supported scenarios for configuring CBA on an iOS(Android) device for users of tenants in Office 365 Enterprise, Business, Education, US Government, China, and Germany plans.

This feature is available in preview in Office 365 US Government Defense and Federal plans.

## Microsoft mobile applications support

| Apps | Support |
| --- | --- |
| Azure Information Protection app |![Check mark signifying support for this application][1] |
| Intune Company Portal |![Check mark signifying support for this application][1] |
| Microsoft Teams |![Check mark signifying support for this application][1] |
| OneNote |![Check mark signifying support for this application][1] |
| OneDrive |![Check mark signifying support for this application][1] |
| Outlook |![Check mark signifying support for this application][1] |
| Power BI |![Check mark signifying support for this application][1] |
| Skype for Business |![Check mark signifying support for this application][1] |
| Word / Excel / PowerPoint |![Check mark signifying support for this application][1] |
| Yammer |![Check mark signifying support for this application][1] |

## Requirements

The device OS version must be iOS 9 and above

A federation server must be configured.

Microsoft Authenticator is required for Office applications on iOS.

For Azure Active Directory to revoke a client certificate, the ADFS token must have the following claims:

* `http://schemas.microsoft.com/ws/2008/06/identity/claims/<serialnumber>`
  (The serial number of the client certificate)
* `http://schemas.microsoft.com/2012/12/certificatecontext/field/<issuer>`
  (The string for the issuer of the client certificate)

Azure Active Directory adds these claims to the refresh token if they are available in the ADFS token (or any other SAML token). When the refresh token needs to be validated, this information is used to check the revocation.

As a best practice, you should update your organization's ADFS error pages with the following information:

* The requirement for installing the Microsoft Authenticator on iOS
* Instructions on how to get a user certificate.

For more information, see [Customizing the AD FS Sign-in Pages](https://technet.microsoft.com/library/dn280950.aspx).

Some Office apps (with modern authentication enabled) send ‘*prompt=login*’ to Azure AD in their request. By default, Azure AD translates ‘*prompt=login*’ in the request to ADFS as ‘*wauth=usernamepassworduri*’ (asks ADFS to do U/P Auth) and ‘*wfresh=0*’ (asks ADFS to ignore SSO state and do a fresh authentication). If you want to enable certificate-based authentication for these apps, you need to modify the default Azure AD behavior. Just set the ‘*PromptLoginBehavior*’ in your federated domain settings to ‘*Disabled*‘.
You can use the [MSOLDomainFederationSettings](/powershell/module/msonline/set-msoldomainfederationsettings?view=azureadps-1.0) cmdlet to perform this task:

`Set-MSOLDomainFederationSettings -domainname <domain> -PromptLoginBehavior Disabled`

## Exchange ActiveSync clients support

On iOS 9 or later, the native iOS mail client is supported. For all other Exchange ActiveSync applications, to determine if this feature is supported, contact your application developer.

## Next steps

If you want to configure certificate-based authentication in your environment, see [Get started with certificate-based authentication on Android](../authentication/active-directory-certificate-based-authentication-get-started.md) for instructions.

<!--Image references-->
[1]: ./media/active-directory-certificate-based-authentication-ios/ic195031.png
