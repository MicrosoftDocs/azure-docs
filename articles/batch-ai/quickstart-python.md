---
title: Azure Quickstart - CNTK training with Batch AI - Python | Microsoft Docs
description: Quickly learn to run a CNTK training job with Batch AI using the Python SDK
services: batchai
documentationcenter: na
author: dlepow
manager: timlt
editor: tysonn

ms.assetid:
ms.custom: mvc
ms.service: batchai
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: Python
ms.topic: quickstart
ms.date: 10/09/2017
ms.author: danlep
---

# Run a CNTK training job using the Azure Python SDK

This Quickstart details using the [Azure Python SDK]() to run a Microsoft Cognitive Toolkit (CNTK) training job using the Batch AI service. 

In this example, you use the MNIST database of handwritten images to train a convolutional neural network (CNN) on a single-node GPU cluster. 

## Prerequisites

* Azure subscription - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

* Azure Python SDK - See [installation instructions](/python/azure/python-sdk-azure-install)

* Azure storage account - See [How to create an Azure storage account](../storage/common/storage-create-storage-account.md)

* Create these parameters in your Python script, substituting your own values:

```Python
# credentials used for authentication
client_id = 'my_aad_client_id'
secret = 'my_aad_secret_key'
token_uri = 'my_aad_token_uri'
subscription_id = 'my_subscription_id'

# credentials used for storage
storage_account_name = 'my_storage_account_name'
storage_account_key = 'my_storage_account_key'

# specify the credentials used to remote-login your GPU node
admin_user_name = 'my_admin_user_name'
admin_user_password = 'my_admin_user_password'
```



## Prepare Azure file share

## Create GPU cluster

## Monitor cluster creation

## Create training job

## Monitor job

## List stdout and stderr output

## Monitor output files

## Delete job

## Delete resources

## Next steps

In this Quickstart, you learned how to 

> [!div class="nextstepaction"]
> 
