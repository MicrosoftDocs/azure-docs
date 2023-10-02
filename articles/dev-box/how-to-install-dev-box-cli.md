---
title: Install the Microsoft Dev Box Azure CLI extension
titleSuffix: Microsoft Dev Box
description: Learn how to create Dev Box resources from the command line. Install the Azure CLI and the devcenter extension to gain access to Dev Box commands.
services: dev-box
ms.service: dev-box
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 04/25/2023
#Customer intent: As a platform engineer, I want to install the Dev Box CLI extension so that I can create Dev Box resources from the command line.
---

# Configure Microsoft Dev Box from the command-line with the Azure CLI

In addition to the Azure admin portal and the developer portal, you can use the Dev Box Azure CLI extension to create resources. Microsoft Dev Box and Azure Deployment Environments use the same Azure CLI extension, which is called *devcenter*.

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

To update a version of the extension that's installed
``` azurecli
az extension update --name devcenter
```
### Remove the devcenter extension

To remove the extension, use the following command
```azurecli
az extension remove --name devcenter
```

## Get started with the devcenter extension

You might find the following commands useful as you work with Dev Box.

1. Sign in to Azure CLI with your work account.

    ```azurecli
    az login
    ```

1. Set your default subscription to the subscription where you're creating your specific Dev Box resources.

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

For complete command listings, refer to the [Microsoft Dev Box and Azure Deployment Environments Azure CLI documentation](https://aka.ms/CLI-reference).
