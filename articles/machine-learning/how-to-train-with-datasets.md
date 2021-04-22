---
title: Train with machine learning datasets
titleSuffix: Azure Machine Learning
description:  Learn how to make your data available to your local or remote compute for model training with Azure Machine Learning datasets.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: sihhu
author: MayMSFT
manager: cgronlun
ms.reviewer: nibaccam
ms.date: 07/31/2020
ms.topic: conceptual
ms.custom: how-to, devx-track-python, data4ml

# Customer intent: As an experienced Python developer, I need to make my data available to my local or remote compute target to train my machine learning models.

---

# Train models with Azure Machine Learning datasets 

In this article, you learn how to work with [Azure Machine Learning datasets](/python/api/azureml-core/azureml.core.dataset%28class%29) to train machine learning models.  You can use datasets in your local or remote compute target without worrying about connection strings or data paths. 

Azure Machine Learning datasets provide a seamless integration with Azure Machine Learning training functionality like [ScriptRunConfig](/python/api/azureml-core/azureml.core.scriptrunconfig), [HyperDrive](/python/api/azureml-train-core/azureml.train.hyperdrive), and [Azure Machine Learning pipelines](./how-to-create-machine-learning-pipelines.md).

If you are not ready to make your data available for model training, but want to load your data to your notebook for data exploration, see how to [explore the data in your dataset](how-to-create-register-datasets.md#explore-data). 

## Prerequisites

To create and train with datasets, you need:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

* An [Azure Machine Learning workspace](how-to-manage-workspace.md).

* The [Azure Machine Learning SDK for Python installed](/python/api/overview/azure/ml/install) (>= 1.13.0), which includes the `azureml-datasets` package.

> [!Note]
> Some Dataset classes have dependencies on the [azureml-dataprep](https://pypi.org/project/azureml-dataprep/) package. For Linux users, these classes are supported only on the following distributions:  Red Hat Enterprise Linux, Ubuntu, Fedora, and CentOS.

## Consume datasets in machine learning training scripts

If you have structured data not yet registered as a dataset, create a TabularDataset and use it directly in your training script for your local or remote experiment.

In this example, you create an unregistered [TabularDataset](/python/api/azureml-core/azureml.data.tabulardataset) and specify it as a script argument in the [ScriptRunConfig](/python/api/azureml-core/azureml.core.script_run_config.scriptrunconfig) object for training. If you want to reuse this TabularDataset with other experiments in your workspace, see [how to register datasets to your workspace](how-to-create-register-datasets.md#register-datasets).

### Create a TabularDataset

The following code creates an unregistered TabularDataset from a web url.  

```Python
from azureml.core.dataset import Dataset

web_path ='https://dprepdata.blob.core.windows.net/demo/Titanic.csv'
titanic_ds = Dataset.Tabular.from_delimited_files(path=web_path)
```

TabularDataset objects provide the ability to load the data in your TabularDataset into a pandas or Spark DataFrame so that you can work with familiar data preparation and training libraries without having to leave your notebook.

### Access dataset in training script

The following code configures a script argument `--input-data` that you will specify when you configure your training run (see next section). When the tabular dataset is passed in as the argument value, Azure ML will resolve that to ID of the dataset, which you can then use to access the dataset in your training script (without having to hardcode the name or ID of the dataset in your script). It then uses the [`to_pandas_dataframe()`](/python/api/azureml-core/azureml.data.tabulardataset#to-pandas-dataframe-on-error--null---out-of-range-datetime--null--) method to load that dataset into a pandas dataframe for further data exploration and preparation prior to training.

> [!Note]
> If your original data source contains NaN, empty strings or blank values, when you use `to_pandas_dataframe()`, then those values are replaced as a *Null* value.

If you need to load the prepared data into a new dataset from an in-memory pandas dataframe, write the data to a local file, like a parquet, and create a new dataset from that file. Learn more about [how to create datasets](how-to-create-register-datasets.md).

```Python
%%writefile $script_folder/train_titanic.py

import argparse
from azureml.core import Dataset, Run

parser = argparse.ArgumentParser()
parser.add_argument("--input-data", type=str)
args = parser.parse_args()

run = Run.get_context()
ws = run.experiment.workspace

# get the input dataset by ID
dataset = Dataset.get_by_id(ws, id=args.input_data)

# load the TabularDataset to pandas DataFrame
df = dataset.to_pandas_dataframe()
```

### Configure the training run

A [ScriptRunConfig](/python/api/azureml-core/azureml.core.scriptrun) object is used to configure and submit the training run.

This code creates a ScriptRunConfig object, `src`, that specifies

* A script directory for your scripts. All the files in this directory are uploaded into the cluster nodes for execution.
* The training script, *train_titanic.py*.
* The input dataset for training, `titanic_ds`, as a script argument. Azure ML will resolve this to corresponding ID of the dataset when it is passed to your script.
* The compute target for the run.
* The environment for the run.

```python
from azureml.core import ScriptRunConfig

src = ScriptRunConfig(source_directory=script_folder,
                      script='train_titanic.py',
                      # pass dataset as an input with friendly name 'titanic'
                      arguments=['--input-data', titanic_ds.as_named_input('titanic')],
                      compute_target=compute_target,
                      environment=myenv)
                             
# Submit the run configuration for your training run
run = experiment.submit(src)
run.wait_for_completion(show_output=True)                             
```

## Mount files to remote compute targets

If you have unstructured data, create a [FileDataset](/python/api/azureml-core/azureml.data.filedataset) and either mount or download your data files to make them available to your remote compute target for training. Learn about when to use [mount vs. download](#mount-vs-download) for your remote training experiments. 

The following example, 

* Creates an input FileDataset, `mnist_ds`, for your training data.
* Specifies where to write training results, and to promote those results as a FileDataset.
* Mounts the input dataset to the compute target.

> [!Note]
> If you are using a custom Docker base image, you will need to install fuse via `apt-get install -y fuse` as a dependency for dataset mount to work. Learn how to [build a custom build image](how-to-deploy-custom-docker-image.md#build-a-custom-base-image).

For the notebook example , see [How to configure a training run with data input and output](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/work-with-data/datasets-tutorial/scriptrun-with-data-input-output/how-to-use-scriptrun.ipynb).

### Create a FileDataset

The following example creates an unregistered FileDataset, `mnist_data` from web urls. This FileDataset is the input data for your training run.

Learn more about [how to create datasets](how-to-create-register-datasets.md) from other sources.

```Python

from azureml.core.dataset import Dataset

web_paths = [
            'http://yann.lecun.com/exdb/mnist/train-images-idx3-ubyte.gz',
            'http://yann.lecun.com/exdb/mnist/train-labels-idx1-ubyte.gz',
            'http://yann.lecun.com/exdb/mnist/t10k-images-idx3-ubyte.gz',
            'http://yann.lecun.com/exdb/mnist/t10k-labels-idx1-ubyte.gz'
            ]

mnist_ds = Dataset.File.from_files(path = web_paths)

```
### Where to write training output

You can specify where to write your training results with an [OutputFileDatasetConfig object](/python/api/azureml-core/azureml.data.output_dataset_config.outputfiledatasetconfig). 

OutputFileDatasetConfig objects allow you to: 

* Mount or upload the output of a run to cloud storage you specify.
* Save the output as a FileDataset to these supported storage types:
    * Azure blob
    * Azure file share
    * Azure Data Lake Storage generations 1 and 2
* Track the data lineage between training runs.

The following code specifies that training results should be saved as a FileDataset in the `outputdataset` folder in the default blob datastore, `def_blob_store`. 

```python
from azureml.core import Workspace
from azureml.data import OutputFileDatasetConfig

ws = Workspace.from_config()

def_blob_store = ws.get_default_datastore()
output = OutputFileDatasetConfig(destination=(def_blob_store, 'sample/outputdataset'))
```

### Configure the training run

We recommend passing the dataset as an argument when mounting via the `arguments` parameter of the `ScriptRunConfig` constructor. By doing so, you get the data path (mounting point) in your training script via arguments. This way, you are able to use the same training script for local debugging and remote training on any cloud platform.

The following example creates a ScriptRunConfig that passes in the FileDataset via `arguments`. After you submit the run, data files referred to by the dataset `mnist_ds` are mounted to the compute target, and training results are saved to the specified `outputdataset` folder in the default datastore.

```python
from azureml.core import ScriptRunConfig

input_data= mnist_ds.as_named_input('input').as_mount()# the dataset will be mounted on the remote compute 

src = ScriptRunConfig(source_directory=script_folder,
                      script='dummy_train.py',
                      arguments=[input_data, output],
                      compute_target=compute_target,
                      environment=myenv)

# Submit the run configuration for your training run
run = experiment.submit(src)
run.wait_for_completion(show_output=True)
```

### Simple training script

The following script is submitted through the ScriptRunConfig. It reads the `mnist_ds ` dataset as input, and writes the file to the `outputdataset` folder in the default blob datastore, `def_blob_store`.

```Python
%%writefile $source_directory/dummy_train.py

# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.
import sys
import os

print("*********************************************************")
print("Hello Azure ML!")

mounted_input_path = sys.argv[1]
mounted_output_path = sys.argv[2]

print("Argument 1: %s" % mounted_input_path)
print("Argument 2: %s" % mounted_output_path)
    
with open(mounted_input_path, 'r') as f:
    content = f.read()
    with open(os.path.join(mounted_output_path, 'output.csv'), 'w') as fw:
        fw.write(content)
```

## Mount vs download

Mounting or downloading files of any format are supported for datasets created from Azure Blob storage, Azure Files, Azure Data Lake Storage Gen1, Azure Data Lake Storage Gen2, Azure SQL Database, and Azure Database for PostgreSQL. 

When you **mount** a dataset, you attach the files referenced by the dataset to a directory (mount point) and make it available on the compute target. Mounting is supported for Linux-based computes, including Azure Machine Learning Compute, virtual machines, and HDInsight. 

When you **download** a dataset, all the files referenced by the dataset will be downloaded to the compute target. Downloading is supported for all compute types. 

If your script processes all files referenced by the dataset, and your compute disk can fit your full dataset, downloading is recommended to avoid the overhead of streaming data from storage services. If your data size exceeds the compute disk size,  downloading is not possible. For this scenario, we recommend mounting since only the data files used by your script are loaded at the time of processing.

The following code mounts `dataset` to the temp directory at `mounted_path`

```python
import tempfile
mounted_path = tempfile.mkdtemp()

# mount dataset onto the mounted_path of a Linux-based compute
mount_context = dataset.mount(mounted_path)

mount_context.start()

import os
print(os.listdir(mounted_path))
print (mounted_path)
```

## Get datasets in machine learning scripts

Registered datasets are accessible both locally and remotely on compute clusters like the Azure Machine Learning compute. To access your registered dataset across experiments, use the following code to access your workspace and get the dataset that was used in your previously submitted run. By default, the [`get_by_name()`](/python/api/azureml-core/azureml.core.dataset.dataset#get-by-name-workspace--name--version--latest--) method on the `Dataset` class returns the latest version of the dataset that's registered with the workspace.

```Python
%%writefile $script_folder/train.py

from azureml.core import Dataset, Run

run = Run.get_context()
workspace = run.experiment.workspace

dataset_name = 'titanic_ds'

# Get a dataset by name
titanic_ds = Dataset.get_by_name(workspace=workspace, name=dataset_name)

# Load a TabularDataset into pandas DataFrame
df = titanic_ds.to_pandas_dataframe()
```

## Access source code during training

Azure Blob storage has higher throughput speeds than an Azure file share and will scale to large numbers of jobs started in parallel. For this reason, we recommend configuring your runs to use Blob storage for transferring source code files.

The following code example specifies in the run configuration which blob datastore to use for source code transfers.

```python 
# workspaceblobstore is the default blob storage
src.run_config.source_directory_data_store = "workspaceblobstore" 
```

## Notebook examples

+ For additional dataset examples and concepts, see the [dataset notebooks](https://aka.ms/dataset-tutorial).
+ See how to [parametrize datasets in your ML pipelines](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/intro-to-pipelines/aml-pipelines-showcasing-dataset-and-pipelineparameter.ipynb).

## Troubleshooting

* **Dataset initialization failed:  Waiting for mount point to be ready has timed out**: 
  * If you don't have any outbound [network security group](../virtual-network/network-security-groups-overview.md) rules and are using `azureml-sdk>=1.12.0`, update `azureml-dataset-runtime` and its dependencies to be the latest for the specific minor version, or if you are using it in a run, recreate your environment so it can have the latest patch with the fix. 
  * If you are using `azureml-sdk<1.12.0`, upgrade to the latest version.
  * If you have outbound NSG rules, make sure there is an outbound rule that allows all traffic for the service tag `AzureResourceMonitor`.

### Overloaded AzureFile storage

If you receive an error `Unable to upload project files to working directory in AzureFile because the storage is overloaded`, apply following workarounds.

If you are using file share for other workloads, such as data transfer, the recommendation is to use blobs so that file share is free to be used for submitting runs. You may also split the workload between two different workspaces.

### Passing data as input

*  **TypeError: FileNotFound: No such file or directory**: This error occurs if the file path you provide isn't where the file is located. You need to make sure the way you refer to the file is consistent with where you mounted your dataset on your compute target. To ensure a deterministic state, we recommend using the abstract path when mounting a dataset to a compute target. For example, in the following code we mount the dataset under the root of the filesystem of the compute target, `/tmp`. 
    
    ```python
    # Note the leading / in '/tmp/dataset'
    script_params = {
        '--data-folder': dset.as_named_input('dogscats_train').as_mount('/tmp/dataset'),
    } 
    ```

    If you don't include the leading forward slash, '/',  you'll need to prefix the working directory e.g. `/mnt/batch/.../tmp/dataset` on the compute target to indicate where you want the dataset to be mounted.


## Next steps

* [Auto train machine learning models](how-to-configure-auto-train.md#data-source-and-format) with TabularDatasets.

* [Train image classification models](https://aka.ms/filedataset-samplenotebook) with FileDatasets.

* [Train with datasets using pipelines](./how-to-create-machine-learning-pipelines.md).
