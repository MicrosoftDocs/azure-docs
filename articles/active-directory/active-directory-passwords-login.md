---
title: 'Azure AD SSPR from the Windows 10 login screen | Microsoft Docs'
description: Configure Windows 10 login screen Azure AD password reset and I forgot my PIN
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
ms.reviewer: sahenry

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 11/06/2017
ms.author: joflore
ms.custom: it-pro

---
# Azure AD configure password and PIN reset from the login screen

> [!IMPORTANT]
> **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).

To enable users to reset their Azure AD password from the Windows 10 login screen the following requirements need to be met:

* Windows 10 1709 or newer
* Azure AD Domain joined
* Azure AD self-service password reset must be enabled
* A Global Administrator must configure the MDM policy






[Authentication/AllowAadPasswordReset](https://docs.microsoft.com/windows/client-management/mdm/policy-csp-authentication#authentication-allowaadpasswordreset)
Added in Windows 10, version 1709. Specifies whether password reset is enabled for Azure Active Directory accounts. This policy allows the Azure AD tenant administrators to enable self service password reset feature on the windows logon screen. 


The following list shows the supported values:

0 (default) – Not allowed.
1 – Allowed.


https://docs.microsoft.com/en-us/intune/device-windows-pin-reset
[Policies/EnablePinRecovery](https://docs.microsoft.com/windows/client-management/mdm/passportforwork-csp)
Added in Windows 10, version 1703. Boolean value that enables a user to change their PIN by using the Windows Hello for Business PIN recovery service. This cloud service encrypts a recovery secret, which is stored locally on the client, and can be decrypted only by the cloud service.


Default value is false. If you enable this policy setting, the PIN recovery secret will be stored on the device and the user can change their PIN if needed.


If you disable or do not configure this policy setting, the PIN recovery secret will not be created or stored. If the user's PIN is forgotten, the only way to get a new PIN is by deleting the existing PIN and creating a new one, which will require the user to re-register with any services the old PIN provided access to.


Supported operations are Add, Get, Delete, and Replace.

Respond on publish to this with link to doc.
https://feedback.azure.com/forums/169401-azure-active-directory/suggestions/8737576-enable-self-service-password-reset-from-windows-10

### Learn more
The following links provide additional information regarding password reset using Azure AD

* [How do I complete a successful rollout of SSPR?](active-directory-passwords-best-practices.md)
* [Reset or change your password](active-directory-passwords-update-your-own-password.md).
* [Register for self-service password reset](active-directory-passwords-reset-register.md).
* [Do you have a Licensing question?](active-directory-passwords-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](active-directory-passwords-data.md)
* [What authentication methods are available to users?](active-directory-passwords-how-it-works.md#authentication-methods)
* [What are the policy options with SSPR?](active-directory-passwords-policy.md)
* [What is password writeback and why do I care about it?](active-directory-passwords-writeback.md)
* [How do I report on activity in SSPR?](active-directory-passwords-reporting.md)
* [What are all of the options in SSPR and what do they mean?](active-directory-passwords-how-it-works.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)

## Next steps

