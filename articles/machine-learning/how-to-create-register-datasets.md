---
title: Create Azure Machine Learning data assets
titleSuffix: Azure Machine Learning
description: Learn how to create Azure Machine Learning data assets to access your data for machine learning experiment runs.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.custom: contperf-fy21q1, data4ml, sdkv1, event-tier1-build-2022
ms.author: yogipandey
author: ynpandey
ms.reviewer: nibaccam
ms.date: 05/11/2022
#Customer intent: As an experienced data scientist, I need to package my data into a consumable and reusable object to train my machine learning models.
---

# Create Azure Machine Learning data assets

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning SDK you are using:"]
> * [v1](./v1/how-to-create-register-datasets.md)
> * [v2 (current version)](how-to-create-register-datasets.md)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

In this article, you learn how to create Azure Machine Learning Data to access data for your local or remote experiments with the Azure Machine Learning CLI/SDK. To understand where Data fits in Azure Machine Learning's overall data access workflow, see the [Work with Data](concept-data.md) article.

By creating a Data asset, you create a reference to the data source location, along with a copy of its metadata. Because the data remains in its existing location, you incur no extra storage cost, and don't risk the integrity of your data sources. Also Data assets are lazily evaluated, which aids in workflow performance speeds. You can create Data from Datastores, public URLs, and local files.

With Azure Machine Learning Data assets, you can:

* Keep a single copy of data in your storage, referenced by Data.

* Seamlessly access data during model training without worrying about connection strings or data paths.

* Share data and collaborate with other users.

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

Azure Machine Learning allows you to work with different types of data. Your data can be local or in the cloud (from a registered Azure ML Datastore, a common Azure Storage URL or a public data url). In this article, you'll learn about using the Python SDK v2 to work with _URIs_ and _Tables_. URIs reference a location either local to your development environment or in the cloud. Tables are a tabular data abstraction.

For most scenarios, you'll use URIs (`uri_folder` and `uri_file`). A URI references a location in storage that can be easily mapped to the filesystem of a compute node when you run a job. The data is accessed by either mounting or downloading the storage to the node.

When using tables, you'll use `mltable`. It's an abstraction for tabular data that is used for AutoML jobs, parallel jobs, and some advanced scenarios. If you're just starting to use Azure Machine Learning, and aren't using AutoML, we strongly encourage you to begin with URIs.

If you're creating Azure ML Data asset from an existing Datastore:

1. Verify that you have `contributor` or `owner` access to the underlying storage service of your registered Azure Machine Learning datastore. [Check your storage account permissions in the Azure portal](/azure/role-based-access-control/check-access).

1. Create the data asset by referencing paths in the datastore. You can create a Data asset from multiple paths in multiple datastores. There's no hard limit on the number of files or data size that you can create a data asset from. 

> [!NOTE]
> For each data path, a few requests will be sent to the storage service to check whether it points to a file or a folder. This overhead may lead to degraded performance or failure. A Data asset referencing one folder with 1000 files inside is considered referencing one data path. We recommend creating Data asset referencing less than 100 paths in datastores for optimal performance.

> [!TIP] 
> You can create Data asset with identity-based data access. If you don't provide any credentials, we will use your identity by defaut.


> [!TIP]
> If you have dataset assets created using the SDK v1, you can still use those with SDK v2. For more information, see the [Consuming V1 Dataset Assets in V2](#consuming-v1-dataset-assets-in-v2) section.



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

For a complete example, see the [working_with_uris.ipynb notebook](https://github.com/azure/azureml-previews/sdk/docs/working_with_uris.ipynb).


### Register data as URI Folder type Data

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

   
## MLTable

### Register data as MLTable type Data assets
Registering a `mltable` as an asset in Azure Machine Learning
You can register a `mltable` as a data asset in Azure Machine Learning. The benefits of registering data are:

Easy to share with other members of the team (no need to remember file locations)
Versioning of the metadata (location, description, etc.)
Below we show an example of versioning the sample data in this repo. The data is uploaded to cloud storage and registered as an asset.

```python
from azure.ai.ml.entities import Data
from azure.ai.ml._constants import AssetTypes

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
> While the above example shows a local file. Remember that path supports cloud storage (https, abfss, wasbs protocols). Therefore, if you want to register data in a > cloud location just specify the path with any of the supported protocols.
   
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

The contents of the MLTable file specify the underlying data location (here a local path) and also the transforms to perform on the underlying data before materializing into a pandas/spark/dask data frame. The important part here's that the MLTable-artifact doesn't have any absolute paths, making it *self-contained*. All the information stored in one folder; regardless of whether that folder is stored on your local drive or in your cloud drive or on a public http server.

To consume the data in a job or interactive session, use `mltable`:

```python
import mltable

tbl = mltable.load("./sample_data")
df = tbl.to_pandas_dataframe()
```

For a full example of using an MLTable, see the [Working with MLTable notebook](https://github.com/Azure/azureml-examples/blob/samuel100/mltable/sdk/assets/data/working_with_mltable.ipynb).
   
   



## Consuming V1 dataset assets in V2

> [!NOTE]
> While full backward compatibility is provided, if your intention with your V1 `FileDataset` assets was to have a single path to a file or folder with no loading transforms (sample, take, filter, etc.), then we recommend that you re-create them as a `uri_file`/`uri_folder` using the v2 CLI:
> 
> ```cli
> az ml data create --file my-data-asset.yaml
> ```

Registered v1 `FileDataset` and `TabularDataset` data assets can be consumed in an v2 job using `mltable`. To use the v1 assets, add the following definition in the `inputs` section of your job yaml:

```yaml
inputs:
    my_v1_dataset:
        type: mltable
        path: azureml:myv1ds:1
        mode: eval_mount
```

The following example shows how to do this using the v2 SDK:

```python
from azure.ai.ml.entities import Data, UriReference, JobInput, CommandJob
from azure.ai.ml._constants import AssetTypes

registered_v1_data_asset = ml_client.data.get(name='<ASSET NAME>', version='<VERSION NUMBER>')

my_job_inputs = {
    "input_data": JobInput(
        type=AssetTypes.MLTABLE, 
        path=registered_v1_data_asset.id,
        mode="eval_mount"
    )
}

job = CommandJob(
    code="./src", #local path where the code is stored
    command='python train.py --input_data ${{inputs.input_data}}',
    inputs=my_job_inputs,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:9",
    compute="cpu-cluster"
)

#submit the command job
returned_job = ml_client.jobs.create_or_update(job)
#get a URL for the status of the job
returned_job.services["Studio"].endpoint
```


## Next steps

* [Install and set up Python SDK v2 (preview)](https://aka.ms/sdk-v2-install)
* [Train models with the Python SDK v2 (preview)](how-to-train-sdk.md)
* [Tutorial: Create production ML pipelines with Python SDK v2 (preview)](tutorial-pipeline-python-sdk.md)
