---
title: Install the devcenter Azure CLI extension
titleSuffix: Azure Deployment Environments 
description: Learn how to install the Azure CLI extension for Azure Deployment Environments so you can create resources from the command line.
services: deployment-environments
ms.service: deployment-environments
ms.custom: build-2023, devx-track-azurecli
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 11/22/2023
#Customer intent: As a platform engineer, I want to install the devcenter extension so that I can create Deployment Environments resources from the command line.
---

# Install the Azure CLI extension for Azure Deployment Environments

In addition to the Azure admin portal and the developer portal, you can use the Azure Deployment Environments CLI extension to create resources. Azure Deployment Environments and Microsoft Dev Box use the same Azure CLI extension, which is called *devcenter*.

## Install the devcenter extension 

You first need to install the Azure CLI, and then install the devcenter extension.

1. Download and install the [Azure CLI](/cli/azure/install-azure-cli).

1. Install the devcenter extension by using the following command.
    ``` azurecli
    az extension add --name devcenter
    ```

1. Check that the devcenter extension was installed.
    ``` azurecli
    az extension list
    ```

### Update the devcenter extension

If you already have the devcenter extension installed, you can update it.
``` azurecli
az extension update --name devcenter
```

### Remove the devcenter extension

To remove the extension, use the following command.
```azurecli
az extension remove --name devcenter
```

## Get started with the devcenter extension

You might find the following commands useful while you work with the devcenter extension.

1. Sign in to the Azure CLI with your account.

    ```azurecli
    az login
    ```

1. Set your default subscription to the subscription where you're creating your specific Deployment Environments resources.

    ```azurecli
    az account set --subscription <subscriptionId>
    ```

1. Set a default resource group so that you don't need to specify the resource group for each command.

    ```azurecli
    az configure --defaults group=<resourceGroupName>
    ```

1. Get help for a command.

    ```azurecli
    az devcenter admin --help
    ```

## Next steps

For complete command listings, see the [Microsoft Dev Box and Azure Deployment Environments Azure CLI documentation](https://aka.ms/CLI-reference).
