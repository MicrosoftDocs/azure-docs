<properties
	pageTitle="Azure Active Directory Domain Services preview: Features | Microsoft Azure"
	description="Features of Azure Active Directory Domain Services"
	services="active-directory-domain-services"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="udayh"
	editor="femila"/>

<tags
	ms.service="active-directory-ds"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/05/2015"
	ms.author="mahesh-unnikrishnan"/>

# Azure AD Domain Services *(Preview)*

## Features
The following features are available in the Azure AD Domain Services preview release.

- **Simple deployment experience:** You can enable Azure AD Domain Services for your Azure AD tenant using just a few clicks. Regardless of whether your Azure AD tenant is a cloud-tenant or synchronized with your on-premises directory, your domain can be up and running quickly.

- **Support for domain-join:** You can easily domain join computers in the Azure virtual network that Azure AD Domain Services is available in. The domain join experience on Windows client and Server operating systems works seamlessly against domains serviced by Azure AD Domain Services. You can also use automated domain join tooling against such domains.

- **One domain instance per Azure AD directory:** You can create a single Active Directory domain for each Azure AD directory.

- **Create domains with custom names:** You can create domains with custom names (eg. contoso.local) using Azure AD Domain Services. This includes both verified as well as unverified domain names. Optionally, you can also create a domain with the built-in domain suffix (i.e. *.onmicrosoft.com) that is offered by your Azure AD directory.

- **Integrated with Azure AD:** You do not need to configure or manage replication to the domain controllers provided by Azure AD Domain Services. These domain controllers are automatically configured to synchronize user attributes, group memberships and user credentials (passwords) from your Azure AD directory. New users, groups or changes to attributes ocurring in your Azure AD tenant or in your on-premises directory are automatically synchronized to Azure AD Domain Services.

- **NTLM and Kerberos authentication:** With support for NTLM and Kerberos authentication, you can deploy applications that rely on Windows Integrated Authentication.

- **Use your corporate credentials/passwords:** Passwords for users in your Azure AD tenant are synchronized to the domain controllers provided by Azure AD Domain Services. This means users in your organization can use their corporate credentials on the domain – for domain joining machines, logging in interactively or over remote desktop, authenticating against the DC etc.

- **LDAP bind & LDAP read support:** You can use applications that rely on LDAP binds in order to authenticate users in domains serviced by Azure AD Domain Services. Additionally, applications that use LDAP read operations to query user/computer attributes from the directory can also work against Azure AD Domain Services.

- **Group Policy:** You can leverage a single built-in GPO each for the users and computers containers in order to enforce compliance with required security policies for user accounts as well as domain joined computers.

- **Available in multiple Azure regions:** See the [supported Azure regions](active-directory-domain-services-regions.md) page for a list of Azure regions in which Azure AD Domain Services are available.

- **High availability:** Azure AD Domain Services deploy two domain controllers to service your domain. This offers the guarantee of higher service uptime and resilience to failures that may impact individual domain controllers. Built-in health monitoring offers automated remediation from failures by spinning up new domain controller instances to replace failed instances and provide continued service.

- **Use familiar management tools:** You can use familiar Windows Server Active Directory management tools such as the Active Directory Administrative Center or Active Directory PowerShell in order to administer domains provided by Azure AD Domain Services.
