---
title: Certificate-based authentication on iOS - Azure Active Directory
description: Learn about the supported scenarios and the requirements for configuring certificate-based authentication for Azure Active Directory in solutions with iOS devices

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 04/17/2020

ms.author: iainfou
author: iainfoulds
manager: daveba

ms.collection: M365-identity-device-management
---
# Azure Active Directory certificate-based authentication on iOS

To improve security, iOS devices can use certificate-based authentication (CBA) to authenticate to Azure Active Directory (Azure AD) using a client certificate on their device when connecting to the following applications or services:

* Office mobile applications such as Microsoft Outlook and Microsoft Word
* Exchange ActiveSync (EAS) clients

Using certificates eliminates the need to enter a username and password combination into certain mail and Microsoft Office applications on your mobile device.

This article details the requirements and the supported scenarios for configuring CBA on an iOS device. CBA for iOS is available across Azure public clouds, Microsoft Government Cloud, Microsoft Cloud Germany, and Microsoft Azure China 21Vianet.

## Microsoft mobile applications support

| Apps | Support |
| --- | --- |
| Azure Information Protection app |![Check mark signifying support for this application][1] |
| Intune Company Portal |![Check mark signifying support for this application][1] |
| Microsoft Teams |![Check mark signifying support for this application][1] |
| Office (mobile) |![Check mark signifying support for this application][1] |
| OneNote |![Check mark signifying support for this application][1] |
| OneDrive |![Check mark signifying support for this application][1] |
| Outlook |![Check mark signifying support for this application][1] |
| Power BI |![Check mark signifying support for this application][1] |
| Skype for Business |![Check mark signifying support for this application][1] |
| Word / Excel / PowerPoint |![Check mark signifying support for this application][1] |
| Yammer |![Check mark signifying support for this application][1] |

## Requirements

To use CBA with iOS, the following requirements and considerations apply:

* The device OS version must be iOS 9 or above.
* Microsoft Authenticator is required for Office applications on iOS.
* An identity preference must be created in the macOS Keychain that include the authentication URL of the ADFS server. For more information, see [Create an identity preference in Keychain Access on Mac](https://support.apple.com/guide/keychain-access/create-an-identity-preference-kyca6343b6c9/mac).

The following Active Directory Federation Services (ADFS) requirements and considerations apply:

* The ADFS server must be enabled for certificate authentication and use federated authentication.
* The certificate needs to have to use Enhanced Key Usage (EKU) and contain the UPN of the user in the *Subject Alternative Name (NT Principal Name)*.

## Configure ADFS

For Azure AD to revoke a client certificate, the ADFS token must have the following claims. Azure AD adds these claims to the refresh token if they're available in the ADFS token (or any other SAML token). When the refresh token needs to be validated, this information is used to check the revocation:

* `http://schemas.microsoft.com/ws/2008/06/identity/claims/<serialnumber>` - add the serial number of your client certificate
* `http://schemas.microsoft.com/2012/12/certificatecontext/field/<issuer>` - add the string for the issuer of your client certificate

As a best practice, you also should update your organization's ADFS error pages with the following information:

* The requirement for installing the Microsoft Authenticator on iOS.
* Instructions on how to get a user certificate.

For more information, see [Customizing the AD FS sign in page](https://technet.microsoft.com/library/dn280950.aspx).

## Use modern authentication with Office apps

Some Office apps with modern authentication enabled send `prompt=login` to Azure AD in their request. By default, Azure AD translates `prompt=login` in the request to ADFS as `wauth=usernamepassworduri` (asks ADFS to do U/P Auth) and `wfresh=0` (asks ADFS to ignore SSO state and do a fresh authentication). If you want to enable certificate-based authentication for these apps, modify the default Azure AD behavior.

To update the default behavior, set the '*PromptLoginBehavior*' in your federated domain settings to *Disabled*. You can use the [MSOLDomainFederationSettings](/powershell/module/msonline/set-msoldomainfederationsettings?view=azureadps-1.0) cmdlet to perform this task, as shown in the following example:

```powershell
Set-MSOLDomainFederationSettings -domainname <domain> -PromptLoginBehavior Disabled
```

## Support for Exchange ActiveSync clients

On iOS 9 or later, the native iOS mail client is supported. To determine if this feature is supported for all other Exchange ActiveSync applications, contact your application developer.

## Next steps

To configure certificate-based authentication in your environment, see [Get started with certificate-based authentication](active-directory-certificate-based-authentication-get-started.md) for instructions.

<!--Image references-->
[1]: ./media/active-directory-certificate-based-authentication-ios/ic195031.png
