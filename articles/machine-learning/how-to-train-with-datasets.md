---
title: Train with azureml-datasets
titleSuffix: Azure Machine Learning
description: Learn how to use datasets in training
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sihhu
author: MayMSFT
manager: cgronlun
ms.reviewer: nibaccam
ms.date: 09/25/2019

# Customer intent: As an experienced Python developer, I need to make my data available to my remote compute to train my machine learning models.

---

# Train with datasets in Azure Machine Learning
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn the two ways to consume [Azure Machine Learning datasets](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset%28class%29?view=azure-ml-py) in remote experiment training runs without worrying about connection strings or data paths.

- Option 1: If you have structured data, create a TabularDataset and use it directly in your training script.

- Option 2: If you have unstructured data, create a FileDataset and mount or download files to a remote compute for training.

Azure Machine Learning datasets provide a seamless integration with Azure Machine Learning training products like [ScriptRun](https://docs.microsoft.com/python/api/azureml-core/azureml.core.scriptrun?view=azure-ml-py), [Estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.estimator?view=azure-ml-py) and [HyperDrive](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.hyperdrive?view=azure-ml-py).

## Prerequisites

To create and train with datasets, you need:

* An Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

* An [Azure Machine Learning workspace](how-to-manage-workspace.md).

* The [Azure Machine Learning SDK for Python installed](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py), which includes the azureml-datasets package.

> [!Note]
> Some Dataset classes have dependencies on the [azureml-dataprep](https://docs.microsoft.com/python/api/azureml-dataprep/?view=azure-ml-py) package. For Linux users, these classes are supported only on the following distributions:  Red Hat Enterprise Linux, Ubuntu, Fedora, and CentOS.

## Option 1: Use datasets directly in training scripts

In this example, you create a [TabularDataset](https://docs.microsoft.com/python/api/azureml-core/azureml.data.tabulardataset?view=azure-ml-py) and use it as a direct input to your `estimator` object for training. 

### Create a TabularDataset

The following code creates an unregistered TabularDataset from a web url. You can also create datasets from local files or paths in datastores. Learn more about [how to create datasets](https://aka.ms/azureml/howto/createdatasets).

```Python
from azureml.core.dataset import Dataset

web_path ='https://dprepdata.blob.core.windows.net/demo/Titanic.csv'
titanic_ds = Dataset.Tabular.from_delimited_files(path=web_path)
```

### Access the input dataset in your training script

TabularDataset objects provide the ability to load the data into a pandas or spark DataFrame so that you can work with familiar data preparation and training libraries. To leverage this capability, you can pass a TabularDataset as the input in your training configuration, and then retrieve it in your script.

To do so, access the input dataset through the [`Run`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run.run?view=azure-ml-py) object in your training script and use the [`to_pandas_dataframe()`](https://docs.microsoft.com/python/api/azureml-core/azureml.data.tabulardataset#to-pandas-dataframe-on-error--null---out-of-range-datetime--null--) method. 

```Python
%%writefile $script_folder/train_titanic.py

from azureml.core import Dataset, Run

run = Run.get_context()
# get the input dataset by name
dataset = run.input_datasets['titanic_ds']
# load the TabularDataset to pandas DataFrame
df = dataset.to_pandas_dataframe()
```

### Configure the estimator

An [estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.estimator.estimator?view=azure-ml-py) object is used to submit the experiment run. Azure Machine Learning has pre-configured estimators for common machine learning frameworks, as well as a generic estimator.

This code creates a generic estimator object, `est`, that specifies

* A script directory for your scripts. All the files in this directory are uploaded into the cluster nodes for execution.
* The training script, *train_titanic.py*.
* The input dataset for training, `titanic`.
* The compute target for the experiment.
* The environment definition for the experiment.

```Python
est = Estimator(source_directory=script_folder,
                entry_script='train_titanic.py',
                # pass dataset object as an input with name 'titanic'
                inputs=[titanic_ds.as_named_input('titanic')],
                compute_target=compute_target,
                environment_definition= conda_env)

# Submit the estimator as part of your experiment run
experiment_run = experiment.submit(est)
experiment_run.wait_for_completion(show_output=True)
```

## Option 2:  Mount files to a remote compute target

If you want to make your data files available on the compute target for training, use [FileDataset](https://docs.microsoft.com/python/api/azureml-core/azureml.data.file_dataset.filedataset?view=azure-ml-py) to mount or download files referred by it.

### Mount v.s. Download
When you mount a dataset, you attach the files referenced by the dataset to a directory (mount point) and make it available on the compute target. Mounting is supported for Linux-based computes, including Azure Machine Learning Compute, virtual machines, and HDInsight. If your data size exceeds the compute disk size, or you are only loading part of dataset in your script, mounting is recommended. Because downloading a dataset bigger than the disk size will fail, and mounting will only load the part of data used by your script at the time of processing. 
When you download a dataset, all the files referenced by the dataset will be downloaded to the compute target. Downloading is supported for all compute types. If your script process all files referenced by the dataset, and your compute disk can fit in your full dataset, downloading is recommended to avoid the overhead of streaming data from storage services.


### Create a FileDataset

The following example creates an unregistered FileDataset from web urls. Learn more about [how to create datasets](https://aka.ms/azureml/howto/createdatasets) from other sources.

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

### Configure the estimator

Instead of passing the dataset through the `inputs` parameter in the estimator, you can also pass the dataset through `script_params` and get the data path (mounting point) in your training script via arguments. This way, you can access your data and use an existing training script.

An [SKLearn](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.sklearn.sklearn?view=azure-ml-py) estimator object is used to submit the run for scikit-learn experiments. Learn more about training with the [SKlearn estimator](how-to-train-scikit-learn.md).

```Python
from azureml.train.sklearn import SKLearn

script_params = {
    # mount the dataset on the remote compute and pass the mounted path as an argument to the training script
    '--data-folder': mnist_ds.as_named_input('mnist').as_mount(),
    '--regularization': 0.5
}

est = SKLearn(source_directory=script_folder,
              script_params=script_params,
              compute_target=compute_target,
              environment_definition=env,
              entry_script='train_mnist.py')

# Run the experiment
run = experiment.submit(est)
run.wait_for_completion(show_output=True)
```

### Retrieve the data in your training script

After you submit the run, data files referred by the `mnist` dataset will be mounted to the compute target. The following code shows how to retrieve the data in your script.

```Python
%%writefile $script_folder/train_mnist.py

import argparse
import os
import numpy as np
import glob

from utils import load_data

# retrieve the 2 arguments configured through script_params in estimator
parser = argparse.ArgumentParser()
parser.add_argument('--data-folder', type=str, dest='data_folder', help='data folder mounting point')
parser.add_argument('--regularization', type=float, dest='reg', default=0.01, help='regularization rate')
args = parser.parse_args()

data_folder = args.data_folder
print('Data folder:', data_folder)

# get the file paths on the compute
X_train_path = glob.glob(os.path.join(data_folder, '**/train-images-idx3-ubyte.gz'), recursive=True)[0]
X_test_path = glob.glob(os.path.join(data_folder, '**/t10k-images-idx3-ubyte.gz'), recursive=True)[0]
y_train_path = glob.glob(os.path.join(data_folder, '**/train-labels-idx1-ubyte.gz'), recursive=True)[0]
y_test = glob.glob(os.path.join(data_folder, '**/t10k-labels-idx1-ubyte.gz'), recursive=True)[0]

# load train and test set into numpy arrays
X_train = load_data(X_train_path, False) / 255.0
X_test = load_data(X_test_path, False) / 255.0
y_train = load_data(y_train_path, True).reshape(-1)
y_test = load_data(y_test, True).reshape(-1)
```

## Notebook examples

The [dataset notebooks](https://aka.ms/dataset-tutorial) demonstrate and expand upon concepts in this article.

## Next steps

* [Auto train machine learning models](how-to-auto-train-remote.md) with TabularDatasets

* [Train image classification models](https://aka.ms/filedataset-samplenotebook) with FileDatasets

* [Create and manage environments for training and deployment](how-to-use-environments.md)
