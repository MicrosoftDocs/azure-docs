---
title: Working with tables in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to work with tables (mltable) in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: samkemp
author: samuel100
ms.reviewer: franksolomon
ms.date: 01/23/2023
ms.custom: contperf-fy21q1, devx-track-python, data4ml


# Customer intent: As an experienced Python developer, I need to make my Azure storage data available to my remote compute, to train my machine learning models.
---

# Working with tables in Azure Machine Learning

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning developer platform you use:"]
> * [v2 (current version)](how-to-mltable.md)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]
[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

Azure Machine Learning supports a Table type (`mltable`) that allows for a *blueprint* that defines *how* you would like data files to *materialize* into a Pandas or Spark data frame (rows and columns). Azure Machine Learning Tables have these two key features:

1. **An `MLTable` file.** A YAML-based file that defines the materialization blueprint. In the `MLTable`, you can specify:
    - The storage location(s) of the data - local, in the cloud, or on a public http(s) server. Azure Machine Learning supports *Globbing* patterns. These locations can specify sets of filenames, with wildcard characters (`*`, `?`, `[abc]`, `[a-z]`).
    - *read transformation* - for example, the file format type (delimited text, Parquet, Delta, json), delimiters, headers, etc.
    - Column type conversions (enforce schema).
    - New column creation, using folder structure information - for example, creation of a year and month column, using the `{year}/{month}` folder structure in the path.
    - *Subsets of data* to materialize - for example, filter rows, keep/drop columns, take random samples.
1. **A fast and efficient engine** to materialize the data into a Pandas or Spark dataframe, according to the blueprint defined in the `MLTable` file. The engine relies on [Rust](https://www.rust-lang.org/). The Rust language is known for high speed and high memory efficiency.

In this article you'll learn:

> [!div class="checklist"]
> - When to use Tables instead of Files or Folders.
> - How to install the MLTable SDK.
> - How to define the materialization blueprint using an `MLTable` file.
> - Examples that show use of Tables in Azure Machine Learning.
> - How to use Tables during interactive development (for example, in a notebook).

## Prerequisites

- An Azure subscription. Create a free account before you begin if you don't already have an Azure subscription. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

- The [Azure Machine Learning SDK for Python](https://aka.ms/sdk-v2-install).

- An Azure Machine Learning workspace.


## When to use tables instead of files or folders
Tabular data *doesn't* require Azure Machine Learning Tables (`mltable`). You can use Azure Machine Learning File (`uri_file`) and Folder (`uri_folder`) types, and provide your own parsing logic, to materialize the data into a Pandas or Spark data frame. In cases where you have a simple CSV file or Parquet folder, you'll find it **easier** to use Azure Machine Learning Files/Folders rather than Tables.

### An example of when *not* to use Azure Machine Learning tables

Let's assume you have a single CSV file on a public http server, and you'd like to read into Pandas. Two lines of Python code can read the data:

```python
import pandas as pd

pd.read_csv("https://azuremlexamples.blob.core.windows.net/datasets/iris.csv")
```

With Azure Machine Learning Tables, you would need to first define the `MLTable` file:

```yml
# /data/iris/MLTable
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json

type: mltable
paths:
    - file: https://azuremlexamples.blob.core.windows.net/datasets/iris.csv

transformations:
    - read_delimited:
        delimiter: ','
        header: all_files_same_headers
```

Before reading into Pandas:

```python
import mltable

# load the folder containing MLTable file
tbl =  mltable.load("/data/iris")
tbl.to_pandas_dataframe()
```

For a simple CSV file, definition of the `MLTable` creates unnecessary extra work. Instead, you'll find Azure Machine Learning Tables (`mltable`) much more useful to deal with these scenarios:

- The schema of your data is complex and/or that schema frequently changes.
- You only need a subset of data (for example: a sample of rows or files, specific columns, etc.).
- AutoML jobs that require tabular data.

### A motivating example for using Azure Machine Learning tables

We explained when to *avoid* Azure Machine Learning Tables. Here, we'll see a motivating example of when Azure Machine Learning Tables can help your workflow. Imagine a scenario where you have many text files in a folder:

```text
├── my_data
│   ├── file1.txt
│   ├── file1_use_this.txt
│   ├── file2.txt
│   ├── file2_use_this.txt
.
.
.
│   ├── file1000.txt
│   ├── file1000_use_this.txt
```

Each text file has this structure:

```text
store_location date zip_code amount x y z staticvar1 stasticvar2 
Seattle 20/04/2022 12324 123.4 true no 0 2 4 
.
.
.
London 20/04/2022 XX358YY 156 true yes 1 2 4
```

The data has these important characteristics:

- Only files with this suffix `_use_this.txt` have the relevant data. We can ignore other file names that don't have that suffix.
- Date data will have this format `DD/MM/YYYY`. It will not have a string format.
- The x, y, z columns are booleans, not strings. Values in the data can be either `yes`/`no`, `1`/`0`, `true`/`false`.
- The store location is an index that is useful for generation of data subsets.
- The file is encoded in `ascii` format.
- Every file in the folder contains the same header.
- The first million records for zip_code are numeric, but later on, they'll become alphanumeric.
- Some static variables in the data aren't useful for machine learning.

You can materialize the above text files into a data frame using Pandas and an Azure Machine Learning Folder (`uri_folder`):

```python
import glob
import datetime
import os
import argparse
import pandas as pd

parser = argparse.ArgumentParser()
parser.add_argument("--input_folder", type=str)
args = parser.parse_args()

path = os.path.join(args.input_folder, "*_use_this.txt")
files = glob.glob(path)

# create empty list
dfl = []

# dict of column types
col_types = {
    "zip": str,
    "date": datetime.date,
    "x": bool,
    "y": bool,
    "z": bool
}

# enumerate files into a list of dfs
for f in files:
    csv = pd.read_table(
        path=f,
        delimiter=" ",
        header=0,
        usecols=["store_location", "zip_code", "date", "amount", "x", "y", "z"],
        dtype=col_types,
        encoding='ascii',
        true_values=['yes', '1', 'true'],
        false_values=['no', '0', 'false']
    )
    dfl.append(csv)

# concatenate the list of dataframes
df = pd.concat(dfl)
# set the index column
df.index_columns("store_location")
```

However, problems can occur when

- **The schema changes (for example, a column name changes):** All consumers of the data must independently update their Python code. Other examples can involve type changes, added / removed columns, encoding change, etc.
- **The data size increases** - If the data becomes too large for Pandas to process, all the consumers of the data will need to switch to a more scalable library (PySpark/Dask).

Azure Machine Learning Tables allow the data asset creator to define the materialization blueprint in a single file. Then, consumers can then easily materialize the data into a data frame. The consumers can avoid the need to write their own Python parsing logic. The creator of the data asset defines an `MLTable` file:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json

type: mltable

# paths are relative to the location of the MLTable file
paths:
    - pattern: ./*_use_this.txt

traits:
    index_columns:
        - "store_location"

transformations:
    - read_delimited:
        encoding: ascii
        header: all_files_same_headers
        delimiter: " "
    - keep_columns: ["store_location", "zip_code", "date", "amount", "x", "y", "z"]
    - convert_column_types:
        - columns: date
          column_type:
            datetime:
                formats:
                    - "%d/%m/%Y"
        - columns: ["x","y","z"] 
          column_type:
            boolean:
                mismatch_as: error
                true_values:
                    - "yes"
                    - "true"
                    - "1"
                false_values:
                    - "no"
                    - "false"
                    - "0"
```

The consumers can materialize the data into data frame with three lines of Python code:

```python
import mltable

tbl = mltable.load("./my_data")
df = tbl.to_pandas_dataframe()
```

In this scenario, Azure Machine Learning Tables, instead of Files or Folders, offers these key benefits:

- Consumers don't need to create their own Python parsing logic to materialize the data into Pandas or Spark.
- One location (the MLTable file) can handle schema changes, to avoid required code changes in multiple locations.

## What is the difference between V2 and V1 APIs?

|Type  |V2 API  |V1 API  |Canonical Scenarios | V2/V1 API Difference
|---------|---------|---------|---------|---------|
|**File**<br>Reference a single file     |    `uri_file`     |   `FileDataset`      |       Read/write a single file - the file can have any format.   |  A type new to V2 APIs. In V1 APIs, files always mapped to a folder on the compute target filesystem; this mapping required an `os.path.join`. In V2 APIs, the single file is mapped. This way, you can refer to that location in your code.   |
|**Folder**<br> Reference a single folder     |     `uri_folder`    |   `FileDataset`      |  You must read/write a folder of parquet/CSV files into Pandas/Spark.<br><br>Deep-learning with images, text, audio, video files located in a folder.       | In V1 APIs, `FileDataset` had an associated engine that could take a file sample from a folder. In V2 APIs, a Folder is a simple mapping to the compute target filesystem. |
|**Table**<br> Reference a data table    |   `mltable`      |     `TabularDataset`    |    You have a complex schema subject to frequent changes, or you need a subset of large tabular data.<br><br>AutoML with Tables.     | In V1 APIs, the Azure Machine Learning back-end stored the data materialization blueprint. This storage location meant that `TabularDataset` only worked if you had an Azure Machine Learning workspace. `mltable` stores the data materialization blueprint in *your* storage. This storage location means you can use it *disconnected to Azure Machine Learning* - for example, local, on-premises. In V2 APIs, you'll find it easier to transition from local to remote jobs. |

## Installing the `mltable` library
MLTable is pre-installed on Compute Instance, Azure Machine Learning Spark, and DSVM. You can install `mltable` Python library with this code:

```bash
pip install mltable
```

> [!NOTE]
> - MLTable is a separate library from `azure-ai-ml`.
> - If you use a Compute Instance/Spark/DSVM, we recommend that you keep the package up-to-date with `pip install -U mltable`
> - MLTable can be used totally ‘disconnected’ to Azure Machine Learning (and the cloud). You can use MLTable anywhere you can get a Python session – for example: locally, Cloud VM, Databricks, Synapse, On-prem server, etc.

## The `MLTable` file

The `MLTable` file is a YAML-based file that defines the materialization blueprint. In the `MLTable` file, you can specify:

- The data storage location(s), which can be local, in the cloud, or on a public http(s) server. *Globbing* patterns are also supported. This way, wildcard characters (`*`, `?`, `[abc]`, `[a-z]`) can specify sets of filenames.
- *read transformation* - for example, the file format type (delimited text, Parquet, Delta, json), delimiters, headers, etc.
- Column type conversions (enforce schema).
- New columns, using folder structure information - for example, create a year and month column using the `{year}/{month}` folder structure in the path.
- *Subsets of data* to materialize - for example, filter rows, keep/drop columns, take random samples.

### File Naming
While the `MLTable` file contains YAML, it needs the **exact** `MLTable` name (no filename extensions).

> [!CAUTION]
> Filename extensions of **yaml** or **yml**, as seen in `MLTable.yaml` or `MLTable.yml`, will cause an `MLTable file not found` error when loading. The MLTable file needs the exact `MLTable` name.

### Authoring `MLTable` files

You can author `MLTable` files with the Python SDK. You can also directly author the MLTable file in an IDE (like VSCode). This example shows an MLTable file authored with the SDK:

```python

import mltable
from mltable import DataType

data_files = {
    'pattern': './*parquet'
}

tbl = mltable.from_parquet_files(path=[data_files])
# add additional transformations
# tbl = tbl.keep_columns()
# tbl = tbl.filter()

# save to local directory
tbl.save("<local_path>")

```

To directly author `MLTable` files, we recommend VSCode, because VSCode can handle auto-complete. Additionally, VSCode handles Azure Cloud Storage increases to your workspace, for seamless `MLTable` file edits on cloud storage.

To enable autocomplete and intellisense for `MLTable` files in VSCode, you'll need to associate the `MLTable` file with yaml.

In VSCode, select **File**>**Preferences**>**Settings**. In the search bar of the Settings tab, type *associations*:

:::image type="content" source="media/how-to-mltable/vscode-mltable.png" alt-text="file association in VSCode":::

Under **File: Associations** select **Add item** and then enter the following:

- Item: MLTable
- Value: yaml

You can then author MLTable files with autocomplete and intellisense, if you include the following schema at the top of your `MLTable` file.

```yml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json
```

> [!TIP]
> The Azure Machine Learning VSCode extension will show the available schemas and autocomplete when you type `$schema:`:
> :::image type="content" source="media/how-to-mltable/vscode-storage-ext-0.png" alt-text="Autocomplete":::

#### Where to store the `MLTable` file
We recommend co-location of the `MLTable` file with the underlying data, for example:

```Text
├── my_data
│   ├── MLTable
│   ├── file_1.txt
.
.
.
│   ├── file_n.txt
```

Co-location of the `MLTable` file with the data ensures a **self-contained *artifact*** that stores all needed resources in that one folder, regardless of whether that folder is stored on your local drive, in your cloud store, or on a public http server.

Since the `MLTable` will co-locate with the data, the `paths` defined in the `MLTable` file should be *relative to the location* of the `MLTable` file.  For example, in the above scenario, where the `MLTable` file is in the same folder as the `txt` data, define the paths as:

```yaml
type: mltable

# paths must be relative to the location of the MLTable file
paths:
  - pattern: ./*.txt

transformations:
  - read_delimited:
      delimiter: ','
      header: all_files_same_headers
```

#### How to co-locate `MLTable` files with data in cloud storage

Typically, you'll author your MLTable file either locally in an IDE (such as VSCode), or with a cloud-based VM such as an Azure Machine Learning Compute Instance. To create a self-contained MLTable *artifact*, you must store the `MLTable` file with the data. If you place your MLTable artifact (data and `MLTable` file) in your local storage, [Create Data asset](#create-a-data-asset) will become the easiest way to upload that artifact to cloud storage because your artifact will automatically upload.

If you already placed your data in cloud storage, you have some options to co-locate your `MLTable` file with the data.

##### Option 1: Directly author `MLTable` in cloud storage with VSCode

VSCode has an **[Azure Storage VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage)** that can directly create and author files on Cloud storage. These steps show how to do it:

1. Install the [Azure Storage VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage).
1. In the left-hand *Activity Bar*, select **Azure**, and find your subscription storage accounts (you can filter the UI by subscriptions):
    :::image type="content" source="media/how-to-mltable/vscode-storage-ext-1.png" alt-text="Screenshot of storage resources.":::
1. Next, navigate to the container (filesystem) that has your data, and select the **Open in Explorer** button:
    :::image type="content" source="media/how-to-mltable/vscode-storage-ext-2.png" alt-text="Screenshot highlighting the container to open in explorer.":::
1. Next, select **Add to Workspace**:
    :::image type="content" source="media/how-to-mltable/vscode-storage-ext-3.png" alt-text="Screenshot highlighting Add to Workspace.":::
1. In the **Explorer**, you can see your data in cloud storage, and it will appear alongside your code files:
1. To author an `MLTable` *in* cloud storage directly, navigate to the folder that contains the data, and then right-select **New File**. Name the file `MLTable` and proceed.
        :::image type="content" source="media/how-to-mltable/vscode-storage-ext-4.png" alt-text="Screenshot highlighting the data folder that will store the MLTable file.":::

##### Option 2: Upload `MLTable` file to cloud storage

The `azcopy` utility - pre-installed on Azure Machine Learning Compute Instance and DSVM - allows you to upload/download files from Azure Storage to your compute instance:

```bash
azcopy login

SOURCE=<path-to-mltable-file> # for example: ./MLTable
DEST=https://<account_name>.blob.core.windows.net/<container>/<path>
azcopy cp $SOURCE $DEST
```

If you author files locally (or in a DSVM), you can use `azcopy` or the [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer/), which allows you to manage files in Azure Storage with a Graphical User Interface (GUI). Once you download and install Azure Storage Explorer, select the storage account and container where you want to upload the `MLTable` file to. Next:

1. On the main pane's toolbar, select **Upload**, and then select **Upload Files**.
    :::image type="content" source="../media/vs-azure-tools-storage-explorer-blobs/blob-upload-files-menu.png" alt-text="Screenshot highlighting upload files.":::
1. In the **Select files to upload** dialog box, select the `MLTable` file you want to upload.
1. Select **Open** to begin the upload.

#### Supported transformations

##### Read transformations

|Read Transformation  | Parameters |
|---------|---------|
|`read_delimited` | `infer_column_types`: Boolean to infer column data types. Defaults to True. Type inference requires that the current compute can access the data source. Currently, type inference will only pull the first 200 rows.<br><br>`encoding`: Specify the file encoding. Supported encodings: `utf8`, `iso88591`, `latin1`, `ascii`, `utf16`, `utf32`, `utf8bom` and `windows1252`. Default encoding: `utf8`.<br><br>`header`: user can choose one of the following options: `no_header`, `from_first_file`, `all_files_different_headers`, `all_files_same_headers`. Defaults to `all_files_same_headers`.<br><br>`delimiter`: The separator used to split columns.<br><br>`empty_as_string`: Specify if empty field values should load as empty strings. The default (False) will read empty field values as nulls. Passing this setting as *True* will read empty field values as empty strings. If the values are converted to numeric or datetime, then this setting has no effect, as empty values will be converted to nulls.<br><Br>`include_path_column`: Boolean to keep path information as column in the table. Defaults to False. This setting is useful when reading multiple files, and you want to know from which file a specific record originated. Additionally, you can keep useful information in the file path.<br><br>`support_multi_line`: By default (`support_multi_line=False`), all line breaks, including line breaks in quoted field values, will be interpreted as a record break. This approach to data reading increases speed, and it offers optimization for parallel execution on multiple CPU cores. However, it may result in silent production of more records with misaligned field values. Set this value to True when the delimited files are known to contain quoted line breaks. |
| `read_parquet` | `include_path_column`: Boolean to keep path information as a table column. Defaults to False. This setting helps when you read multiple files, and you want to know from which file a specific record originated. Additionally, you can keep useful information in the file path. |
| `read_delta_lake` | `timestamp_as_of`: Timestamp to be specified for time-travel on the specific Delta Lake data.<br><br>`version_as_of`: Version to be specified for time-travel on the specific Delta Lake data.
| `read_json_lines` | `include_path_column`: Boolean to keep path information as an MLTable column. Defaults to False. When you read multiple files, this setting helps identify the source file of a specific record. Also, you can keep useful information in the file path.<br><br>`invalid_lines`: How to handle lines that have invalid JSON. Supported values: `error` and `drop`. Defaults to `error`.<br><br>`encoding`: Specify the file encoding. Supported encodings: `utf8`, `iso88591`, `latin1`, `ascii`, `utf16`, `utf32`, `utf8bom` and `windows1252`. Default is `utf8`.

##### Other transformations

|Transformation  | Description |  Example(s)
|---------|---------|---------|
|`convert_column_types`     |   Adds a transformation step to convert the specified columns into their respective specified new types.  Takes parameters `columns` (column names you would like to convert) and `column_type` (the type to which you want to convert).| <code>- convert_column_types:<br>&emsp; &emsp;- columns: [Age]<br>&emsp; &emsp;&emsp; column_type: int</code><br> Convert the Age column to integer.<br><br><code>- convert_column_types:<br>&emsp; &emsp;- columns: date<br>&emsp; &emsp; &emsp;column_type:<br>&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;datetime:<br>&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;formats:<br>&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;- "%d/%m/%Y"</code><br>Convert the date column to the format `dd/mm/yyyy`. Read [`to_datetime`](/python/api/mltable/mltable.datatype#mltable-datatype-to-datetime) for more information about datetime conversion.<br><br><code>- convert_column_types:<br>&emsp; &emsp;- columns: [is_weekday]<br>&emsp; &emsp; &emsp;column_type:<br>&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;boolean:<br>&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;true_values:['yes', 'true', '1']<br>&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;false_values:['no', 'false', '0']</code><br> Convert the is_weekday column to a boolean; yes/true/1 values in the column will map to `True`, and no/false/0 values in the column will map to `False`. Read [`to_bool`](/python/api/mltable/mltable.datatype#mltable-datatype-to-bool) for more information about boolean conversion.
|`drop_columns`     |   Adds a transformation step to remove desired columns from the dataset. | `- drop_columns: ["col1", "col2"]`
| `keep_columns` | Adds a transformation step to keep the specified columns, and remove all others from the dataset. | `- keep_columns: ["col1", "col2"]` |
|`extract_columns_from_partition_format`   |     Adds a transformation step to use the partition information of each path, and extract the information into columns based on the specified partition format.| `- extract_columns_from_partition_format: {column_name:yyyy/MM/dd/HH/mm/ss}` creates a datetime column, where 'yyyy', 'MM', 'dd', 'HH', 'mm' and 'ss' will extract year, month, day, hour, minute and second for the datetime type
|`filter`    |    Filter the data, leaving only the records that match the specified expression.     | `- filter: 'col("temperature") > 32 and col("location") == "UK"'` <br>Only leave rows where the temperature exceeds 32 and the UK is the location. |
|`skip`    | Adds a transformation step to skip the first count rows of this MLTable.   | `- skip: 10`<br> Skip first 10 rows
|`take`     | Adds a transformation step to select the first count rows of this MLTable.       | `- take: 5`<br> Take only the first five rows.
|`take_random_sample`     |    Adds a transformation step to randomly select each row of this MLTable with a probability chance. The probability must be in the range [0, 1]. May optionally set a random seed.     | <code>- take_random_sample:<br>&emsp; &emsp;probability: 0.10<br>&emsp; &emsp;seed:123</code><br> Take a 10 percent random sample of rows using a random seed of 123.

## Create a Data asset

An Azure Machine Learning data asset resembles web browser bookmarks (favorites). Instead of remembering long storage paths (URIs) that point to your most frequently used data, you can create a data asset, and then access that asset with a friendly name.

You can create a Table data asset using:

# [CLI](#tab/cli)

```azurecli
az ml data create --name <name_of_asset> --version 1 --path <folder_with_MLTable> --type mltable
```

> [!NOTE]
> The path points to the **folder** that contains the `MLTable` file. The path can be local or remote (a cloud storage URI). If the path is a local folder, then the folder will automatically be uploaded to the default Azure Machine Learning datastore in the cloud.
That upload will go to the default Azure Machine Learning datastore located in the cloud. Then, the asset is created. If any relative path in the `MLTable` `path` section exists, but the data *isn't* in that folder, the data won't get uploaded.

# [Python](#tab/Python-SDK)

You can create a data asset in Azure Machine Learning with this Python Code:

```python
from azure.ai.ml.entities import Data
from azure.ai.ml.constants import AssetTypes

# my_path must point to folder containing MLTable artifact (MLTable file + data
# Supported paths include:
# local: './<path>'
# blob:  'wasbs://<container_name>@<account_name>.blob.core.windows.net/<path>'
# ADLS gen2: 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>'
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

## An end-to-end example

In this example, you'll author an MLTable file locally, create an asset, and then use the data asset in an Azure Machine Learning job.

### Step 1: Download the data for the example
To complete this end-to-end example, first download a sample of the Green Taxi data from *Azure Open Datasets* into a local data folder:

```bash
mkdir data
cd data
wget https://azureopendatastorage.blob.core.windows.net/nyctlc/green/puYear%3D2013/puMonth%3D8/part-00172-tid-4753095944193949832-fee7e113-666d-4114-9fcb-bcd3046479f3-2742-1.c000.snappy.parquet
```

### Step 2: Create the `MLTable` file

Create an `MLTable` file in the data folder:

# [CLI](#tab/cli)

```bash
cd data
touch MLTable
```

Save the following contents to the `MLTable` file:

```yml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json

paths:
    - pattern: ./*.parquet

transformations:
    - read_parquet
    - take_random_sample:
          probability: 0.5
          seed: 154
```

# [Python](#tab/Python-SDK)

```python
import mltable
import os

# change the working directory to the data directory
os.chdir("./data")

# define the path to the parquet files using a glob pattern
path = {
    'pattern': './*.parquet'
}

# load from parquet files
tbl = mltable.from_parquet_files(paths=[path])

# create a new table with a random sample of 50% of the rows
new_tbl = tbl.take_random_sample(0.5, 154)

# show the first few records
new_tbl.show()

# save MLTable file in the data directory
new_tbl.save(".")
```

---

Next, create a Data asset:

# [CLI](#tab/cli)

Execute the following command

```azurecli
cd .. # come up one level from the data directory
az ml data create --name green-sample --version 1 --type mltable --path ./data
```

# [Python](#tab/Python-SDK)

```python
from azure.ai.ml.entities import Data
from azure.ai.ml.constants import AssetTypes

my_path = './data'

my_data = Data(
    path=my_path,
    type=AssetTypes.MLTABLE,
    name="green-sample",
    version='1'
)

ml_client.data.create_or_update(my_data)
```
---

> [!NOTE]
> Your local data folder - containing the parquet file and MLTable - will automatically upload to cloud storage (default Azure Machine Learning datastore) on asset create.

### Step 4: Create a job

Create a Python script called `read-mltable.py` in an `src` folder that contains:

```python
# ./src/read-mltable.py
import argparse
import mltable

# parse arguments
parser = argparse.ArgumentParser()
parser.add_argument('--input', help='mltable artifact to read')
args = parser.parse_args()

# load mltable
tbl = mltable.load(args.input)

# show table
print(tbl.show())
```

To keep things simple, we only show how to read the table into Pandas, and print the first few records.

Your job will need a Conda file that includes the Python package dependencies. Save that Conda file as `conda_dependencies.yml`:

```yml
# ./conda_dependencies.yml
dependencies:
  - python=3.10
  - pip=21.2.4
  - pip:
      - mltable
      - azureml-dataprep[pandas]
```

Next, submit the job:

# [CLI](#tab/cli)

Create the following job YAML file:

```yml
# mltable-job.yml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json

code: ./src

command: python read-mltable.py --input ${{inputs.my_mltable}}
inputs:
    my_mltable:
      type: mltable
      path: azureml:green-sample:1

compute: cpu-cluster

environment:
  image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04
  conda_file: conda_dependencies.yml
```

In the CLI, create the job:

```azurecli
az ml job create -f mltable-job.yml
```

# [Python](#tab/Python-SDK)

```python
from azure.ai.ml import MLClient, command, Input
from azure.ai.ml.entities import Environment
from azure.identity import DefaultAzureCredential

# Create a client
ml_client = MLClient.from_config(credential=DefaultAzureCredential())

# get the data asset
data_asset = ml_client.data.get(name="green-sample", version="1")

job = command(
    command="python read-mltable.py --input ${{inputs.my_mltable}}",
    inputs={
        "my_mltable": Input(type="mltable",path=data_asset.id)
    },
    compute="cpu-cluster",
    environment=Environment(
        image="mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04",
        conda_file="./conda_dependencies.yml"
    ),
    code="./src"
)

ml_client.jobs.create_or_update(job)
```

---

## `MLTable` file examples

### Delimited Text (a CSV file)

This example assumes you have a CSV file stored in the following Azure Data Lake location:

- `abfss://<filesystem>@<account_name>.dfs.core.windows.net/<folder>/<file-name>.csv`

> [!NOTE]
> You must update the `<>` placeholders for your Azure Data Lake filesystem and account name, along with the path on Azure Data lake to your CSV file.

# [CLI](#tab/cli)
Create an `MLTable` file in the `abfss://<filesystem>@<account_name>.dfs.core.windows.net/<folder>/` location:
    
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json

type: mltable

paths:
  - file: ./<file-name>.csv

transformations:
  - read_delimited:
      delimiter: ',' 
      empty_as_string: false 
      encoding: utf8 
      header: all_files_same_headers
      include_path_column: false 
      infer_column_types: true 
      support_multi_line: false
```

If you don't already use [Option 1: Directly author `MLTable` in cloud storage with VSCode](#option-1-directly-author-mltable-in-cloud-storage-with-vscode), then you can upload your `MLTable` file with `azcopy`:

```bash
SOURCE=<local_path-to-mltable-file>
DEST=https://<account_name>.blob.core.windows.net/<filesystem>/<folder>
azcopy cp $SOURCE $DEST
```

# [Python](#tab/Python-SDK)

```python
import mltable
from mltable import MLTableHeaders, MLTableFileEncoding
from azure.storage.blob import BlobClient
from azure.identity import DefaultAzureCredential

# update the file name
my_path = {
    'file': './<file_name>.csv'
}

tbl = mltable.from_delimited_files(
    paths=[my_path],
    header=MLTableHeaders.all_files_same_headers,
    delimiter=',',
    encoding=MLTableFileEncoding.utf8,
    empty_as_string=False,
    include_path_column=False,
    infer_column_types=True,
    support_multi_line=False)

# save the table to the local file system
local_folder = "local"
tbl.save(local_folder)

# upload the MLTable file to your storage account so that you have an artifact
storage_account_url = "https://<account_name>.blob.core.windows.net"
container_name = "<filesystem>"
data_folder_on_storage = '<folder>'

# get a blob client using default credential
blob_client = BlobClient(
    credential=DefaultAzureCredential(), 
    account_url=storage_account_url, 
    container_name=container_name,
    blob_name=f'{data_folder_on_storage}/MLTable'
)

# upload to cloud storage
with open(f'{local_folder}/MLTable', "rb") as mltable_file:
    blob_client.upload_blob(mltable_file)

```

---

Consumers of the data can load the MLTable artifact into Pandas or Spark with:

# [Pandas](#tab/pandas)

```python
import mltable

# the URI points to the folder containing the MLTable file.
uri = "abfss://<filesystem>@<account_name>.dfs.core.windows.net/<folder>"
tbl = mltable.load(uri)
df = tbl.to_pandas_dataframe()
```

# [Spark](#tab/spark)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

You must ensure that the `mltable` package is installed on the Spark cluster. For more information, read:

- [Interactive Data Wrangling with Apache Spark in Azure Machine Learning (preview)](interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Quickstart: Apache Spark jobs in Azure Machine Learning (preview)](quickstart-spark-jobs.md).

```python
# the URI points to the folder containing the MLTable file.
uri = "abfss://<filesystem>@<account_name>.dfs.core.windows.net/<folder>"

df = spark.read.mltable(uri)
df.show()
```

---

### Parquet

This example assumes that you have a folder of parquet files stored in the following Azure Data Lake location:

- `abfss://<filesystem>@<account_name>.dfs.core.windows.net/<folder>/`

You'd like to take a 20% random sample of rows from all the parquet files in the folder.


# [CLI](#tab/cli)
Create an `MLTable` file in the `abfss://<filesystem>@<account_name>.dfs.core.windows.net/<folder>/` location:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json

type: mltable

paths:
  - pattern: ./*.parquet

transformations:
  - read_parquet:
        include_path_column: false 
  - take_random_sample:
        probability: 0.20
        seed: 132
```

If you don't already use [Option 1: Directly author `MLTable` in cloud storage with VSCode](#option-1-directly-author-mltable-in-cloud-storage-with-vscode), then you can upload your `MLTable` file with `azcopy`:

```bash
SOURCE=<local_path-to-mltable-file>
DEST=https://<account_name>.blob.core.windows.net/<filesystem>/<folder>
azcopy cp $SOURCE $DEST
```

# [Python](#tab/Python-SDK)

```python
import mltable
from mltable import MLTableHeaders, MLTableFileEncoding
from azure.storage.blob import BlobClient
from azure.identity import DefaultAzureCredential

# update the file name
my_path = {
    'pattern': './*.parquet'
}

tbl = mltable.from_parquet_files(paths=[my_path])
tbl = tbl.take_random_sample(probability=0.20, seed=132)

# save the table to the local file system
local_folder = "local"
tbl.save(local_folder)

# upload the MLTable file to your storage account
storage_account_url = "https://<account_name>.blob.core.windows.net"
container_name = "<filesystem>"
data_folder_on_storage = '<folder>'

# get a blob client using default credential
blob_client = BlobClient(
    credential=DefaultAzureCredential(), 
    account_url=storage_account_url, 
    container_name=container_name,
    blob_name=f'{data_folder_on_storage}/MLTable'
)

# upload to cloud storage
with open(f'{local_folder}/MLTable', "rb") as mltable_file:
    blob_client.upload_blob(mltable_file)

```

---

Consumers of the data can load the MLTable artifact into Pandas or Spark with:

# [Pandas](#tab/pandas)

```python
import mltable

# the URI points to the folder containing the MLTable file.
uri = "abfss://<filesystem>@<account_name>.dfs.core.windows.net/<folder>"
tbl = mltable.load(uri)
df = tbl.to_pandas_dataframe()
```

# [Spark](#tab/spark)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

You'll need to ensure the `mltable` package is installed on the Spark cluster. For more information, read:
- [Interactive Data Wrangling with Apache Spark in Azure Machine Learning (preview)](interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Quickstart: Apache Spark jobs in Azure Machine Learning (preview)](quickstart-spark-jobs.md).

```python
# the URI points to the folder containing the MLTable file.
uri = "abfss://<filesystem>@<account_name>.dfs.core.windows.net/<folder>"

df = spark.read.mltable(uri)
df.show()
```

---
    
### Delta Lake

This example assumes that you have a data in an Azure Data Lake Delta format:

- `abfss://<filesystem>@<account_name>.dfs.core.windows.net/<folder>/`

This folder will have the following structure

```Text
├── 📁 <folder>
│   ├── 📁 _change_data
│   ├── 📁 _delta_index
│   ├── 📁 _delta_log
│   ├── 📄 part-0000-XXX.parquet
│   ├── 📄 part-0001-XXX.parquet
```

Also, you'd like to read the data as of a specific timestamp: `2022-08-26T00:00:00Z`.

# [CLI](#tab/cli)

Create an `MLTable` file in the `abfss://<filesystem>@<account_name>.dfs.core.windows.net/<folder>/` location:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json

type: mltable

paths:
- folder: ./

transformations:
 - read_delta_lake:
      timestamp_as_of: '2022-08-26T00:00:00Z'      
```

If you don't use [Option 1: Directly author `MLTable` in cloud storage with VSCode](#option-1-directly-author-mltable-in-cloud-storage-with-vscode), then you can upload your `MLTable` file with `azcopy`:

```bash
SOURCE=<local_path-to-mltable-file>
DEST=https://<account_name>.blob.core.windows.net/<filesystem>/<folder>
azcopy cp $SOURCE $DEST
```

# [Python](#tab/Python-SDK)

```python
import mltable
from mltable import MLTableHeaders, MLTableFileEncoding
from azure.storage.blob import BlobClient
from azure.identity import DefaultAzureCredential

# update the file name
my_path = {
    'folder': './'
}

tbl = mltable.from_delta_lake(
    paths=[my_path], 
    timestamp_as_of='2022-08-26T00:00:00Z'
)

# save the table to the local file system
local_folder = "local"
tbl.save(local_folder)

# upload the MLTable file to your storage account
storage_account_url = "https://<account_name>.blob.core.windows.net"
container_name = "<filesystem>"
data_folder_on_storage = '<folder>'

# get a blob client using default credential
blob_client = BlobClient(
    credential=DefaultAzureCredential(), 
    account_url=storage_account_url, 
    container_name=container_name,
    blob_name=f'{data_folder_on_storage}/MLTable'
)

# upload to cloud storage
with open(f'{local_folder}/MLTable', "rb") as mltable_file:
    blob_client.upload_blob(mltable_file)

```

---

Consumers of the data can load the MLTable artifact into Pandas or Spark with:

# [Pandas](#tab/pandas)

```python
import mltable

# the URI points to the folder containing the MLTable file.
uri = "abfss://<filesystem>@<account_name>.dfs.core.windows.net/<folder>"
tbl = mltable.load(uri)
df = tbl.to_pandas_dataframe()
```

# [Spark](#tab/spark)
[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

You must ensure that the `mltable` package is installed on the Spark cluster. For more information, read:
- [Interactive Data Wrangling with Apache Spark in Azure Machine Learning (preview)](interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Quickstart: Apache Spark jobs in Azure Machine Learning (preview)](quickstart-spark-jobs.md).

```python
# the URI points to the folder containing the MLTable file.
uri = "abfss://<filesystem>@<account_name>.dfs.core.windows.net/<folder>"

df = spark.read.mltable(uri)
df.show()
```

---

## Interactive development with the `mltable` Python SDK 

To access your data during interactive development (for example, in a notebook) without creating an MLTable artifact, use the `mltable` Python SDK. This code sample shows the general format to read data into Pandas, using the `mltable` Python SDK:

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

The `mltable` library supports tabular data reads from different path types:

|Location  | Examples  |
|---------|---------|
|A path on your local computer     | `./home/username/data/my_data`         |
|A path on a public http(s) server    |  `https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv`    |
|A path on Azure Storage    |   `wasbs://<container_name>@<account_name>.blob.core.windows.net/<path>` <br> `abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>`    |
|A long-form Azure Machine Learning datastore  |   `azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<wsname>/datastores/<name>/paths/<path>`      |

> [!NOTE]
> `mltable` handles user credential passthrough for paths on Azure Storage and Azure Machine Learning datastores. If you do not have permission to the data on the underlying storage, you can't access the data.

### Files, folders and globs

`mltable` supports reading from:

- file(s), for example: `abfss://<file_system>@<account_name>.dfs.core.windows.net/my-csv.csv`
- folder(s), for example `abfss://<file_system>@<account_name>.dfs.core.windows.net/my-folder/`
- [glob](https://wikipedia.org/wiki/Glob_(programming)) pattern(s), for example `abfss://<file_system>@<account_name>.dfs.core.windows.net/my-folder/*.csv`
- Or, a combination of files, folders, globbing patterns

The `mltable` flexibility allows for data materialization into a single dataframe, from a combination of local/cloud storage and combinations of files/folder/globs. For example:

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

Update the placeholders (`<>`) in the code snippet with your specific information.

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

Update the placeholders (`<>`) in the code snippet with your specific information.

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

Update the placeholders (`<>`) in the code snippet with your specific information.

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
> To avoid the need to remember the datastore URI format, copy-and-paste the datastore URI from the Studio UI with these steps:
> 1. Select **Data** from the left-hand menu, followed by the **Datastores** tab.
> 1. Select your datastore name, and then **Browse**.
> 1. Find the file/folder you want to read into Pandas, and select the ellipsis (**...**) next to it. Select from the menu **Copy URI**. Select the **Datastore URI** to copy into your notebook/script.
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
This example code shows how `mltable` can use [glob](https://wikipedia.org/wiki/Glob_(programming)) patterns - such as wildcards - to ensure that only the parquet files are read.

##### [ADLS gen2](#tab/adls)

Update the placeholders (`<>`) in the code snippet with your specific information.

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

Update the placeholders (`<>`) in the code snippet with your specific information.

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

Update the placeholders (`<>`) in the code snippet with your specific information.

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
> To avoid the need to remember the datastore URI format, copy-and-paste the datastore URI from the Studio UI with these steps:
> 1. Select **Data** from the left-hand menu, then the **Datastores** tab.
> 1. Select your datastore name, and then **Browse**.
> 1. Find the file/folder you want to read into Pandas, and select the ellipsis (**...**) next to it. Select from the **Copy URI** menu. You can select the **Datastore URI** to copy into your notebook/script.
> :::image type="content" source="media/how-to-access-data-ci/datastore_uri_copy.png" alt-text="Screenshot highlighting the copy of the datastore URI.":::

##### [HTTP Server](#tab/http)

Update the placeholders (`<>`) in the code snippet with your specific information.

> [!IMPORTANT]
> Access at the **folder** level is required to glob the pattern on a public HTTP server.

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
In this section, you'll learn how to access your Azure Machine Learning data assets into Pandas.

#### Table asset

Earlier, if you created a Table asset in Azure Machine Learning (an `mltable`, or a V1 `TabularDataset`), you can load that asset into Pandas with:

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

If you registered a File asset that you want to read into Pandas data frame - for example, a CSV file - use this code:

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

If you registered a Folder asset (`uri_folder` or a V1 `FileDataset`) that you want to read into Pandas data frame - for example, a folder containing CSV file - use this code:

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

## Next steps

- [Read data in a job](how-to-read-write-data-v2.md#read-data-in-a-job)
- [Create data assets](how-to-create-data-assets.md#create-data-assets)
- [Data administration](how-to-administrate-data-authentication.md#data-administration)
