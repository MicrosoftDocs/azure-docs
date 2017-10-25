---
title: Take over an unmanaged domain name as administrator in Azure Active Directory | Microsoft Docs
description: An overview self-service signup for Azure Active Directory
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
ms.date: 10/25/2017
ms.author: curtand
ms.reviewer: elkuzmen
ms.custom: it-pro;oldportal

---
When a self-service (or email-verified) user signs up for a cloud service that uses Azure Active Directory (Azure AD), they are added to an unmanaged Azure AD directory based on the email domain. They become guest user of the directory with access to the service that they signed up for, and are tagged with creationmethod=EmailVerified.

For example, let's say a user whose email is Dan@BellowsCollege.com receives sensitive files via email. The files have been protected by Azure Rights Management (Azure RMS). But Dan's organization, Bellows College, has not signed up for Azure RMS, nor has it deployed Active Directory RMS. In this case, Dan can sign up for a free subscription to RMS for individuals in order to read the protected files.

If Dan is the first user with an email address from BellowsCollege.com to sign up for this self-service offering, then an unmanaged directory will be created for BellowsCollege.com in Azure AD. If other users from the BellowsCollege.com domain sign up for this offering or a similar self-service offering, they will also have email-verified user accounts created in the same unmanaged directory in Azure.

    ## Ways to manage an unmanaged directory
To start the process of a DNS takeover, you can merge the directory after proving ownership  as described in [Add a custom domain name to Azure AD](add-custom-domain.md). The next sections explain the admin experience in more detail, but here's a summary:

* When you *merge* an unmanaged Azure directory, you add the DNS domain name of the unmanaged directory to your managed Azure directory and a mapping of users to resources is created so users can continue to access services without interruption. This is also called an external takeover. Scenario: You are adding a new domain to your managed Azure directory and because the unmanaged directory exists for this domain, you can merge it with yours.
* When you *take over* an unmanaged Azure directory, you are added as the global administrator of the unmanaged directory (also called an internal takeover). No users, domains, or services are migrated to any other directory you administer. Scenario: you discover an unmanaged Azure directory, and want to start managing it.

### Merge an unmanaged directory into an existing managed directory
For example, as an admin of a managed directory, you add a domain, and that domain happens to have an unmanaged directory associated with it. Let's say that you you already have a managed directory for Contoso.com, a domain name that is registered to your organization. You discover that users from your organization have performed self-service signup for an offering by using email domain name user@contoso.co.uk, which is another domain name that your organization owns. Those users currently have accounts in an unmanaged directory for contoso.co.uk.

If you don't want to manage two separate directories, merge the unmanaged directory for contoso.co.uk into your existing IT managed directory for contoso.com.

Merging an unmanaged directory follows the same DNS validation process as only taking it over as admin. The difference is users and services are remapped to the existing managed directory.

#### What's the advantage of merging an unmanaged directory?
With an external takeover, a mapping of users-to-resources is created so users can continue to access services without interruption. Many applications, including RMS for individuals, handle the mapping of users-to-resources well, and users can continue to access those services without change. If an application does not handle the mapping of users-to-resources effectively, external takeover may be explicitly blocked to prevent users from a poor experience.

#### Directory merging support by service
Currently the following services support takeover:

* RMS

The following services will soon be supporting merging an unmanaged directory:

* PowerBI

The following do not require additional admin action to migrate user data after an external takeover.

* SharePoint/OneDrive

### Take over an unmanaged directory (no merge)
When you do an internal takeover, the directory gets converted from an unmanaged directory to a managed directory. You need to complete DNS domain name validation, where you create an MX record or a TXT record in the DNS zone. That action:

* Validates that you own the domain
* Makes the directory managed
* Makes you the global admin of the directory

Let's say an IT administrator from Bellows College discovers that users from the school have signed up for self-service offerings. As the registered owner of the DNS name BellowsCollege.com, the IT administrator can validate ownership of the DNS name in Azure and then take over the unmanaged directory. The directory then becomes a managed directory, and the IT administrator is assigned the global administrator role for the BellowsCollege.com directory.

## How to perform a DNS domain name takeover
You have a few options for how to perform a domain validation (and merge or take over an unmanaged domain):

### Azure portal

If you add a new domain name to an Azure AD directory, and a directory already exists for the domain, you are given the option to merge the unmanaged directory. Sign in to the Azure portal using an account that is a global administrator for your existing directory and then proceed as described in [Add a custom domain name to Azure AD](add-custom-domain.md).

