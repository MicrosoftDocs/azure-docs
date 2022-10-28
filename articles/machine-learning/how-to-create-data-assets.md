---
title: Create Data Assets
titleSuffix: Azure Machine Learning
description: Learn how to create Azure Machine Learning data assets
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.custom: data4ml, ignite-2022
ms.author: xunwan
author: xunwan
ms.reviewer: nibaccam
ms.date: 09/22/2022
---

# Create data assets
[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning SDK you are using:"]
> * [v1](./v1/how-to-create-register-datasets.md)
> * [v2 (current version)](how-to-create-data-assets.md)

In this article, you learn how to create a data asset in Azure Machine Learning. By creating a data asset, you create a *reference* to the data source location, along with a copy of its metadata. Because the data remains in its existing location, you incur no extra storage cost, and don't risk the integrity of your data sources. You can create Data from AzureML datastores, Azure Storage, public URLs, and local files.

> [!IMPORTANT]
> If you didn't creat/register the data source as a data asset, you can still [consume the data via specifying the data path in a job](how-to-read-write-data-v2.md#read-data-in-a-job) without benefits below.

The benefits of creating data assets are:

* You can **share and reuse data** with other members of the team such that they do not need to remember file locations.

* You can **seamlessly access data** during model training (on any supported compute type) without worrying about connection strings or data paths.

* You can **version** the data.



## Prerequisites

To create and work with data assets, you need:

* An Azure subscription. If you don't have one, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace. [Create workspace resources](quickstart-create-resources.md).

* The [Azure Machine Learning CLI/SDK installed](how-to-configure-cli.md) and MLTable package installed (`pip install mltable`).

## Supported paths

When you create a data asset in Azure Machine Learning, you'll need to specify a `path` parameter that points to its location. Below is a table that shows the different data locations supported in Azure Machine Learning and examples for the `path` parameter:


|Location  | Examples  |
|---------|---------|
|A path on your local computer     | `./home/username/data/my_data`         |
|A path on a datastore   |   `azureml://datastores/<data_store_name>/paths/<path>`      |
|A path on a public http(s) server    |  `https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv`    |
|A path on Azure Storage     |`wasbs://<containername>@<accountname>.blob.core.windows.net/<path_to_data>/` <br>  `abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>` <br>  `adl://<accountname>.azuredatalakestore.net/<path_to_data>/`<br> `https://<account_name>.blob.core.windows.net/<container_name>/path`  |


> [!NOTE]
> When you create a data asset from a local path, it will be automatically uploaded to the default Azure Machine Learning datastore in the cloud.


## Data asset types
 - [**URIs**](#Create a `uri_folder` data asset) - A **U**niform **R**esource **I**dentifier that is a reference to a storage location on your local computer or in the cloud that makes it very easy to access data in your jobs. Azure Machine Learning distinguishes two types of URIs:`uri_file` and `uri_folder`.

 - [**MLTable**](#Create a `mltable` data asset) - `MLTable` helps you to abstract the schema definition for tabular data so it is more suitable for complex/changing schema or to be leveraged in automl. If you just want to create an data asset for a job or you want to write your own parsing logic in python you could use `uri_file`, `uri_folder`.

 The ideal scenarios to use `mltable` are:
 - The schema of your data is complex and/or changes frequently.
 - You only need a subset of data (for example: a sample of rows or files, specific columns, etc).
 - AutoML jobs requiring tabular data.
If your scenario does not fit the above then it is likely that URIs are a more suitable type.

## Create a `uri_folder` data asset

Below shows you how to create a *folder* as an asset:

# [Azure CLI](#tab/cli)

Create a `YAML` file (`<file-name>.yml`):

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json

# Supported paths include:
# local: ./<path>
# blob:  https://<account_name>.blob.core.windows.net/<container_name>/<path>
# ADLS gen2: abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/
# Datastore: azureml://datastores/<data_store_name>/paths/<path>
type: uri_folder
name: <name_of_data>
description: <description goes here>
path: <path>
```

Next, create the data asset using the CLI:

```azurecli
az ml data create -f <file-name>.yml
```

# [Python SDK](#tab/Python-SDK)

You can create a data asset in Azure Machine Learning using the following Python Code:

```python
from azure.ai.ml.entities import Data
from azure.ai.ml.constants import AssetTypes

# Supported paths include:
# local: './<path>'
# blob:  'https://<account_name>.blob.core.windows.net/<container_name>/<path>'
# ADLS gen2: 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/'
# Datastore: 'azureml://datastores/<data_store_name>/paths/<path>'

my_path = '<path>'

my_data = Data(
    path=my_path,
    type=AssetTypes.URI_FOLDER,
    description="<description>",
    name="<name>",
    version='<version>'
)

ml_client.data.create_or_update(my_data)
```

# [Studio](#tab/Studio)

To create a Folder data asset in the Azure Machine Learning studio, use the following steps:

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

1. Under __Assets__ in the left navigation, select __Data__. On the Data assets tab, select Create
:::image type="content" source="./media/how-to-create-data-assets/data-assets-create.png" alt-text="Screenshot highlights Create in the Data assets tab.":::

1. Give your data asset a name and optional description. Then, select the "Folder (uri_folder)" option under Type, if it is not already selected.
:::image type="content" source="./media/how-to-create-data-assets/create-data-asset-folder-type.png" alt-text="In this screenshot, choose Folder (uri folder) in the Type dropdown.":::

1. You have a few options for your data source. If you already have the path to the folder you want to upload, choose "From a URI". If your folder is already stored in Azure, choose "From Azure storage". If you want to upload your folder from your local drive, choose "From local files".
:::image type="content" source="./media/how-to-create-data-assets/create-data-asset.png" alt-text="This screenshot shows data asset source choices.":::

1. Follow the steps, once you reach the Review step, click Create on the last page
---

## Create a `uri_file` data asset

Below shows you how to create a *specific file* as a data asset:

# [Azure CLI](#tab/cli)

Sample `YAML` file `<file-name>.yml` for data in local path is as below:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json

# Supported paths include:
# local: ./<path>/<file>
# blob:  https://<account_name>.blob.core.windows.net/<container_name>/<path>/<file>
# ADLS gen2: abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/<file>
# Datastore: azureml://datastores/<data_store_name>/paths/<path>/<file>

type: uri_file
name: <name>
description: <description>
path: <uri>
```

```cli
> az ml data create -f <file-name>.yml
```

# [Python SDK](#tab/Python-SDK)
```python
from azure.ai.ml.entities import Data
from azure.ai.ml.constants import AssetTypes

# Supported paths include:
# local: './<path>/<file>'
# blob:  'https://<account_name>.blob.core.windows.net/<container_name>/<path>/<file>'
# ADLS gen2: 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/<file>'
# Datastore: 'azureml://datastores/<data_store_name>/paths/<path>/<file>'
my_path = '<path>'

my_data = Data(
    path=my_path,
    type=AssetTypes.URI_FILE,
    description="<description>",
    name="<name>",
    version="<version>"
)

ml_client.data.create_or_update(my_data)
```
# [Studio](#tab/Studio)

To create a File data asset in the Azure Machine Learning studio, use the following steps:

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

1. Under __Assets__ in the left navigation, select __Data__. On the Data assets tab, select Create
:::image type="content" source="./media/how-to-create-data-assets/data-assets-create.png" alt-text="Screenshot highlights Create in the Data assets tab.":::

1. Give your data asset a name and optional description. Then, select the "File (uri_file)" option under Type.
:::image type="content" source="./media/how-to-create-data-assets/create-data-asset-file-type.png" alt-text="In this screenshot, choose File (uri folder) in the Type dropdown.":::

1. You have a few options for your data source. If you already have the path to the file you want to upload, choose "From a URI". If your file is already stored in Azure, choose "From Azure storage". If you want to upload your file from your local drive, choose "From local files".
:::image type="content" source="./media/how-to-create-data-assets/create-data-asset.png" alt-text="This screenshot shows data asset source choices.":::

1. Follow the steps, once you reach the Review step, click Create on the last page
---
   
## Create a `mltable` data asset

`mltable` is a way to abstract the schema definition for tabular data to make it easier to share data assets (an overview can be found in [MLTable](concept-data.md#mltable)). 
`mltable` supports tabular data coming from following sources:
- Delimited files (CSV, TSV, TXT)
- Parquet files
- JSON Lines
- Delta Lake 

Please find more details about what are the abilities we provide via `mltable` in [reference-yaml-mltable](reference-yaml-mltable.md).

In this section, we show you how to create a data asset when the type is an `mltable`.

### The MLTable file

The MLTable file is a file that provides the specification of the data's schema so that the `mltable` *engine* can materialize the data into an in-memory object (Pandas/Dask/Spark).

> [!NOTE]
> This file needs to be named exactly as `MLTable`.

An *example* MLTable file is provided below:

```yml
type: mltable

paths:
  - pattern: ./*.txt
transformations:
  - read_delimited:
      delimiter: ,
      encoding: ascii
      header: all_files_same_headers
```
> [!IMPORTANT]
> We recommend co-locating the MLTable file with the underlying data in storage. For example:
> 
> ```Text
> ├── my_data
> │   ├── MLTable
> │   ├── file_1.txt
> .
> .
> .
> │   ├── file_n.txt
> ```
> Co-locating the MLTable with the data ensures a **self-contained *artifact*** where all that is needed is stored in that one folder (`my_data`); regardless of whether that folder is stored on your local drive or in your cloud store or on a public http server. You should **not** specify *absolute paths* in the MLTable file.

In your Python code, you materialize the MLTable artifact into a Pandas dataframe using:

```python
import mltable

tbl = mltable.load(uri="./my_data")
df = tbl.to_pandas_dataframe()
```

The `uri` parameter in `mltable.load()` should be a valid path to a local or cloud **folder** which contains a valid MLTable file.

> [!NOTE]
> You will need the `mltable` library installed in your Environment (`pip install mltable`).

Below shows you how to create an `mltable` data asset. The `path` can be any of the supported path formats outlined above.


# [Azure CLI](#tab/cli)

Create a `YAML` file (`<file-name>.yml`):

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json

# path must point to **folder** containing MLTable artifact (MLTable file + data
# Supported paths include:
# local: ./<path>
# blob:  https://<account_name>.blob.core.windows.net/<container_name>/<path>
# ADLS gen2: abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/
# Datastore: azureml://datastores/<data_store_name>/paths/<path>

type: mltable
name: <name_of_data>
description: <description goes here>
path: <path>
```

> [!NOTE]
> The path points to the **folder** containing the MLTable artifact.

Next, create the data asset using the CLI:

```azurecli
az ml data create -f <file-name>.yml
```

# [Python SDK](#tab/Python-SDK)

You can create a data asset in Azure Machine Learning using the following Python Code:

```python
from azure.ai.ml.entities import Data
from azure.ai.ml.constants import AssetTypes

# my_path must point to folder containing MLTable artifact (MLTable file + data
# Supported paths include:
# local: './<path>'
# blob:  'https://<account_name>.blob.core.windows.net/<container_name>/<path>'
# ADLS gen2: 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/'
# Datastore: 'azureml://datastores/<data_store_name>/paths/<path>'

my_path = '<path>'

my_data = Data(
    path=my_path,
    type=AssetTypes.MLTABLE,
    description="<description>",
    name="<name>",
    version='<version>'
)

ml_client.data.create_or_update(my_data)
```
> [!NOTE]
> The path points to the **folder** containing the MLTable artifact. 

# [Studio](#tab/Studio)

To create a Table data asset in the Azure Machine Learning studio, use the following steps. 
> [!NOTE]
> You must have a **folder** prepared containing the MLTable artifact.

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

1. Under __Assets__ in the left navigation, select __Data__. On the Data assets tab, select Create
:::image type="content" source="./media/how-to-create-data-assets/data-assets-create.png" alt-text="Screenshot highlights Create in the Data assets tab.":::

1. Give your data asset a name and optional description. Then, select the "Table (mltable)" option under Type.
:::image type="content" source="./media/how-to-create-data-assets/create-data-asset-table-type.png" alt-text="In this screenshot, choose Table (mltable) in the Type dropdown.":::

1. You have a few options for your data source. If you already have the path to the folder you want to upload, choose "From a URI". If your folder is already stored in Azure, choose "From Azure storage". If you want to upload your folder from your local drive, choose "From local files".
:::image type="content" source="./media/how-to-create-data-assets/create-data-asset.png" alt-text="This screenshot shows data asset source choices.":::

1. Follow the steps, once you reach the Review step, click Create on the last page
---



## Next steps

- [Read data in a job](how-to-read-write-data-v2.md#read-data-in-a-job)
