---
title: Create an Azure AI services resource using the Azure CLI
titleSuffix: Azure AI services
description: Get started with Azure AI services by using Azure CLI commands to create and subscribe to a resource.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-services
keywords: Azure AI services, cognitive intelligence, cognitive solutions, ai services
ms.topic: quickstart
ms.date: 06/06/2022
ms.author: aahi
ms.custom:
  - mode-api
  - devx-track-azurecli
  - ignite-2023
ms.devlang: azurecli
---

Use this quickstart to create an Azure AI services resource using [Azure Command-Line Interface (CLI)](/cli/azure/install-azure-cli) commands. After you create the resource, use the keys and endpoint generated for you to authenticate your applications.

Azure AI services are cloud-based artificial intelligence (AI) services that help developers build cognitive intelligence into applications without having direct AI or data science skills or knowledge. They are available through REST APIs and client library SDKs in popular development languages. Azure AI services enables developers to easily add cognitive features into their applications with cognitive solutions that can see, hear, speak, and analyze.

## Prerequisites

* A valid Azure subscription - [Create one](https://azure.microsoft.com/free/cognitive-services) for free.
* The [Azure CLI](/cli/azure/install-azure-cli)
* [!INCLUDE [contributor-requirement](contributor-requirement.md)]
* [!INCLUDE [terms-azure-portal](terms-azure-portal.md)]

## Install the Azure CLI and sign in

Install the [Azure CLI](/cli/azure/install-azure-cli). To sign into your local installation of the CLI, run the [az login](/cli/azure/reference-index#az-login) command:

```azurecli-interactive
az login
```

You can also use the green **Try It** button to run these commands in your browser.

## Create a new Azure AI services resource group

Before you create an Azure AI services resource, you must have an Azure resource group to contain the resource. When you create a new resource, you can either create a new resource group, or use an existing one. This article shows how to create a new resource group.

### Choose your resource group location

To create a resource, you'll need one of the Azure locations available for your subscription. You can retrieve a list of available locations with the [az account list-locations](/cli/azure/account#az-account-list-locations) command. Most Azure AI services can be accessed from several locations. Choose the one closest to you, or see which locations are available for the service.

> [!IMPORTANT]
> * Remember your Azure location, as you will need it when calling the Azure AI services resources.
> * The availability of some Azure AI services can vary by region. For more information, see [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services).

```azurecli-interactive
az account list-locations --query "[].{Region:name}" --out table
```

After you have your Azure location, create a new resource group in the Azure CLI using the [az group create](/cli/azure/group#az-group-create) command. In the example below, replace the Azure location `westus2` with one of the Azure locations available for your subscription.

```azurecli-interactive
az group create --name ai-services-resource-group --location westus2
```

## Create an Azure AI services resource

### Choose a service and pricing tier

When you create a new resource, you'll need to know the kind of service you want to use, along with the [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/) (or SKU) you want. You'll use this and other information as parameters when you create the resource.

[!INCLUDE [SKUs and pricing](sku-pricing.md)]

You can find a list of available Azure AI services "kinds" with the [az cognitiveservices account list-kinds](/cli/azure/cognitiveservices/account#az-cognitiveservices-account-list-kinds) command:

```azurecli-interactive
az cognitiveservices account list-kinds
```

### Add a new resource to your resource group

To create and subscribe to a new Azure AI services resource, use the [az cognitiveservices account create](/cli/azure/cognitiveservices/account#az-cognitiveservices-account-create) command. This command adds a new billable resource to the resource group you created earlier. When you create your new resource, you'll need to know the "kind" of service you want to use, along with its pricing tier (or SKU) and an Azure location:

You can create a Standard S0 multi-service resource named `multi-service-resource` with the command below.

```azurecli-interactive
az cognitiveservices account create --name multi-service-resource --resource-group ai-services-resource-group  --kind CognitiveServices --sku F0 --location westus2 --yes
```

> [!Tip]
> If your subscription doesn't allow you to create an Azure AI services resource, you may need to enable the privilege of that [Azure resource provider](../../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) using the [Azure portal](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal), [PowerShell command](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell) or an [Azure CLI command](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-cli). If you are not the subscription owner, ask the *Subscription Owner* or someone with a role of *admin* to complete the registration for you or ask for the **/register/action** privileges to be granted to your account.

## Get the keys for your resource

To log into your local installation of the Command-Line Interface(CLI), use the [az login](/cli/azure/reference-index#az-login) command.

```azurecli-interactive
az login
```

Use the [az cognitiveservices account keys list](/cli/azure/cognitiveservices/account/keys#az-cognitiveservices-account-keys-list) command to get the keys for your resource.

```azurecli-interactive
az cognitiveservices account keys list  --name multi-service-resource --resource-group ai-services-resource-group
```

[!INCLUDE [environment-variables](environment-variables.md)]

## Pricing tiers and billing

Pricing tiers (and the amount you get billed) are based on the number of transactions you send using your authentication information. Each pricing tier specifies the:
* maximum number of allowed transactions per second (TPS).
* service features enabled within the pricing tier.
* The cost for a predefined number of transactions. Going above this amount will cause an extra charge as specified in the [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/custom-vision-service/) for your service.

## Get current quota usage for your resource

Use the [az cognitiveservices account list-usage](/cli/azure/cognitiveservices/account#az-cognitiveservices-account-list-usage) command to get the usage for your resource.

```azurecli-interactive
az cognitiveservices account list-usage --name multi-service-resource --resource-group ai-services-resource-group --subscription subscription-name
```

## Clean up resources

If you want to clean up and remove an Azure AI services resource, you can delete it or the resource group. Deleting the resource group also deletes any other resources contained in the group.

To remove the resource group and its associated resources, use the az group delete command.

```azurecli-interactive
az group delete --name ai-services-resource-group
```
