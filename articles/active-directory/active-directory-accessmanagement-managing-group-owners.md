---
title: Managing  group owners in Azure Active Directory | Microsoft Docs
description: Managing  group owners and how to use these groups to manage access to a resource.
services: active-directory
documentationcenter: ''
author: curtand
manager: femila
editor: ''

ms.assetid: 44350a3c-8ea1-4da1-aaac-7fc53933dd21
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/13/2017
ms.author: curtand

ms.custom: it-pro

---
# Managing owners for a group
After a resource owner assigns access to a resource to an Azure AD group, the membership of the group is managed by the group owner. The resource owner effectively delegates the permission to assign users to the resource to the owner of the group.

## Add an owner to a group

1. In the [Azure AD admin center](https://aad.portal.azure.com), select **Users and groups**.
2. Select **All groups**, and then open the group that you want to add owners to.
3. Select **Owners**, and then select **Add owners**.
4. On the **Add owners** page, select the user that you want to add as the owner of this group, and then click or tap **Select**. 

## Remove an owner from a group

1. In the [Azure AD admin center](https://aad.portal.azure.com), select **Users and groups**.
2. Select **All groups**, and then open the group from which you want to remove owners.
3. Select **Owners**, select the owner that you want to remove from this group, and then click or tap **Select**.
4. In the open pane for the selected owner, select **Remove**.

## Additional information
These articles provide additional information on Azure Active Directory groups.

* [See existing groups](active-directory-groups-view-azure-portal.md)
* [Create a new group and adding members](active-directory-groups-create-azure-portal.md)
* [Manage settings of a group](active-directory-groups-settings-azure-portal.md)
* [Manage memberships of a group](active-directory-groups-membership-azure-portal.md)
* [Manage dynamic rules for users in a group](active-directory-groups-dynamic-membership-azure-portal.md)
