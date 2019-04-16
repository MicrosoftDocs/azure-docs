---
title: Create Dataset snapshots
titleSuffix: Azure Machine Learning service
description: Learn how to create Dataset snapshots
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sihhu
author: MayMSFT
manager: cgronlun
ms.reviewer: nibaccam
ms.date: 04/11/19
---

# Create Dataset snapshots

A Dataset snapshot saves the profile and an optional copy of your data at the moment the snapshot was created. This is useful when your underlying data is continuously changing. 

For example, new transaction records are being added to your sales data every day, and you have a Dataset referencing to that sales data. You can use the snapshots for the following scenarios:

1.	If you want to ensure the result of your machine learning models are reproducible. You can save a copy of the data in the snapshot before training, so that you will have access to the same data rather than dealing with changing data in modeling. 
2.	Compare the difference between the Dataset used in training and in production by taking a snapshot of your Dataset before model training and in production. This is to ensure the validity of your machine learning models in production.
3.	To keep track of how your Dataset has been evolving over time by taking snapshots regularly.

In this article, you will learn how to take a snapshot, how to access the data profile and optional data copy saved in the snapshot, and how to delete it. 

## Prerequisites

You need to have an Azure subscription and a workspace to register your Dataset in order to manage the lifecycle of Dataset definitions.

