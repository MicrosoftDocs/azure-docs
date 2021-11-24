---
title: Create a lab in Azure DevTest Labs by using an Azure Resource Manager template
description: In this quickstart, you use an Azure Resource Manager (ARM) template to create a lab with a virtual machine in Azure DevTest Labs.
ms.topic: quickstart
ms.custom: subject-armqs, mode-other
ms.date: 11/22/2021
---

# Quickstart: Use an ARM template to create a lab in DevTest Labs

This quickstart uses an Azure Resource Manager (ARM) template to create a lab with a Windows Server 2019 Datacenter virtual machine (VM) in Azure DevTest Labs.

In this quickstart, you take the following actions:

> [!div class="checklist"]
> * Review the ARM template.
> * Deploy the ARM template to create a lab and VM.
> * Verify the deployment.
> * Clean up resources.

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

This quickstart uses the [Creates a lab in Azure DevTest Labs with a claimed VM](https://azure.microsoft.com/resources/templates/dtl-create-lab-windows-vm-claimed) ARM template. The template defines the following resources:

- [Microsoft.DevTestLab/labs](/azure/templates/microsoft.devtestlab/labs) creates a DevTest Labs lab.
- [Microsoft.DevTestLab labs/virtualnetworks](/azure/templates/microsoft.devtestlab/labs/virtualnetworks) creates a DevTest Labs virtual network.
- [Microsoft.DevTestLab labs/virtualmachines](/azure/templates/microsoft.devtestlab/labs/virtualmachines) creates a DevTest Labs VM.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.devtestlab/dtl-create-lab-windows-vm-claimed/azuredeploy.json":::

For more ARM template samples, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Devtestlab).

## Deploy the template

1. Select the following **Deploy to Azure** button to sign in to the Azure portal and open the ARM template lab creation screen:

   [![Button that deploys the ARM template to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.devtestlab%2Fdtl-create-lab-windows-vm-claimed%2Fazuredeploy.json)

1. On the **Creates a lab in Azure DevTest Labs with a claimed VM** screen, fill out the following items:

   - **Resource group**: Select an existing resource group from the dropdown list, or create a new resource group so it's easy to clean up later.
   - **Region**: If you created a new resource group, select a location for the resource group.
   - **Lab Name**: Enter a name for the new lab.
   - **Vm Name**: Enter a name for the new VM.
   - **User Name**: Enter a name for the user who can access the VM.
   - **Password**: Enter a password for the user.

1. Select **Review + create**, and when validation passes, select **Create**.

   :::image type="content" source="./media/create-lab-windows-vm-template/deploy-template-page.png" alt-text="Screenshot of the Create a lab page.":::

1. Select **Review + create**, and when validation passes, select **Create**.

During the deployment, you can select the **Notifications** icon at the top of your screen to see deployment progress on the template **Overview** page. Deployment, especially creating a VM, takes a while.

## Validate the deployment

1. When the deployment is complete, select **Go to resource group** from the template **Overview** page or from **Notifications**.

   :::image type="content" source="./media/create-lab-windows-vm-template/navigate-resource-group.png" alt-text="Screenshot that shows deployment complete and the Go to resource group button.":::

1. The **Resource group** page lists the resources in the resource group, including your lab and its dependent resources like virtual networks and VMs. Select the **DevTest Lab** resource to go to your lab's **Overview** page.

   :::image type="content" source="./media/create-lab-windows-vm-template/resource-group-overview.png" alt-text="Screenshot of resource group overview.":::

1. On your lab's **Overview** page, you can see your VM under **My virtual machines**.

   :::image type="content" source="./media/create-lab-windows-vm-template/lab-home-page.png" alt-text="Screenshot that shows the lab Overview page with the virtual machine.":::

> [!NOTE]
> The deployment also creates a resource group for the VM. In the **Resource groups** list for your subscription, the resource group appears with the name **\<lab name>\<vm name>** plus a string of numbers.

## Clean up resources

Delete resources when you're finished with them to avoid charges for running the lab and VM.

1. On the lab overview page, select **Delete** from the top menu.

   :::image type="content" source="./media/create-lab-windows-vm-template/portal-lab-delete.png" alt-text="Screenshot of lab delete button.":::

1. On the **Are you sure you want to delete it** page, enter the lab name, and then select **Delete**.

During the deletion, you can select **Notifications** at the top of your screen to view progress. Deleting the lab takes a while.

If you created a new resource group for the lab, you can now delete the resource group. You can't delete a resource group that has a lab in it.

## Next steps
In this quickstart, you created a lab that has a VM. To learn how to access the lab and VM, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Access the lab](tutorial-use-custom-lab.md)
