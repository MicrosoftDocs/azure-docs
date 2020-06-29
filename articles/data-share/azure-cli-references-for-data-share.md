---
title: Azure CLI references for Azure Data Share
description: Azure CLI reference landing page for Azure Data Share
services: data-share
author: dbradish-microsoft
manager: barbkess
ms.service: data-share
ms.devlang: azurecli
ms.topic: reference
ms.date: 05/27/2020
ms.author: dbradish
---

# Azure CLI for Azure Data Share

The Azure Command Line Interface ([Azure CLI](/cli/azure/what-is-azure-cli)) is a set of commands used to create and manage Azure resources.  It is available across many Azure services including Azure Data Share.  There are over 65 different commands for data share!  These commands give you the ability to work effectively with the service from a command line.

## References for Data Share

All Azure CLI commands for Azure Data Share are currently extensions to the Azure CLI.  An extension gives you access to experimental and pre-release commands.  Find out more about extension references in [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).

|Azure CLI Reference |Description
|-|-|-|
| [az datashare](/cli/azure/ext/datashare/datashare) | All commands to manage Azure Data Share.
| [az datashare account](/cli/azure/ext/datashare/datashare/account) | Commands to manage Azure Data Share accounts.
| [az datashare consumer](/cli/azure/ext/datashare/datashare/consumer) | Commands for consumers to manage Azure Data Share.
| [az datashare dataset](/cli/azure/ext/datashare/datashare/dataset) | Commands for providers to manage Azure Data Share datasets.
| [az datashare invitation](/cli/azure/ext/datashare/datashare/invitation) | Commands for consumers to manage Azure Data Share invitations.
| [az datashare provider-share-subscription](/cli/azure/ext/datashare/datashare/provider-share-subscription) | Commands for providers to manage Azure Data Share subscriptions.
| [az datashare synchronization](/cli/azure/ext/datashare/datashare/synchronization)  | Commands to manage Azure Data Share synchronization.
| [az datashare synchronization-setting](/cli/azure/ext/datashare/datashare/synchronization-setting)  | Commands for providers to manage Azure Data Share synchronization settings.

## Reference examples

Examples are provided with every Azure CLI reference. Although you can also complete these tasks through the Azure portal, using the Azure CLI requires a single command line.  Here are a few code blocks to give you an idea of how easy it is to use the Azure CLI.

To work with Azure Data Share, you'll first need a resource group.  Azure resource groups are simple to create and manage with the Azure CLI.  

```azurecli
#create a resource group
az group create -location westus -name MyResourceGroup
```

```azurecli
#get a list of resource groups for a subscription
az group list --subscription MySubscription --output table
```

It is as straightforward to create a data share account.

```azurecli
#create a data share account
az datashare account create --location "West US 2" --tags tag1=Red tag2=White --name MyAccount --resource-group MyResourceGroup
```

## See also

* [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli) to learn about installation and sign in.

* Discover additional [core](/cli/azure/reference-index) and [extension](/cli/azure/azure-cli-extensions-list) references in the Azure CLI documentation.
