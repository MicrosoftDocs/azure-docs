---
title: Scoped synchronization for Azure AD Domain Services | Microsoft Docs
description: Learn how to use the Azure portal to configure scoped synchronization from Azure AD to an Azure Active Directory Domain Services managed domain
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 9389cf0f-0036-4b17-95da-80838edd2225
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 07/24/2020
ms.author: iainfou 
ms.custom: devx-track-azurepowershell

---
# Configure scoped synchronization from Azure AD to Azure Active Directory Domain Services using the Azure portal

To provide authentication services, Azure Active Directory Domain Services (Azure AD DS) synchronizes users and groups from Azure AD. In a hybrid environment, users and groups from an on-premises Active Directory Domain Services (AD DS) environment can be first synchronized to Azure AD using Azure AD Connect, and then synchronized to an Azure AD DS managed domain.

By default, all users and groups from an Azure AD directory are synchronized to a managed domain. If you have specific needs, you can instead choose to synchronize only a defined set of users.

This article shows you how to configure scoped synchronization and then change or disable the set of scoped users using the Azure portal. You can also [complete these steps using PowerShell][scoped-sync-powershell].

## Before you begin

To complete this article, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, complete the tutorial to [create and configure an Azure Active Directory Domain Services managed domain][tutorial-create-instance].
* You need *global administrator* privileges in your Azure AD tenant to change the Azure AD DS synchronization scope.

## Scoped synchronization overview

By default, all users and groups from an Azure AD directory are synchronized to a managed domain. If only a few users need to access the managed domain, you can synchronize only those user accounts. This scoped synchronization is group-based. When you configure group-based scoped synchronization, only the user accounts that belong to the groups you specify are synchronized to the managed domain. Nested groups aren't synchronized, only the specific groups you select.

You can change the synchronization scope when you create the managed domain, or once it's deployed. You can also now change the scope of synchronization on an existing managed domain without needing to recreate it.

To learn more about the synchronization process, see [Understand synchronization in Azure AD Domain Services][concepts-sync].

> [!WARNING]
> Changing the scope of synchronization causes the managed domain to resynchronize all data. The following considerations apply:
>
>  * When you change the synchronization scope for a managed domain, a full resynchronization occurs.
>  * Objects that are no longer required in the managed domain are deleted. New objects are created in the managed domain.

## Enable scoped synchronization

To enable scoped synchronization in the Azure portal, complete the following steps:

1. In the Azure portal, search for and select **Azure AD Domain Services**. Choose your managed domain, such as *aaddscontoso.com*.
1. Select **Synchronization** from the menu on the left-hand side.
1. For the *Synchronization type*, select **Scoped**.
1. Choose **Select groups**, then search for and choose the groups to add.
1. When all changes are made, select **Save synchronization scope**.

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take some time to complete.

## Modify scoped synchronization

To modify the list of groups whose users should be synchronized to the managed domain, complete the following steps:

1. In the Azure portal, search for and select **Azure AD Domain Services**. Choose your managed domain, such as *aaddscontoso.com*.
1. Select **Synchronization** from the menu on the left-hand side.
1. To add a group, choose **+ Select groups** at the top, then choose the groups to add.
1. To remove a group from the synchronization scope, select it from the list of currently synchronized groups and choose **Remove groups**.
1. When all changes are made, select **Save synchronization scope**.

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take some time to complete.

## Disable scoped synchronization

To disable group-based scoped synchronization for a managed domain, complete the following steps:

1. In the Azure portal, search for and select **Azure AD Domain Services**. Choose your managed domain, such as *aaddscontoso.com*.
1. Select **Synchronization** from the menu on the left-hand side.
1. Change the *Synchronization type* from **Scoped** to **All**, then select **Save synchronization scope**.

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take some time to complete.

## Next steps

To learn more about the synchronization process, see [Understand synchronization in Azure AD Domain Services][concepts-sync].

<!-- INTERNAL LINKS -->
[scoped-sync-powershell]: powershell-scoped-synchronization.md
[concepts-sync]: synchronization.md
[tutorial-create-instance]: tutorial-create-instance.md
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
