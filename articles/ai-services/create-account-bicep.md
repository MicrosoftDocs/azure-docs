---
title: Create an Azure AI services resource using Bicep | Microsoft Docs
description: Create an Azure AI service resource with Bicep.
keywords: Azure AI services, cognitive solutions, cognitive intelligence, cognitive artificial intelligence
author: eric-urban
ms.service: azure-ai-services
ms.topic: quickstart
ms.date: 8/1/2024
ms.author: eur
ms.custom:
  - subject-armqs
  - mode-arm
  - devx-track-bicep
  - ignite-2023
---

# Create an Azure AI services resource using Bicep

Follow this quickstart to create Azure AI services resource using Bicep.

[!INCLUDE [About AI services](./includes/ai-services-intro.md)]

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

## Things to consider

Using Bicep to create an Azure AI services resource lets you create a multi-service resource. This enables you to:

* Access multiple Azure AI services with a single key and endpoint.
* Consolidate billing from the services you use.

## Prerequisites

* If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/cognitive-services).

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/cognitive-services-universalkey/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.cognitiveservices/cognitive-services-universalkey/main.bicep":::

One Azure resource is defined in the Bicep file. The `kind` field in the Bicep file defines the type of resource.

As needed, change the `sku` parameter value to the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/) instance you want. The `sku` depends on the resource `kind` that you use. For example, use `TextAnalytics` for the Azure AI Language service. The `TextAnalytics` kind uses `S` instead of `S0` for the `sku` value.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
    ```

    ---

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Related content

* [Authenticate requests to Azure AI services](authentication.md).
* [What are Azure AI services?](./what-are-ai-services.md)
* [Natural language support](language-support.md)
* [Use Azure AI services as containers](cognitive-services-container-support.md).
* [Plan and manage costs for Azure AI services](plan-manage-costs.md).
