---
title: Self-service or viral signup in Azure Active Directory | Microsoft Docs
description: Use self-service signup in an Azure Active Directory (Azure AD) tenant
services: active-directory
documentationcenter: ''
author: curtand
manager: femila
editor: ''

ms.assetid: b9f01876-29d1-4ab8-8b74-04d43d532f4b
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/03/2017
ms.author: curtand
ms.reviewer: elkuzmen
ms.custom: it-pro

---
# What is self-service signup for Azure Active Directory?
This article explains self-service signup and how to support it in Azure Active Directory (Azure AD). If you want to take over a domain name from an unmanaged Azure AD tenant, see [Take over an unmanaged directory as administrator](domains-admin-takeover.md).

## Why use self-service signup?
* Get customers to services they want faster
* Create email-based offers for a service
* Create email-based signup flows that quickly allow users to create identities using their easy-to-remember work email aliases
* A self-service-created Azure AD directory can be turned into a managed directory that can be used for other services

## Terms and definitions
* **Self-service signup**: This is the method by which a user signs up for a cloud service and has an identity automatically created for them in Azure AD based on their email domain.
* **Unmanaged Azure AD directory**: This is the directory where that identity is created. An unmanaged directory is a directory that has no global administrator.
* **Email-verified user**: This is a type of user account in Azure AD. A user who has an identity created automatically after signing up for a self-service offer is known as an email-verified user. An email-verified user is a regular member of a directory tagged with creationmethod=EmailVerified.

## How do I control self-service settings?
Admins have two self-service controls today. They can control whether:

* Users can join the directory via email.
* Users can license themselves for applications and services.

### How can I control these capabilities?
An admin can configure these capabilities using the following Azure AD cmdlet Set-MsolCompanySettings parameters:

* **AllowEmailVerifiedUsers** controls whether a user can create or join an unmanaged directory. If you set that parameter to $false, no email-verified users can join the directory.
* **AllowAdHocSubscriptions** controls the ability for users to perform self-service signup. If you set that parameter to $false, no users can perform self-service signup.

### How do the controls work together?
These two parameters can be used in conjunction to define more precise control over self-service signup. For example, the following command will allow users to perform self-service signup, but only if those users already have an account in Azure AD (in other words, users who would need an email-verified account to be created first cannot perform self-service signup):

````
    Set-MsolCompanySettings -AllowEmailVerifiedUsers $false -AllowAdHocSubscriptions $true
````
The following flowchart explains the different combinations for these parameters and the resulting conditions for the directory and self-service signup.

![][1]

For more information and examples of how to use these parameters, see [Set-MsolCompanySettings](/powershell/module/msonline/set-msolcompanysettings?view=azureadps-1.0).

## Next steps
* [Add a custom domain name to Azure AD](add-custom-domain.md)
* [How to install and configure Azure PowerShell](/powershell/azure/overview)
* [Azure PowerShell](/powershell/azure/overview)
* [Azure Cmdlet Reference](/powershell/azure/get-started-azureps)
* [Set-MsolCompanySettings](/powershell/module/msonline/set-msolcompanysettings?view=azureadps-1.0)

<!--Image references-->
[1]: ./media/active-directory-self-service-signup/SelfServiceSignUpControls.png
