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

## Data assets

An Azure AI Studio data asset resembles web browser bookmarks (favorites). Instead of remembering long storage paths (URIs) that point to your most frequently used data, you can create a data asset, and then access that asset with a friendly name.

Data asset creation also creates a *reference* to the data source location, along with a copy of its metadata. Because the data remains in its existing location, you incur no extra storage cost, and you don't risk data source integrity. You can create Data assets from Azure AI Studio Data Connections, Azure Storage, public URLs, or local files.

A Uniform Resource Identifier (URI) represents a storage location on your local computer, Azure storage, or a publicly available http(s) location. These examples show URIs for different storage options:

:::image type="content" source="../media/data-connections/data-add-select-storage-url.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/data-add-select-storage-url.png":::

|Storage location  | URI examples  |
|---------|---------|
|Azure AI Studio connection  |   `azureml://datastores/<data_store_name>/paths/<folder1>/<folder2>/<folder3>/<file>.parquet`      |
|Local files     | `./home/username/data/my_data`         |
|Public http(s) server    |  `https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv`    |
|Blob storage    | `wasbs://<containername>@<accountname>.blob.core.windows.net/<folder>/`|
|Azure Data Lake (gen2) | `abfss://<file_system>@<account_name>.dfs.core.windows.net/<folder>/<file>.csv`  |
|Microsoft OneLake | `abfss://<file_system>@<account_name>.dfs.core.windows.net/<folder>/<file>.csv` `https://<accountname>.dfs.fabric.microsoft.com/<artifactname>` |

## Data types

A URI (storage location) can reference a file, a folder, or a data table.

|Type |Canonical Scenarios |
|---------|---------|
|**`uri_file`**<br>Reference a single file|  Read/write a single file - the file can have any format.   | 
|**`uri_folder`**<br> Reference a single folder|  You must read/write a folder of parquet/CSV files into Pandas/Spark.<br><br>Deep-learning with images, text, audio, video files located in a folder.       |
|**`mltable`**<br> Reference a data table |    You have a complex schema subject to frequent changes, or you need a subset of large tabular data.    | 


## Create and manage data

This article shows how to create and manage data assets in Azure AI Studio.

Data assets can help when you need these capabilities:
- Versioning: Data assets support data versioning.
- Reproducibility: Once you create a data asset version, it's immutable. It can't be modified or deleted. Therefore, jobs or PromptFlow pipelines that consume the data asset can be reproduced.
- Auditability: Because the data asset version is immutable, you can track the asset versions, who updated a version, and when the version updates occurred.
- Lineage: For any given data asset, you can view which jobs or PromptFlow pipelines consume the data.
- Ease-of-use: An Azure AI Studio data asset resembles web browser bookmarks (favorites). Instead of remembering long storage paths (URIs) that *reference* your frequently used data on Azure Storage, you can create a data asset version and then access that version of the asset with a friendly name (for example: `azureml:<my_data_asset_name>:<version>`).



## Create data assets

When you create your data asset, you need to set the data asset type. AI Studio supports three data asset types:

|Type  |**Canonical Scenarios**|
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
|Direct URL: a path on Azure Storage    |(Blob) `wasbs://<containername>@<accountname>.blob.core.windows.net/<path_to_data>/`<br>(ADLS gen2) `abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>` <br>(ADLS gen1) `adl://<accountname>.azuredatalakestore.net/<path_to_data>/` |

> [!NOTE]
> When you create a data asset from a local path, it will automatically upload to the default Blob datastore.

### Create a data asset: File type

A data asset that is a File (`uri_file`) type points to a *single file* on storage (for example, a CSV file). You can create a file typed data asset using:


These steps explain how to create a File typed data asset in the Azure AI studio:

