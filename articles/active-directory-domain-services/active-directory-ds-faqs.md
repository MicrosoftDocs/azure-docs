<properties
	pageTitle="Azure Active Directory Domain Services preview: FAQs | Microsoft Azure"
	description="Frequently asked questions about Azure Active Directory Domain Services"
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
	ms.date="07/06/2016"
	ms.author="maheshu"/>

# Azure Active Directory Domain Services preview: FAQs

This page answers frequently asked questions about the Azure Active Directory Domain Services preview. Keep checking back for updates.

### Troubleshooting guide
Refer to our [Troubleshooting guide](active-directory-ds-troubleshooting.md) for solutions to common issues encountered when configuring or administering Azure AD Domain Services.


### Configuration

#### Can I create multiple domains for a single Azure AD directory?
No. You can only create a single domain serviced by Azure AD Domain Services for a single Azure AD directory.  

#### Can I make Azure AD Domain Services available in multiple virtual networks within my subscription?
The service itself does not directly support this scenario. Azure AD Domain Services are available in only one virtual network at a time. However, you may configure connectivity between multiple virtual networks in order to expose Azure AD Domain Services to other virtual networks. This article describes how you can [connect virtual networks in Azure](../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md).

#### Can I enable Azure AD Domain Services using PowerShell?
PowerShell/automated deployment of Azure AD Domain Services is not available currently.

#### Is Azure AD Domain Services available in the new Azure portal?
No. Azure AD Domain Services can be configured only in the [Azure classic portal](https://manage.windowsazure.com). We expect to extend support for the [Azure portal](https://portal.azure.com) in the future.

#### Can I add domain controllers to an Azure AD Domain Services managed domain?
No. The domain provided by Azure AD Domain Services is a managed domain. You do not need to provision, configure or otherwise manage domain controllers for this domain - these management activities are provided as a service by Microsoft. Therefore, you will not be able to add additional domain controllers (neither read-write nor read-only) for the managed domain.

### Administration and Operations

#### Can I connect to the domain controller for my managed domain using Remote Desktop?
No. Because this is a managed domain, you can't connect to domain controllers for the domain via Remote Desktop. Members of the 'AAD DC Administrators' group can administer the managed domain using AD administration tools such as the Active Directory Administration Center (ADAC) or AD PowerShell. These tools are installed using the 'Remote Server Administration Tools' feature on a Windows server joined to the managed domain.

#### I’ve enabled Azure AD Domain Services. What user account do I use to domain join machines to this domain?
Any of the user accounts you’ve added to the administrative group (for example, ‘AAD DC Administrators’) would be able to domain join machines. Additionally, users in this group are granted remote desktop access to machines that have been joined to the domain.

#### Can I wield domain administrator privileges for the domain provided by Azure AD Domain Services?
No. Because this is a managed service, you aren't granted administrative privileges on the domain. This means that both ‘Domain Administrator’ as well as ‘Enterprise Administrator’ privileges are not available within the domain. Existing domain administrator or enterprise administrator groups within your Azure AD directory are also not granted domain/enterprise administrator privileges on the domain.

#### Can I modify group memberships using LDAP or other AD administrative tools on domains provided by Azure AD Domain Services?
No. Group memberships cannot be modified on domains serviced by Azure AD Domain Services. The same applies for user attributes. You may however change group memberships or user attributes either in Azure AD or on your on-premises domain. Such changes will be automatically synchronized to Azure AD Domain Services.

#### Can I extend the schema of the domain provided by Azure AD Domain Services?
No. The schema is administered by Microsoft for the managed domain. Schema extensions are not supported by Azure AD Domain Services.

#### Can I modify DNS records provided by Azure AD Domain Services?
Yes. Users that belong to the 'AAD DC Administrators' group are granted 'DNS Administrator' privileges, in order to modify DNS records in the managed domain. These users can use the DNS Manager console on a machine running Windows Server joined to the managed domain, in order to manage DNS. In order to use the DNS Manager console, install 'DNS Server Tools', which is part of the 'Remote Server Administration Tools' optional feature on the server. More information on [utilities for administering, monitoring and troubleshooting DNS](https://technet.microsoft.com/library/cc753579.aspx) is available on TechNet.

### Billing and availability

#### Is this a paid service?
The service is available at a special reduced price for the duration of the public preview period. Billing will commence at full price once the service is generally available (GA). See the pricing page for more information.

#### Is there a free trial for the service?
This service is included in the free trial for Azure. You can sign up for a [free one-month trial of Azure](https://azure.microsoft.com/pricing/free-trial/).

#### Can I get Azure AD Domain Services as part of Enterprise Mobility Suite (EMS)?
No, Azure AD Domain Services is a pay-as-you-go Azure service and is not part of EMS. Azure AD Domain Services are available for all SKUs of Azure AD (Free, Basic, and Premium) and are billed on an hourly basis depending on usage.

#### What Azure regions is the service available in?
Refer to our [regions page](active-directory-ds-regions.md) to see a list of the Azure regions where Azure AD Domain Services are available.

#### When will Azure AD Domain Services be Generally Available?
We cannot currently share timelines for when the service will be generally available.
