---
title: Pre-populate contact information for self-service password reset - Azure Active Directory
description: Learn how to pre-populate contact information for users of Azure Active Directory self-service password reset (SSPR) so they can use the feature without completing a registration process.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 07/17/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: rhicock

ms.collection: M365-identity-device-management 
ms.custom: devx-track-azurepowershell
---
# Pre-populate user authentication contact information for Azure Active Directory self-service password reset (SSPR)

To use Azure Active Directory (Azure AD) self-service password reset (SSPR), authentication contact information for a user must be present. Some organizations have users register their authentication data themselves. Other organizations prefer to synchronize from authentication data that already exists in Active Directory Domain Services (AD DS). This synchronized data is made available to Azure AD and SSPR without requiring user interaction. When users need to change or reset their password, they can do so even if they haven't previously registered their contact information.

You can pre-populate authentication contact information if you meet the following requirements:

* You have properly formatted the data in your on-premises directory.
* You have configured [Azure AD Connect](../hybrid/how-to-connect-install-express.md) for your Azure AD tenant.

Phone numbers must be in the format *+CountryCode PhoneNumber*, such  as *+1 4251234567*.

> [!NOTE]
> There must be a space between the country code and the phone number.
>
> Password reset doesn't support phone extensions. Even in the *+1 4251234567X12345* format, extensions are removed before the call is placed.

## Fields populated

If you use the default settings in Azure AD Connect, the following mappings are made to populate authentication contact information for SSPR:

| On-premises Active Directory | Azure AD     |
|------------------------------|--------------|
| telephoneNumber              | Office phone |
| mobile                       | Mobile phone |

After a user verifies their mobile phone number, the *Phone* field under **Authentication contact info** in Azure AD is also populated with that number.

## Authentication contact info

On the **Authentication methods** page for an Azure AD user in the Azure portal, a Global Administrator can manually set the authentication contact information, as shown in the following example screenshot:

![Authentication contact info on a user in Azure AD][Contact]

The following considerations apply for this authentication contact info:

* If the *Phone* field is populated and *Mobile phone* is enabled in the SSPR policy, the user sees that number on the password reset registration page and during the password reset workflow.
* The *Alternate phone* field isn't used for password reset.
* If the *Email* field is populated and *Email* is enabled in the SSPR policy, the user sees that email on the password reset registration page and during the password reset workflow.
* If the *Alternate email* field is populated and *Email* is enabled in the SSPR policy, the user won't see that email on the password reset registration page, but they see it during the password reset workflow.

## Security questions and answers

The security questions and answers are stored securely in your Azure AD tenant and are only accessible to users via the [SSPR registration portal](https://aka.ms/ssprsetup). Administrators can't see, set, or modify the contents of another users' questions and answers.

## What happens when a user registers

When a user registers, the registration page sets the following fields:

* **Authentication Phone**
* **Authentication Email**
* **Security Questions and Answers**

If you provided a value for *Mobile phone* or *Alternate email*, users can immediately use those values to reset their passwords, even if they haven't registered for the service.

Users also see those values when they register for the first time, and can modify them if they want to. After they successfully register, these values are persisted in the *Authentication Phone* and *Authentication Email* fields, respectively.

## Set and read the authentication data through PowerShell

The following fields can be set through PowerShell:

* *Alternate email*
* *Mobile phone*
* *Office phone*
    * Can only be set if you're not synchronizing with an on-premises directory.

> [!IMPORTANT]
> There's a known lack of parity in command features between PowerShell v1 and PowerShell v2. The [Microsoft Graph REST API (beta) for authentication methods](/graph/api/resources/authenticationmethods-overview) is the current engineering focus to provide modern interaction.

### Use PowerShell version 1

To get started, [download and install the Azure AD PowerShell module](/previous-versions/azure/jj151815(v=azure.100)#bkmk_installmodule). After it's installed, use the following steps to configure each field.

#### Set the authentication data with PowerShell version 1

```PowerShell
Connect-MsolService

Set-MsolUser -UserPrincipalName user@domain.com -AlternateEmailAddresses @("email@domain.com")
Set-MsolUser -UserPrincipalName user@domain.com -MobilePhone "+1 4251234567"
Set-MsolUser -UserPrincipalName user@domain.com -PhoneNumber "+1 4252345678"

Set-MsolUser -UserPrincipalName user@domain.com -AlternateEmailAddresses @("email@domain.com") -MobilePhone "+1 4251234567" -PhoneNumber "+1 4252345678"
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

To get started, [download and install the Azure AD version 2 PowerShell module](/powershell/module/azuread/?view=azureadps-2.0).

To quickly install from recent versions of PowerShell that support `Install-Module`, run the following commands. The first line checks to see if the module is already installed:

```PowerShell
Get-Module AzureADPreview
Install-Module AzureADPreview
Connect-AzureAD
```

After the module is installed, use the following steps to configure each field.

#### Set the authentication data with PowerShell version 2

```PowerShell
Connect-AzureAD

Set-AzureADUser -ObjectId user@domain.com -OtherMails @("email@domain.com")
Set-AzureADUser -ObjectId user@domain.com -Mobile "+1 4251234567"
Set-AzureADUser -ObjectId user@domain.com -TelephoneNumber "+1 4252345678"

Set-AzureADUser -ObjectId user@domain.com -OtherMails @("emails@domain.com") -Mobile "+1 4251234567" -TelephoneNumber "+1 4252345678"
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

Once authentication contact information is pre-populated for users, complete the following tutorial to enable self-service password reset:

> [!div class="nextstepaction"]
> [Enable Azure AD self-service password reset](tutorial-enable-sspr.md)

[Contact]: ./media/howto-sspr-authenticationdata/user-authentication-contact-info.png "Global administrators can modify a user's authentication contact info"
