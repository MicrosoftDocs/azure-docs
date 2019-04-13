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
ms.date: 04/09/19

---

# Create and register Datasets with your workspace 

In Azure Machine Learning service, Datasets are first-class entities which manage data in various machine learning scenarios such as model training and pipeline creation. With Datasets,  you can access the underlying storage,explore and prepare data, manage the lifecycle of different Dataset definitions, and compare the difference between Datasets used in training and in production.

Datasets can be created from local files, [Azure Datastores](https://docs.microsoft.com/azure/machine-learning/service/how-to-access-data). We support delimited, Excel, Parquet, binary, and json file formats.

## Prerequisites

You do not need Azure subscriptions or workspaces to create Datasets. You can take a sample of your data, create, explore and prepare a Dataset locally, then register the Dataset with Azure workspace for reuse and sharing.

Sample files used in the following examples can be downloaded from [here](https://dprepdata.blob.core.windows.net/dataset-sample-files/crime.csv).

## Create Datasets from local files

It is easy to read files from local by specifying the path to file(s) or folder(s).

`auto_read_files()` attempts to load data automatically without requiring you to specify the file type, encoding and other parsing arguments. The function also automatically performs the following steps commonly performed when loading delimited data:

* Inferring and setting the delimiter
* Skipping empty records at the top of the file
* Inferring and setting the header row
* Inferring and converting column data types

Alternatively, if you know the file type ahead of time and want to explicitly control the way it is parsed, use the file-specific functions.

```python
from azureml.core import Dataset

dataset = Dataset.auto_read_files('./data/crime.csv')
```

## Create Datasets from Azure Datastore

To create Datasets from Azure Datastore, you first need contributor or owner access to a registered Azure Datastore. 

```python
from azureml.core import Workspace, Datastore, Dataset

# change the configuration for workspace and Datastore
subscription_id = 'your subscription id'
resource_group = 'your resource group name'
workspace_name = 'your workspace name'
datastore_name = 'your datastore name'

# get existing workspace
workspace = Workspace(subscription_id, resource_group, workspace_name)

# get a Datastore that has already been created in the workspace
dstore = Datastore.get(workspace, datastore_name)
```

`from_delimited_files()` reads delimited files and creates in-memory Datasets.

```python
# create an in-memory Dataset
datapath = dstore.path('data/src/crime.csv')
dataset = Dataset.from_delimited_files(datapath)

# head() method returns the first N rows of the Dataset as a pandas Dataframe.
dataset.head(5)
```

||ID|Case Number|Date|Block|IUCR|Primary Type|Description|Location Description|Arrest|Domestic|...|Ward|Community Area|FBI Code|X Coordinate|Y Coordinate|Year|Updated On|Latitude|Longitude|Location|
|--|--|---|---|---|---|----|------|-------|------|-----|---|----|----|-----|-----|------|----|-----|----|----|-----
|0|10498554|HZ239907|4/4/2016 23:56|007XX E 111TH ST|1153|DECEPTIVE PRACTICE|FINANCIAL IDENTITY THEFT OVER $ 300|OTHER|FALSE|FALSE|...|9|50|11|1183356|1831503|2016|5/11/2016 15:48|41.69283384|-87.60431945|(41.692833841, -87.60431945)|
1|10516598|HZ258664|4/15/2016 17:00|082XX S MARSHFIELD AVE|890|THEFT| FROM BUILDING|RESIDENCE|FALSE|FALSE|...|21|71|6|1166776|1850053|2016|5/12/2016 15:48	|41.74410697|	-87.66449429|	(41.744106973, -87.664494285)
2|10519196|HZ261252|4/15/2016 10:00|104XX S SACRAMENTO AVE|1154|DECEPTIVE PRACTICE|FINANCIAL IDENTITY THEFT $300 AND UNDER|RESIDENCE|FALSE|FALSE|...|19|	74|	11|||2016	|5/12/2016 15:50
3|10519591|HZ261534|4/15/2016 9:00|113XX S PRAIRIE AVE|1120|DECEPTIVE PRACTICE|FORGERY|RESIDENCE|FALSE|FALSE|...|9|49|10|||2016|5/13/2016 15:51
4|10534446|HZ277630|4/15/2016 10:00|055XX N KEDZIE AVE|890|THEFT|	FROM BUILDING|SCHOOL, PUBLIC, BUILDING|FALSE|FALSE|	...	|40|13|6|||2016|	5/25/2016 15:59|

## Register your datasets with workspace

To share and reuse Datasets within your organization and across various experiments using Azure Machine Learning components, you should always register Datasets with workspace.

By turning `exist_ok = True`, if a Dataset with the same name already exists in the workplace, `register()` method will return the existing Dataset.

```python
dataset = dataset.register(workspace=workspace, name = "dataset_crime", description = 'Training data', exist_ok = True)

Dataset.list(workspace)
```


[Dataset(Name: dataset_crime,Workspace: your_workspace_name)]