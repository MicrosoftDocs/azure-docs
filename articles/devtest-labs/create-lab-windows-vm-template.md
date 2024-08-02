---
title: Create labs from ARM templates
titleSuffix: Azure DevTest Labs
description: Create labs with virtual machines in Azure DevTest Labs by using Azure Resource Manager (ARM) templates.
ms.topic: quickstart
ms.author: rosemalcolm
author: RoseHJM
ms.custom: subject-armqs, mode-arm, devx-track-arm-template, UpdateFrequency2
ms.date: 06/19/2024

#customer intent: As a developer, I want to use ARM templates in Azure DevTest Labs so that I can create labs with virtual machines.
---

# Quickstart: Use ARM templates to create labs in Azure DevTest Labs

In this quickstart, you use an Azure Resource Manager (ARM) template to create a lab in Azure DevTest Labs that has one Windows Server 2019 Datacenter virtual machine (VM) in it.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

DevTest Labs can use ARM templates for many tasks, from creating and provisioning labs to adding users. This quickstart uses the [Creates a lab with a claimed VM](https://azure.microsoft.com/resources/templates/dtl-create-lab-windows-vm-claimed) ARM template from the [Azure Quickstart Templates gallery](/samples/browse/?expanded=azure&products=azure-resource-manager).

## Prerequisites

- If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review template resources

The **Creates a lab with a claimed VM** ARM template defines the following resource types:

- [Microsoft.DevTestLab/labs](/azure/templates/microsoft.devtestlab/labs?pivots=deployment-language-arm-template): Creates the lab resource.
- [Microsoft.DevTestLab/labs/virtualnetworks](/azure/templates/microsoft.devtestlab/labs/virtualnetworks?pivots=deployment-language-arm-template): Creates a virtual network for the lab.
- [Microsoft.DevTestLab/labs/virtualmachines](/azure/templates/microsoft.devtestlab/labs/virtualmachines?pivots=deployment-language-arm-template): Creates the VM for the lab.

The _azuredeploy.json_ template file defines the following schema:

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.devtestlab/dtl-create-lab-windows-vm-claimed/azuredeploy.json":::

More templates for Azure DevTest Labs are available in the [Azure Quickstart Templates gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Devtestlab) and [Azure Quickstart Templates public GitHub repository](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.devtestlab). The [Azure Lab Services Community public GitHub repository](https://github.com/Azure/azure-devtestlab/tree/master) offers many DevTest Labs resources. You can find [artifacts](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts), [environments](https://github.com/Azure/azure-devtestlab/tree/master/Environments), [PowerShell scripts](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts), and [quickstart ARM templates](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates) that you can use and customize for your scenario.

## Deploy the template

The following steps deploy the ARM template and create a DevTest Labs VM:

1. Select the following **Deploy to Azure** button to sign in to the Azure portal and open the quickstart ARM template:

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Image of a button with the label Deploy to Azure, which deploys the ARM template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.devtestlab%2Fdtl-create-lab-windows-vm-claimed%2Fazuredeploy.json":::

1. On the **Creates a lab in Azure DevTest Labs with a claimed VM** pane, configure the following settings:

   - **Resource group**: Select an existing resource group from the dropdown list, or create a new resource group.
   - **Region**: If you create a new resource group, select a location for the resource group and lab.
   - **Lab Name**: Enter a name for the new lab.
   - **Vm Name**: Enter a name for the new VM.
   - **Vm Size**: Select a size for the new VM.
   - **User Name**: Enter a name for the user who can access the VM.
   - **Password**: Enter a password for the VM user.

1. Select **Review + create**, and after validation passes, select **Create**.

   :::image type="content" source="./media/create-lab-windows-vm-template/deploy-template.png" border="false" alt-text="Screenshot of the configuration page for a new VM based on the Creates a lab in Azure DevTest Labs with a claimed VM template." lightbox="./media/create-lab-windows-vm-template/deploy-template-large.png":::

1. During deployment, you can monitor the deployment progress on the template **Overview** page:

   :::image type="content" source="./media/create-lab-windows-vm-template/monitor-deployment.png" alt-text="Screenshot that shows the deployment in progress for the new lab and claimed VM on the template Overview page." lightbox="./media/create-lab-windows-vm-template/monitor-deployment-large.png":::

   > [!NOTE]
   > The process to deploy a new lab with claimed VM can take a long time.

## Validate the deployment

1. When the deployment completes, select **Go to resource group** from the template **Overview** page or from the Azure portal **Notifications**:

   :::image type="content" source="./media/create-lab-windows-vm-template/open-resource-group.png" alt-text="Screenshot that shows deployment complete and the Go to resource group option.":::

1. The **Resource group** page lists the resources in the resource group, including the new lab and its dependent resources like virtual networks and VMs. To open the lab **Overview** page, select the **DevTest Lab** resource for your new lab in list:

   :::image type="content" source="./media/create-lab-windows-vm-template/open-lab.png" alt-text="Screenshot that shows how to access the new lab on the  resource group Overview page." lightbox="./media/create-lab-windows-vm-template/open-lab-large.png":::

1. On the lab **Overview** page, you can see the new VM under **My virtual machines**:

   :::image type="content" source="./media/create-lab-windows-vm-template/lab-virtual-machine.png" alt-text="Screenshot that shows the new virtual machine for the newly deployed lab." lightbox="./media/create-lab-windows-vm-template/lab-virtual-machine-large.png":::

> [!NOTE]
> The deployment also creates a resource group for the VM. The resource group contains VM resources like the IP address, network interface, and disk. The VM resource group appears in your subscription's **Resource groups** list with the name _\<lab name>-\<vm name>-\<numerical string>_.

## Clean up resources

When you're done with the lab resources, delete them to avoid further charges. Before you can delete the resource group, you must first delete the lab.

1. Go to the lab **Overview** page and select **Delete**:

   :::image type="content" source="./media/create-lab-windows-vm-template/delete-lab.png" alt-text="Screenshot that shows how to delete a lab in the Azure portal.":::

1. On the confirmation page, enter the lab name, and select **Delete**.

   During the deletion, you can select **Notifications** at the top of your screen to view progress.
   
   > [!NOTE]
   > Deleting the lab can take several minutes.

   After you delete the lab, you can delete the resource group that contained the lab, which deletes all other resources in the resource group.

1. Go to your subscription's **Resource groups** list.

1. Select the resource group that contained the lab.

1. At the top of the page, select **Delete resource group**.

1. On the confirmation page, enter the resource group name, and then select **Delete**.

## Related content

- [Tutorial: Work with lab VMs](tutorial-use-custom-lab.md)
