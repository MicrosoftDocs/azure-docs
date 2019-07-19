---
title: FAQs - Azure Active Directory Domain Services | Microsoft Docs
description: Frequently asked questions about Azure Active Directory Domain Services
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager: daveba
editor: curtand

ms.assetid: 48731820-9e8c-4ec2-95e8-83dba1e58775
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/22/2019
ms.author: iainfou

---
# Azure Active Directory Domain Services: Frequently Asked Questions (FAQs)
This page answers frequently asked questions about the Azure Active Directory Domain Services. Keep checking back for updates.

## Troubleshooting guide
Refer to the [Troubleshooting guide](troubleshoot.md) for solutions to common issues with configuring or administering Azure AD Domain Services.

## Configuration
### Can I create multiple managed domains for a single Azure AD directory?
No. You can only create a single managed domain serviced by Azure AD Domain Services for a single Azure AD directory.  

### Can I enable Azure AD Domain Services in an Azure Resource Manager virtual network?
Yes. Azure AD Domain Services can be enabled in an Azure Resource Manager virtual network. Classic Azure virtual networks are no longer supported for creating new managed domains.

### Can I migrate my existing managed domain from a classic virtual network to a Resource Manager virtual network?
Not currently. Microsoft will deliver a mechanism to migrate your existing managed domain from a classic virtual network to a Resource Manager virtual network in the future.

### Can I enable Azure AD Domain Services in an Azure CSP (Cloud Solution Provider) subscription?
Yes. See how you can enable [Azure AD Domain Services in Azure CSP subscriptions](csp.md).

### Can I enable Azure AD Domain Services in a federated Azure AD directory? I do not synchronize password hashes to Azure AD. Can I enable Azure AD Domain Services for this directory?
No. Azure AD Domain Services needs access to the password hashes of user accounts, to authenticate users via NTLM or Kerberos. In a federated directory, password hashes are not stored in the Azure AD directory. Therefore, Azure AD Domain Services does not work with such Azure AD directories.

### Can I make Azure AD Domain Services available in multiple virtual networks within my subscription?
The service itself does not directly support this scenario. Your managed domain is available in only one virtual network at a time. However, you may configure connectivity between multiple virtual networks to expose Azure AD Domain Services to other virtual networks. See how you can [connect virtual networks in Azure](../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md).

### Can I enable Azure AD Domain Services using PowerShell?
Yes. See [how to enable Azure AD Domain Services using PowerShell](powershell-create-instance.md).

### Can I enable Azure AD Domain Services using a Resource Manager Template?
No, it is not currently possible to enable Azure AD Domain Services using a template. Instead use PowerShell, see [how to enable Azure AD Domain Services using PowerShell](powershell-create-instance.md).

### Can I add domain controllers to an Azure AD Domain Services managed domain?
No. The domain provided by Azure AD Domain Services is a managed domain. You do not need to provision, configure, or otherwise manage domain controllers for this domain - these management activities are provided as a service by Microsoft. Therefore, you cannot add additional domain controllers (read-write or read-only) for the managed domain.

### Can guest users invited to my directory use Azure AD Domain Services?
No. Guest users invited to your Azure AD directory using the [Azure AD B2B](../active-directory/active-directory-b2b-what-is-azure-ad-b2b.md) invite process are synchronized into your Azure AD Domain Services managed domain. However, passwords for these users are not stored in your Azure AD directory. Therefore, Azure AD Domain Services has no way to sync NTLM and Kerberos hashes for these users into your managed domain. As a result, such users cannot log in to the managed domain or join computers to the managed domain.

## Administration and Operations
### Can I connect to the domain controller for my managed domain using Remote Desktop?
No. You do not have permissions to connect to domain controllers for the managed domain via Remote Desktop. Members of the 'AAD DC Administrators' group can administer the managed domain using AD administration tools such as the Active Directory Administration Center (ADAC) or AD PowerShell. These tools are installed using the 'Remote Server Administration Tools' feature on a Windows server joined to the managed domain.

### I’ve enabled Azure AD Domain Services. What user account do I use to domain join machines to this domain?
Members of the administrative group ‘AAD DC Administrators’ can domain-join machines. Additionally, members of this group are granted remote desktop access to machines that have been joined to the domain.

