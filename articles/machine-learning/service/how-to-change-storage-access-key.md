---
title: Change storage account access keys
titleSuffix: Azure Machine Learning service
description: Learn how to change the access keys for the Azure Storage account used by your workspace. Azure Machine Learning service uses an Azure Storage account to store data and models. When you regenerate the access key for the storage account, you must update the Azure Machine Learning service to use the new keys.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 05/17/2019


---

# Regenerate storage account access keys

Learn how to change the access keys for Azure Storage accounts used by the Azure Machine Learning service. Azure Machine Learning can use storage accounts to store data or trained models.

For security purposes, you may need to change the access keys for an Azure Storage account. When you regenerate the access key, Azure Machine Learning must be updated to use the new key. Azure Machine Learning may be using the storage account for both model storage and as a datastore.

## Prerequisites

* An Azure Machine Learning service workspace. For more information, see the [Create a workspace](setup-create-workspace.md) article.

* The [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py).

* The [Azure Machine Learning CLI extension](reference-azure-machine-learning-cli.md).

<a id="whattoupdate"></a> 

## What needs to be updated

Storage accounts can be used by the Azure Machine Learning service workspace (storing logs, models, snapshots, etc.) and as a datastore. The process to update the workspace is a single Azure CLI command, and can be ran after updating the storage key. The process of updating datastores is more involved, and requires discovering what datastores are currently using the storage account and then re-registering them.

> [!IMPORTANT]
> Update the workspace using the Azure CLI, and the datastores using Python, at the same time. Updating only one or the other is not sufficient, and may cause errors until both are updated.

To discover the storage accounts that are used by your datastores, use the following code:

```python
import azureml.core
from azureml.core import Workspace, Datastore

ws = Workspace.from_config()

default_ds = ws.get_default_datastore()
print("Default datstore: " + default_ds.name + ", storage account name: " + default_ds.account_name + ", container name: " + ds.container_name)

datastores = ws.datastores
for name, ds in datastores.items():
    if ds.datastore_type == "AzureBlob" or ds.datastore_type == "AzureFile":
        print("datastore name: " + name + ", storage account name: " + ds.account_name + ", container name: " + ds.container_name)
```

This code looks for any registered datastores that use Azure Storage and lists the following information:

* Datastore name: The name of the datastore that the storage account is registered under.
* Storage account name: The name of the Azure Storage account.
* Container: The container in the storage account that is used by this registration.

If an entry exists for the storage account that you plan on regenerating access keys for, save the datastore name, storage account name, and container name.

## Update the access key

To update Azure Machine Learning service to use the new key, use the following steps:

> [!IMPORTANT]
> Perform all steps, updating both the workspace using the CLI, and datastores using Python. Updating only one or the other may cause errors until both are updated.

1. Regenerate the key. For information on regenerating an access key, see the [Manage a storage account](/azure/storage/common/storage-account-manage#access-keys) article. Save the new key.

1. To update the workspace to use the new key, use the following steps:

    1. To sign in to the Azure subscription that contains your workspace by using the following Azure CLI command:

        ```azurecli-interactive
        az login
        ```

    1. To install the Azure Machine Learning extension, use the following command:

        ```azurecli-interactive
        az extension add -n azure-cli-ml 
        ```

    1. To update the workspace to use the new key, use the following command. Replace `myworkspace` with your Azure Machine Learning workspace name, and replace `myresourcegroup` with the name of the Azure resource group that contains the workspace.

        ```azurecli-interactive
        az ml workspace sync-keys -w myworkspace -g myresourcegroup
        ```

        This command automatically syncs the new keys for the Azure storage account used by the workspace.

1. To re-register datastore(s) that use the storage account, use the values from the [What needs to be updated](#whattoupdate) section and the key from step 1 with the following code:

    ```python
    ds = Datastore.register_azure_blob_container(workspace=ws, 
                                              datastore_name='your datastore name', 
                                              container_name='your container name',
                                              account_name='your storage account name', 
                                              account_key='new storage account key',
                                              overwrite=True)
    ```

    Since `overwrite=True` is specified, this code overwrites the existing registration and updates it to use the new key.

## Next steps

For more information on registering datastores, see the [`Datastore`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.datastore(class)?view=azure-ml-py) class reference.
