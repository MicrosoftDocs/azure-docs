---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/10/2021
ms.author: mikben
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).

## Create Azure Communication Resource

To create an Azure Communication Services resource, [sign in to Azure CLI](/cli/azure/authenticate-azure-cli), then run the following command:

```azurecli
az communication create --name "<communicationName>" --location "Global" --data-location "United States" --resource-group "<resourceGroup>"
```

You can configure your Communication Services resource with the following options:

* The resource group
* The name of the Communication Services resource
* The geography the resource will be associated with

In the next step, you can assign tags to the resource. Tags can be used to organize your Azure resources. See the [resource tagging documentation](../../../azure-resource-manager/management/tag-resources.md) for more information about tags.

## Manage your Communication Services resource

To add tags to your Communication Services resource, run the following commands:

```azurecli
az communication update --name "<communicationName>" --tags newTag="newVal" --resource-group "<resourceGroup>"

az communication show --name "<communicationName>" --resource-group "<resourceGroup>"
```

For information on additional commands, see [az communication](/cli/azure/ext/communication/communication).