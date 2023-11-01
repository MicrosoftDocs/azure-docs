---
title: How to add data in Azure AI Studio
titleSuffix: Azure AI services
description: Learn how to add data in Azure AI Studio
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to add data in Azure AI Studio

In this article, you learn how to add data in Azure AI Studio.

When you create your data asset, you need to set the data asset type. AI Studio supports three data asset types:

|Type  | Canonical scenarios|
|---------|---------|
|**`file`**<br>Reference a single file | Read a single file on Azure Storage (the file can have any format). |
|**`folder`**<br> Reference a folder |      Read a folder of parquet/CSV files into Pandas/Spark.<br><br>Read unstructured data (images, text, audio, etc.) located in a folder. |
|**`table`**<br> Reference a data table |   You have a complex schema subject to frequent changes, or you need a subset of large tabular data.<br><br>Read unstructured data (images, text, audio, etc.) data that is spread across **multiple** storage locations. |

Also, you must specify a `path` parameter that points to the data asset location. Supported paths include:

|Location  | Examples  |
|---------|---------|
|Local: A path on your local computer    | `./home/username/data/my_data`         |
|Connection: A path on a Data Connection  |   `azureml://datastores/<data_store_name>/paths/<path>`      |
|Direct URL: a path on a public http(s) server   |  `https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv`    |
|Direct URL: a path on Azure Storage    |(Blob) `http[s]://<account_name>.blob.core.windows.net/<container_name>/<path>`<br>`wasbs://<containername>@<accountname>.blob.core.windows.net/<path>/`<br>(ADLS gen2) `http[s]://<accountname>.dfs.core.windows.net/<path>`<br>`abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>` <br>(OneLake Lakehouse)	`abfss://<workspace-name>@onelake.dfs.fabric.microsoft.com/<LakehouseName>.Lakehouse/Files/<path>` <br>(OneLake Warehouse)	`abfss://<workspace-name>@onelake.dfs.fabric.microsoft.com/<warehouseName>.warehouse/Files/<path>` |

> [!NOTE]
> When you create a data asset from a local path, it will automatically upload to the default Blob Connection.


## Add data from a folder

Use these steps to create a Folder typed data asset in the Azure AI studio:

