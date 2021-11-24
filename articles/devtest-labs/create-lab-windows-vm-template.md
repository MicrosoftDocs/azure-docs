---
title: Create a lab in Azure DevTest Labs by using an Azure Resource Manager template
description: In this quickstart, you create a lab in Azure DevTest Labs by using an Azure Resource Manager template (ARM template). A lab admin sets up a lab, creates VMs in the lab, and configures policies.
ms.topic: quickstart
ms.custom: subject-armqs, mode-other
ms.date: 10/29/2021
---

# Quickstart: Use an ARM template to create a lab in DevTest Labs

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create a lab in Azure DevTest Labs. The lab contains a Windows Server 2019 Datacenter virtual machine (VM).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.devtestlab%2Fdtl-create-lab-windows-vm-claimed%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Devtestlab).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.devtestlab/dtl-create-lab-windows-vm-claimed/azuredeploy.json":::

Three Azure resources are defined in the template:

- [Microsoft.DevTestLab/labs](/azure/templates/microsoft.devtestlab/labs): create a DevTest Labs lab.
- [Microsoft.DevTestLab labs/virtualnetworks](/azure/templates/microsoft.devtestlab/labs/virtualnetworks): create a DevTest Labs virtual network.
- [Microsoft.DevTestLab labs/virtualmachines](/azure/templates/microsoft.devtestlab/labs/virtualmachines): create a DevTest Labs virtual machine.

For more ARM template samples, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Devtestlab).

## Deploy the template

1. Select the **Deploy to Azure** button below to sign in to Azure and open the ARM template.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.devtestlab%2Fdtl-create-lab-windows-vm-claimed%2Fazuredeploy.json)

1. Enter or select the following values:

    |Property | Description |
    |---|---|
    |Subscription| From the drop-down list, select the Azure subscription to be used for the lab.|
    |Resource group| From the drop-down list, select your existing resource group, or select **Create new**.|
    |Region | The value will autopopulate with the location used for the resource group.|
    |Lab Name| Enter a lab name unique for the subscription.|
    |Location| Leave as is. |
    |Vm Name| Enter a VM name unique for the subscription.|
    |Vm Size | Leave as is. |
    |User Name | Enter a user name for the VM.|
    |Password| Enter a password between 8 and 123 characters long.|

   :::image type="content" source="./media/create-lab-windows-vm-template/deploy-template-page.png" alt-text="Screenshot of the Create a lab page.":::

1. Select **Review + create**, and when validation passes, select **Create**. You'll then be taken to the deployment **Overview** page where you can monitor progress. Deployment times will vary based on the selected hardware, base image, and artifacts. The deployment time for the configurations used in this template is approximately 12 minutes.

## Validate the deployment

1. Once the deployment is complete, select **Go to resource group** from either the template **Overview** page or from **Notifications**.

   :::image type="content" source="./media/create-lab-windows-vm-template/navigate-resource-group.png" alt-text="Screenshot that shows deployment complete and the Go to resource group button.":::

1. The **Resource group** page lists the resources in the resource group, including your lab and its dependent resources like virtual networks and VMs. Select your **DevTest Lab** resource to go to your lab's **Overview** page.

   :::image type="content" source="./media/create-lab-windows-vm-template/resource-group-overview.png" alt-text="Screenshot of resource group overview.":::

1. On your lab's **Overview** page, you can see your VM under section **My virtual machines**.

   :::image type="content" source="./media/create-lab-windows-vm-template/lab-home-page.png" alt-text="Screenshot that shows the lab Overview page with the virtual machine.":::

1. Step back and list the resource groups for your subscription. Observe that the deployment created a new resource group to hold the VM. The syntax is the lab name + VM name + random numbers. Based on the values used in this article, the autogenerated name is `MyOtherLab-myVM-173385`.

   :::image type="content" source="./media/create-lab-windows-vm-template/resource-group-list.png" alt-text="Screenshot of resource group list.":::

## Clean up resources

Delete resources to avoid charges for running the lab and VM on Azure. If you plan to go through the next tutorial to access the VM in the lab, you can clean up the resources after you finish that tutorial. Otherwise, follow these steps: 

1. Return to the home page for the lab you created.

1. From the top menu, select **Delete**.

   :::image type="content" source="./media/create-lab-windows-vm-template/portal-lab-delete.png" alt-text="Screenshot of lab delete button.":::

1. On the **Are you sure you want to delete it** page, enter the lab name in the text box and then select **Delete**.

1. During the deletion, you can select **Notifications** at the top of your screen to view progress. Deleting the lab takes a while. Continue to the next step once the lab is deleted.

1. If you created the lab in an existing resource group, then all of the lab resources have been removed. If you created a new resource group for this tutorial, it's now empty and can be deleted. It wouldn't have been possible to have deleted the resource group earlier while the lab was still in it.

## Next steps
In this quickstart, you created a lab that has a VM. To learn how to access the lab and VM, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Access the lab](tutorial-use-custom-lab.md)
