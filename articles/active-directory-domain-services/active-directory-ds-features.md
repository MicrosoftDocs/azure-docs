---
title: 'Azure Active Directory Domain Services: Features | Microsoft Docs'
description: Features of Azure Active Directory Domain Services
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager: daveba
editor: curtand

ms.assetid: 8d1c3eb3-1022-4add-a919-c98cc6584af1
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/10/2019
ms.author: iainfou

---
# Azure AD Domain Services
## Features
The following features are available in Azure AD Domain Services managed domains.

* **Simple deployment experience:** You can enable Azure AD Domain Services for your Azure AD directory using just a few clicks. Your managed domain includes cloud-only user accounts and user accounts synchronized from an on-premises directory.
* **Support for domain-join:** You can easily domain-join computers in the Azure virtual network your managed domain is available in. The domain-join experience on Windows client and Server operating systems works seamlessly against domains serviced by Azure AD Domain Services. You can also use automated domain join tooling against such domains.
* **One domain instance per Azure AD directory:** You can create a single Active Directory domain for each Azure AD directory.
* **Create domains with custom names:** You can create domains with custom names (for example, 'contoso100.com') using Azure AD Domain Services. You can use either verified or unverified domain names. Optionally, you can also create a domain with the built-in domain suffix (that is, '*.onmicrosoft.com') offered by your Azure AD directory.
* **Integrated with Azure AD:** You do not need to configure or manage replication to Azure AD Domain Services. User accounts, group memberships, and user credentials (passwords) from your Azure AD directory are automatically available in Azure AD Domain Services. New users, groups, or changes to attributes from your Azure AD tenant or your on-premises directory are automatically synchronized to Azure AD Domain Services.
* **NTLM and Kerberos authentication:** With support for NTLM and Kerberos authentication, you can deploy applications that rely on Windows-Integrated Authentication.
* **Use your corporate credentials/passwords:** Passwords for users in your Azure AD tenant work with Azure AD Domain Services. Users can use their corporate credentials to domain-join machines, sign in interactively or over remote desktop, and authenticate against the managed domain.
* **LDAP bind & LDAP read support:** You can use applications that rely on LDAP binds to authenticate users in domains serviced by Azure AD Domain Services. Additionally, applications that use LDAP read operations to query user/computer attributes from the directory can also work against Azure AD Domain Services.
* **Secure LDAP (LDAPS):** You can enable access to the directory over secure LDAP (LDAPS). Secure LDAP access is available within the virtual network by default. However, you can also optionally enable secure LDAP access over the internet.
* **Group Policy:** You can use a single built-in GPO each for the users and computers containers to enforce compliance with required security policies for user accounts and domain-joined computers. You can also create your own custom GPOs and assign them to custom organizational units to [manage group policy](manage-group-policy.md).
* **Manage DNS:** Members of the 'AAD DC Administrators' group can manage DNS for your managed domain using familiar DNS administration tools such as the DNS Administration MMC snap-in.
* **Create custom Organizational Units (OUs):** Members of the 'AAD DC Administrators' group can create custom OUs in the managed domain. These users are granted full administrative privileges over custom OUs, so they can add/remove service accounts, computers, groups etc. within these custom OUs.
* **Available in many Azure global regions:** See the [Azure services by region](https://azure.microsoft.com/regions/#services/) page to know the Azure regions in which Azure AD Domain Services is available.
* **High availability:** Azure AD Domain Services offers high availability for your domain. This feature offers the guarantee of higher service uptime and resilience to failures. Built-in health monitoring offers automated remediation from failures by spinning up new instances to replace failed instances and to provide continued service for your domain.
* **AD Account lockout protection:** Users accounts are locked out for 30 minutes if five invalid passwords are used within 2 minutes. Accounts are automatically unlocked after 30 minutes.
* **Use familiar management tools:** You can use familiar Windows Server Active Directory management tools such as the Active Directory Administrative Center or Active Directory PowerShell to administer managed domains.
