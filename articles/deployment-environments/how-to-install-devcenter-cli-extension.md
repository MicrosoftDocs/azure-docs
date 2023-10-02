---
title: Install the devcenter Azure CLI extension
titleSuffix: Azure Deployment Environments 
description: Learn how to install the Azure CLI and the Deployment Environments CLI extension so you can create Deployment Environments resources from the command line.
services: deployment-environments
ms.service: deployment-environments
ms.custom: build-2023, devx-track-azurecli
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 04/25/2023
#Customer intent: As a platform engineer, I want to install the devcenter extension so that I can create Deployment Environments resources from the command line.
---

# Azure Deployment Environments Azure CLI extension

In addition to the Azure admin portal and the developer portal, you can use the Deployment Environments Azure CLI extension to create resources. Azure Deployment Environments and Microsoft Dev Box use the same Azure CLI extension, which is called *devcenter*.

## Install the devcenter extension 

To install the devcenter extension, you first need to install the Azure CLI. The following steps show you how to install the Azure CLI, then the devcenter extension.

1. Download and install the [Azure CLI](/cli/azure/install-azure-cli).

1. Install the devcenter extension
``` azurecli
az extension add --name devcenter
```
1. Check that the devcenter extension is installed 
``` azurecli
az extension list
```
### Update the devcenter extension
You can update the devcenter extension if you already have it installed.

To update a version of the extension that's  installed
``` azurecli
az extension update --name devcenter
```
### Remove the devcenter extension

To remove the extension, use the following command
```azurecli
az extension remove --name devcenter
```

## Get started with the devcenter extension

You might find the following commands useful as you work with the devcenter extension.

1. Sign in to Azure CLI with your work account.

    ```azurecli
    az login
    ```

1. Set your default subscription to the subscription where you're creating your specific Deployment Environments resources.

    ```azurecli
    az account set --subscription {subscriptionId}
    ```

1. Set default resource group. Setting a default resource group means you don't need to specify the resource group for each command.

    ```azurecli
    az configure --defaults group={resourceGroupName}
    ```

1. Get Help for a command

    ```azurecli
    az devcenter admin --help
    ```

## Next steps

For complete command listings, refer to the [Microsoft Deployment Environments and Azure Deployment Environments Azure CLI documentation](https://aka.ms/CLI-reference).
