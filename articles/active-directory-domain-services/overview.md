---
title: Overview of Azure Active Directory Domain Services | Microsoft Docs
description: In this overview, learn what Azure Active Directory Domain Services provides and how to use it in your organization to provide identity services to applications and services in the cloud.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: overview
ms.date: 08/14/2020
ms.author: iainfou

ms.custom: contperfq1

#Customer intent: As an IT administrator or decision maker, I want to understand what Azure AD DS is and how it can benefit my organization.
---

# What is Azure Active Directory Domain Services?

Azure Active Directory Domain Services (AD DS) provides managed domain services such as domain join, group policy, lightweight directory access protocol (LDAP), and Kerberos / NTLM authentication. You use these domain services without the need to deploy, manage, and patch domain controllers (DCs) in the cloud.

An Azure AD DS managed domain lets you run legacy applications in the cloud that can't use modern authentication methods, or where you don't want directory lookups to always go back to an on-premises AD DS environment. You can lift and shift those legacy applications from your on-premises environment into a managed domain, without needing to manage the AD DS environment in the cloud.

Azure AD DS integrates with your existing Azure AD tenant. This integration lets users sign in to service and applications connected to the managed domain using their existing credentials. You can also use existing groups and user accounts to secure access to resources. These features provide a smoother lift-and-shift of on-premises resources to Azure.

> [!div class="nextstepaction"]
> [To get started, create an Azure AD DS managed domain using the Azure portal][tutorial-create]

## How does Azure AD DS work?

When you create an Azure AD DS managed domain, you define a unique namespace. This namespace is the domain name, such as *aaddscontoso.com*. Two Windows Server domain controllers (DCs) are then deployed into your selected Azure region. This deployment of DCs is known as a replica set.

You don't need to manage, configure, or update these DCs. The Azure platform handles the DCs as part of the managed domain, including backups.

A managed domain is configured to perform a one-way synchronization from Azure AD to provide access to a central set of users, groups, and credentials. You can create resources directly in the managed domain, but they aren't synchronized back to Azure AD. Applications, services, and VMs in Azure that connect to the managed domain can then use common AD DS features such as domain join, group policy, LDAP, and Kerberos / NTLM authentication.

In a hybrid environment with an on-premises AD DS environment, [Azure AD Connect][azure-ad-connect] synchronizes identity information with Azure AD, which is then synchronized to the managed domain.

![Synchronization in Azure AD Domain Services with Azure AD and on-premises AD DS using AD Connect](./media/active-directory-domain-services-design-guide/sync-topology.png)

Azure AD DS replicates identity information from Azure AD, so it works with Azure AD tenants that are cloud-only, or synchronized with an on-premises (AD DS environment. The same set of Azure AD DS features exists for both environments.

* If you have an existing on-premises AD DS environment, you can synchronize user account information to provide a consistent identity for users. To learn more, see [How objects and credentials are synchronized in a managed domain][synchronization].
* For cloud-only environments, you don't need a traditional on-premises AD DS environment to use the centralized identity services of Azure AD DS.

You can expand a managed domain to have more than one replica set per Azure AD tenant. Replica sets can be added to any peered virtual network in any Azure region that supports Azure AD DS. Additional replica sets in different Azure regions provide geographical disaster recovery for legacy applications if an Azure region goes offline. Replica sets are currently in preview. For more information, see [Replica sets concepts and features for managed domains][concepts-replica-sets].

The following video provides an overview of how Azure AD DS integrates with your applications and workloads to provide identity services in the cloud:

<br />

>[!VIDEO https://www.youtube.com/embed/T1Nd9APNceQ]

To see Azure AD DS deployment scenarios in action, you can explore the following examples:

* [Azure AD DS for hybrid organizations](scenarios.md#azure-ad-ds-for-hybrid-organizations)
* [Azure AD DS for cloud-only organizations](scenarios.md#azure-ad-ds-for-cloud-only-organizations)

## Azure AD DS features and benefits

To provide identity services to applications and VMs in the cloud, Azure AD DS is fully compatible with a traditional AD DS environment for operations such as domain-join, secure LDAP (LDAPS), Group Policy, DNS management, and LDAP bind and read support. LDAP write support is available for objects created in the managed domain, but not resources synchronized from Azure AD.

To learn more about your identity options, [compare Azure AD DS with Azure AD, AD DS on Azure VMs, and AD DS on-premises][compare].

The following features of Azure AD DS simplify deployment and management operations:

* **Simplified deployment experience:** Azure AD DS is enabled for your Azure AD tenant using a single wizard in the Azure portal.
* **Integrated with Azure AD:** User accounts, group memberships, and credentials are automatically available from your Azure AD tenant. New users, groups, or changes to attributes from your Azure AD tenant or your on-premises AD DS environment are automatically synchronized to Azure AD DS.
    * Accounts in external directories linked to your Azure AD aren't available in Azure AD DS. Credentials aren't available for those external directories, so can't be synchronized into a managed domain.
* **Use your corporate credentials/passwords:** Passwords for users in Azure AD DS are the same as in your Azure AD tenant. Users can use their corporate credentials to domain-join machines, sign in interactively or over remote desktop, and authenticate against the managed domain.
* **NTLM and Kerberos authentication:** With support for NTLM and Kerberos authentication, you can deploy applications that rely on Windows-integrated authentication.
* **High availability:** Azure AD DS includes multiple domain controllers, which provide high availability for your managed domain. This high availability guarantees service uptime and resilience to failures.
    * In regions that support [Azure Availability Zones][availability-zones], these domain controllers are also distributed across zones for additional resiliency.
    * [Replica sets][concepts-replica-sets] can also be used to provide geographical disaster recovery for legacy applications if an Azure region goes offline.

Some key aspects of a managed domain include the following:

* The managed domain is a stand-alone domain. It isn't an extension of an on-premises domain.
    * If needed, you can create one-way outbound forest trusts from Azure AD DS to an on-premises AD DS environment. For more information, see [Resource forest concepts and features for Azure AD DS][ forest-trusts].
* Your IT team doesn't need to manage, patch, or monitor domain controllers for this managed domain.

For hybrid environments that run AD DS on-premises, you don't need to manage AD replication to the managed domain. User accounts, group memberships, and credentials from your on-premises directory are synchronized to Azure AD via [Azure AD Connect][azure-ad-connect]. These user accounts, group memberships, and credentials are automatically available within the managed domain.

## Next steps

To learn more about Azure AD DS compares with other identity solutions and how synchronization works, see the following articles:

* [Compare Azure AD DS with Azure AD, Active Directory Domain Services on Azure VMs, and Active Directory Domain Services on-premises][compare]
* [Learn how Azure AD Domain Services synchronizes with your Azure AD directory][synchronization]
* To learn how to administrator a managed domain, see [management concepts for user accounts, passwords, and administration in Azure AD DS][administration-concepts].

To get started, [create a managed domain using the Azure portal][tutorial-create].

<!-- INTERNAL LINKS -->
[compare]: compare-identity-solutions.md
[synchronization]: synchronization.md
[tutorial-create]: tutorial-create-instance.md
[azure-ad-connect]: ../active-directory/hybrid/whatis-azure-ad-connect.md
[password-hash-sync]: ../active-directory/hybrid/how-to-connect-password-hash-synchronization.md
[availability-zones]: ../availability-zones/az-overview.md
[forest-trusts]: concepts-resource-forest.md
[administration-concepts]: administration-concepts.md
[synchronization]: synchronization.md
[concepts-replica-sets]: concepts-replica-sets.md
