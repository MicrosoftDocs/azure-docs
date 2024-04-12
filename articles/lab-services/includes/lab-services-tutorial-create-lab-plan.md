---
ms.service: lab-services
ms.date: 01/25/2023
ms.topic: include
ms.service: lab-services
---

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Select **Create a resource** in the upper left-hand corner of the Azure portal.

    :::image type="content" source="../media/lab-services-tutorial-create-lab-plan/azure-portal-create-resource.png" alt-text="Screenshot that shows the Azure portal home page, highlighting the Create a resource button." lightbox="../media/lab-services-tutorial-create-lab-plan/azure-portal-create-resource.png":::

1. Enter *Lab Plan* in the search field, and then select **Create** > **Lab plan**.

    :::image type="content" source="../media/lab-services-tutorial-create-lab-plan/select-lab-plans-service.png" alt-text="Screenshot of the Azure Marketplace and how to search for and create a lab plan resource." lightbox="../media/lab-services-tutorial-create-lab-plan/select-lab-plans-service.png":::

1. On the **Basics** tab of the **Create a lab plan** page, provide the following information:

    | Field        | Description                |
    | ------------ | -------------------------- |
    | **Subscription** | Select the Azure subscription that you want to use for this lab plan resource. |
    | **Resource group** | Select **Create New** and enter *MyResourceGroup*. |
    | **Name** | Enter *MyLabPlan* as the lab plan name. |
    | **Region** | Select a geographic location to host your lab plan resource. |

1. After you finish configuring the resource, select **Review + Create**.

1. Review all the configuration settings and select **Create** to start the deployment of the Lab Plan.

1. To view the new resource, select **Go to resource**.

    :::image type="content" source="../media/lab-services-tutorial-create-lab-plan/create-lab-plan-deployment-complete.png" alt-text="Screenshot that the deployment of the lab plan resource is complete.":::

1. Confirm that you see the Lab Plan **Overview** page for *MyLabPlan*.

    :::image type="content" source="../media/lab-services-tutorial-create-lab-plan/lab-plan-page.png" alt-text="Screenshot that shows the lab plan overview page in the Azure portal." lightbox="../media/lab-services-tutorial-create-lab-plan/lab-plan-page.png":::
