---
title: 'Create and manage Azure OpenAI Service deployments with the Azure CLI'
titleSuffix: Azure OpenAI
description: Learn how to use the Azure CLI to create an Azure OpenAI resource and manage deployments with the Azure OpenAI Service.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 08/25/2023
keywords:
---

## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.
- Access permissions to [create Azure OpenAI resources and to deploy models](../how-to/role-based-access-control.md).
- The Azure CLI. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

> [!NOTE]
> Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete [this form](https://aka.ms/oai/access). If you need assistance, open an issue on this repository to contact Microsoft.

## Sign in to the Azure CLI

[Sign in](/cli/azure/authenticate-azure-cli) to the Azure CLI or select **Open Cloudshell** in the following steps.

## Create an Azure resource group

To create an Azure OpenAI resource, you need an Azure resource group. When you create a new resource through the Azure CLI, you can also create a new resource group or instruct Azure to use an existing group. The following example shows how to create a new resource group named _OAIResourceGroup_ with the [az group create](/cli/azure/group?view=azure-cli-latest&preserve-view=true#az-group-create) command. The resource group is created in the East US location. 

```azurecli-interactive
az group create \
--name OAIResourceGroup \
--location eastus
```

## Create a resource

Use the [az cognitiveservices account create](/cli/azure/cognitiveservices/account?view=azure-cli-latest&preserve-view=true#az-cognitiveservices-account-create) command to create an Azure OpenAI resource in the resource group. In the following example, you create a resource named _MyOpenAIResource_ in the _OAIResourceGroup_ resource group. When you try the example, update the code to use your desired values for the resource group and resource name, along with your Azure subscription ID _\<subscriptionID>_.

```azurecli
az cognitiveservices account create \
--name MyOpenAIResource \
--resource-group OAIResourceGroup \
--location eastus \
--kind OpenAI \
--sku s0 \
--subscription <subscriptionID>
```

## Retrieve information about the resource

After you create the resource, you can use different commands to find useful information about your Azure OpenAI Service instance. The following examples demonstrate how to retrieve the REST API endpoint base URL and the access keys for the new resource.

### Get the endpoint URL

Use the [az cognitiveservices account show](/cli/azure/cognitiveservices/account?view=azure-cli-latest&preserve-view=true#az-cognitiveservices-account-show) command to retrieve the REST API endpoint base URL for the resource. In this example, we direct the command output through the [jq](https://jqlang.github.io/jq/) JSON processor to locate the `.properties.endpoint` value.

When you try the example, update the code to use your values for the resource group _\<myResourceGroupName>_ and resource _\<myResourceName>_.

```azurecli
az cognitiveservices account show \
--name <myResourceName> \
--resource-group  <myResourceGroupName> \
| jq -r .properties.endpoint
```

### Get the primary API key

To retrieve the access keys for the resource, use the [az cognitiveservices account keys list](/cli/azure/cognitiveservices/account?view=azure-cli-latest&preserve-view=true#az-cognitiveservices-account-keys-list) command. In this example, we direct the command output through the [jq](https://jqlang.github.io/jq/) JSON processor to locate the `.key1` value.

When you try the example, update the code to use your values for the resource group and resource.

```azurecli
az cognitiveservices account keys list \
--name <myResourceName> \
--resource-group  <myResourceGroupName> \
| jq -r .key1
```

## Deploy a model

To deploy a model, use the [az cognitiveservices account deployment create](/cli/azure/cognitiveservices/account/deployment?view=azure-cli-latest&preserve-view=true#az-cognitiveservices-account-deployment-create) command. In the following example, you deploy an instance of the `text-embedding-ada-002` model and give it the name _MyModel_. When you try the example, update the code to use your values for the resource group and resource. You don't need to change the `model-version`, `model-format` or `sku-capacity`, and `sku-name` values. 

```azurecli
az cognitiveservices account deployment create \
--name <myResourceName> \
--resource-group  <myResourceGroupName> \
--deployment-name MyModel \
--model-name text-embedding-ada-002 \
--model-version "1"  \
--model-format OpenAI \
--sku-capacity "1" \
--sku-name "Standard"
```

## Delete a model from your resource

You can delete any model deployed from your resource with the [az cognitiveservices account deployment delete](/cli/azure/cognitiveservices/account/deployment?view=azure-cli-latest&preserve-view=true#az-cognitiveservices-account-deployment-delete) command. In the following example, you delete a model named _MyModel_. When you try the example, update the code to use your values for the resource group, resource, and deployed model. 

```azurecli
az cognitiveservices account deployment delete \
--name <myResourceName> \
--resource-group  <myResourceGroupName> \
--deployment-name MyModel
```

## Delete a resource

If you want to clean up after these exercises, you can remove your Azure OpenAI resource by deleting the resource through the Azure CLI. You can also delete the resource group. If you choose to delete the resource group, all resources contained in the group are also deleted.

To remove the resource group and its associated resources, use the [az cognitiveservices account delete](/cli/azure/cognitiveservices/account/deployment?view=azure-cli-latest&preserve-view=true#az-cognitiveservices-account-delete) command.

If you're not going to continue to use the resources created in these exercises, run the following command to delete your resource group. Be sure to update the example code to use your values for the resource group and resource.

```azurecli
az cognitiveservices account delete \
--name <myResourceName> \
--resource-group  <myResourceGroupName>
```
