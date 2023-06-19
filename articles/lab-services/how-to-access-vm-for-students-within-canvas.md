---
title:  Access a VM (student view) in Azure Lab Services from Canvas
description: Learn how to access a VM (student view) in Azure Lab Services from Canvas. 
ms.topic: how-to
ms.date: 11/01/2021
---

# Access a VM (student view) in Azure Lab Services from Canvas

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

When a lab is created within [Canvas](https://www.instructure.com/canvas), students can view and access all the VMs provisioned by the course educator. Once the lab is published and VMs are created, students will be automatically assigned a VM. Students can view and access the VMs assigned to them by selecting the tab containing **Azure Lab Services** app.

Students must access their VMs through Canvas.  Their Canvas credentials will be used to log into Azure Lab Services.  For further instructions about connecting to your VM, see [Tutorial: Access a lab in Azure Lab Services](tutorial-connect-lab-virtual-machine.md)

Azure Lab Services supports test users in Canvas and the ability for the educator to act as another user.

## Lab unavailable

If the lab hasn't been published or a synced in a while, students may see a message indicating the lab isn't available yet. Educators should [publish](tutorial-setup-lab.md#publish-lab) and [sync users](how-to-manage-user-lists-within-canvas.md#sync-users) to solve the problem.

:::image type="content" source="./media/how-to-access-vm-for-students-within-canvas/troubleshooting-lab-isnt-available-yet.png" alt-text="Troubleshooting -> This lab is not available yet.":::

## Next steps

For more information, see the following articles:

- [Use Azure Lab Services within Canvas overview](lab-services-within-canvas-overview.md)
- [Get started and create a lab within Canvas](how-to-configure-canvas-for-lab-plans.md)
- [Manage lab user lists within Canvas](how-to-manage-user-lists-within-canvas.md)
- [Manage lab's VM pool within Canvas](how-to-manage-vm-pool-within-canvas.md)
- [Create and manage lab schedules within Canvas](how-to-create-schedules-within-canvas.md)
