---
title: Create Azure Lab Services schedules within Teams
description: Learn how to create Lab Services schedules within Teams. 
ms.topic: how-to
ms.date: 04/25/2022
ms.custom: devdivchpfy22
---

# Create and manage Lab Services schedules within Teams

Schedules allow you to configure a classroom lab such that the VMs automatically start and shut down at a specified time. You can define a one-time schedule or a recurring schedule. The article covers the procedures to create and manage schedules for a lab.

Here's how schedules affect lab virtual machines:

- Template VM isn't included in schedules.
- Only assigned virtual machines are started. If a machine isn't claimed by user (student), the machine won't start on the scheduled hours.
- All virtual machines (whether claimed by a user or not) are stopped based on the lab schedule.

> [!IMPORTANT]
> The scheduled run time of VMs doesn't count against the quota allotted to a user. The alloted quota is for the time outside of schedule hours that a student spends on VMs.

Users can create, edit, and delete lab schedules within Teams as in the Lab Services web portal: [https://labs.azure.com](https://labs.azure.com). For more information, see [creating and managing schedules](how-to-create-schedules.md).

## Automatic shutdown and disconnect settings

You can enable several automatic shutdown cost control features to prevent extra costs when the VMs aren't being actively used. The combination of the following three automatic shutdown and disconnect features catches most of the cases where users accidentally leave their virtual machines running:

- Automatically disconnect users from virtual machines that the OS considers idle.
- Automatically shut down virtual machines when users disconnect.
- Automatically shut down virtual machines that are started but users don't connect.

For more information, see the article on [configuring auto-shutdown settings for a lab](how-to-enable-shutdown-disconnect.md).

## Next steps

- [Use Azure Lab Services within Teams overview](lab-services-within-teams-overview.md).
- As an educator, [manage the VM pool within Teams](how-to-manage-vm-pool-within-teams.md).
- As an educator, [manage lab user lists from Teams](how-to-manage-user-lists-within-teams.md).
- As an admin or educator, [delete the labs within Teams](how-to-delete-lab-within-teams.md).
- As a student, [access a VM within Teams](how-to-access-vm-for-students-within-teams.md).
