---
title: Create and manage lab plans
titleSuffix: Azure Lab Services
description: Learn how to create an Azure Lab Services lab plan, view all lab plans, or delete a lab plan in the Azure portal.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 03/14/2023
---

# Create and manage lab plans in Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

In Azure Lab Services, a lab plan is a container for managed lab types such as labs. An administrator sets up a lab plan with Azure Lab Services and provides access to lab owners who can create labs in the plan. This article describes how to create a lab plan, view all lab plans, or delete a lab plan.

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]

## Create a lab plan

To create a lab plan, see [Quickstart: Set up resources to create labs](quick-create-resources.md).

## View lab plans

To view the list of lab plans in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter *lab plan*, and then select **Lab plans**.

    :::image type="content" source="./media/how-to-manage-lab-plans/azure-portal-search-lab-plans.png" alt-text="Screenshot that shows how to search lab plan resources in the Azure portal.":::

1. View the list of lab plans.

    :::image type="content" source="./media/how-to-manage-lab-plans/azure-portal-all-lab-plans.png" alt-text="Screenshot that shows the list of lab plans in the Azure portal, highlighting the filter options.":::

    > [!TIP]
    > Use the filters to restrict the list of the resources by subscription, resource group, location, or other criteria.

## Delete a lab plan

> [!CAUTION]
> Deleting a lab plan will not delete any labs created from that lab plan.
> 
> Before you delete a lab plan, make sure to delete all associated labs, Azure Compute Gallery images, and other resources. If you're unable to delete these resources, create an [Azure Support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest/) for Azure Lab Services.

To delete a lab plan in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. View the list of lab plans.

1. In the list, check the checkbox for the lab plan that you want to delete, and then select **Delete**.

    :::image type="content" source="./media/how-to-manage-lab-plans/azure-portal-delete-lab-plan.png" alt-text="Screenshot that shows how to delete a lab plan in the Azure portal.":::

    Alternately, select the lab plan from the list, and then select **Delete** on the lab plan **Overview** page.

1. Enter **Yes** to confirm the delete action, and then select **Delete**.

    :::image type="content" source="./media/how-to-manage-lab-plans/delete-lab-plan-confirmation.png" alt-text="Screenshot that shows the delete lab plan confirmation page in the Azure portal.":::

## Next steps

See other articles in the **How-to guides** -> **Create and configure lab plans** section of the table-of-content (TOC).