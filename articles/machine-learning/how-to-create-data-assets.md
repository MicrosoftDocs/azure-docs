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
author: SturgeonMi
ms.reviewer: franksolomon
ms.date: 01/23/2023
---

# Create data assets
[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning SDK you are using:"]
> * [v1](./v1/how-to-create-register-datasets.md?view=azureml-api-1&preserve-view=true)
> * [v2 (current version)](how-to-create-data-assets.md)

In this article, you'll learn how to create a data asset in Azure Machine Learning. An Azure Machine Learning data asset is similar to web browser bookmarks (favorites). Instead of remembering long storage paths (URIs) that point to your most frequently used data, you can create a data asset, and then access that asset with a friendly name.

Data asset creation also creates a *reference* to the data source location, along with a copy of its metadata. Because the data remains in its existing location, you incur no extra storage cost, and don't risk data source integrity. You can create Data assets from Azure Machine Learning datastores, Azure Storage, public URLs, and local files.

## Prerequisites

To create and work with data assets, you need:

* An Azure subscription. If you don't have one, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace. [Create workspace resources](quickstart-create-resources.md).

* The [Azure Machine Learning CLI/SDK installed](how-to-configure-cli.md).

## Do I *need* to create a data asset to access my data?

No. If you just want to access your data in an interactive session (for example, a notebook) or a job, you are **not** required to create a data asset first. You can use the storage URI to access the data.

Data assets can "bookmark" your frequently used data, to avoid the need to remember long storage URIs.

> [!TIP]
> For more information about accessing your data in a notebook, please see [Access data from Azure cloud storage for interactive development](how-to-access-data-interactive.md).<br><br>For more information about accessing your data - both local and cloud storage - in a job, please see [Access data in a job](how-to-read-write-data-v2.md).

## Data asset types

> [!NOTE]
> Make sure to check out the **canonical scenarios** below when deciding if you want to use uri_file, uri_folder or mltable for your use case.

You can create three data asset types:

|Type  |V2 API  |V1 API  |V2/V1 API Difference  |**Canonical Scenarios**
|---------|---------|---------|---------|---------|
|**File**<br>Reference a single file     |    `uri_file`     |   `FileDataset`      |  A type new to V2 APIs. In V1 APIs, files always mapped to a folder on the compute target filesystem; this mapping required an `os.path.join`. In V2 APIs, the single file is mapped. This way, you can refer to that location in your code.   |       Read/write a single file - the file can have any format. |  
|**Folder**<br> Reference a single folder     |     `uri_folder`    |   `FileDataset`       | In V1 APIs, `FileDataset` had an associated engine that could take a file sample from a folder. In V2 APIs, a Folder is a simple mapping to the compute target filesystem. |      You must read/write a folder of parquet/CSV files into Pandas/Spark.<br><br>Deep-learning with images, text, audio, video files located in a folder. |
|**Table**<br> Reference a data table    |   `mltable`      |     `TabularDataset`     | In V1 APIs, the Azure Machine Learning back-end stored the data materialization blueprint. This storage location meant that `TabularDataset` only worked if you had an Azure Machine Learning workspace. `mltable` stores the data materialization blueprint in *your* storage. This storage location means you can use it *disconnected to AzureML* - for example, local, on-premises. In V2 APIs, you'll find it easier to transition from local to remote jobs. Read [Working with tables in Azure Machine Learning](how-to-mltable.md) for more information. |    You have a complex schema subject to frequent changes, or you need a subset of large tabular data.<br><br>AutoML with Tables. |

## Supported paths

When you create an Azure Machine Learning data asset, you must specify a `path` parameter that points to the data asset location. Supported paths include:

|Location  | Examples  |
|---------|---------|
|A path on your local computer    | `./home/username/data/my_data`         |
|A path on a Datastore  |   `azureml://datastores/<data_store_name>/paths/<path>`      |
|A path on a public http(s) server   |  `https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv`    |
|A path on Azure Storage    |(Blob) `wasbs://<containername>@<accountname>.blob.core.windows.net/<path_to_data>/`<br>(ADLS gen2) `abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>` <br>(ADLS gen1) `adl://<accountname>.azuredatalakestore.net/<path_to_data>/` |

> [!IMPORTANT]
> When working with folder data, ensure that the correct path structure is used (ex. /<path_to_data>**/**) so the data source is accurately captured.

> [!NOTE]
> When you create a data asset from a local path, it will automatically upload to the default Azure Machine Learning cloud datastore.

## Create a File asset

# [Azure CLI](#tab/cli)

Create a `YAML` file `<file-name>.yml`:

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

Next, execute the following command in the CLI:

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

These steps explain how to create a File data asset in the Azure Machine Learning studio:

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

1. Under **Assets** in the left navigation, select **Data**. On the Data assets tab, select **Create**
:::image type="content" source="./media/how-to-create-data-assets/data-assets-create.png" alt-text="Screenshot highlights Create in the Data assets tab.":::

1. Give your data asset a name and an optional description. Then, select the **File (uri_file)** option under Type.
:::image type="content" source="./media/how-to-create-data-assets/create-data-asset-file-type.png" alt-text="In this screenshot, choose File (uri folder) in the Type dropdown.":::

1. You have a few options for your data source. If you already have the path to the file you want to upload, choose **From a URI**. For a file already stored in Azure, choose **From Azure storage**. To upload your file from your local drive, choose **From local files**.
:::image type="content" source="./media/how-to-create-data-assets/create-data-asset.png" alt-text="This screenshot shows data asset source choices.":::

1. Follow the steps; once you reach the Review step, select **Create** on the last page
---

## Create a Folder asset

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

Next, use the CLI to create the data asset:

```azurecli
az ml data create -f <file-name>.yml
```

# [Python SDK](#tab/Python-SDK)

Use this Python Code to create a data asset in Azure Machine Learning:

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

Use these steps to create a Folder data asset in the Azure Machine Learning studio:

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

1. Under **Assets** in the left navigation, select **Data**. On the Data assets tab, select **Create**
:::image type="content" source="./media/how-to-create-data-assets/data-assets-create.png" alt-text="Screenshot highlights Create in the Data assets tab.":::

1. Give your data asset a name and optional description. Then, select the **Folder (uri_folder)** option under Type, if it isn't already selected.
:::image type="content" source="./media/how-to-create-data-assets/create-data-asset-folder-type.png" alt-text="In this screenshot, choose Folder (uri folder) in the Type dropdown.":::

1. You have a few options for your data source. If you already have the path to the folder you want to upload, choose **From a URI**. For a folder already stored in Azure, choose **From Azure storage**. To upload a folder from your local drive, choose **From local files**.
:::image type="content" source="./media/how-to-create-data-assets/create-data-asset.png" alt-text="This screenshot shows data asset source choices.":::

1. Follow the steps, once you reach the Review step, select **Create** on the last page.
---

## Create a Table asset

You must create a valid `MLTable` file before you create the asset. Read [Authoring `MLTable` files](how-to-mltable.md#authoring-mltable-files) to learn more about `MLTable` file and artifact creation.

> [!IMPORTANT]
> The `path` should be a *folder* that contains a valid `MLTable` file.

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

# [Studio](#tab/Studio)

To create a Table data asset in the Azure Machine Learning studio, use the following steps. 

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

1. Under **Assets** in the left navigation, select **Data**. On the Data assets tab, select **Create**
:::image type="content" source="./media/how-to-create-data-assets/data-assets-create.png" alt-text="Screenshot highlights Create in the Data assets tab.":::

1. Give your data asset a name and optional description. Then, select the **Table (mltable)** option under Type.
:::image type="content" source="./media/how-to-create-data-assets/create-data-asset-table-type.png" alt-text="In this screenshot, choose Table (mltable) in the Type dropdown.":::

1. You have a few options for your data source. If you already have the path to the folder you want to upload, choose **From a URI**. If your folder is already stored in Azure, choose **From Azure storage**. If you want to upload your folder from your local drive, choose **From local files**.
:::image type="content" source="./media/how-to-create-data-assets/create-data-asset.png" alt-text="This screenshot shows data asset source choices.":::

1. Follow the steps; once you reach the Review step, select **Create** on the last page
---

## Next steps

- [Read data in a job](how-to-read-write-data-v2.md#read-data-in-a-job)
- [Working with tables in Azure Machine Learning](how-to-mltable.md)
- [Access data from Azure cloud storage during interactive development](how-to-access-data-interactive.md)
