<properties
	pageTitle="Azure Active Directory Domain Services preview: Overview | Microsoft Azure"
	description="Overview of Azure AD Domain Services"
	services="active-directory-domain-services"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="udayh"
	editor="femila"/>

<tags
	ms.service="active-directory-domain-services"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/29/2015"
	ms.author="mahesh-unnikrishnan"/>

# Azure AD Domain Services *(Preview)*

## Overview
Azure Infrastructure Services enable you to deploy a wide range of computing solutions in an agile manner. With Virtual Machines, you can deploy nearly instantaneously and you pay only by the minute. With Windows, Linux, SQL Server, Oracle, IBM, SAP, and BizTalk, you can deploy any workload, any language, on nearly any operating system. These benefits enable you to migrate legacy applications deployed on-premises to Azure, in order save on operational expenses.

A key aspect of migrating on-premises applications to Azure is handling the identity needs of these applications. Directory-aware applications may rely on LDAP for read or write access to the corporate directory or rely on Windows Integrated Authentication (Kerberos or NTLM authentication). Line of business applications running on Windows Server are typically deployed on domain joined machines, so they can be managed securely using Group Policy. In order to 'lift-and-shift' on-premises applications to the cloud, these dependencies on the corporate identity infrastructure need to be resolved.

In order to satisfy the identity needs of their applications deployed in Azure, administrators often turn to one of the following solutions:
- Deploy a site-to-site VPN connection between workloads running in Azure Infrastructure Services and the corporate directory on-premises.
- Extend the corporate domain/forest by setting up replica domain controllers using Azure virtual machines.
- Deploy a stand-alone domain in Azure using domain controller virtual machines.

All of these approaches suffer from high cost and administrative overhead. Administrators are required to deploy domain controllers using virtual machines in Azure and to subsequently manage, secure, patch, monitor, backup and troubleshoot these virtual machines. The reliance on VPN connections to the on-premises directory causes workloads deployed in Azure to be vulnerable to transient network glitches or outages, thus reducing uptime and reliability for these applications.

Azure AD Domain Services are designed to provide a much easier alternative.


## Introducing Azure AD Domain Services
Azure AD Domain Services provide managed domain services such as domain join, group policy, LDAP, Kerberos/NTLM authentication etc. that are fully compatible with Windows Server Active Directory. Azure AD Domain Services enable you to consume these domain services, without the need for you to deploy, manage and patch domain controllers. Azure AD Domain Services integrate with your existing Azure AD tenant, thus making it possible for users to login using their corporate credentials. Additionally, you can use existing groups and user accounts to secure access to resources, thus ensuring a smoother 'lift-and-shift' of on-premises resources to Azure Infrastructure Services.

The following diagram illustrates how you can use Azure AD Domain Services. Azure AD Domain Services work seamlessly regardless of whether your Azure AD tenant is cloud-only or synced with your on-premises Active Directory. As a federated Azure AD tenant, you’ve likely configured Azure AD Connect in order to synchronize identity information from your on-premises directory to Azure AD. This includes information about users, their credential hashes for authentication (password sync) and group memberships. If, on the other hand, your organization is cloud-only and does not have on-premises infrastructure, you have this information in your Azure AD tenant. Azure AD Domain Services leverage this directory information available in your Azure AD tenant.

![Azure AD Domain Services Overview](./media/active-directory-domain-services-overview/aadds-overview.png)

When you enable Azure AD Domain Services for your Azure AD tenant, you can select to make these services available in an Azure virtual network of your choice. A managed domain controller is then provisioned and make available on your selected Azure virtual network. Since this domain controller is managed for you by Azure AD, you do not need to patch, monitor or otherwise maintain this domain controller. User information, group memberships and users’ passwords are all synchronized from your Azure AD tenant to this domain controller. This means that users can authenticate against the domain using their corporate credentials and administrators can rely on group memberships to secure access to resources. Additionally, you can domain join virtual machines within this virtual network to the domain and use the basic group policy capabilities offered by Azure AD Domain Services in order to manage these domain joined machines.


## Benefits
With Azure AD Domain Services, you can enjoy the following benefits:

-	**Simple** – You can satisfy the identity needs of virtual machines deployed to Azure Infrastructure services with a few simple clicks, without the need to deploy and manage identity infrastructure in Azure or setup connectivity back to your on-premises identity infrastructure.

-	**Integrated** – Azure AD Domain Services is deeply integrated with your Azure AD tenant. You can now rely on Azure AD to be an integrated cloud-based enterprise directory that caters to the needs of both your modern applications as well as traditional directory-aware applications.

-	**Compatible** – Since Azure AD Domain Services is built on the proven enterprise grade infrastructure of Windows Server Active Directory, your applications can rely on a greater degree of compatibility with Windows Server Active Directory features. Note that not all features available in Windows Server AD are currently available in Azure AD Domain Services. However, available features are compatible with the corresponding Windows Server AD features you rely on in your on-premises infrastructure. The LDAP, Kerberos, NTLM, Group Policy and domain join capabilities provided by Azure AD Domain Services constitute a mature offering that has been tested and refined over various Windows Server releases.

-	**Cost-effective** – With Azure AD Domain Services, you can avoid the infrastructure and management burden that is associated with managing identity infrastructure to support traditional directory-aware applications. You can move these applications to Azure Infrastructure Services and benefit from greater savings on operational expenses.
