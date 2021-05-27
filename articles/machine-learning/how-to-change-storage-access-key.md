---
title: Change storage account access keys
titleSuffix: Azure Machine Learning
description: Learn how to change the access keys for the Azure Storage account used by your workspace. Azure Machine Learning uses an Azure Storage account to store data and models. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 06/19/2020


---

# Regenerate storage account access keys


Learn how to change the access keys for Azure Storage accounts used by Azure Machine Learning. Azure Machine Learning can use storage accounts to store data or trained models.

For security purposes, you may need to change the access keys for an Azure Storage account. When you regenerate the access key, Azure Machine Learning must be updated to use the new key. Azure Machine Learning may be using the storage account for both model storage and as a datastore.

> [!IMPORTANT]

> Credentials registered with datastores are saved in your Azure Key Vault associated with the workspace. If you have [soft-delete](../key-vault/general/soft-delete-overview.md) enabled for your Key Vault, this article provides instructions for updating credentials. If you unregister the datastore and try to re-register it under the same name, this action will fail. See [Turn on Soft Delete for an existing key vault]( https://docs.microsoft.com/azure/key-vault/general/soft-delete-change#turn-on-soft-delete-for-an-existing-key-vault) for how to enable soft delete in this scenario.

## Prerequisites

* An Azure Machine Learning workspace. For more information, see the [Create a workspace](how-to-manage-workspace.md) article.

* The [Azure Machine Learning SDK](/python/api/overview/azure/ml/install).

* The [Azure Machine Learning CLI extension](reference-azure-machine-learning-cli.md).

> [!NOTE]
> The code snippets in this document were tested with version 1.0.83 of the Python SDK.

<a id="whattoupdate"></a> 

## What needs to be updated

Storage accounts can be used by the Azure Machine Learning workspace (storing logs, models, snapshots, etc.) and as a datastore. The process to update the workspace is a single Azure CLI command, and can be ran after updating the storage key. The process of updating datastores is more involved, and requires discovering what datastores are currently using the storage account and then re-registering them.

> [!IMPORTANT]
> Update the workspace using the Azure CLI, and the datastores using Python, at the same time. Updating only one or the other is not sufficient, and may cause errors until both are updated.

To discover the storage accounts that are used by your datastores, use the following code:

```python
import azureml.core
from azureml.core import Workspace, Datastore

ws = Workspace.from_config()

default_ds = ws.get_default_datastore()
print("Default datstore: " + default_ds.name + ", storage account name: " +
      default_ds.account_name + ", container name: " + default_ds.container_name)

datastores = ws.datastores
for name, ds in datastores.items():
    if ds.datastore_type == "AzureBlob":
        print("Blob store - datastore name: " + name + ", storage account name: " +
              ds.account_name + ", container name: " + ds.container_name)
    if ds.datastore_type == "AzureFile":
        print("File share - datastore name: " + name + ", storage account name: " +
              ds.account_name + ", container name: " + ds.container_name)
```

This code looks for any registered datastores that use Azure Storage and lists the following information:

* Datastore name: The name of the datastore that the storage account is registered under.
* Storage account name: The name of the Azure Storage account.
* Container: The container in the storage account that is used by this registration.

It also indicates whether the datastore is for an Azure Blob or an Azure File share, as there are different methods to re-register each type of datastore.

If an entry exists for the storage account that you plan on regenerating access keys for, save the datastore name, storage account name, and container name.

## Update the access key

To update Azure Machine Learning to use the new key, use the following steps:

> [!IMPORTANT]
> Perform all steps, updating both the workspace using the CLI, and datastores using Python. Updating only one or the other may cause errors until both are updated.

1. Regenerate the key. For information on regenerating an access key, see [Manage storage account access keys](../storage/common/storage-account-keys-manage.md). Save the new key.

1. The Azure Machine Learning workspace will automatically synchronize the new key and begin using it after an hour. To force the workspace to synch to the new key immediately, use the following steps:

    1. To sign in to the Azure subscription that contains your workspace by using the following Azure CLI command:

        ```azurecli-interactive
        az login
        ```

        [!INCLUDE [select-subscription](../../includes/machine-learning-cli-subscription.md)]

    1. To update the workspace to use the new key, use the following command. Replace `myworkspace` with your Azure Machine Learning workspace name, and replace `myresourcegroup` with the name of the Azure resource group that contains the workspace.

        ```azurecli-interactive
        az ml workspace sync-keys -w myworkspace -g myresourcegroup
        ```

        [!INCLUDE [install extension](../../includes/machine-learning-service-install-extension.md)]

        This command automatically syncs the new keys for the Azure storage account used by the workspace.

1. You can re-register datastore(s) that use the storage account via the SDK or [the Azure Machine Learning studio](https://ml.azure.com).
    1. **To re-register datastores via the Python SDK**, use the values from the [What needs to be updated](#whattoupdate) section and the key from step 1 with the following code. 
    
        Since `overwrite=True` is specified, this code overwrites the existing registration and updates it to use the new key.
    
        ```python
        # Re-register the blob container
        ds_blob = Datastore.register_azure_blob_container(workspace=ws,
                                                  datastore_name='your datastore name',
                                                  container_name='your container name',
                                                  account_name='your storage account name',
                                                  account_key='new storage account key',
                                                  overwrite=True)
        # Re-register file shares
        ds_file = Datastore.register_azure_file_share(workspace=ws,
                                              datastore_name='your datastore name',
                                              file_share_name='your container name',
                                              account_name='your storage account name',
                                              account_key='new storage account key',
                                              overwrite=True)
        
        ```
    
    1. **To re-register datastores via the studio**, select **Datastores** from the left pane of the studio. 
        1. Select which datastore you want to update.
        1. Select the **Update credentials** button on the top left. 
        1. Use your new access key from step 1 to populate the form and click **Save**.
        
            If you are updating credentials for your **default datastore**, complete this step and repeat step 2b to resync your new key with the default datastore of the workspace. 

## Next steps

For more information on registering datastores, see the [`Datastore`](/python/api/azureml-core/azureml.core.datastore%28class%29) class reference.