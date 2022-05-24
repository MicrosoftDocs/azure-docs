---
title: Create Azure Machine Learning data assets
titleSuffix: Azure Machine Learning
description: Learn how to create Azure Machine Learning data assets to access your data for machine learning experiment runs.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.custom: contperf-fy21q1, data4ml, sdkv1
ms.author: xunwan
author: xunwan
ms.reviewer: nibaccam
ms.date: 05/11/2022

# Customer intent: As an experienced data scientist, I need to package my data into a consumable and reusable object to train my machine learning models.

---

# Create Azure Machine Learning data assets

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning SDK you are using:"]
> * [v1](./v1/how-to-create-register-datasets.md)
> * [v2 (current version)](how-to-create-register-datasets.md)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]
[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

In this article, you learn how to create Azure Machine Learning Data to access data for your local or remote experiments with the Azure Machine Learning SDK V2 and CLI V2. To understand where Data fits in Azure Machine Learning's overall data access workflow, see the [Work with Data](concept-data.md) article.

By creating a Data asset, you create a reference to the data source location, along with a copy of its metadata. Because the data remains in its existing location, you incur no extra storage cost, and don't risk the integrity of your data sources. Also Data assets are lazily evaluated, which aids in workflow performance speeds. You can create Data from Datastores, Azure Storage, public URLs, and local files.

With Azure Machine Learning Data assets, you can:

* Easy to share with other members of the team (no need to remember file locations)

* Seamlessly access data during model training without worrying about connection strings or data paths.

* Can refer to the Data by short Entity name in Azure ML



## Prerequisites

To create and work with Data assets, you need:

* An Azure subscription. If you don't have one, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An [Azure Machine Learning workspace](how-to-manage-workspace.md).

* The [Azure Machine Learning CLI/SDK installed](how-to-configure-cli.md) and MLTable package installed.

    * Create an [Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md), which is a fully configured and managed development environment that includes integrated notebooks and the SDK already installed.

    **OR**

    * Work on your own Jupyter notebook and install the CLI/SDK and required packages.

> [!IMPORTANT]
> While the package may work on older versions of Linux distros, we do not recommend using a distro that is out of mainstream support. Distros that are out of mainstream support may have security vulnerabilities, as they do not receive the latest updates. We recommend using the latest supported version of your distro that is compatible with .

## Compute size guidance

When creating a Data asset, review your compute processing power and the size of your data in memory. The size of your data in storage isn't the same as the size of data in a dataframe. For example, data in CSV files can expand up to 10x in a dataframe, so a 1-GB CSV file can become 10 GB in a dataframe. 

If your data is compressed, it can expand further; 20 GB of relatively sparse data stored in compressed parquet format can expand to ~400 GB in memory.

[Learn more about optimizing data processing in Azure Machine Learning](concept-optimize-data-processing.md).

## Data types

Azure Machine Learning allows you to work with different types of data. Your data can be local or in the cloud (from a registered Azure ML Datastore, a common Azure Storage URL or a public data url). In this article, you'll learn about using the Python SDK V2 and CLI V2 to work with _URIs_ and _Tables_. URIs reference a location either local to your development environment or in the cloud. Tables are a tabular data abstraction.

For most scenarios, you could use URIs (`uri_folder` and `uri_file`). A URI references a location in storage that can be easily mapped to the filesystem of a compute node when you run a job. The data is accessed by either mounting or downloading the storage to the node.

When using tables, you could use `mltable`. It's an abstraction for tabular data that is used for AutoML jobs, parallel jobs, and some advanced scenarios. If you're just starting to use Azure Machine Learning, and aren't using AutoML, we strongly encourage you to begin with URIs.

If you're creating Azure ML Data asset from an existing Datastore:

1. Verify that you have `contributor` or `owner` access to the underlying storage service of your registered Azure Machine Learning datastore. [Check your storage account permissions in the Azure portal](/azure/role-based-access-control/check-access).

1. Create the data asset by referencing paths in the datastore. You can create a Data asset from multiple paths in multiple datastores. There's no hard limit on the number of files or data size that you can create a data asset from. 

> [!NOTE]
> For each data path, a few requests will be sent to the storage service to check whether it points to a file or a folder. This overhead may lead to degraded performance or failure. A Data asset referencing one folder with 1000 files inside is considered referencing one data path. We recommend creating Data asset referencing less than 100 paths in datastores for optimal performance.

> [!TIP] 
> You can create Data asset with identity-based data access. If you don't provide any credentials, we will use your identity by default.


> [!TIP]
> If you have dataset assets created using the SDK v1, you can still use those with SDK v2. For more information, see the [Consuming V1 Dataset Assets in V2](how-to-read-write-data-v2.md) section.



## URIs

The code snippets in this section cover the following scenarios:
* Registering data as an asset in Azure Machine Learning
* Reading registered data assets from Azure Machine Learning in a job

These snippets use `uri_file` and `uri_folder`.

- `uri_file` is a type that refers to a specific file. For example, `'https://<account_name>.blob.core.windows.net/<container_name>/path/file.csv'`.
- `uri_folder` is a type that refers to a specific folder. For example, `'https://<account_name>.blob.core.windows.net/<container_name>/path'`. 

> [!TIP]
> We recommend using an argument parser to pass folder information into _data-plane_ code. By data-plane code, we mean your data processing and/or training code that you run in the cloud. The code that runs in your development environment and submits code to the data-plane is _control-plane_ code.
>
> Data-plane code is typically a Python script, but can be any programming language. Passing the folder as part of job submission allows you to easily adjust the path from training locally using local data, to training in the cloud. 
> If you wanted to pass in just an individual file rather than the entire folder you can use the `uri_file` type.

For a complete example, see the [working_with_uris.ipynb notebook](https://github.com/Azure/azureml-examples/blob/samuel100/mltable/sdk/assets/data/working_with_uris.ipynb).


### Register data as URI Folder type Data

# [Python-SDK](#tab/Python-SDK)
```python
from azure.ai.ml.entities import Data
from azure.ai.ml._constants import AssetTypes

# select one from:
my_path = 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>' # adls gen2
my_path = 'https://<account_name>.blob.core.windows.net/<container_name>/path' # blob

my_data = Data(
    path=my_path,
    type=AssetTypes.URI_FOLDER,
    description="description here",
    name="a_name",
    version='1'
)

ml_client.data.create_or_update(my_data)
```
# [CLI](#tab/CLI)
You can also use CLI to register a URI Folder type Data as below example.

```azurecli
az ml data create -f <file-name>.yml
```

Sample `YAML` file `<file-name>.yml` for local path is as below:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
name: uri_folder_my_data
description: Local data asset will be created as URI folder type Data in Azure ML.
path: path
```

Sample `YAML` file `<file-name>.yml` for data folder in an existing Azure ML Datastore is as below:
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
name: uri_folder_my_data
description:  Datastore data asset will be created as URI folder type Data in Azure ML.
type: uri_folder
path: azureml://datastores/workspaceblobstore/paths/example-data/
```
   
Sample `YAML` file `<file-name>.yml` for data folder in storage url is as below:
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
name: cloud_file_wasbs_example
description: Data asset created from folder in cloud using wasbs URL.
type: uri_folder
path: wasbs://mainstorage9c05dabf5c924.blob.core.windows.net/azureml-blobstore-54887b46-3cb0-485b-bb15-62e7b5578ee6/example-data/
```
---

### Consume registered URI Folder data assets in job

```python
from azure.ai.ml.entities import Data, UriReference, JobInput, CommandJob
from azure.ai.ml._constants import AssetTypes

registered_data_asset = ml_client.data.get(name='titanic', version='1')

my_job_inputs = {
    "input_data": JobInput(
        type=AssetTypes.URI_FOLDER,
        path=registered_data_asset.id
    )
}

job = CommandJob(
    code="./src", 
    command='python read_data_asset.py --input_folder ${{inputs.input_data}}',
    inputs=my_job_inputs,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:9",
    compute="cpu-cluster"
)

#submit the command job
returned_job = ml_client.create_or_update(job)
#get a URL for the status of the job
returned_job.services["Studio"].endpoint
```
   
### Register data as URI File type Data
# [Python-SDK](#tab/Python-SDK)
```python
from azure.ai.ml.entities import Data
from azure.ai.ml._constants import AssetTypes

# select one from:
my_file_path = '<path>/<file>' # local
my_file_path = 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/<file>' # adls gen2
my_file_path = 'https://<account_name>.blob.core.windows.net/<container_name>/<path>/<file>' # blob

my_data = Data(
    path=my_file_path,
    type=AssetTypes.URI_FILE,
    description="description here",
    name="a_name",
    version='1'
)

ml_client.data.create_or_update(my_data)
```
# [CLI](#tab/CLI)
You can also use CLI to register a URI File type Data as below example.

```cli
> az ml data create -f <file-name>.yml
```
Sample `YAML` file `<file-name>.yml` for data in local path is as below:
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
name: uri_file_my_data
description: Local data asset will be created as URI folder type Data in Azure ML.
path: ./paths/example-data.csv
```

Sample `YAML` file `<file-name>.yml` for data in an existing Azure ML Datastore is as below:
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
name: uri_file_my_data
description:  Datastore data asset will be created as URI folder type Data in Azure ML.
type: uri_file
path: azureml://datastores/workspaceblobstore/paths/example-data.csv
```
   
Sample `YAML` file `<file-name>.yml` for data in storage url is as below:
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
name: cloud_file_wasbs_example
description: Data asset created from folder in cloud using wasbs URL.
type: uri_file
path: wasbs://mainstorage9c05dabf5c924.blob.core.windows.net/azureml-blobstore-54887b46-3cb0-485b-bb15-62e7b5578ee6/paths/example-data.csv
```
---
   
## MLTable

### Register data as MLTable type Data assets
Registering a `mltable` as an asset in Azure Machine Learning
You can register a `mltable` as a data asset in Azure Machine Learning. 

In the MLTable file, the path attribute supports any Azure ML supported URI format:

- a relative file: "file://foo/bar.csv"
- a short form entity URI: "azureml://datastores/foo/paths/bar/baz"
- a long form entity URI: "azureml://subscriptions/my-sub-id/resourcegroups/my-rg/workspaces/myworkspace/datastores/mydatastore/paths/path_to_data/"
- a storage URI: "https://", "wasbs://", "abfss://", "adl://"
- a public URI: "http://mypublicdata.com/foo.csv"


Below we show an example of versioning the sample data in this repo. The data is uploaded to cloud storage and registered as an asset.
# [Python-SDK](#tab/Python-SDK)
```python
from azure.ai.ml.entities import Data
from azure.ai.ml._constants import AssetTypes
import mltable

my_data = Data(
    path="./sample_data",
    type=AssetTypes.MLTABLE,
    description="Titanic Data",
    name="titanic-mltable",
    version='1'
)
 
ml_client.data.create_or_update(my_data)
```

> [!TIP]
> Whilst the above example shows a local file. Remember that path supports cloud storage (https, abfss, wasbs protocols). Therefore, if you want to register data in a > cloud location just specify the path with any of the supported protocols.

# [CLI](#tab/CLI)
You can also use CLI and following YAML that describes an MLTable to register MLTable Data.
```cli
> az ml data create -f <file-name>.yml
```
```yaml
paths: 
  - file: ./titanic.csv
transformations: 
  - read_delimited: 
      delimiter: ',' 
      encoding: 'ascii' 
      empty_as_string: false
      header: from_first_file
```
---
The contents of the MLTable file specify the underlying data location (here a local path) and also the transforms to perform on the underlying data before materializing into a pandas/spark/dask data frame. The important part here's that the MLTable-artifact doesn't have any absolute paths, making it *self-contained*. All the information stored in one folder; regardless of whether that folder is stored on your local drive or in your cloud drive or on a public http server.

To consume the data in a job or interactive session, use `mltable`:

```python
import mltable

tbl = mltable.load("./sample_data")
df = tbl.to_pandas_dataframe()
```

For a full example of using an MLTable, see the [Working with MLTable notebook](https://github.com/Azure/azureml-examples/blob/samuel100/mltable/sdk/assets/data/working_with_mltable.ipynb).
   

## mltable-artifact

Here the files that make up the mltable-artifact are stored on the user's local machine:

```
.
├── MLTable
└── iris.csv
```

The contents of the MLTable file specify the underlying data location (here a local path) and also the transforms to perform on the underlying data before materializing into a pandas/spark/dask data frame:

```yaml
#source ../configs/dataset/iris/MLTable
$schema: http://azureml/sdk-2-0/MLTable.json
type: mltable

paths:
  - file: ./iris.csv
transformations:
  - read_delimited:
      delimiter: ","
      encoding: ascii
      header: all_files_same_headers
```

The important part here is that the MLTable-artifact does have not have any absolute paths, hence it is self-contained and all that is needed is stored in that one folder; regardless of whether that folder is stored on your local drive or in your cloud drive or on a public http server.

This artifact file can be consumed in a command job as follows:

```yaml
#source ../configs/dataset/01-mltable-CommandJob.yaml
$schema: http://azureml/sdk-2-0/CommandJob.json

inputs:
  my_mltable_artifact:
    type: mltable
    # folder needs to contain an MLTable file
    mltable: file://iris

command: |
  python -c "
        from mltable import load 
        # load a table from a folder containing an MLTable file 
        tbl = load(${{my_mltable_artifact}}) 
        tbl.to_pandas_dataframe()
        ...
      "
```

> **For local files and folders**, only relative paths are supported. To be explicit, we will **not** support absolute paths as that would require us to change the MLTable file that is residing on disk before we move it to cloud storage.

You can put MLTable file and underlying data in the *same folder* but in a cloud object store. You can specify `mltable:` in their job that points to a location on a datastore that contains the MLTable file:

```yaml
#source ../configs/dataset/04-mltable-CommandJob.yaml
$schema: http://azureml/sdk-2-0/CommandJob.json

inputs:
  my_mltable_artifact:
    type: mltable
    mltable: azureml://datastores/some_datastore/paths/data/iris

command: |
  python -c " 
        from mltable import load
        # load a table from a folder containing an MLTable file 
        tbl = load(${{my_mltable_artifact}}) 
        tbl.to_pandas_dataframe()
        ...
      "
```

You can also has an MLTable file stored on their *local machine*, but no data files. The underlying data is stored on the cloud. In this case, the MLTable should reference the underlying data by means of an **absolute expression (i.e. a URI)**:

```
.
├── MLTable
```


```yaml
#source ../configs/dataset/iris-cloud/MLTable
$schema: http://azureml/sdk-2-0/MLTable.json
type: mltable

paths:
  - file: azureml://datastores/mydatastore/paths/data/iris.csv
transformations:
  - read_delimited:
      delimiter: ","
      encoding: ascii
      header: all_files_same_headers
```


### Supporting multiple files in a table
While above scenarios are creating rectangular data, it is also possible to create an mltable-artifact that just contains files:

```
.
└── MLTable
```

Where the contents of the MLTable file is:

```yaml
#source ../configs/dataset/multiple-files/MLTable
$schema: http://azureml/sdk-2-0/MLTable.json
type: mltable

# creating dataset from folder on cloud path.
paths: 
  - file: http://foo.com/1.csv
  - file: http://foo.com/2.csv
  - file: http://foo.com/3.csv
  - file: http://foo.com/4.csv
  - file: http://foo.com/5.csv
```

As outlined above, mltable can be created from a URI or a local folder path:

```yaml
#source ../configs/types/22_input_mldataset_artifacts-PipelineJob.yaml

$schema: http://azureml/sdk-2-0/PipelineJob.json

jobs:
  first:
    description: this job takes a mltable-artifact as input and mounts it.
      Note that the actual data could be in a different location

    inputs:
      mnist:
        type: mltable # redundant but there for clarity
        # needs to point to a folder that contains an MLTable file
        mltable: azureml://datastores/some_datastore/paths/data/public/mnist
        mode: ro_mount # or download

    command: |
      python -c " 
        import mltable as mlt
        # load a table from a folder containing an MLTable file 
        tbl = mlt.load('${{inputs.mnist}}') 
        tbl.list_files()
        ...
      "

  second:
    description: this job loads a table artifact from a local_path.
      Note that the folder needs to contain a well-formed MLTable file

    inputs:
      tbl_access_artifact:
        type: mltable
        mltable: file:./iris 
        mode: download

    command: |
      python -c " 
        import mltable as mlt
        # load a table from a folder containing an MLTable file 
        tbl = MLTable.load('${{inputs.tbl_access_artifact}}') 
        tbl.list_files()
        ...
      "
```

MLTable-artifacts can yield files that are not necessarily located in the `mltable`'s storage. Or it can **subset or shuffle** the data that resides in the storage using the `take_random_sample` transform for example. That view is only visible if the MLTable file is actually evaluated by the engine. The user can do that as described above by using the MLTable SDK by running `mltable.load` -- but that requires python and the installation of the SDK.

### Support globbing of files
Along with users being able to provide a `file` or `folder`, the MLTable artifact file will also allow customers to specify a *pattern* to do globbing of files:

```yaml
#source ../configs/dataset/parquet-artifact-search/MLTable
$schema: http://azureml/sdk-2-0/MLTable.json
type: mltable
paths:
  - pattern: parquet_files/*1.parquet # only get files with this specific pattern
transformations:
  - read_parquet:
      include_path_column: false
```



### Delimited text: Transformations
There are the following transformations that are *specific to delimited text*.

- `infer_column_types`: Boolean to infer column data types. Defaults to True. Type inference requires that the data source is accessible from current compute. Currently type inference will only pull first 200 rows. If the data contains multiple types of value, it is better to provide desired type as an override via `set_column_types` argument
- `encoding`: Specify the file encoding. Supported encodings are 'utf8', 'iso88591', 'latin1', 'ascii', 'utf16', 'utf32', 'utf8bom' and 'windows1252'. Defaults to utf8.
- header: user can choose one of the following options:
  - `no_header`
  - `from_first_file`
  - `all_files_different_headers`
  - `all_files_same_headers` (default)
- `delimiter`: The separator used to split columns.
- `empty_as_string`: Specify if empty field values should be loaded as empty strings. The default (False) will read empty field values as nulls. Passing this as True will read empty field values as empty strings. If the values are converted to numeric or datetime then this has no effect, as empty values will be converted to nulls.
- `include_path_column`: Boolean to keep path information as column in the table. Defaults to False. This is useful when reading multiple files, and want to know which file a particular record originated from, or to keep useful information in file path.
- `support_multi_line`: By default (support_multi_line=False), all line breaks, including those in quoted field values, will be interpreted as a record break. Reading data this way is faster and more optimized for parallel execution on multiple CPU cores. However, it may result in silently producing more records with misaligned field values. This should be set to True when the delimited files are known to contain quoted line breaks.

### Parquet files: Transforms
If user doesn't define options for `read_parquet` transformation, default options will be selected (see below).

- `include_path_column`: Boolean to keep path information as column in the table. Defaults to False. This is useful when reading multiple files, and want to know which file a particular record originated from, or to keep useful information in file path.

### Json lines: Transformations
Below are the supported transformations that are specific for json lines:

- `include_path` Boolean to keep path information as column in the MLTable. Defaults to False. This is useful when reading multiple files, and want to know which file a particular record originated from, or to keep useful information in file path.
- `invalid_lines` How to handle lines that are invalid JSON. Supported values are `error` and `drop`. Defaults to `error`.
- `encoding` Specify the file encoding. Supported encodings are `utf8`, `iso88591`, `latin1`, `ascii`, `utf16`, `utf32`, `utf8bom` and `windows1252`. Default is `utf8`.

## Global Transforms
As well as having transforms specific to the delimited text, parquet, Delta. There are other transforms that mltable-artifact files support:

- `take`: Takes the first *n* records of the table
- `take_random_sample`: Takes a random sample of the table where each record has a *probability* of being selected. The user can also include a *seed*.
- `skip`: This skips the first *n* records of the table
- `drop_columns`: Drops the specified columns from the table. This transform supports regex so that users can drop columns matching a particular pattern.
- `keep_columns`: Keeps only the specified columns in the table. This transform supports regex so that users can keep columns matching a particular pattern.
- `filter`: Filter the data, leaving only the records that match the specified expression. **NOTE: This will come post-GA as we need to define the filter query language**.
- `extract_partition_format_into_columns`: Specify the partition format of path. Defaults to None. The partition information of each path will be extracted into columns based on the specified format. Format part '{column_name}' creates string column, and '{column_name:yyyy/MM/dd/HH/mm/ss}' creates datetime column, where 'yyyy', 'MM', 'dd', 'HH', 'mm' and 'ss' are used to extract year, month, day, hour, minute and second for the datetime type. The format should start from the position of first partition key until the end of file path. For example, given the path '../Accounts/2019/01/01/data.csv' where the partition is by department name and time, partition_format='/{Department}/{PartitionDate:yyyy/MM/dd}/data.csv' creates a string column 'Department' with the value 'Accounts' and a datetime column 'PartitionDate' with the value '2019-01-01'.
Our principle here is to support transforms *specific to data delivery* and not to get into wider feature engineering transforms.


## Traits
The keen eyed among you may have spotted that `mltable` type supports a `traits` section. Traits define fixed characteristics of the table (i.e. they are **not** freeform metadata that users can add) and they do not perform any transformations but can be used by the engine.

- `index_columns`: Set the table index using existing columns. This trait can be used by partition_by in the data plane to split data by the index.
- `timestamp_column`: Defines the timestamp column of the table. This trait can be used in filter transforms, or in other data plane operations (SDK) such as drift detection.

Moreover, *in the future* we can use traits to define RAI aspects of the data, for example:

- `sensitive_columns`: Here the user can define certain columns that contain sensitive information.

Again, this is not a transform but is informing the system of some additional properties in the data.




## Next steps

* [Install and set up Python SDK v2 (preview)](https://aka.ms/sdk-v2-install)
* [Install and use the CLI (v2)](how-to-configure-cli.md)
* [Train models with the Python SDK v2 (preview)](how-to-train-sdk.md)
* [Tutorial: Create production ML pipelines with Python SDK v2 (preview)](tutorial-pipeline-python-sdk.md)
* Learn more about [Data in Azure Machine Learning](concept-data.md)
