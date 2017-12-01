---
title: Azure Quickstart - Run Batch job - Python | Microsoft Docs
description: Quickly run a Batch job and tasks with the Batch Pythnon client SDK.
services: batch
documentationcenter: 
author: dlepow
manager: timlt
editor: 
tags: 

ms.assetid: 
ms.service: batch
ms.devlang: python
ms.topic: quickstart
ms.tgt_pltfrm: 
ms.workload: 
ms.date: 11/30/2017
ms.author: danlep
ms.custom: mvc
---

# Run your first Batch job using the Python SDK

This quickstart shows how to use the Azure Python client library to...  This example is very basic but introduces you to the key concepts of the Batch service.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this quickstart:

* [Install Git](https://git-scm.com/)
* [Install Python](https://www.python.org/downloads/)
* Create an Azure Batch account and an Azure Storage account. To create these accounts, see the Batch quickstarts using the [Azure portal](quick-create-portal.md) or [Azure CLI](quick-create-cli.md). 

## Download the sample

In a terminal window, run the following command to clone the sample app repository to your local machine.

```bash
git clone <whatever>
```

Change to the directory that contains the sample code

```bash
cd <wherever>
```

## Run the app

Install the required packages using `pip`.

```bash
pip install azure.batch
pip install azure.storage
```

Open the file python_quickstart_client.py in a text editor. Update the Batch and storage account credential strings with the values unique to your accounts. Get the necessary information from the [Azure portal](https://portal.azure.com), or use Azure CLI commands. For example, to get the account keys, use the [az batch account keys list](/cli/azure/batch/account/keys#az_batch_account_keys_list) and [az storage account keys list](/cli/azure/storage/account/keys##az_storage_account_keys_list) commands.

```Python
_BATCH_ACCOUNT_NAME = 'mybatchaccount'
_BATCH_ACCOUNT_KEY = 'xxxxxxxxxxxxxxxxE+yXrRvJAqT9BlXwwo1CwF+SwAYOxxxxxxxxxxxxxxxx43pXi/gdiATkvbpLRl3x14pcEQ=='
_BATCH_ACCOUNT_URL = 'https://mybatchaccount.westeurope.batch.azure.com'
_STORAGE_ACCOUNT_NAME = 'mystorageaccount'
_STORAGE_ACCOUNT_KEY = 'xxxxxxxxxxxxxxxxy4/xxxxxxxxxxxxxxxxfwpbIC5aAWA8wDu+AFXZB827Mt9lybZB1nUcQbQiUrkPtilK5BQ=='

```


## Next steps

In this quick start, you ... To learn more about Azure Batch, continue to the XXX tutorial.


> [!div class="nextstepaction"]
> [Azure Batch tutorials](tutorial-parallel-python.md)
