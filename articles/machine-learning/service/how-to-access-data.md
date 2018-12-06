---
title: Access data in datastores
titleSuffix: Azure Machine Learning service
description: How to use datastores to access data storage during training with Azure Machine Learning service
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: minxia
author: mx-iao
ms.reviewer: sgilley
ms.date: 09/24/2018
ms.custom: seodec18


---

# How to access data during training
Use a datastore to access and interact with your data in Azure Machine Learning workflows.

In Azure Machine Learning service, the datastore is an abstraction over [Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-introduction). The datastore can reference either an [Azure Blob](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction) container or [Azure file share](https://docs.microsoft.com/azure/storage/files/storage-files-introduction) as the underlying storage. 

## Create a datastore
To use datastores, you first need a [workspace](concept-azure-machine-learning-architecture.md#workspace). Start by either [creating a new workspace](quickstart-create-workspace-with-python.md) or retrieving an existing one:

```Python
import azureml.core
from azureml.core import Workspace

ws = Workspace.from_config()
```

### Use the default datastore
No need to create or configure a storage account.  Each workspace has a default datastore that you can start using immediately.

To get the workspace's default datastore:
```Python
ds = ws.get_default_datastore()
```

### Register a datastore
If you have existing Azure Storage, you can register it as a datastore on your workspace. You can register an Azure Blob Container or Azure File Share as a datastore. All the register methods are on the `Datastore` class and have the form `register_azure_*`.

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

### Get an existing datastore
To query for a registered datastore by name:
```Python
ds = Datastore.get(ws, datastore_name='your datastore name')
```

You can also get all the datastores for a workspace:
```Python
datastores = ws.datastores()
for name, ds in datastores.items(),
    print(name, ds.datastore_type)
```

For convenience, set one of your registered datastores as the default datastore for your workspace:
```Python
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

## Access datastores for training
You can access a datastore during a training run (for example, for training or validation data) on a remote compute target via the Python SDK. 

There are two supported ways to make your datastore available on the remote compute:
* **Mount**  
`ds.as_mount()`: by specifying this mount mode, the datastore will get mounted for you on the remote compute. 
* **Download/upload**  
    * `ds.as_download(path_on_compute='your path on compute')` downloads data from your datastore to the remote compute to the location specified by `path_on_compute`.
    * `ds.as_upload(path_on_compute='yourfilename'` uploads data to the datastore.  Suppose your training script creates a `foo.pkl` file in the current working directory on the remote compute. Upload this file to your datastore with `ds.as_upload(path_on_compute='./foo.pkl')` after the script creates the file. The file is uploaded to the root of your datastore.
    
To reference a specific folder or file in your datastore, use the datastore's **`path`** function. For example, to download the contents of the `./bar` directory from the datastore to your compute target, use `ds.path('./bar').as_download()`.

Any `ds` or `ds.path` object resolves to an environment variable name of the format `"$AZUREML_DATAREFERENCE_XXXX"` whose value represents the mount/download path on the remote compute. The datastore path on the remote compute might not be the same as the execution path for the script.

To access your datastore during training, pass it into your training script as a command-line argument via `script_params`:

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
`as_mount()` is the default mode for a datastore, so you could also directly just pass `ds` to the `'--data_dir'` argument.

Or pass in a list of datastores to the Estimator constructor `inputs` parameter to mount or copy to/from your datastore(s):

```Python
est = Estimator(source_directory='your code directory',
                compute_target=compute_target,
                entry_script='train.py',
                inputs=[ds1.as_download(), ds2.path('./foo').as_download(), ds3.as_upload(path_on_compute='./bar.pkl')])
```
The above code will:
* download all the contents in datastore `ds1` to the remote compute before your training script `train.py` is run
* download the folder `'./foo'` in datastore `ds2` to the remote compute before `train.py` is run
* upload the file `'./bar.pkl'` from the remote compute up to the datastore `d3` after your script has run

## Next steps
* [Train a model](how-to-train-ml-models.md)
