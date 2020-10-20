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

[!INCLUDE [resource-manager-cloud-shell-deploy.md](../../../includes/resource-manager-cloud-shell-deploy.md)]

To deploy the template, use the following commands:

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

- To specify how to handle resources that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
- To understand how to define parameters in your template, see [Understand the structure and syntax of ARM templates](template-syntax.md).
- For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](common-deployment-errors.md).
