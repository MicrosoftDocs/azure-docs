---
title: Compare & reproduce data with dataset snapshots
titleSuffix: Azure Machine Learning service
description: Learn how to compare data over time and ensure reproducibility with dataset snapshots
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sihhu
author: MayMSFT
ms.date: 05/23/2019
---

# Compare data and ensure reproducibility with snapshots (preview)

In this article, you learn to how to create and manage snapshots of your [Azure Machine Learning Datasets](how-to-create-register-datasets.md) (datasets) so you can capture or compare data over time. Datasets make it easier to access and work with your data in the cloud in various scenarios.

**Dataset snapshots** store a profile (summary statistics) of the data at the time it's created. You can choose to also store a copy of the data in your snapshot for reproducibility.

>[!Important]
> Snapshots incur storage costs. Storing a copy of data in your snapshot requires even more storage. Use [`dataset.delete_snapshot()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#delete-snapshot-snapshot-name-) when they are no longer needed.

## When to use snapshots

There are three main uses for snapshots:

+ **Model validation**: Compare the data profile of different snapshots between training runs or against production data.

+ **Model reproducibility**: Reproduce your results by calling a snapshot that includes data during training.

+ **Track data over time**: See how the dataset has evolved by [comparing profiles](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_snapshot.datasetsnapshot?view=azure-ml-py#compare-profiles-rhs-dataset-snapshot--include-columns-none--exclude-columns-none--histogram-compare-method--histogramcomparemethod-wasserstein--0--)
  
## Prerequisites

To create dataset snapshots, you need a registered Azure Machine Learning Dataset. If you do not have one, see [Create and register datasets](how-to-create-register-datasets.md).

## Create dataset snapshots

To create a snapshot of a dataset, use [`dataset.create_snapshot()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset(class)?#create-snapshot-snapshot-name--compute-target-none--create-data-snapshot-false--target-datastore-none-) from the azureml-datasets package of the Azure Machine Learning SDK.

By default, the snapshot stores the profile (summary statistics) of the data with the latest [dataset definition](how-to-manage-dataset-definitions.md) applied. A dataset definition contains a record of any transformation steps defined for the data. It is a great way to make your data prep work reproducible.

Optionally, you can also include a copy of the data in your snapshot by adding `create_data_snapshot = True`.  This data can be useful for reproducibility.

This example uses [sample crime data](https://dprepdata.blob.core.windows.net/dataset-sample-files/crime.csv) and a dataset called `dataset_crime` created using the article, ["Create and register datasets"](how-to-create-register-datasets.md).

```Python
from azureml.core.workspace import Workspace
from azureml.core.dataset import Dataset
from azureml.data.dataset_snapshot import DatasetSnapshot
import datetime

# get existing workspace
workspace = Workspace.from_config()

# get existing, named dataset:
dataset = workspace.datasets['dataset_crime']

# assign name to snapshot
snapshot_name = 'snapshot_' + datetime.datetime.today().strftime('%Y%m%d%H%M%S')

# create snapshot to store profile from a remote environment
# and include copy of data
snapshot = dataset.create_snapshot(snapshot_name = snapshot_name,
                                   compute_target = remote_compute_target,
                                   create_data_snapshot = True)
```

Because snapshots are created asynchronously, use the
[`wait_for_completion()`](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_snapshot.datasetsnapshot?view=azure-ml-py#wait-for-completion-show-output-true--status-update-frequency-10-) method to monitor the process.

```Python
# monitor process every 10 seconds
snapshot.wait_for_completion(show_output=True, status_update_frequency=10)

# return snapshot just created
dataset.get_snapshot(snapshot_name)
```

Output:

```
Action status: Running
Action status: Running
Action status: Completed


DatasetSnapshot(Name: snapshot_20190411165420,
Dataset Id: 66cd0830-2f72-41e5-b677-d2d953f54821,
Workspace: "your_workspace_name",
Dataset definition version: 1,
Snapshot created date: 2019-05-11 17:24:00+00:00)
```

Use [`dataset.delete_snapshot()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#delete-snapshot-snapshot-name-) when they are no longer needed.

## Find snapshots

To retrieve an existing snapshot, use [`get_snapshot()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset(class)?view=azure-ml-py#get-snapshot-snapshot-name-).

To get a list of your saved snapshots of a given dataset, use [`get_all_snapshots()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset(class)?view=azure-ml-py#get-all-snapshots--).

```Python
# Get named snapshot for this dataset
dataset.get_snapshot(snapshot_name)

# Get all snapshots for this dataset
dataset.get_all_snapshots()
```

## Get data and profiles from snapshots

Every snapshot generates a profile of the dataset, which includes summary statistics, and gives you the option to save a copy of your data.

### Get the data profile

Use [`get_profile()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset(class)?view=azure-ml-py#get-profile-arguments-none--generate-if-not-exist-true--workspace-none--compute-target-none-) to access the profile of your data.  You can use this profile to compare training and production data, for example.

```Python
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

### Get the data from the snapshot

To get a copy of the data saved in a dataset snapshot, generate a pandas DataFrame with the [`to_pandas_dataframe()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#to-pandas-dataframe--) method.

This method fails if a copy of the data was not requested during snapshot creation.

```Python
snapshot.to_pandas_dataframe().head(3)
```

||ID|Case Number|Date|Block|IUCR|Primary Type|Description|Location Description|Arrest|Domestic|...|Ward|Community Area|FBI Code|X Coordinate|Y Coordinate|Year|Updated On|Latitude|Longitude|Location
-|--|-----------|----|-----|----|------------|-----------|--------------------|------|--------|---|----|--------------|--------|------------|------------|----|----------|--------|---------|--------
0|10498554|HZ239907|2016-04-04 23:56:00|007XX E 111TH ST|1153|DECEPTIVE PRACTICE|FINANCIAL IDENTITY THEFT OVER $ 300|OTHER|False|False|...|9|50|11|1183356.0|1831503.0|2016|2016-05-11 15:48:00|41.692834|-87.604319|(41.692833841, -87.60431945)
1|10516598|HZ258664|2016-04-15 17:00:00|082XX S MARSHFIELD AVE|890|THEFT|FROM BUILDING|RESIDENCE|False|False|...|21|71|6|1166776.0|1850053.0|2016|2016-05-12 15:48:00|41.744107|-87.664494|(41.744106973, -87.664494285)
2|10519196|HZ261252|2016-04-15 10:00:00|104XX S SACRAMENTO AVE|1154|DECEPTIVE PRACTICE|FINANCIAL IDENTITY THEFT $300 AND UNDER|RESIDENCE|False|False|...|19|74|11|NaN|NaN|2016|2016-05-12 15:50:00|NaN|NaN|

## Next steps

* See the SDK [overview](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py) for design patterns and usage examples.

* For an example of using Dataset snapshots, see the [sample notebooks](https://aka.ms/dataset-tutorial).
