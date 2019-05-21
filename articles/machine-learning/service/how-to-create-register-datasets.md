---
title: Create and register Datasets with your workspace
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
ms.date: 05/20/2019

---

# Create and register datasets (Preview) in Azure Machine Learning

In this article, you'll learn how to create Azure Machine Learning datasets (preview) and how to access them across your local and remote experiments. These managed datasets make it easier to access and work with your data during:
+ Model training
+ Pipeline configuration and runs

With datasets, you can:
+ Work with data in various formats uniformly with simplified access to underlying data storage
+ Explore and prep data
+ Manage data lifecycles
+ Version your data
+ Compare training data to production data

You can interact with your datasets with the [Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).

## Prerequisites

To create and register Datasets you need:

* An Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

* An Azure Machine Learning service workspace. See [Create an Azure Machine Learning service workspace](https://docs.microsoft.com/azure/machine-learning/service/setup-create-workspace).

* The Azure Machine Learning SDK for Python. To install or update to the latest version of the SDK, see [Install or update the SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py).

> [!Note]
> Some Dataset classes (preview) have dependencies on the [azureml-dataprep](https://docs.microsoft.com/python/api/azureml-dataprep/?view=azure-ml-py) package (GA). For Linux users, these classes are supported only on the following distributions:  Red Hat Enterprise Linux, Ubuntu, Fedora, and CentOS.

## Supported data formats

You can extract data from the following formats to create a dataset:
+ [delimited](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-delimited-files-path--separator------header--promoteheadersbehavior-allfileshavesameheaders--3---encoding--fileencoding-utf8--0---quoting-false--infer-column-types-true--skip-rows-0--skip-mode--skiplinesbehavior-norows--0---comment-none--include-path-false--archive-options-none-)
+ [binary](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-binary-files-path-)
+ [json](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-json-files-path--encoding--fileencoding-utf8--0---flatten-nested-arrays-false--include-path-false-) file formats.
+ [Excel](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-excel-files-path--sheet-name-none--use-column-headers-false--skip-rows-0--include-path-false--infer-column-types-true-)
+ [Parquet](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-parquet-files-path--include-path-false-)
+ [Azure SQL Database](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-sql-query-data-source--query-)
+ [Azure Data Lake gen. 1](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#from-sql-query-data-source--query-)

## Create datasets 

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

||ID|Case Number|Date|Block|IUCR|Primary Type|Description|Location Description|Arrest|Domestic|...|Ward|Community Area|FBI Code|X Coordinate|Y Coordinate|Year|Updated On|Latitude|Longitude|Location|
|--|--|---|---|---|---|----|------|-------|------|-----|---|----|----|-----|-----|------|----|-----|----|----|-----
|0|10498554|HZ239907|4/4/2016 23:56|007XX E 111TH ST|1153|DECEPTIVE PRACTICE|FINANCIAL IDENTITY THEFT OVER $ 300|OTHER|FALSE|FALSE|...|9|50|11|1183356|1831503|2016|5/11/2016 15:48|41.69283384|-87.60431945|(41.692833841, -87.60431945)|
1|10516598|HZ258664|4/15/2016 17:00|082XX S MARSHFIELD AVE|890|THEFT| FROM BUILDING|RESIDENCE|FALSE|FALSE|...|21|71|6|1166776|1850053|2016|5/12/2016 15:48|41.74410697|-87.66449429|(41.744106973, -87.664494285)
2|10519196|HZ261252|4/15/2016 10:00|104XX S SACRAMENTO AVE|1154|DECEPTIVE PRACTICE|FINANCIAL IDENTITY THEFT $300 AND UNDER|RESIDENCE|FALSE|FALSE|...|19|74|11|||2016|5/12/2016 15:50
3|10519591|HZ261534|4/15/2016 9:00|113XX S PRAIRIE AVE|1120|DECEPTIVE PRACTICE|FORGERY|RESIDENCE|FALSE|FALSE|...|9|49|10|||2016|5/13/2016 15:51
4|10534446|HZ277630|4/15/2016 10:00|055XX N KEDZIE AVE|890|THEFT|FROM BUILDING|SCHOOL, PUBLIC, BUILDING|FALSE|FALSE|...|40|13|6|||2016|5/25/2016 15:59|

## Register datasets in workspace

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
* [Manage the lifecycle of Dataset definitions](how-to-manage-dataset-definitions.md).
* For an example of using Datasets, see the [sample notebooks](https://aka.ms/dataset-tutorial).