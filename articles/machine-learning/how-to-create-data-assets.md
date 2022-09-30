---
title: Create Data Assets
titleSuffix: Azure Machine Learning
description: Learn how to create Azure Machine Learning data assets.
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

# Create data assets
[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning SDK you are using:"]
> * [v1](./v1/how-to-create-register-datasets.md)
> * [v2 (current version)](how-to-create-data-assets.md)

In this article, you learn how to create a data asset in Azure Machine Learning. By creating a data asset, you create a *reference* to the data source location, along with a copy of its metadata. Because the data remains in its existing location, you incur no extra storage cost, and don't risk the integrity of your data sources. You can create Data from datastores, Azure Storage, public URLs, and local files.

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
|A path on a public http(s) server    |  `https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv`    |
|A path on Azure Storage     |   `https://<account_name>.blob.core.windows.net/<container_name>/path` <br> `abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>`    |
|A path on a datastore   |   `azureml://datastores/<data_store_name>/paths/<path>`      |


> [!NOTE]
> When you create a data asset from a local path, it will be automatically uploaded to the default Azure Machine Learning datastore in the cloud.

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

---
   
## Create a `mltable` data asset

`mltable` is a way to abstract the schema definition for tabular data to make it easier to share data assets (an overview can be found in [MLTable](concept-data.md#mltable)). 

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
>  The path points to the **folder** containing the MLTable artifact.

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

---

## Next steps

- [Read data in a job](how-to-read-write-data-v2.md#read-data-in-a-job)