> [!IMPORTANT]
> Data deletion is not supported. Instead, you can archive data assets. For more information, see [Archive data](#archive-data).

1. Navigate to [Azure AI studio](https://ai.azure.com)

1. From the collapsible menu on the left, select **Data** under **Components**.

    :::image type="content" source="../media/data-connections/data-add-new.png" alt-text="Screenshot of selecting data from the left menu." lightbox="../media/data-connections/data-add-select-storage-url.png":::

1. Select **+ Add data**
1. Choose your **Data source**. You can choose source data from a list of your recent data sources, a storage URL on the cloud, or even upload files and folders from the local machine. You can also add a connection to another data source such as Azure Blob Storage and Azure Data Lake Storage Gen 2. 

    :::image type="content" source="../media/data-connections/data-add-select-storage-url.png" alt-text="Screenshot of select source data." lightbox="../media/data-connections/data-add-select-storage-url.png":::

1. Select **Next** after choosing the data source and uploading files as needed.

1. Enter a custom name for your data, and then select **Create**.

    :::image type="content" source="../media/data-connections/data-add-finish.png" alt-text="Screenshot of naming the data." lightbox="../media/data-connections/data-add-finish.png":::

## Archive data

> [!IMPORTANT]
> Data deletion is not supported. Instead, you can archive data assets. Archiving a data asset hides it by default from both list queries (for example, in the CLI `az ml data list`) and the data asset listing in Azure AI Studio. You can still continue to reference and use an archived data asset in your workflows.

If Azure AI allowed data asset deletion, it would have the following adverse effects:
- Production jobs that consume data assets that were later deleted would fail.
- It would become more difficult to reproduce an ML experiment.
- Job lineage would break, because it would become impossible to view the deleted data asset version.
- You wouldn't be able to track and audit correctly, since versions could be missing.

Therefore, the *immutability* of data assets provides a level of protection when working in a team creating production workloads.
When a data asset was erroneously created - for example, with an incorrect name, type or path - Azure AI offers solutions to handle the situation without the negative consequences of deletion:


|Reason you want to delete | Solution  |
|---------|---------|
|The **name** is incorrect     |  Archive the data asset       |
|The team **no longer uses** the data asset | Archive the data asset  |
|It **clutters the data asset listing** | Archive the data asset  |
|The **path** is incorrect     |  Create a *new version* of the data asset (same name) with the correct path.      |
|It has an incorrect **type**  |  Currently, Azure AI doesn't allow the creation of a new version with a *different* type compared to the initial version.<br>(1) Archive the data asset <br>(2) Create a new data asset under a different name with the correct type.    |

You can archive either:

- *all versions* of the data asset under a given name, or
- a specific data asset version

### Archive all versions of a data asset

To archive *all versions* of the data asset under a given name, use:

# [Azure CLI](#tab/cli)

Execute the following command (update the `<>` placeholder with the name of your data asset):

```azurecli
ai data archive --name <NAME OF DATA ASSET>
```

# [Python SDK](#tab/python)

```python
from azure.ai.generative import AIClient
from azure.ai.generative.entities import Data
from azure.ai.generative.constants import AssetTypes
from azure.identity import DefaultAzureCredential

client = AIClient.from_config(DefaultAzureCredential())

# Create the data asset in the workspace
client.data.archive(name="<DATA ASSET NAME>")
```

---

### Archive a specific data asset version

> [!IMPORTANT]
> Currently, archiving a specific data asset version is not supported in Azure AI Studio.

To archive a specific data asset version, use:

# [Azure CLI](#tab/cli)

Execute the following command (update the `<>` placeholders with the name of your data asset and version):

```azurecli
ai data archive --name <NAME OF DATA ASSET> --version <VERSION TO ARCHIVE>
```

# [Python SDK](#tab/python)

```python
from azure.ai.generative import AIClient
from azure.ai.generative.entities import Data
from azure.ai.generative.constants import AssetTypes
from azure.identity import DefaultAzureCredential

client = AIClient.from_config(DefaultAzureCredential())

# Create the data asset in the workspace
client.data.archive(name="<DATA ASSET NAME>", version="<VERSION TO ARCHIVE>")
```

---


### Restore an archived data
You can restore an archived data asset. If all of versions of the data asset are archived, you can't restore individual versions of the data asset - you must restore all versions.

### Restore all versions of a data asset

To restore *all versions* of the data asset under a given name, use:

# [Azure CLI](#tab/cli)

Execute the following command (update the `<>` placeholder with the name of your data asset):

```azurecli
ai data restore --name <NAME OF DATA ASSET>
```

# [Python SDK](#tab/python)

```python
from azure.ai.generative import AIClient
from azure.ai.generative.entities import Data
from azure.ai.generative.constants import AssetTypes
from azure.identity import DefaultAzureCredential

client = AIClient.from_config(DefaultAzureCredential())
# Create the data asset in the workspace
client.data.restore(name="<DATA ASSET NAME>")
```

---

### Restore a specific data asset version

> [!IMPORTANT]
> If all data asset versions were archived, you cannot restore individual versions of the data asset - you must restore all versions.
To restore a specific data asset version, use:

# [Azure CLI](#tab/cli)

Execute the following command (update the `<>` placeholders with the name of your data asset and version):

```azurecli
ai data restore --name <NAME OF DATA ASSET> --version <VERSION TO ARCHIVE>
```

# [Python SDK](#tab/python)

```python
from azure.ai.generative import AIClient
from azure.ai.generative.entities import Data
from azure.ai.generative.constants import AssetTypes
from azure.identity import DefaultAzureCredential

client = AIClient.from_config(DefaultAzureCredential())
# Create the data asset in the workspace
client.data.restore(name="<DATA ASSET NAME>", version="<VERSION TO ARCHIVE>")
```

---

## Data asset tagging

Data assets support tagging, which is extra metadata applied to the data asset in the form of a key-value pair. Data tagging provides many benefits:

- Data quality description. For example, if your organization uses a *medallion lakehouse architecture* you can tag assets with `medallion:bronze` (raw), `medallion:silver` (validated) and `medallion:gold` (enriched).
- Provides efficient searching and filtering of data, to help data discovery.
- Helps identify sensitive personal data, to properly manage and govern data access. For example, `sensitivity:PII`/`sensitivity:nonPII`.
- Identify whether data is approved from a responsible AI (RAI) audit. For example, `RAI_audit:approved`/`RAI_audit:todo`.

You can add tags to data assets as part of their creation flow, or you can add tags to existing data assets. This section shows both.


## Next steps

- [How to create vector indexes](../how-to/index-add.md)

