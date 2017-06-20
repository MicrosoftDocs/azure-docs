---
title: 'Azure AD SSPR data requirements | Microsoft Docs'
description: Data requirements for Azure AD self-service password reset and how to satisfy them
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/26/2017
ms.author: joflore

---
# Deploy password reset without requiring end-user registration

Deploying Self-Service Password Reset (SSPR) requires authentication data to be present. Some organizations have their users enter their authentication data themselves, but many organizations prefer to synchronize with existing data in Active Directory. If you have properly formatted data in your on-premises directory, and configure [Azure AD Connect using express settings](/connect/active-directory-aadconnect-get-started-express.md), that data is made available to Azure AD and SSPR with no user interaction required.

Any phone numbers must be in the format +CountryCode PhoneNumber Example: +1 4255551234 to work properly.

> [!NOTE]
> Password reset does not support phone extensions. Even in the +1 4255551234X12345 format, extensions are removed before the call is placed.

## Fields populated

If you use the default settings in Azure AD Connect the following mappings are made.

| On-premises AD | Azure AD | Azure AD Authentication contact info |
| --- | --- | --- |
| telephoneNumber | Office phone | Alternate phone |
| mobile | Mobile phone | Phone |


## Security questions and answers

Security questions and answers are stored securely in your Azure AD tenant and are only accessible to users via the [SSPR registration portal](https://aka.ms/ssprsetup). Administrators can't see or modify the contents of another users questions and answers.

### What happens when a user registers

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

## Next steps

The following links provide additional information regarding password reset using Azure AD

* [**Quick Start**](active-directory-passwords-getting-started.md) - Get up and running with Azure AD self service password management 
* [**Licensing**](active-directory-passwords-licensing.md) - Configure your Azure AD Licensing
* [**Rollout**](active-directory-passwords-best-practices.md) - Plan and deploy SSPR to your users using the guidance found here
* [**Customize**](active-directory-passwords-customize.md) - Customize the look and feel of the SSPR experience for your company.
* [**Policy**](active-directory-passwords-policy.md) - Understand and set Azure AD password policies
* [**Reporting**](active-directory-passwords-reporting.md) - Discover if, when, and where your users are accessing SSPR functionality
* [**Technical Deep Dive**](active-directory-passwords-how-it-works.md) - Go behind the curtain to understand how it works
* [**Frequently Asked Questions**](active-directory-passwords-faq.md) - How? Why? What? Where? Who? When? - Answers to questions you always wanted to ask
* [**Troubleshoot**](active-directory-passwords-troubleshoot.md) - Learn how to resolve common issues that we see with SSPR
