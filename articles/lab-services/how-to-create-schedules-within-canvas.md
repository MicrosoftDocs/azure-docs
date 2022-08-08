---
title: Create Azure Lab Services schedules within Canvas
description: Learn how to create Lab Services schedules within Canvas. 
ms.topic: how-to
ms.date: 01/22/2022
---

# Create and manage Lab Services schedules within Canvas

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

Schedules allow you to configure a lab such that VMs in the lab automatically start and shut down at a specified time. You can define a one-time schedule or a recurring schedule. 

Here is how schedules affect lab VM:

- Template virtual machine is not included in schedules.
- Only assigned virtual machines are started. If a machine is not claimed by a student, the VM will not start when a schedule runs.
- All virtual machines (whether claimed by a user or not) are stopped based on the schedule.

The scheduled running time of VMs does not count against the [quota](classroom-labs-concepts.md#quota) given to a user. The quota is for the time outside of schedule hours that a student spends on VMs.

Educators can create, edit, and delete lab schedules within Canvas as in the Azure Lab Services portal. For more information on scheduling, see [Creating and managing schedules](how-to-create-schedules.md).

> [!IMPORTANT]
> Schedules will apply at the course level.  If you have many sections of a course, consider using [automatic shutdown policies](how-to-configure-auto-shutdown-lab-plans.md) and/or [quotas hours](how-to-configure-student-usage.md#set-quotas-for-users).

## Next steps

See the following articles:

- [Use Azure Lab Services within Canvas overview](lab-services-within-canvas-overview.md)
- [Get started and create a lab within Canvas](how-to-get-started-create-lab-within-canvas.md)
- [Manage lab user lists within Canvas](how-to-manage-user-lists-within-canvas.md)
- [Manage lab's VM pool within Canvas](how-to-manage-vm-pool-within-canvas.md)
- [Access a VM within Canvas – Student view](how-to-access-vm-for-students-within-canvas.md)
