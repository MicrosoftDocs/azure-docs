---
title: Android certificate-based authentication with federation
description: Learn about the supported scenarios and the requirements for configuring certificate-based authentication in solutions with Android devices

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.custom: has-azure-ad-ps-ref
ms.topic: how-to
ms.date: 08/14/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: annaba

ms.collection: M365-identity-device-management
---
# Microsoft Entra certificate-based authentication with federation on Android

Android devices can use certificate-based authentication (CBA) to authenticate to Microsoft Entra ID using a client certificate on their device when connecting to:

* Office mobile applications such as Microsoft Outlook and Microsoft Word
* Exchange ActiveSync (EAS) clients

Configuring this feature eliminates the need to enter a username and password combination into certain mail and Microsoft Office applications on your mobile device.


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

### Implementation requirements

The device OS version must be Android 5.0 (Lollipop) and above.

A federation server must be configured.

For Microsoft Entra ID to revoke a client certificate, the AD FS token must have the following claims:

* `http://schemas.microsoft.com/ws/2008/06/identity/claims/<serialnumber>`
  (The serial number of the client certificate)
* `http://schemas.microsoft.com/2012/12/certificatecontext/field/<issuer>`
  (The string for the issuer of the client certificate)

Microsoft Entra ID adds these claims to the refresh token if they're available in the AD FS token (or any other SAML token). When the refresh token needs to be validated, this information is used to check the revocation.

As a best practice, you should update your organization's AD FS error pages with the following information:

* The requirement for installing the Microsoft Authenticator on Android.
* Instructions on how to get a user certificate.

For more information, see [Customizing the AD FS Sign-in Pages](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn280950(v=ws.11)).

Office apps with modern authentication enabled send '*prompt=login*' to Azure AD in their request. By default, Azure AD translates '*prompt=login*' in the request to AD FS as '*wauth=usernamepassworduri*' (asks AD FS to do U/P Auth) and '*wfresh=0*' (asks AD FS to ignore SSO state and do a fresh authentication). If you want to enable certificate-based authentication for these apps, you need to modify the default Azure AD behavior. Set the '*PromptLoginBehavior*' in your federated domain settings to '*Disabled*'.
You can use Set-MgDomainFederationConfiguration to perform this task:

```powershell
Set-MgDomainFederationConfiguration -domainname <domain> -PromptLoginBehavior Disabled
```

## Exchange ActiveSync clients support

Certain Exchange ActiveSync applications on Android 5.0 (Lollipop) or later are supported. To determine if your email application does support this feature, contact your application developer.

## Next steps

If you want to configure certificate-based authentication in your environment, see [Get started with certificate-based authentication on Android](./certificate-based-authentication-federation-get-started.md) for instructions.

<!--Image references-->
[1]: ./media/active-directory-certificate-based-authentication-android/ic195031.png
