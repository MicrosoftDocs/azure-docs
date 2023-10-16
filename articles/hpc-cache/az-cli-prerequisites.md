---
title: Azure CLI prerequisites for Azure HPC Cache
description: Setup steps before you can use Azure CLI to create or modify an Azure HPC Cache
author: femila
ms.service: hpc-cache
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 07/08/2020
ms.author: femila
---

# Set up Azure CLI for Azure HPC Cache

Follow these steps to prepare your environment before using Azure CLI to create or manage an Azure HPC Cache.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

 - Azure HPC Cache requires version 2.7 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Set default resource group (optional)

Most of the hpc-cache commands require you to pass the cache's resource group. You can set the default resource group by using [az config](/cli/azure/reference-index#az-config).

## Next steps

After installing the Azure CLI extension and logging in, you can use Azure CLI to create and manage Azure HPC Cache systems.

* [Create an Azure HPC Cache](hpc-cache-create.md)
* [Azure CLI hpc-cache documentation](/cli/azure/hpc-cache)
