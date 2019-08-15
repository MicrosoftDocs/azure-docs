---
title: 'How to decide if Azure AD Domain Services is right for your use-case'
description: Comparing Azure Active Directory Domain Services to DIY domain controllers
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager: daveba
editor: curtand

ms.assetid: 165249d5-e0e7-4ed1-aa26-91a05a87bdc9
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/20/2019
ms.author: iainfou
---

# How to decide if Azure AD Domain Services is right for your use-case

With Azure AD Domain Services you can deploy your workloads in Azure Infrastructure Services, without having to worry about maintaining identity infrastructure in Azure. This managed service is different from a typical Windows Server Active Directory deployment that you deploy and administer on your own. The service is easy to deploy and delivers automated health monitoring and remediation. We are constantly evolving the service to add support for common deployment scenarios.

To decide whether to use Azure AD Domain Services we recommend the following reading material:

* See the list of [features offered by Azure AD Domain Services](active-directory-ds-features.md).
* Review common [deployment scenarios for Azure AD Domain Services](scenarios.md).
* Finally, [compare Azure AD Domain Services to a do-it-yourself AD option](comparison.md#compare-azure-ad-domain-services-to-diy-ad-domain-in-azure).

## Compare Azure AD Domain Services to DIY AD domain in Azure

The following table helps you decide between using Azure AD Domain Services and managing your own AD infrastructure in Azure.

| **Feature** | **Azure AD Domain Services** | **'Do-it-yourself' AD in Azure VMs** |
| --- |:---:|:---:|
| [**Managed service**](comparison.md#managed-service) |**&#x2713;** |**&#x2715;** |
| [**Secure deployments**](comparison.md#secure-deployments) |**&#x2713;** |Administrator needs to secure the deployment. |
| [**DNS server**](comparison.md#dns-server) |**&#x2713;** (managed service) |**&#x2713;** |
| [**Domain or Enterprise administrator privileges**](comparison.md#domain-or-enterprise-administrator-privileges) |**&#x2715;** |**&#x2713;** |
| [**Domain join**](comparison.md#domain-join) |**&#x2713;** |**&#x2713;** |
| [**Domain authentication using NTLM and Kerberos**](comparison.md#domain-authentication-using-ntlm-and-kerberos) |**&#x2713;** |**&#x2713;** |
| [**Kerberos constrained delegation**](comparison.md#kerberos-constrained-delegation)|resource-based|resource-based & account-based|
| [**Custom OU structure**](comparison.md#custom-ou-structure) |**&#x2713;** |**&#x2713;** |
| [**Schema extensions**](comparison.md#schema-extensions) |**&#x2715;** |**&#x2713;** |
| [**AD domain/forest trusts**](comparison.md#ad-domain-or-forest-trusts) |**&#x2715;** |**&#x2713;** |
| [**LDAP read**](comparison.md#ldap-read) |**&#x2713;** |**&#x2713;** |
| [**Secure LDAP (LDAPS)**](comparison.md#secure-ldap) |**&#x2713;** |**&#x2713;** |
| [**LDAP write**](comparison.md#ldap-write) |**&#x2715;** |**&#x2713;** |
| [**Group Policy**](comparison.md#group-policy) |**&#x2713;** |**&#x2713;** |
| [**Geo-distributed deployments**](comparison.md#geo-dispersed-deployments) |**&#x2715;** |**&#x2713;** |

#### Managed service

Azure AD Domain Services domains are managed by Microsoft. You do not have to worry about patching, updates, monitoring, backups, and ensuring availability of your domain. These management tasks are offered as a service by Microsoft Azure for your managed domains.

#### Secure deployments

The managed domain is securely locked down as per Microsoft’s security recommendations for AD deployments. These recommendations stem from the AD product team's decades of experience engineering and supporting AD deployments. For do-it-yourself deployments, you need to take specific deployment steps to lock down/secure your deployment.

#### DNS server

An Azure AD Domain Services managed domain includes managed DNS services. Members of the 'AAD DC Administrators' group can manage DNS on the managed domain. Members of this group are given full DNS Administration privileges for the managed domain. DNS management can be performed using the 'DNS Administration console' included in the Remote Server Administration Tools (RSAT) package.
[More information](manage-dns.md)

#### Domain or Enterprise Administrator privileges

These elevated privileges are not offered on an AAD-DS managed domain. Applications that require these elevated privileges cannot be deployed against AAD-DS managed domains. A smaller subset of administrative privileges is available to members of the delegated administration group called ‘AAD DC Administrators’. These privileges include privileges to configure DNS, configure group policy, gain administrator privileges on domain-joined machines etc.

#### Domain join

You can join virtual machines to the managed domain similar to how you join computers to an AD domain.

#### Domain authentication using NTLM and Kerberos

With Azure AD Domain Services, you can use your corporate credentials to authenticate with the managed domain. Credentials are kept in sync with your Azure AD tenant. For synced tenants, Azure AD Connect ensures that changes to credentials made on-premises are synchronized to Azure AD. With a do-it-yourself domain setup, you may need to set up an AD domain trust with your on-premises AD for users to authenticate with their corporate credentials. Alternately, you may need to set up AD replication to ensure that user passwords synchronize to your Azure domain controller virtual machines.

#### Kerberos constrained delegation

You do not have 'Domain Administrator' privileges on an Active Directory Domain Services managed domain. Therefore, you cannot configure account-based (traditional) Kerberos constrained delegation. However, you can configure the more secure resource-based constrained delegation.
[More information](deploy-kcd.md)

#### Custom OU structure

Members of the 'AAD DC Administrators' group can create custom OUs within the managed domain. Users who create custom OUs are granted full administrative privileges over the OU.
[More information](create-ou.md)

#### Schema extensions

You cannot extend the base schema of an Azure AD Domain Services managed domain. Therefore, applications that rely on extensions to AD schema (for example, new attributes under the user object) cannot be lifted and shifted to AAD-DS domains.

#### AD Domain or Forest Trusts

Managed domains cannot be configured to set up trust relationships (inbound/outbound) with other domains. Therefore, resource forest deployment scenarios cannot use Azure AD Domain Services. Similarly, deployments where you prefer not to synchronize passwords to Azure AD cannot use Azure AD Domain Services.

#### LDAP Read

The managed domain supports LDAP read workloads. Therefore you can deploy applications that perform LDAP read operations against the managed domain.

#### Secure LDAP

You can configure Azure AD Domain Services to provide secure LDAP access to your managed domain, including over the internet.
[More information](configure-ldaps.md)

#### LDAP Write

The managed domain is read-only for user objects. Therefore, applications that perform LDAP write operations against attributes of the user object do not work in a managed domain. Additionally, user passwords cannot be changed from within the managed domain. Another example would be modification of group memberships or group attributes within the managed domain, which is not permitted. However, any changes to user attributes or passwords made in Azure AD (via PowerShell/Azure portal) or on-premises AD are synchronized to the AAD-DS managed domain.

#### Group policy

There is a built-in GPO each for the "AADDC Computers" and "AADDC Users" containers. You can customize these built-in GPOs to configure group policy. Members of the 'AAD DC Administrators' group can also create custom GPOs and link them to existing OUs (including custom OUs).
[More information](manage-group-policy.md)

#### Geo-dispersed deployments

Azure AD Domain Services managed domains are available in a single virtual network in Azure. For scenarios that require domain controllers to be available in multiple Azure regions across the world, setting up domain controllers in Azure IaaS VMs might be the better alternative.

## 'Do-it-yourself' (DIY) AD deployment options

You may have deployment use-cases where you need some of the capabilities offered by a Windows Server AD installation. In these cases, consider one of the following do-it-yourself (DIY) options:

* **Standalone cloud domain:** You can set up a standalone ‘cloud domain’ using Azure virtual machines that have been configured as domain controllers. This infrastructure does not integrate with your on-premises AD environment. This option would require a different set of ‘cloud credentials’ to login/administer VMs in the cloud.
* **Resource forest deployment:** You can set up a domain in the resource forest topology, using Azure virtual machines configured as domain controllers. Next, you can configure an AD trust relationship with your on-premises AD environment. You can domain-join computers (Azure VMs) to this resource forest in the cloud. User authentication happens over either a VPN/ExpressRoute connection to your on-premises directory.
* **Extend your on-premises domain to Azure:** You can connect an Azure virtual network to your on-premises network using a VPN/ExpressRoute connection. This setup enables Azure VMs to be joined to your on-premises AD. Another alternative is to promote replica domain controllers of your on-premises domain in Azure as a VM. You can then set it up to replicate over a VPN/ExpressRoute connection to your on-premises directory. This deployment mode effectively extends your on-premises domain to Azure.

> [!NOTE]
> You may determine that a DIY option is better suited for your deployment use-cases. Consider [sharing feedback](contact-us.md) to help us understand what features would help you chose Azure AD Domain Services in the future. This feedback helps us evolve the service to better suit your deployment needs and use-cases.
>
>

We have published [guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](/windows-server/identity/ad-ds/introduction-to-active-directory-domain-services-ad-ds-virtualization-level-100) to help make DIY installations easier.

## Related Content

* [Features - Azure AD Domain Services](active-directory-ds-features.md)
* [Deployment scenarios - Azure AD Domain Services](scenarios.md)
* [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](/windows-server/identity/ad-ds/introduction-to-active-directory-domain-services-ad-ds-virtualization-level-100)
