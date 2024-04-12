---
title: Create an Azure portal dashboard by using an Azure Resource Manager template
description: Learn how to create an Azure portal dashboard by using an Azure Resource Manager template.
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
ms.date: 12/11/2023
---

# Quickstart: Create a dashboard in the Azure portal by using an ARM template

A [dashboard](azure-portal-dashboards.md) in the Azure portal is a focused and organized view of your cloud resources. This quickstart shows how to deploy an Azure Resource Manager template (ARM template) to create a dashboard. The example dashboard shows the performance of a virtual machine (VM), along with some static information and links.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal, where you can edit the details (such as the VM used in the dashboard) before you deploy.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.portal%2Fazure-portal-dashboard%2Fazuredeploy.json":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A virtual machine. The dashboard you create in the next part of this quickstart requires an existing VM called `myVM1` located in a resource group called `SimpleWinVmResourceGroup`. You can create this VM by following these steps:

    1. In the Azure portal, select **Cloud Shell** from the global controls at the top of the page.

        :::image type="content" source="media/quick-create-template/cloud-shell.png" alt-text="Screenshot showing the Cloud Shell option in the Azure portal.":::

    1. In the **Cloud Shell** window, select **PowerShell**.

        :::image type="content" source="media/quick-create-template/powershell.png" alt-text="Screenshot showing the PowerShell option in Cloud Shell.":::

    1. Copy the following command and enter it at the command prompt to create a resource group.

        ```powershell
        New-AzResourceGroup -Name SimpleWinVmResourceGroup -Location EastUS
        ```

    1. Next, copy the following command and enter it at the command prompt to create a VM in your new resource group.

        ```powershell
        New-AzVm `
            -ResourceGroupName "SimpleWinVmResourceGroup" `
            -Name "myVM1" `
            -Location "East US"
        ```

    1. Enter a username and password for the VM. This is a new username and password (not the account you use to sign in to Azure). The password must be complex. For more information, see [username requirements](../virtual-machines/windows/faq.yml#what-are-the-username-requirements-when-creating-a-vm-) and [password requirements](../virtual-machines/windows/faq.yml#what-are-the-password-requirements-when-creating-a-vm-).

    After the VM has been created, move on to the next section.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-portal-dashboard/). This template file is too long to show here. To view the template, see [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.portal/azure-portal-dashboard/azuredeploy.json). The template defines one Azure resource, a dashboard that displays data about your VM.

## Deploy the template

This example uses the Azure portal to deploy the template. You can also use other methods to deploy ARM templates, such as [Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md), [Azure CLI](../azure-resource-manager/templates/deploy-cli.md), or [REST API](../azure-resource-manager/templates/deploy-rest.md).

1. Select the following image to sign in to Azure and open a template.

    :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.portal%2Fazure-portal-dashboard%2Fazuredeploy.json":::

1. Select or enter the following values, then select **Review + create**.

    :::image type="content" source="media/quick-create-template/create-dashboard-using-template-portal.png" alt-text="Screenshot of the dashboard template deployment screen in the Azure portal.":::

    Unless it's specified, use the default values to create the dashboard.

    - **Subscription**: select the Azure subscription where the dashboard will be located.
    - **Resource group**: select **SimpleWinVmResourceGroup**.
    - **Location**: If not automatically selected, choose **East US**.
    - **Virtual Machine Name**: enter **myVM1**.
    - **Virtual Machine Resource Group**: enter **SimpleWinVmResourceGroup**.

1. Select **Create**. You'll see a notification confirming when the dashboard has been deployed successfully.

## Review deployed resources

[!INCLUDE [azure-portal-review-deployed-resources](../../includes/azure-portal-review-deployed-resources.md)]

## Clean up resources

If you want to remove the VM and associated dashboard, delete the resource group that contains them.

1. In the Azure portal, search for **SimpleWinVmResourceGroup**, then select it in the search results.

1. On the **SimpleWinVmResourceGroup** page, select **Delete resource group**, enter the resource group name to confirm, then select **Delete**.

> [!CAUTION]
> Deleting a resource group will delete all of the resources contained within it. If the resource group contains additional resources aside from your virtual machine and dashboard, those resources will also be deleted.

## Next steps

For more information about dashboards in the Azure portal, see:

> [!div class="nextstepaction"]
> [Create and share dashboards in the Azure portal](azure-portal-dashboards.md)
