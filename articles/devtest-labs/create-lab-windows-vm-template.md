---
title: Create a lab using Azure DevTest Labs and Resource Manager template
description: In this tutorial, you create a lab in Azure DevTest Labs by using an Azure Resource Manager template. A lab admin sets up a lab, creates VMs in the lab, and configures policies.
ms.topic: tutorial
ms.date: 06/26/2020
---

# Tutorial: Set up a lab by using Azure DevTest Labs (Resource Manager template)
In this tutorial, you create a lab with a Windows Server 2019 Datacenter VM by using an Azure Resource Manager template. 

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

In this tutorial, you do the following actions:

> [!div class="checklist"]
> * Review the template 
> * Deploy the template
> * Verify the template
> * Cleanup resources

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

None.

## Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/101-dtl-create-lab-windows-vm/).

:::code language="json" source="~/quickstart-templates/101-dtl-create-lab-windows-vm/azuredeploy.json" range="1-97" highlight="51-85":::

The resources defined in the template include:

- [**Microsoft.DevTestLab/labs**](/azure/templates/microsoft.devtestlab/labs)
- [**Microsoft.DevTestLab labs/virtualnetworks**](/azure/templates/microsoft.devtestlab/labs/virtualnetworks)
- [**Microsoft.DevTestLab labs/virtualmachines**](/azure/templates/microsoft.devtestlab/labs/virtualmachines)

To find more template samples, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Devtestlab).

## Deploy the template
To run the deployment automatically, click the following button. 

[![Deploy to Azure](./media/create-lab-windows-vm-template/deploy-button.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-dtl-create-lab-windows-vm%2Fazuredeploy.json)

1. Create a **new resource group** so that it's easy to clean up later.
1. Select a **location** for the resource group. 
1. Enter a **name for the lab**. 
1. Enter a **name for the VM**. 
1. Enter a **user name** who can access the VM. 
1. Enter **password** for the user. 
1. Select **I agree to the terms and conditions stated above**. 
1. Then, select **Purchase**.

    :::image type="content" source="./media/create-lab-windows-vm-template/deploy-template-page.png" alt-text="Deploy Template page":::

## Verify the deployment
1. Select **Notifications** at the top to see the status of the deployment, and click **Deployment in progress** link.

    :::image type="content" source="./media/create-lab-windows-vm-template/deployment-notification.png" alt-text="Deployment notification":::
2. On the **Deployment - Overview** page, wait until the deployment is complete. This operation (especially, creating a VM) takes some time to complete. Then, select your **Go to resource group** or the **name of the resource group** as shown in the following image: 

    :::image type="content" source="./media/create-lab-windows-vm-template/navigate-resource-group.png" alt-text="Navigate to resource group":::
3. On the **Resource group** page, you see the list of resources in the resource group. Confirm that you see your lab of type: `DevTest Lab` in the resources. You also see the dependent resources such as virtual network and virtual machine in the resource group. 

    :::image type="content" source="./media/create-lab-windows-vm-template/resource-group-home-page.png" alt-text="Resource group's home page":::
4. Select your lab from the list of resource to see the home page for your lab. Confirm that you see the Windows Server 2019 Datacenter VM in the **My virtual machines** list. In the following image, the **Essentials** section is minimized. 

    :::image type="content" source="./media/create-lab-windows-vm-template/lab-home-page.png" alt-text="Home page for the lab":::

    > [!IMPORTANT] 
    > Keep this page open and follow instructions in the next section to clean up resources to avoid costs for running the lab and the VM on Azure. If you want to go through the next tutorial to test accessing the VM in the lab, clean up resources after you go through that tutorial. 

## Cleanup resources

1. First, delete the lab so that you can delete the resource group. You won't be able to delete the resource group with a lab in it. To delete the lab, select **Delete** on the toolbar. 

    :::image type="content" source="./media/create-lab-windows-vm-template/delete-lab-button.png" alt-text="Delete lab button":::
 2. On the confirmation page, type the **lab name**, and select **Delete**. 
 3. Wait until the lab is deleted. Select the **bell** icon to see notification from the delete operation. This process takes some time. Confirm the lab deletion, and then select the **resource group** on the breadcrumb menu. 
 
    :::image type="content" source="./media/create-lab-windows-vm-template/confirm-lab-deletion.png" alt-text="Confirm deletion of VM in notifications":::
 1. On the **Resource group** page, select **Delete resource group** from the toolbar. On the confirmation page, type the **resource group name**, and select **Delete**. Check the notifications to confirm that the resource group is deleted.
 
    :::image type="content" source="./media/create-lab-windows-vm-template/delete-resource-group-button.png" alt-text="Delete resource group button":::

## Next steps
In this tutorial, you created a lab with a VM. To learn about how to access the lab, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Access the lab](tutorial-use-custom-lab.md)

