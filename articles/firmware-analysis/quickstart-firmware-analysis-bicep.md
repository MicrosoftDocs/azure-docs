---
title: Create a firmware analysis workspace by using Bicep
description: In this quickstart, use Bicep to deploy a firmware analysis workspace in Azure. This quickstart includes Bicep, Azure CLI, and Azure PowerShell steps.
author: karengu0
ms.author: karenguo
ms.service: azure
ms.topic: quickstart-bicep
ms.custom: subject-bicepqs
ms.date: 08/28/2025
---

# Quickstart: Deploy a firmware analysis workspace with Bicep

In this quickstart, you use Bicep to deploy a firmware analysis workspace so your team can upload and analyze IoT/OT device firmware for potential vulnerabilities and weaknesses.

/azure/azure-resource-manager/includes/resource-manager-quickstart-bicep-introduction.md]

[Bicep](../../articles/azure-resource-manager/bicep/overview.md) is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse. Bicep offers the best authoring experience for your infrastructure-as-code solutions in Azure.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- **Permissions**: `Owner` or `Contributor` on the target resource group (or higher) to deploy resources.  
- **Azure CLI**: Install the /cli/azure/install-azure-cli and sign in with `az login`. If you use `az deployment group create`, use Azure CLI **2.6.0 or later**. Check with `az --version`.  
- **Azure PowerShell**: Install the /powershell/azure/install-azure-powershell and sign in with `Connect-AzAccount`.
- **Register the resource provider** (one-time per subscription):  
  - Azure CLI: `az provider register --namespace Microsoft.IoTFirmwareDefense`  
  - PowerShell: `Register-AzResourceProvider -ProviderNamespace Microsoft.IoTFirmwareDefense`

## Review the Bicep file

The following Bicep file creates a firmware analysis workspace in the specified resource group and region.

```JSON 
@description('Name of the firmware analysis workspace.')
param workspaceName string

@description('Location for the workspace.')
param location string = resourceGroup().location

@description('Optional tags to apply to the workspace.')
param tags object = {}

resource workspace 'Microsoft.IoTFirmwareDefense/workspaces@2025-04-01-preview' = {
  name: workspaceName
  location: location
  tags: tags
  properties: {}
}

output workspaceId string = workspace.id
output workspaceNameOut string = workspace.name
```

## Deploy the Bicep file


Save the Bicep file as main.bicep to your local computer.


Deploy the Bicep file by using either Azure CLI or Azure PowerShell.
Azure CLI is recommended.

### Azure CLI

```azurecli
# Variables
rgName=rg-fw-analysis-qs
location=westeurope          # or your preferred region
workspaceName=fa-workspace-001

# Create resource group
az group create --name $rgName --location $location

# (One-time) Register the provider if needed
az provider register --namespace Microsoft.IoTFirmwareDefense

# Deploy
az deployment group create \
  --resource-group $rgName \
  --template-file ./main.bicep \
  --parameters workspaceName=$workspaceName location=$location
```

### Azure Powershell

```azure powershell

# Variables
$rgName = 'rg-fw-analysis-qs'
$location = 'westeurope'      # or your preferred region
$workspaceName = 'fa-workspace-001'

# Create resource group
New-AzResourceGroup -Name $rgName -Location $location

# (One-time) Register the provider if needed
Register-AzResourceProvider -ProviderNamespace Microsoft.IoTFirmwareDefense

# Deploy
$params = @{ workspaceName = $workspaceName; location = $location }
New-AzResourceGroupDeployment -ResourceGroupName $rgName -TemplateFile ./main.bicep -TemplateParameterObject $params

```

## Review deployed resources

### Azure CLI

```azure cli

az resource show \
  --resource-group rg-fw-analysis-qs \
  --name fa-workspace-001 \
  --resource-type Microsoft.IoTFirmwareDefense/workspaces

# Or list all workspaces in the resource group
az resource list --resource-group rg-fw-analysis-qs --resource-type Microsoft.IoTFirmwareDefense/workspaces -o table

```

### Azure Powershell

```azure powershell

# Show a specific workspace
Get-AzResource -ResourceGroupName rg-fw-analysis-qs `
  -ResourceType 'Microsoft.IoTFirmwareDefense/workspaces' `
  -Name fa-workspace-001 | Format-List

# List all workspaces in the resource group
Get-AzResource -ResourceGroupName rg-fw-analysis-qs `
  -ResourceType 'Microsoft.IoTFirmwareDefense/workspaces'

```

## Clean up resources

### Azure CLI

```azure cli

echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."

```

### Azure Powershell

```azure powershell

$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."

```

## Next steps

> [!div class="nextstepaction"]
> [Analyze firmware images in the Azure portal](/azure/firmware-analysis/quickstart-firmware-analysis-portal)

