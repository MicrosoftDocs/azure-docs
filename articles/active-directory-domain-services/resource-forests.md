---
title: Azure AD Domain Services resource forests overview | Microsoft Docs
description: Learn about user forests and resource forests for an Azure Active Directory Domain Services managed domain and how to decide the best forest type for your environment.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 11/14/2019
ms.author: iainfou
---

# Azure Active Directory Domain Services resource forests

## What are Active Directory forests?

A *forest* is a logical construct used by Active Directory Domain Services to group one or more domains. In Azure AD DS, the forest only contains the one domain.

## Azure AD DS forest behavior

By default, an Azure AD DS managed domain is created as a *User* forest. This type of forest synchronizes all objects from Azure AD, including any user accounts created in an on-premises AD DS environment. User accounts can authenticate against the Azure AD DS managed domain, such as to sign in to a domain-joined VM. A user forest is the most common type of managed domain you create.

A resource forest only synchronizes objects from Azure AD. User accounts created in an on-premises AD DS environment aren't synchronized. However, even those synchronized Azure AD user accounts can't be authenticated by the Azure AD DS managed domain. A resource forest is for environments where you only want to run applications and services, and don't need user authentication.

## SKU differences

Resource forests can only be created in the *Enterprise* or *Premium* SKUs. You can change SKUs after the Azure AD DS managed domain is created, but you can't change the forest type. For more information, see [Azure AD DS SKU types and features][skus].

## Scope synchronization for resource forests

When you create a resource forest, it's recommended to configure scoped group synchronization from Azure AD since you likely don't need all users and groups to become part of the Azure AD DS managed domain. For more information, see [Create and configure an Azure Active Directory Domain Services instance with advanced configuration options][tutorial-create-instance-advanced].

## Next steps

To get started, [create an Azure AD DS managed domain][create-instance].

<!-- INTERNAL LINKS -->
[azure-ad-password-sync]: ../active-directory/hybrid/how-to-connect-password-hash-synchronization.md#password-hash-sync-process-for-azure-ad-domain-services
[create-instance]: tutorial-create-instance.md
[tutorial-create-instance-advanced]: tutorial-create-instance-advanced.md
