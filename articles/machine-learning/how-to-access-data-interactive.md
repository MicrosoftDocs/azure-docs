---
title: Access data from Azure cloud storage during interactive development
titleSuffix: Azure Machine Learning
description: Access data from Azure cloud storage during interactive development
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: samuel100
ms.author: samkemp
ms.reviewer: franksolomon
ms.date: 11/17/2022
ms.custom: sdkv2
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Access data from Azure cloud storage during interactive development

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

Typically the beginning of a machine learning project involves exploratory data analysis (EDA), data-preprocessing (cleaning, feature engineering), and building prototypes of ML models to validate hypotheses. This *prototyping* phase of the project is highly interactive in nature that lends itself to developing in a Jupyter notebook or an IDE with a *Python interactive console*. In this article you'll learn how to:

> [!div class="checklist"]
> * Access data from a Azure Machine Learning Datastores URI as if it were a file system.
> * Materialize data into Pandas using `mltable` Python library.
> * Materialize Azure Machine Learning data assets into Pandas using `mltable` Python library.
> * Materialize data through an explicit download with the `azcopy` utility.

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Manage Azure Machine Learning workspaces in the portal or with the Python SDK (v2)](how-to-manage-workspace.md).
* An Azure Machine Learning Datastore. For more information, see [Create datastores](how-to-datastore.md).

> [!TIP]
> The guidance in this article to access data during interactive development applies to any host that can run a Python session - for example: your local machine, a cloud VM, a GitHub Codespace, etc. We recommend using an Azure Machine Learning compute instance - a fully managed and pre-configured cloud workstation. For more information, see [Create and manage an Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md).

> [!IMPORTANT]
> Ensure you have the latest `azure-fsspec` and `mltable` python libraries installed in your python environment:
> 
> ```bash
> pip install -U azureml-fsspec mltable
> ```

## Access data from a datastore URI, like a filesystem


An Azure Machine Learning datastore is a *reference* to an *existing* storage account on Azure. The benefits of creating and using a datastore include:

> [!div class="checklist"]
> * A common and easy-to-use API to interact with different storage types (Blob/Files/ADLS).
> * Easier to discover useful datastores when working as a team.
> * Supports both credential-based (for example, SAS token) and identity-based (use Azure Active Directory or Manged identity) to access data.
> * When using credential-based access, the connection information is secured so you don't expose keys in scripts.
> * Browse data and copy-paste datastore URIs in the Studio UI.

A *Datastore URI* is a Uniform Resource Identifier, which is a *reference* to a storage *location* (path) on your Azure storage account. The format of the datastore URI is:

```python
# Azure Machine Learning workspace details:
subscription = '<subscription_id>'
resource_group = '<resource_group>'
workspace = '<workspace>'
datastore_name = '<datastore>'
path_on_datastore '<path>'

# long-form Datastore uri format:
uri = f'azureml://subscriptions/{subscription}/resourcegroups/{resource_group}/workspaces/{workspace}/datastores/{datastore_name}/paths/{path_on_datastore}'. 
```

