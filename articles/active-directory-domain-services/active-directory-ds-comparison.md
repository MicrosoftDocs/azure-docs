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

## Compare Azure AD Domain Services to a 'do-it-yourself' AD domain in Azure

|Feature|Azure AD Domain Services|'Do-it-yourself' AD in Azure VMs|
|---|:---:|:---:|
|[**Managed service**](active-directory-ds-comparison.md#managed-service)|Yes|No|
|[**Secure deployments**](active-directory-ds-comparison.md#secure-deployments)|Yes|Administrator needs to secure the deployment.|
|[**DNS server**](active-directory-ds-comparison.md#dns-server)|Yes (managed service)|Yes|
|[**Domain or Enterprise administrator privileges**](active-directory-ds-comparison.md#domain-or-enterprise-administrator-privileges)|No|Yes|
|[**Domain join**](active-directory-ds-comparison.md#domain-join)|Yes|Yes|
|[**Domain authentication using NTLM and Kerberos**](active-directory-ds-comparison.md#domain-authentication-using-ntlm-and-kerberos)|Yes|Yes|
|[**Custom OU structure**](active-directory-ds-comparison.md#custom-ou-structure)|Yes|Yes|
|[**Schema extensions**](active-directory-ds-comparison.md#schema-extensions)|No|Yes|
|[**AD domain/forest trusts**](active-directory-ds-comparison.md#ad-domain-or-forest-trusts)|No|Yes|
|[**LDAP read**](active-directory-ds-comparison.md#ldap-read)|Yes|Yes|
|[**LDAP write**](active-directory-ds-comparison.md#ldap-write)|No|Yes|
|[**Group Policy**](active-directory-ds-comparison.md#group-policy)|Simple|Full|
|[**Geo-dispersed deployments**](active-directory-ds-comparison.md#geo-dispersed-deployments)|No|Yes|

#### Managed service
Azure AD Domain Services domains are managed by Microsoft. You do not have to worry about patching, updates, monitoring, backups, and ensuring availability of your domain. These management tasks are offered as a service by Microsoft Azure for your managed domains.

#### Secure deployments
The managed domain is securely locked down as per Microsoft’s security best practices for AD deployments. These best practices stem from the AD product team's decades of experience engineering and supporting AD deployments. For do-it-yourself deployments, you need to take specific deployment steps to lock down/secure your deployment.

#### DNS server
An Azure AD Domain Services managed domain includes managed DNS services. Members of the 'AAD DC Administrators' group can manage DNS on the managed domain. Members of this group are given full DNS Administration privileges for the managed domain. DNS management can be performed using the 'DNS Administration console' included in the Remote Server Administration Tools (RSAT) package.

#### Domain or Enterprise Administrator privileges
These elevated privileges are not offered on an AAD-DS managed domain. Applications that require these elevated privileges to be installed/run cannot be run against managed domains. A smaller subset of administrative privileges is available to members of the delegated administration group called ‘AAD DC Administrators’. These privileges include privileges to configure DNS, configure group policy, gain administrator privileges on domain-joined machines etc.

#### Domain join

#### Domain authentication using NTLM and Kerberos
Azure AD Domain Services enable you to use your corporate credentials in order to authenticate with the managed domain. Credentials are kept in sync with your Azure AD tenant. In the case of synced tenants, Azure AD Connect ensures that changes to credentials made on-premises are synchronized to Azure AD. With a DIY domain setup, you may need to setup a domain trust relationship with an on-premises account forest for users to authenticate with their corporate credentials. Alternately, you may need to setup AD replication to ensure that user passwords synchronize to your Azure domain controller virtual machines.

#### Custom OU structure
Members of the 'AAD DC Administrators' group can create custom OUs within the managed domain.

#### Schema extensions
You cannot extend the base schema of an Azure AD Domain Services managed domain. Therefore, applications that rely on extensions to AD schema (for example, new attributes under the user object) cannot be lifted and shifted to AAD-DS domains.

#### AD Domain or Forest Trusts
Managed domains cannot be configured to set up trust relationships (inbound/outbound) with other domains. Therefore, scenarios such as resource forest deployments or cases where you prefer not to synchronize passwords to Azure AD cannot use Azure AD Domain Services.

#### LDAP Read
The managed domain supports LDAP read workloads. Therefore you can deploy applications that perform LDAP read operations against the managed domain.

#### LDAP Write
The managed domain is read-only for user objects. Therefore, applications that perform LDAP write operations against attributes of the user object do not work in a managed domain. Additionally, user passwords cannot be changed from within the managed domain. Another example would be modification of group memberships or group attributes within the managed domain, which is not permitted. However, any changes to user attributes or passwords made in Azure AD (via PowerShell/Azure portal) or on-premises AD are synchronized to the AAD-DS managed domain.

#### Group policy
Sophisticated group policy constructs aren’t supported on the AAD-DS managed domain. For example, you cannot create and deploy separate GPOs for each custom OU in the domain or use WMI filtering for GP targeting. There is a built-in GPO each for the ‘AADDC Computers’ and ‘AADDC Users’ containers, which can be customized to configure group policy.

#### Geo-dispersed deployments
Azure AD Domain Services managed domains are available in a single virtual network in Azure. For scenarios that require domain controllers to be available in multiple Azure regions across the world, setting up domain controllers in Azure IaaS VMs might be the better alternative.


## Related Content
- [Features - Azure AD Domain Services](active-directory-ds-features.md)

- [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](https://msdn.microsoft.com/library/azure/jj156090.aspx)
