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
ms.date: 10/08/2019
ms.author: iainfou

---

# Management concepts for user accounts, passwords, and administration in Azure Active Directory Domain Services

When you create and run an Azure Active Directory Domain Services (AD DS) managed domain, there are some differences in behavior compared to a traditional on-premises AD DS environment. You use the same administrative tools in Azure AD DS as a self-managed domain, but you can't directly access the domain controllers (DC). There's also some differences in behavior for password policies and password hashes depending on the source of the user account creation.

This conceptual article details how to administer an Azure AD DS managed domain and the different behavior of user accounts depending on the way they're created.

## Domain management

In Azure AD DS, the domain controllers (DCs) that contain all the resources like users and groups, credentials, and policies are part of the managed service. For redundancy, two DCs are created as part of an Azure AD DS managed domain. You can't sign in to these DCs to perform management tasks. Instead, you create a management VM that's joined to the Azure AD DS managed domain, then install your regular AD DS management tools. You can use the Active Directory Administrative Center or Microsoft Management Console (MMC) snap-ins like DNS or Group Policy objects, for example.

## User account creation

User accounts can be created in Azure AD DS in multiple ways. Most user accounts are synchronized in from Azure AD, which can also include user account synchronized from an on-premises AD DS environment. You can also manually create accounts directly in Azure AD DS. Some features, like initial password synchronization or password policy, behave differently depending on how and where user accounts are created.

* The user account can be synchronized in from Azure AD. This includes cloud-only user accounts created directly in Azure AD, and hybrid user accounts synchronized from an on-premises AD DS environment using Azure AD Connect.
    * The majority of user accounts in Azure AD DS are created through the synchronization process from Azure AD.
* The user account can be manually created in an Azure AD DS managed domain, and doesn't exist in Azure AD.
    * If you need to create service accounts for applications that only run in Azure AD DS, you can manually create them in the managed domain. As synchronization is one-way from Azure AD, user accounts created in Azure AD DS aren't synchronized back to Azure AD.

## Password policy

Azure AD DS includes a default password policy that defines settings for things like account lockout, maximum password age, and password complexity. Settings like account lockout policy apply to all users in Azure AD DS, regardless of how the user was created as outlined in the previous section. A few settings, like minimum password length and password complexity, only apply to users created directly in Azure AD DS.

You can create your own custom password policies to override the default policy in Azure AD DS. These custom policies can then be applied to specific groups of users as needed.

For more information on the differences in how password policies are applied depending on the source of user creation, see [Password and account lockout policies on managed domains][password-policy].

## Password hashes

To authenticate users on the managed domain, Azure AD DS needs password hashes in a format that's suitable for NT LAN Manager (NTLM) and Kerberos authentication. Azure AD doesn't generate or store password hashes in the format that's required for NTLM or Kerberos authentication until you enable Azure AD DS for your tenant. For security reasons, Azure AD also doesn't store any password credentials in clear-text form. Therefore, Azure AD can't automatically generate these NTLM or Kerberos password hashes based on users' existing credentials.

For cloud-only user accounts, users must change their passwords before they can use Azure AD DS. This password change process causes the password hashes for Kerberos and NTLM authentication to be generated and stored in Azure AD.

For users synchronized from an on-premises AD DS environment using Azure AD Connect, [enable synchronization of password hashes][hybrid-phs].

> [!IMPORTANT]
> Azure AD Connect only synchronizes legacy password hashes when you enable Azure AD DS for your Azure AD tenant. Legacy password hashes aren't used if you only use Azure AD Connect to synchronize an on-premises AD DS environment with Azure AD.
>
> If your legacy applications don't use NTLM authentication or LDAP simple binds, we recommend that you disable NTLM password hash synchronization for Azure AD DS. For more information, see [Disable weak cipher suites and NTLM credential hash synchronization][secure-domain].

Once appropriately configured, the usable password hashes are stored in the Azure AD DS managed domain. If you delete the Azure AD DS managed domain, any password hashes stored at that point are also deleted. Synchronized credential information in Azure AD can't be reused if you later create an Azure AD DS managed domain - you must reconfigure the password hash synchronization to store the password hashes again. Previously domain-joined VMs or users won't be able to immediately authenticate - Azure AD needs to generate and store the password hashes in the new Azure AD DS managed domain. For more information, see [Password hash sync process for Azure AD DS and Azure AD Connect][azure-ad-password-sync].

## Next steps

To get started, [create an Azure AD DS managed domain][create-instance].

<!-- INTERNAL LINKS -->
[password-policy]: password-policy.md
[hybrid-phs]: tutorial-configure-password-hash-sync.md#enable-synchronization-of-password-hashes
[secure-domain]: secure-your-domain.md
[azure-ad-password-sync]: ../active-directory/hybrid/how-to-connect-password-hash-synchronization.md#password-hash-sync-process-for-azure-ad-domain-services
[create-instance]: tutorial-create-instance.md
