---
title: Create an Azure AI services resource using Bicep | Microsoft Docs
description: Create an Azure AI service resource with Bicep.
keywords: Azure AI services, cognitive solutions, cognitive intelligence, cognitive artificial intelligence
services: cognitive-services
author: aahill
ms.service: cognitive-services
ms.topic: quickstart
ms.date: 01/19/2023
ms.author: aahi
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Create an Azure AI services resource using Bicep

Follow this quickstart to create Azure AI services resource using Bicep.

Azure AI services are cloud-based artificial intelligence (AI) services that help developers build cognitive intelligence into applications without having direct AI or data science skills or knowledge. They are available through REST APIs and client library SDKs in popular development languages. Azure AI services enables developers to easily add cognitive features into their applications with cognitive solutions that can see, hear, speak, and analyze.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Things to consider

Using Bicep to create an Azure AI services resource lets you create a multi-service resource. This enables you to:

* Access multiple Azure AI services with a single key and endpoint.
* Consolidate billing from the services you use.
* [!INCLUDE [terms-azure-portal](./includes/quickstarts/terms-azure-portal.md)]

## Prerequisites

* If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/cognitive-services).

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/cognitive-services-universalkey/).

> [!NOTE]
> * If you use a different resource `kind` (listed below), you may need to change the `sku` parameter to match the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/) tier you wish to use. For example, the `TextAnalytics` kind uses `S` instead of `S0`.
> * Many of the Azure AI services have a free `F0` pricing tier that you can use to try the service.

Be sure to change the `sku` parameter to the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/) instance you want. The `sku` depends on the resource `kind` that you are using. For example, `TextAnalytics` 

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.cognitiveservices/cognitive-services-universalkey/main.bicep":::

One Azure resource is defined in the Bicep file: [Microsoft.CognitiveServices/accounts](/azure/templates/microsoft.cognitiveservices/accounts) specifies that it is an Azure AI services resource. The `kind` field in the Bicep file defines the type of resource.

[!INCLUDE [SKUs and pricing](./includes/quickstarts/sku-pricing.md)]

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

If you need to recover a deleted resource, see [Recover or purge deleted Azure AI services resources](recover-purge-resources.md).

## See also

* See **[Authenticate requests to Azure AI services](authentication.md)** on how to securely work with Azure AI services.
* See **[What are Azure AI services?](./what-are-ai-services.md)** for a list of Azure AI services.
* See **[Natural language support](language-support.md)** to see the list of natural languages that Azure AI services supports.
* See **[Use Azure AI services as containers](cognitive-services-container-support.md)** to understand how to use Azure AI services on-prem.
* See **[Plan and manage costs for Azure AI services](plan-manage-costs.md)** to estimate cost of using Azure AI services.
