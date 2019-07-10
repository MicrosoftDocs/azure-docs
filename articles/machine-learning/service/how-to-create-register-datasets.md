---
title: Create datasets to access data with azureml-datasets
titleSuffix: Azure Machine Learning service
description: Learn how to create Datasets from various sources and register Datasets with your workspace
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual	
ms.author: sihhu
author: MayMSFT
manager: cgronlun
ms.reviewer: nibaccam
ms.date: 05/21/2019

---

# Create and access datasets (Preview) in Azure Machine Learning

In this article, you'll learn how to create Azure Machine Learning datasets (preview) and how to access the data from local and remote experiments.

With managed datasets, you can: 
* **Easily access data during model training** without reconnecting to underlying stores

* **Ensure data consistency & reproducibility** using the same pointer across experiments: notebooks, automated ml, pipelines, visual interface

* **Share data & collaborate** with other users

* **Explore data** & manage lifecycle of data snapshots & versions

* **Compare data** in training to production


## Prerequisites

To create and work with datasets, you need:

* An Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

* An [Azure Machine Learning service workspace](https://docs.microsoft.com/azure/machine-learning/service/setup-create-workspace)

* The [Azure Machine Learning SDK for Python installed](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py), which includes the azureml-datasets package.

> [!Note]
> Some Dataset classes (preview) have dependencies on the [azureml-dataprep](https://docs.microsoft.com/python/api/azureml-dataprep/?view=azure-ml-py) package (GA). For Linux users, these classes are supported only on the following distributions:  Red Hat Enterprise Linux, Ubuntu, Fedora, and CentOS.

## Data formats

You can create an Azure Machine Learning Dataset from the following data:
+ [delimited](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset#from-delimited-files-path--separator------header--promoteheadersbehavior-all-files-have-same-headers--3---encoding--fileencoding-utf8--0---quoting-false--infer-column-types-true--skip-rows-0--skip-mode--skiplinesbehavior-no-rows--0---comment-none--include-path-false--archive-options-none-)
+ [binary](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-binary-files-path-)
+ [json](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-json-files-path--encoding--fileencoding-utf8--0---flatten-nested-arrays-false--include-path-false-)
+ [Excel](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-excel-files-path--sheet-name-none--use-column-headers-false--skip-rows-0--include-path-false--infer-column-types-true-)
+ [Parquet](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-parquet-files-path--include-path-false-)
+ [Azure SQL Database](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-sql-query-data-source--query-)
+ [Azure Data Lake gen. 1](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-sql-query-data-source--query-)

## Create datasets 

You can interact with your datasets with the azureml-datasets package in the [Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py) and specifically [the `Dataset` class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset(class)?view=azure-ml-py).

### Create from local files

Load files from your local machine by specifying the file or folder path with the [`auto_read_files()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset(class)?view=azure-ml-py#auto-read-files-path--include-path-false-) method from the `Dataset` class.  This method performs the following steps without requiring you to specify the file type or parsing arguments:

* Inferring and setting the delimiter.
* Skipping empty records at the top of the file.
* Inferring and setting the header row.
* Inferring and converting column data types.

```Python
from azureml.core.dataset import Dataset

dataset = Dataset.auto_read_files('./data/crime.csv')
```

Alternatively, use the file-specific functions to explicitly control the parsing of your file. 


### Create from Azure Datastores

To create Datasets from an Azure Datastore:

* Verify you have `contributor` or `owner` access to the registered Azure Datastore.

* Import the [`Workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py) and [`Datastore`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.datastore(class)?view=azure-ml-py#definition) and `Dataset` packages from the SDK.

```Python
from azureml.core.workspace import Workspace
from azureml.core.datastore import Datastore
from azureml.core.dataset import Dataset

datastore_name = 'your datastore name'

# get existing workspace
workspace = Workspace.from_config()
```

 The `get()` method retrieves an existing datastore in the workspace.

```
dstore = Datastore.get(workspace, datastore_name)
```

Use the `from_delimited_files()` method to read in delimited files, and create an unregistered Dataset.

```Python
# create an in-memory Dataset on your local machine
datapath = dstore.path('data/src/crime.csv')
dataset = Dataset.from_delimited_files(datapath)

# returns the first 5 rows of the Dataset as a pandas Dataframe.
dataset.head(5)
```

## Register datasets

To complete the creation process, register your datasets with workspace:

Use the [`register()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#register-workspace--name--description-none--tags-none--visible-true--exist-ok-false--update-if-exist-false-) method to register Datasets to your workspace so they can be shared with others and reused across various experiments.

```Python
dataset = dataset.register(workspace = workspace,
                           name = 'dataset_crime',
                           description = 'Training data',
                           exist_ok = False
                           )
```

>[!NOTE]
> If `exist_ok = False` (default), and you attempt to register a dataset with the same name as another, an error occurs. Set to `True` to overwrite existing.

## Access data in datasets

Registered datasets are accessible and consumable locally, remotely and on compute clusters like the Azure Machine Learning compute. To reuse your registered Dataset across experiments and compute environments, use the following code to get your workspace and registered dataset by name.

```Python
workspace = Workspace.from_config()

# See list of datasets registered in workspace.
Dataset.list(workspace)

# Get dataset by name
dataset = workspace.datasets['dataset_crime']
```

## Next steps

* [Explore and prepare Datasets](how-to-explore-prepare-data.md).
* For an example of using Datasets, see the [sample notebooks](https://aka.ms/dataset-tutorial).
