---
title: Azure CLI prerequisites for Azure HPC Cache
description: Setup steps before you can use Azure CLI to create or modify an Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 07/08/2020
ms.author: v-erkel
---

# Set up Azure CLI for Azure HPC Cache

Follow these steps to prepare your environment before using Azure CLI to create or manage an Azure HPC Cache.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

 - Azure HPC Cache requires version 2.7 or later of the Azure CLI. Run [az version](/cli/azure/reference-index?#az_version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az_upgrade).

### Install the Azure HPC Cache extension

Azure HPC Cache functions are not part of the main code base, so you also must install the extension reference. Follow the instructions below.

1. Sign in

   Sign in using the [az login](/cli/azure/reference-index#az-login) command if you're using a locally installed version of the CLI.

    ```azurecli
    az login
    ```

    Follow the steps displayed in your terminal to complete the authentication process.

   > [!TIP]
   > If you have multiple subscriptions, you need to choose one. Select it when you start a Cloud Shell session in the Azure Portal, or follow the instructions in [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli#sign-in) to set your subscription from the command line.

2. Install the Azure CLI extension

   The Azure HPC Cache functions are provided as an Azure CLI extension - it is not yet part of the core CLI package. You need to install the extension reference before you can use it.

   Azure CLI extensions give you access to experimental and pre-release commands. To learn more about extensions, including updating and uninstalling, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).

   Install the extension for Azure HPC Cache by running the following command:

    ```azurecli-interactive
    az extension add --name hpc-cache
   ```

## Set default resource group (optional)

Most of the hpc-cache commands require you to pass the cache's resource group. You can set the default resource group by using [az configure](/cli/azure/reference-index#az-configure).

## Next steps

After installing the Azure CLI extension and logging in, you can use Azure CLI to create and manage Azure HPC Cache systems.

* [Create an Azure HPC Cache](hpc-cache-create.md)
* [Azure CLI hpc-cache documentation](/cli/azure/ext/hpc-cache/hpc-cache)
