---
title: 'How-to: Create and deploy an Azure OpenAI Service resource'
titleSuffix: Azure OpenAI
description: Learn how to get started with Azure OpenAI Service and create your first resource and deploy your first model in the Azure CLI or the Azure portal.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.custom: devx-track-azurecli, build-2023, build-2023-dataai, devx-track-azurepowershell
ms.topic: how-to
ms.date: 08/25/2023
zone_pivot_groups: openai-create-resource
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
---

# Create and deploy an Azure OpenAI Service resource

This article describes how to get started with Azure OpenAI Service and provides step-by-step instructions to create a resource and deploy a model. You can create resources in Azure in several different ways:

- The [Azure portal](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_openai_tip#create/Microsoft.CognitiveServicesOpenAI)
- The REST APIs, the Azure CLI, PowerShell, or client libraries
- Azure Resource Manager (ARM) templates

In this article, you review examples for creating and deploying resources in the Azure portal and with the Azure CLI.

::: zone pivot="web-portal"

[!INCLUDE [Azure portal resource](../includes/create-resource-portal.md)]

::: zone-end

::: zone pivot="cli"

[!INCLUDE [Azure CLI resource](../includes/create-resource-cli.md)]

::: zone-end

::: zone pivot="ps"

[!INCLUDE [Azure PowerShell resource](../includes/create-resource-powershell.md)]

::: zone-end

## Next steps

- Make API calls and generate text with [Azure OpenAI Service quickstarts](../quickstart.md).
- Learn more about the [Azure OpenAI Service models](../concepts/models.md).
- For information on pricing visit the [Azure OpenAI pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/)
