<properties
	pageTitle="Azure AD Domain Services: Compare Azure AD Domain Services to DIY domain controllers | Microsoft Azure"
	description="Comparing Azure Active Directory Domain Services to DIY domain controllers"
	services="active-directory-ds"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory-ds"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/23/2016"
	ms.author="maheshu"/>

# How to decide if Azure AD Domain Services is right for your use-case

## Differences between Azure AD Domain Services and a 'do-it-yourself' AD domain in Azure

|Feature|Azure AD Domain Services|'Do-it-yourself' AD in Azure VMs|
|---|---|---|
|[**Managed domain**](active-directory-ds-comparison.md#Managed-service)|Yes|No|
|[**Secure deployments**](active-directory-ds-comparison.md#Secure-deployments)|Yes|Needs to be secured.|
|**Custom OU structure**|Yes|Yes|
|[**DNS server**](active-directory-ds-comparison.md#DNS-server)|Yes|Yes|
|**Domain/Enterprise administrator privileges**|No|Yes|
|**Schema extensions**|No|Yes|
|**AD domain/forest trusts**|No|Yes|
|**LDAP write/modify**|No|Yes|
|**Group Policy**|Simple|Full|
|**Geo-dispersed deployments**|No|Yes|

#### Managed service
Azure AD Domain Services domains are managed by Microsoft. This means you do not have to worry about patching, updates, monitoring, backups, and ensuring availability of your domain. These management tasks are offered as a service by Microsoft Azure for your managed domains.

#### Secure deployments
The managed domain is securely locked down in conjunction with Microsoft’s security best practices for AD deployments. These best practices stem from the AD product team's decades of experience engineering and supporting AD deployments. For do-it-yourself deployments you will need to take specific deployment steps to lock down/secure your deployment.

#### Custom OU structure
Members of the 'AAD DC Administrators' group can create custom OUs within the managed domain.

#### DNS server
An Azure AD Domain Services managed domain includes managed DNS services. Members of the 'AAD DC Administrators' group can manage DNS on the managed domain. Members of this group are given full DNS Administration privileges for the managed domain. DNS management can be performed using the 'DNS Administration console' included in the Remote Server Administration Tools (RSAT) package.

#### Domain/Enterprise Administrator privileges
These elevated privileges are not offered on an AAD-DS managed domain. Applications that require these elevated privileges in order to be installed/run cannot be run against managed domains. A smaller subset of administrative privileges (for example, privileges to configure DNS, configure group policy, gain administrator privileges on domain-joined machines etc.) are available to members of the delegated administration group called ‘AAD DC Administrators’.

#### Schema extensions
You cannot extend the base schema of an Azure AD Domain Services managed domain. Therefore, applications that rely on extensions to AD schema (for example, new attributes under the user object) cannot be lifted and shifted to AAD-DS domains.

#### AD Domain/Forest Trusts
Managed domains cannot be configured to set up trust relationships (inbound/outbound) with other domains. Therefore, scenarios such as resource forest deployments or cases where you do not want to synchronize passwords to Azure AD will not be able to use Azure AD Domain Services.

#### LDAP Write/Modify
The managed domain is read-only for user objects. This means that applications, which try to perform LDAP writes against attributes of the user object will not work in a managed domain. Additionally, user passwords cannot be changed from within the managed domain. Another example would be modification of group memberships or group attributes within the managed domain, which is not permitted. However, any changes to user attributes or passwords made in Azure AD (via PowerShell/Azure portal) or on-premises AD are synchronized to the AAD-DS managed domain.

#### Group policy
Sophisticated group policy constructs such as the ability to create separate GPOs for each custom OU in the domain or using WMI filtering for GP targeting aren’t supported on the AAD-DS managed domain. There is a built-in GPO each for the ‘AADDC Computers’ and ‘AADDC Users’ containers which can be customized to configure group policy.


#### Geo-dispersed deployments
Azure AD Domain Services managed domains are available in a single virtual network in Azure. For scenarios that require domain controllers to be available in multiple Azure regions across the world, setting up domain controllers in Azure IaaS VMs might be the better alternative.


## Related Content
- [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](https://msdn.microsoft.com/en-us/library/azure/jj156090.aspx)
