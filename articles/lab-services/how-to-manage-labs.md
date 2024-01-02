---
title: View and manage labs
description: Learn how to create a lab, configure a lab, view all the labs, or delete a lab. 
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 07/04/2023
---

# Manage labs in Azure Lab Services

This article describes how to create and delete labs. It also shows you how to view all the labs in a lab plan.

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]
[!INCLUDE [Existing lab plan](./includes/lab-services-prerequisite-lab-plan.md)]

- One or more labs. To create a lab, see [Tutorial: Create a lab](tutorial-setup-lab.md).

## View all labs

# [Lab Services website](#tab/lab-services-website)

1. Navigate to Lab Services web portal: [https://labs.azure.com](https://labs.azure.com).

1. Select **Sign in**. Select or enter a **user ID** that is a member of the **Lab Creator** role in the lab plan, and enter password. Azure Lab Services supports organizational accounts and Microsoft accounts.

    [!INCLUDE [Select a tenant](./includes/multi-tenant-support.md)]

1. Confirm that you see all the labs in the selected resource group.

    On the lab's tile, you can see the number of virtual machines in the lab and the quota for each user.

    :::image type="content" source="./media/how-to-manage-labs/all-labs.png" alt-text="Screenshot that shows the list of labs in the Azure Lab Services website.":::

1. Use the drop-down list at the top to select a different lab plan. You see labs in the selected lab plan.

> [!NOTE]
> If you're granted access but are unable to view the labs from other people, you might select *All labs* instead of *My labs* in the **Show** filter.

# [Teams](#tab/teams)

To access your lab in Teams:

1. Sign into Microsoft Teams with your organizational account.

1. Select the team and channel that contain the lab.

1. Select the **Azure Lab Services** tab.

    Confirm that you see all labs for the lab plan that's associated with the Teams channel.

    :::image type="content" source="./media/how-to-manage-labs/teams-view-labs.png" alt-text="Screenshot that shows the list of labs in Microsoft Teams.":::

# [Canvas](#tab/canvas)

1. Sign into Canvas, and select your course.

1. Select **Azure Lab Services** from the course navigation menu.

    Confirm that you see all labs for the lab plan that's associated with the course.

    :::image type="content" source="./media/how-to-manage-labs/canvas-view-labs.png" alt-text="Screenshot that shows the list of labs in Canvas.":::

---

## Use a non-organizational account as a lab creator

You can access the Azure Lab Services website to create and manage labs without an organizational account (a guest account). In this case, you need a Microsoft account, or a GitHub or non-Microsoft email account that is linked to a Microsoft account.

### Use a non-Microsoft email account

[!INCLUDE [Use non-Microsoft account](./includes/lab-services-non-microsoft-account.md)]

### Use a GitHub Account

[!INCLUDE [Use GitHub account](./includes/lab-services-github-account.md)]

## Delete a lab

1. On the tile for the lab, select three dots (...) in the corner, and then select **Delete**.

    :::image type="content" source="./media/how-to-manage-labs/delete-button.png" alt-text="Screenshot that shows the list of labs in the Azure Lab Services website, highlighting the Delete button.":::

1. On the **Delete lab** dialog box, select **Delete** to continue with the deletion.

## Switch to another lab

To switch to another lab from the current, select the drop-down list of labs at the top.

:::image type="content" source="./media/how-to-manage-labs/switch-lab.png" alt-text="Screenshot that shows how to select a different lab using the lab selector control in the Azure Lab Services website.":::

To switch to a different group, select the left drop-down and choose the lab plan's resource group.  To switch to a different lab account, select the left drop-down and choose the lab account name.  The Azure Lab Services portal organizes labs by lab plan's resource group/lab account, then by lab name.

## Next steps

See the following articles:

- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-manage-lab-users.md)
- [As a lab user, access labs](how-to-use-lab.md)
