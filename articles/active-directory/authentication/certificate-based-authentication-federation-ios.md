---
title: Certificate-based authentication with federation on iOS
description: Learn about the supported scenarios and the requirements for configuring certificate-based authentication for Microsoft Entra ID in solutions with iOS devices

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.custom: has-azure-ad-ps-ref
ms.topic: conceptual
ms.date: 09/30/2022

ms.author: justinha
author: justinha
manager: amycolannino

ms.collection: M365-identity-device-management
---
# Microsoft Entra certificate-based authentication with federation on iOS

To improve security, iOS devices can use certificate-based authentication (CBA) to authenticate to Microsoft Entra ID using a client certificate on their device when connecting to the following applications or services:

* Office mobile applications such as Microsoft Outlook and Microsoft Word
* Exchange ActiveSync (EAS) clients

Using certificates eliminates the need to enter a username and password combination into certain mail and Microsoft Office applications on your mobile device.


## Microsoft mobile applications support

| Apps | Support |
| --- | --- |
| Azure Information Protection app |![Check mark signifying support for this application][1] |
| Company Portal |![Check mark signifying support for this application][1] |
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
* An identity preference must be created in the macOS Keychain that includes the authentication URL of the AD FS server. For more information, see [Create an identity preference in Keychain Access on Mac](https://support.apple.com/guide/keychain-access/create-an-identity-preference-kyca6343b6c9/mac).

The following Active Directory Federation Services (AD FS) requirements and considerations apply:

* The AD FS server must be enabled for certificate authentication and use federated authentication.
* The certificate needs to have to use Enhanced Key Usage (EKU) and contain the UPN of the user in the *Subject Alternative Name (NT Principal Name)*.

## Configure AD FS

For Microsoft Entra ID to revoke a client certificate, the AD FS token must have the following claims. Microsoft Entra ID adds these claims to the refresh token if they're available in the AD FS token (or any other SAML token). When the refresh token needs to be validated, this information is used to check the revocation:

* `http://schemas.microsoft.com/ws/2008/06/identity/claims/<serialnumber>` - add the serial number of your client certificate
* `http://schemas.microsoft.com/2012/12/certificatecontext/field/<issuer>` - add the string for the issuer of your client certificate

As a best practice, you also should update your organization's AD FS error pages with the following information:

* The requirement for installing the Microsoft Authenticator on iOS.
* Instructions on how to get a user certificate.

For more information, see [Customizing the AD FS sign in page](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn280950(v=ws.11)).

## Use modern authentication with Office apps

Some Office apps with modern authentication enabled send `prompt=login` to Microsoft Entra ID in their request. By default, Microsoft Entra ID translates `prompt=login` in the request to AD FS as `wauth=usernamepassworduri` (asks AD FS to do U/P Auth) and `wfresh=0` (asks AD FS to ignore SSO state and do a fresh authentication). If you want to enable certificate-based authentication for these apps, modify the default Microsoft Entra behavior.

To update the default behavior, set the '*PromptLoginBehavior*' in your federated domain settings to *Disabled*. You can use the [MSOLDomainFederationSettings](/powershell/module/msonline/set-msoldomainfederationsettings) cmdlet to perform this task, as shown in the following example:

```powershell
Set-MSOLDomainFederationSettings -domainname <domain> -PromptLoginBehavior Disabled
```

## Support for Exchange ActiveSync clients

On iOS 9 or later, the native iOS mail client is supported. To determine if this feature is supported for all other Exchange ActiveSync applications, contact your application developer.

## Next steps

To configure certificate-based authentication in your environment, see [Get started with certificate-based authentication](./certificate-based-authentication-federation-get-started.md) for instructions.

<!--Image references-->
[1]: ./media/active-directory-certificate-based-authentication-ios/ic195031.png
