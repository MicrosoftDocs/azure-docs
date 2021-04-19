---
title: Identify a group to manage in Privileged Identity Management - Azure AD | Microsoft Docs
description: Learn how to onboard role-assignable groups to manage as privileged access groups in Privileged Identity Management (PIM).
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
ms.date: 08/03/2020
ms.author: curtand
ms.collection: M365-identity-device-management
---

# Bring privileged access groups (preview) into Privileged Identity Management

In Azure Active Directory (Azure AD), you can assign Azure AD built-in roles to cloud groups to simplify how you manage role assignments. To protect Azure AD roles and to secure access, you can now use Privileged Identity Management (PIM) to manage just-in-time access for members or owners of these groups. To manage an Azure AD role-assignable group as a privileged access group in Privileged Identity Management, you must bring it under management in PIM.

## Identify groups to manage

You can create a role-assignable group in Azure AD as described in [Create a role-assignable group in Azure Active Directory](../roles/groups-create-eligible.md). You have be an owner of the group to bring it under management with Privileged Identity Management.

1. [Sign in to Azure AD](https://aad.portal.azure.com) with Privileged Role Administrator role permissions.
1. Select **Groups** and then select the role-assignable group you want to manage in PIM. You can search and filter the list.

    ![find a role-assignable group to manage in PIM](./media/groups-discover-groups/groups-list-in-azure-ad.png)

1. Open the group and select **Privileged access (Preview)**.

    ![Open the Privileged Identity Management experience](./media/groups-discover-groups/groups-discover-groups.png)

1. Start managing assignments in PIM.

    ![Manage assignments in Privileged Identity Management](./media/groups-discover-groups/groups-bring-under-management.png)

> [!NOTE]
> Once a privileged access group is managed, it can't be taken out of management. This prevents another resource administrator from removing Privileged Identity Management settings.
>

> [!IMPORTANT]
> If a privileged access group is deleted from Azure Active Directory, it may take up to 24 hours for the group to be removed from the Privileged access groups (Preview) blade. 
>


## Next steps

- [Configure privileged access group assignments in Privileged Identity Management](pim-resource-roles-configure-role-settings.md)
- [Assign privileged access groups in Privileged Identity Management](pim-resource-roles-assign-roles.md)
