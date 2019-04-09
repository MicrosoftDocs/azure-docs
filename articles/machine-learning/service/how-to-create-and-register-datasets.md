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

In Azure Machine Learning service, Datasets are first-class entities which manage data in various machine learning scenarios such as model training and pipeline creation. With Datasets, you can access the underlying storage, explore and prepare data, manage the lifecycle of different Dataset definitions, and compare the difference between Datasets used in training and in production.

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
<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ID</th>
      <th>Case Number</th>
      <th>Date</th>
      <th>Block</th>
      <th>IUCR</th>
      <th>Primary Type</th>
      <th>Description</th>
      <th>Location Description</th>
      <th>Arrest</th>
      <th>Domestic</th>
      <th>...</th>
      <th>Ward</th>
      <th>Community Area</th>
      <th>FBI Code</th>
      <th>X Coordinate</th>
      <th>Y Coordinate</th>
      <th>Year</th>
      <th>Updated On</th>
      <th>Latitude</th>
      <th>Longitude</th>
      <th>Location</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>10498554</td>
      <td>HZ239907</td>
      <td>4/4/2016 23:56</td>
      <td>007XX E 111TH ST</td>
      <td>1153</td>
      <td>DECEPTIVE PRACTICE</td>
      <td>FINANCIAL IDENTITY THEFT OVER $ 300</td>
      <td>OTHER</td>
      <td>FALSE</td>
      <td>FALSE</td>
      <td>...</td>
      <td>9</td>
      <td>50</td>
      <td>11</td>
      <td>1183356</td>
      <td>1831503</td>
      <td>2016</td>
      <td>5/11/2016 15:48</td>
      <td>41.69283384</td>
      <td>-87.60431945</td>
      <td>(41.692833841, -87.60431945)</td>
    </tr>
    <tr>
      <th>1</th>
      <td>10516598</td>
      <td>HZ258664</td>
      <td>4/15/2016 17:00</td>
      <td>082XX S MARSHFIELD AVE</td>
      <td>890</td>
      <td>THEFT</td>
      <td>FROM BUILDING</td>
      <td>RESIDENCE</td>
      <td>FALSE</td>
      <td>FALSE</td>
      <td>...</td>
      <td>21</td>
      <td>71</td>
      <td>6</td>
      <td>1166776</td>
      <td>1850053</td>
      <td>2016</td>
      <td>5/12/2016 15:48</td>
      <td>41.74410697</td>
      <td>-87.66449429</td>
      <td>(41.744106973, -87.664494285)</td>
    </tr>
    <tr>
      <th>2</th>
      <td>10519196</td>
      <td>HZ261252</td>
      <td>4/15/2016 10:00</td>
      <td>104XX S SACRAMENTO AVE</td>
      <td>1154</td>
      <td>DECEPTIVE PRACTICE</td>
      <td>FINANCIAL IDENTITY THEFT $300 AND UNDER</td>
      <td>RESIDENCE</td>
      <td>FALSE</td>
      <td>FALSE</td>
      <td>...</td>
      <td>19</td>
      <td>74</td>
      <td>11</td>
      <td></td>
      <td></td>
      <td>2016</td>
      <td>5/12/2016 15:50</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>3</th>
      <td>10519591</td>
      <td>HZ261534</td>
      <td>4/15/2016 9:00</td>
      <td>113XX S PRAIRIE AVE</td>
      <td>1120</td>
      <td>DECEPTIVE PRACTICE</td>
      <td>FORGERY</td>
      <td>RESIDENCE</td>
      <td>FALSE</td>
      <td>FALSE</td>
      <td>...</td>
      <td>9</td>
      <td>49</td>
      <td>10</td>
      <td></td>
      <td></td>
      <td>2016</td>
      <td>5/13/2016 15:51</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>4</th>
      <td>10534446</td>
      <td>HZ277630</td>
      <td>4/15/2016 10:00</td>
      <td>055XX N KEDZIE AVE</td>
      <td>890</td>
      <td>THEFT</td>
      <td>FROM BUILDING</td>
      <td>SCHOOL, PUBLIC, BUILDING</td>
      <td>FALSE</td>
      <td>FALSE</td>
      <td>...</td>
      <td>40</td>
      <td>13</td>
      <td>6</td>
      <td></td>
      <td></td>
      <td>2016</td>
      <td>5/25/2016 15:59</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>
<p>5 rows × 22 columns</p>
</div>

## Register your datasets with workspace

To share and reuse Datasets within your organization and across various experiments using Azure Machine Learning components, you should always register Datasets with workspace.

By turning `exist_ok = True`, if a Dataset with the same name already exists in the workplace, `register()` method will return the existing Dataset.

```python
dataset = dataset.register(workspace=workspace, name = "dataset_crime", description = 'Training data', exist_ok = True)

Dataset.list(workspace)
```




    [Dataset(Name: dataset_crime,
     Workspace: your_workspace_name)]

## Next steps

* Learn how to [explore and prepare data]
* Manage the lifecycle of [Dataset definitions]
* Learn how to [take snapshot of Datasets]
