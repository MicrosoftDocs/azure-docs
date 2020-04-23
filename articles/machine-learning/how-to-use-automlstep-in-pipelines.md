---
title: Use automated ML in ML pipelines 
titleSuffix: Azure Machine Learning
description: The AutoMLStep allows you to use automated machine learning in your pipelines.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: laobri
author: lobrien
manager: cgronlun
ms.date: 04/23/2020

---

# Create an Azure Machine Learning pipeline in Python using datasets and automated ML
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-enterprise-sku.md)]

Azure Machine Learning's automated ML capability helps you discover high-performing models without you reimplementing every possible approach. Combined with Azure Machine Learning pipelines, you can create deployable workflows that can quickly discover the algorithm that works best for your data. This article will show you how to efficiently join a data preparation step to an automated ML step.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

* An Azure Machine Learning workspace with a type of **Enterprise edition**. See [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).  To upgrade an existing workspace to Enterprise edition, see [Upgrade to Enterprise edition](how-to-manage-workspace.md#upgrade).

* Basic familiarity with Azure's [automated machine learning](concept-automated-ml.md) and [machine learning pipelines](concept-ml-pipelines.md) facilities and SDK.

## Review the central classes

Automated ML in a pipeline is represented by an `AutoMLStep` object. The `AutoMLStep` class is a subclass of `PipelineStep`. Pipelines comprise a sequence of `PipelineStep` objects. 

The preferred way to initially move data _into_ an ML pipeline is with `Dataset` objects. To move data _between_ steps, the preferred way is with `PipelineData` objects. For more information, see [Input and output data from ML pipelines](how-to-move-data-in-out-of-pipelines.md). 

For this article, we'll show a `PythonScriptStep` data preparation step and an `AutoMLStep` training step. The task will be predicting survival for Titanic passengers.  

The `AutoMLStep` is configured via an `AutoMLConfig` object, as discussed in [Configure automated ML experiments in Python](https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train#configure-your-experiment-settings).

As you can see in the [`AutoMLConfig` reference](https://docs.microsoft.com/python/api/azureml-train-automl-client/azureml.train.automl.automlconfig.automlconfig?view=azure-ml-py), the `AutoMLConfig` class is highly flexible. This article will restrict its discussion to the arguments relating to training and validation data. Even more, this articles focuses on the recommended high-throughput technique, which uses `PipelineOutputTabularDataset` objects as the data inputs to the automated ML step.

## Get started

### Retrieve initial dataset
Often, an ML workflow starts with pre-existing baseline data. This is a good scenario for a registered dataset. Datasets are visible across the workspace, support versioning, and can be interactively explored. There are many ways to create and populate a dataset, as discussed in [Create Azure Machine Learning datasets](how-to-create-register-datasets.md). Since we will be using the Python SDK to create our pipeline, use the SDK to download baseline data and register it with the name 'titanic_ds'.

```python
from azureml.core import Workspace, Dataset

ws = Workspace.from_config()
if not 'titanic_ds' in ws.datasets.keys() :
    # create a TabularDataset from Titanic training data
    web_paths = ['https://dprepdata.blob.core.windows.net/demo/Titanic.csv',
                 'https://dprepdata.blob.core.windows.net/demo/Titanic2.csv']
    titanic_ds = Dataset.Tabular.from_delimited_files(path=web_paths)

    titanic_ds.register(workspace = ws,
                                     name = 'titanic_ds',
                                     description = 'Titanic baseline data',
                                     create_new_version = True)

titanic_ds = Dataset.get_by_name(ws, 'titanic_ds')
```

The code first logs in to the Azure Machine Learning workspace defined in **config.json**  (for an explanation, see [Tutorial: Get started creating your first ML experiment with the Python SDK](tutorial-1st-experiment-sdk-setup.md)). If there is not already a dataset named `'titanic_ds'` registered, the creates one. The code downloads CSV data from the Web, uses them to instantiate a `TabularDataset` and then registers the dataset with the workspace. Whether the dataset has just been registered or already existed, the function `Dataset.get_by_name()` assigns the `Dataset` to `titanic_ds`. 

### Configure storage and training compute

Additional resources that the pipeline will need are storage and, generally, Azure Machine Learning compute resources. 

```python
from azureml.core import Datastore, AmlCompute, ComputeTarget

datastore = ws.get_default_datastore()

compute_name = 'cpu-compute'
if not compute_name in ws.compute_targets :
    print('creating a new compute target...')
    provisioning_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2',
                                                                min_nodes=0,
                                                                max_nodes=1)
    compute_target = ComputeTarget.create(ws, compute_name, provisioning_config)

    compute_target.wait_for_completion(
        show_output=True, min_node_count=None, timeout_in_minutes=20)

    # Show the result
    print(compute_target.get_status().serialize())

compute_target = ws.compute_targets[compute_name]
```

The intermediate data between the data preparation and the automated ML step can be stored in the workspace's default datastore, so we don't need to do more than call `get_default_datastore()` on the `Workspace` object. 

After that, the code checks if the AML compute target `'cpu-compute'` already exists. If not, we specify that we want a small CPU-based compute target. The code blocks until the target is provisioned and then prints some details of the just-created compute target. Finally, the named compute target is retrieved from the workspace and assigned to `compute_target`. 

### Configure the training run

The next step is making sure that the remote training run has all the dependencies that are required by the training steps. This is done by creating and configuring a `RunConfiguration` object. 

```python
from azureml.core.runconfig import RunConfiguration

aml_run_config = RunConfiguration()
# Use just-specified compute target ("cpu-compute")
aml_run_config.target = compute_target
aml_run_config.environment.python.user_managed_dependencies = False

# Add some packages relied on by data prep step
aml_run_config.environment.python.conda_dependencies = CondaDependencies.create(
    conda_packages=['pandas','scikit-learn'], 
    pip_packages=['azureml-sdk', 'azureml-dataprep[fuse,pandas]'], 
    pin_sdk_version=False)
```

## Build your data preparation step

The baseline Titanic dataset consists of mixed numerical and text data, with some values missing. To prepare it for automated machine learning, the data preparation pipeline step will:

- Fill missing data with either random data or a category corresponding to "Unknown"
- Transform categorical data to integers
- Drop columns that we don't intend to use
- Split the data into training and testing sets
- Write the transformed data to the `PipelineData` output paths

```python
# dataprep.py

import pandas as pd 
from azureml.core import Run
import numpy as np 
from sklearn.model_selection import train_test_split
import argparse

def prepare_embarked(df):
    df['Embarked'].replace('', 'U', inplace=True)
    df['Embarked'].fillna('U', inplace=True)
    ports = {"S": 0, "C": 1, "Q": 2, "U": 3}
    df['Embarked'] = df['Embarked'].map(ports)
    return df

# ... Similar prepare_* functions not shown ...

parser = argparse.ArgumentParser()
parser.add_argument('--train_path', dest='train_path', required=True)
parser.add_argument('--test_path', dest='test_path', required=True)
args = parser.parse_args()
    
titanic_ds = Run.get_context().input_datasets['titanic_ds']
df = titanic_ds.to_pandas_dataframe().drop(['PassengerId', 'Name', 'Ticket', 'Cabin'], axis=1)
df = prepare_embarked(prepare_genders(prepare_fare(prepare_age(df))))

train, test = train_test_split(df, test_size = 0.2)

os.makedirs(os.path.dirname(args.train_path), exist_ok=True)
train.to_csv(args.train_path)

os.makedirs(os.path.dirname(args.test_path), exist_ok=True)
test.to_csv(args.test_path)
```

The above code snippet shows how the `Embarked` column is prepared. Empty and not available data is replaced with a `'U'` for "Unknown". Then, the code defines a dictionary that maps a string-based category into an integer. The `map` function applies that transform and replaces the string-based column with an integer-based one. Similar functions to prepare age, fare, and gender data are not shown. tk download notebook link? Or do we not want to take the dependency? tk 

