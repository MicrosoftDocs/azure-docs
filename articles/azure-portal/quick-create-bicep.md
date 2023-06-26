---
title: Create an Azure portal dashboard by using a Bicep file
description: Learn how to create an Azure portal dashboard by using a Bicep file.
ms.topic: quickstart
ms.custom: subject-bicepqs, devx-track-bicep
ms.date: 09/15/2022
---

# Quickstart: Create a dashboard in the Azure portal by using a Bicep file

A dashboard in the Azure portal is a focused and organized view of your cloud resources. This quickstart focuses on the process of deploying a Bicep file to create a dashboard. The dashboard shows the performance of a virtual machine (VM), and some static information and links.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure PowerShell](/powershell/azure/install-azure-powershell) or [Azure CLI](/cli/azure/install-azure-cli).

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-portal-dashboard/). The Bicep file for this article is too long to show here. To view the Bicep file, see [main.bicep](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.portal/azure-portal-dashboard/main.bicep). The Bicep file defines one Azure resource, a dashboard that displays data about the VM you created:

- [Microsoft.Portal/dashboards](/azure/templates/microsoft.portal/dashboards?pivots=deployment-language-bicep)

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.
    # [CLI](#tab/CLI)

    ```azurecli
    $resourceGroupName = 'SimpleWinVmResourceGroup'
    $location = 'eastus'
    $adminUserName = '<admin-user-name>'
    $adminPassword = '<admin-password>'
    $dnsLabelPrefix = '<dns-label-prefix>'
    $virtualMachineName = 'SimpleWinVM'
    $vmTemplateUri = 'https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.portal/azure-portal-dashboard/prereqs/prereq.azuredeploy.json'

    az group create --name $resourceGroupName --location $location
    az deployment group create --resource-group $resourceGroupName --template-uri $vmTemplateUri --parameters adminUsername=$adminUserName adminPassword=$adminPassword dnsLabelPrefix=$dnsLabelPrefix
    az deployment group create --resource-group $resourceGroupName --template-file main.bicep --parameters virtualMachineName=$virtualMachineName virtualMachineResourceGroup=$resourceGroupName
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    $resourceGroupName = 'SimpleWinVmResourceGroup'
    $location = 'eastus'
    $adminUserName = '<admin-user-name>'
    $adminPassword = '<admin-password>'
    $dnsLabelPrefix = '<dns-label-prefix>'
    $virtualMachineName = 'SimpleWinVM'
    $vmTemplateUri = 'https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.portal/azure-portal-dashboard/prereqs/prereq.azuredeploy.json'

    $encrypted = ConvertTo-SecureString -string $adminPassword -AsPlainText

    New-AzResourceGroup -Name $resourceGroupName -Location $location
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $vmTemplateUri -adminUsername $adminUserName -adminPassword $encrypted -dnsLabelPrefix $dnsLabelPrefix
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile ./main.bicep -virtualMachineName $virtualMachineName -virtualMachineResourceGroup $resourceGroupName
    ```

    ---

    Replace the following values in the script:

    - &lt;admin-user-name>: specify an administrator username.
    - &lt;admin-password>: specify an administrator password.
    - &lt;dns-label-prefix>: specify a DNS prefix.

    The Bicep file requires an existing virtual machine. Before deploying the Bicep file, the script deploys an ARM template located at *https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.portal/azure-portal-dashboard/prereqs/prereq.azuredeploy.json* for creating a virtual machine. The virtual machine name is hard-coded as **SimpleWinVM** in the ARM template.

When the deployment finishes, you should see a message indicating the deployment succeeded.

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
