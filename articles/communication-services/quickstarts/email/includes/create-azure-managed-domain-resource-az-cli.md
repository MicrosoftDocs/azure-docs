---
author: v-vprasannak
ms.service: azure-communication-services
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 04/26/2024
ms.author: v-vprasannak
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli) 
- Create an [Email Communication Service](/azure/communication-services/quickstarts/email/create-email-communication-resource).

## Create Domain resource

To create a Domain resource, [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials. To create the resource, run the following command:

```azurepowershell-interactive
az communication email domain create --domain-name AzureManagedDomain --email-service-name "<EmailServiceName>" --location "Global" --resource-group "<resourceGroup>" --domain-management AzureManaged
```

If you would like to select a specific subscription, you can also specify the ```--subscription``` flag and provide the subscription ID.
```azurepowershell-interactive
az communication email domain create --domain-name AzureManagedDomain --email-service-name "<EmailServiceName>" --location "Global" --resource-group "<resourceGroup>" --domain-management AzureManaged --subscription "<subscriptionId>"
```

You can configure your Domain resource with the following options:

* The [resource group](../../../../azure-resource-manager/management/manage-resource-groups-cli.md)
* The name of the Email Communication Services resource
* The geography the resource will be associated with
* The name of the Domain resource:
	* For Azure domains, the name should be AzureManagedDomain.
* The value of the Domain management property.
	* For Azure domains, the value should be AzureManaged.	

In the next step, you can assign tags to the domain resource. Tags can be used to organize your Domain resources. For more information about tags, see the [resource tagging documentation](../../../../azure-resource-manager/management/tag-resources.md).

## Manage your Domain resource

To add tags to your Domain resource, run the following commands. You can target a specific subscription as well.

```azurepowershell-interactive
az communication email domain update --domain-name AzureManagedDomain --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --tags newTag="newVal1"

az communication email domain update --domain-name AzureManagedDomain --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --tags newTag="newVal1" --subscription "<subscriptionId>"
```

To list all of your Domain Resources in a given Email Communication Service, use the following command:

```azurepowershell-interactive
az communication email domain list --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>"
```
To show all the information on a given domain resource use the following command:

```azurepowershell-interactive
az communication email domain show --domain-name AzureManagedDomain --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>"
```

## Clean up Domain resource

If you want to clean up and remove a Domain resource, You can delete by running the following command.

```azurepowershell-interactive
az communication email domain delete --domain-name AzureManagedDomain --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>"
```

> [!NOTE]
> Resource deletion is **permanent** and no data, including event grid filters, phone numbers, or other data tied to your resource, can be recovered if you delete the resource.

For information on other commands, see [Domain CLI](/cli/azure/communication/email/domain).
