---
title: 'Azure AD password management related data | Microsoft Docs'
description: 
services: active-directory
keywords: Active directory password management, password management, Azure AD self service password reset
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/26/2017
ms.author: joflore

---
# Data used by Azure AD Self-Service Password Reset

## Deploying password reset without requiring end-user registration

Deploying Self-Service Password Reset (SSPR) requires some data to be present either by users entering it themselves, many organizations prefer to synchronize with existing data in Active Directory. If you currently have properly formatted data in **MobilePhone** and **OfficePhone**, and configure [Azure AD Connect using express settings](/connect/active-directory-aadconnect-get-started-express.md) it is made available to Azure AD and SSPR with no user interaction required.

Any phone numbers must be in the format +CountryCode PhoneNumber Example: +1 4255551234 to work properly.

> [!NOTE]
> Password reset does not support extensions, even in the +1 4255551234X12345 format, they are removed before the call is placed.

## Security questions and answers

Security questions and answers are only accessible via the [SSPR registration portal](https://aka.ms/ssprsetup) administrators can't see or modify the contents of another users questions and answers.

### What happens when a user registers?

When a user registers, the registration page sets the following fields:

* Authentication Phone
* Authentication Email
* Security Questions and Answers

If you have provided a value for **Mobile Phone** or **Alternate Email**, users can immediately use those values to reset their passwords, even if they haven't registered for the service. In addition, users see those values when registering for the first time, and modify them if they wish. After they successfully register, these values will be persisted in the **Authentication Phone** and **Authentication Email** fields, respectively.

## Set and read authentication data using PowerShell

The following fields can be set using PowerShell

* Alternate Email
* Mobile Phone
* Office Phone - Can only be set if not synchronizing with an on-premises directory

### Using PowerShell V1

To get started, you need to [download and install the Azure AD PowerShell module](https://msdn.microsoft.com/library/azure/jj151815.aspx#bkmk_installmodule). Once you have it installed, you can follow the steps that follow to configure each field.

#### Set Authentication Data with PowerShell V1

```
Connect-MsolService

Set-MsolUser -UserPrincipalName user@domain.com -AlternateEmailAddresses @("email@domain.com")
Set-MsolUser -UserPrincipalName user@domain.com -MobilePhone "+1 1234567890"
Set-MsolUser -UserPrincipalName user@domain.com -PhoneNumber "+1 1234567890"

Set-MsolUser -UserPrincipalName user@domain.com -AlternateEmailAddresses @("email@domain.com") -MobilePhone "+1 1234567890" -PhoneNumber "+1 1234567890"
```

#### Read Authentication Data with PowerShellPowerShell V1

```
Connect-MsolService

Get-MsolUser -UserPrincipalName user@domain.com | select AlternateEmailAddresses
Get-MsolUser -UserPrincipalName user@domain.com | select MobilePhone
Get-MsolUser -UserPrincipalName user@domain.com | select PhoneNumber

Get-MsolUser | select DisplayName,UserPrincipalName,AlternateEmailAddresses,MobilePhone,PhoneNumber | Format-Table
```

#### Authentication Phone and Authentication Email can only be read using Powershell V1 using the commands that follow

```
Connect-MsolService
Get-MsolUser -UserPrincipalName user@domain.com | select -Expand StrongAuthenticationUserDetails | select PhoneNumber
Get-MsolUser -UserPrincipalName user@domain.com | select -Expand StrongAuthenticationUserDetails | select Email
```

### Using PowerShell V2

To get started, you need to [download and install the Azure AD V2 PowerShell module](https://github.com/Azure/azure-docs-powershell-azuread/blob/master/Azure%20AD%20Cmdlets/AzureAD/index.md). Once you have it installed, you can follow the steps that follow to configure each field.

To install quickly from recent versions of PowerShell that support Install-Module, run these commands (the first line simply checks to see if it's installed already):

```
Get-Module AzureADPreview
Install-Module AzureADPreview
Connect-AzureAD
```

#### Set Authentication Data with PowerShell V2

```
Connect-AzureAD

Set-AzureADUser -ObjectId user@domain.com -OtherMails @("email@domain.com")
Set-AzureADUser -ObjectId user@domain.com -Mobile "+1 2345678901"
Set-AzureADUser -ObjectId user@domain.com -TelephoneNumber "+1 1234567890"

Set-AzureADUser -ObjectId user@domain.com -OtherMails @("emails@domain.com") -Mobile "+1 1234567890" -TelephoneNumber "+1 1234567890"
```

### Read Authentication Data with PowerShell V2

```
Connect-AzureAD

Get-AzureADUser -ObjectID user@domain.com | select otherMails
Get-AzureADUser -ObjectID user@domain.com | select Mobile
Get-AzureADUser -ObjectID user@domain.com | select TelephoneNumber

Get-AzureADUser | select DisplayName,UserPrincipalName,otherMails,Mobile,TelephoneNumber | Format-Table
```

