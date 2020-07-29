---
title: Frequently asked questions about Azure AD Domain Services | Microsoft Docs
description: Read and understand some of the frequently asked questions around configuration, administration, and availability for Azure Active Directory Domain Services
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 48731820-9e8c-4ec2-95e8-83dba1e58775
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 06/05/2020
ms.author: iainfou

---
# Frequently asked questions (FAQs)

This page answers frequently asked questions about Azure Active Directory Domain Services.

## Configuration

* [Can I create multiple managed domains for a single Azure AD directory?](#can-i-create-multiple-managed-domains-for-a-single-azure-ad-directory)
* [Can I enable Azure AD Domain Services in a Classic virtual network?](#can-i-enable-azure-ad-domain-services-in-a-classic-virtual-network)
* [Can I enable Azure AD Domain Services in an Azure Resource Manager virtual network?](#can-i-enable-azure-ad-domain-services-in-an-azure-resource-manager-virtual-network)
* [Can I migrate my existing managed domain from a classic virtual network to a Resource Manager virtual network?](#can-i-migrate-my-existing-managed-domain-from-a-classic-virtual-network-to-a-resource-manager-virtual-network)
* [Can I enable Azure AD Domain Services in an Azure CSP (Cloud Solution Provider) subscription?](#can-i-enable-azure-ad-domain-services-in-an-azure-csp-cloud-solution-provider-subscription)
* [Can I enable Azure AD Domain Services in a federated Azure AD directory? I do not synchronize password hashes to Azure AD. Can I enable Azure AD Domain Services for this directory?](#can-i-enable-azure-ad-domain-services-in-a-federated-azure-ad-directory-i-do-not-synchronize-password-hashes-to-azure-ad-can-i-enable-azure-ad-domain-services-for-this-directory)
* [Can I make Azure AD Domain Services available in multiple virtual networks within my subscription?](#can-i-make-azure-ad-domain-services-available-in-multiple-virtual-networks-within-my-subscription)
* [Can I enable Azure AD Domain Services using PowerShell?](#can-i-enable-azure-ad-domain-services-using-powershell)
* [Can I enable Azure AD Domain Services using a Resource Manager Template?](#can-i-enable-azure-ad-domain-services-using-a-resource-manager-template)
* [Can I add domain controllers to an Azure AD Domain Services managed domain?](#can-i-add-domain-controllers-to-an-azure-ad-domain-services-managed-domain)
* [Can guest users invited to my directory use Azure AD Domain Services?](#can-guest-users-invited-to-my-directory-use-azure-ad-domain-services)
* [Can I move an existing Azure AD Domain Services managed domain to a different subscription, resource group, region, or virtual network?](#can-i-move-an-existing-azure-ad-domain-services-managed-domain-to-a-different-subscription-resource-group-region-or-virtual-network)
* [Does Azure AD Domain Services include high availability options?](#does-azure-ad-domain-services-include-high-availability-options)

### Can I create multiple managed domains for a single Azure AD directory?
No. You can only create a single managed domain serviced by Azure AD Domain Services for a single Azure AD directory.

### Can I enable Azure AD Domain Services in a Classic virtual network?
Classic virtual networks aren't supported for new deployments. Existing managed domains deployed in Classic virtual networks continue to be supported until they're retired on March 1, 2023. For existing deployments, you can [migrate Azure AD Domain Services from the Classic virtual network model to Resource Manager](migrate-from-classic-vnet.md).

For more information, see the [official deprecation notice](https://azure.microsoft.com/updates/we-are-retiring-azure-ad-domain-services-classic-vnet-support-on-march-1-2023/).

### Can I enable Azure AD Domain Services in an Azure Resource Manager virtual network?
Yes. Azure AD Domain Services can be enabled in an Azure Resource Manager virtual network. Classic Azure virtual networks are no longer available when you create a managed domain.

### Can I migrate my existing managed domain from a Classic virtual network to a Resource Manager virtual network?
Yes. For more information, see [Migrate Azure AD Domain Services from the Classic virtual network model to Resource Manager](migrate-from-classic-vnet.md).

### Can I enable Azure AD Domain Services in an Azure CSP (Cloud Solution Provider) subscription?
Yes. For more information, see [how to enable Azure AD Domain Services in Azure CSP subscriptions](csp.md).

### Can I enable Azure AD Domain Services in a federated Azure AD directory? I do not synchronize password hashes to Azure AD. Can I enable Azure AD Domain Services for this directory?
No. To authenticate users via NTLM or Kerberos, Azure AD Domain Services needs access to the password hashes of user accounts. In a federated directory, password hashes aren't stored in the Azure AD directory. Therefore, Azure AD Domain Services doesn't work with such Azure AD directories.

However, if you're using Azure AD Connect for password hash synchronization, you can use Azure AD Domain Services because the password hash values are stored in Azure AD.

### Can I make Azure AD Domain Services available in multiple virtual networks within my subscription?
The service itself doesn't directly support this scenario. Your managed domain is available in only one virtual network at a time. However, you can configure connectivity between multiple virtual networks to expose Azure AD Domain Services to other virtual networks. For more information, see [how to connect virtual networks in Azure using VPN gateways](../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md) or [virtual network peering](../virtual-network/virtual-network-peering-overview.md).

### Can I enable Azure AD Domain Services using PowerShell?
Yes. For more information, see [how to enable Azure AD Domain Services using PowerShell](powershell-create-instance.md).

### Can I enable Azure AD Domain Services using a Resource Manager Template?
Yes, you can create an Azure AD Domain Services managed domain using a Resource Manager template. A service principal and Azure AD group for administration must be created using the Azure portal or Azure PowerShell before the template is deployed. For more information, see [Create an Azure AD DS managed domain using an Azure Resource Manager template](template-create-instance.md). When you create an Azure AD Domain Services managed domain in the Azure portal, there's an also option to export the template for use with additional deployments.

### Can I add domain controllers to an Azure AD Domain Services managed domain?
No. The domain provided by Azure AD Domain Services is a managed domain. You don't need to provision, configure, or otherwise manage domain controllers for this domain. These management activities are provided as a service by Microsoft. Therefore, you can't add additional domain controllers (read-write or read-only) for the managed domain.

### Can guest users invited to my directory use Azure AD Domain Services?
No. Guest users invited to your Azure AD directory using the [Azure AD B2B](../active-directory/active-directory-b2b-what-is-azure-ad-b2b.md) invite process are synchronized into your Azure AD Domain Services managed domain. However, passwords for these users aren't stored in your Azure AD directory. Therefore, Azure AD Domain Services has no way to synchronize NTLM and Kerberos hashes for these users into your managed domain. Such users can't sign in or join computers to the managed domain.

### Can I move an existing Azure AD Domain Services managed domain to a different subscription, resource group, region, or virtual network?
No. After you create an Azure AD Domain Services managed domain, you can't then move the managed domain to a different resource group, virtual network, subscription, etc. Take care to select the most appropriate subscription, resource group, region, and virtual network when you deploy the managed domain.

### Does Azure AD Domain Services include high availability options?

Yes. Each Azure AD Domain Services managed domain includes two domain controllers. You don't manage or connect to these domain controllers, they're part of the managed service. If you deploy Azure AD Domain Services into a region that supports Availability Zones, the domain controllers are distributed across zones. In regions that don't support Availability Zones, the domain controllers are distributed across Availability Sets. You have no configuration options or management control over this distribution. For more information, see [Availability options for virtual machines in Azure](../virtual-machines/windows/availability.md).

## Administration and operations

* [Can I connect to the domain controller for my managed domain using Remote Desktop?](#can-i-connect-to-the-domain-controller-for-my-managed-domain-using-remote-desktop)
* [I've enabled Azure AD Domain Services. What user account do I use to domain join machines to this domain?](#ive-enabled-azure-ad-domain-services-what-user-account-do-i-use-to-domain-join-machines-to-this-domain)
* [Do I have domain administrator privileges for the managed domain provided by Azure AD Domain Services?](#do-i-have-domain-administrator-privileges-for-the-managed-domain-provided-by-azure-ad-domain-services)
* [Can I modify group memberships using LDAP or other AD administrative tools on managed domains?](#can-i-modify-group-memberships-using-ldap-or-other-ad-administrative-tools-on-managed-domains)
* [How long does it take for changes I make to my Azure AD directory to be visible in my managed domain?](#how-long-does-it-take-for-changes-i-make-to-my-azure-ad-directory-to-be-visible-in-my-managed-domain)
* [Can I extend the schema of the managed domain provided by Azure AD Domain Services?](#can-i-extend-the-schema-of-the-managed-domain-provided-by-azure-ad-domain-services)
* [Can I modify or add DNS records in my managed domain?](#can-i-modify-or-add-dns-records-in-my-managed-domain)
* [What is the password lifetime policy on a managed domain?](#what-is-the-password-lifetime-policy-on-a-managed-domain)
* [Does Azure AD Domain Services provide AD account lockout protection?](#does-azure-ad-domain-services-provide-ad-account-lockout-protection)
* [Can I configure Distributed File System (DFS) and replication within Azure AD Domain Services?](#can-i-configure-distributed-file-system-and-replication-within-azure-ad-domain-services)

### Can I connect to the domain controller for my managed domain using Remote Desktop?
No. You don't have permissions to connect to domain controllers for the managed domain using Remote Desktop. Members of the *AAD DC Administrators* group can administer the managed domain using AD administration tools such as the Active Directory Administration Center (ADAC) or AD PowerShell. These tools are installed using the *Remote Server Administration Tools* feature on a Windows server joined to the managed domain. For more information, see [Create a management VM to configure and administer an Azure AD Domain Services managed domain](tutorial-create-management-vm.md).

### I've enabled Azure AD Domain Services. What user account do I use to domain join machines to this domain?
Any user account that's part of the managed domain can join a VM. Members of the *AAD DC Administrators* group are granted remote desktop access to machines that have been joined to the managed domain.

### Do I have domain administrator privileges for the managed domain provided by Azure AD Domain Services?
No. You aren't granted administrative privileges on the managed domain. *Domain Administrator* and *Enterprise Administrator* privileges aren't available for you to use within the domain. Members of the domain administrator or enterprise administrator groups in your on-premises Active Directory are also not granted domain / enterprise administrator privileges on the managed domain.

### Can I modify group memberships using LDAP or other AD administrative tools on managed domains?
Users and groups that are synchronized from Azure Active Directory to Azure AD Domain Services cannot be modified because their source of origin is Azure Active Directory. Any user or group originating in the managed domain may be modified.

### How long does it take for changes I make to my Azure AD directory to be visible in my managed domain?
Changes made in your Azure AD directory using either the Azure AD UI or PowerShell are automatically synchronized to your managed domain. This synchronization process runs in the background. There's no defined time period for this synchronization to complete all the object changes.

### Can I extend the schema of the managed domain provided by Azure AD Domain Services?
No. The schema is administered by Microsoft for the managed domain. Schema extensions aren't supported by Azure AD Domain Services.

### Can I modify or add DNS records in my managed domain?
Yes. Members of the *AAD DC Administrators* group are granted *DNS Administrator* privileges to modify DNS records in the managed domain. Those users can use the DNS Manager console on a machine running Windows Server joined to the managed domain to manage DNS. To use the DNS Manager console, install *DNS Server Tools*, which is part of the *Remote Server Administration Tools* optional feature on the server. For more information, see [Administer DNS in an Azure AD Domain Services managed domain](manage-dns.md).

### What is the password lifetime policy on a managed domain?
The default password lifetime on an Azure AD Domain Services managed domain is 90 days. This password lifetime is not synchronized with the password lifetime configured in Azure AD. Therefore, you may have a situation where users' passwords expire in your managed domain, but are still valid in Azure AD. In such scenarios, users need to change their password in Azure AD and the new password will synchronize to your managed domain. Additionally, the *password-does-not-expire* and *user-must-change-password-at-next-logon* attributes for user accounts aren't synchronized to your managed domain.

### Does Azure AD Domain Services provide AD account lockout protection?
Yes. Five invalid password attempts within 2 minutes on the managed domain cause a user account to be locked out for 30 minutes. After 30 minutes, the user account is automatically unlocked. Invalid password attempts on the managed domain don't lock out the user account in Azure AD. The user account is locked out only within your Azure AD Domain Services managed domain. For more information, see [Password and account lockout policies on managed domains](password-policy.md).

### Can I configure Distributed File System and replication within Azure AD Domain Services?
No. Distributed File System (DFS) and replication aren't available when using Azure AD Domain Services.

## Billing and availability

* [Is Azure AD Domain Services a paid service?](#is-azure-ad-domain-services-a-paid-service)
* [Is there a free trial for the service?](#is-there-a-free-trial-for-the-service)
* [Can I pause an Azure AD Domain Services managed domain?](#can-i-pause-an-azure-ad-domain-services-managed-domain)
* [Can I failover Azure AD Domain Services to another region for a DR event?](#can-i-pause-an-azure-ad-domain-services-managed-domain)
* [Can I get Azure AD Domain Services as part of Enterprise Mobility Suite (EMS)? Do I need Azure AD Premium to use Azure AD Domain Services?](#can-i-failover-azure-ad-domain-services-to-another-region-for-a-dr-event)
* [What Azure regions is the service available in?](#can-i-get-azure-ad-domain-services-as-part-of-enterprise-mobility-suite-ems-do-i-need-azure-ad-premium-to-use-azure-ad-domain-services)

### Is Azure AD Domain Services a paid service?
Yes. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/active-directory-ds/).

### Is there a free trial for the service?
Azure AD Domain Services is included in the free trial for Azure. You can sign up for a [free one-month trial of Azure](https://azure.microsoft.com/pricing/free-trial/).

### Can I pause an Azure AD Domain Services managed domain?
No. Once you've enabled an Azure AD Domain Services managed domain, the service is available within your selected virtual network until you delete the managed domain. There's no way to pause the service. Billing continues on an hourly basis until you delete the managed domain.

### Can I failover Azure AD Domain Services to another region for a DR event?
No. Azure AD Domain Services doesn't currently provide a geo-redundant deployment model. It's limited to a single virtual network in an Azure region. If you want to utilize multiple Azure regions, you need to run your Active Directory Domain Controllers on Azure IaaS VMs. For architecture guidance, see [Extend your on-premises Active Directory domain to Azure](https://docs.microsoft.com/azure/architecture/reference-architectures/identity/adds-extend-domain).

### Can I get Azure AD Domain Services as part of Enterprise Mobility Suite (EMS)? Do I need Azure AD Premium to use Azure AD Domain Services?
No. Azure AD Domain Services is a pay-as-you-go Azure service and isn't part of EMS. Azure AD Domain Services can be used with all editions of Azure AD (Free and Premium). You're billed on an hourly basis, depending on usage.

### What Azure regions is the service available in?
Refer to the [Azure Services by region](https://azure.microsoft.com/regions/#services/) page to see a list of the Azure regions where Azure AD Domain Services is available.

## Troubleshooting

Refer to the [Troubleshooting guide](troubleshoot.md) for solutions to common issues with configuring or administering Azure AD Domain Services.

## Next steps

To learn more about Azure AD Domain Services, see [What is Azure Active Directory Domain Services?](overview.md).

To get started, see [Create and configure an Azure Active Directory Domain Services managed domain](tutorial-create-instance.md).
