---
title: 'Tutorial: Create a lab plan with Azure Lab Services'
titleSuffix: Azure Lab Services
description: Learn how to set up a lab plan with Azure Lab Services and assign lab creation permissions to a user by using the Azure portal.
ms.topic: tutorial
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.date: 01/17/2023
ms.custom: subject-rbac-steps
---

# Tutorial: Create a lab plan with Azure Lab Services

In Azure Lab Services, the lab plan serves as a collection of configurations and settings that apply to the labs you create from it. In your lab plan, give permission to others to create labs, and set policies that apply to newly created labs. In this tutorial, learn how to create a lab plan by using the Azure portal.

In this tutorial, you do the following actions:

> [!div class="checklist"]
> * Create a lab plan
> * Assign a user to the Lab Creator role

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a lab plan

The following steps illustrate how to use the Azure portal to create a lab plan with Azure Lab Services.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource** in the upper left-hand corner of the Azure portal.

    :::image type="content" source="./media/tutorial-setup-lab-plan/azure-portal-create-resource.png" alt-text="Screenshot that shows the Azure portal home page, highlighting the Create a resource button.":::

1. Search for **lab plan**.  (**Lab plan** can also be found under the **DevOps** category.)
1. On the **Lab plan** tile, select the **Create** dropdown and choose **Lab plan**.

    :::image type="content" source="./media/tutorial-setup-lab-plan/select-lab-plans-service.png" alt-text="Screenshot of how to search for and create a lab plan by using the Azure Marketplace.":::

1. On the **Basics** tab of the **Create a lab plan** page, provide the following information:

    | Field        | Description                |
    | ------------ | -------------------------- |
    | **Subscription** | Select the Azure subscription that you want to use to create the lab plan. |
    | **Resource group** | Select an existing resource group or select **Create new**, and enter a name for the new resource group. |
    | **Name** | Enter a unique lab plan name. <br/>For more information about naming restrictions, see [Microsoft.LabServices resource name rules](../azure-resource-manager/management/resource-name-rules.md#microsoftlabservices). |
    | **Region** | Select a geographic location to host your lab plan. |

1. After you're finished configuring the resource, select **Review + Create**.

    :::image type="content" source="./media/tutorial-setup-lab-plan/lab-plan-basics-page.png" alt-text="Screenshot that shows the Basics tab to create a new lab plan in the Azure portal.":::

1. Review all the configuration settings and select **Create** to start the deployment of the Lab Plan.

1. To view the new resource, select **Go to resource**.

    :::image type="content" source="./media/tutorial-setup-lab-plan/go-to-lab-plan.png" alt-text="Screenshot that shows the resource deployment completion page in the Azure portal.":::

1. Confirm that you see the lab plan **Overview** page.

    :::image type="content" source="./media/tutorial-setup-lab-plan/lab-plan-page.png" alt-text="Screenshot that shows the lab plan overview page in the Azure portal.":::

You've now successfully created a lab plan by using the Azure portal. To let others create labs in the lab plan, you assign them the Lab Creator role.

## Add a user to the Lab Creator role

[!INCLUDE [Add Lab Creator role](./includes/lab-services-add-lab-creator.md)]

## Troubleshooting

[!INCLUDE [Troubleshoot not authorized error](./includes/lab-services-troubleshoot-not-authorized.md)]

## Next steps

In this tutorial, you created a lab plan and assigned lab creation permissions to another user. To learn about how to create a lab, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Create a lab](./tutorial-setup-lab.md)
