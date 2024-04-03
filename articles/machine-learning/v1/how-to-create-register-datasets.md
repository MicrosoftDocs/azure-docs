---
title: Create Azure Machine Learning datasets
titleSuffix: Azure Machine Learning
description: Learn how to create Azure Machine Learning datasets to access your data for machine learning experiment runs.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.custom: UpdateFrequency5, data4ml, devx-track-arm-template
ms.author: yogipandey
author: ynpandey
ms.reviewer: franksolomon
ms.date: 02/28/2024
#Customer intent: As an experienced data scientist, I need to package my data into a consumable and reusable object to train my machine learning models.
---

# Create Azure Machine Learning datasets

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

In this article, you learn how to create Azure Machine Learning datasets to access data for your local or remote experiments with the Azure Machine Learning Python SDK. For more information about how datasets fit in Azure Machine Learning's overall data access workflow, visit the [Securely access data](concept-data.md#data-workflow) article.

When you create a dataset, you create a reference to the data source location, along with a copy of its metadata. Because the data remains in its existing location, you incur no extra storage cost, and you don't risk the integrity of your data sources. Additionally, datasets are lazily evaluated, which helps improve workflow performance speeds. You can create datasets from datastores, public URLs, and [Azure Open Datasets](../../open-datasets/how-to-create-azure-machine-learning-dataset-from-open-dataset.md). For information about a low-code experience, visit [Create Azure Machine Learning datasets with the Azure Machine Learning studio](how-to-connect-data-ui.md#create-data-assets).

With Azure Machine Learning datasets, you can:

* Keep a single copy of data in your storage, referenced by datasets

* Seamlessly access data during model training without worrying about connection strings or data paths. For more information about dataset training, visit [Learn more about how to train with datasets](how-to-train-with-datasets.md)

* Share data and collaborate with other users

> [!IMPORTANT]
> Items in this article marked as "preview" are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

To create and work with datasets, you need:

* An Azure subscription. If you don't have one, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/)

* An [Azure Machine Learning workspace](../quickstart-create-resources.md)

* The [Azure Machine Learning SDK for Python installed](/python/api/overview/azure/ml/install), which includes the azureml-datasets package

* Create an [Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md), a fully configured and managed development environment that includes integrated notebooks and the SDK already installed

    **OR**

* Work on your own Jupyter notebook and [install the SDK yourself](/python/api/overview/azure/ml/install)

