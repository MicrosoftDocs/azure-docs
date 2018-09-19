---
title: Use datastores in Azure Machine Learning to access data
description: How to use datastores to access data storage during training
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: minxia
author: mx-iao
ms.reviewer: sgilley
ms.date: 09/24/2018
---

# How to access data during training
In Azure Machine Learning services, a Datastore is an abstraction over [Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-introduction). The datastore can reference either an [Azure Blob](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction) container or [Azure file share](https://docs.microsoft.com/azure/storage/files/storage-files-introduction) as the underlying storage. Datastores allow you to easily access and interact with your data storage during your Azure Machine Learning workflows via the Python SDK or CLI.

## Create a datastore
In order to use datastores, you will first need a [Workspace](concept-azure-machine-learning-architecture.md#workspace). You can either create a new workspace or retrieve an existing one:

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
If you already have existing Azure Storage, you can register it as a datastore on your workspace. Azure Machine Learning provides the functionality to register an Azure Blob Container or Azure File Share as a datastore. All the register methods are on the `Datastore` class and have the form `register_azure_*`.

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
    print(name, ds.datastore_type)"
```

For convenience, if you would like to set one of your registered datastores as the default datastore for your workspace, you can do so as follows:
```Python
ws.set_default_datastore('your datastore name')
```

## Upload and download data
### Upload
You can upload either a directory or individual files to the datastore using the Python SDK.

To upload a directory to a datastore `ds`:
```Python
ds.upload(src_dir='your source directory',
          target_path='your target path',
          overwrite=True,
          show_progress=True)
```
`target_path` specifies the location in the file share (or blob container) to upload. It defaults to `None`, in which case the data gets uploaded to root. `overwrite=True` will overwrite any existing data at `target_path`.

You can alternatively upload a list of individual files to the datastore via the datastore's `upload_files()` method.

### Download
Similarly, you can download data from a datastore to your local file system.

```Python
ds.download(target_path='your target path',
            prefix='your prefix',
            show_progress=True)
```
`target_path` is the location of the local directory to download the data to. To specify a path to the folder in the file share (or blob container) to download, provide that path to `prefix`. If `prefix` is `None`, all the contents of your file share (or blob container) will get downloaded.

## Access datastores for training
You can access a datastore during a training run (e.g. for training or validation data) on a remote compute target via the Python SDK. 

There are two supported ways to make your datastore available on the remote compute:
* **Mount**  
`ds.as_mount()`: by specifying this mount mode, the datastore will get mounted for you on the remote compute. 
* **Download/upload**  
    * `ds.as_download(path_on_compute='your path on compute')`: with this download mode, the data will get downloaded from your datastore to the remote compute to the location specified by `path_on_compute`.
    * Conversely, you can also upload data that was produced from your training run up to a datastore. For example, if your training script creates a `foo.pkl` file in the current working directory on the remote compute, you can specify for it to get uploaded to your datastore after the script has been run: `ds.as_upload(path_on_compute='./foo.pkl')`. This will upload the file to the root of your datastore.
    
If you want to reference a specific folder or file in your datastore, you can use the datastore's **`path`** function. For example, if your datastore has a directory with relative path `./bar`, and you only want to download the contents of this folder to the compute target, you can do so as follows: `ds.path('./bar').as_download()`

Any `ds` or `ds.path` object resolves to an environment variable name of the format `"$AZUREML_DATAREFERENCE_XXXX"` whose value represents the mount/download path on the remote compute. The datastore path on the remote compute might not be the same as the execution path for the script.

To access your datastore during training, you can pass it into your training script as a command-line argument via `script_params`:

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

Alternatively, you can pass in a list of datastores to the `inputs` parameter of the Estimator constructor to mount or copy to/from your datastore(s):

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
