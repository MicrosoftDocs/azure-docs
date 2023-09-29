---
title: Management concepts for Microsoft Entra Domain Services | Microsoft Docs
description: Learn about how to administer a Microsoft Entra Domain Services managed domain and the behavior of user accounts and passwords
services: active-directory-ds
author: justinha
manager: amycolannino

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 03/23/2023
ms.author: justinha

---

# Management concepts for user accounts, passwords, and administration in Microsoft Entra Domain Services

When you create and run a Microsoft Entra Domain Services managed domain, there are some differences in behavior compared to a traditional on-premises AD DS environment. You use the same administrative tools in Domain Services as a self-managed domain, but you can't directly access the domain controllers (DC). There's also some differences in behavior for password policies and password hashes depending on the source of the user account creation.

This conceptual article details how to administer a managed domain and the different behavior of user accounts depending on the way they're created.

## Domain management

A managed domain is a DNS namespace and matching directory. In a managed domain, the domain controllers (DCs) that contain all the resources like users and groups, credentials, and policies are part of the managed service. For redundancy, two DCs are created as part of a managed domain. You can't sign in to these DCs to perform management tasks. Instead, you create a management VM that's joined to the managed domain, then install your regular AD DS management tools. You can use the Active Directory Administrative Center or Microsoft Management Console (MMC) snap-ins like DNS or Group Policy objects, for example.

## User account creation

User accounts can be created in a managed domain in multiple ways. Most user accounts are synchronized in from Microsoft Entra ID, which can also include user account synchronized from an on-premises AD DS environment. You can also manually create accounts directly in the managed domain. Some features, like initial password synchronization or password policy, behave differently depending on how and where user accounts are created.

* The user account can be synchronized in from Microsoft Entra ID. This includes cloud-only user accounts created directly in Microsoft Entra ID, and hybrid user accounts synchronized from an on-premises AD DS environment using Microsoft Entra Connect.
    * The majority of user accounts in a managed domain are created through the synchronization process from Microsoft Entra ID.
* The user account can be manually created in a managed domain, and doesn't exist in Microsoft Entra ID.
    * If you need to create service accounts for applications that only run in the managed domain, you can manually create them in the managed domain. As synchronization is one way from Microsoft Entra ID, user accounts created in the managed domain aren't synchronized back to Microsoft Entra ID.

## Password policy

Domain Services includes a default password policy that defines settings for things like account lockout, maximum password age, and password complexity. Settings like account lockout policy apply to all users in a managed domain, regardless of how the user was created as outlined in the previous section. A few settings, like minimum password length and password complexity, only apply to users created directly in a managed domain.

You can create your own custom password policies to override the default policy in a managed domain. These custom policies can then be applied to specific groups of users as needed.

For more information on the differences in how password policies are applied depending on the source of user creation, see [Password and account lockout policies on managed domains][password-policy].

## Password hashes

To authenticate users on the managed domain, Domain Services needs password hashes in a format that's suitable for NT LAN Manager (NTLM) and Kerberos authentication. Microsoft Entra ID doesn't generate or store password hashes in the format that's required for NTLM or Kerberos authentication until you enable Domain Services for your tenant. For security reasons, Microsoft Entra ID also doesn't store any password credentials in clear-text form. Therefore, Microsoft Entra ID can't automatically generate these NTLM or Kerberos password hashes based on users' existing credentials.

For cloud-only user accounts, users must change their passwords before they can use the managed domain. This password change process causes the password hashes for Kerberos and NTLM authentication to be generated and stored in Microsoft Entra ID. The account isn't synchronized from Microsoft Entra ID to Domain Services until the password is changed.

For users synchronized from an on-premises AD DS environment using Microsoft Entra Connect, [enable synchronization of password hashes][hybrid-phs].

> [!IMPORTANT]
> Microsoft Entra Connect only synchronizes legacy password hashes when you enable Domain Services for your Microsoft Entra tenant. Legacy password hashes aren't used if you only use Microsoft Entra Connect to synchronize an on-premises AD DS environment with Microsoft Entra ID.
>
> If your legacy applications don't use NTLM authentication or LDAP simple binds, we recommend that you disable NTLM password hash synchronization for Domain Services. For more information, see [Disable weak cipher suites and NTLM credential hash synchronization][secure-domain].

