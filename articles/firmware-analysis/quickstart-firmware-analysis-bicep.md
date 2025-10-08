---
title: Create a firmware analysis workspace using Bicep
description: In this article, you learn how to create a firmware analysis workspace using Bicep.
ms.topic: quickstart
ms.date: 09/09/2025
author: karengu0
ms.author: karenguo
ms.service: azure
ms.custom: subject-bicepqs
---

# Quickstart: Create a firmware analysis workspace using Bicep

In this quickstart, you use Bicep to deploy a firmware analysis workspace so your team can upload and analyze IoT/OT device firmware for potential vulnerabilities and weaknesses.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

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


## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/firmwareanalysis-create-workspace/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.firmwareanalysis/firmwareanalysis-create-workspace/main.bicep":::

The following resource is defined in the Bicep file:

- **[Microsoft.IoTFirmwareDefense/workspaces](/azure/templates/microsoft.iotfirmwaredefense/workspaces)**


## Deploy the Bicep file

Save the Bicep file as main.bicep to your local computer.

Deploy the Bicep file by using either Azure CLI or Azure PowerShell.

Replace `{provide-the-rg-name}` and the curly braces `{}` with your resource group name. Replace `{provide-the-workspace-name}` and the curly braces `{}` with your workspace name. 


### [Azure CLI](#tab/azure-cli)

```azurecli
# Variables
rgName={provide-the-rg-name}
location=westeurope          # or your preferred region
workspaceName={provide-the-workspace-name}

# Create resource group
az group create --name $rgName --location $location

# Deploy
az deployment group create \
  --resource-group $rgName \
  --template-file ./main.bicep \
  --parameters workspaceName=$workspaceName 
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell

# Variables
$rgName = '{provide-the-rg-name}'
$location = 'westeurope'      # or your preferred region
$workspaceName = '{provide-the-workspace-name}'

# Create resource group
New-AzResourceGroup -Name $rgName -Location $location

# Deploy
$params = @{ workspaceName = $workspaceName; location = $location }
New-AzResourceGroupDeployment -ResourceGroupName $rgName `
  -TemplateFile ./main.bicep -TemplateParameterObject $params

```

---

## Review deployed resources

### [Azure CLI](#tab/azure-cli)

```azurecli
# Show a specific workspace
az resource show \
  --resource-group $rgName \
  --name $workspaceName \
  --resource-type Microsoft.IoTFirmwareDefense/workspaces

# Or list all workspaces in the resource group
az resource list --resource-group $rgName `
  --resource-type Microsoft.IoTFirmwareDefense/workspaces -o table
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Show a specific workspace
Get-AzResource -ResourceGroupName $rgName `
  -ResourceType 'Microsoft.IoTFirmwareDefense/workspaces' `
  -Name $workspaceName | Format-List

# List all workspaces in the resource group
Get-AzResource -ResourceGroupName $rgName `
  -ResourceType 'Microsoft.IoTFirmwareDefense/workspaces'
```

---

## Clean up resources

### [Azure CLI](#tab/azure-cli)

```azurecli
# Delete the resource group (non-interactive example)
az group delete --name $rgName --yes --no-wait
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Delete the resource group
Remove-AzResourceGroup -Name $rgName -Force
```

---

## Next steps

> [!div class="nextstepaction"]
> [Analyze firmware images in the Azure portal](/azure/firmware-analysis/quickstart-firmware-analysis-portal)

