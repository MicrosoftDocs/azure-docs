---
title: Deploy templates with Cloud Shell
description: Use Azure Resource Manager and Azure Cloud Shell to deploy resources to Azure. The resources are defined in an Azure Resource Manager template (ARM template).
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 03/20/2024
---

# Deploy ARM templates from Azure Cloud Shell

You can use [Azure Cloud Shell](../../cloud-shell/overview.md) to deploy an Azure Resource Manager template (ARM template). You can deploy either an ARM template that is stored remotely, or an ARM template that is stored on the local storage account for Cloud Shell.

You can deploy to any scope. This article shows deploying to a resource group.

[!INCLUDE [permissions](../../../includes/template-deploy-permissions.md)]

## Deploy remote template

To deploy an external template, provide the URI of the template exactly as you would for any external deployment. The external template could be in a GitHub repository or and an external storage account.

1. Open the Cloud Shell prompt.

   :::image type="content" source="./media/deploy-cloud-shell/open-cloud-shell.png" alt-text="Screenshot of the button to open Cloud Shell.":::

1. To deploy the template, use the following commands:

   # [Azure CLI](#tab/azure-cli)

   ```azurecli-interactive
   az group create --name ExampleGroup --location "Central US"
   az deployment group create \
     --name ExampleDeployment \
     --resource-group ExampleGroup \
     --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json" \
     --parameters storageAccountType=Standard_GRS
   ```

   # [PowerShell](#tab/azure-powershell)

   ```azurepowershell-interactive
   New-AzResourceGroup -Name ExampleGroup -Location "Central US"
   New-AzResourceGroupDeployment `
     -DeploymentName ExampleDeployment `
     -ResourceGroupName ExampleGroup `
     -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json `
     -storageAccountType Standard_GRS
   ```

   ---

## Deploy local template

To deploy a local template, you must first upload your template to the storage account that is connected to your Cloud Shell session.

1. Sign in to the [Cloud Shell](https://shell.azure.com).

1. Select either **PowerShell** or **Bash**.

   :::image type="content" source="./media/deploy-cloud-shell/cloud-shell-bash-powershell.png" alt-text="Screenshot of the option to select Bash or PowerShell in Cloud Shell.":::

1. Select **Upload/Download files**, and then select **Upload**.

   :::image type="content" source="./media/deploy-cloud-shell/cloud-shell-upload.png" alt-text="Screenshot of the Cloud Shell interface with the Upload file option highlighted.":::

1. Select the ARM template you want to upload, and then select **Open**.

1. To deploy the template, use the following commands:

   # [Azure CLI](#tab/azure-cli)

   ```azurecli-interactive
   az group create --name ExampleGroup --location "South Central US"
   az deployment group create \
     --resource-group ExampleGroup \
     --template-file azuredeploy.json \
     --parameters storageAccountType=Standard_GRS
   ```

   # [PowerShell](#tab/azure-powershell)

   ```azurepowershell-interactive
   New-AzResourceGroup -Name ExampleGroup -Location "Central US"
   New-AzResourceGroupDeployment `
     -DeploymentName ExampleDeployment `
     -ResourceGroupName ExampleGroup `
     -TemplateFile azuredeploy.json `
     -storageAccountType Standard_GRS
   ```

   ---

## Next steps

- For more information about deployment commands, see [Deploy resources with ARM templates and Azure CLI](deploy-cli.md) and [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md).
- To preview changes before deploying a template, see [ARM template deployment what-if operation](./deploy-what-if.md).
