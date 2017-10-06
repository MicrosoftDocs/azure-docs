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

* Azure Active Directory service principal credentials - See [How to create a service principal with the CLI](../azure-resource-manager/resource-group-authenticate-service-principal-cli.md)

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

## Authenticate with Batch AI

To be able to access Azure Batch AI, you need to authenticate using Azure Active Directory. Below is code to authenticate with the service (create a `BatchAIManagementClient` object) using your service principal credentials and subscription ID:

```Python
from azure.common.credentials import ServicePrincipalCredentials
import azure.mgmt.batchai as batchai
import azure.mgmt.batchai.models as models

creds = ServicePrincipalCredentials(
		client_id=client_id, secret=secret, token_uri=token_uri)

client = batchai.BatchAIManagementClient(credentials=creds,
                                         subscription_id=subscription_id
)
A resource group need to be created before using BatchAI

from azure.mgmt.resource import ResourceManagementClient

resource_group_name = 'quickstartrg'

client = ResourceManagementClient(
        credentials=creds, subscription_id=subscription_id)

resource = client.resource_groups.create_or_update(
        resource_group_name, {'location': 'eastus'})

```
# Create a resource group

Batch AI clusters and jobs are Azure resources and must be placed in an Azure resource group, a logical collection into which Azure resources are deployed and managed. The following snippet creates a resource group:

```Python
from azure.mgmt.resource import ResourceManagementClient

resource_group_name = 'quickstartrg'

client = ResourceManagementClient(
        credentials=creds, subscription_id=subscription_id)

resource = client.resource_groups.create_or_update(
        resource_group_name, {'location': 'eastus'})


```


## Prepare Azure file share
For illustration purposes, this quickstart uses an Azure file share to host the training data and scripts for the learning job. Create a file share named *batchaiquickstart*
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
