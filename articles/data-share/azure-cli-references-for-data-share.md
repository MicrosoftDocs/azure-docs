---
title: Azure CLI for Azure Data Share
description: Azure CLI feference landing page for Azure Data Share
services: data-share
author: dbradish-microsoft
manager: barbkess
editor: 

ms.service: data-share
ms.devlang: azurecli
ms.topic: reference
ms.date: 05/27/2020
ms.author: dbradish
ms.reviewer: 
ms.lastreviewed: 
---

# Azure CLI for Azure Data Share

The Azure command-line interface ([Azure CLI](/cli/azure/what-is-azure-cli)) is a set of commands used to create and manage Azure resources.  It is available across many Azure services including Azure Data Share.  There are over 65 different commands for data share!  These commands give you the ability to work effectively with the service from a command-line.

## References for Data Share

|Azure CLI Reference |Status |Description
|-|-|-|
| [az datashare](/cli/azure/ext/datashare/datashare) | Public preview | Commands to manage datashare
| [az datashare account](/cli/azure/ext/datashare/datashare/consumer) | Public preview | Commands to manage datashare accounts.
| [az datashare consumer](/cli/azure/ext/datashare/datashare/consumer) | Public preview | Commands for consumers to manage datashare.
| [az datashare dataset](/cli/azure/ext/datashare/datashare/dataset) | Public preview | Commands for providers to manage datashare datasets.
| [az datashare invitation](/cli/azure/ext/datashare/datashare/invitation) | Public preview | Commands for consumers to manage datashare invitations.
| [az datashare provider-share-subscription](/cli/azure/ext/datashare/datashare/provider-share-subscription) | Public preview | Commands for providers to manage datashare share subscriptions.
| [az datashare synchronization](/cli/azure/ext/datashare/datashare/synchronization) | Public preview | Commands to manage datashare synchronization.
| [az datashare datashare synchronization-setting](/cli/azure/ext/datashare/datashare/synchronization-setting) | Public preview | Commands for providers to manage datashare synchronization settings.

## Reference examples

Examples of the Azure CLI commands are provided throughout the documentation.  Here are a few examples to give you an idea of how easy it is to use the Azure CLI.

To work with Azure Data Share, you will first need a resource group.  Azure resource groups are easy to create and manage using the Azure CLI.

```azurecli
#create a resource group
az group create -location westus -name MyResourceGroup

#get a list of resource groups for a subscription
az group list --subscription MySubscription --output table
```

It is just as easy to create a data share account.  Although you can also complete this task through the Azure portal, using the Azure CLI requires a single command-line.

```azurecli
az datashare account create --location "West US 2" --tags tag1=Red tag2=White --name MyAccount --resource-group MyResourceGroup
```

## See Also

* [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli) to learn about installation and sign in.

* Find more information about public preview commands in [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).

* Discover additional [GA](/cli/azure/reference-index) and [public preview](/cli/azure/azure-cli-extensions-list) commands in the Azure CLI documentation.
