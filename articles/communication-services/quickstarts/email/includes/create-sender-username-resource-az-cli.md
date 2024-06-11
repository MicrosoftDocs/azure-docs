---
author: v-vprasannak
ms.service: azure-communication-services
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 04/29/2024
ms.author: v-vprasannak
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli) 
- An Azure Communication Services Email Resource created and ready to add the domains. See [Get started with Creating Email Communication Resource](../../../quickstarts/email/create-email-communication-resource.md).
- A custom domain with higher than default sending limits provisioned and ready. See [Quickstart: How to add custom verified email domains](../../../quickstarts/email/add-custom-verified-domains.md).

## Create Sender username resource

To create a Sender Username resource, [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials. To create the resource, run the following command:

```azurepowershell-interactive
az communication email domain sender-username create --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --domain-name "contoso.com" --sender-username "contosoNewsAlerts" --username "contosoNewsAlerts"
```

If you would like to select a specific subscription, you can also specify the ```--subscription``` flag and provide the subscription ID.
```azurepowershell-interactive
az communication email domain sender-username create --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --domain-name "contoso.com" --sender-username "contosoNewsAlerts" --username "contosoNewsAlerts" --subscription "<subscriptionId>"
```

You can configure your Domain resource with the following options:

* The [resource group](../../../../azure-resource-manager/management/manage-resource-groups-cli.md)
* The name of the Email Communication Services resource.
* The geography the resource will be associated with.
* The name of the Domain resource.
* The name of the Sender Username.
* The name of the Username.

> [!NOTE]
> The Sender Username and Username should be the same.

## Manage your Sender Username resource

To add or update display name to your Sender Username resource, run the following commands. You can target a specific subscription as well.

```azurepowershell-interactive
az communication email domain sender-username update --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --domain-name "contoso.com" --sender-username "contosoNewsAlerts" --display-name "Contoso News Alerts"

az communication email domain sender-username update --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --domain-name "contoso.com" --sender-username "contosoNewsAlerts" --display-name "Contoso News Alerts" --subscription "<subscriptionId>"
```

To list all of your Sender Username resources in a given Domain, use the following command:

```azurepowershell-interactive
az communication email domain sender-username list --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --domain-name "contoso.com"
```

To show all the information on a given resource use the following command:

```azurepowershell-interactive
az communication email domain sender-username show --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --domain-name "contoso.com" --sender-username "contosoNewsAlerts"
```

## Clean up Sender Username resource

If you want to clean up and remove a Sender Username resource, you can delete your Sender Username resource by running the following command.

```azurepowershell-interactive
az communication email domain sender-username delete --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --domain-name "contoso.com" --sender-username "contosoNewsAlerts"
```

> [!NOTE]
> Resource deletion is **permanent** and no data, including event grid filters, phone numbers, or other data tied to your resource, can be recovered if you delete the resource.

For information on other commands, see [Sender Username CLI](/cli/azure/communication/email/domain/sender-username).
