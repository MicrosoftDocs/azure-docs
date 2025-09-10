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

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!NOTE]
> Role requirements for working with firmware (for example, **Firmware Analysis Admin** or **Security Admin**) are described in the service documentation.


## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/firmwareanalysis-create-workspace/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.firmwareanalysis/firmwareanalysis-create-workspace/azuredeploy.json":::

The following resource is defined in the template:

- **[Microsoft.IoTFirmwareDefense/workspaces](/azure/templates/microsoft.iotfirmwaredefense/workspaces)**


## **Deploy the template**

You can deploy the template by using the **Azure CLI**, **Azure PowerShell**, or the **Azure portal**.


### [Azure CLI](#tab/azure-cli)

```azurecli
# Variables
rgName=fa-rg
location=eastus
deploymentName=deploy-fa-workspace

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
$rgName = 'fa-rg'
$location = 'eastus'
$deploymentName = 'deploy-fa-workspace'

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
