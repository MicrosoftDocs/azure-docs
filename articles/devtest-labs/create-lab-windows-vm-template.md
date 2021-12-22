---
title: Create a lab in Azure DevTest Labs by using an Azure Resource Manager template
description: Use an Azure Resource Manager (ARM) template to create a lab that has a virtual machine in Azure DevTest Labs.
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm
ms.date: 12/21/2021
---

# Quickstart: Use an ARM template to create a lab in DevTest Labs

This quickstart uses an ARM template to create a lab that has one Windows Server 2019 Datacenter virtual machine (VM).

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

Azure DevTest Labs can use Azure Resource Manager (ARM) templates to help carry out many tasks, from creating and provisioning labs to adding users. This quickstart uses the [Creates a lab with a claimed VM](https://azure.microsoft.com/resources/templates/dtl-create-lab-windows-vm-claimed) ARM template from the [Azure Quickstart Templates gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Devtestlab). The template defines the following resources:

- [Microsoft.DevTestLab/labs](/azure/templates/microsoft.devtestlab/labs) creates the lab.
- [Microsoft.DevTestLab labs/virtualnetworks](/azure/templates/microsoft.devtestlab/labs/virtualnetworks) creates a virtual network.
- [Microsoft.DevTestLab labs/virtualmachines](/azure/templates/microsoft.devtestlab/labs/virtualmachines) creates the lab VM.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.devtestlab/dtl-create-lab-windows-vm-claimed/azuredeploy.json":::

The [Azure Quickstart Templates gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Devtestlab) and the [Azure Quickstart Templates public GitHub repository](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.devtestlab) have several other DevTest Labs ARM quickstart templates that you can use.

## Deploy the template

Select the following **Deploy to Azure** button to sign in to the Azure portal and open the the quickstart ARM template to the lab creation screen:

[![Button that deploys the ARM template to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.devtestlab%2Fdtl-create-lab-windows-vm-claimed%2Fazuredeploy.json)

Or, to deploy the quickstart template from the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com), enter *arm template* in the top search bar, and then select **Deploy a custom template**.

1. On the **Custom deployment** screen, make sure **Quickstart template** is selected, and select the dropdown arrow next to **Quickstart template (disclaimer)**.

1. Type *devtest* in the filter box, and then select the **dtl-create-lab-windows-vm-claimed** template from the popup list.

1. Select **Select template**. You can also select **Edit template** to make your own modifications to the template.

   :::image type="content" source="./media/create-lab-windows-vm-template/custom-deployment.png" alt-text="Screenshot of selecting the template on the Custom deployment page.":::

To create the lab and VM:

1. On the **Creates a lab in Azure DevTest Labs with a claimed VM** screen, complete the following items:

   - **Resource group**: Select an existing resource group from the dropdown list, or create a new resource group so it's easy to clean up later.
   - **Region**: If you created a new resource group, select a location for the resource group and lab.
   - **Lab Name**: Enter a name for the new lab.
   - **Vm Name**: Enter a name for the new VM.
   - **User Name**: Enter a name for the user who can access the VM.
   - **Password**: Enter a password for the VM user.

1. Select **Review + create**, and when validation passes, select **Create**.

   :::image type="content" source="./media/create-lab-windows-vm-template/deploy-template-page.png" alt-text="Screenshot of the Create a lab page.":::

1. During the deployment, you can select the **Notifications** icon at the top of the screen to see deployment progress on the template **Overview** page. Deployment, especially creating a VM, takes a while.

## Validate the deployment

1. When the deployment is complete, select **Go to resource group** from the template **Overview** page or from **Notifications**.

   :::image type="content" source="./media/create-lab-windows-vm-template/navigate-resource-group.png" alt-text="Screenshot that shows deployment complete and the Go to resource group button.":::

1. The **Resource group** page lists the resources in the resource group, including your lab and its dependent resources like virtual networks and VMs. Select the **DevTest Lab** resource to go to the new lab's **Overview** page.

   :::image type="content" source="./media/create-lab-windows-vm-template/resource-group-overview.png" alt-text="Screenshot of resource group overview.":::

1. On your lab's **Overview** page, you can see your VM under **My virtual machines**.

   :::image type="content" source="./media/create-lab-windows-vm-template/lab-home-page.png" alt-text="Screenshot that shows the lab Overview page with the virtual machine.":::

> [!NOTE]
> The deployment also creates a resource group for the VM. The resource group contains VM resources like the IP address, network interface, and disk. The resource group appears in your subscription's **Resource groups** list with the name **\<lab name>-\<vm name>-\<numerical string>**.

## Clean up resources

When you're finished with these lab resources, delete them to avoid further charges. You can't delete a resource group that has a lab in it, so delete the lab first:

1. On the lab overview page, select **Delete** from the top menu.

   :::image type="content" source="./media/create-lab-windows-vm-template/portal-lab-delete.png" alt-text="Screenshot of lab delete button.":::

1. On the **Are you sure you want to delete it** page, enter the lab name, and then select **Delete**.

   During the deletion, you can select **Notifications** at the top of your screen to view progress. Deleting the lab takes a while.

You can now delete the resource group that contained the lab, which deletes all resources in the resource group.

1. Select the resource group that contained the lab from your subscription's **Resource groups** list.

1. At the top of the page, select **Delete resource group**.

1. On the **Are you sure you want to delete "\<resource group name>"** page, enter the resource group name, and then select **Delete**.

## Next steps

In this quickstart, you created a lab that has a Windows VM. To learn how to connect to and manage lab VMs, see the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Work with lab VMs](tutorial-use-custom-lab.md)
