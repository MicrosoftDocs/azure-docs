---
title: Create Azure Machine Learning datasets
titleSuffix: Azure Machine Learning
description: Learn how to create Azure Machine Learning datasets to access your data for machine learning experiment runs.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: how-to, contperf-fy21q1, data4ml
ms.author: sihhu
author: MayMSFT
manager: cgronlun
ms.reviewer: nibaccam
ms.date: 07/31/2020

# Customer intent: As an experienced data scientist, I need to package my data into a consumable and reusable object to train my machine learning models.

---

# Create Azure Machine Learning datasets

In this article, you learn how to create Azure Machine Learning datasets to access data for your local or remote experiments with the Azure Machine Learning Python SDK. To understand where datasets fit in Azure Machine Learning's overall data access workflow, see  the [Securely access data](concept-data.md#data-workflow) article.

By creating a dataset, you create a reference to the data source location, along with a copy of its metadata. Because the data remains in its existing location, you incur no extra storage cost, and don't risk the integrity of your data sources. Also datasets are lazily evaluated, which aids in workflow performance speeds. You can create datasets from datastores, public URLs, and [Azure Open Datasets](../open-datasets/how-to-create-azure-machine-learning-dataset-from-open-dataset.md).

For a low-code experience, [Create Azure Machine Learning datasets with the Azure Machine Learning studio.](how-to-connect-data-ui.md#create-datasets)

With Azure Machine Learning datasets, you can:

* Keep a single copy of data in your storage, referenced by datasets.

* Seamlessly access data during model training without worrying about connection strings or data paths. [Learn more about how to train with datasets](how-to-train-with-datasets.md).

* Share data and collaborate with other users.

## Prerequisites

To create and work with datasets, you need:

* An Azure subscription. If you don't have one, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).

* An [Azure Machine Learning workspace](how-to-manage-workspace.md).

* The [Azure Machine Learning SDK for Python installed](/python/api/overview/azure/ml/install), which includes the azureml-datasets package.

    * Create an [Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md), which is a fully configured and managed development environment that includes integrated notebooks and the SDK already installed.

    **OR**

    * Work on your own Jupyter notebook and install the SDK yourself with [these instructions](/python/api/overview/azure/ml/install).

> [!NOTE]
> Some dataset classes have dependencies on the [azureml-dataprep](https://pypi.org/project/azureml-dataprep/) package, which is only compatible with 64-bit Python. For Linux users, these classes are supported only on the following distributions:  Red Hat Enterprise Linux (7, 8), Ubuntu (14.04, 16.04, 18.04), Fedora (27, 28), Debian (8, 9), and CentOS (7). If you are using unsupported distros, please follow [this guide](/dotnet/core/install/linux) to install .NET Core 2.1 to proceed. 

## Compute size guidance

When creating a dataset, review your compute processing power and the size of your data in memory. The size of your data in storage is not the same as the size of data in a dataframe. For example, data in CSV files can expand up to 10x in a dataframe, so a 1 GB CSV file can become 10 GB in a dataframe. 

If your data is compressed, it can expand further; 20 GB of relatively sparse data stored in compressed parquet format can expand to ~800 GB in memory. Since Parquet files store data in a columnar format, if you only need half of the columns, then you only need to load ~400 GB in memory.

[Learn more about optimizing data processing in Azure Machine Learning](concept-optimize-data-processing.md).

## Dataset types

There are two dataset types, based on how users consume them in training; FileDatasets and TabularDatasets. Both types can be used in Azure Machine Learning training workflows involving, estimators, AutoML, hyperDrive and pipelines. 

### FileDataset

A [FileDataset](/python/api/azureml-core/azureml.data.file_dataset.filedataset) references single or multiple files in your datastores or public URLs. 
If your data is already cleansed, and ready to use in training experiments, you can [download or mount](how-to-train-with-datasets.md#mount-vs-download) the files to your compute as a FileDataset object. 

We recommend FileDatasets for your machine learning workflows, since the source files can be in any format, which enables a wider range of machine learning scenarios, including deep learning.

Create a FileDataset with the [Python SDK](#create-a-filedataset) or the [Azure Machine Learning studio](how-to-connect-data-ui.md#create-datasets)
.
### TabularDataset

A [TabularDataset](/python/api/azureml-core/azureml.data.tabulardataset) represents data in a tabular format by parsing the provided file or list of files. This provides you with the ability to materialize the data into a pandas or Spark DataFrame so you can work with familiar data preparation and training libraries without having to leave your notebook. You can create a `TabularDataset` object from .csv, .tsv, [.parquet](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#from-parquet-files-path--validate-true--include-path-false--set-column-types-none--partition-format-none-), [.jsonl files](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#from-json-lines-files-path--validate-true--include-path-false--set-column-types-none--partition-format-none--invalid-lines--error---encoding--utf8--), and from [SQL query results](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#from-sql-query-query--validate-true--set-column-types-none--query-timeout-30-).

With TabularDatasets, you can specify a time stamp from a column in the data or from wherever the path pattern data is stored to enable a time series trait. This specification allows for easy and efficient filtering by time. For an example, see [Tabular time series-related API demo with NOAA weather data](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/work-with-data/datasets-tutorial/timeseries-datasets/tabular-timeseries-dataset-filtering.ipynb).

Create a TabularDataset with [the Python SDK](#create-a-tabulardataset) or [Azure Machine Learning studio](how-to-connect-data-ui.md#create-datasets).

>[!NOTE]
> [Automated ML](concept-automated-ml.md) workflows generated via the Azure Machine Learning studio currently only support TabularDatasets. 

## Access datasets in a virtual network

If your workspace is in a virtual network, you must configure the dataset to skip validation. For more information on how to use datastores and datasets in a virtual network, see [Secure a workspace and associated resources](how-to-secure-workspace-vnet.md#secure-datastores-and-datasets).

<a name="datasets-sdk"></a>

## Create datasets from datastores

For the data to be accessible by Azure Machine Learning, datasets must be created from paths in [Azure Machine Learning datastores](how-to-access-data.md) or web URLs. 

> [!TIP] 
> You can create datasets directly from storage urls with identity-based data access. Learn more at [Connect to storage with identity-based data access (preview)](how-to-identity-based-data-access.md)<br><br>
This capability is an [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview feature, and may change at any time. 

 
To create datasets from a datastore with the Python SDK:

1. Verify that you have `contributor` or `owner` access to the underlying storage service of your registered Azure Machine Learning datastore. [Check your storage account permissions in the Azure portal](../role-based-access-control/check-access.md).

1. Create the dataset by referencing paths in the datastore. You can create a dataset from multiple paths in multiple datastores. There is no hard limit on the number of files or data size that you can create a dataset from. 

> [!NOTE]
> For each data path, a few requests will be sent to the storage service to check whether it points to a file or a folder. This overhead may lead to degraded performance or failure. A dataset referencing one folder with 1000 files inside is considered referencing one data path. We recommend creating dataset referencing less than 100 paths in datastores for optimal performance.

### Create a FileDataset

Use the [`from_files()`](/python/api/azureml-core/azureml.data.dataset_factory.filedatasetfactory#from-files-path--validate-true-) method on the `FileDatasetFactory` class to load files in any format and to create an unregistered FileDataset. 

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
To reuse and share datasets across experiment in your workspace, [register your dataset](#register-datasets). 

> [!TIP] 
> Upload files from a local directory and create a FileDataset in a single method with the public preview method, [upload_directory()](/python/api/azureml-core/azureml.data.dataset_factory.filedatasetfactory#upload-directory-src-dir--target--pattern-none--overwrite-false--show-progress-true-). This method is an [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview feature, and may change at any time. 
> 
>  This method uploads data to your underlying storage, and as a result incur storage costs. 

### Create a TabularDataset

Use the [`from_delimited_files()`](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory) method on the `TabularDatasetFactory` class to read files in .csv or .tsv format, and to create an unregistered TabularDataset. To read in files from .parquet format, use the [`from_parquet_files()`](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#from-parquet-files-path--validate-true--include-path-false--set-column-types-none--partition-format-none-) method. If you're reading from multiple files, results will be aggregated into one tabular representation. 

See the [TabularDatasetFactory reference documentation](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory) for information about supported file formats, as well as syntax and design patterns. 

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
### Set data schema

By default, when you create a TabularDataset, column data types are inferred automatically. If the inferred types don't match your expectations, you can update your dataset schema by specifying column types with the following code. The parameter `infer_column_type` is only applicable for datasets created from delimited files. [Learn more about supported data types](/python/api/azureml-core/azureml.data.dataset_factory.datatype).


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

To reuse and share datasets across experiments in your workspace, [register your dataset](#register-datasets).

## Wrangle data
After you create and [register](#register-datasets) your dataset, you can load it into your notebook for data wrangling and [exploration](#explore-data) prior to model training. 

If you don't need to do any data wrangling or exploration, see how to consume datasets in your training scripts for submitting ML experiments in [Train with datasets](how-to-train-with-datasets.md).

### Filter datasets (preview)

Filtering capabilities depends on the type of dataset you have. 
> [!IMPORTANT]
> Filtering datasets with the preview method, [`filter()`](/python/api/azureml-core/azureml.data.tabulardataset#filter-expression-) is an [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview feature, and may change at any time. 
> 
**For TabularDatasets**, you can keep or remove columns with the [keep_columns()](/python/api/azureml-core/azureml.data.tabulardataset#keep-columns-columns--validate-false-) and [drop_columns()](/python/api/azureml-core/azureml.data.tabulardataset#drop-columns-columns-) methods.

To filter out rows by a specific column value in a TabularDataset, use the [filter()](/python/api/azureml-core/azureml.data.tabulardataset#filter-expression-) method (preview). 

The following examples return an unregistered dataset based on the specified expressions.

```python
# TabularDataset that only contains records where the age column value is greater than 15
tabular_dataset = tabular_dataset.filter(tabular_dataset['age'] > 15)

# TabularDataset that contains records where the name column value contains 'Bri' and the age column value is greater than 15
tabular_dataset = tabular_dataset.filter((tabular_dataset['name'].contains('Bri')) & (tabular_dataset['age'] > 15))
```

**In FileDatasets**, each row corresponds to a path of a file, so filtering by column value is not helpful. But, you can [filter()](/python/api/azureml-core/azureml.data.filedataset#filter-expression-) out rows by metadata like, CreationTime, Size etc.

The following examples return an unregistered dataset based on the specified expressions.

```python
# FileDataset that only contains files where Size is less than 100000
file_dataset = file_dataset.filter(file_dataset.file_metadata['Size'] < 100000)

# FileDataset that only contains files that were either created prior to Jan 1, 2020 or where 
file_dataset = file_dataset.filter((file_dataset.file_metadata['CreatedTime'] < datetime(2020,1,1)) | (file_dataset.file_metadata['CanSeek'] == False))
```

**Labeled datasets** created from [data labeling projects](how-to-create-labeling-projects.md) are a special case. These datasets are a type of TabularDataset made up of image files. For these types of datasets, you can [filter()](/python/api/azureml-core/azureml.data.tabulardataset#filter-expression-) images by metadata, and by column values like `label` and `image_details`.

```python
# Dataset that only contains records where the label column value is dog
labeled_dataset = labeled_dataset.filter(labeled_dataset['label'] == 'dog')

# Dataset that only contains records where the label and isCrowd columns are True and where the file size is larger than 100000
labeled_dataset = labeled_dataset.filter((labeled_dataset['label']['isCrowd'] == True) & (labeled_dataset.file_metadata['Size'] > 100000))
```

### Partition data (preview)

You can partition a dataset by including the `partitions_format` parameter when creating a TabularDataset or FileDataset. 

> [!IMPORTANT]
> Creating dataset partitions is an [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview capability, and may change at any time. 

When you partition a dataset, the partition information of each file path is extracted into columns based on the specified format. The format should start from the position of first partition key until the end of file path. 

For example, given the path `../Accounts/2019/01/01/data.jsonl` where the partition is by department name and time; the `partition_format='/{Department}/{PartitionDate:yyyy/MM/dd}/data.jsonl'` creates a string column 'Department' with the value 'Accounts' and a datetime column 'PartitionDate' with the value `2019-01-01`.

If your data already has existing partitions and you want to preserve that format, include the `partitioned_format` parameter in your [`from_files()`](/python/api/azureml-core/azureml.data.dataset_factory.filedatasetfactory#from-files-path--validate-true--partition-format-none-) method to create a FileDataset. 

To create a TabularDataset that preserves existing partitions, include the `partitioned_format` parameter in the [from_parquet_files()](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#from-parquet-files-path--validate-true--include-path-false--set-column-types-none--partition-format-none-) or the
[from_delimited_files()](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#from-delimited-files-path--validate-true--include-path-false--infer-column-types-true--set-column-types-none--separator------header-true--partition-format-none--support-multi-line-false--empty-as-string-false--encoding--utf8--) method.

The following example,
* Creates a FileDataset from partitioned files.
* Gets the partition keys
* Creates a new, indexed FileDataset using
 
```Python

file_dataset = Dataset.File.from_files(data_paths, partition_format = '{userid}/*.wav')
ds.register(name='speech_dataset')

# access partition_keys
indexes = file_dataset.partition_keys # ['userid']

# get all partition key value pairs should return [{'userid': 'user1'}, {'userid': 'user2'}]
partitions = file_dataset.get_partition_key_values()


partitions = file_dataset.get_partition_key_values(['userid'])
# return [{'userid': 'user1'}, {'userid': 'user2'}]

# filter API, this will only download data from user1/ folder
new_file_dataset = file_dataset.filter(ds['userid'] == 'user1').download()
```

You can also create a new partitions structure for TabularDatasets with the [partitions_by()](/python/api/azureml-core/azureml.data.tabulardataset#partition-by-partition-keys--target--name-none--show-progress-true--partition-as-file-dataset-false-) method.

```Python

 dataset = Dataset.get_by_name('test') # indexed by country, state, partition_date

# call partition_by locally
new_dataset = ds.partition_by(name="repartitioned_ds", partition_keys=['country'], target=DataPath(datastore, "repartition"))
partition_keys = new_dataset.partition_keys # ['country']
```

>[!IMPORTANT]
> TabularDataset partitions can also be applied in Azure Machine Learning pipelines as input to your ParallelRunStep in many models applications. See an example in the [Many Models accelerator documentation](https://github.com/microsoft/solution-accelerator-many-models/blob/master/01_Data_Preparation.ipynb).

## Explore data

After you're done wrangling your data, you can [register](#register-datasets) your dataset, and then load it into your notebook for data exploration prior to model training.

For FileDatasets, you can either **mount** or **download** your dataset, and apply the python libraries you'd normally use for data exploration. [Learn more about mount vs download](how-to-train-with-datasets.md#mount-vs-download).

```python
# download the dataset 
dataset.download(target_path='.', overwrite=False) 

# mount dataset to the temp directory at `mounted_path`

import tempfile
mounted_path = tempfile.mkdtemp()
mount_context = dataset.mount(mounted_path)

mount_context.start()
```

For TabularDatasets, use the [`to_pandas_dataframe()`](/python/api/azureml-core/azureml.data.tabulardataset#to-pandas-dataframe-on-error--null---out-of-range-datetime--null--) method to view your data in a dataframe. 

```python
# preview the first 3 rows of titanic_ds
titanic_ds.take(3).to_pandas_dataframe()
```

|(Index)|PassengerId|Survived|Pclass|Name|Sex|Age|SibSp|Parch|Ticket|Fare|Cabin|Embarked
-|-----------|--------|------|----|---|---|-----|-----|------|----|-----|--------|
0|1|False|3|Braund, Mr. Owen Harris|male|22.0|1|0|A/5 21171|7.2500||S
1|2|True|1|Cumings, Mrs. John Bradley (Florence Briggs Th...|female|38.0|1|0|PC 17599|71.2833|C85|C
2|3|True|3|Heikkinen, Miss. Laina|female|26.0|0|0|STON/O2. 3101282|7.9250||S

## Create a dataset from pandas dataframe

To create a TabularDataset from an in memory pandas dataframe, write the data to a local file, like a csv, and create your dataset from that file. The following code demonstrates this workflow.

```python
# azureml-core of version 1.0.72 or higher is required
# azureml-dataprep[pandas] of version 1.1.34 or higher is required

from azureml.core import Workspace, Dataset
local_path = 'data/prepared.csv'
dataframe.to_csv(local_path)

# upload the local file to a datastore on the cloud

subscription_id = 'xxxxxxxxxxxxxxxxxxxxx'
resource_group = 'xxxxxx'
workspace_name = 'xxxxxxxxxxxxxxxx'

workspace = Workspace(subscription_id, resource_group, workspace_name)

# get the datastore to upload prepared data
datastore = workspace.get_default_datastore()

# upload the local file from src_dir to the target_path in datastore
datastore.upload(src_dir='data', target_path='data')

# create a dataset referencing the cloud location
dataset = Dataset.Tabular.from_delimited_files(path = [(datastore, ('data/prepared.csv'))])
```

> [!TIP]
> Create and register a TabularDataset from an in memory spark or pandas dataframe with a single method with public preview methods, [`register_spark_dataframe()`](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#methods) and [`register_pandas_dataframe()`](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#methods). These register methods are [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview features, and may change at any time. 
> 
>  These methods upload data to your underlying storage, and as a result incur storage costs. 

## Register datasets

To complete the creation process, register your datasets with a workspace. Use the [`register()`](/python/api/azureml-core/azureml.data.abstract_dataset.abstractdataset#&preserve-view=trueregister-workspace--name--description-none--tags-none--create-new-version-false-) method to register datasets with your workspace in order to share them with others and reuse them across experiments in your workspace:

```Python
titanic_ds = titanic_ds.register(workspace=workspace,
                                 name='titanic_ds',
                                 description='titanic training data')
```

## Create datasets using Azure Resource Manager

There are many templates at [https://github.com/Azure/azure-quickstart-templates/tree/master/101-machine-learning-dataset-create-*](https://github.com/Azure/azure-quickstart-templates/tree/master/) that can be used to create datasets.

For information on using these templates, see [Use an Azure Resource Manager template to create a workspace for Azure Machine Learning](how-to-create-workspace-template.md).


## Create datasets from Azure Open Datasets

[Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/) are curated public datasets that you can use to add scenario-specific features to machine learning solutions for more accurate models. Datasets include public-domain data for weather, census, holidays, public safety, and location that help you train machine learning models and enrich predictive solutions. Open Datasets are in the cloud on Microsoft Azure and are included in both the SDK and the studio.

Learn how to create [Azure Machine Learning Datasets from Azure Open Datasets](../open-datasets/how-to-create-azure-machine-learning-dataset-from-open-dataset.md). 

## Train with datasets

Use your datasets in your machine learning experiments for training ML models. [Learn more about how to train with datasets](how-to-train-with-datasets.md).

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