Sample files used in the following examples can be downloaded from [here](https://dprepdata.blob.core.windows.net/dataset-sample-files/crime.csv).

## How to create snapshots

We will first create and register a Dataset with your workspace.

```python
from azureml.core import Workspace, Datastore, Dataset

# change the configuration for workspace and Datastore
subscription_id = 'your subscription id'
resource_group = 'your resource group name'
workspace_name = 'your workspace name'
compute_target_name = 'your compute name'
datastore_name = 'your datastore name'

# get existing workspace
workspace = Workspace(subscription_id, resource_group, workspace_name)

# get compute target that has already been attached to the workspace
remote_compute_target = workspace.compute_targets[compute_target_name]

# get a Datastore that has already been created in the workspace
dstore = Datastore.get(workspace, datastore_name)

# create an in-memory Dataset from Datastore
datapath = dstore.path('data/src/crime.csv')
dataset = Dataset.from_delimited_files(datapath)

# register the Dataset with the workspace. if a Dataset with the same name already exists, retrieve it by turning `exist_ok = True`
dataset_name = 'crime dataset'
dataset = dataset.register(workspace = workspace, 
                 name = dataset_name, 
                 description = 'crime dataset for demo', 
                 tags = {'year':'2019', 'month':'Apr'},
                 exist_ok = True)
```

Snapshots are always created based on the latest definition of your Datasets. By default, `create_snapshot` will generate a data profile and will NOT create a data copy to save potential storage cost. By turning `create_data_snapshot = True`, your data copy will be saved into the default datastore of your workspace.

```python
import datetime

snapshot_name = 'snapshot_' + datetime.datetime.today().strftime('%Y%m%d%H%M%S')

# asynchronous method
# if a snapshot with the same name already exists, it will return the existing one. 
snapshot = dataset.create_snapshot(snapshot_name=snapshot_name, compute_target=remote_compute_target, create_data_snapshot=True)

# check the snapshot created
dataset.get_snapshot(snapshot_name)
```




    DatasetSnapshot(Name: snapshot_20190411165420,
    Dataset Id: 66cd0830-2f72-41e5-b677-d2d953f54821,
    Workspace: your_workspace_name,
    Dataset definition version: 1,
    Snapshot created date: 2019-04-11 17:24:00+00:00)

## How to access the data profile and optional data copy in a snapshot

`create_snapshot()` method runs asynchronously to unblock you for other tasks. Therefore, before accessing a snapshot, you should make sure that the snapshot is generated completely. If you try to access a snapshot before generation completed, you will get an error.

```python
from azureml.core.dataset import DatasetSnapshot

# get an existing Dataset snapshot
snapshot = dataset.get_snapshot(snapshot_name=snapshot_name)

# make sure the snapshot generation is completed.
snapshot.wait_for_completion(show_output=True, status_update_frequency=10)
```

    Action status: Running
    Action status: Running
    Action status: Completed

Every snapshot includes a Data profile, which is the statistics summary of your Dataset, and an optional copy of your data. You can use the data profiles saved in snapshots for comparison between training and production data. If you saved a copy of data in the snapshot, you can access it by converting it to pandas DataFrame.

```python
snapshot.get_profile()
```

||Type|Min|Max|Count|Missing Count|Not Missing Count|Percent missing|Error Count|Empty count|0.1% Quantile|1% Quantile|5% Quantile|25% Quantile|50% Quantile|75% Quantile|95% Quantile|99% Quantile|99.9% Quantile|Mean|Standard Deviation|Variance|Skewness|Kurtosis
-|----|---|---|-----|-------------|-----------------|---------------|-----------|-----------|-------------|-----------|-----------|------------|------------|------------|------------|------------|--------------|----|------------------|--------|--------|--------
ID|FieldType.INTEGER|1.04986e+07|1.05351e+07|10.0|0.0|10.0|0.0|0.0|0.0|1.04986e+07|1.04992e+07|1.04986e+07|1.05166e+07|1.05209e+07|1.05259e+07|1.05351e+07|1.05351e+07|1.05351e+07|1.05195e+07|12302.7|1.51358e+08|-0.495701|-1.02814
Case Number|FieldType.STRING|HZ239907|HZ278872|10.0|0.0|10.0|0.0|0.0|0.0||||||||||||||
Date|FieldType.DATE|2016-04-04 23:56:00+00:00|2016-04-15 17:00:00+00:00|10.0|0.0|10.0|0.0|0.0|0.0||||||||||||||
Block|FieldType.STRING|004XX S KILBOURN AVE|113XX S PRAIRIE AVE|10.0|0.0|10.0|0.0|0.0|0.0||||||||||||||
IUCR|FieldType.INTEGER|810|1154|10.0|0.0|10.0|0.0|0.0|0.0|810|850|810|890|1136|1153|1154|1154|1154|1058.5|137.285|18847.2|-0.785501|-1.3543
Primary Type|FieldType.STRING|DECEPTIVE PRACTICE|THEFT|10.0|0.0|10.0|0.0|0.0|0.0||||||||||||||
Description|FieldType.STRING|BOGUS CHECK|OVER $500|10.0|0.0|10.0|0.0|0.0|0.0||||||||||||||
Location Description|FieldType.STRING||SCHOOL, PUBLIC, BUILDING|10.0|0.0|10.0|0.0|0.0|1.0||||||||||||||
Arrest|FieldType.BOOLEAN|False|False|10.0|0.0|10.0|0.0|0.0|0.0||||||||||||||
Domestic|FieldType.BOOLEAN|False|False|10.0|0.0|10.0|0.0|0.0|0.0||||||||||||||
Beat|FieldType.INTEGER|531|2433|10.0|0.0|10.0|0.0|0.0|0.0|531|531|531|614|1318.5|1911|2433|2433|2433|1371.1|692.094|478994|0.105418|-1.60684
District|FieldType.INTEGER|5|24|10.0|0.0|10.0|0.0|0.0|0.0|5|5|5|6|13|19|24|24|24|13.5|6.94822|48.2778|0.0930109|-1.62325
Ward|FieldType.INTEGER|1|48|10.0|0.0|10.0|0.0|0.0|0.0|1|5|1|9|22.5|40|48|48|48|24.5|16.2635|264.5|0.173723|-1.51271
Community Area|FieldType.INTEGER|4|77|10.0|0.0|10.0|0.0|0.0|0.0|4|8.5|4|24|37.5|71|77|77|77|41.2|26.6366|709.511|0.112157|-1.73379
FBI Code|FieldType.INTEGER|6|11|10.0|0.0|10.0|0.0|0.0|0.0|6|6|6|6|11|11|11|11|11|9.4|2.36643|5.6|-0.702685|-1.59582
X Coordinate|FieldType.INTEGER|1.16309e+06|1.18336e+06|10.0|7.0|3.0|0.7|0.0|0.0|1.16309e+06|1.16309e+06|1.16309e+06|1.16401e+06|1.16678e+06|1.17921e+06|1.18336e+06|1.18336e+06|1.18336e+06|1.17108e+06|10793.5|1.165e+08|0.335126|-2.33333
Y Coordinate|FieldType.INTEGER|1.8315e+06|1.908e+06|10.0|7.0|3.0|0.7|0.0|0.0|1.8315e+06|1.8315e+06|1.8315e+06|1.83614e+06|1.85005e+06|1.89352e+06|1.908e+06|1.908e+06|1.908e+06|1.86319e+06|39905.2|1.59243e+09|0.293465|-2.33333
Year|FieldType.INTEGER|2016|2016|10.0|0.0|10.0|0.0|0.0|0.0|2016|2016|2016|2016|2016|2016|2016|2016|2016|2016|0|0|NaN|NaN
Updated On|FieldType.DATE|2016-05-11 15:48:00+00:00|2016-05-27 15:45:00+00:00|10.0|0.0|10.0|0.0|0.0|0.0||||||||||||||
Latitude|FieldType.DECIMAL|41.6928|41.9032|10.0|7.0|3.0|0.7|0.0|0.0|41.6928|41.6928|41.6928|41.7057|41.7441|41.8634|41.9032|41.9032|41.9032|41.78|0.109695|0.012033|0.292478|-2.33333
Longitude|FieldType.DECIMAL|-87.6764|-87.6043|10.0|7.0|3.0|0.7|0.0|0.0|-87.6764|-87.6764|-87.6764|-87.6734|-87.6645|-87.6194|-87.6043|-87.6043|-87.6043|-87.6484|0.0386264|0.001492|0.344429|-2.33333
Location|FieldType.STRING||(41.903206037, -87.676361925)|10.0|0.0|10.0|0.0|0.0|7.0||||||||||||||

```python
# this method will fail if you did not save a data copy while creating the snapshot
snapshot.to_pandas_dataframe().head()
```

||ID|Case Number|Date|Block|IUCR|Primary Type|Description|Location Description|Arrest|Domestic|...|Ward|Community Area|FBI Code|X Coordinate|Y Coordinate|Year|Updated On|Latitude|Longitude|Location
-|--|-----------|----|-----|----|------------|-----------|--------------------|------|--------|---|----|--------------|--------|------------|------------|----|----------|--------|---------|--------
0|10498554|HZ239907|2016-04-04 23:56:00|007XX E 111TH ST|1153|DECEPTIVE PRACTICE|FINANCIAL IDENTITY THEFT OVER $ 300|OTHER|False|False|...|9|50|11|1183356.0|1831503.0|2016|2016-05-11 15:48:00|41.692834|-87.604319|(41.692833841, -87.60431945)
1|10516598|HZ258664|2016-04-15 17:00:00|082XX S MARSHFIELD AVE|890|THEFT|FROM BUILDING|RESIDENCE|False|False|...|21|71|6|1166776.0|1850053.0|2016|2016-05-12 15:48:00|41.744107|-87.664494|(41.744106973, -87.664494285)
2|10519196|HZ261252|2016-04-15 10:00:00|104XX S SACRAMENTO AVE|1154|DECEPTIVE PRACTICE|FINANCIAL IDENTITY THEFT $300 AND UNDER|RESIDENCE|False|False|...|19|74|11|NaN|NaN|2016|2016-05-12 15:50:00|NaN|NaN|
3|10519591|HZ261534|2016-04-15 09:00:00|113XX S PRAIRIE AVE|1120|DECEPTIVE PRACTICE|FORGERY|RESIDENCE|False|False|...|9|49|10|NaN|NaN|2016|2016-05-13 15:51:00|NaN|NaN|
4|10534446|HZ277630|2016-04-15 10:00:00|055XX N KEDZIE AVE|890|THEFT|FROM BUILDING|SCHOOL, PUBLIC, BUILDING|False|False|...|40|13|6|NaN|NaN|2016|2016-05-25 15:59:00|NaN|NaN|

## How to delete snapshots

Saving a data copy in the snapshot will incur storage cost, and you may want to delete the snapshot when it’s no longer in use.

```python
# delete the snapshot by name
dataset.delete_snapshot(snapshot_name)

# double check to ensure the snapshot is successfully deleted
dataset.get_all_snapshots()
```




    []

## Next steps

* See the automated machine learning [tutorial](tutorial-auto-train-models) for a regression model example