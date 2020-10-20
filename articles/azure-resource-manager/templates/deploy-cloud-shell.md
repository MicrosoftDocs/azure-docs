---
title: Deploy templates with Cloud Shell
description: Use Azure Resource Manager and Cloud Shell to deploy resources to Azure. The resources are defined in an Azure Resource Manager template.
ms.topic: conceptual
ms.date: 10/20/2020
---
# Deploy ARM templates from Cloud Shell

You can use [Cloud Shell](../../cloud-shell/overview.md) to deploy an Azure Resource Manager template (ARM template). You can deploy either an ARM template that is stored remotely, or an ARM template that is stored on the local storage account for the cloud shell.

You can deploy to any scope. This article shows deploying to a resource group.

## Deploy remote template

To deploy an external template, provide the URI of the template exactly as you would for any external deployment. The external template could be in a GitHub repository or and an external storage account.

1. Open the Cloud Shell prompt.

   :::image type="content" source="./media/deploy-cloud-shell/open-cloud-shell.png" alt-text="Open Cloud Shell":::

1. To deploy the template, use the following commands:

   # [Azure CLI](#tab/azure-cli)

   ```azurecli-interactive
   az group create --name ExampleGroup --location "Central US"
   az deployment group create \
     --name ExampleDeployment \
     --resource-group ExampleGroup \
     --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json" \
     --parameters storageAccountType=Standard_GRS
   ```

   # [PowerShell](#tab/azure-powershell)

   ```azurepowershell-interactive
   New-AzResourceGroup -Name ExampleGroup -Location "Central US"
   New-AzResourceGroupDeployment `
     -DeploymentName ExampleDeployment `
     -ResourceGroupName ExampleGroup `
     -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json `
     -storageAccountType Standard_GRS
   ```

   ---

## Deploy local template

To deploy a local template, you must first upload your template to the storage account that is connected to your Cloud Shell session.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select your Cloud Shell resource group. The name pattern is `cloud-shell-storage-<region>`.

   ![Select resource group](./media/deploy-cloud-shell/select-cloud-shell-resource-group.png)

1. Select the storage account for your Cloud Shell.

   :::image type="content" source="./media/deploy-cloud-shell/cloud-shell-storage.png" alt-text="Select storage account":::

1. Select **File Shares**.

   :::image type="content" source="./media/deploy-cloud-shell/files-shares.png" alt-text="Select file shares":::

1. Select the default file share for your cloud shell. The file share has the name format of `cs-<user>-<domain>-com-<uniqueGuid>`.

   :::image type="content" source="./media/deploy-cloud-shell/select-file-share.png" alt-text="Default file share":::

1. Add a new directory to hold your templates. Select that directory.

   :::image type="content" source="./media/deploy-cloud-shell/add-directory.png" alt-text="Add directory":::

1. Select **Upload**.

   :::image type="content" source="./media/deploy-cloud-shell/upload-template.png" alt-text="Upload template":::

1. Find and upload your template.

   :::image type="content" source="./media/deploy-cloud-shell/select-template.png" alt-text="Select template":::

1. Open the Cloud Shell prompt.

   :::image type="content" source="./media/deploy-cloud-shell/open-cloud-shell.png" alt-text="Open Cloud Shell":::

1. Navigate to the **clouddrive** directory. Navigate to the directory you added for holding the templates.

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
- To preview changes before deploying a template, see [ARM template deployment what-if operation](template-deploy-what-if.md).
