---
title: 'Create and deploy a HealthInsights resource using CLI'
titleSuffix: Azure AI Health Insights
description: Learn how to use the Azure CLI to create a HealthInsights resource.
author: hvanhoe
ms.author: hvanhoe
ms.service: azure-health-insights
ms.topic: include
ms.date: 04/16/2024
---

## Prerequisites

- An Azure subscription.
- The Azure CLI. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

## Sign in to the Azure CLI

[Sign in](/cli/azure/authenticate-azure-cli) to the Azure CLI or select **Open Cloudshell** in the following steps.

## Create an Azure resource group

To create an Azure Health Insights resource, you need an Azure resource group. When you create a new resource through the Azure CLI, you can also create a new resource group or instruct Azure to use an existing group. The following example shows how to create a new resource group named _HealthInsightsResourceGroup_ with the [az group create](/cli/azure/group?view=azure-cli-latest&preserve-view=true#az-group-create) command. The resource group is created in the East US location. 

```azurecli
az group create \
--name HealthInsightsResourceGroup \
--location eastus
```

## Create a resource

Use the [az cognitiveservices account create](/cli/azure/cognitiveservices/account?view=azure-cli-latest&preserve-view=true#az-cognitiveservices-account-create) command to create an Azure Health Insights resource in the resource group. In the following example, you create a resource named _HealthInsightsResource_ in the _HealthInsightsResourceGroup_ resource group. When you try the example, update the code to use your desired values for the resource group and resource name, along with your Azure subscription ID.

```azurecli
az cognitiveservices account create \
--name HealthInsightsResource \
--resource-group HealthInsightsResourceGroup \
--kind HealthInsights \
--sku F0 \
--location eastus \
--custom-domain healthinsightsresource \
--subscription <subscriptionID>
```

## Retrieve information about the resource

After you create the resource, you can use different commands to find useful information about your Azure Health Insights instance. The following examples demonstrate how to retrieve the REST API endpoint base URL and the access keys for the new resource.

### Get the endpoint URL

Use the [az cognitiveservices account show](/cli/azure/cognitiveservices/account?view=azure-cli-latest&preserve-view=true#az-cognitiveservices-account-show) command to retrieve the REST API endpoint base URL for the resource. In this example, we direct the command output through the [jq](https://jqlang.github.io/jq/) JSON processor to locate the `.properties.endpoint` value.

When you try the example, update the code to use your values for the resource group and resource.

```azurecli
az cognitiveservices account show \
--name HealthInsightsResource \
--resource-group HealthInsightsResourceGroup \
| jq -r .properties.endpoint
```

### Get the primary API key

To retrieve the access keys for the resource, use the [az cognitiveservices account keys list](/cli/azure/cognitiveservices/account?view=azure-cli-latest&preserve-view=true#az-cognitiveservices-account-keys-list) command. In this example, we direct the command output through the [jq](https://jqlang.github.io/jq/) JSON processor to locate the `.key1` value.

When you try the example, update the code to use your values for the resource group and resource.

```azurecli
az cognitiveservices account keys list \
--name HealthInsightsResource \
--resource-group HealthInsightsResourceGroup \
| jq -r .key1
```

## Delete a resource or resource group

If you want to clean up after these exercises, you can remove your Azure Health Insights resource by deleting the resource through the Azure CLI. 

To remove the resource, use the [az cognitiveservices account delete](/cli/azure/cognitiveservices/account/deployment?view=azure-cli-latest&preserve-view=true#az-cognitiveservices-account-delete) command. When you run this command, be sure to update the example code to use your values for the resource group and resource.

```azurecli
az cognitiveservices account delete \
--name HealthInsightsResource \
--resource-group HealthInsightsResourceGroup
```

You can also delete the resource group. If you choose to delete the resource group, all resources contained in the group are also deleted. When you run this command, be sure to update the example code to use your values for the resource group.

```azurecli
az group delete \
--name HealthInsightsResourceGroup
```
