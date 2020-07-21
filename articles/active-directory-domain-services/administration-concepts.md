---
title: Management concepts for Azure AD Domain Services | Microsoft Docs
description: Learn about how to administer an Azure Active Directory Domain Services managed domain and the behavior of user accounts and passwords
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 06/05/2020
ms.author: iainfou

---

# Management concepts for user accounts, passwords, and administration in Azure Active Directory Domain Services

When you create and run an Azure Active Directory Domain Services (AD DS) managed domain, there are some differences in behavior compared to a traditional on-premises AD DS environment. You use the same administrative tools in Azure AD DS as a self-managed domain, but you can't directly access the domain controllers (DC). There's also some differences in behavior for password policies and password hashes depending on the source of the user account creation.

This conceptual article details how to administer a managed domain and the different behavior of user accounts depending on the way they're created.

## Domain management

A managed domain is a DNS namespace and matching directory. In a managed domain, the domain controllers (DCs) that contain all the resources like users and groups, credentials, and policies are part of the managed service. For redundancy, two DCs are created as part of a managed domain. You can't sign in to these DCs to perform management tasks. Instead, you create a management VM that's joined to the managed domain, then install your regular AD DS management tools. You can use the Active Directory Administrative Center or Microsoft Management Console (MMC) snap-ins like DNS or Group Policy objects, for example.

## User account creation

User accounts can be created in a managed domain in multiple ways. Most user accounts are synchronized in from Azure AD, which can also include user account synchronized from an on-premises AD DS environment. You can also manually create accounts directly in the managed domain. Some features, like initial password synchronization or password policy, behave differently depending on how and where user accounts are created.

* The user account can be synchronized in from Azure AD. This includes cloud-only user accounts created directly in Azure AD, and hybrid user accounts synchronized from an on-premises AD DS environment using Azure AD Connect.
    * The majority of user accounts in a managed domain are created through the synchronization process from Azure AD.
* The user account can be manually created in a managed domain, and doesn't exist in Azure AD.
    * If you need to create service accounts for applications that only run in the managed domain, you can manually create them in the managed domain. As synchronization is one way from Azure AD, user accounts created in the managed domain aren't synchronized back to Azure AD.

## Password policy

Azure AD DS includes a default password policy that defines settings for things like account lockout, maximum password age, and password complexity. Settings like account lockout policy apply to all users in a managed domain, regardless of how the user was created as outlined in the previous section. A few settings, like minimum password length and password complexity, only apply to users created directly in a managed domain.

You can create your own custom password policies to override the default policy in a managed domain. These custom policies can then be applied to specific groups of users as needed.

For more information on the differences in how password policies are applied depending on the source of user creation, see [Password and account lockout policies on managed domains][password-policy].

## Password hashes

To authenticate users on the managed domain, Azure AD DS needs password hashes in a format that's suitable for NT LAN Manager (NTLM) and Kerberos authentication. Azure AD doesn't generate or store password hashes in the format that's required for NTLM or Kerberos authentication until you enable Azure AD DS for your tenant. For security reasons, Azure AD also doesn't store any password credentials in clear-text form. Therefore, Azure AD can't automatically generate these NTLM or Kerberos password hashes based on users' existing credentials.

For cloud-only user accounts, users must change their passwords before they can use the managed domain. This password change process causes the password hashes for Kerberos and NTLM authentication to be generated and stored in Azure AD. The account isn't synchronized from Azure AD to Azure AD DS until the password is changed.

For users synchronized from an on-premises AD DS environment using Azure AD Connect, [enable synchronization of password hashes][hybrid-phs].

> [!IMPORTANT]
> Azure AD Connect only synchronizes legacy password hashes when you enable Azure AD DS for your Azure AD tenant. Legacy password hashes aren't used if you only use Azure AD Connect to synchronize an on-premises AD DS environment with Azure AD.
>
> If your legacy applications don't use NTLM authentication or LDAP simple binds, we recommend that you disable NTLM password hash synchronization for Azure AD DS. For more information, see [Disable weak cipher suites and NTLM credential hash synchronization][secure-domain].

Once appropriately configured, the usable password hashes are stored in the managed domain. If you delete the managed domain, any password hashes stored at that point are also deleted. Synchronized credential information in Azure AD can't be reused if you later create another managed domain - you must reconfigure the password hash synchronization to store the password hashes again. Previously domain-joined VMs or users won't be able to immediately authenticate - Azure AD needs to generate and store the password hashes in the new managed domain. For more information, see [Password hash sync process for Azure AD DS and Azure AD Connect][azure-ad-password-sync].

