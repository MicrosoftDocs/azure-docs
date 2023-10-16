---
title: Overview of Microsoft Entra Domain Services | Microsoft Docs
description: In this overview, learn what Microsoft Entra Domain Services provides and how to use it in your organization to provide identity services to applications and services in the cloud.
services: active-directory-ds
author: justinha
manager: amycolannino

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: overview
ms.date: 09/15/2023
ms.author: justinha

ms.custom: contperf-fy21q1

#Customer intent: As an IT administrator or decision maker, I want to understand what Domain Services is and how it can benefit my organization.
---

# What is Microsoft Entra Domain Services?

Microsoft Entra Domain Services provides managed domain services such as domain join, group policy, lightweight directory access protocol (LDAP), and Kerberos/NTLM authentication. You use these domain services without the need to deploy, manage, and patch domain controllers (DCs) in the cloud.

A Domain Services managed domain lets you run legacy applications in the cloud that can't use modern authentication methods, or where you don't want directory lookups to always go back to an on-premises AD DS environment. You can lift and shift those legacy applications from your on-premises environment into a managed domain, without needing to manage the AD DS environment in the cloud.

Domain Services integrates with your existing Microsoft Entra tenant. This integration lets users sign in to services and applications connected to the managed domain using their existing credentials. You can also use existing groups and user accounts to secure access to resources. These features provide a smoother lift-and-shift of on-premises resources to Azure.

> [!div class="nextstepaction"]
> [To get started, create a Domain Services managed domain using the Microsoft Entra admin center][tutorial-create]

Take a look at our short video to learn more about Domain Services.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4LblD]

<a name='how-does-azure-ad-ds-work'></a>

## How does Domain Services work?

When you create a Domain Services managed domain, you define a unique namespace. This namespace is the domain name, such as *aaddscontoso.com*. Two Windows Server domain controllers (DCs) are then deployed into your selected Azure region. This deployment of DCs is known as a replica set.

You don't need to manage, configure, or update these DCs. The Azure platform handles the DCs as part of the managed domain, including backups and encryption at rest using Azure Disk Encryption.

A managed domain is configured to perform a one-way synchronization from Microsoft Entra ID to provide access to a central set of users, groups, and credentials. You can create resources directly in the managed domain, but they aren't synchronized back to Microsoft Entra ID. Applications, services, and VMs in Azure that connect to the managed domain can then use common AD DS features such as domain join, group policy, LDAP, and Kerberos/NTLM authentication.

In a hybrid environment with an on-premises AD DS environment, [Microsoft Entra Connect][azure-ad-connect] synchronizes identity information with Microsoft Entra ID, which is then synchronized to the managed domain.

![Synchronization in Microsoft Entra Domain Services with Microsoft Entra ID and on-premises AD DS using AD Connect](./media/active-directory-domain-services-design-guide/sync-topology.png)

Domain Services replicates identity information from Microsoft Entra ID, so it works with Microsoft Entra tenants that are cloud-only, or synchronized with an on-premises AD DS environment. The same set of Domain Services features exists for both environments.

* If you have an existing on-premises AD DS environment, you can synchronize user account information to provide a consistent identity for users. To learn more, see [How objects and credentials are synchronized in a managed domain][synchronization].
* For cloud-only environments, you don't need a traditional on-premises AD DS environment to use the centralized identity services of Domain Services.

You can expand a managed domain to have more than one replica set per Microsoft Entra tenant. Replica sets can be added to any peered virtual network in any Azure region that supports Domain Services. By adding replica sets in different Azure regions, you can provide geographical disaster recovery for legacy applications if an Azure region goes offline. For more information, see [Replica sets concepts and features for managed domains][concepts-replica-sets].

Take a look at this video about how Domain Services integrates with your applications and workloads to provide identity services in the cloud:

<br />

