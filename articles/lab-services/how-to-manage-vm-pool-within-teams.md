---
title: Manage a VM pool in Azure Lab Services from Teams
description: Learn how to manage a VM pool in Azure Lab Services from Teams. 
ms.topic: how-to
ms.date: 04/25/2022
ms.custom: devdivchpfy22
---

# Manage a VM pool in Lab Services from Teams

Virtual Machine (VM) creation starts as soon as the template VM is first published.
The number of VMs equivalent to the number of users in the lab's user list will be created. VMs are also automatically assigned to students when they first access the Azure Lab Services lab.

## Publish a template and manage a VM pool

To publish the template, go to the Teams's **Azure Lab Services** window, select **Template** tab > **...** > **Publish**.

Once the lab is published and VMs are created, users will be automatically registered to the lab. Lab VMs will be assigned to users the first time they access the tab having **Azure Lab Services** App.

Team membership and lab user list are kept in sync. The lab capacity (number of VMs in the lab) is automatically updated based on the changes to the team membership. New VMs are created whenever new users are added to the team. VMs of users that are no longer part of the team are deleted. For more information, see [How to manage users within Teams](how-to-manage-user-lists-within-teams.md).

Educators can continue to access student VMs directly from the VM Pool tab. Educators can also access VMs assigned to themselves either from the **Virtual machine pool** tab or by clicking on the **My Virtual Machines** button (top-right corner of the screen).

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/how-to-manage-vm-pool-with-teams/vm-pool.png" alt-text="Screenshot of the VM pool.":::

## Next steps

See the following articles:

- As an educator, [Get started and create a Lab Services lab within Teams](how-to-get-started-create-lab-within-teams.md).
- As an educator, [create and manage schedules within Teams](how-to-create-schedules-within-teams.md).
- As an educator, [manage lab user lists from Teams](how-to-manage-user-lists-within-teams.md).
- As an admin or educator, [delete labs within Teams](how-to-delete-lab-within-teams.md)
- As student, [access a VM within Teams](how-to-access-vm-for-students-within-teams.md)
