---
title: Create Azure Lab Services schedules within Canvas
description: Learn how to create Lab Services schedules within Canvas. 
ms.topic: how-to
ms.date: 11/08/2021
---

# Create and manage Lab Services schedules within Canvas

Schedules allow you to configure a lab such that VMs in the lab automatically start and shut down at a specified time. You can define a one-time schedule or a recurring schedule. The following procedures give you steps to create and manage schedules for a lab:

Here's how schedules affect lab virtual machines:

- Template virtual machine is not included in schedules.
- Only assigned virtual machines are started. This means, if a machine is not claimed by an end user (student), the machine will not start on the scheduled hours.
- All virtual machines (whether claimed by a user or not) are stopped based on the lab schedule.

> [!IMPORTANT]
> The scheduled running time of VMs does not count against the [quota](classroom-labs-concepts.md#quota) allotted to a user. The quota is for the time outside of schedule hours that a student spends on VMs.

Users can create, edit, and delete lab schedules within Canvas just as in the [labs website](https://labs.azure.com). Refer to the article on [creating and managing schedules](how-to-create-schedules-within-canvas.md) for further details.

## Next steps

See the following articles:

- [Use Azure Lab Services within Canvas overview](lab-services-within-canvas-overview.md)
- [Get started and create a lab within Canvas](how-to-get-started-create-lab-within-canvas.md)
- [Manage lab user lists within Canvas](how-to-manage-user-lists-within-canvas.md)
- [Manage lab's VM pool within Canvas](how-to-manage-vm-pool-within-canvas.md)
- [Access a VM within Canvas – Student view](how-to-access-vm-for-students-within-canvas.md)
