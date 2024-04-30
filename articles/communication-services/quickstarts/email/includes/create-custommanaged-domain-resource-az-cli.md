---
author: v-vprasannak
ms.service: azure-communication-services
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 04/11/2024
ms.author: v-vprasannak
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli) 
- Create an [Email Communication Service](/azure/communication-services/quickstarts/email/create-email-communication-resource).

## Provision a custom domain

To provision a custom domain, you need to:
    
* Verify the custom domain ownership by adding a TXT record in your Domain Name System (DNS).
* Configure the sender authentication by adding Sender Policy Framework (SPF) and DomainKeys Identified Mail (DKIM) records.

## Create Domain resource

To create a Domain resource, [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials. To create the resource, run the following command:

```azurepowershell-interactive
az communication email domain create --domain-name "TestCustomDomain.net" --email-service-name "<EmailServiceName>" --location "Global" --data-location "United States" --resource-group "<resourceGroup>" --domain-management CustomerManaged
```

If you would like to select a specific subscription, you can also specify the ```--subscription``` flag and provide the subscription ID.
```azurepowershell-interactive
az communication email domain create --domain-name "TestCustomDomain.net" --email-service-name "<EmailServiceName>" --location "Global" --data-location "United States" --resource-group "<resourceGroup> --domain-management CustomerManaged --subscription "<subscriptionId>"
```

You can configure your Domain resource with the following options:

* The [resource group](../../../../azure-resource-manager/management/manage-resource-groups-cli.md)
* The name of the Email Communication Services resource.
* The geography the resource will be associated with.
* The name of the Domain resource.
* The name of the Domain management.
	* For Custom domains, the name should be - CustomerManaged.

In the next step, you can assign tags or update user engagement tracking to the domain resource. Tags can be used to organize your Domain resources. For more information about tags, see the [resource tagging documentation](../../../../azure-resource-manager/management/tag-resources.md).

## Manage your Domain resource

To add tags or update user engagement tracking to your Domain resource, run the following commands. You can target a specific subscription as well.

```azurepowershell-interactive
az communication email domain update --domain-name "TestCustomDomain.net" --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --tags newTag="newVal1" --user-engmnt-tracking Enabled

az communication email domain update --domain-name "TestCustomDomain.net" --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --tags newTag="newVal1" --user-engmnt-tracking Disabled --subscription "<subscriptionId>"
```

To configure sender authentication for your domains, please refer [Configure sender authentication for custom domain](../includes/create-custommanaged-domain-resource-azp.md) section.

To Initiate domain verification, run the below command:

```azurepowershell-interactive
az communication email domain initiate-verification --domain-name "TestCustomDomain.net" --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --verification-type Domain
```

To Cancel domain verification, run the below command:

```azurepowershell-interactive
az communication email domain cancel-verification --domain-name "TestCustomDomain.net" --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>" --verification-type Domain
```

To list all of your Domain Resources in a given Email Communication Service, use the following command:

```azurepowershell-interactive
az communication email domain list --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>"
```
To show all the information on a given domain resource use the following command:

```azurepowershell-interactive
az communication email domain show --domain-name "TestCustomDomain.net" --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>"
```

#### Delete Domain resource

If you want to clean up and remove a Domain resource, You can delete by running the following command.

```azurepowershell-interactive
az communication email domain delete --domain-name "TestCustomDomain.net" --email-service-name "<EmailServiceName>" --resource-group "<resourceGroup>"
```

For information on other commands, see [Domain CLI](/cli/azure/communication/email/domain).
