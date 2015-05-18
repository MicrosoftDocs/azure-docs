<properties 
	pageTitle="Azure AD service limits and restrictions" 
	description="Usage constraints and other service limits for the Azure Active Directory service." 
	services="active-directory" 
	documentationCenter="" 
	authors="Justinha" 
	writer="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"/>

<tags 
	ms.service="active-directory" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="Justinha"/>

# Azure AD service limits and restrictions

Here are the usage constraints and other service limits for the Azure Active Directory service. If you’re looking for the full set of Microsoft Azure service limits, see [Azure Subscription and Service Limits, Quotas, and Constraints](azure-subscription-service-limits.md).

## Directories

A single user can only be associated with a maximum of 20 Azure Active Directory directories. This limit can be reached in any of the following examples:

- A single user creates 20 directories.
- A single user is added to 20 directories as a member.
- A single user creates 10 directories and later is added by others to 10 different directories.

## Objects

- There are no limits for subscribers of Azure Active Directory Premium or Azure Active Directory Basic, Enterprise Mobility Suite, Office 365, Windows Intune, or any other Microsoft online service that relies on Azure Active Directory for directory services.
- A maximum of 500,000 objects can be used in a single directory with the Free edition of Azure Active Directory.
- A non-admin user can create up to 250 objects.

##Schema extensions

Currently “User”, “Group”, “TenantDetail”, “Device”, “Application” and “ServicePrincipal” entities can be extended with “String” type or “Binary” type single-valued attributes. These include the following limitations:

- String type extensions can have maximum of 256 characters.
- Binary type extensions are limited to 256 bytes.
- 100 extension values (across ALL types and ALL applications) can be written to any single object.
- Schema extensions are available only in Graph API-version 1.21-preview. The application must be granted write access to register an extension.

## Applications

A maximum of 10 users can be owners of a single application.

## Groups 

- A maximum of 10 users can be owners of a single group.
- Any number of objects can be members of a single group in Azure Active Directory.


> [AZURE.NOTE]
> 
There is a limit for the number of objects you can synchronize from your On Premises Active Directory to Azure Active Directory.
- If you’re using DirSync the limit is 15K users.
- If you’re using Azure AD Connect, the limit is 50K users. 

## Access Panel

- There is no limit to the number of applications that can be seen in the Access Panel per end user for subscribers to Azure AD Premium or Azure AD Basic or the Enterprise Mobility Suite.
- A maximum of 10 preintegrated SaaS apps (examples: Box, Salesforce, or Dropbox) can be seen in the Access Panel for each end user with the Free edition of Azure Active Directory. End users might see more than 10 apps if your organization developed apps that were integrated afterward with Azure Active Directory. This limit does not apply to Administrator accounts.

## Reports

A maximum of 1,000 rows can be viewed or downloaded in any report. Any additional data is truncated. 

## What's next
- [Sign up for Azure as an organization](sign-up-organization.md)
- [How Azure subscriptions are associated with Azure AD](active-directory-how-subscriptions-associated-directory.md)
- [Azure AD terminology](active-directory-terminology.md)