These Datastore URIs are a known implementation of [Filesystem spec](https://filesystem-spec.readthedocs.io/en/latest/index.html) (`fsspec`): A unified pythonic interface to local, remote and embedded file systems and bytes storage.
You can pip install the `azureml-fsspec`package and its dependency `azureml-dataprep` package. And then you can use the Azure Machine Learning Datastore implementation of `fsspec`.

The Azure Machine Learning Datastore implementation of `fsspec` automatically handles credential/identity passthrough used by the Azure Machine Learning datastore. This means you don't need to expose account keys in your scripts or do additional sign-in procedures on a compute instance.


For example, you can directly use Datastore URIs in Pandas - below is an example of reading a CSV file:

```python
import pandas as pd

df = pd.read_csv("azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<workspace_name>/datastores/<datastore_name>/paths/<folder>/<filename>.csv")
df.head()
``` 

> [!TIP]
> Rather than remember the datastore URI format, you can copy-and-paste the datastore URI from the Studio UI by following these steps:
> 1. Select **Data** from the left-hand menu followed by the **Datastores** tab. 
> 1. Select your datastore name and then **Browse**. 
> 1. Find the file/folder you want to read into pandas, select the elipsis (**...**) next to it. Select from the menu **Copy URI**. You can select the **Datastore URI** to copy into your notebook/script.
> :::image type="content" source="media/how-to-access-data-ci/datastore_uri_copy.png" alt-text="Screenshot highlighting the copy of the datastore URI.":::

You can also instantiate an Azure Machine Learning filesystem and do filesystem-like commands like `ls`, `glob`, `exists`, `open`.
- The `ls()` method can be used to list files in the corresponding directory. You can use ls(), ls(.), ls (<<folder_level_1>/<folder_level_2>) to list files. We support both '.' and '..' in relative paths.
- The `glob()` method supports '*' and '**' globbing.
- The `exists()` method returns a Boolean value that indicates whether a specified file exists in current root directory. 
- The `open()` method will return a file-like object, which can be passed to any other library that expects to work with python files, or used by your own code as you would a normal python file object. These file-like objects respect the use of `with` contexts, for example:

```python
from azureml.fsspec import AzureMachineLearningFileSystem

# instantiate file system using following URI
fs = AzureMachineLearningFileSystem('azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<workspace_name>/datastore/datastorename')

fs.ls() # list folders/files in datastore 'datastorename'

# output example:
# folder1
# folder2
# file3.csv

# use an open context
with fs.open('./folder1/file1.csv') as f:
    # do some process
    process_file(f)
```

### Upload files via AzureMachineLearningFileSystem

```python
from azureml.fsspec import AzureMachineLearningFileSystem
# instantiate file system using following URI
fs = AzureMachineLearningFileSystem('azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<workspace_name>/datastore/datastorename')

# you can specify recursive as False to upload a file
fs.upload(lpath='data/upload_files/crime-spring.csv', rpath='data/fsspec', recursive=False, **{'overwrite': 'MERGE_WITH_OVERWRITE'})

# you need to specify recursive as True to upload a folder
fs.upload(lpath='data/upload_folder/', rpath='data/fsspec_folder', recursive=True, **{'overwrite': 'MERGE_WITH_OVERWRITE'})
```
`lpath` is the local path, and `rpath` is the remote path.
If the folders you specify in `rpath` do not exist yet, we will create the folders for you.

We support 3 modes for 'overwrite':
- APPEND: if there is already a file with the same name in the destination path, will keep the original file
- FAIL_ON_FILE_CONFLICT: if there is already a file with the same name in the destination path, will throw an error
- MERGE_WITH_OVERWRITE: if there is already a file with the same name in the destination path, will overwrite with the new file

### Download files via AzureMachineLearningFileSystem
```python
# you can specify recursive as False to download a file
# downloading overwrite option is determined by local system, and it is MERGE_WITH_OVERWRITE
fs.download(rpath='data/fsspec/crime-spring.csv', lpath='data/download_files/, recursive=False)

# you need to specify recursive as True to download a folder
fs.download(rpath='data/fsspec_folder', lpath='data/download_folder/', recursive=True)
```

### Examples

In this section we provide some examples of how to use Filesystem spec, for some common scenarios.

#### Read a single CSV file into pandas

If you have a *single* CSV file, then as outlined above you can read that into pandas with:

```python
import pandas as pd

df = pd.read_csv("azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<workspace_name>/datastores/<datastore_name>/paths/<folder>/<filename>.csv")
```

#### Read a folder of CSV files into pandas

The Pandas `read_csv()` method doesn't support reading a folder of CSV files. You need to glob csv paths and concatenate them to a data frame using Pandas `concat()` method. The code below demonstrates how to achieve this concatenation with the Azure Machine Learning filesystem:

```python
import pandas as pd
from azureml.fsspec import AzureMachineLearningFileSystem

# define the URI - update <> placeholders
uri = 'azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<workspace_name>/datastores/<datastore_name>'

# create the filesystem
fs = AzureMachineLearningFileSystem(uri)

# append csv files in folder to a list
dflist = []
for path in fs.glob('/<folder>/*.csv'):
    with fs.open(path) as f:
        dflist.append(pd.read_csv(f))

# concatenate data frames
df = pd.concat(dflist)
df.head()
```

#### Reading CSV files into Dask

Below is an example of reading a CSV file into a Dask data frame:

```python
import dask.dd as dd

df = dd.read_csv("azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<workspace_name>/datastores/<datastore_name>/paths/<folder>/<filename>.csv")
df.head()
``` 

#### Read a folder of parquet files into pandas
Parquet files are typically written to a folder as part of an ETL process, which can emit files pertaining to the ETL such as progress, commits, etc. Below is an example of files created from an ETL process (files beginning with `_`) to produce a parquet file of data.

:::image type="content" source="media/how-to-access-data-ci/parquet-auxillary.png" alt-text="Screenshot showing the parquet etl process.":::

In these scenarios, you'll only want to read the parquet files in the folder and ignore the ETL process files. The code below shows how you can use glob patterns to read only parquet files in a folder:

```python
import pandas as pd
from azureml.fsspec import AzureMachineLearningFileSystem

# define the URI - update <> placeholders
uri = 'azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<workspace_name>/datastores/<datastore_name>'

# create the filesystem
fs = AzureMachineLearningFileSystem(uri)

# append parquet files in folder to a list
dflist = []
for path in fs.glob('/<folder>/*.parquet'):
    with fs.open(path) as f:
        dflist.append(pd.read_parquet(f))

# concatenate data frames
df = pd.concat(dflist)
df.head()
```

#### Accessing data from your Azure Databricks filesystem (`dbfs`)

Filesystem spec (`fsspec`) has a range of [known implementations](https://filesystem-spec.readthedocs.io/en/stable/_modules/index.html), one of which is the Databricks Filesystem (`dbfs`).

To access data from `dbfs` you will need:

- **Instance name**, which is in the form of `adb-<some-number>.<two digits>.azuredatabricks.net`. You can glean this from the URL of your Azure Databricks workspace.
- **Personal Access Token (PAT)**, for more information on creating a PAT, please see [Authentication using Azure Databricks personal access tokens](/azure/databricks/dev-tools/api/latest/authentication)

Once you have these, you will need to create an environment variable on your compute instance for the PAT token:

```bash
export ADB_PAT=<pat_token>
```

You can then access data in Pandas using:

```python
import os
import pandas as pd

pat = os.getenv(ADB_PAT)
path_on_dbfs = '<absolute_path_on_dbfs>' # e.g. /folder/subfolder/file.csv

storage_options = {
    'instance':'adb-<some-number>.<two digits>.azuredatabricks.net', 
    'token': pat
}

df = pd.read_csv(f'dbfs://{path_on_dbfs}', storage_options=storage_options)
```

#### Reading images with `pillow`

```python
from PIL import Image
from azureml.fsspec import AzureMachineLearningFileSystem

# define the URI - update <> placeholders
uri = 'azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<workspace_name>/datastores/<datastore_name>'

# create the filesystem
fs = AzureMachineLearningFileSystem(uri)

with fs.open('/<folder>/<image.jpeg>') as f:
    img = Image.open(f)
    img.show(）
```

#### PyTorch custom dataset example

In this example, you create a PyTorch custom dataset for processing images. The assumption is that an annotations file (in CSV format) exists that looks like:

```text
image_path, label
0/image0.png, label0
0/image1.png, label0
1/image2.png, label1
1/image3.png, label1
2/image4.png, label2
2/image5.png, label2
```

The images are stored in subfolders according to their label:

```text
/
└── 📁images
    ├── 📁0
    │   ├── 📷image0.png
    │   └── 📷image1.png
    ├── 📁1
    │   ├── 📷image2.png
    │   └── 📷image3.png
    └── 📁2
        ├── 📷image4.png
        └── 📷image5.png
```

A custom Dataset class in PyTorch must implement three functions: `__init__`, `__len__`, and `__getitem__`, which are implemented below:

```python
import os
import pandas as pd
from PIL import Image
from torch.utils.data import Dataset

class CustomImageDataset(Dataset):
    def __init__(self, filesystem, annotations_file, img_dir, transform=None, target_transform=None):
        self.fs = filesystem
        f = filesystem.open(annotations_file)
        self.img_labels = pd.read_csv(f)
        f.close()
        self.img_dir = img_dir
        self.transform = transform
        self.target_transform = target_transform

    def __len__(self):
        return len(self.img_labels)

    def __getitem__(self, idx):
        img_path = os.path.join(self.img_dir, self.img_labels.iloc[idx, 0])
        f = self.fs.open(img_path)
        image = Image.open(f)
        f.close()
        label = self.img_labels.iloc[idx, 1]
        if self.transform:
            image = self.transform(image)
        if self.target_transform:
            label = self.target_transform(label)
        return image, label
```

You can then instantiate the dataset using:

```python
from azureml.fsspec import AzureMachineLearningFileSystem
from torch.utils.data import DataLoader

# define the URI - update <> placeholders
uri = 'azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<workspace_name>/datastores/<datastore_name>'

# create the filesystem
fs = AzureMachineLearningFileSystem(uri)

# create the dataset
training_data = CustomImageDataset(
    filesystem=fs,
    annotations_file='/annotations.csv', 
    img_dir='/<path_to_images>/'
)

# Preparing your data for training with DataLoaders
train_dataloader = DataLoader(training_data, batch_size=64, shuffle=True)
```

## Materialize data into Pandas using `mltable` library

Another method for accessing data in cloud storage is to use the `mltable` library. The general format for reading data into pandas using `mltable` is:

```python
import mltable

# define a path or folder or pattern
path = {
    'file': '<supported_path>'
    # alternatives
    # 'folder': '<supported_path>'
    # 'pattern': '<supported_path>'
}

# create an mltable from paths
tbl = mltable.from_delimited_files(paths=[path])
# alternatives
# tbl = mltable.from_parquet_files(paths=[path])
# tbl = mltable.from_json_lines_files(paths=[path])
# tbl = mltable.from_delta_lake(paths=[path])

# materialize to pandas
df = tbl.to_pandas_dataframe()
df.head()
```

### Supported paths

You'll notice the `mltable` library supports reading tabular data from different path types:

|Location  | Examples  |
|---------|---------|
|A path on your local computer     | `./home/username/data/my_data`         |
|A path on a public http(s) server    |  `https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv`    |
|A path on Azure Storage     |   `wasbs://<container_name>@<account_name>.blob.core.windows.net/<path>` <br> `abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>`    |
|A long-form Azure Machine Learning datastore  |   `azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<wsname>/datastores/<name>/paths/<path>`      |

> [!NOTE]
> `mltable` does user credential passthrough for paths on Azure Storage and Azure Machine Learning datastores. If you do not have permission to the data on the underlying storage then you will not be able to access the data.

### Files, folders and globs

`mltable` supports reading from:

- file(s), for example: `abfss://<file_system>@<account_name>.dfs.core.windows.net/my-csv.csv`
- folder(s), for example `abfss://<file_system>@<account_name>.dfs.core.windows.net/my-folder/`
- [glob](https://wikipedia.org/wiki/Glob_(programming)) pattern(s), for example `abfss://<file_system>@<account_name>.dfs.core.windows.net/my-folder/*.csv`
- Or, a combination of files, folders, globbing patterns

The flexibility of `mltable` allows you to materialize data into a single dataframe from a combination of local/cloud storage and combinations of files/folder/globs. For example:

```python
path1 = {
    'file': 'abfss://filesystem@account1.dfs.core.windows.net/my-csv.csv'
}

path2 = {
    'folder': './home/username/data/my_data'
}

path3 = {
    'pattern': 'abfss://filesystem@account2.dfs.core.windows.net/folder/*.csv'
}

tbl = mltable.from_delimited_files(paths=[path1, path2, path3])
```

### Supported file formats
`mltable` supports the following file formats:

- Delimited Text (for example: CSV files): `mltable.from_delimited_files(paths=[path])`
- Parquet: `mltable.from_parquet_files(paths=[path])`
- Delta: `mltable.from_delta_lake(paths=[path])`
- JSON lines format: `mltable.from_json_lines_files(paths=[path])`

### Examples

#### Read a CSV file

##### [ADLS gen2](#tab/adls)

Update the placeholders (`<>`) in the code snippet with your details.

```python
import mltable

path = {
    'file': 'abfss://<filesystem>@<account>.dfs.core.windows.net/<folder>/<file_name>.csv'
}

tbl = mltable.from_delimited_files(paths=[path])
df = tbl.to_pandas_dataframe()
df.head()
```

##### [Blob storage](#tab/blob)

Update the placeholders (`<>`) in the code snippet with your details.

```python
import mltable

path = {
    'file': 'wasbs://<container>@<account>.blob.core.windows.net/<folder>/<file_name>.csv'
}

tbl = mltable.from_delimited_files(paths=[path])
df = tbl.to_pandas_dataframe()
df.head()
```

##### [Azure Machine Learning Datastore](#tab/datastore)

Update the placeholders (`<>`) in the code snippet with your details.

```python
import mltable

path = {
    'file': 'azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<wsname>/datastores/<name>/paths/<folder>/<file>.csv'
}

tbl = mltable.from_delimited_files(paths=[path])
df = tbl.to_pandas_dataframe()
df.head()
```

> [!TIP]
> Rather than remember the datastore URI format, you can copy-and-paste the datastore URI from the Studio UI by following these steps:
> 1. Select **Data** from the left-hand menu followed by the **Datastores** tab. 
> 1. Select your datastore name and then **Browse**. 
> 1. Find the file/folder you want to read into pandas, select the elipsis (**...**) next to it. Select from the menu **Copy URI**. You can select the **Datastore URI** to copy into your notebook/script.
> :::image type="content" source="media/how-to-access-data-ci/datastore_uri_copy.png" alt-text="Screenshot highlighting the copy of the datastore URI.":::

##### [HTTP Server](#tab/http)
```python
import mltable

path = {
    'file': 'https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv'
}

tbl = mltable.from_delimited_files(paths=[path])
df = tbl.to_pandas_dataframe()
df.head()
```

---

#### Read parquet files in a folder
The example code below shows how `mltable` can use [glob](https://wikipedia.org/wiki/Glob_(programming)) patterns - such as wildcards - to ensure only the parquet files are read. 

##### [ADLS gen2](#tab/adls)

Update the placeholders (`<>`) in the code snippet with your details.

```python
import mltable

path = {
    'pattern': 'abfss://<filesystem>@<account>.dfs.core.windows.net/<folder>/*.parquet'
}

tbl = mltable.from_parquet_files(paths=[path])
df = tbl.to_pandas_dataframe()
df.head()
```

##### [Blob storage](#tab/blob)

Update the placeholders (`<>`) in the code snippet with your details.

```python
import mltable

path = {
    'pattern': 'wasbs://<container>@<account>.blob.core.windows.net/<folder>/*.parquet'
}

tbl = mltable.from_delimited_files(paths=[path])
df = tbl.to_pandas_dataframe()
df.head()
```

##### [Azure Machine Learning Datastore](#tab/datastore)

Update the placeholders (`<>`) in the code snippet with your details.

```python
import mltable

path = {
    'pattern': 'azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<wsname>/datastores/<name>/paths/<folder>/*.parquet'
}

tbl = mltable.from_parquet_files(paths=[path])
df = tbl.to_pandas_dataframe()
df.head()
```

> [!TIP]
> Rather than remember the datastore URI format, you can copy-and-paste the datastore URI from the Studio UI by following these steps:
> 1. Select **Data** from the left-hand menu followed by the **Datastores** tab. 
> 1. Select your datastore name and then **Browse**. 
> 1. Find the file/folder you want to read into pandas, select the elipsis (**...**) next to it. Select from the menu **Copy URI**. You can select the **Datastore URI** to copy into your notebook/script.
> :::image type="content" source="media/how-to-access-data-ci/datastore_uri_copy.png" alt-text="Screenshot highlighting the copy of the datastore URI.":::

##### [HTTP Server](#tab/http)

Update the placeholders (`<>`) in the code snippet with your details.

> [!IMPORTANT]
> To glob the pattern on a public HTTP server, there must be access at the **folder** level.

```python
import mltable

path = {
    'pattern': '<https_address>/<folder>/*.parquet'
}

tbl = mltable.from_parquet_files(paths=[path])
df = tbl.to_pandas_dataframe()
df.head()
```

---

### Reading data assets
In this section, you'll learn how to access your Azure Machine Learning data assets into pandas.

#### Table asset

If you've previously created a Table asset in Azure Machine Learning (an `mltable`, or a V1 `TabularDataset`), you can load that into pandas using:

```python
import mltable
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

ml_client = MLClient.from_config(credential=DefaultAzureCredential())
data_asset = ml_client.data.get(name="<name_of_asset>", version="<version>")

tbl = mltable.load(f'azureml:/{data_asset.id}')
df = tbl.to_pandas_dataframe()
df.head()
```

#### File asset

If you've registered a File asset that you want to read into Pandas data frame - for example, a CSV file - you can achieve this using:

```python
import mltable
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

ml_client = MLClient.from_config(credential=DefaultAzureCredential())
data_asset = ml_client.data.get(name="<name_of_asset>", version="<version>")

path = {
    'file': data_asset.path
}

tbl = mltable.from_delimited_files(paths=[path])
df = tbl.to_pandas_dataframe()
df.head()
```

#### Folder asset

If you've registered a Folder asset (`uri_folder` or a V1 `FileDataset`) that you want to read into Pandas data frame - for example, a folder containing CSV file - you can achieve this using:

```python
import mltable
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

ml_client = MLClient.from_config(credential=DefaultAzureCredential())
data_asset = ml_client.data.get(name="<name_of_asset>", version="<version>")

path = {
    'folder': data_asset.path
}

tbl = mltable.from_delimited_files(paths=[path])
df = tbl.to_pandas_dataframe()
df.head()
```

## A note on reading and processing large data volumes with Pandas
> [!TIP]
> Pandas is not designed to handle large datasets - you will only be able to process data that can fit into the memory of the compute instance. 
>
> For large datasets we recommend that you use Azure Machine Learning managed Spark, which provides the [PySpark Pandas API](https://spark.apache.org/docs/latest/api/python/user_guide/pandas_on_spark/index.html).

You may wish to iterate quickly on a smaller subset of a large dataset before scaling up to a remote asynchronous job. `mltable` provides in-built functionality to get samples of large data using the [take_random_sample](/python/api/mltable/mltable.mltable.mltable#mltable-mltable-mltable-take-random-sample) method:

```python
import mltable

path = {
    'file': 'https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv'
}

tbl = mltable.from_delimited_files(paths=[path])
# take a random 30% sample of the data
tbl = tbl.take_random_sample(probability=.3)
df = tbl.to_pandas_dataframe()
df.head()
```

You can also take subsets of large data by using:

- [filter](/python/api/mltable/mltable.mltable.mltable#mltable-mltable-mltable-filter)
- [keep_columns](/python/api/mltable/mltable.mltable.mltable#mltable-mltable-mltable-keep-columns)
- [drop_columns](/python/api/mltable/mltable.mltable.mltable#mltable-mltable-mltable-drop-columns)


## Downloading data using the `azcopy` utility

You may want to download the data to the local SSD of your host (local machine, cloud VM, Azure Machine Learning Compute Instance) and use the local filesystem. You can do this with the `azcopy` utility, which is pre-installed on an Azure Machine Learning compute instance.  If you are **not** using an Azure Machine Learning compute instance or a Data Science Virtual Machine (DSVM), you may need to install `azcopy`. For more information please read [azcopy](../storage/common/storage-ref-azcopy.md).

> [!CAUTION]
> We do not recommend downloading data in the `/home/azureuser/cloudfiles/code` location on a compute instance. This is designed to store notebook and code artifacts, **not** data. Reading data from this location will incur significant performance overhead when training. Instead we recommend storing your data in `home/azureuser`, which is the local SSD of the compute node.

Open a terminal and create a new directory, for example:

```bash
mkdir /home/azureuser/data
```

Sign-in to azcopy using:

```bash
azcopy login
```

Next, you can copy data using a storage URI

```bash
SOURCE=https://<account_name>.blob.core.windows.net/<container>/<path>
DEST=/home/azureuser/data
azcopy cp $SOURCE $DEST
```

## Next steps

- [Interactive Data Wrangling with Apache Spark in Azure Machine Learning (preview)](interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Access data in a job](how-to-read-write-data-v2.md)
