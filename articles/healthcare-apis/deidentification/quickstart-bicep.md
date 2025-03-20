---
title: "Quickstart: deploy the Azure Health Data Services de-identification service with Bicep"
description: "Quickstart: deploy the Azure Health Data Services de-identification service with Bicep."
author: jovinson-ms
ms.author: jovinson
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: quickstart-bicep
ms.custom: subject-bicepqs
ms.date: 11/06/2024
---

# Quickstart: Deploy the Azure Health Data Services de-identification service with Bicep

In this quickstart, you use a Bicep definition to deploy a de-identification service.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

If your environment meets the prerequisites and you're familiar with using Bicep, select the
**Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Bicep definition to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthdataaiservices%2Fdeidentification-service-create%2Fazuredeploy.json":::

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
[!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
[!INCLUDE [include](~/reusable-content//azure-powershell/azure-powershell-requirements-no-header.md)]

## Review the Bicep file

The Bicep file used in this quickstart is from
[Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/deidentification-service-create/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.healthdataaiservices/deidentification-service-create/main.bicep":::

The following Azure resources are defined in the Bicep file:

- [Microsoft.HealthDataAIServices/deidServices](/azure/templates/microsoft.healthdataaiservices/deidservices?pivots=deployment-language-bicep)

## Deploy the Bicep file

1. Save the Bicep file as `main.bicep` to your local computer.

1. Deploy the Bicep file by using either Azure CLI or Azure PowerShell, replacing `<deid-service-name>` with a name for your de-identification service.

    # [Azure CLI](#tab/azure-cli)

    This command requires Azure CLI version 2.6 or later. You can check the currently installed version by running `az --version`.

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters deidServiceName=<deid-service-name>
    ```
    
    # [Azure PowerShell](#tab/azure-powershell)
    
    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -deidServiceName "<deid-service-name>"
    ```
---

## Review deployed resources

Use the Azure portal, the Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [Azure CLI](#tab/azure-cli)

```azurecli
az resource list --resource-group exampleRG
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When you no longer need the resources, use the Azure portal, the Azure CLI, or Azure PowerShell to delete the resource group.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name exampleRG
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Azure Health De-identification client library for .NET](quickstart-sdk-net.md)