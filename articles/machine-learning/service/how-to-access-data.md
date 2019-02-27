---
title: Access data in datastores / blobs for training
titleSuffix: Azure Machine Learning service
description: Learn how to use datastores to access blob data storage during training with Azure Machine Learning service
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: minxia
author: mx-iao
ms.reviewer: sgilley
ms.date: 02/25/2019
ms.custom: seodec18


---

# Access data from your datastores
In this article, you learn different ways to access and interact with your data in Azure Machine Learning workflows via datastores.

This how-to shows examples for the following tasks: 
* [Choose a datastore](#access)
* [Get a datastore](#get)
* [Upload and download data to datastores](#upload-and-download-data)
* [Access datastore during training](#access-datastores-for-training)

## Prerequisites

To use datastores, you need a [workspace](concept-azure-machine-learning-architecture.md#workspace) first. 

Start by either [creating a new workspace](quickstart-create-workspace-with-python.md) or retrieving an existing one:

```Python
import azureml.core
from azureml.core import Workspace, Datastore

ws = Workspace.from_config()
```

Or, [follow this Python quickstart](quickstart-create-workspace-with-python.md) to use the SDK to create your workspace and get started.

<a name="access"></a>

## Choose a datastore

You can use the default datastore or bring your own.

### Use the default datastore in your workspace

No need to create or configure a storage account since each workspace has a default datastore. You can use that datastore right away as it is already registered in the workspace. 

To get the workspace's default datastore:
```Python
ds = ws.get_default_datastore()
```

### Register your own datastore with the workspace
If you have existing Azure Storage, you can register it as a datastore on your workspace.   All the register methods are on the [`Datastore`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.datastore(class)?view=azure-ml-py) class and have the form register_azure_*. 

The following examples show you to register an Azure Blob Container or an Azure File Share as a datastore.

+ For an **Azure Blob Container Datastore**, use [`register_azure_blob-container()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.datastore(class)?view=azure-ml-py#register-azure-blob-container-workspace--datastore-name--container-name--account-name--sas-token-none--account-key-none--protocol-none--endpoint-none--overwrite-false--create-if-not-exists-false--skip-validation-false-:)

  ```Python
  ds = Datastore.register_azure_blob_container(workspace=ws, 
                                               datastore_name='your datastore name', 
                                               container_name='your azure blob container name',
                                               account_name='your storage account name', 
                                               account_key='your storage account key',
                                               create_if_not_exists=True)
  ```


#### Azure File Share Datastore
To register an Azure File Share datastore, use [`register_azure_file_share()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.datastore(class)?view=azure-ml-py#register-azure-file-share-workspace--datastore-name--file-share-name--account-name--sas-token-none--account-key-none--protocol-none--endpoint-none--overwrite-false--create-if-not-exists-false--skip-validation-false-)

```Python
ds = Datastore.register_azure_file_share(workspace=ws, 
                                         datastore_name='your datastore name', 
                                         container_name='your file share name',
                                         account_name='your storage account name', 
                                         account_key='your storage account key',
                                         create_if_not_exists=True)
```

### Get an existing datastore
The [`get()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.datastore(class)?view=azure-ml-py#get-workspace--datastore-name-) method queries for an already registered datastore by name:

```Python
#get named datastore from current workspace
ds = Datastore.get(ws, datastore_name='your datastore name')
```

To get a list of all datastores in a given workspace, use this code:

```Python
#list all datastores registered in current workspace
datastores = ws.datastores
for name, ds in datastores.items():
    print(name, ds.datastore_type)
```

To define a different default datastore for the current workspace, use [`set_default_datastore()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace(class)?view=azure-ml-py#set-default-datastore-name-):

```Python
#define default datastore for current workspace
ws.set_default_datastore('your datastore name')
```

## Upload and download data
### Upload
Upload either a directory or individual files to the datastore using the Python SDK.

To upload a directory to a datastore `ds`:

```Python
ds.upload(src_dir='your source directory',
          target_path='your target path',
          overwrite=True,
          show_progress=True)
```
`target_path` specifies the location in the file share (or blob container) to upload. It defaults to `None`, in which case the data gets uploaded to root. `overwrite=True` will overwrite any existing data at `target_path`.

Or upload a list of individual files to the datastore via the datastore's `upload_files()` method.

### Download
Similarly, download data from a datastore to your local file system.

```Python
ds.download(target_path='your target path',
            prefix='your prefix',
            show_progress=True)
```
`target_path` is the location of the local directory to download the data to. To specify a path to the folder in the file share (or blob container) to download, provide that path to `prefix`. If `prefix` is `None`, all the contents of your file share (or blob container) will get downloaded.

## Access datastores during training
You can access a datastore during a training run (for example, for training or validation data) on a remote compute target via the Python SDK using the [`DataReference`](https://docs.microsoft.com/python/api/azureml-core/azureml.data.data_reference.datareference?view=azure-ml-py) class.

There are several ways to make your datastore available on the remote compute.

Way|Method|Description
----|-----|--------
Mount| [`as_mount()`](https://docs.microsoft.com/python/api/azureml-core/azureml.data.data_reference.datareference?view=azure-ml-py#as-mount--)| Use to mount a datastore on the remote compute.
Download|[`as_download()`](https://docs.microsoft.com/python/api/azureml-core/azureml.data.data_reference.datareference?view=azure-ml-py#as-download-path-on-compute-none--overwrite-false-)|Use to download data from the location specified by `path_on_compute` on your datastore to the remote compute.
Upload|[`as_upload()`](https://docs.microsoft.com/python/api/azureml-core/azureml.data.data_reference.datareference?view=azure-ml-py#as-upload-path-on-compute-none--overwrite-false-)| Use to upload data to the root of your datastore from the location specified by `path_on_compute`.

```Python
import azureml.data
from azureml.data import DataReference

ds.as_mount()
ds.as_download(path_on_compute='your path on compute')
ds.as_upload(path_on_compute='yourfilename')
```  

### Reference files/folders
To reference a specific folder or file in your datastore, use the datastore's [`path()`](https://docs.microsoft.com/python/api/azureml-core/azureml.data.data_reference.datareference?view=azure-ml-py#path-path-none--data-reference-name-none-) function.

```Python
#download the contents of the `./bar` directory from the datastore 
ds.path('./bar').as_download()
```


### Examples 

Any `ds` or `ds.path` object resolves to an environment variable name of the format `"$AZUREML_DATAREFERENCE_XXXX"` whose value represents the mount/download path on the remote compute. The datastore path on the remote compute might not be the same as the execution path for the script.

To access your datastore during training, pass it into your training script as a command-line argument via `script_params` from the [`Estimator`](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.estimator.estimator?view=azure-ml-py) class.

```Python
from azureml.train.estimator import Estimator

script_params = {
    '--data_dir': ds.as_mount()
}

est = Estimator(source_directory='your code directory',
                script_params=script_params,
                compute_target=compute_target,
                entry_script='train.py')
```
`as_mount()` is the default mode for a datastore, so you could also directly pass `ds` to the `'--data_dir'` argument.

Or pass in a list of datastores to the Estimator constructor `inputs` parameter to mount or copy to/from your datastore(s). This code example:
* Downloads all the contents in datastore `ds1` to the remote compute before your training script `train.py` is run
* Downloads the folder `'./foo'` in datastore `ds2` to the remote compute before `train.py` is run
* Uploads the file `'./bar.pkl'` from the remote compute up to the datastore `d3` after your script has run

```Python
est = Estimator(source_directory='your code directory',
                compute_target=compute_target,
                entry_script='train.py',
                inputs=[ds1.as_download(), ds2.path('./foo').as_download(), ds3.as_upload(path_on_compute='./bar.pkl')])
```


## Next steps

* [Train a model](how-to-train-ml-models.md)

* [Deploy a model](how-to-deploy-and-where.md)
