---
title: Create an Azure portal dashboard by using an Azure Resource Manager template
description: Learn how to create an Azure portal dashboard by using an Azure Resource Manager template.
ms.topic: quickstart
ms.custom: subject-armqs
ms.date: 03/15/2021
---

# Quickstart: Create a dashboard in the Azure portal by using an ARM template

A dashboard in the Azure portal is a focused and organized view of your cloud resources. This quickstart focuses on the process of deploying an Azure Resource Manager template (ARM template) to create a dashboard. The dashboard shows the performance of a virtual machine (VM), as well as some static information and links.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.portal%2Fazure-portal-dashboard%2Fazuredeploy.json)

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An existing VM.

## Create a virtual machine

The dashboard you create in the next part of this quickstart requires an existing VM. Create a VM by following these steps.

1. In the Azure portal, select **Cloud Shell**.

    ![Select Cloud shell from the Azure portal ribbon](media/quick-create-template/cloud-shell.png)

1. In the **Cloud Shell** window, select **PowerShell**.

    ![Select PowerShell in the terminal window](media/quick-create-template/powershell.png)

1. Copy the following command and enter it at the command prompt to create a resource group.

    ```powershell
    New-AzResourceGroup -Name SimpleWinVmResourceGroup -Location EastUS
    ```

    ![Copy a command into the command prompt](media/quick-create-template/command-prompt.png)

1. Copy the following command and enter it at the command prompt to create a VM in the resource group.

    ```powershell
    New-AzVm `
        -ResourceGroupName "SimpleWinVmResourceGroup" `
        -Name "SimpleWinVm" `
        -Location "East US" 
    ```

1. Enter a username and password for the VM. This is a new user name and password; it's not, for example, the account you use to sign in to Azure. For more information, see [username requirements](../virtual-machines/windows/faq.yml#what-are-the-username-requirements-when-creating-a-vm-) and [password requirements](../virtual-machines/windows/faq.yml#what-are-the-password-requirements-when-creating-a-vm-).

    The VM deployment now starts and typically takes a few minutes to complete. After deployment completes, move on to the next section.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-portal-dashboard/). The template for this article is too long to show here. To view the template, see [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.portal/azure-portal-dashboard/azuredeploy.json). One Azure resource is defined in the template, [Microsoft.Portal/dashboards](/azure/templates/microsoft.portal/dashboards) - Create a dashboard in the Azure portal.

## Deploy the template

1. Select the following image to sign in to Azure and open a template.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.portal%2Fazure-portal-dashboard%2Fazuredeploy.json)

1. Select or enter the following values, then select **Review + create**.

    ![ARM template, create dashboard, deploy portal](media/quick-create-template/create-dashboard-using-template-portal.png)

    Unless it's specified, use the default values to create the dashboard.

    * **Subscription**: select an Azure subscription.
    * **Resource group**: select **SimpleWinVmResourceGroup**.
    * **Location**: select **East US**.
    * **Virtual Machine Name**: enter **SimpleWinVm**.
    * **Virtual Machine Resource Group**: enter **SimpleWinVmResourceGroup**.

1. Select **Create** or **Purchase**. After the dashboard has been deployed successfully, you get a notification:

    ![ARM template, create dashboard, deploy portal notification](media/quick-create-template/resource-manager-template-portal-deployment-notification.png)

The Azure portal was used to deploy the template. In addition to the Azure portal, you can also use Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md).

## Review deployed resources

[!INCLUDE [azure-portal-review-deployed-resources](../../includes/azure-portal-review-deployed-resources.md)]

## Clean up resources

If you want to remove the VM and associated dashboard, delete the resource group that contains them.

1. In the Azure portal, search for **SimpleWinVmResourceGroup**, then select it in the search results.

1. On the **SimpleWinVmResourceGroup** page, select **Delete resource group**, enter the resource group name to confirm, then select **Delete**.

    ![Delete resource group](media/quick-create-template/delete-resource-group.png)

## Next steps

For more information about dashboards in the Azure portal, see:

> [!div class="nextstepaction"]
> [Create and share dashboards in the Azure portal](azure-portal-dashboards.md)
