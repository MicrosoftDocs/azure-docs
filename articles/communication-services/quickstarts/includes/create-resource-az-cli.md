---
author: probableprime
ms.service: azure-communication-services
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 06/30/2021
ms.author: rifox
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli) 

If you're planning on using phone numbers, you can't use the free trial account. Check that your subscription meets all the [requirements](../../concepts/telephony/plan-solution.md) if you plan to purchase phone numbers before creating your resource. 

## Create Azure Communication Services resource

To create an Azure Communication Services resource, [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials. Run the following command to create the resource:

```azurepowershell-interactive
az communication create --name "<acsResourceName>" --location "Global" --data-location "United States" --resource-group "<resourceGroup>"
```

If you would like to select a specific subscription, you can also specify the ```--subscription``` flag and provide the subscription ID.
```azurepowershell-interactive
az communication create --name "<acsResourceName>" --location "Global" --data-location "United States" --resource-group "<resourceGroup> --subscription "<subscriptionId>"
```

You can configure your Communication Services resource with the following options:

* The [resource group](../../../azure-resource-manager/management/manage-resource-groups-cli.md)
* The name of the Communication Services resource
* The geography the resource will be associated with

In the next step, you can assign tags to the resource. Tags can be used to organize your Azure resources. For more information about tags, see the [resource tagging documentation](../../../azure-resource-manager/management/tag-resources.md).

## Manage your Communication Services resource

To add tags to your Communication Services resource, run the following commands. You can target a specific subscription as well.

```azurepowershell-interactive
az communication update --name "<communicationName>" --tags newTag="newVal1" --resource-group "<resourceGroup>"

az communication update --name "<communicationName>" --tags newTag="newVal2" --resource-group "<resourceGroup>" --subscription "<subscriptionId>"

az communication show --name "<communicationName>" --resource-group "<resourceGroup>"

az communication show --name "<communicationName>" --resource-group "<resourceGroup>" --subscription "<subscriptionId>"
```

For information on other commands, see [Azure Communication CLI](/cli/azure/communication).
