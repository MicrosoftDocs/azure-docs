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

For more information about adding lab plans to Microsoft Teams, see [Configure Microsoft Teams to access Azure Lab Services lab plans](./how-to-get-started-create-lab-within-teams.md).

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

## Prerequisites

- An Azure Lab Services lab plan. If you don't have a lab plan yet, see For information, see [Tutorial: Set up a lab plan with Azure Lab Services](tutorial-setup-lab-plan.md).
- The Azure Lab Services Teams app is added to your Teams channel. Learn how to [configure Teams for Azure Lab Services](./how-to-get-started-create-lab-within-teams.md).
- To create and manage labs, your account should have the Lab Creator, or Lab Contributor role on the lab plan.

## Create a lab in Teams

## Manage lab user lists in Teams

When you [create a lab within Teams](#create-a-lab-in-teams), Azure Lab Services automatically syncs the lab user list with the team membership. Everyone on the team, including owners, members, and guests are automatically added to the lab user list. Azure Lab Services adds or deletes users from the lab user list as per changes to the team membership when the sync operation completes.

Azure Lab Services automatically synchronizes the team membership with the lab user list every 24 hours.

Educators can use the **Sync** button to manually trigger a sync, for example when the team membership is updated.

:::image type="content" source="./media/how-to-manage-users-with-teams/sync-users.png" alt-text="Sync users":::

When the lab is published, the lab capacity is automatically updated:

- If there are any new additions to the team, new VMs are created.
- If a user is deleted from the team, the associated VM is deleted.

## Manage a lab VM pool in Teams

## Configure lab schedules and settings in Teams

## Delete a lab

To delete a lab that was created in Teams, you use the [Azure Lab Services web portal](https://labs.azure.com). For more information, see [Delete a lab in the Azure Lab Services portal](manage-labs.md#delete-a-lab).

Azure Lab Services also triggers lab deletion for labs you created in Teams, when the team is deleted. The lab will be automatically deleted after 24 hours of the team deletion, when the automatic user list sync is triggered.

Users can't access their VMs through the [Azure Lab Services web portal](https://labs.azure.com) if the team or the lab is deleted.

> [!IMPORTANT]
> Deletion of the tab or uninstalling the app will not result in deletion of the lab. Users can still access the lab VMs on the Lab Services web portal: [https://labs.azure.com](https://labs.azure.com).

## Next steps

- As an admin, [configure Teams to access Azure Lab Services lab plans](./how-to-get-started-create-lab-within-teams.md).
- As student, [access a lab VM within Teams](how-to-access-vm-for-students-within-teams.md).
