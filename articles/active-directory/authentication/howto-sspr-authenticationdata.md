---
title: Azure AD SSPR data requirements - Azure Active Directory
description: Data requirements for Azure AD self-service password reset and how to satisfy them

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 07/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahenry

ms.collection: M365-identity-device-management
---
# Deploy password reset without requiring end-user registration

To deploy Azure Active Directory (Azure AD) self-service password reset (SSPR), authentication data needs to be present. Some organizations have their users enter their authentication data themselves. But many organizations prefer to synchronize with data that already exists in Active Directory. The synced data is made available to Azure AD and SSPR without requiring user interaction if you:

* Properly format the data in your on-premises directory.
* Configure [Azure AD Connect by using the express settings](../hybrid/how-to-connect-install-express.md).

To work properly, phone numbers must be in the format *+CountryCode PhoneNumber*, for example, +1 4255551234.

> [!NOTE]
> There needs to be a space between the country code and the phone number.
>
> Password reset does not support phone extensions. Even in the +1 4255551234X12345 format, extensions are removed before the call is placed.

## Fields populated

If you use the default settings in Azure AD Connect, the following mappings are made:

| On-premises Active Directory | Azure AD |
| --- | --- |
| telephoneNumber | Office phone |
| mobile | Mobile phone |

Once a user verifies their mobile phone number, the Phone field under Authentication contact info in Azure AD will also be populated with that number.

## Authentication contact info

A Global Administrator can manually set the Authentication contact info for a user as displayed in the following screenshot.

![Authentication contact info on a user in Azure AD][Contact]

If the Phone field is populated and Mobile phone is enabled in the SSPR policy, the user will see that number on the password reset registration page and during the password reset workflow.

The Alternate phone field is not used for password reset.

If the Email field is populated and Email is enabled in the SSPR policy, the user will see that email on the password reset registration page and during the password reset workflow.

If the Alternate email field is populated and Email is enabled in the SSPR policy, the user will **not** see that email on the password reset registration page, but they will see it during the password reset workflow.

## Security questions and answers

The security questions and answers are stored securely in your Azure AD tenant and are only accessible to users via the [SSPR registration portal](https://aka.ms/ssprsetup). Administrators can't see, set, or modify the contents of another users' questions and answers.

## What happens when a user registers

When a user registers, the registration page sets the following fields:

* **Authentication Phone**
* **Authentication Email**
* **Security Questions and Answers**

If you have provided a value for **Mobile phone** or **Alternate email**, users can immediately use those values to reset their passwords, even if they haven't registered for the service. In addition, users see those values when they register for the first time, and they can modify them if they want to. After they register successfully, these values will be persisted in the **Authentication Phone** and **Authentication Email** fields, respectively.

## Set and read the authentication data through PowerShell

The following fields can be set through PowerShell:

* **Alternate email**
* **Mobile phone**
* **Office phone**: Can only be set if you're not synchronizing with an on-premises directory

### Use PowerShell version 1

To get started, you need to [download and install the Azure AD PowerShell module](https://msdn.microsoft.com/library/azure/jj151815.aspx#bkmk_installmodule). After you have it installed, you can use the steps that follow to configure each field.

#### Set the authentication data with PowerShell version 1

```PowerShell
Connect-MsolService

Set-MsolUser -UserPrincipalName user@domain.com -AlternateEmailAddresses @("email@domain.com")
Set-MsolUser -UserPrincipalName user@domain.com -MobilePhone "+1 1234567890"
Set-MsolUser -UserPrincipalName user@domain.com -PhoneNumber "+1 1234567890"

Set-MsolUser -UserPrincipalName user@domain.com -AlternateEmailAddresses @("email@domain.com") -MobilePhone "+1 1234567890" -PhoneNumber "+1 1234567890"
```

#### Read the authentication data with PowerShell version 1

```PowerShell
Connect-MsolService

Get-MsolUser -UserPrincipalName user@domain.com | select AlternateEmailAddresses
Get-MsolUser -UserPrincipalName user@domain.com | select MobilePhone
Get-MsolUser -UserPrincipalName user@domain.com | select PhoneNumber

Get-MsolUser | select DisplayName,UserPrincipalName,AlternateEmailAddresses,MobilePhone,PhoneNumber | Format-Table
```

#### Read the Authentication Phone and Authentication Email options

To read the **Authentication Phone** and **Authentication Email** when you use PowerShell version 1, use the following commands:

```PowerShell
Connect-MsolService
Get-MsolUser -UserPrincipalName user@domain.com | select -Expand StrongAuthenticationUserDetails | select PhoneNumber
Get-MsolUser -UserPrincipalName user@domain.com | select -Expand StrongAuthenticationUserDetails | select Email
```

### Use PowerShell version 2

To get started, you need to [download and install the Azure AD version 2 PowerShell module](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0). After you have it installed, you can use the steps that follow to configure each field.

To quickly install from recent versions of PowerShell that support Install-Module, run the following commands. (The first line checks to see if the module is already installed.)

```PowerShell
Get-Module AzureADPreview
Install-Module AzureADPreview
Connect-AzureAD
```

#### Set the authentication data with PowerShell version 2

```PowerShell
Connect-AzureAD

Set-AzureADUser -ObjectId user@domain.com -OtherMails @("email@domain.com")
Set-AzureADUser -ObjectId user@domain.com -Mobile "+1 2345678901"
Set-AzureADUser -ObjectId user@domain.com -TelephoneNumber "+1 1234567890"

Set-AzureADUser -ObjectId user@domain.com -OtherMails @("emails@domain.com") -Mobile "+1 1234567890" -TelephoneNumber "+1 1234567890"
```

#### Read the authentication data with PowerShell version 2

```PowerShell
Connect-AzureAD

Get-AzureADUser -ObjectID user@domain.com | select otherMails
Get-AzureADUser -ObjectID user@domain.com | select Mobile
Get-AzureADUser -ObjectID user@domain.com | select TelephoneNumber

Get-AzureADUser | select DisplayName,UserPrincipalName,otherMails,Mobile,TelephoneNumber | Format-Table
```

## Next steps

* [How do I complete a successful rollout of SSPR?](howto-sspr-deployment.md)
* [Reset or change your password](../user-help/active-directory-passwords-update-your-own-password.md)
* [Register for self-service password reset](../user-help/active-directory-passwords-reset-register.md)
* [Do you have a licensing question?](concept-sspr-licensing.md)
* [What authentication methods are available to users?](concept-sspr-howitworks.md#authentication-methods)
* [What are the policy options with SSPR?](concept-sspr-policy.md)
* [What is password writeback and why do I care about it?](howto-sspr-writeback.md)
* [How do I report on activity in SSPR?](howto-sspr-reporting.md)
* [What are all of the options in SSPR and what do they mean?](concept-sspr-howitworks.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)

[Contact]: ./media/howto-sspr-authenticationdata/user-authentication-contact-info.png "Global administrators can modify a user's authentication contact info"
