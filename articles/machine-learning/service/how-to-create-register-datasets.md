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

In this article, you'll learn how to create Azure Machine Learning datasets (preview), and how to access data from local or remote experiments.

With Azure Machine Learning datasets, you can: 

* **Keep a single copy of data in your storage** referenced by datasets

* **Analyze data** through exploratory data analysis 

* **Easily access data during model training** without worrying about connection string or data path

* **Share data & collaborate** with other users

## Prerequisites

To create and work with datasets, you need:

* An Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

* An [Azure Machine Learning service workspace](how-to-manage-workspace.md)

* The [Azure Machine Learning SDK for Python installed](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py), which includes the azureml-datasets package.

> [!Note]
> Some Dataset classes (preview) have dependencies on the [azureml-dataprep](https://docs.microsoft.com/python/api/azureml-dataprep/?view=azure-ml-py) package (GA). For Linux users, these classes are supported only on the following distributions:  Red Hat Enterprise Linux, Ubuntu, Fedora, and CentOS.

## Data formats

You can create an Azure Machine Learning Dataset from the following formats:
+ [delimited](/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-delimited-files-path--separator------header--promoteheadersbehavior-all-files-have-same-headers--3---encoding--fileencoding-utf8--0---quoting-false--infer-column-types-true--skip-rows-0--skip-mode--skiplinesbehavior-no-rows--0---comment-none--include-path-false--archive-options-none--partition-format-none-)
+ [json](/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-json-files-path--encoding--fileencoding-utf8--0---flatten-nested-arrays-false--include-path-false--partition-format-none-)
+ [Excel](/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-excel-files-path--sheet-name-none--use-column-headers-false--skip-rows-0--include-path-false--infer-column-types-true--partition-format-none-)
+ [Parquet](/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-parquet-files-path--include-path-false--partition-format-none-)
+ [pandas DataFrame](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-pandas-dataframe-dataframe--path-none--in-memory-false-)
+ [SQL query](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-sql-query-data-source--query-)
+ [binary](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-binary-files-path-)

## Create datasets 

By creating a dataset, you create a reference to the data source location, along with a copy of its metadata. The data remains in  its existing location, so no extra storage cost is incurred.

### Create from local files

Load files from your local machine by specifying the file or folder path with the [`auto_read_files()`](/python/api/azureml-core/azureml.core.dataset(class)?view=azure-ml-py#auto-read-files-path--include-path-false--partition-format-none-) method from the `Dataset` class.  This method performs the following steps without requiring you to specify the file type or parsing arguments:

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

To create Datasets from an [Azure datastore](how-to-access-data.md):

* Verify you have `contributor` or `owner` access to the registered Azure datastore.

* Create the dataset by referencing to a path in the datastore 

```Python
from azureml.core.workspace import Workspace
from azureml.core.datastore import Datastore
from azureml.core.dataset import Dataset

datastore_name = 'your datastore name'

# get existing workspace
workspace = Workspace.from_config()

# retrieve an existing datastore in the workspace by name
dstore = Datastore.get(workspace, datastore_name)
```

Use the `from_delimited_files()` method to read delimited files from a [DataReference](https://docs.microsoft.com/python/api/azureml-core/azureml.data.data_reference.datareference?view=azure-ml-py), and create an unregistered Dataset.

```Python
# create an in-memory Dataset on your local machine
dataset = Dataset.from_delimited_files(dstore.path('data/src/crime.csv'))

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

Registered datasets are accessible locally and remotely on compute clusters like the Azure Machine Learning compute. To access your registered Dataset across experiments, use the following code to get your workspace and registered dataset by name.

```Python
workspace = Workspace.from_config()

# See list of datasets registered in workspace.
print(Dataset.list(workspace))

# Get dataset by name
dataset = Dataset.get(workspace, 'dataset_crime')

# Load data into pandas DataFrame
dataset.to_pandas_dataframe()
```

## Next steps

* [Explore and prepare Datasets](how-to-explore-prepare-data.md).
* For an example of using Datasets, see the [sample notebooks](https://aka.ms/dataset-tutorial).
