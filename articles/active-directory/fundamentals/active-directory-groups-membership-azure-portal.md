---
title: Manage the groups your group belongs to in Azure AD | Microsoft Docs
description: Groups can contain other groups in Azure Active Directory. Here's how to manage those memberships.
services: active-directory
documentationcenter: ''
author: eross-msft
manager: mtillman
editor: ''
ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: quickstart
ms.date: 10/10/2017
ms.author: lizross
ms.custom: it-pro
ms.reviewer: krbain
---

# Manage to which groups a group belongs in your Azure Active Directory tenant
Groups can contain other groups in Azure Active Directory. Here's how to manage those memberships.

## How do I find the groups of which my group is a member?
1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with an account that's a global admin for the directory.
2. Select **Users and groups**.

   ![Opening users and groups image](./media/active-directory-groups-membership-azure-portal/search-user-management.png)
1. Select **All groups**.

   ![Selecting groups image](./media/active-directory-groups-membership-azure-portal/view-groups-blade.png)
1. Select a group.
2. Select **Group memberships**.

   ![Opening group memberships image](./media/active-directory-groups-membership-azure-portal/group-membership-blade.png)
1. To add your group as a member of another group, on the **Group - Group memberships** blade, select the **Add** command.
2. Select a group from the **Select Group** blade, and then select the **Select** button at the bottom of the blade. You can add your group to only one group at a time. The **User** box filters the display based on matching your entry to any part of a user or device name. No wildcard characters are accepted in that box.

   ![Add a group membership](./media/active-directory-groups-membership-azure-portal/add-group-membership.png)
8. To remove your group as a member of another group, on the **Group - Group memberships** blade, select a group.
9. Select the **Remove** command, and confirm your choice at the prompt.

   ![remove membership command](./media/active-directory-groups-membership-azure-portal/remove-group-membership.png)
10. When you finish changing group memberships for your group, select **Save**.

## Additional information
These articles provide additional information on Azure Active Directory.

* [See existing groups](active-directory-groups-view-azure-portal.md)
* [Create a new group and adding members](active-directory-groups-create-azure-portal.md)
* [Manage settings of a group](active-directory-groups-settings-azure-portal.md)
* [Manage members of a group](active-directory-groups-members-azure-portal.md)
* [Manage dynamic rules for users in a group](../users-groups-roles/groups-dynamic-membership.md)
