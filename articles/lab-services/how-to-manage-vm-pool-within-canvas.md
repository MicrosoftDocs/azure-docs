---
title: Manage a VM pool in Azure Lab Services from Canvas
description: Learn how to manage a VM pool in Azure Lab Services from Canvas. 
ms.topic: how-to
ms.date: 11/08/2021
---

# Manage a VM pool in Lab Services from Canvas

Virtual machine (VM) creation starts as soon as the lab is published. VMs equaling the number of students in the course list will be created.

## Update VM pool

Azure Lab Services periodically syncs the users from the Canvas course.  After the sync operation completes, VMs will be created or removed to match the Canvas course roster. Educators can manually [sync users](how-to-manage-user-lists-within-canvas.md#sync-users) to cause the VM pool to be updated.

## Access VMs

Educators can access student VMs directly from the [VM Pool](how-to-manage-labs.md#view-the-student-vm-pool) tab.

As part of the publish process, Canvas educators are assigned their own lab VMs. The VM can be accessed by clicking on the **My Virtual Machines** button (top/right corner of the screen).

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/how-to-manage-vm-pool-with-teams/vm-pool.png" alt-text="VM pool":::

## Next steps

See the following articles:

- [Use Azure Lab Services within Canvas overview](lab-services-within-canvas-overview.md)
- [Get started and create a Lab Services lab from Canvas](how-to-get-started-create-lab-within-canvas.md)
- [Manage Lab Services user lists from Canvas](how-to-manage-user-lists-within-canvas.md)
- [Create Lab Services schedules from Canvas](how-to-create-schedules-within-canvas.md)
- [Access a VM (student view) in Lab Services from Canvas](how-to-access-vm-for-students-within-canvas.md)
