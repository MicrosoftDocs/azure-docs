---
title: Create a lab in Azure DevTest Labs by using an Azure Resource Manager template
description: In this quickstart, you create a lab in Azure DevTest Labs by using an Azure Resource Manager template (ARM template). A lab admin sets up a lab, creates VMs in the lab, and configures policies.
ms.topic: quickstart
ms.custom: subject-armqs
ms.date: 10/15/2021
---

# Quickstart: Use an ARM template to create a lab in DevTest Labs

In this quickstart, you use an Azure Resource Manager template (ARM template) to create a lab in Azure DevTest Labs. The lab contains a Windows Server 2019 Datacenter virtual machine (VM).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

In this quickstart, you do the following actions:

> [!div class="checklist"]
> * Review the template.
> * Deploy the template.
> * Verify the deployment.
> * Clean up resources.

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Review the template

This quickstart uses the [Creates a lab in Azure DevTest Labs with a Windows Server VM](https://azure.microsoft.com/resources/templates/dtl-create-lab-windows-vm/) template. The template defines the following resources:

- [Microsoft.DevTestLab/labs](/azure/templates/microsoft.devtestlab/labs)
- [Microsoft.DevTestLab labs/virtualnetworks](/azure/templates/microsoft.devtestlab/labs/virtualnetworks)
- [Microsoft.DevTestLab labs/virtualmachines](/azure/templates/microsoft.devtestlab/labs/virtualmachines)

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.devtestlab/dtl-create-lab-windows-vm/azuredeploy.json":::

For more ARM template samples, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Devtestlab).

## Deploy the template

If you have an Azure subscription, select the following **Deploy to Azure** button to use the ARM template. The template opens the lab creation screen in the Azure portal:

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.devtestlab%2Fdtl-create-lab-windows-vm%2Fazuredeploy.json)

1. On the **Creates a lab in Azure DevTest Labs with a Windows Server VM** screen, fill out the following items:

   - **Resource group**, create a new resource group so it's easy to clean up later.
   - **Region**, select a location for the resource group.
   - **Lab Name**, enter a name for the new lab instance.
   - **Vm Name**, enter a name for the VM to create. 
   - **User Name**, enter a name for the user who can access the VM. 
   - **Password**, enter a password for the user.

1. Select **Review + create**, and when validation passes, select **Create**.

   :::image type="content" source="./media/create-lab-windows-vm-template/deploy-template-page.png" alt-text="Screenshot of the Create a lab page.":::

## Validate the deployment
1. During the deployment, you can select **Notifications** at the top of your screen, and select **Deployment in progress** to see the deployment **Overview** page. Deployment, especially creating a VM, takes a while.

   :::image type="content" source="./media/create-lab-windows-vm-template/deployment-notification.png" alt-text="Screenshot showing the deployment in progress.":::

1. When the deployment is complete, select **Go to resource group** to go to the resource group for your lab.

   :::image type="content" source="./media/create-lab-windows-vm-template/navigate-resource-group.png" alt-text="Screenshot that shows deployment complete and the Go to resource group button.":::

1. The **Resource group** page lists the resources in the resource group, including your lab and its dependent resources like virtual networks and VMs. Select your **DevTest Lab** resource to go to your lab's **Overview** page.

1. On your lab's **Overview** page, select **Claimable virtual machines**.

   :::image type="content" source="./media/create-lab-windows-vm-template/lab-home-page.png" alt-text="Screenshot that shows the lab Overview page with the Claimable virtual machines link.":::

1. On the **Claimable virtual machines** page, select the **More options** ellipsis next to the VM, and select **Claim machine**.

   :::image type="content" source="./media/create-lab-windows-vm-template/claim-vm.png" alt-text="Screenshot that shows the Claimable virtual machines page with the Claim machine option.":::

1. On the lab **Overview** page, confirm that the VM appears under **My virtual machines** with status **Starting**. Wait for the status to change to **Running**.

   :::image type="content" source="./media/create-lab-windows-vm-template/lab-vm.png" alt-text="Screenshot that shows the lab Overview page with the V M listed.":::

## Clean up resources

Delete the quickstart resources to avoid charges for running the lab and VM on Azure. If you plan to go through the next tutorial to access the VM in the lab, you can clean up the resources after you finish that tutorial.

You can't delete a resource group with a lab in it. First delete the lab so you can delete the resource group.

1. From the lab's home page, select **Delete** on the toolbar.

   :::image type="content" source="./media/create-lab-windows-vm-template/delete-lab-button.png" alt-text="Screenshot that shows the Delete button on the lab home page.":::

1. On the confirmation page, type the lab name, and then select **Delete**.

1. During the deletion, you can select **Notifications** at the top of your screen to view progress. Deleting the lab takes awhile.

1. Once the lab is deleted, select the **Resource group** on the lab's home page. If the lab's home page is no longer available, search for **Resource groups** in the Azure search box, and then select the resource group that contained your lab.

   :::image type="content" source="./media/create-lab-windows-vm-template/confirm-lab-deletion.png" alt-text="Screenshot that shows deletion confirmation in notifications.":::

1. On the **Resource group** page, select **Delete resource group** from the toolbar. On the confirmation page, type the resource group name, and select **Delete**. You can check notifications to confirm that the resource group is deleted.
 
   :::image type="content" source="./media/create-lab-windows-vm-template/delete-resource-group-button.png" alt-text="Screenshot that shows the Delete resource group button.":::

## Next steps
In this quickstart, you created a lab that has a VM. To learn how to access the lab and VM, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Access the lab](tutorial-use-custom-lab.md)
