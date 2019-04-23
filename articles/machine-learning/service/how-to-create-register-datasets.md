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
ms.date: 05/06/19

---

# Create and register Azure Machine Learning Datasets

Azure Machine Learning Datasets manage data in various scenarios such as, model training and pipeline creation. With the [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py), you can access underlying storage, explore and prepare data, manage the life cycle of different Dataset definitions, and compare between datasets used in training and in production.

In this article, you learn the Azure Machine Learning workflows to create and register Datasets for data preparation.

## Prerequisites

To create and register Datasets you need:

* An Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

* An Azure Machine Learning service workspace. See [Create an Azure Machine Learning service workspace](https://docs.microsoft.com/azure/machine-learning/service/setup-create-workspace).

* The Azure Machine Learning SDK for Python (version 1.0.21 or later). To install or update to the latest version of the SDK, see [Install or update the SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py).


## Create Datasets from local files

Load files from your local machine by specifying the file or folder path with the `auto_read_files()` method from the `Dataset` class.  This method performs the following steps without requiring you to specify the file type or parsing arguments:

* Inferring and setting the delimiter
* Skipping empty records at the top of the file
* Inferring and setting the header row
* Inferring and converting column data types

```Python
from azureml.core import Dataset

dataset = Dataset.auto_read_files('./data/crime.csv')
```

Alternatively, use the file-specific functions to explicitly control the parsing of your file. Currently the Datasets SDK supports  delimited, Excel,Parquet, binary, and json file formats.

## Create Datasets from Azure Datastores

To create Datasets from an Azure Datastore, be sure to:

* Verify you have contributor or owner access to the registered Azure Datastore.

* Import the [`Workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py) and [`Datastore`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.datastore(class)?view=azure-ml-py#definition) and `Dataset` packages from the SDK.

```Python
from azureml.core import Workspace, Datastore, Dataset

# change the configuration for workspace and Datastore
subscription_id = 'your subscription id'
resource_group = 'your resource group name'
workspace_name = 'your workspace name'
datastore_name = 'your datastore name'

# get existing workspace
workspace = Workspace(subscription_id, resource_group, workspace_name)
```

 The `get()` method retrieves an existing datastore in the workspace.

```
dstore = Datastore.get(workspace, datastore_name)
```

Use the `from_delimited_files()` method to read in delimited files and create in-memory Datasets.

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

## Register your datasets with workspace

Use the `register()` method to register Datasets to your workspace for sharing and reuse within your organization and across various experiments.

```Python
dataset = dataset.register(workspace = 'workspace_name',
                           name = "dataset_crime",
                           description = 'Training data',
                           exist_ok = False
                           )
```

>[!NOTE]
> The default parameter setting for `register()` is `exist_ok = False`, which results in an error if you try to register a Dataset with the same name.

The `register()` method updates the definition of an already registered Dataset when the parameter setting, `exist_ok = True`.

```Python
dataset = dataset.register(workspace = workspace_name,
                           name = "dataset_crime",
                           description = 'Training data',
                           exist_ok = True)
```

Use `list()` to see all of the registered Datasets in your workspace.

```Python
Dataset.list(workspace_name)
```

The preceding code results in the following:

```Python
[Dataset(Name: dataset_crime,
         Workspace: workspace_name)]
```

## Next Steps

* [Explore and prepare Datasets](how-to-explore-prepare-data.md)
* [Manage the life cycle of Dataset definitions](how-to-manage-dataset-definitions.md)