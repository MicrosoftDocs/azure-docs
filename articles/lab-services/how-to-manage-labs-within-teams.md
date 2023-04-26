---
title: Create and manage labs in Microsoft Teams
titleSuffix: Azure Lab Services
description: Learn how to create and manage Azure Lab Services labs in Microsoft Teams. Manage user lists, VM pools, and configure lab schedules for your labs.
ms.topic: how-to
ms.date: 11/18/2022
author: ntrogh
ms.author: nicktrog
ms.custom: engagement-fy23
---

# Create and manage Azure Lab Services labs in Microsoft Teams

In this article, you learn how to create and manage Azure Lab Services labs in Microsoft Teams. As an educator, you can create new labs or configure existing labs in the Teams interface. Manage user lists, VM pools, and configure lab schedules for your labs. Students can then access their labs directly from within Teams. Learn more about the [benefits of using Azure Lab Services within Teams](./lab-services-within-teams-overview.md).

This article describes how to:

- [Create a lab in Microsoft Teams](#create-a-lab-in-teams).
- [Manage lab user lists](#manage-lab-user-lists-in-teams).
- [Manage a lab virtual machine (VM) pool](#manage-a-lab-vm-pool-in-teams).
- [Configure lab schedules and settings](#configure-lab-schedules-and-settings-in-teams).
- [Delete a lab](#delete-a-lab).

For more information about adding lab plans to Microsoft Teams, see [Configure Microsoft Teams to access Azure Lab Services lab plans](./how-to-configure-teams-for-lab-plans.md).

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

## Prerequisites

- An Azure Lab Services lab plan. If you don't have a lab plan yet, see For information, see [Set up a lab plan with Azure Lab Services](quick-create-resources.md).
- The Azure Lab Services Teams app is added to your Teams channel. Learn how to [configure Teams for Azure Lab Services](./how-to-configure-teams-for-lab-plans.md).
- To create and manage labs, your account should have the Lab Creator, or Lab Contributor role on the lab plan.

## Create a lab in Teams

As an educator, you can create a new lab in Teams or by using the Azure Lab Services web portal (https://labs.azure.com). For more information, see how to [create and publish a lab](./tutorial-setup-lab.md).

## Manage lab user lists in Teams

When you [create a lab within Teams](#create-a-lab-in-teams), Azure Lab Services automatically syncs the lab user list with the team membership. Everyone on the team, including owners, members, and guests are automatically added to the lab user list. Azure Lab Services adds or deletes users from the lab user list as per changes to the team membership when the sync operation completes.

Azure Lab Services automatically synchronizes the team membership with the lab user list every 24 hours. Educators can select **Sync** in the **Users** tab to manually trigger a sync, for example when the team membership is updated.

:::image type="content" source="./media/how-to-manage-labs-within-teams/sync-users.png" alt-text="Screenshot that shows how to manually sync users with Azure Lab Services in Teams.":::

Azure Lab Services automatically updates the lab capacity after publishing the lab:

- If there are any new additions to the team, new VMs are created.
- If a user is deleted from the team, the associated VM is deleted.

## Manage a lab VM pool in Teams

Virtual Machine (VM) creation starts as soon as you publish the template VM. Azure Lab Services creates a number of VMs, known as the VM pool, equivalent to the number of users in the lab user list.

The lab capacity (number of VMs in the lab) automatically matches the team membership. Whenever you add or remove a user from the team, the capacity increases or decreases accordingly. For more information, see [How to manage users within Teams](#manage-lab-user-lists-in-teams).

After publishing the lab and VM creation completes, Azure Lab Services automatically registers users to the lab. Azure Lab Services assigns a lab VM to a user when they first access the **Azure Lab Services** tab in Teams.

To publish a template VM in Teams:

1. Go to the **Azure Lab Services** tab in your team.
1. Select the **Template** tab, and then select **Publish**.
1. In the **Publish template** window, select **Publish**.

As an educator, you can access student VMs directly from the **Virtual machine pool** tab. You can start, stop, reset, or connect to a student VM. Educators can also access VMs assigned to themselves either from the **Virtual machine pool** tab, or by selecting **My Virtual Machines** in the top-right corner.

:::image type="content" source="./media/how-to-manage-labs-within-teams/vm-pool.png" alt-text="Screenshot of the VM pool tab in Teams.":::

## Configure lab schedules and settings in Teams

Lab schedules allow you to configure a classroom lab such that the VMs automatically start and shut down at a specified time. You can define a one-time schedule or a recurring schedule.

Lab schedules affect lab virtual machines in the following way:

- A template VM isn't included in schedules.
- Only assigned VMs are started. If a machine isn't claimed by a user (student), the VM won't start on the scheduled hours.
- All virtual machines, whether claimed by a user or not, are stopped based on the lab schedule.

> [!IMPORTANT]
> The scheduled run time of VMs doesn't count against the quota allotted to a user. The alloted quota is for the time that a student spends on VMs outside of schedule hours.

### Create a lab schedule

As an educator, you can create, edit, and delete lab schedules within Teams or in the Azure Lab Services web portal (https://labs.azure.com). In Teams, go to the **Schedule** tab, and then select **Add scheduled event** to add a schedule for a lab. 

:::image type="content" source="./media/how-to-manage-labs-within-teams/add-scheduled-event-in-teams.png" alt-text="Screenshot of the Schedule tab in Teams.":::

Learn more about [creating and managing schedules](how-to-create-schedules.md).

### Configure automatic shutdown and disconnect settings

You can enable several automatic shutdown cost control features to prevent extra costs when the VMs aren't being actively used. The combination of the following three automatic shutdown and disconnect features catches most of the cases where users accidentally leave their virtual machines running:

- Automatically disconnect users from virtual machines that the OS considers idle.
- Automatically shut down virtual machines when users disconnect.
- Automatically shut down virtual machines that are started but users don't connect.

In Teams, go to the **Settings** tab to configure these settings. For more information, see the article on [configuring auto-shutdown settings for a lab](how-to-enable-shutdown-disconnect.md).

## Delete a lab

To delete a lab that was created in Teams, you use the [Azure Lab Services web portal](https://labs.azure.com). For more information, see [Delete a lab in the Azure Lab Services portal](manage-labs.md#delete-a-lab).

Azure Lab Services also triggers lab deletion for labs you created in Teams, when the team is deleted. The lab will be automatically deleted after 24 hours of the team deletion, when the automatic user list sync is triggered.

Users can't access their VMs through the [Azure Lab Services web portal](https://labs.azure.com) if the team or the lab is deleted.

> [!IMPORTANT]
> Deletion of the tab or uninstalling the app will not result in deletion of the lab. Users can still access the lab VMs on the Lab Services web portal: [https://labs.azure.com](https://labs.azure.com).

## Next steps

- As an admin, [configure Teams to access Azure Lab Services lab plans](./how-to-configure-teams-for-lab-plans.md).
- As student, [access a lab VM within Teams](how-to-access-vm-for-students-within-teams.md).