Once appropriately configured, the usable password hashes are stored in the managed domain. If you delete the managed domain, any password hashes stored at that point are also deleted. Synchronized credential information in Microsoft Entra ID can't be reused if you later create another managed domain - you must reconfigure the password hash synchronization to store the password hashes again. Previously domain-joined VMs or users won't be able to immediately authenticate - Microsoft Entra ID needs to generate and store the password hashes in the new managed domain. For more information, see [Password hash sync process for Domain Services and Microsoft Entra Connect][azure-ad-password-sync].

> [!IMPORTANT]
> Microsoft Entra Connect should only be installed and configured for synchronization with on-premises AD DS environments. It's not supported to install Microsoft Entra Connect in a managed domain to synchronize objects back to Microsoft Entra ID.

## Forests and trusts

A *forest* is a logical construct used by Active Directory Domain Services (AD DS) to group one or more *domains*. The domains then store objects for user or groups, and provide authentication services.

In Domain Services, the forest only contains one domain. On-premises AD DS forests often contain many domains. In large organizations, especially after mergers and acquisitions, you may end up with multiple on-premises forests that each then contain multiple domains.

By default, a managed domain synchronizes all objects from Microsoft Entra ID, including any user accounts created in an on-premises AD DS environment. User accounts can directly authenticate against the managed domain, such as to sign in to a domain-joined VM. This approach works when the password hashes can be synchronized and users aren't using exclusive sign-in methods like smart card authentication.

In a Domain Services, you can also create a one-way forest *trust* to let users sign in from their on-premises AD DS. With this approach, the user objects and password hashes aren't synchronized to Domain Services. The user objects and credentials only exist in the on-premises AD DS. This approach lets enterprises host resources and application platforms in Azure that depend on classic authentication such LDAPS, Kerberos, or NTLM, but any authentication issues or concerns are removed.

<a name='azure-ad-ds-skus'></a>

## Domain Services SKUs

In Domain Services, the available performance and features are based on the SKU. You select a SKU when you create the managed domain, and you can switch SKUs as your business requirements change after the managed domain has been deployed. The following table outlines the available SKUs and the differences between them:

| SKU name   | Maximum object count | Backup frequency | 
|------------|----------------------|------------------|
| Standard   | Unlimited            | Every 5 days     |
| Enterprise | Unlimited            | Every 3 days     | 
| Premium    | Unlimited            | Daily            | 

Before these Domain Services SKUs, a billing model based on the number of objects (user and computer accounts) in the managed domain was used. There is no longer variable pricing based on the number of objects in the managed domain.

For more information, see the [Domain Services pricing page][pricing].

### Managed domain performance

Domain performance varies based on how authentication is implemented for an application. Additional compute resources may help improve query response time and reduce time spent in sync operations. As the SKU level increases, the compute resources available to the managed domain is increased. Monitor the performance of your applications and plan for the required resources.

If your business or application demands change and you need additional compute power for your managed domain, you can switch to a different SKU.

### Backup frequency

The backup frequency determines how often a snapshot of the managed domain is taken. Backups are an automated process managed by the Azure platform. In the event of an issue with your managed domain, Azure support can assist you in restoring from backup. As synchronization only occurs one way *from* Microsoft Entra ID, any issues in a managed domain won't impact Microsoft Entra ID or on-premises AD DS environments and functionality.

As the SKU level increases, the frequency of those backup snapshots increases. Review your business requirements and recovery point objective (RPO) to determine the required backup frequency for your managed domain. If your business or application requirements change and you need more frequent backups, you can switch to a different SKU.

## Next steps

To get started, [create a Domain Services managed domain][create-instance].

<!-- INTERNAL LINKS -->
[password-policy]: password-policy.md
[hybrid-phs]: tutorial-configure-password-hash-sync.md#enable-synchronization-of-password-hashes
[secure-domain]: secure-your-domain.md
[azure-ad-password-sync]: /azure/active-directory/hybrid/connect/how-to-connect-password-hash-synchronization#password-hash-sync-process-for-azure-ad-domain-services
[create-instance]: tutorial-create-instance.md
[tutorial-create-instance-advanced]: tutorial-create-instance-advanced.md
[concepts-forest]: ./concepts-forest-trust.md
[concepts-trust]: concepts-forest-trust.md

<!-- EXTERNAL LINKS -->
[pricing]: https://azure.microsoft.com/pricing/details/active-directory-ds/
