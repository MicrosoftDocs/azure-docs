---
title: Create and manage labs in Canvas
titleSuffix: Azure Lab Services
description: Learn how to create and manage Azure Lab Services labs in Canvas. Manage user lists, VM pools, and configure lab schedules for your labs.
ms.topic: how-to
ms.date: 11/29/2022
author: ntrogh
ms.author: nicktrog
ms.custom: engagement-fy23
---

# Create and manage Azure Lab Services labs in Canvas

In this article, you learn how to create and manage Azure Lab Services labs in Canvas. As an educator, you can create new labs or configure existing labs in the Canvas interface. Manage user lists, VM pools, and configure lab schedules for your labs. Students can then access their labs directly from within Canvas. Learn more about the [benefits of using Azure Lab Services within Canvas](./lab-services-within-canvas-overview.md).

This article describes how to:

- [Create a lab](#create-a-lab-in-canvas).
- [Manage lab user lists](#manage-lab-user-lists-in-canvas).
- [Manage a lab virtual machine (VM) pool](#manage-a-lab-vm-pool-in-canvas).
- [Configure lab schedules and settings](#configure-lab-schedules-and-settings-in-canvas).
- [Delete a lab](#delete-a-lab).

For more information about adding lab plans to Canvas, see [Configure Canvas to access Azure Lab Services lab plans](./how-to-configure-canvas-for-lab-plans.md).

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

## Prerequisites

- An Azure Lab Services lab plan. If you don't have a lab plan yet, see For information, see [Set up a lab plan with Azure Lab Services](quick-create-resources.md).
- The Azure Lab Services Canvas app is enabled. Learn how to [configure Canvas for Azure Lab Services](./how-to-configure-canvas-for-lab-plans.md).
- To create and manage labs, your account should have the Lab Creator, or Lab Contributor role on the lab plan.

## Create a lab in Canvas

Once Azure Lab Services is added to your course, you'll see **Azure Lab Services** in the course navigation menu. If you're authenticated in Canvas as an educator, you'll see this sign in screen before you can use the service. You'll need to sign in here with an Azure AD account or Microsoft account that has been added as a Lab Creator.
    :::image type="content" source="./media/how-to-manage-labs-within-canvas/welcome-to-lab-services.png" alt-text="Screenshot that shows the welcome page in Canvas.":::

For instructions on how to create a lab, see [Create a lab](./tutorial-setup-lab.md). Make sure to verify the resource group to use before creating the lab.

> [!IMPORTANT]
> Labs must be created using the Azure Lab Services app in Canvas. Labs created from the Azure Lab Services portal aren't visible from Canvas.

The student list for the course is automatically synced with the course roster. For more information, see [Manage Lab Services user lists from Canvas](how-to-manage-user-lists-within-canvas.md). A lab VM will also be created for the course educator.

## Manage lab user lists in Canvas

When you [create a lab within Canvas](#create-a-lab-in-canvas), Azure Lab Services automatically syncs the lab user list with the course membership. Azure Lab Services adds or deletes users from the lab user list as per changes to the course membership when the sync operation completes.

Azure Lab Services automatically synchronizes the course membership with the lab user list every 24 hours. Educators can select **Sync** in the **Users** tab to manually trigger a sync, for example when the team membership is updated.

:::image type="content" source="./media/how-to-manage-labs-within-canvas/sync-users.png" alt-text="Screenshot that shows how to manually sync users with Azure Lab Services in Canvas.":::

Once the automatic or manual sync is complete, adjustments are made to the lab depending on whether the lab has been [published](tutorial-setup-lab.md#publish-lab) or not.

If the lab has *not* been published at least once:

- Users will be added or deleted from the lab user list as per changes to the course membership.

If the lab has been published at least once:

- Users will be added or deleted from the lab user list as per changes to the course membership.
- New VMs will be created if there are any new students added to the course.
- VM will be deleted if any student has been deleted from the course.
- Lab capacity will be automatically updated as needed.

## Manage a lab VM pool in Canvas

Virtual Machine (VM) creation starts as soon as you publish the template VM. Azure Lab Services creates a number of VMs, known as the VM pool, equivalent to the number of users in the lab user list.

The lab capacity (number of VMs in the lab) automatically matches the course membership. Whenever you add or remove a user from the course, the capacity increases or decreases accordingly. For more information, see [How to manage users within Canvas](#manage-lab-user-lists-in-canvas).

After publishing the lab and VM creation completes, Azure Lab Services automatically registers users to the lab. Azure Lab Services assigns a lab VM to a user when they first access the **Azure Lab Services** tab in Canvas.

Educators can access student VMs directly from the **Virtual machine pool** tab. For more information, see [Manage a VM pool in Azure Lab Services](how-to-manage-vm-pool.md)

:::image type="content" source="./media/how-to-manage-labs-within-canvas/vm-pool.png" alt-text="Screenshot of the vm pool in the Azure Lab Services app.":::

As part of the publish process, Canvas educators are assigned their own lab VMs. The VM can be accessed by clicking on the **My Virtual Machines** button (top/right corner of the screen).

:::image type="content" source="./media/how-to-manage-labs-within-canvas/my-vms.png" alt-text="Screenshot of My Virtual Machines for an educator.":::

## Configure lab schedules and settings in Canvas

Lab schedules allow you to configure a classroom lab such that the VMs automatically start and shut down at a specified time. You can define a one-time schedule or a recurring schedule.

Lab schedules affect lab virtual machines in the following way:

- A template VM isn't included in schedules.
- Only assigned VMs are started. If a machine isn't claimed by a user (student), the VM won't start on the scheduled hours.
- All virtual machines, whether claimed by a user or not, are stopped based on the lab schedule.

The scheduled running time of VMs does not count against the [quota](classroom-labs-concepts.md#quota) given to a user. The quota is for the time outside of schedule hours that a student spends on VMs.

Educators can create, edit, and delete lab schedules within Canvas as in the Azure Lab Services portal. For more information on scheduling, see [Creating and managing schedules](how-to-create-schedules.md).

> [!IMPORTANT]
> Schedules will apply at the course level.  If you have many sections of a course, consider using [automatic shutdown policies](how-to-configure-auto-shutdown-lab-plans.md) and/or [quotas hours](how-to-configure-student-usage.md#set-quotas-for-users).

## Delete a lab

To delete a lab that was created in Canvas, you use the [Azure Lab Services web portal](https://labs.azure.com). For more information, see [Delete a lab in the Azure Lab Services portal](manage-labs.md#delete-a-lab).

> [!IMPORTANT]
> Uninstalling the Azure Lab Services app from the course will not result in deletion of the lab. Deletion of the course won't cause deletion of the lab. Users can still access the lab VMs on the Lab Services web portal: [https://labs.azure.com](https://labs.azure.com).

## Troubleshooting

This section outlines common error messages that you may see, along with the steps to resolve them.

- Insufficient permissions to create lab.

  In Canvas, an educator will see a message indicating that they don't have sufficient permission. Educators should contact their Azure admin so they can be [added as a **Lab Creator**](quick-create-resources.md#add-a-user-to-the-lab-creator-role). For example, educators can be added as a **Lab Creator** to the resource group that contains their lab.

- Message that there isn't enough capacity to create lab VMs.

  [Request a limit increase](capacity-limits.md#request-a-limit-increase) which needs to be done by an Azure Labs Services administrator.

- Student sees warning that the lab isn't available yet.

  In Canvas, you'll see the following message if the educator hasn't published the lab yet. Educators must [publish the lab](tutorial-setup-lab.md#publish-lab) and [sync users](how-to-manage-user-lists-within-canvas.md#sync-users) for students to have access to a lab.

  :::image type="content" source="./media/how-to-manage-labs-within-canvas/troubleshooting-lab-isnt-available-yet.png" alt-text="Troubleshooting -> This lab is not available yet.":::

- Student or educator is prompted to grant access.

  Before a student or educator can first access their lab, some browsers require that they first grant Azure Lab Services access to the browser's local storage. To grant access, educators and students should click the **Grant access** button when they are prompted:

  :::image type="content" source="./media/how-to-manage-labs-within-canvas/canvas-grant-access-prompt.png" alt-text="Screenshot of page to grant Azure Lab Services access to use local storage for the browser.":::

  Educators and students will see the message **Access granted** when access is successfully granted to Azure Lab Services. The educator or student should then reload the browser window to start using Azure Lab Services.

  :::image type="content" source="./media/how-to-manage-labs-within-canvas/canvas-access-granted-success.png" alt-text="Screenshot of access granted page in Azure Lab Services.":::

  > [!IMPORTANT]
  > Ensure that students and educators are using an up-to-date version of their browser. For older browser versions, students and educators may experience issues with being able to successfully grant access to Azure Lab Services.

  - Educator isn't prompted for their credentials after they click sign-in.
  
  When an educator accesses Azure Lab Services within their course, they may be prompted to sign in. Ensure that the browser's settings allow popups from the url of your Canvas instance, otherwise the popup may be blocked by default.

    :::image type="content" source="./media/how-to-manage-labs-within-canvas/canvas-sign-in.png" alt-text="Azure Lab Services sign-in screen.":::

## Next steps

- [Use Azure Lab Services within Canvas overview](lab-services-within-canvas-overview.md)
- As an admin, [configure Teams to access Azure Lab Services lab plans](./how-to-configure-teams-for-lab-plans.md).
- As a student, [access a lab VM within Teams](how-to-access-vm-for-students-within-teams.md).
