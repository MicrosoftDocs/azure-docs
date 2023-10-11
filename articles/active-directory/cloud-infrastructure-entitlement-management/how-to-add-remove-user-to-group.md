---
title: Add or remove a user in Microsoft Entra Permissions Management through the Microsoft Entra admin center
description: How to add or remove a user in Microsoft Entra Permissions Management through the Microsoft Enter admin center.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 09/14/2023
ms.author: jfields
---

# Add or remove a user in Microsoft Entra Permissions Management

This article describes how you can add or remove a new user for a group in Permissions Management. 

> [!NOTE] 
> Permissions Management entitlements work through group-based access. To add a new user, you must add a user to a group through Microsoft Entra ID.

## Add a user

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/#home) as a Global Administrator.
1. Browse to **Microsoft Entra ID** > **Go to Microsoft Entra ID**. 
1. From the navigation pane, select the **Groups** drop-down menu, then **All groups**.
1. Select the group name for the group you want to add the user to.
1. From the group's **Manage** menu, click **Members**.
1. Click **+ Add members**, then search for the user you want to add from the list.
    > [!NOTE]
    > In order to add a user to a group, you must be the group owner. If you're not the owner of the           
      selected group, please reach out to the group owner. If you don't know who the owner of the group is, 
      select **Owners** under the group's **Manage** menu.
7. Click **Select**. Your user has been added. 
8. Click the **Refresh** button to refresh your screen and view the user you've added.


## Remove a user

1. Sign in to the Microsoft [Microsoft Entra admin center](https://entra.microsoft.com/#home) as a Global Administrator. 
1. Browse to **Microsoft Entra ID** > **Go to Microsoft Entra ID**. 
1. From the navigation pane, select the **Groups** drop-down menu, then **All groups**.
1. Select the group name for the group you want to remove the user from.
1. From the groups **Manage** menu, click **Members**.
1. Search for the user you want to remove from the list, then check the box next to their name.
    > [!NOTE]
    > In order to remove a user from a group, you must be the group owner. If you're not the owner of the 
    selected group, please reach out to the group owner. If you don't know who the owner of the group is, 
    select **Owners** under the group's **Manage** menu.
7. Click **X Remove**, then click **Yes**. The user is removed from the group.


## Next steps

- For more information on managing users and groups, see [Manage users and groups with the User management dashboard](ui-user-management.md).
- For more information on setting group permissions, see [Select group-based permissions settings](how-to-create-group-based-permissions.md).
