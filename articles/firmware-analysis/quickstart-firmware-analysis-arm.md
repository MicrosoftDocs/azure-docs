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

### [CLI](#tab/CLI)
```az cli
az group create --name fa-rg --location eastus
az deployment group create \
  --resource-group fa-rg \
  --name deploy-fa-workspace \
  --template-file ./azuredeploy.json \
  --parameters @./azuredeploy.parameters.json### Deploy by using Azure CLI
az login
az account set --subscription "<your-subscription-id>"
```

### [PowerShell](#tab/PowerShell)
```azure powershell

Connect-AzAccount
Set-AzContext -Subscription "<your-subscription-id>"
New-AzResourceGroup -Name fa-rg -Location eastus
New-AzResourceGroupDeployment `
  -ResourceGroupName fa-rg `
  -Name deploy-fa-workspace `
  -TemplateFile .\azuredeploy.json `
  -TemplateParameterFile .\azuredeploy.parameters.json

```

## Review deployed resources

Use any of the following methods:

- Azure portal: Search for firmware analysis, then select firmware workspaces.

### [CLI](#tab/CLI)

```azure cli

az resource list \
  --resource-group fa-rg \
  --resource-type Microsoft.IoTFirmwareDefense/workspaces \
  --output table
```

### [PowerShell](#tab/PowerShell)

```azure powershell

Get-AzResource -ResourceGroupName fa-rg `
  -ResourceType Microsoft.IoTFirmwareDefense/workspaces
```

## Clean up resources
When no longer needed, delete the resource group:

### [CLI](#tab/CLI)
```azure cli
az group delete --name fa-rg --yes --no-wait
```

### [PowerShell](#tab/PowerShell)
```azure powershell
Remove-AzResourceGroup -Name fa-rg -Force
```

## Next steps
For a step-by-step tutorial that guides you through the process of creating a template, see:
> [!div class="nextstepaction"]
> /azure/azure-resource-manager/templates/template-tutorial-create-first-template