> [!IMPORTANT]
> Azure AD Connect should only be installed and configured for synchronization with on-premises AD DS environments. It's not supported to install Azure AD Connect in a managed domain to synchronize objects back to Azure AD.

## Forests and trusts

A *forest* is a logical construct used by Active Directory Domain Services (AD DS) to group one or more *domains*. The domains then store objects for user or groups, and provide authentication services.

In Azure AD DS, the forest only contains one domain. On-premises AD DS forests often contain many domains. In large organizations, especially after mergers and acquisitions, you may end up with multiple on-premises forests that each then contain multiple domains.

By default, a managed domain is created as a *user* forest. This type of forest synchronizes all objects from Azure AD, including any user accounts created in an on-premises AD DS environment. User accounts can directly authenticate against the managed domain, such as to sign in to a domain-joined VM. A user forest works when the password hashes can be synchronized and users aren't using exclusive sign-in methods like smart card authentication.

In an Azure AD DS *resource* forest, users authenticate over a one-way forest *trust* from their on-premises AD DS. With this approach, the user objects and password hashes aren't synchronized to Azure AD DS. The user objects and credentials only exist in the on-premises AD DS. This approach lets enterprises host resources and application platforms in Azure that depend on classic authentication such LDAPS, Kerberos, or NTLM, but any authentication issues or concerns are removed. Azure AD DS resource forests are currently in preview.

For more information about forest types in Azure AD DS, see [What are resource forests?][concepts-forest] and [How do forest trusts work in Azure AD DS?][concepts-trust]

## Azure AD DS SKUs

In Azure AD DS, the available performance and features are based on the SKU. You select a SKU when you create the managed domain, and you can switch SKUs as your business requirements change after the managed domain has been deployed. The following table outlines the available SKUs and the differences between them:

| SKU name   | Maximum object count | Backup frequency | Maximum number of outbound forest trusts |
|------------|----------------------|------------------|----|
| Standard   | Unlimited            | Every 7 days     | 0  |
| Enterprise | Unlimited            | Every 3 days     | 5  |
| Premium    | Unlimited            | Daily            | 10 |

Before these Azure AD DS SKUs, a billing model based on the number of objects (user and computer accounts) in the managed domain was used. There is no longer variable pricing based on the number of objects in the managed domain.

For more information, see the [Azure AD DS pricing page][pricing].

### Managed domain performance

Domain performance varies based on how authentication is implemented for an application. Additional compute resources may help improve query response time and reduce time spent in sync operations. As the SKU level increases, the compute resources available to the managed domain is increased. Monitor the performance of your applications and plan for the required resources.

If your business or application demands change and you need additional compute power for your managed domain, you can switch to a different SKU.

### Backup frequency

The backup frequency determines how often a snapshot of the managed domain is taken. Backups are an automated process managed by the Azure platform. In the event of an issue with your managed domain, Azure support can assist you in restoring from backup. As synchronization only occurs one way *from* Azure AD, any issues in a managed domain won't impact Azure AD or on-premises AD DS environments and functionality.

As the SKU level increases, the frequency of those backup snapshots increases. Review your business requirements and recovery point objective (RPO) to determine the required backup frequency for your managed domain. If your business or application requirements change and you need more frequent backups, you can switch to a different SKU.

### Outbound forest trusts

The previous section detailed one-way outbound forest trusts from a managed domain to an on-premises AD DS environment (currently in preview). The SKU determines the maximum number of forest trusts you can create for a managed domain. Review your business and application requirements to determine how many trusts you actually need, and pick the appropriate Azure AD DS SKU. Again, if your business requirements change and you need to create additional forest trusts, you can switch to a different SKU.

## Next steps

To get started, [create an Azure AD DS managed domain][create-instance].

<!-- INTERNAL LINKS -->
[password-policy]: password-policy.md
[hybrid-phs]: tutorial-configure-password-hash-sync.md#enable-synchronization-of-password-hashes
[secure-domain]: secure-your-domain.md
[azure-ad-password-sync]: ../active-directory/hybrid/how-to-connect-password-hash-synchronization.md#password-hash-sync-process-for-azure-ad-domain-services
[create-instance]: tutorial-create-instance.md
[tutorial-create-instance-advanced]: tutorial-create-instance-advanced.md
[concepts-forest]: concepts-resource-forest.md
[concepts-trust]: concepts-forest-trust.md

<!-- EXTERNAL LINKS -->
[pricing]: https://azure.microsoft.com/pricing/details/active-directory-ds/
