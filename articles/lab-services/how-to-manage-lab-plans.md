---
title: Manage lab plans in Azure Lab Services | Microsoft Docs
description: Learn how to create a lab plan, view all lab plans, or delete a lab plan in an Azure subscription.  
ms.topic: how-to
ms.date: 10/26/2021
---

# Create and manage lab plans

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

In Azure Lab Services, a lab plan is a container for managed lab types such as labs. An administrator sets up a lab plan with Azure Lab Services and provides access to lab owners who can create labs in the plan. This article describes how to create a lab plan, view all lab plans, or delete a lab plan.

## Create a lab plan

To create a lab plan, see [Tutorial: Set up a lab plan with Azure Lab Services](tutorial-setup-lab-plan.md).

## View lab plans

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All resources** from the menu.
3. Select **Lab Plans** for the type. You can also filter by subscription, resource group, locations, and tags.

    :::image type="content" source="./media/how-to-manage-lab-plans/all-resources-lab-plans.png" alt-text="All resources -> Lab Plans":::

## Delete a lab plan

Follow instructions from the previous section that displays lab plans in a list. Use the following instructions to delete a lab plan:

1. Select the **lab plan** that you want to delete.
1. Select **Delete** from the toolbar.

    :::image type="content" source="./media/how-to-manage-lab-plans/delete-button.png" alt-text="Lab Plans -> Delete button":::
1. Type **Yes** for confirmation.
1. Select **Delete**.

    :::image type="content" source="./media/how-to-manage-lab-plans/delete-lab-plan-confirmation.png" alt-text="Delete lab plan - confirmation":::

> [!NOTE]
> Deleting a lab plan will not delete any labs created from that lab plan.

## Next steps

See other articles in the **How-to guides** -> **Create and configure lab plans** section of the table-of-content (TOC).
