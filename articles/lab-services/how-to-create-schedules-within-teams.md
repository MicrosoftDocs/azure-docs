---
title: Create Azure Lab Services schedules within Teams
description: Learn how to create Lab Services schedules within Teams. 
ms.topic: how-to
ms.date: 01/06/2022
---

# Create and manage Lab Services schedules within Teams

Schedules allow you to configure a lab such that VMs in the lab automatically start and shut down at a specified time. You can define a one-time schedule or a recurring schedule. The article covers the procedures to create and manage schedules for a lab.

Here's how schedules affect lab virtual machines:

- Template virtual machine isn't included in schedules.
- Only assigned virtual machines are started. If a machine is not claimed by user (student), the machine won't start on the scheduled hours.
- All virtual machines (whether claimed by a user or not) are stopped based on the lab schedule.

> [!IMPORTANT]
> The scheduled running time of VMs does not count against the quota allotted to a user. The quota is for the time outside of schedule hours that a student spends on VMs.

Users can create, edit, and delete lab schedules within Teams as in the [Azure Lab Services portal](https://labs.azure.com). For more information, see [creating and managing schedules](how-to-create-schedules-within-teams.md).

## Automatic shutdown and disconnect settings

You can enable several automatic shutdown cost control features to prevent extra costs when the VMs aren't being actively used. The combination of the following three automatic shutdown and disconnect features catches most of the cases where users accidentally leave their virtual machines running:

- Automatically disconnect users from virtual machines that the OS considers idle.
- Automatically shut down virtual machines when users disconnect.
- Automatically shut down virtual machines that are started but users don't connect.

For more information, see the article on [configuring auto-shutdown settings for a lab](how-to-enable-shutdown-disconnect.md).

## Next steps

See the following articles:

- [Use Azure Lab Services within Teams overview](lab-services-within-teams-overview.md)
- [Get started and create a lab within Teams](how-to-get-started-create-lab-within-teams.md)
- [Manage lab user lists within Teams](how-to-manage-user-lists-within-teams.md)
- [Manage lab's VM pool within Teams](how-to-manage-vm-pool-within-teams.md)
- [Access a VM within Teams – Student view](how-to-access-vm-for-students-within-teams.md)
