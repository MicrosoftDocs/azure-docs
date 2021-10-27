---
title: Manage lab plans in Azure Lab Services | Microsoft Docs
description: Learn how to create a lab plan, view all lab plans, or delete a lab plan in an Azure subscription.  
ms.topic: how-to
ms.date: 10/26/2021
---

# Create and manage lab plans

In Azure Lab Services, a lab plan is a container for managed lab types such as labs. An administrator sets up a lab plan with Azure Lab Services and provides access to lab owners who can create labs in the plan. This article describes how to create a lab plan, view all lab plans, or delete a lab plan.

## Create a lab account
The following steps illustrate how to use the Azure portal to create a lab account with Azure Lab Services. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** on the left menu. Type **lab** in the search filter. Then, select **Azure Lab Services**. If you select star (`*`) next to **Azure Lab Services**, it's added to the **FAVORITES** section on the left menu. From the next time onwards, you select **Azure Lab Services** under **FAVORITES**.

    :::image type="content" source="./media/tutorial-setup-lab-plan/select-lab-plans-service.png" alt-text="All Services -> Lab Plans":::
3. On the **Lab Accounts** page, select **Add** on the toolbar or **Create lab account** on the page.

    :::image type="content" source="./media/tutorial-setup-lab-plan/add-lab-plan-button.png" alt-text="Select Add on the Lab Plans page":::
4. On the **Basics** tab of the **Create a lab account** page, do the following actions:
    1. Select the **Azure subscription** in which you want to create the lab plan.
    2. For **Resource group**, select an existing resource group or select **Create new**, and enter a name for the resource group.
    3. For **Name**, enter a lab plan name.
    4. For **Region**, select a location/region in which you want to create the lab plan.

        :::image type="content" source="./media/tutorial-setup-lab-plan/lab-plan-basics-page.png" alt-text="Lab plan - basics page":::
5. Select **Next: Networking** at the bottom of the page.
6. If you want to host on a virtual network, select **Advanced**.

    1. For **Virtual network**, select a peer virtual network (VNet) for the lab network. Labs created in this plan are connected to the selected VNet and have access to the resources in the selected VNet. For more information, see [Connect your lab's virtual network with a peer virtual network](how-to-connect-peer-virtual-network.md).
    2. Specify the **subnet** for VMs in the lab. The address range should be in the classless inter-domain routing (CIDR) notation (example: 10.20.0.0/23). Virtual machines in the lab will be created in this address range. For more information, see [Specify an address range for VMs in the lab](how-to-connect-peer-virtual-network.md#specify-an-address-range-for-vms-in-the-lab-account)  

        > [!NOTE]
        > The **address range** property applies only if a **virtual network** is enabled for the lab.
        :::image type="content" source="./media/how-to-manage-lab-accounts/create-lab-plan-advanced-networking.png" alt-text="Create lab plan -> Networking":::

    1. Select an existing **shared image gallery** or create one. You can save the template VM in the shared image gallery for it to be reused by others. For detailed information on shared image galleries, see [Use a shared image gallery in Azure Lab Services](how-to-use-shared-image-gallery.md).
    2. Specify whether you want to **automatically shut down Windows virtual machines** when users disconnect from them. Specify how long the virtual machines should wait for the user to reconnect before automatically shutting down. 

        ![Create lab account -> Advanced](./media/how-to-manage-lab-accounts/create-lab-account-advanced.png)  
6. Select **Next: Tags** at the bottom of the page to switch to the **Tags** tab. Add any tags you want to associate with the lab account. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups. For more information, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

    ![Screenshot that shows the "Create lab account" page with the Tags tab highlighted.](./media/how-to-manage-lab-accounts/create-lab-account-tags.png)
7. Select **Review + create** at the bottom of this page to switch to the **Review + create** tab. 
4. Review the summary information on this page, and select **Create**. 

    ![Create lab account -> Tags](./media/how-to-manage-lab-accounts/create-lab-account-review-create.png)
5. Wait until the deployment is complete, expand **Next steps**, and select **Go to resource** as shown in the following image: 

    You can also select the **bell icon** on the toolbar (**Notifications**), confirm that the deployment succeeded, and then select **Go to resource**. 

    Alternatively, select **Refresh** on the **Lab Accounts** page, and select the lab account you created. 

    ![Create a lab account window](./media/tutorial-setup-lab-account/go-to-lab-account.png)    
6. You see the following **lab account** page:

    ![Lab account page](./media/tutorial-setup-lab-account/lab-account-page.png)

## View lab accounts
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All resources** from the menu. 
3. Select **Lab Accounts** for the **type**. 
    You can also filter by subscription, resource group, locations, and tags. 

    ![All resources -> Lab Accounts](./media/how-to-manage-lab-accounts/all-resources-lab-accounts.png)


## Delete a lab account
Follow instructions from the previous section that displays lab accounts in a list. Use the following instructions to delete a lab account: 

1. Select the **lab account** that you want to delete. 
2. Select **Delete** from the toolbar. 

    ![Lab Accounts -> Delete button](./media/how-to-manage-lab-accounts/delete-button.png)
1. Type **Yes** for confirmation.
1. Select **Delete**. 

    ![Delete lab account - confirmation](./media/how-to-manage-lab-accounts/delete-lab-account-confirmation.png)

> [!NOTE]
> You can also use the Az.LabServices PowerShell module (preview) to manage lab accounts. For more information, see the [Az.LabServices home page on GitHub](https://github.com/Azure/azure-devtestlab/tree/master/samples/ClassroomLabs/Modules/Library).

## Next steps
See other articles in the **How-to guides** -> **Create and configure lab accounts (lab account owner)** section of the table-of-content (TOC). 