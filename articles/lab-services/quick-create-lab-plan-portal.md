---
title: Azure Lab Services Quickstart - Create a lab plan using the Azure portal
description: In this quickstart, you learn how to create an Azure Lab Services lab plan using the Azure portal.
ms.topic: quickstart
ms.date: 1/18/2022
ms.custom: mode-portal
---

# Quickstart: Create a lab plan using the Azure portal

A lab plan for Azure Lab Services can be created through the Azure portal.  This quickstart shows you, as the admin, how to use the Azure portal to create a lab plan.  Lab plans are used when creating labs for Azure Lab Services.  You'll also add a role assignment so an educator can create labs based on the lab plan.  For an overview of Azure Lab Services, see [An introduction to Azure Lab Services](lab-services-overview.md).

## Prerequisites

To complete this quick start, make sure that you have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

## Create a lab plan

The following steps show how to use the Azure portal to create a lab plan.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** at the top left of the screen.
1. Select **All services** in the left menu.  Search for **Lab plans**.
1. Select the **Lab plans** tile, select **Create**.

    :::image type="content" source="./media/quick-create-lab-plan-portal/select-lab-plans-service.png" alt-text="Screenshot that shows the Lab plan tile for Azure Marketplace.":::

1. On the **Basics** tab of the **Create a lab plan** page:
    1. For the **Subscription**, select the Azure subscription in which you want to create the lab plan.
    1. For **Resource Group**, select **Create New** and enter *MyResourceGroup*.
    1. For **Name**, enter a *MyLabPlan*.
    1. For **Region**, select the Azure region you want to create the lab plan.  (Region for the lab plan is also the default region where your labs will be created.)
    1. Select **Review + create**.

        :::image type="content" source="./media/quick-create-lab-plan-portal/Create-lab-plan-basics-tab.png" alt-text="Screenshot that shows the Basics tab of the Create a new lab plan experience.":::

1. Review the summary and select **Create**.

    :::image type="content" source="./media/quick-create-lab-plan-portal/Create-lab-plan-review-create-tab.png" alt-text="Screenshot that shows the Review and Create tab of the Create a new lab plan experience.":::

1. When the deployment is complete, expand **Next steps**, and select **Go to resource**.

    :::image type="content" source="./media/quick-create-lab-plan-portal/Create-lab-plan-deployment-complete.png" alt-text="Screenshot that the deployment of the lab plan resource is complete.":::

1. Confirm that you see the **Overview** page for *MyLabPlan*.

## Add a user to the Lab Creator role

[!INCLUDE [Add Lab Creator role](./includes/lab-services-add-lab-creator.md)]

## Clean up resources

When no longer needed, you can delete the resource group, lab plan, and all related resources.

1. On the **Overview** page for the lab plan, select the **Resource group** link.
1. At the top of the page for the resource group, select **Delete resource group**.
1. A page will open warning you that you're about to delete resources. Type the name of the resource group and select **Delete** to finish deleting the resources and the resource group.

## Next steps

In this quickstart, you created a resource group and a lab plan.  

To learn more about advanced options for lab plans, see:
- [Tutorial: Create a lab plan with Azure Lab Services](tutorial-setup-lab-plan.md).
- [Request a capacity increase](how-to-request-capacity-increase.md)

Advance to the next article to learn how to create a lab.
> [!div class="nextstepaction"]
> [Create a lab](quick-create-lab-portal.md)
