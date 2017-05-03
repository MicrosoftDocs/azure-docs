---
title: Azure Active Directory certificate-based authentication on Android  | Microsoft Docs
description: Learn about the supported scenarios and the requirements for configuring certificate-based authentication in solutions with Android devices
services: active-directory
author: MarkusVi
documentationcenter: na
manager: femila

ms.assetid: c6ad7640-8172-4541-9255-770f39ecce0e
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/12/2017
ms.author: markvi

---
# Azure Active Directory certificate-based authentication on Android


Certificate-based authentication (CBA) enables you to be authenticated by Azure Active Directory with a client certificate on a Windows, Android or iOS device when connecting your Exchange online account to: 

* Office mobile applications such as Microsoft Outlook and Microsoft Word   
* Exchange ActiveSync (EAS) clients 

Configuring this feature eliminates the need to enter a username and password combination into certain mail and Microsoft Office applications on your mobile device. 

This topic provides you with the requirements and the supported scenarios for configuring CBA on an Android device for users of tenants in Office 365 Enterprise, Business, Education, and US Government plans. 

This feature is available in preview in Office 365 US Government Defense and Federal plans.


## Office mobile applications support
| Apps | Support |
| --- | --- |
| Word / Excel / PowerPoint |![Check][1] |
| OneNote |![Check][1] |
| OneDrive |![Check][1] |
| Outlook |![Check][1] |
| Yammer |![Check][1] |
| Skype for Business |![Check][1] |
| Azure Information Protection app |![Check][1] |


### Implementation requirements

The device OS version must be Android 5.0 (Lollipop) and above. 

A federation server must be configured.  

For Azure Active Directory to revoke a client certificate, the ADFS token must have the following claims:  

* `http://schemas.microsoft.com/ws/2008/06/identity/claims/<serialnumber>`  
  (The serial number of the client certificate) 
* `http://schemas.microsoft.com/2012/12/certificatecontext/field/<issuer>`  
  (The string for the issuer of the client certificate) 

Azure Active Directory adds these claims to the refresh token if they are available in the ADFS token (or any other SAML token). When the refresh token needs to be validated, this information is used to check the revocation. 

As a best practice, you should update the ADFS error pages with instructions on how to get a user certificate.  
For more details, see [Customizing the AD FS Sign-in Pages](https://technet.microsoft.com/library/dn280950.aspx).  

Some Office apps (with modern authentication enabled) send ‘*prompt=login*’ to Azure AD in their request. By default, Azure AD translates this in the request to ADFS to ‘*wauth=usernamepassworduri*’ (asks ADFS to do U/P auth) and ‘*wfresh=0*’ (asks ADFS to ignore SSO state and do a fresh authentication). If you want to enable certificate-based authentication for these apps, you need to modify the default Azure AD behavior. Just set the ‘*PromptLoginBehavior*’ in your federated domain settings to ‘*Disabled*‘. 
You can use the [MSOLDomainFederationSettings](/powershell/module/msonline/set-msoldomainfederationsettings?view=azureadps-1.0) cmdlet to perform this task:

`Set-MSOLDomainFederationSettings -domainname <domain> -PromptLoginBehavior Disabled`



## Exchange ActiveSync clients support
Certain Exchange ActiveSync applications on Android 5.0 (Lollipop) or later are supported. To determine if your email application does support this feature, please contact your application developer. 


## Next steps

If you want to configure certificate-based authentication in your environment, see [Get started with certificate-based authentication on Android](active-directory-certificate-based-authentication-get-started.md) for instructions.

<!--Image references-->
[1]: ./media/active-directory-certificate-based-authentication-android/ic195031.png