### Office 365

You can use the options on the [Manage domains](https://support.office.com/article/Navigate-to-the-Office-365-Manage-domains-page-026af1f2-0e6d-4f2d-9b33-fd147420fac2/) page in Office 365 to work with your domains and DNS records. See [Verify your domain in Office 365](https://support.office.com/article/Verify-your-domain-in-Office-365-6383f56d-3d09-4dcb-9b41-b5f5a5efd611/). 
  > [!IMPORTANT]
  > Please be aware that this will take over and not merge the unmanaged directory. If you want to merge the unmanaged directory, do not use this method.

### Microsoft PowerShell

   The following steps are required to perform a validation using Microsoft PowerShell.

   | Step | Cmdlet to use |
   | --- | --- |
   | Create a credential object |Get-Credential |
   | Connect to Azure AD |Connect-MsolService |
   | Get a list of domains |Get-MsolDomain |
   | Create a challenge |Get-MsolDomainVerificationDns |
   | Create DNS record |Do this on your DNS server |
   | Verify the challenge |Confirm-MsolEmailVerifiedDomain |

For example:

1. Connect to Azure AD using the credentials that were used to respond to the self-service offering:
  ````
        import-module MSOnline
        $msolcred = get-credential
  
        connect-msolservice -credential $msolcred
  ````
2. Get a list of domains:
  
  ````
    Get-MsolDomain
  ````
3. Run the Get-MsolDomainVerificationDns cmdlet to create a challenge:
  ````
    Get-MsolDomainVerificationDns –DomainName *your_domain_name* –Mode DnsTxtRecord
  
    For example:
  
    Get-MsolDomainVerificationDns –DomainName contoso.com –Mode DnsTxtRecord
  ````

4. Copy the value (the challenge) that is returned from this command. For example:
  ````
    MS=32DD01B82C05D27151EA9AE93C5890787F0E65D9
  ````
5. In your public DNS namespace, create a DNS txt record that contains the value that you copied in the previous step. The name for this record is the name of the parent domain, so if you create this resource record by using the DNS role from Windows Server, leave the Record name blank and just paste the value into the Text box.
6. Run the Confirm-MsolDomain cmdlet to verify the challenge:
  
  ````
    Confirm-MsolEmailVerifiedDomain -DomainName *your_domain_name*
  ````
  
  For example:
  
  ````
    Confirm-MsolEmailVerifiedDomain -DomainName contoso.com
  ````

A successful challenge returns you to the prompt without an error.

## How do I control self-service settings?
Admins have two self-service controls today. They can control whether:

* Users can join the directory via email.
* Users can license themselves for applications and services.

### How can I control these capabilities?
An admin can configure these capabilities using these Azure AD cmdlet Set-MsolCompanySettings parameters:

* **AllowEmailVerifiedUsers** controls whether a user can create or join an unmanaged directory. If you set that parameter to $false, no email-verified users can join the directory.
* **AllowAdHocSubscriptions** controls the ability for users to perform self-service signup. If you set that parameter to $false, no users can perform self-service signup.

### How do the controls work together?
These two parameters can be used in conjunction to define more precise control over self-service signup. For example, the following command will allow users to perform self-service signup, but only if those users already have an account in Azure AD (in other words, users who would need an email-verified account to be created cannot perform self-service signup):
````
    Set-MsolCompanySettings -AllowEmailVerifiedUsers $false -AllowAdHocSubscriptions $true
````
The following flowchart explains the different combinations for these parameters and the resulting conditions for the directory and self-service signup.

![][1]

For more information and examples of how to use these parameters, see [Set-MsolCompanySettings](/powershell/module/msonline/set-msolcompanysettings?view=azureadps-1.0).

## See Also
* [Add a custom domain name to Azure AD](add-custom-domain.md)
* [How to install and configure Azure PowerShell](/powershell/azure/overview)
* [Azure PowerShell](/powershell/azure/overview)
* [Azure Cmdlet Reference](/powershell/azure/get-started-azureps)
* [Set-MsolCompanySettings](/powershell/module/msonline/set-msolcompanysettings?view=azureadps-1.0)

<!--Image references-->
[1]: ./media/active-directory-self-service-signup/SelfServiceSignUpControls.png
