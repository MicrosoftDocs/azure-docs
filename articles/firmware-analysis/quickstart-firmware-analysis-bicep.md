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

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- **Permissions**: `Owner` or `Contributor` on the target resource group (or higher) to deploy resources.  
- **Azure CLI**: Install the /cli/azure/install-azure-cli and sign in with `az login`. If you use `az deployment group create`, use Azure CLI **2.6.0 or later**. Check with `az --version`.  
- **Azure PowerShell**: Install the /powershell/azure/install-azure-powershell and sign in with `Connect-AzAccount`.
- **Register the resource provider** (one-time per subscription):  
  - Azure CLI: `az provider register --namespace Microsoft.IoTFirmwareDefense`  
  - PowerShell: `Register-AzResourceProvider -ProviderNamespace Microsoft.IoTFirmwareDefense`

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/firmwareanalysis-create-workspace/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.firmwareanalysis/firmwareanalysis-create-workspace/main.bicep":::

The following resource is defined in the Bicep file:

- **[Microsoft.IoTFirmwareDefense/workspaces](/azure/templates/microsoft.iotfirmwaredefense/workspaces)**


## Deploy the Bicep file

Save the Bicep file as main.bicep to your local computer.


Deploy the Bicep file by using either Azure CLI or Azure PowerShell.
Azure CLI is recommended.

---

### [Azure CLI](#tab/azure-cli)

```azurecli
# Variables
rgName=rg-fw-analysis-qs
location=westeurope          # or your preferred region
workspaceName=fa-workspace-001

# Create resource group
az group create --name $rgName --location $location

# Deploy
az deployment group create \
  --resource-group $rgName \
  --template-file ./main.bicep \
  --parameters workspaceName=$workspaceName location=$location
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell

# Variables
$rgName = 'rg-fw-analysis-qs'
$location = 'westeurope'      # or your preferred region
$workspaceName = 'fa-workspace-001'

# Create resource group
New-AzResourceGroup -Name $rgName -Location $location

# Deploy
$params = @{ workspaceName = $workspaceName; location = $location }
New-AzResourceGroupDeployment -ResourceGroupName $rgName -TemplateFile ./main.bicep -TemplateParameterObject $params

```

---

## Review deployed resources

### [Azure CLI](#tab/azure-cli)

```azurecli

az resource show \
  --resource-group rg-fw-analysis-qs \
  --name fa-workspace-001 \
  --resource-type Microsoft.IoTFirmwareDefense/workspaces

# Or list all workspaces in the resource group
az resource list --resource-group rg-fw-analysis-qs --resource-type Microsoft.IoTFirmwareDefense/workspaces -o table

```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell

# Show a specific workspace
Get-AzResource -ResourceGroupName rg-fw-analysis-qs `
  -ResourceType 'Microsoft.IoTFirmwareDefense/workspaces' `
  -Name fa-workspace-001 | Format-List

# List all workspaces in the resource group
Get-AzResource -ResourceGroupName rg-fw-analysis-qs `
  -ResourceType 'Microsoft.IoTFirmwareDefense/workspaces'

```

---

## Clean up resources

### [Azure CLI](#tab/azure-cli)

```azurecli

echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."

```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell

$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."

```

---

## Next steps

> [!div class="nextstepaction"]
> [Analyze firmware images in the Azure portal](/azure/firmware-analysis/quickstart-firmware-analysis-portal)

