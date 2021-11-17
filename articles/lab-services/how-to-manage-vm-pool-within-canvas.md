---
title: Manage a VM pool in Azure Lab Services from Canvas
description: Learn how to manage a VM pool in Azure Lab Services from Canvas. 
ms.topic: how-to
ms.date: 11/08/2021
---

# Manage a VM pool in Lab Services from Canvas

Virtual Machine (VM) creation starts as soon as the template VM is first published. VMs equaling the number of users in the lab user list will be created. VMs are automatically assigned to students upon their first login to Azure Lab Services.

## Publish a template and manage a VM pool

To publish the template, go to the Canvas Lab Services window, select **Template** tab -> **...** -> **Publish**.

Once the template VM is configured and when the educator selects to publish the template, number of VMs equivalent to the number of users in the lab’s user list will be created. Once the lab is published and VMs are created, Users will be automatically registered to the lab and VMs will be assigned to them on their first login to Azure Lab Services that is, when they first access the tab having **Azure Lab Services** App. 

When a user list sync is triggered, Lab Capacity (number of VMs in the lab) will be automatically updated based on the changes to the team membership. New VMs will be created as new users are added and VMs assigned to the users removed from the team will be deleted as well. For more information see [How to manage users within Canvas](how-to-manage-user-lists-within-canvas.md). 

Educators can continue to access student VMs directly from the VM Pool tab. And educators can access VMs assigned to themselves either from the **Virtual machine pool** tab or by clicking on the **My Virtual Machines** button (top/right corner of the screen).

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/how-to-manage-vm-pool-with-teams/vm-pool.png" alt-text="VM pool":::

## Next steps

See the following articles:

- [Use Azure Lab Services within Canvas overview](lab-services-within-canvas-overview.md)
- [Get started and create a Lab Services lab from Canvas](how-to-get-started-create-lab-within-canvas.md)
- [Manage Lab Services user lists from Canvas](how-to-manage-user-lists-within-canvas.md)
- [Create Lab Services schedules from Canvas](how-to-create-schedules-within-canvas.md)
- [Access a VM (student view) in Lab Services from Canvas](how-to-access-vm-for-students-within-canvas.md)