>[!VIDEO https://www.youtube.com/embed/T1Nd9APNceQ]

To see Domain Services deployment scenarios in action, you can explore the following examples:

* [Domain Services for hybrid organizations](scenarios.md#azure-ad-ds-for-hybrid-organizations)
* [Domain Services for cloud-only organizations](scenarios.md#azure-ad-ds-for-cloud-only-organizations)

<a name='azure-ad-ds-features-and-benefits'></a>

## Domain Services features and benefits

To provide identity services to applications and VMs in the cloud, Domain Services is fully compatible with a traditional AD DS environment for operations such as domain-join, secure LDAP (LDAPS), Group Policy, DNS management, and LDAP bind and read support. LDAP write support is available for objects created in the managed domain, but not resources synchronized from Microsoft Entra ID.

To learn more about your identity options, [compare Domain Services with Microsoft Entra ID, AD DS on Azure VMs, and AD DS on-premises][compare].

The following features of Domain Services simplify deployment and management operations:

* **Simplified deployment experience:** Domain Services is enabled for your Microsoft Entra tenant using a single wizard in the Microsoft Entra admin center.
* **Integrated with Microsoft Entra ID:** User accounts, group memberships, and credentials are automatically available from your Microsoft Entra tenant. New users, groups, or changes to attributes from your Microsoft Entra tenant or your on-premises AD DS environment are automatically synchronized to Domain Services.
    * Accounts in external directories linked to your Microsoft Entra ID aren't available in Domain Services. Credentials aren't available for those external directories, so can't be synchronized into a managed domain.
* **Use your corporate credentials/passwords:** Passwords for users in Domain Services are the same as in your Microsoft Entra tenant. Users can use their corporate credentials to domain-join machines, sign in interactively or over remote desktop, and authenticate against the managed domain.
* **NTLM and Kerberos authentication:** With support for NTLM and Kerberos authentication, you can deploy applications that rely on Windows-integrated authentication.
* **High availability:** Domain Services includes multiple domain controllers, which provide high availability for your managed domain. This high availability guarantees service uptime and resilience to failures.
    * In regions that support [Azure Availability Zones][availability-zones], these domain controllers are also distributed across zones for additional resiliency.
    * [Replica sets][concepts-replica-sets] can also be used to provide geographical disaster recovery for legacy applications if an Azure region goes offline.

Some key aspects of a managed domain include the following:

* The managed domain is a stand-alone domain. It isn't an extension of an on-premises domain.
    * If needed, you can create one-way outbound forest trusts from Domain Services to an on-premises AD DS environment. For more information, see [Forest concepts and features for Domain Services][forest-trusts].
* Your IT team doesn't need to manage, patch, or monitor domain controllers for this managed domain.

For hybrid environments that run AD DS on-premises, you don't need to manage AD replication to the managed domain. User accounts, group memberships, and credentials from your on-premises directory are synchronized to Microsoft Entra ID via [Microsoft Entra Connect][azure-ad-connect]. These user accounts, group memberships, and credentials are automatically available within the managed domain.

## Next steps

To learn more about Domain Services compares with other identity solutions and how synchronization works, see the following articles:

* [Compare Domain Services with Microsoft Entra ID, Active Directory Domain Services on Azure VMs, and Active Directory Domain Services on-premises][compare]
* [Learn how Microsoft Entra Domain Services synchronizes with your Microsoft Entra directory][synchronization]
* To learn how to administrator a managed domain, see [management concepts for user accounts, passwords, and administration in Domain Services][administration-concepts].

To get started, [create a managed domain using the Microsoft Entra admin center][tutorial-create].

<!-- INTERNAL LINKS -->
[compare]: compare-identity-solutions.md
[synchronization]: synchronization.md
[tutorial-create]: tutorial-create-instance.md
[azure-ad-connect]: /azure/active-directory/hybrid/connect/whatis-azure-ad-connect
[password-hash-sync]: /azure/active-directory/hybrid/connect/how-to-connect-password-hash-synchronization
[availability-zones]: /azure/reliability/availability-zones-overview
[forest-trusts]: ./concepts-forest-trust.md
[administration-concepts]: administration-concepts.md
[synchronization]: synchronization.md
[concepts-replica-sets]: concepts-replica-sets.md