### Do I have domain administrator privileges for the managed domain provided by Azure AD Domain Services?
No. You are not granted administrative privileges on the managed domain. Both ‘Domain Administrator’ and ‘Enterprise Administrator’ privileges are not available for you to use within the domain. Members of the domain administrator or enterprise administrator groups in your on-premises Active Directory are also not granted domain/enterprise administrator privileges on the managed domain.

### Can I modify group memberships using LDAP or other AD administrative tools on managed domains?
No. Group memberships cannot be modified on domains serviced by Azure AD Domain Services. The same applies for user attributes. You may however change group memberships or user attributes either in Azure AD or on your on-premises domain. Such changes are automatically synchronized to Azure AD Domain Services.

### How long does it take for changes I make to my Azure AD directory to be visible in my managed domain?
Changes made in your Azure AD directory using either the Azure AD UI or PowerShell are synchronized to your managed domain. This synchronization process runs in the background. Once initial synchronization is complete, it typically takes about 20 minutes for changes made in Azure AD to be reflected in your managed domain.

### Can I extend the schema of the managed domain provided by Azure AD Domain Services?
No. The schema is administered by Microsoft for the managed domain. Schema extensions are not supported by Azure AD Domain Services.

### Can I modify or add DNS records in my managed domain?
Yes. Members of the 'AAD DC Administrators' group are granted 'DNS Administrator' privileges, to modify DNS records in the managed domain. They can use the DNS Manager console on a machine running Windows Server joined to the managed domain, to manage DNS. To use the DNS Manager console, install 'DNS Server Tools', which is part of the 'Remote Server Administration Tools' optional feature on the server. More information on [utilities for administering, monitoring and troubleshooting DNS](https://technet.microsoft.com/library/cc753579.aspx) is available on TechNet.

### What is the password lifetime policy on a managed domain?
The default password lifetime on an Azure AD Domain Services managed domain is 90 days. This password lifetime is not synchronized with the password lifetime configured in Azure AD. Therefore, you may have a situation where users' passwords expire in your managed domain, but are still valid in Azure AD. In such scenarios, users need to change their password in Azure AD and the new password will synchronize to your managed domain. Additionally, the 'password-does-not-expire' and 'user-must-change-password-at-next-logon' attributes for user accounts are not synchronized to your managed domain.

### Does Azure AD Domain Services provide AD account lockout protection?
Yes. Five invalid password attempts within 2 minutes on the managed domain cause a user account to be locked out for 30 minutes. After 30 minutes, the user account is automatically unlocked. Invalid password attempts on the managed domain do not lock out the user account in Azure AD. The user account is locked out only within your Azure AD Domain Services managed domain.

## Billing and availability
### Is Azure AD Domain Services a paid service?
Yes. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/active-directory-ds/).

### Is there a free trial for the service?
This service is included in the free trial for Azure. You can sign up for a [free one-month trial of Azure](https://azure.microsoft.com/pricing/free-trial/).

### Can I pause an Azure AD Domain Services managed domain? 
No. Once you have enabled an Azure AD Domain Services managed domain, the service is available within your selected virtual network until you disable/delete the managed domain. There is no way to pause the service. Billing continues on an hourly basis until you delete the managed domain.

### Can I failover Azure AD Domain Services to another region for a DR event?
No.  Azure AD Domain Services does not currently provide a geo-redundant deployment model. It is limited to a single virtual network in an Azure region. If you want to utilize multiple Azure regions, you need to run your Active Directory Domain Controllers on Azure IaaS VMs.  Architecture guidance can be found [here](https://docs.microsoft.com/azure/architecture/reference-architectures/identity/adds-extend-domain).

### Can I get Azure AD Domain Services as part of Enterprise Mobility Suite (EMS)? Do I need Azure AD Premium to use Azure AD Domain Services?
No. Azure AD Domain Services is a pay-as-you-go Azure service and is not part of EMS. Azure AD Domain Services can be used with all editions of Azure AD (Free, Basic, and, Premium). You are billed on an hourly basis, depending on usage.

### What Azure regions is the service available in?
Refer to the [Azure Services by region](https://azure.microsoft.com/regions/#services/) page to see a list of the Azure regions where Azure AD Domain Services is available.
