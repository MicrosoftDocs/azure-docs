---
title: Create Azure Machine Learning datasets to access data
titleSuffix: Azure Machine Learning
description: Learn how to create Azure Machine Learning datasets to access your data for machine learning experiment runs.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: how-to, contperfq1
ms.author: sihhu
author: MayMSFT
manager: cgronlun
ms.reviewer: nibaccam
ms.date: 07/31/2020

# Customer intent: As an experienced data scientist, I need to package my data into a consumable and reusable object to train my machine learning models.

---

# Create Azure Machine Learning datasets

[!INCLUDE [aml-applies-to-basic-enterprise-sku](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to create Azure Machine Learning datasets to access data for your local or remote experiments. To understand where datasets fit in Azure Machine Learning's overall data access workflow, see  the [Securely access data](concept-data.md#data-workflow) article.

By creating a dataset, you create a reference to the data source location, along with a copy of its metadata. Because the data remains in its existing location, you incur no extra storage cost, and don't risk the integrity of your data sources. Also datasets are lazily evaluated, which aids in workflow performance speeds. You can create datasets from datastores, public URLs, and [Azure Open Datasets](../open-datasets/how-to-create-azure-machine-learning-dataset-from-open-dataset.md).

With Azure Machine Learning datasets, you can:

* Keep a single copy of data in your storage, referenced by datasets.

* Seamlessly access data during model training without worrying about connection strings or data paths.[Learn more about how to train with datasets](how-to-train-with-datasets.md).

* Share data and collaborate with other users.

## Prerequisites

To create and work with datasets, you need:

* An Azure subscription. If you don't have one, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).

* An [Azure Machine Learning workspace](how-to-manage-workspace.md).

* The [Azure Machine Learning SDK for Python installed](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py&preserve-view=true), which includes the azureml-datasets package.

    * Create an [Azure Machine Learning compute instance](concept-compute-instance.md#managing-a-compute-instance), which is a fully configured and managed development environment that includes integrated notebooks and the SDK already installed.

    **OR**

    * Work on your own Jupyter notebook and install the SDK yourself with [these instructions](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py&preserve-view=true).

> [!NOTE]
> Some dataset classes have dependencies on the [azureml-dataprep](https://docs.microsoft.com/python/api/azureml-dataprep/?view=azure-ml-py&preserve-view=true) package, which is only compatible with 64-bit Python. For Linux users, these classes are supported only on the following distributions:  Red Hat Enterprise Linux (7, 8), Ubuntu (14.04, 16.04, 18.04), Fedora (27, 28), Debian (8, 9), and CentOS (7).

## Compute size guidance

When creating a dataset, review your compute processing power and the size of your data in memory. The size of your data in storage is not the same as the size of data in a dataframe. For example, data in CSV files can expand up to 10x in a dataframe, so a 1 GB CSV file can become 10 GB in a dataframe. 

If your data is compressed, it can expand further; 20 GB of relatively sparse data stored in compressed parquet format can expand to ~800 GB in memory. Since Parquet files store data in a columnar format, if you only need half of the columns, then you only need to load ~400 GB in memory.

[Learn more about optimizing data processing in Azure Machine Learning](concept-optimize-data-processing.md).

## Dataset types

There are two dataset types, based on how users consume them in training; FileDatasets and TabularDatasets. Both types can be used in Azure Machine Learning training workflows involving, estimators, AutoML, hyperDrive and pipelines. 

### FileDataset

A [FileDataset](https://docs.microsoft.com/python/api/azureml-core/azureml.data.file_dataset.filedataset?view=azure-ml-py&preserve-view=true) references single or multiple files in your datastores or public URLs. 
If your data is already cleansed, and ready to use in training experiments, you can [download or mount](how-to-train-with-datasets.md#mount-vs-download) the files to your compute as a FileDataset object. 

We recommend FileDatasets for your machine learning workflows, since the source files can be in any format, which enables a wider range of machine learning scenarios, including deep learning.

Create a FileDataset with the [Python SDK](#create-a-filedataset) or the [Azure Machine Learning studio](#create-datasets-in-the-studio)

### TabularDataset

A [TabularDataset](https://docs.microsoft.com/python/api/azureml-core/azureml.data.tabulardataset?view=azure-ml-py&preserve-view=true) represents data in a tabular format by parsing the provided file or list of files. This provides you with the ability to materialize the data into a pandas or Spark DataFrame so you can work with familiar data preparation and training libraries without having to leave your notebook. You can create a `TabularDataset` object from .csv, .tsv, .parquet, .jsonl files, and from [SQL query results](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory?view=azure-ml-py#&preserve-view=truefrom-sql-query-query--validate-true--set-column-types-none--query-timeout-30-).

With TabularDatasets, you can specify a time stamp from a column in the data or from wherever the path pattern data is stored to enable a time series trait. This specification allows for easy and efficient filtering by time. For an example, see [Tabular time series-related API demo with NOAA weather data](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/work-with-data/datasets-tutorial/timeseries-datasets/tabular-timeseries-dataset-filtering.ipynb).

Create a TabularDataset with [the Python SDK](#create-a-tabulardataset) or [Azure Machine Learning studio](#create-datasets-in-the-studio).

>[!NOTE]
> AutoML workflows generated via the Azure Machine Learning studio currently only support TabularDatasets. 

## Access datasets in a virtual network

If your workspace is in a virtual network, you must configure the dataset to skip validation. For more information on how to use datastores and datasets in a virtual network, see [Secure a workspace and associated resources](how-to-secure-workspace-vnet.md#secure-datastores-and-datasets).

<a name="datasets-sdk"></a>

## Create datasets via the SDK

 For the data to be accessible by Azure Machine Learning, datasets must be created from paths in [Azure datastores](how-to-access-data.md) or public web URLs. 

To create datasets from an [Azure datastore](how-to-access-data.md) with the Python SDK:

1. Verify that you have `contributor` or `owner` access to the registered Azure datastore.

2. Create the dataset by referencing paths in the datastore. You can create a dataset from multiple paths in multiple datastores. There is no hard limit on the number of files or data size that you can create a dataset from. 

> [!Note]
> For each data path, a few requests will be sent to the storage service to check whether it points to a file or a folder. This overhead may lead to degraded performance or failure. A dataset referencing one folder with 1000 files inside is considered referencing one data path. We recommend creating dataset referencing less than 100 paths in datastores for optimal performance.

### Create a FileDataset

Use the [`from_files()`](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_factory.filedatasetfactory?view=azure-ml-py#&preserve-view=truefrom-files-path--validate-true-) method on the `FileDatasetFactory` class to load files in any format and to create an unregistered FileDataset. 

If your storage is behind a virtual network or firewall, set the parameter `validate=False` in your `from_files()` method. This bypasses the initial validation step, and ensures that you can create your dataset from these secure files. Learn more about how to [use datastores and datasets in a virtual network](how-to-secure-workspace-vnet.md#secure-datastores-and-datasets).

```Python
# create a FileDataset pointing to files in 'animals' folder and its subfolders recursively
datastore_paths = [(datastore, 'animals')]
animal_ds = Dataset.File.from_files(path=datastore_paths)

# create a FileDataset from image and label files behind public web urls
web_paths = ['https://azureopendatastorage.blob.core.windows.net/mnist/train-images-idx3-ubyte.gz',
             'https://azureopendatastorage.blob.core.windows.net/mnist/train-labels-idx1-ubyte.gz']
mnist_ds = Dataset.File.from_files(path=web_paths)
```

### Create a TabularDataset

Use the [`from_delimited_files()`](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory) method on the `TabularDatasetFactory` class to read files in .csv or .tsv format, and to create an unregistered TabularDataset. If you're reading from multiple files, results will be aggregated into one tabular representation. 

If your storage is behind a virtual network or firewall, set the parameter `validate=False` in your `from_delimited_files()` method. This bypasses the initial validation step, and ensures that you can create your dataset from these secure files. Learn more about how to use [datastores and datasets in a virtual network](how-to-secure-workspace-vnet.md#secure-datastores-and-datasets).

The following code gets the existing workspace and the desired datastore by name. And then passes the datastore and file locations to the `path` parameter to create a new TabularDataset, `weather_ds`.

```Python
from azureml.core import Workspace, Datastore, Dataset

datastore_name = 'your datastore name'

# get existing workspace
workspace = Workspace.from_config()
    
# retrieve an existing datastore in the workspace by name
datastore = Datastore.get(workspace, datastore_name)

# create a TabularDataset from 3 file paths in datastore
datastore_paths = [(datastore, 'weather/2018/11.csv'),
                   (datastore, 'weather/2018/12.csv'),
                   (datastore, 'weather/2019/*.csv')]

weather_ds = Dataset.Tabular.from_delimited_files(path=datastore_paths)
```

By default, when you create a TabularDataset, column data types are inferred automatically. If the inferred types don't match your expectations, you can specify column types by using the following code. The parameter `infer_column_type` is only applicable for datasets created from delimited files. [Learn more about supported data types](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_factory.datatype?view=azure-ml-py&preserve-view=true).


```Python
from azureml.core import Dataset
from azureml.data.dataset_factory import DataType

# create a TabularDataset from a delimited file behind a public web url and convert column "Survived" to boolean
web_path ='https://dprepdata.blob.core.windows.net/demo/Titanic.csv'
titanic_ds = Dataset.Tabular.from_delimited_files(path=web_path, set_column_types={'Survived': DataType.to_bool()})

# preview the first 3 rows of titanic_ds
titanic_ds.take(3).to_pandas_dataframe()
```

|(Index)|PassengerId|Survived|Pclass|Name|Sex|Age|SibSp|Parch|Ticket|Fare|Cabin|Embarked
-|-----------|--------|------|----|---|---|-----|-----|------|----|-----|--------|
0|1|False|3|Braund, Mr. Owen Harris|male|22.0|1|0|A/5 21171|7.2500||S
1|2|True|1|Cumings, Mrs. John Bradley (Florence Briggs Th...|female|38.0|1|0|PC 17599|71.2833|C85|C
2|3|True|3|Heikkinen, Miss. Laina|female|26.0|0|0|STON/O2. 3101282|7.9250||S

### Create a dataset from pandas dataframe

To create a TabularDataset from an in memory pandas dataframe, write the data to a local file, like a csv, and create your dataset from that file. The following code demonstrates this workflow.

```python
# azureml-core of version 1.0.72 or higher is required
# azureml-dataprep[pandas] of version 1.1.34 or higher is required

from azureml.core import Workspace, Dataset
local_path = 'data/prepared.csv'
dataframe.to_csv(local_path)
upload the local file to a datastore on the cloud

subscription_id = 'xxxxxxxxxxxxxxxxxxxxx'
resource_group = 'xxxxxx'
workspace_name = 'xxxxxxxxxxxxxxxx'

workspace = Workspace(subscription_id, resource_group, workspace_name)

# get the datastore to upload prepared data
datastore = workspace.get_default_datastore()

# upload the local file from src_dir to the target_path in datastore
datastore.upload(src_dir='data', target_path='data')

# create a dataset referencing the cloud location
dataset = Dataset.Tabular.from_delimited_files(datastore.path('data/prepared.csv'))
```

## Register datasets

To complete the creation process, register your datasets with a workspace. Use the [`register()`](https://docs.microsoft.com/python/api/azureml-core/azureml.data.abstract_dataset.abstractdataset?view=azure-ml-py#&preserve-view=trueregister-workspace--name--description-none--tags-none--create-new-version-false-) method to register datasets with your workspace in order to share them with others and reuse them across experiments in your workspace:

```Python
titanic_ds = titanic_ds.register(workspace=workspace,
                                 name='titanic_ds',
                                 description='titanic training data')
```

<a name="datasets-ui"></a>
## Create datasets in the studio
The following steps and animation show how to create a dataset in [Azure Machine Learning studio](https://ml.azure.com).

> [!Note]
> Datasets created through Azure Machine Learning studio are automatically registered to the workspace.

![Create a dataset with the UI](./media/how-to-create-register-datasets/create-dataset-ui.gif)

To create a dataset in the studio:
1. Sign in at https://ml.azure.com.
1. Select **Datasets** in the **Assets** section of the left pane. 
1. Select **Create Dataset** to choose the source of your dataset. This source can be local files, a datastore, or public URLs.
1. Select **Tabular** or **File** for Dataset type.
1. Select **Next** to open the **Datastore and file selection** form. On this form you select where to keep your dataset after creation, as well as select what data files to use for your dataset. 
    1. Enable skip validation if your data is in a virtual network. Learn more about [using datasets and datastores in a virtual network](how-to-secure-workspace-vnet.md#secure-datastores-and-datasets).
1. Select **Next** to populate the **Settings and preview** and **Schema** forms; they are intelligently populated based on file type and you can further configure your dataset prior to creation on these forms. 
1. Select **Next** to review the **Confirm details** form. Check your selections and create an optional data profile for your dataset. Learn more about [data profiling](how-to-use-automated-ml-for-ml-models.md#profile). 
1. Select **Create** to complete your dataset creation.

## Create datasets with Azure Open Datasets

[Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/) are curated public datasets that you can use to add scenario-specific features to machine learning solutions for more accurate models. Datasets include public-domain data for weather, census, holidays, public safety, and location that help you train machine learning models and enrich predictive solutions. Open Datasets are in the cloud on Microsoft Azure and are included in both the SDK and the studio.

Learn how to create [Azure Machine Learning Datasets from Azure Open Datasets](../open-datasets/how-to-create-azure-machine-learning-dataset-from-open-dataset.md). 

## Train with datasets

Use your datasets in your machine learning experiments for training ML models. [Learn more about how to train with datasets](how-to-train-with-datasets.md)

## Version datasets

You can register a new dataset under the same name by creating a new version. A dataset version is a way to bookmark the state of your data so that you can apply a specific version of the dataset for experimentation or future reproduction. Learn more about [dataset versions](how-to-version-track-datasets.md).
```Python
# create a TabularDataset from Titanic training data
web_paths = ['https://dprepdata.blob.core.windows.net/demo/Titanic.csv',
             'https://dprepdata.blob.core.windows.net/demo/Titanic2.csv']
titanic_ds = Dataset.Tabular.from_delimited_files(path=web_paths)

# create a new version of titanic_ds
titanic_ds = titanic_ds.register(workspace = workspace,
                                 name = 'titanic_ds',
                                 description = 'new titanic training data',
                                 create_new_version = True)
```

## Next steps

* Learn [how to train with datasets](how-to-train-with-datasets.md).
* Use automated machine learning to [train with TabularDatasets](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-energy-demand/auto-ml-forecasting-energy-demand.ipynb).
* For more dataset training examples, see the [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/work-with-data/).
