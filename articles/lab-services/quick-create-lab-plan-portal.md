---
title: Create a lab plan using the Azure portal
titleSuffix: Azure Lab Services
description: In this quickstart, you learn how to create an Azure Lab Services lab plan using the Azure portal.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: quickstart
ms.date: 01/18/2023
ms.custom: mode-portal
---

# Quickstart: Create a lab plan using the Azure portal

In Azure Lab Services, a lab plan serves as a collection of configurations and settings that apply to the labs created from it. In this article, you learn how to create a lab plan by using the Azure portal. Next, you grant permissions for others to create labs on the lab plan by assigning the Lab Creator Azure Active Directory (Azure AD) role.

For an overview of Azure Lab Services, see [An introduction to Azure Lab Services](lab-services-overview.md).

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a lab plan

The following steps show how to use the Azure portal to create a lab plan.

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.
1. Select **Create a resource** in the upper left-hand corner of the Azure portal.

    :::image type="content" source="./media/quick-create-lab-plan-portal/azure-portal-create-resource.png" alt-text="Screenshot that shows the Azure portal home page, highlighting the Create a resource button.":::

1. Search for **lab plan**.
1. On the **Lab plan** tile, select the **Create** dropdown and choose **Lab plan**.

    :::image type="content" source="./media/quick-create-lab-plan-portal/select-lab-plans-service.png" alt-text="Screenshot of how to search for and create a lab plan by using the Azure Marketplace.":::

1. On the **Basics** tab of the **Create a lab plan** page, provide the following information:

    | Field        | Description                |
    | ------------ | -------------------------- |
    | **Subscription** | Select the Azure subscription that you want to use for this Lab Plan resource. |
    | **Resource group** | Select **Create New** and enter *MyResourceGroup*. |
    | **Name** | Enter *MyLabPlan* as the lab plan name. |
    | **Region** | Select a geographic location to host your Lab Plan resource. |
    
    :::image type="content" source="./media/quick-create-lab-plan-portal/Create-lab-plan-basics-tab.png" alt-text="Screenshot that shows the Basics tab of the Create a new lab plan experience.":::

1. After you're finished configuring the resource, select **Review + Create**.

1. Review all the configuration settings and select **Create** to start the deployment of the Lab Plan.

    :::image type="content" source="./media/quick-create-lab-plan-portal/Create-lab-plan-review-create-tab.png" alt-text="Screenshot that shows the Review and Create tab of the Create a new lab plan experience.":::

1. To view the new resource, select **Go to resource**.

    :::image type="content" source="./media/quick-create-lab-plan-portal/Create-lab-plan-deployment-complete.png" alt-text="Screenshot that the deployment of the lab plan resource is complete.":::

1. Confirm that you see the Lab Plan **Overview** page for *MyLabPlan*.

## Add a user to the Lab Creator role

[!INCLUDE [Add Lab Creator role](./includes/lab-services-add-lab-creator.md)]

## Clean up resources

When no longer needed, you can delete the resource group, lab plan, and all related resources.

1. On the **Overview** page for the lab plan, select the **Resource group** link.

1. At the top of the page for the resource group, select **Delete resource group**.

1. Enter the resource group name. Then select **Delete**.

To delete resources by using the Azure CLI, enter the following command:

```azurecli
az group delete --name <yourresourcegroup>
```

Remember, deleting the resource group deletes all of the resources within it.

## Troubleshooting

[!INCLUDE [Troubleshoot not authorized error](./includes/lab-services-troubleshoot-not-authorized.md)]

## Next steps

In this quickstart, you created a resource group and a lab plan.  

To learn more about advanced options for lab plans, see:
- [Tutorial: Create a lab plan with Azure Lab Services](tutorial-setup-lab-plan.md).
- [Request a capacity increase](how-to-request-capacity-increase.md)

Advance to the next article to learn how to create a lab.
> [!div class="nextstepaction"]
> [Create a lab](quick-create-lab-portal.md)
