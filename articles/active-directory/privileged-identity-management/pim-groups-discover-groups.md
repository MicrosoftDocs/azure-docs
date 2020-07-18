---
title: Discover role-assignable groups to manage in PIM - Azure AD | Microsoft Docs
description: Learn how to discover role-assignable groups to manage as privileged access groups in Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 07/27/2020
ms.author: curtand
ms.collection: M365-identity-device-management
---

# Discover role-assignable groups to manage in Privileged Identity Management

Using Azure Active Directory (Azure AD) Privileged Identity Management (PIM), you can improve the protection of your Azure resources. This is helpful to organizations that already use Privileged Identity Management to protect Azure AD roles, and to management group and subscription owners who are looking to secure production resources.

When you first set up Privileged Identity Management for Azure resources, you need to discover and select the resources to protect with Privileged Identity Management. There's no limit to the number of resources that you can manage with Privileged Identity Management. However, we recommend starting with your most critical (production) resources.

## Discover resources

1. [Sign in to Azure AD](https://aad.portal.azure.com) with Privileged Role Administrator role permissions. 
1. Create a role-assignable group In Azure AD. You must be an owner of the group to discover and manage it with PIM.
1. Open **Privileged Identity Management**.
1. Select **Privileged access (preview)**.

    ![Discover groups command for first time experience](./media/pim-groups-discover-groups/groups-discover-groups.png)

1. Select **Discover groups**.
1. Search by group name.
1. Select your group and select **Manage groups" to bring it under PIM management.

    ![Discover groups with no resources listed for first time experience](./media/pim-groups-discover-groups/groups-bring-under-management.png)

    > [!NOTE]
    > Once a privileged access group is managed, it can't be unmanaged. This prevents another resource administrator from removing Privileged Identity Management settings.

1. If you see a message to confirm the onboarding of the selected resource for management, select **Yes**.

## Next steps

- [Configure privileged access group assignments in Privileged Identity Management](pim-resource-roles-configure-role-settings.md)
- [Assign privileged access groups in Privileged Identity Management](pim-resource-roles-assign-roles.md)
