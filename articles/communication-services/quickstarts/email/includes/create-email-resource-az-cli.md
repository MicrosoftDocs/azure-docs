---
author: v-vprasannak
ms.service: Email-communication-services
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 04/26/2024
ms.author: v-vprasannak
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli) 

## Create Email Communication Services resource

To create an Email Communication Services resource, [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials. Run the following command to create the resource:

```azurepowershell-interactive
az communication email create --name "<EmailServiceName>" --location "Global" --data-location "United States" --resource-group "<resourceGroup>"
```

If you would like to select a specific subscription, you can also specify the ```--subscription``` flag and provide the subscription ID.
```azurepowershell-interactive
az communication email create --name "<EmailServiceName>" --location "Global" --data-location "United States" --resource-group "<resourceGroup> --subscription "<subscriptionId>"
```

You can configure your Email Communication Services resource with the following options:

* The [resource group](../../../../azure-resource-manager/management/manage-resource-groups-cli.md)
* The name of the Email Communication Services resource
* The geography the resource will be associated with

In the next step, you can assign tags to the resource. Tags can be used to organize your Azure Email resources. For more information about tags, see the [resource tagging documentation](../../../../azure-resource-manager/management/tag-resources.md).

## Manage your Email Communication Services resource

To add tags to your Email Communication Services resource, run the following commands. You can target a specific subscription as well.

```azurepowershell-interactive
az communication email update --name "<EmailServiceName>" --tags newTag="newVal1" --resource-group "<resourceGroup>"

az communication email update --name "<EmailServiceName>" --tags newTag="newVal2" --resource-group "<resourceGroup>" --subscription "<subscriptionId>"
```

To list all of your Email Communication Service Resources in a given Resource group use the following command:

```azurepowershell-interactive
az communication email list --resource-group "<resourceGroup>"
```

To show all the information on a given Email Communication Service resource use the following command. You can target a specific subscription as well.

```azurepowershell-interactive
az communication email show --name "<EmailServiceName>" --resource-group "<resourceGroup>"

az communication email show --name "<EmailServiceName>" --resource-group "<resourceGroup>" --subscription "<subscriptionId>"
```

For information on other commands, see [Email Communication CLI](/cli/azure/communication/email).
