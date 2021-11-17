---
title: Manage lab plans in Azure Lab Services | Microsoft Docs
description: Learn how to create a lab plan, view all lab plans, or delete a lab plan in an Azure subscription.  
ms.topic: how-to
ms.date: 10/26/2021
---

# Create and manage lab plans

In Azure Lab Services, a lab plan is a container for managed lab types such as labs. An administrator sets up a lab plan with Azure Lab Services and provides access to lab owners who can create labs in the plan. This article describes how to create a lab plan, view all lab plans, or delete a lab plan.

## Create a lab plan

The following steps illustrate how to use the Azure portal to create a lab plan with Azure Lab Services. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** on the left menu. Type **lab** in the search filter. Then, select **Azure Lab Services**. If you select star (`*`) next to **Azure Lab Services**, it's added to the **FAVORITES** section on the left menu. From the next time onwards, you select **Azure Lab Services** under **FAVORITES**.

    :::image type="content" source="./media/tutorial-setup-lab-plan/select-lab-plans-service.png" alt-text="All Services -> Lab Plans":::
3. On the **lab plans** page, select **Add** on the toolbar or **Create lab plan** on the page.

    :::image type="content" source="./media/tutorial-setup-lab-plan/add-lab-plan-button.png" alt-text="Select Add on the Lab Plans page":::
4. On the **Basics** tab of the **Create a lab plan** page, do the following actions:
    1. Select the **Azure subscription** in which you want to create the lab plan.
    2. For **Resource group**, select an existing resource group or select **Create new**, and enter a name for the resource group.
    3. For **Name**, enter a lab plan name.
    4. For **Region**, select a location/region in which you want to create the lab plan.

        :::image type="content" source="./media/tutorial-setup-lab-plan/lab-plan-basics-page.png" alt-text="Lab plan - basics page":::
5. Select **Next: Networking** at the bottom of the page.
6. To host on a virtual network, select **Enable advanced networking**.

    1. For **Virtual network**, select an existing virtual network for the lab network. For a virtual network to appear in this list, it must be in the same region as the lab plan. For more information, see [Connect to your virtual network](how-to-connect-vnet-injection.md).
    2. Specify an existing **subnet** for VMs in the lab. For a subnet to appear in this list, it must be delegated for use with lab plans when you configure the subnet for the virtual network. For more information, see [Add a virtual network subnet](/azure/virtual-network/virtual-network-manage-subnet).  

        :::image type="content" source="./media/how-to-manage-lab-plans/create-lab-plan-advanced-networking.png" alt-text="Create lab plan -> Networking":::
7. Select **Next: Tags** at the bottom of the page to switch to the **Tags** tab. Add any tags you want to associate with the lab plan. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups. For more information, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

    :::image type="content" source="./media/how-to-manage-lab-plans/create-lab-plan-tags.png" alt-text="Screenshot that shows the Create lab plan page with the Tags tab highlighted.":::
8. Select **Review + create** at the bottom of this page to switch to the **Review + create** tab.
9. Review the summary information on this page, and select **Create**.

    :::image type="content" source="./media/tutorial-setup-lab-plan/create-button.png" alt-text="Review + create -> Create":::
10. Wait until the deployment is complete, expand **Next steps**, and select **Go to resource** as shown in the following image:

    You can also select the **bell icon** on the toolbar (**Notifications**), confirm that the deployment succeeded, and then select **Go to resource**.

    Alternatively, select **Refresh** on the **Lab Plans** page, and select the lab plan you created.

    :::image type="content" source="./media/tutorial-setup-lab-plan/go-to-lab-plan.png" alt-text="Create a lab plan window":::
11. You see the following **lab plan** page:

    :::image type="content" source="./media/tutorial-setup-lab-plan/lab-plan-page.png" alt-text="Lab plan page":::

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
> You can also use the Az.LabServices PowerShell module (preview) to manage lab plans. For more information, see the [Az.LabServices home page on GitHub](https://aka.ms/azlabs/samples/PowerShellModule).

## Next steps

See other articles in the **How-to guides** -> **Create and configure lab plans** section of the table-of-content (TOC).