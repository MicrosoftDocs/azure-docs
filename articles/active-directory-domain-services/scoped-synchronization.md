---
title: Scoped synchronization for Azure AD Domain Services | Microsoft Docs
description: Learn how to use the Azure portal to configure scoped synchronization from Azure AD to an Azure Active Directory Domain Services managed domain
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: 9389cf0f-0036-4b17-95da-80838edd2225
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 03/22/2023
ms.author: justinha 
---
# Configure scoped synchronization from Azure AD to Azure Active Directory Domain Services using the Azure portal

To provide authentication services, Azure Active Directory Domain Services (Azure AD DS) synchronizes users and groups from Azure AD. In a hybrid environment, users and groups from an on-premises Active Directory Domain Services (AD DS) environment can be first synchronized to Azure AD using Azure AD Connect, and then synchronized to an Azure AD DS managed domain.

By default, all users and groups from an Azure AD directory are synchronized to a managed domain. If only some users need to use Azure AD DS, you can instead choose to synchronize only groups of users. You can filter synchronization for groups on-premises, cloud only, or both. 

This article shows you how to configure scoped synchronization and then change or disable the set of scoped users using the Azure portal. You can also [complete these steps using PowerShell][scoped-sync-powershell].

:::image type="content" border="true" source="./media/scoped-synchronization/filter.png" alt-text="Screenshot of group filter option.":::

## Before you begin

To complete this article, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, complete the tutorial to [create and configure an Azure Active Directory Domain Services managed domain][tutorial-create-instance].
* You need [Application Administrator](../active-directory/roles/permissions-reference.md#application-administrator) and [Groups Administrator](../active-directory/roles/permissions-reference.md#groups-administrator) Azure AD roles in your tenant to change the Azure AD DS synchronization scope.

## Scoped synchronization overview

By default, all users and groups from an Azure AD directory are synchronized to a managed domain. You can scope synchronization to only user accounts that were created in Azure AD, or synchronize all users.  

If only a few groups of users need to access the managed domain, you can select **Filter by group entitlement** to synchronize only those groups. This scoped synchronization is only group-based. When you configure group-based scoped synchronization, only the user accounts that belong to the groups you specify are synchronized to the managed domain. Nested groups aren't synchronized; only the groups you specify get synchronized.

You can change the synchronization scope before or after you create the managed domain. The scope of synchronization is defined by a service principal with the application identifier 2565bd9d-da50-47d4-8b85-4c97f669dc36. To prevent scope loss, don't delete or change the service principal. If it is accidentally deleted, the synchronization scope can't be recovered. 

Keep in mind the following caveats if you change the synchronization scope:

- A full synchronization occurs.
- Objects that are no longer required in the managed domain are deleted. New objects are created in the managed domain.

To learn more about the synchronization process, see [Understand synchronization in Azure AD Domain Services][concepts-sync].

## Enable scoped synchronization

To enable scoped synchronization in the Azure portal, complete the following steps:

1. In the Azure portal, search for and select **Azure AD Domain Services**. Choose your managed domain, such as *aaddscontoso.com*.
1. Select **Synchronization** from the menu on the left-hand side.
1. For *Synchronization scope*, select **All** or **Cloud Only**.
1. To filter synchronization for selected groups, click **Show selected groups**, choose whether to synchronize cloud-only groups, on-premises groups, or both. For example, the following screenshot shows how to synchronize only three groups that were created in Azure AD. Only users who belong to those groups will have their accounts synchronized to Azure AD DS.  

   :::image type="content"  source="media/scoped-synchronization/cloud-only-groups.png" alt-text="Screenshot that shows filter by cloud-only groups." :::

1. To add groups, click **Add groups**, then search for and choose the groups to add.
1. When all changes are made, select **Save synchronization scope**.

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take some time to complete.

## Modify scoped synchronization

To modify the list of groups whose users should be synchronized to the managed domain, complete the following steps:

1. In the Azure portal, search for and select **Azure AD Domain Services**. Choose your managed domain, such as *aaddscontoso.com*.
1. Select **Synchronization** from the menu on the left-hand side.
1. To add a group, choose **+ Add groups** at the top, then choose the groups to add.
1. To remove a group from the synchronization scope, select it from the list of currently synchronized groups and choose **Remove groups**.
1. When all changes are made, select **Save synchronization scope**.

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take some time to complete.

## Disable scoped synchronization

To disable group-based scoped synchronization for a managed domain, complete the following steps:

1. In the Azure portal, search for and select **Azure AD Domain Services**. Choose your managed domain, such as *aaddscontoso.com*.
1. Select **Synchronization** from the menu on the left-hand side.
1. Clear the check box for **Show selected groups**, and click **Save synchronization scope**.

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take some time to complete.

## Next steps

To learn more about the synchronization process, see [Understand synchronization in Azure AD Domain Services][concepts-sync].

<!-- INTERNAL LINKS -->
[scoped-sync-powershell]: powershell-scoped-synchronization.md
[concepts-sync]: synchronization.md
[tutorial-create-instance]: tutorial-create-instance.md
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
