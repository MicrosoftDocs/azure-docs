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

## Azure CLI references for Data Share

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

## Azure CLI conceptual articles for Data Share

There are several popular Azure CLI articles that will help you work through Azure Data Share concepts:

_(This will be a list of no more than three articles.  The examples below are provided for demo only and will be removed until there are published articles for Azure Data Share._

_I'll request from the service home page doc owner that the Azure CLI article with the **highest number of page reads** also be added to one of the service landing page cards / boxes.)_

* [Name of quickstart 1]()
* [Name of How-to guide 1]()
* [Name of Tutorial 1]()
* [Name of Tutorial 2]()

## Key examples

Examples of the Azure CLI commands are provided throughout the documentation.  Here are a few examples to give you an idea of how easy it is to use the Azure CLI.

To work with Azure Data Share, you will first need to setup a data share account.  You can complete this task through the Azure portal, or you can execute a single Azure CLI command.

```azurecli
az datashare account create --location "West US 2" --tags tag1=Red tag2=White --name MyAccount --resource-group MyResourceGroup
```

Your next step is to create the actual data share.

```azurecli
az datashare create --account-name MyAccount --resource-group MyResourceGroup --description "share description" --share-kind "CopyBased" --terms "Confidential" --name MyShare
```

Are you excited about what you see?  Do you have an idea that will help to make the Azure CLI even better?  Send us your feedback!

```azurecli
az feedback "Your message"
```

## See Also

1. See [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli) to learn about installation and sign in.

1. Learn about working with public preview commands in [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).

1. Discover additional [GA](/cli/azure/reference-index) and [public preview](/cli/azure/azure-cli-extensions-list) commands in the Azure CLI documentation.
