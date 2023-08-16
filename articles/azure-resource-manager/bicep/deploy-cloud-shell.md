---
title: Deploy Bicep files with Cloud Shell
description: Use Azure Resource Manager and Azure Cloud Shell to deploy resources to Azure. The resources are defined in a Bicep file.
ms.topic: conceptual
ms.custom: devx-track-bicep, devx-track-arm-template
ms.date: 06/23/2023
---

# Deploy Bicep files from Azure Cloud Shell

You can use [Azure Cloud Shell](../../cloud-shell/overview.md) to deploy a Bicep file. Currently you can only deploy  a local Bicep file from the Cloud Shell.

You can deploy to any scope. This article shows deploying to a resource group.

## Deploy local Bicep file

To deploy a local Bicep file, you must first upload your Bicep file to your Cloud Shell session.

1. Sign in to the [Cloud Shell](https://shell.azure.com).
1. Select either **PowerShell** or **Bash**.

    :::image type="content" source="./media/deploy-cloud-shell/bicep-cloud-shell-bash-powershell.png" alt-text="Select Bash or PowerShell":::

1. Select **Upload/Download files**, and then select **Upload**.

    :::image type="content" source="./media/deploy-cloud-shell/bicep-cloud-shell-upload.png" alt-text="Upload file":::

1. Select the Bicep file you want to upload, and then select **Open**.
1. To deploy the Bicep file, use the following commands:

   # [Azure CLI](#tab/azure-cli)

   ```azurecli-interactive
   az group create --name ExampleGroup --location "South Central US"
   az deployment group create \
     --resource-group ExampleGroup \
     --template-file azuredeploy.bicep \
     --parameters storageAccountType=Standard_GRS
   ```

   # [PowerShell](#tab/azure-powershell)

   ```azurepowershell-interactive
   New-AzResourceGroup -Name ExampleGroup -Location "Central US"
   New-AzResourceGroupDeployment `
     -DeploymentName ExampleDeployment `
     -ResourceGroupName ExampleGroup `
     -TemplateFile azuredeploy.bicep `
     -storageAccountType Standard_GRS
   ```

   ---

## Next steps

- For more information about deployment commands, see [Deploy resources with Bicep and Azure CLI](deploy-cli.md) and [Deploy resources with Bicep and Azure PowerShell](deploy-powershell.md).
- To preview changes before deploying a Bicep file, see [Bicep deployment what-if operation](./deploy-what-if.md).
