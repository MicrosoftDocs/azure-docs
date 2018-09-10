---
title: <insert title>
description: <insert description>
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: minxia
author: mx-iao
ms.reviewer: sgilley
ms.date: 09/24/2018
---

# How to Use Datastores
In Azure Machine Learning services, a datastore is an abstraction over [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-introduction). The datastore can either use an [Azure Blob](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction) container, [Azure file share](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-introduction), or [Azure Data Lake Storage](https://docs.microsoft.com/en-us/azure/storage/data-lake-storage/introduction) (ADLS) as the backend storage. Datastores allow you to easily access and interact with your data storage during your Azure Machine Learning workflows via the Python SDK or CLI.

## Create a datastore
In order to use datastores, you will first need a [workspace](). You can either create a new workspace or retrieve an existing one:

```Python
import azureml.core
from azureml.core import Workspace

ws = Workspace.from_config()
```

### Use the default datastore
Each workspace has a default datastore that you can start using immediately, which saves you the work of creating and configuring your own storage accounts.

To get the workspace's default datastore:
```Python
ds = ws.get_default_datastore()
```

### Register a datastore
If you already have existing Azure Storage, you can register it as a datastore on your workspace. Azure ML provides the functionality to register an Azure Blob Container, Azure File Share, or Azure Data Lake as a datastore. All the register methods are on the `Datastore` class and have the form `register_azure_*`.

#### Azure Blob Container Datastore
To register an Azure Blob Container datastore:

```Python
ds = Datastore.register_azure_blob_container(workspace=ws, 
                                            datastore_name='your datastore name', 
                                            container_name='your azure blob container name',
                                            account_name='your storage account name', 
                                            account_key='your storage account key',
                                            create_if_not_exists=True)
```

#### Azure File Share Datastore
To register an Azure File Share datastore:

```Python
ds = Datastore.register_azure_file_share(workspace=ws, 
                                        datastore_name='your datastore name', 
                                        container_name='your file share name',
                                        account_name='your storage account name', 
                                        account_key='your storage account key',
                                        create_if_not_exists=True)
```

#### Azure Data Lake Datastore
To register an Azure Data Lake datastore:

```Python
ds = Datastore.register_azure_data_lake(workspace=ws, 
                                        datastore_name='your datastore name', 
                                        store_name='your ADLS store name',
                                        tenant_id='the Directory ID/Tenant ID of the service principal',
                                        cliend_id='the Client ID/Application ID of the service principal',
                                        client_secret='the secret of the service principal')
```


For registering an Azure Blob Container or Azure File Share, if you want to use a SAS token, provide the token to the `sas_token` parameter of the `Datastore.register_azure_*` function. You must use an [account SAS](https://docs.microsoft.com/en-us/azure/storage/common/storage-dotnet-shared-access-signature-part-1#types-of-shared-access-signatures).

### Get an existing datastore
To query for a registered datastore by name:
```Python
ds = Datastore.get(ws, datastore_name='your datastore name')
```

You can also get a list of all the datastores for a workspace:
```Python
for ds in ws.datastores():
    print(ds.name, ds.datastore_type)
```

For convenience, if you would like to set one of your registered datastores as the default datastore for your workspace, you can do so as follows:
```Python
ws.set_default_datastore('your datastore name')
```

## Upload and download data
### Upload
For datastores of type `AzureBlobDatastore` and `AzureFileDatastore`, you can upload either a directory or individual files to the datastore using the Python SDK.

To upload a directory to a datastore `ds`:
```Python
ds.upload(src_dir='your source directory',
          target_path='your target path',
          overwrite=True,
          show_progress=True)
```
`target_path` specifies the location in the file share (or blob container) to upload. It defaults to `None`, in which case the data gets uploaded to root. `overwrite=True` will overwrite any existing data at `target_path`.

You can alternatively upload a list of individual files to the datastore via the [`upload_files`]() method.

### Download
Similarly, you can download data from a datastore to your local file system for datastores of type `AzureBlobDatastore` and `AzureFileDatastore`.

```Python
ds.download(target_path='your target path',
            prefix='your prefix',
            show_progress=True)
```
`target_path` is the location of the local directory to download the data to. To specify a path to the folder in the file share (or blob container) to download, provide that path to `prefix`. If `prefix` is `None`, all the contents of your file share (or blob container) will get downloaded.

## Use datastore for training

## Next steps

## Misc
- DataReference
- Mounting things via run config?

## Appendix
A datastore is a storage abstraction over an Azure Storage Account. The datastore can use either an Azure blob container or an Azure file share as the backend storage. Each workspace has a default datastore, and you may register additional datastores.

Use the Python SDK API or Azure Machine Learning CLI to store and retrieve files from the datastore.

Below is a guide that shows all of the features of datastore. You can choose to use datastores in the data plane or in the control plane.

In the data plane, you can get datastores in your scripts and download data from them and upload data to them. You have full control of when to download data and when to upload data.

In the control plane, by adding datastore config to your run config, you can have datastores mounted in the remote compute target, or you can tell us to download data from different datastores to different locations on the remote compute target before your scripts are invoked and upload data from different locations on the remote compute target to different datastores after your scripts have been ran.
