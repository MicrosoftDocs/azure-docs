<properties
	pageTitle="Azure Active Directory Domain Services preview: Overview | Microsoft Azure"
	description="Overview of Azure AD Domain Services"
	services="active-directory-domain-services"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory-domain-services"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/25/2015"
	ms.author="mahesh-unnikrishnan"/>
	
# Overview
Azure AD Domain Services provide managed domain services such as domain join, group policy, LDAP, Kerberos/NTLM authentication etc. that are fully compatible with Windows Server Active Directory. Azure AD Domain Services enable you to consume these domain services typically provided by a Windows Server domain controller, without the need for you to deploy, manage and patch domain controllers.

The following diagram illustrates how you can use Azure AD Domain Services. As a federated Azure AD tenant, you’ve likely configured Azure AD Sync (as part of Azure AD Connect) in order to synchronize identity information from your on-premises directory to Azure AD. This includes information about users, their credential hashes for authentication (password sync) and group memberships. If, on the other hand, your organization is cloud-only and does not have on-premises infrastructure, you have this information in your Azure AD tenant. Azure AD Domain Services leverage this directory information available in your Azure AD tenant.  

![Azure AD Domain Services Overview](./media/active-directory-domain-services-overview/aadds-overview.png)

When you enable Azure AD Domain Services for your tenant, you can select to make these services available in a virtual network of your choice. A managed domain controller is then provisioned and projected onto your selected virtual network. Since this domain controller is managed for you by Azure AD, you do not need to patch, monitor or otherwise maintain this domain controller. User information, group memberships and users’ passwords are all synchronized from your Azure AD tenant to this domain controller. This means that users can authenticate against the domain using their corporate credentials and administrators can rely on group memberships to secure access to resources. Additionally, you can domain join virtual machines within this virtual network to the domain and use the basic group policy capabilities offered by Azure AD Domain Services in order to manage these domain joined machines.

# Benefits
With Azure AD Domain Services, you can enjoy the following benefits:
-	**Simple** – You can satisfy the identity needs of virtual machines deployed to Azure Infrastructure services at the touch of a button, without the need to deploy and manage identity infrastructure or connectivity back to your on-premises infrastructure.
-	**Integrated** – With the addition of Azure AD Domain Services, you can now rely on Azure AD to be an integrated cloud-based enterprise directory that caters to the needs of both your modern applications as well as traditional directory-aware applications.
-	**Compatible** – Since Azure AD Domain Services is built on the proven enterprise grade infrastructure of Windows Server Active Directory, your applications can rely on a greater degree of compatibility with Windows Server Active Directory features. Note that not all features available in Windows Server AD are currently available in Azure AD Domain Services. However, available features are compatible with the corresponding Windows Server AD features you rely on in your on-premises infrastructure. The LDAP, Kerberos, NTLM, Group Policy and domain join infrastructure provided by Azure AD Domain Services constitute a mature offering that has been tested and refined over various Windows Server releases.
-	**Cost-effective** – With Azure AD Domain Services, you can avoid the infrastructure and management burden that is associated with managing identity infrastructure to support traditional directory-aware applications. You can move these applications to Azure Infrastructure services and benefit from greater savings on operational expenses.
