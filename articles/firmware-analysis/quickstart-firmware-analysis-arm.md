---
title: Create a firmware analysis workspace by using Azure Resource Manager template (ARM template)
description: Learn how to create a firmware analysis workspace by using an Azure Resource Manager template (ARM template).
services: azure-resource-manager
ms.service: azure-resource-manager
author: karengu0
ms.author: karenguo
ms.topic: quickstart-arm
ms.custom: subject-armqs
ms.date: 09/09/2025

# Customer intent: As a cloud administrator, I want a quick method to deploy an Azure resource for production environments or to evaluate the service's functionality.
---

# Quickstart: Create a firmware analysis workspace using ARM

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create a **firmware analysis** workspace. A workspace is the Azure resource that stores your firmware uploads and analysis results for the firmware analysis service.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!NOTE]
> Role requirements for working with firmware (for example, **Firmware Analysis Admin** or **Security Admin**) are described in the service documentation.


## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://learn.microsoft.com/samples/azure/azure-quickstart-templates/firmwareanalysis-create-workspace/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.firmwareanalysis/firmwareanalysis-create-workspace/azuredeploy.json":::

The following resource is defined in the template:

- **[Microsoft.IoTFirmwareDefense/workspaces](/azure/templates/microsoft.iotfirmwaredefense/workspaces)**


## **Deploy the template**

You can deploy the template by using the **Azure CLI**, **Azure PowerShell**, or the **Azure portal**.

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

## Deploy by using Azure Powershell

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

- Azure CLI:

```azure cli

az resource list \
  --resource-group fa-rg \
  --resource-type Microsoft.IoTFirmwareDefense/workspaces \
  --output table
```

- Azure PowerShell:

```azure powershell

Get-AzResource -ResourceGroupName fa-rg `
  -ResourceType Microsoft.IoTFirmwareDefense/workspaces
```

## Clean up resources
When no longer needed, delete the resource group:

```azure cli
az group delete --name fa-rg --yes --no-wait
```

```azure powershell
Remove-AzResourceGroup -Name fa-rg -Force
```

## Next steps
For a step-by-step tutorial that guides you through the process of creating a template, see:
> [!div class="nextstepaction"]
> /azure/azure-resource-manager/templates/template-tutorial-create-first-template
