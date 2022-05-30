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
ms.date: 05/24/2022

# Customer intent: As an experienced data scientist, I need to package my data into a consumable and reusable object to train my machine learning models.

---

# Create Azure Machine Learning data assets

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning SDK you are using:"]
> * [v1](./v1/how-to-create-register-datasets.md)
> * [v2 (current version)](how-to-create-register-datasets.md)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]
[!INCLUDE [CLI v2](../../includes/machine-learning-CLI-v2.md)]

In this article, you learn how to create a Data asset in Azure Machine Learning. By creating a Data asset, you create a *reference* to the data source location, along with a copy of its metadata. Because the data remains in its existing location, you incur no extra storage cost, and don't risk the integrity of your data sources. You can create Data from Datastores, Azure Storage, public URLs, and local files.

With Azure Machine Learning Data assets, you can:

* Easy share data with other members of the team without needing to remember file locations.

* Seamlessly access data during model training without worrying about connection strings or data paths.

* Can refer to the Data by short Entity name in Azure ML


## Prerequisites

To create and work with Data assets, you need:

* An Azure subscription. If you don't have one, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An [Azure Machine Learning workspace](how-to-manage-workspace.md).

* The [Azure Machine Learning CLI/SDK installed](how-to-configure-cli.md) and MLTable package installed (`pip install mltable`).

## Supported Paths

When you register a data asset in Azure Machine Learning, you'll need to specify a path that points to it's location. Azure Machine Learning supports:

- a local path
- Public http(s) location
- Blob Storage URI (for example: `https://<account_name>.blob.core.windows.net/<container_name>/path`)
- ADLS gen2 URI (for example: `abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/<file>`)
- An Azure Machine Learning Datastore URI (for example: `azureml://datastores/<data_store_name>/<path>`)

> [!NOTE]
> When you register a local path as a data asset, it will be automatically uploaded to the default Azure Machine Learning datastore in the cloud.

## Create a Folder Data Asset

Below shows you how to create a *folder* as an asset:

# [CLI](#tab/CLI)

Create a `YAML` file (`<file-name>.yml`):

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
type: uri_folder
name: <name_of_data>
description: <description goes here>
path: <path>
```

`path` can be any of the [Supported Paths](#supported-paths) outlined above.

Next, create the data asset using the CLI:

```azurecli
az ml data create -f <file-name>.yml
```

# [Python-SDK](#tab/Python-SDK)

You can create a data asset in Azure Machine Learning using the following Python Code:

```python
from azure.ai.ml.entities import Data
from azure.ai.ml.constants import AssetTypes

my_path = '<path>'
# Supported paths include:
# local: './<path>'
# blob:  'https://<account_name>.blob.core.windows.net/<container_name>/<path>'
# ADLS gen2: 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/'
# Azure ML datastore: 'azureml://datastores/<data_store_name>/<path>'

my_data = Data(
    path=my_path,
    type=AssetTypes.URI_FOLDER,
    description="<description>",
    name="<name>",
    version='<version>'
)

ml_client.data.create_or_update(my_data)
```

---

## Create a File Data Asset

Below shows you how to create a *specific file* as a data asset:

# [CLI](#tab/CLI)

Sample `YAML` file `<file-name>.yml` for data in local path is as below:
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
type: uri_file
name: <name>
description: <description>
path: <uri>
```

```cli
> az ml data create -f <file-name>.yml
```

# [Python-SDK](#tab/Python-SDK)
```python
from azure.ai.ml.entities import Data
from azure.ai.ml.constants import AssetTypes

my_path = '<path>/<file>'
# Supported paths include:
# local: './<path>/<file>'
# blob:  'https://<account_name>.blob.core.windows.net/<container_name>/<path>/<file>'
# ADLS gen2: 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/<file>'
# Azure ML datastore: 'azureml://datastores/<data_store_name>/<path>/<file>'

my_data = Data(
    path=my_path,
    type=AssetTypes.URI_FILE,
    description="description here",
    name="a_name",
    version='1'
)

ml_client.data.create_or_update(my_data)
```

---
   
## Create an `mltable` Data Asset

`mltable` is a way to abstract the schema definition for tabular data to make it easier to share data assets (more details on `mltable` can be found in [Define schema for tabular data with `mltable`](concept-data.md#define-schema-for-tabular-data-with-mltable)). 

In this section, we show you how to create a data asset when the type is an `mltable`.

### The MLTable file

The MLTable file is a file that provides the specification of the data's schema so that the `mltable` *engine* can materialize the data into an in-memory object (Pandas/Dask/Spark). An *example* MLTable file is provided below:

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
> The **MLTable *artifact*** (consisting of the MLTable file *and* underlying data) is *self-contained* and all that is needed is stored in that one folder (`my_data`); regardless of whether that folder is stored on your local drive or in your cloud store or on a public http server. You should **not** specify *absolute paths* in the MLTable file.

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


# [CLI](#tab/CLI)

Create a `YAML` file (`<file-name>.yml`):

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json

# path must point to **folder** containing MLTable artifact (MLTable file + data
# Supported paths include:
# local: './<path>'
# blob:  'https://<account_name>.blob.core.windows.net/<container_name>/<path>'
# ADLS gen2: 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/'
# Azure ML datastore: 'azureml://datastores/<data_store_name>/<path>'

type: mltable
name: <name_of_data>
description: <description goes here>
path: <path>
```

> [!NOTE]
>  The path points to the **folder** containing the MLTable artifact.

Next, create the data asset using the CLI:

```azurecli
az ml data create -f <file-name>.yml
```

# [Python-SDK](#tab/Python-SDK)

You can create a data asset in Azure Machine Learning using the following Python Code:

```python
from azure.ai.ml.entities import Data
from azure.ai.ml.constants import AssetTypes

# my_path must point to folder containing MLTable artifact (MLTable file + data
# Supported paths include:
# local: './<path>'
# blob:  'https://<account_name>.blob.core.windows.net/<container_name>/<path>'
# ADLS gen2: 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/'
# Azure ML datastore: 'azureml://datastores/<data_store_name>/<path>'

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

---

## Next steps

* [Install and set up Python SDK v2 (preview)](https://aka.ms/sdk-v2-install)
* [Install and use the CLI (v2)](how-to-configure-cli.md)
* [Train models with the Python SDK v2 (preview)](how-to-train-sdk.md)
* [Tutorial: Create production ML pipelines with Python SDK v2 (preview)](tutorial-pipeline-python-sdk.md)
* Learn more about [Data in Azure Machine Learning](concept-data.md)
