---
title: Administrator takeover of an unmanaged directory in Azure Active Directory | Microsoft Docs
description: How to take over a DNS domain name in an unmanaged directory in Azure Active Directory. 
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
ms.date: 10/26/2017
ms.author: curtand
ms.reviewer: elkuzmen
ms.custom: it-pro;oldportal

---
# Take over an unmanaged directory as administrator in Azure Active Directory
This article describes two ways to take over a DNS domain name in an unmanaged directory in Azure Active Directory (Azure AD). When a self-service user signs up for a cloud service that uses Azure Active Directory (Azure AD), they are added to an unmanaged Azure AD directory based on the email domain. They become guest user of the directory with access to the service that they signed up for, tagged with creationmethod=EmailVerified.

## Decide how you want to take over an unmanaged directory
During the process of admin takeover, you can prove ownership as described in [Add a custom domain name to Azure AD](add-custom-domain.md). The next sections explain the admin experience in more detail, but here's a summary:

* When you perform a so-called "external" admin takeover of an unmanaged Azure directory, you add the DNS domain name of the unmanaged directory to your managed Azure directory. When you add the domain name, a mapping of users to resources is created in your managed Azure directory so that users can continue to access services without interruption.

* When you perform a so-called "internal" admin takeover of an unmanaged Azure directory, you are added as the global administrator of the unmanaged directory. No users, domains, or service plans are migrated to any other directory you administer. 

### External admin takeover
For example, as an admin of a managed directory, you add a domain, and that domain happens to have an unmanaged directory associated with it. Let's say that you you already have a managed directory for Contoso.com, a domain name that is registered to your organization. You discover that users from your organization have performed self-service signup for an offering by using email domain name user@contoso.co.uk, which is another domain name that your organization owns. Those users currently have accounts in an unmanaged directory for contoso.co.uk.

If you don't want to manage two separate directories, merge the unmanaged directory for contoso.co.uk into your existing IT managed directory for contoso.com.

Merging an unmanaged directory follows the same DNS validation process as only taking it over as admin. The difference is users and services are remapped to the existing managed directory.

#### What's the advantage of merging an unmanaged directory?
With an external takeover, a mapping of users-to-resources is created so users can continue to access services without interruption. Many applications, including RMS for individuals, handle the mapping of users-to-resources well, and users can continue to access those services without change. If an application does not handle the mapping of users-to-resources effectively, external takeover may be explicitly blocked to prevent users from a poor experience.

#### External admin takeover support by service
Currently the following services support external admin takeover:

* RMS
* PowerBI

The following do not require additional admin action to migrate user data after an external admin takeover:

* SharePoint/OneDrive

### Internal admin takeover
When you do an internal takeover, the directory gets converted from an unmanaged directory to a managed directory. You must complete DNS domain name validation, where you create an MX record or a TXT record in the DNS zone. That action:

* Validates that you own the domain
* Makes the directory managed, with you as the global administrator of the directory

For example, an IT administrator from Bellows College discovers that users from the school have signed up for self-service offerings from the DNS domain name BellowsCollege.com. As the registered owner of the DNS name, the IT administrator can validate ownership of the DNS name in Azure and then take over the unmanaged directory. The directory then becomes a managed directory, and the IT administrator is assigned the global administrator role for the BellowsCollege.com directory.

## How to perform a DNS domain name takeover
You have a few options for how to perform a domain validation (and take over an unmanaged domain).

### Azure portal

If you add a new domain name to an Azure AD directory, and a directory already exists for the domain, you are given the option to merge the unmanaged directory. Sign in to the Azure portal using an account that is a global administrator for your existing directory and then proceed as described in [Add a custom domain name to Azure AD](add-custom-domain.md).

### Office 365

You can use the options on the [Manage domains](https://support.office.com/article/Navigate-to-the-Office-365-Manage-domains-page-026af1f2-0e6d-4f2d-9b33-fd147420fac2/) page in Office 365 to work with your domains and DNS records. See [Verify your domain in Office 365](https://support.office.com/article/Verify-your-domain-in-Office-365-6383f56d-3d09-4dcb-9b41-b5f5a5efd611/). 
> [!IMPORTANT]
> Please be aware that this is for an internal admin takeover only. If you want to do an external admin takeover, do not use this method.

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

## Next steps
* [Add a custom domain name to Azure AD](add-custom-domain.md)
* [How to install and configure Azure PowerShell](/powershell/azure/overview)
* [Azure PowerShell](/powershell/azure/overview)
* [Azure Cmdlet Reference](/powershell/azure/get-started-azureps)
* [Set-MsolCompanySettings](/powershell/module/msonline/set-msolcompanysettings?view=azureadps-1.0)

<!--Image references-->
[1]: ./media/active-directory-self-service-signup/SelfServiceSignUpControls.png
