---
title: Create Azure Lab Services schedules within Teams
description: Learn how to create Lab Services schedules within Teams. 
ms.topic: article
ms.date: 10/07/2020
---

# Create and manage Lab Services schedules within Teams

Schedules allow you to configure a classroom lab such that VMs in the lab automatically start and shut down at a specified time. You can define a one-time schedule or a recurring schedule. The following procedures give you steps to create and manage schedules for a classroom lab: 

Here's how schedules affect lab virtual machines: 

- Template virtual machine is not included in schedules. 
- Only assigned virtual machines are started. This means, if a machine is not claimed by an end user (student), the machine will not start on the scheduled hours. 
- All virtual machines (whether claimed by a user or not) are stopped based on the lab schedule. 

> [!IMPORTANT]
> The scheduled running time of VMs does not count against the quota allotted to a user. The quota is for the time outside of schedule hours that a student spends on VMs. 

## Create/edit/delete a schedule for the lab

Create a scheduled event for the lab so that VMs in the lab are automatically started/stopped at specific times. The user quota you specified earlier is the additional time assigned to each user outside this scheduled time. 

1. Switch to the **Schedules** page, and select **Add scheduled event** on the toolbar (top/left of the window). 
1. Set the following parameters for the schedule:
    1. Confirm that **Standard** is selected the **Event type**. You select **Start only** to specify only the start time for the VMs. You select **Stop only** to specify only the stop time for the VMs. 
    1. Specify the **start date**.
    1. Specify the **start time** at which you want the VMs to be started.
    1. Specify the **stop time** on which the VMs are to be shut down. 
    1. Specify the **time zone** for the start and stop times you specified. 
    1. In the **Repeat** section, select **Every week** or **Never**. 
    1. For **Notes (optional)**, enter any description or notes for the schedule. 
1. Click **Save**. 

### View schedules in calendar

You can see the scheduled dates and times highlighted in the calendar. Select the **Today** button in the top-right corner to switch to current date in the calendar. Select **left arrow** to switch to the previous week and **right arrow** to switch to the next week in the calendar. 

### Edit a schedule

When you select a highlighted schedule in the calendar, you see buttons to **edit** or **delete** the schedule. 

On the **Edit scheduled event** page, you can update the schedule, and select **Save**. 

### Delete a schedule

1. To delete a schedule, select a highlighted schedule in the calendar, and select the trash icon (delete) button:
1. On the **Delete scheduled event** dialog box, select **Yes** to confirm the deletion. 

## Automatic shutdown and disconnect settings

At the top of the page, you will notice a link to the **autoshutdown** settings.

You can enable several autoshutdown cost control features to proactively prevent additional costs when the virtual machines are not being actively used. The combination of the following three automatic shutdown and disconnect features catches most of the cases where users accidentally leave their virtual machines running:
 
- Automatically disconnect users from virtual machines that the OS deems idle.
- Automatically shut down virtual machines when users disconnect.
- Automatically shut down virtual machines that are started but users don't connect.

For more details, click the *information* icon next to options in the settings.

## Next steps

See the following articles:

- [Use Azure Lab Services within Teams overview](lab-services-within-teams-overview.md)
- [Get started and create a Lab Services lab from Teams](how-to-get-started-create-lab-within-teams.md)
- [Manage Lab Services user lists from Teams](how-to-manage-user-lists-within-teams.md)
- [Manage a VM pool in Lab Services from Teams](how-to-manage-vm-pool-within-teams.md)
- [Access a VM (student view) in Lab Services from Teams](how-to-access-vm-for-students-within-teams.md)