1. Navigate to [Azure AI studio](https://ml.azure.com)

1. Under **Assets** in the left navigation, select **Data**. On the Data assets tab, select **Create**

1. Give your data asset a name and an optional description. Then, select the **File (uri_file)** option under Type.

1. You have a few options for your data source. If you already have the path to the file you want to upload, choose **From a URI**. For a file already stored in Azure, choose **From Azure storage**. To upload your file from your local drive, choose **From local files**.

1. Follow the steps; once you reach the Review step, select **Create** on the last page


### Create a data asset: Folder type

A data asset that is a Folder (`uri_folder`) type is one that points to a *folder* on storage (for example, a folder containing several subfolders of images). You can create a folder typed data asset using:


Use these steps to create a Folder typed data asset in the Azure AI studio:

1. Navigate to [Azure AI studio](https://ml.azure.com)

1. Under **Assets** in the left navigation, select **Data**. On the Data assets tab, select **Create**

1. Give your data asset a name and optional description. Then, select the **Folder (uri_folder)** option under Type, if it isn't already selected.

1. You have a few options for your data source. If you already have the path to the folder you want to upload, choose **From a URI**. For a folder already stored in Azure, choose **From Azure storage**. To upload a folder from your local drive, choose **From local files**.

1. Follow the steps, and once you reach the Review step, select **Create** on the last page.


### Create a data asset: Table type

Currently, the Studio UI has limited functionality for the creation of Table typed assets. A Table typed asset requires an MLTable file(YAML-based file), which can only be created using the Python SDK. We recommend that you use the Python SDK to author and create Table typed data assets.

Azure AI Tables have rich functionality. Rather than repeat that documentation here, we provide an example of creating a Table-typed data asset, using Titanic data located on a publicly available Azure Blob Storage account.

# [Azure CLI](#tab/cli)

First, create a new directory called data, and create a file called **Table**:

```bash
mkdir data
touch Table
```

Next, copy-and-paste the following YAML into the **Table** file you created in the previous step:

> [!CAUTION]
> Do **not** rename the `MLTable` file to `MLTable.yaml` or `MLTable.yml`. Azure AI Studio expects an `MLTable` file.
```yml
paths:
- file: wasbs://data@azuremlexampledata.blob.core.windows.net/titanic.csv
transformations:
- read_delimited:
    delimiter: ','
    empty_as_string: false
    encoding: utf8
    header: all_files_same_headers
    include_path_column: false
    infer_column_types: true
    partition_size: 20971520
    path_column: Path
    support_multi_line: false
- filter: col('Age') > 0
- drop_columns:
  - PassengerId
- convert_column_types:
  - column_type:
      boolean:
        false_values:
        - 'False'
        - 'false'
        - '0'
        mismatch_as: error
        true_values:
        - 'True'
        - 'true'
        - '1'
    columns: Survived
type: table
```

Next, execute the following command in the CLI. Make sure you update the `<>` placeholders with the data asset name and version values.

```cli
ai data create --path ./data --name <DATA ASSET NAME> --version <VERSION> --type table
```

> [!IMPORTANT]
> The `path` should be a *folder* that contains a valid `MLTable` file.

# [Python SDK](#tab/python)

Use the following code to create a data asset that is a Table (`mltable`) type, and update the `<>` placeholders with your information.

```python
import mltable
from mltable import MLTableHeaders, MLTableFileEncoding, DataType
from azure.ai.generative import AIClient
from azure.ai.generative.entities import Data
from azure.ai.generative.constants import AssetTypes
from azure.identity import DefaultAzureCredential

client = AIClient.from_config(DefaultAzureCredential())

# create paths to the data files
paths = [{"file": "wasbs://data@azuremlexampledata.blob.core.windows.net/titanic.csv"}]

# create an MLTable from the data files
tbl = mltable.from_delimited_files(
    paths=paths,
    delimiter=",",
    header=MLTableHeaders.all_files_same_headers,
    infer_column_types=True,
    include_path_column=False,
    encoding=MLTableFileEncoding.utf8,
)

# filter out rows undefined ages
tbl = tbl.filter("col('Age') > 0")

# drop PassengerId
tbl = tbl.drop_columns(["PassengerId"])

# ensure survived column is treated as boolean
data_types = {
    "Survived": DataType.to_bool(
        true_values=["True", "true", "1"], false_values=["False", "false", "0"]
    )
}
tbl = tbl.convert_column_types(data_types)

# show the first few records
print(tbl.show())

# save the data loading steps in an MLTable file
mltable_folder = "./titanic"
tbl.save(mltable_folder)

# Define the Data asset object
my_data = Data(
    path=mltable_folder,
    type=AssetTypes.TABLE,
    description="<ADD A DESCRIPTION HERE>",
    name="<NAME OF DATA ASSET>",
    version="<SET VERSION HERE>",
)

# Create the data asset in the workspace
client.data.create_or_update(my_data)
```

---


## Manage data

### Create a connection for data

An AI Studio Connection can be created as a *reference* to an *existing* Azure storage account or other *existing* Microsoft services.
We support Connection to data from following Azure storage account types: Microsoft OneLake, Azure Blob, Azure Data Lake Gen2.

### Delete data

> [!IMPORTANT]
> Data asset deletion isn't supported.
>
> If Azure AI allowed data asset deletion, it would have the following adverse effects:
> - **Production jobs** that consume data assets that were later deleted would fail.
> - It would become more difficult to **reproduce** an ML experiment.
> - Job **lineage** would break, because it would become impossible to view the deleted data asset version.
> - You would not be able to **track and audit** correctly, since versions could be missing.
>
> Therefore, the immutability of data assets provides a level of protection when working in a team creating production workloads.

When a data asset has been erroneously created - for example, with an incorrect name, type or path - Azure AI offers solutions to handle the situation without the negative consequences of deletion:

|*I want to delete this data asset because...* | Solution  |
|---------|---------|
|The **name** is incorrect     |  [Archive the data asset](#archive-a-data-asset)       |
|The team **no longer uses** the data asset | [Archive the data asset](#archive-a-data-asset) |
|It **clutters the data asset listing** | [Archive the data asset](#archive-a-data-asset) |
|The **path** is incorrect     |  Create a *new version* of the data asset (same name) with the correct path. For more information, read [Create data assets](#create-data-assets).       |
|It has an incorrect **type**  |  Currently, Azure AI doesn't allow the creation of a new version with a *different* type compared to the initial version.<br>(1) [Archive the data asset](#archive-a-data-asset)<br>(2) [Create a new data asset](#create-data-assets) under a different name with the correct type.    |

### Archive a data asset

Archiving a data asset hides it by default from both list queries (for example, in the CLI `az ml data list`) and the data asset listing in the Studio UI. You can still continue to reference and use an archived data asset in your workflows. You can archive either:

- *all versions* of the data asset under a given name, or
- a specific data asset version

#### Archive all versions of a data asset

To archive *all versions* of the data asset under a given name, use:


1. In the Studio UI, select **Data** from the left-hand menu.
1. On the **Data assets** tab, select the data asset you want to archive.
1. Select **Archive**, followed by **Archive** in the confirmation dialog box.


#### Archive a specific data asset version

Currently, archiving a specific data asset version isn't supported in the Studio UI.


### Restore an archived data
You can restore an archived data asset. If all of versions of the data asset are archived, you can't restore individual versions of the data asset - you must restore all versions.

#### Restore all versions of a data asset

To restore all versions of the data asset under a given name, use:


1. In the Studio UI, select **Data** from the left-hand menu.
1. On the **Data assets** tab, enable **Include Archived**.
1. Select the data asset name.
1. Next, on the data asset details page, select **Restore**.


#### Restore a specific data asset version

> [!IMPORTANT]
> If all data asset versions were archived, you cannot restore individual versions of the data asset - you must restore all versions.

Currently, restoring a specific data asset version isn't supported in the Studio UI. To restore a specific data asset version, use:

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

### Data asset tagging

Data assets support tagging, which is extra metadata applied to the data asset in the form of a key-value pair. Data tagging provides many benefits:

- Data quality description. For example, if your organization uses a *medallion lakehouse architecture* you can tag assets with `medallion:bronze` (raw), `medallion:silver` (validated) and `medallion:gold` (enriched).
- Provides efficient searching and filtering of data, to help data discovery.
- Helps identify sensitive personal data, to properly manage and govern data access. For example, `sensitivity:PII`/`sensitivity:nonPII`.
- Identify whether data is approved from a responsible AI (RAI) audit. For example, `RAI_audit:approved`/`RAI_audit:todo`.

You can add tags to data assets as part of their creation flow, or you can add tags to existing data assets. This section shows both.



## Next steps

- [How to create vector indexes](../how-to/index-add.md)

