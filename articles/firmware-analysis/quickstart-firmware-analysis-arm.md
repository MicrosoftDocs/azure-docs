---
title: Create a firmware analysis workspace using Azure Resource Manager
description: Learn how to create a firmware analysis workspace by using Azure Resource Manager.
ms.topic: quickstart
ms.date: 09/09/2025
author: karengu0
ms.author: karenguo
ms.service: azure
ms.custom: subject-armqs

---

# Quickstart: Create a firmware analysis workspace using ARM

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create a **firmware analysis** workspace. A workspace is the Azure resource that stores your firmware uploads and analysis results for the firmware analysis service.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

- **Azure CLI**:  [Install](/cli/azure/install-azure-cli) Azure CLI and sign in with `az login`. If you use `az deployment group create`, use Azure CLI **2.6.0 or later**. Check with `az --version`.
- **Azure PowerShell**: [Install](/powershell/azure/install-azure-powershell) and sign in with `Connect-AzAccount`.

- **Register the resource provider** (one-time per subscription):  
  ### [Azure CLI](#tab/azure-cli)
  ```azurecli
  az provider register --namespace Microsoft.IoTFirmwareDefense
  ```

  ### [Azure PowerShell](#tab/azure-powershell)
  ```azurepowershell
  Register-AzResourceProvider -ProviderNamespace Microsoft.IoTFirmwareDefense
  ```

  ---

- **Permissions**: `Owner` or `Contributor` on the target resource group (or higher) to deploy resources. For more information, visit the [service documentation](firmware-analysis-rbac.md#overview-of-azure-role-based-access-control-for-firmware-analysis).


## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/firmwareanalysis-create-workspace/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.firmwareanalysis/firmwareanalysis-create-workspace/azuredeploy.json":::

The following resource is defined in the template:

- **[Microsoft.IoTFirmwareDefense/workspaces](/azure/templates/microsoft.iotfirmwaredefense/workspaces)**


## **Deploy the template**

Deploy the Bicep file by using either Azure CLI or Azure PowerShell.

Replace `{provide-the-rg-name}` and the curly braces `{}` with your resource group name. Replace `{provide-the-deployment-name}` and the curly braces `{}` with your workspace name. 


### [Azure CLI](#tab/azure-cli)

```azurecli
# Variables
rgName={provide-the-rg-name}
location=westeurope          # or your preferred region
deploymentName={provide-the-deployment-name}

# Login (if needed)
az login
az account set --subscription "<your-subscription-id>"

# Create resource group
az group create --name $rgName --location $location

# Deploy
az deployment group create \
  --resource-group $rgName \
  --name $deploymentName \
  --template-file ./azuredeploy.json \
  --parameters @./azuredeploy.parameters.json
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Variables
$rgName = '{provide-the-rg-name}'
$location = 'westeurope'      # or your preferred region
$deploymentName = '{provide-the-deployment-name}'

Connect-AzAccount
Set-AzContext -Subscription "<your-subscription-id>"

New-AzResourceGroup -Name $rgName -Location $location

New-AzResourceGroupDeployment `
  -ResourceGroupName $rgName `
  -Name $deploymentName `
  -TemplateFile .\azuredeploy.json `
  -TemplateParameterFile .\azuredeploy.parameters.json
```

---


## Review deployed resources

Use any of the following methods:

- Azure portal: Search for firmware analysis, then select firmware workspaces.

### [Azure CLI](#tab/azure-cli)

```azurecli
az resource list \
  --resource-group $rgName \
  --resource-type Microsoft.IoTFirmwareDefense/workspaces \
  --output table
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResource -ResourceGroupName $rgName `
  -ResourceType Microsoft.IoTFirmwareDefense/workspaces
```

---

## Clean up resources
When no longer needed, delete the resource group:

### [Azure CLI](#tab/azure-cli)

```azurecli
# Delete resource group
az group delete --name $rgName --yes --no-wait
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Delete resource group
Remove-AzResourceGroup -Name $rgName -Force
```

---

## Next steps
For a step-by-step tutorial that guides you through the process of creating a template, see:
> [!div class="nextstepaction"]
> /azure/azure-resource-manager/templates/template-tutorial-create-first-template