> [!NOTE]
> Some dataset classes have dependencies on the [azureml-dataprep](https://pypi.org/project/azureml-dataprep/) package, which is only compatible with 64-bit Python. If you develop on __Linux__, these classes rely on .NET Core 2.1, and only specific distributions support them. For more information about the supported distros, read the .NET Core 2.1 column in the [Install .NET on Linux](/dotnet/core/install/linux) article.

> [!IMPORTANT]
> While the package may work on older versions of Linux distros, we do not recommend use of a distro that is out of mainstream support. Distros that are out of mainstream support may have security vulnerabilities, because they do not receive the latest updates. We recommend using the latest supported version of your distro that is compatible with .

## Compute size guidance

When you create a dataset, review your compute processing power and the size of your data in memory. The size of your data in storage isn't the same as the size of data in a dataframe. For example, data in CSV files can expand up to 10 times in a dataframe, so a 1-GB CSV file can become 10 GB in a dataframe.

Compressed data can expand further. Twenty GB of relatively sparse data stored in a compressed parquet format can expand to ~800 GB in memory. Since Parquet files store data in a columnar format, if you only need half of the columns, then you only need to load ~400 GB in memory.

For more information, visit [Learn more about optimizing data processing in Azure Machine Learning](../concept-optimize-data-processing.md).

## Dataset types

There are two dataset types, based on how users consume datasets in training: FileDatasets and TabularDatasets. Azure Machine Learning training workflows that involve estimators, AutoML, hyperDrive, and pipelines can use both types.

### FileDataset

A [FileDataset](/python/api/azureml-core/azureml.data.file_dataset.filedataset) references single or multiple files in your datastores or public URLs. If your data is already cleaned, and ready to use in training experiments, you can [download or mount](how-to-train-with-datasets.md#mount-vs-download) the files to your compute as a FileDataset object.

We recommend FileDatasets for your machine learning workflows, because the source files can be in any format. This enables a wider range of machine learning scenarios, including deep learning.

Create a FileDataset with the [Python SDK](#create-a-filedataset) or the [Azure Machine Learning studio](how-to-connect-data-ui.md#create-data-assets).

### TabularDataset

A [TabularDataset](/python/api/azureml-core/azureml.data.tabulardataset) parses the provided file or list of files, to represent data in a tabular format. You can then materialize the data into a pandas or Spark DataFrame, to work with familiar data preparation and training libraries while staying in your notebook. You can create a `TabularDataset` object from .csv, .tsv, [.parquet](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#azureml-data-dataset-factory-tabulardatasetfactory-from-parquet-files), [.json lines files](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#azureml-data-dataset-factory-tabulardatasetfactory-from-json-lines-files), and from [SQL query results](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#azureml-data-dataset-factory-tabulardatasetfactory-from-sql-query).

With TabularDatasets, you can specify a time stamp from a column in the data, or from the location where the path pattern data is stored, to enable a time series trait. This specification enables easy and efficient filtering by time. For an example, visit [Tabular time series-related API demo with NOAA weather data](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/work-with-data/datasets-tutorial/timeseries-datasets/tabular-timeseries-dataset-filtering.ipynb).

Create a TabularDataset with [the Python SDK](#create-a-tabulardataset) or [Azure Machine Learning studio](how-to-connect-data-ui.md#create-data-assets).

>[!NOTE]
> [Automated ML](../concept-automated-ml.md) workflows generated via the Azure Machine Learning studio currently only support TabularDatasets.
>  
>Also, for TabularDatasets generated from [SQL query results](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#azureml-data-dataset-factory-tabulardatasetfactory-from-sql-query), T-SQL (e.g. 'WITH' sub query) or duplicate column names are not supported. Complex T-SQL queries can cause performance issues. Duplicate column names in a dataset can cause ambiguity issues.

## Access datasets in a virtual network

If your workspace is located in a virtual network, you must configure the dataset to skip validation. For more information about how to use datastores and datasets in a virtual network, visit [Secure a workspace and associated resources](how-to-secure-workspace-vnet.md#datastores-and-datasets).

## Create datasets from datastores

To make the data accessible by Azure Machine Learning, you must create datasets from paths in web URLs or [Azure Machine Learning datastores](how-to-access-data.md).

> [!TIP]
> You can create datasets directly from storage urls with identity-based data access. For more information, visit [Connect to storage with identity-based data access](how-to-identity-based-data-access.md).

To create datasets from a datastore with the Python SDK:

1. Verify that you have `contributor` or `owner` access to the underlying storage service of your registered Azure Machine Learning datastore. [Check your storage account permissions in the Azure portal](../../role-based-access-control/check-access.md).

1. Create the dataset by referencing paths in the datastore. You can create a dataset from multiple paths in multiple datastores. There's no hard limit on the number of files or data size from which you can create a dataset.

> [!NOTE]
> For each data path, a few requests will be sent to the storage service to check whether it points to a file or a folder. This overhead may lead to degraded performance or failure. A dataset referencing one folder with 1000 files inside is considered referencing one data path. For optimal performance, we recommend creating datasets that reference less than 100 paths in datastores.

### Create a FileDataset

Use the [`from_files()`](/python/api/azureml-core/azureml.data.dataset_factory.filedatasetfactory#azureml-data-dataset-factory-filedatasetfactory-from-files) method on the `FileDatasetFactory` class to load files in any format, and to create an unregistered FileDataset.

If your storage is behind a virtual network or firewall, set the parameter `validate=False` in the `from_files()` method. This bypasses the initial validation step, and ensures that you can create your dataset from these secure files. For more information, visit [use datastores and datasets in a virtual network](how-to-secure-workspace-vnet.md#datastores-and-datasets).

```Python
from azureml.core import Workspace, Datastore, Dataset

# create a FileDataset recursively pointing to files in 'animals' folder and its subfolder
datastore_paths = [(datastore, 'animals')]
animal_ds = Dataset.File.from_files(path=datastore_paths)

# create a FileDataset from image and label files behind public web urls
web_paths = ['https://azureopendatastorage.blob.core.windows.net/mnist/train-images-idx3-ubyte.gz',
             'https://azureopendatastorage.blob.core.windows.net/mnist/train-labels-idx1-ubyte.gz']
mnist_ds = Dataset.File.from_files(path=web_paths)
```

To upload all the files from a local directory, create a FileDataset in a single method with
[`upload_directory()`](/python/api/azureml-core/azureml.data.dataset_factory.filedatasetfactory#azureml-data-dataset-factory-filedatasetfactory-upload-directory). This method uploads data to your underlying storage, and as a result you incur storage costs.

```Python
from azureml.core import Workspace, Datastore, Dataset
from azureml.data.datapath import DataPath

ws = Workspace.from_config()
datastore = Datastore.get(ws, '<name of your datastore>')
ds = Dataset.File.upload_directory(src_dir='<path to you data>',
           target=DataPath(datastore,  '<path on the datastore>'),
           show_progress=True)
```



To reuse and share datasets across experiments in your workspace, [register your dataset](#register-datasets).

### Create a TabularDataset

Use the [`from_delimited_files()`](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#azureml-data-dataset-factory-tabulardatasetfactory-from-delimited-files) method on the `TabularDatasetFactory` class to read files in .csv or .tsv format, and to create an unregistered TabularDataset. To read in files from `.parquet` format, use the [`from_parquet_files()`](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#azureml-data-dataset-factory-tabulardatasetfactory-from-parquet-files) method. If you're reading from multiple files, results are aggregated into one tabular representation.

For information about supported file formats, visit the [TabularDatasetFactory reference documentation](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory), and information about syntax and design patterns such as [multiline support](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#azureml-data-dataset-factory-tabulardatasetfactory-from-delimited-files).

If your storage is behind a virtual network or firewall, set the parameter `validate=False` in your `from_delimited_files()` method. This bypasses the initial validation step, and ensures that you can create your dataset from these secure files. For more information about data storage resources behind a virtual network or firewall, visit [datastores and datasets in a virtual network](how-to-secure-workspace-vnet.md#datastores-and-datasets).

This code gets the existing workspace and the desired datastore by name. It then passes the datastore and file locations to the `path` parameter to create a new TabularDataset named `weather_ds`:

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

When you create a TabularDataset, column data types are automatically inferred by default. If the inferred types don't match your expectations, you can specify column types with the following code to update your dataset. The parameter `infer_column_type` is only applicable for datasets created from delimited files. For more information, visit [Learn more about supported data types](/python/api/azureml-core/azureml.data.dataset_factory.datatype).

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
After you create and [register](#register-datasets) your dataset, you can load that dataset into your notebook for data wrangling and [exploration](#explore-data), before model training. You might not need to do any data wrangling or exploration. In that case, for more information about how to consume datasets in your training scripts for ML experiment submissions, visit [Train with datasets](how-to-train-with-datasets.md).

### Filter datasets (preview)

Filtering capabilities depends on the type of dataset you have.
> [!IMPORTANT]
> Filtering datasets with the [`filter()`](/python/api/azureml-core/azureml.data.tabulardataset#azureml-data-tabulardataset-filter) preview method is an [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview feature, and may change at any time.
> 
For **TabularDatasets**, you can keep or remove columns with the [keep_columns()](/python/api/azureml-core/azureml.data.tabulardataset#azureml-data-tabulardataset-keep-columns) and [drop_columns()](/python/api/azureml-core/azureml.data.tabulardataset#azureml-data-tabulardataset-drop-columns) methods.

To filter out rows by a specific column value in a TabularDataset, use the [filter()](/python/api/azureml-core/azureml.data.tabulardataset#azureml-data-tabulardataset-filter) method (preview).

These examples return an unregistered dataset based on the specified expressions:

```python
# TabularDataset that only contains records where the age column value is greater than 15
tabular_dataset = tabular_dataset.filter(tabular_dataset['age'] > 15)

# TabularDataset that contains records where the name column value contains 'Bri' and the age column value is greater than 15
tabular_dataset = tabular_dataset.filter((tabular_dataset['name'].contains('Bri')) & (tabular_dataset['age'] > 15))
```

In **FileDatasets**, each row corresponds to a path of a file, so filtering by column value doesn't help. However, you can [filter()](/python/api/azureml-core/azureml.data.tabulardataset#azureml-data-tabulardataset-filter) rows by metadata - for example, CreationTime, Size etc. These examples return an unregistered dataset based on the specified expressions:

```python
# FileDataset that only contains files where Size is less than 100000
file_dataset = file_dataset.filter(file_dataset.file_metadata['Size'] < 100000)

# FileDataset that only contains files that were either created prior to Jan 1, 2020 or where 
file_dataset = file_dataset.filter((file_dataset.file_metadata['CreatedTime'] < datetime(2020,1,1)) | (file_dataset.file_metadata['CanSeek'] == False))
```

**Labeled datasets** created from [image labeling projects](../how-to-create-image-labeling-projects.md) are a special case. These datasets are a type of TabularDataset made up of image files. For these datasets, you can [filter()](/python/api/azureml-core/azureml.data.tabulardataset#azureml-data-tabulardataset-filter) images by metadata, and by `label` and `image_details` column values.

```python
# Dataset that only contains records where the label column value is dog
labeled_dataset = labeled_dataset.filter(labeled_dataset['label'] == 'dog')

# Dataset that only contains records where the label and isCrowd columns are True and where the file size is larger than 100000
labeled_dataset = labeled_dataset.filter((labeled_dataset['label']['isCrowd'] == True) & (labeled_dataset.file_metadata['Size'] > 100000))
```

### Partition data

To partition a dataset, include the `partitions_format` parameter when you create a TabularDataset or FileDataset.

When you partition a dataset, the partition information of each file path is extracted into columns based on the specified format. The format should start from the position of first partition key and continue to the end of file path.

For example, given the path `../Accounts/2019/01/01/data.jsonl`, where the partition is by department name and time, the `partition_format='/{Department}/{PartitionDate:yyyy/MM/dd}/data.jsonl'` creates a string column 'Department' with the value 'Accounts', and a datetime column 'PartitionDate' with the value `2019-01-01`.

If your data already has existing partitions and you want to preserve that format, include the `partitioned_format` parameter in your [`from_files()`](/python/api/azureml-core/azureml.data.dataset_factory.filedatasetfactory#azureml-data-dataset-factory-filedatasetfactory-from-files) method, to create a FileDataset.

To create a TabularDataset that preserves existing partitions, include the `partitioned_format` parameter in the [`from_parquet_files()`](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#azureml-data-dataset-factory-tabulardatasetfactory-from-parquet-files) or the
[`from_delimited_files()`](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#azureml-data-dataset-factory-tabulardatasetfactory-from-delimited-files) method.

This example

* Creates a FileDataset from partitioned files
* Gets the partition keys
* Creates a new, indexed FileDataset

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

You can also create a new partitions structure for TabularDatasets with the [partition_by()](/python/api/azureml-core/azureml.data.tabulardataset#azureml-data-tabulardataset-partition-by) method.

```Python

 dataset = Dataset.get_by_name('test') # indexed by country, state, partition_date

# call partition_by locally
new_dataset = ds.partition_by(name="repartitioned_ds", partition_keys=['country'], target=DataPath(datastore, "repartition"))
partition_keys = new_dataset.partition_keys # ['country']
```

## Explore data

After you wrangle your data, you can [register](#register-datasets) your dataset, and then load it into your notebook for data exploration before model training.

For FileDatasets, you can either **mount** or **download** your dataset, and apply the Python libraries you'd normally use for data exploration. For more information, visit [Learn more about mount vs download](how-to-train-with-datasets.md#mount-vs-download).

```python
# download the dataset 
dataset.download(target_path='.', overwrite=False) 

# mount dataset to the temp directory at `mounted_path`

import tempfile
mounted_path = tempfile.mkdtemp()
mount_context = dataset.mount(mounted_path)

mount_context.start()
```

For TabularDatasets, use the [`to_pandas_dataframe()`](/python/api/azureml-core/azureml.data.tabulardataset#azureml-data-tabulardataset-to-pandas-dataframe) method to view your data in a dataframe.

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

To create a TabularDataset from an in-memory pandas dataframe, use the [`register_pandas_dataframe()`](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#azureml-data-datset-factory-tabulardatasetfactory-register-pandas-dataframe) method. This method registers the TabularDataset to the workspace and uploads data to your underlying storage. This process incurs storage costs.

```python
from azureml.core import Workspace, Datastore, Dataset
import pandas as pd

pandas_df = pd.read_csv('<path to your csv file>')
ws = Workspace.from_config()
datastore = Datastore.get(ws, '<name of your datastore>')
dataset = Dataset.Tabular.register_pandas_dataframe(pandas_df, datastore, "dataset_from_pandas_df", show_progress=True)

```
> [!TIP]
> Create and register a TabularDataset from an in memory spark dataframe or a dask dataframe with the public preview methods, [`register_spark_dataframe()`](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#azureml-data-dataset-factory-tabulardatasetfactory-register-spark-dataframe) and [`register_dask_dataframe()`](/python/api/azureml-core/azureml.data.dataset_factory.tabulardatasetfactory#azureml-data-dataset-factory-tabulardatasetfactory-register-dask-dataframe). These methods are [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview features, and may change at any time.
>  
> These methods upload data to your underlying storage, and as a result incur storage costs.

## Register datasets

To complete the creation process, register your datasets with a workspace. Use the [`register()`](/python/api/azureml-core/azureml.data.abstract_dataset.abstractdataset#azureml-data-abstract-dataset-abstractdataset-register) method to register datasets with your workspace, to share them with others and reuse them across experiments in your workspace:

```Python
titanic_ds = titanic_ds.register(workspace=workspace,
                                 name='titanic_ds',
                                 description='titanic training data')
```

## Create datasets using Azure Resource Manager

You can find many templates at [microsoft.machinelearningservices](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices) that can be used to create datasets.

For information about these templates, visit [Use an Azure Resource Manager template to create a workspace for Azure Machine Learning](../how-to-create-workspace-template.md).

## Train with datasets

Use your datasets in your machine learning experiments for training ML models. [Learn more about how to train with datasets](how-to-train-with-datasets.md).

## Version datasets

You can register a new dataset under the same name by creating a new version. A dataset version can bookmark the state of your data, to apply a specific version of the dataset for experimentation or future reproduction. For more information, visit [dataset versions](how-to-version-track-datasets.md).

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

* Learn [how to train with datasets](how-to-train-with-datasets.md)
* Use automated machine learning to [train with TabularDatasets](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-energy-demand/auto-ml-forecasting-energy-demand.ipynb)
* For more dataset training examples, see the [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/work-with-data/)