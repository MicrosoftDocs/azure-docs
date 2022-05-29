---
title: Data access
titleSuffix: Azure Machine Learning
description: Learn how to connect to your data storage on Azure with Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.reviewer: nibaccam
author: blackmist
ms.author: larryfr
ms.date: 05/11/2022
ms.custom: devx-track-python, data4ml, event-tier1-build-2022
#Customer intent: As an experienced Python developer, I need to securely access my data in my Azure storage solutions and use it to accomplish my machine learning tasks.
---

# Data in Azure Machine Learning

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning developer platform you are using:"]
> * [v1](./v1/concept-data.md)
> * [v2 (current version)](concept-data.md)

Azure Machine Learning makes it easy to connect to your data in the cloud. It provides an abstraction layer over the underlying storage service, so you can securely access and work with your data without having to write code specific to your storage type. Azure Machine Learning also provides the following data capabilities:

*    Interoperability with Pandas and Spark DataFrames
*    Versioning and tracking of data lineage
*    Data labeling (V1 only for now)

You can bring data to Azure Machine Learning 

* Directly from your local machine
* From an existing cloud-based storage service in Azure 

## Securely connect to datastores

Azure Machine Learning datastores securely keep the connection information to your data storage on Azure, so you don't have to code it in your scripts. 

You can access your data and create datastores with, 
* [Credential-based data authentication](how-to-access-data.md), like a service principal or shared access signature (SAS) token. These credentials can be accessed by users who have *Reader* access to the workspace. 
* Identity-based data authentication to connect to storage services with your Azure Active Directory ID. 

The following table summarizes which cloud-based storage services in Azure can be registered as datastores and what authentication type can be used to access them. 

Supported storage service | Credential-based authentication | Identity-based authentication
|---|:----:|:---:|
Azure Blob Container| ✓ | ✓|
Azure File Share| ✓ | |
Azure Data Lake Gen1 | ✓ | ✓|
Azure Data Lake Gen2| ✓ | ✓|

## Accessing data using URIs
A URI represents a storage location on your local computer, an attached Datastore, blob/ADLS storage, or a publicly available http(s) location. In addition to local paths (for example: `./path_to_my_data/`), several different protocols are supported for cloud storage locations:

- `http(s)` - Private/Public Azure Blob Storage Locations, or publicly available http(s) location
- `abfs(s)` - Azure Data Lake Storage Gen2 storage location
- `azureml` - A registered Azure Machine Learning Datastore Location

Azure Machine Learning distinguishes two types of URIs:

Data type | Description | Examples
---|------|---
`uri_file` | Refers to a specific file | `https://<account_name>.blob.core.windows.net/<container_name>/path/file.csv`<br> `azureml://datastores/<datastore_name>/path/file.csv` <br> `abfss://<file_system>@<account_name>.dfs.core.windows.net/path/file.csv`
`uri_folder`| Refers to a specific folder | `https://<account_name>.blob.core.windows.net/<container_name>/path`<br> `azureml://datastores/<datastore_name>/path` <br> `abfss://<file_system>@<account_name>.dfs.core.windows.net/path/`

URIs are mapped to the filesystem on the compute target, hence using URIs is like using files or folders in the command that consumes/produces them.

### Example usage

# [URI File](#tab/uri-file-example)

The following Python code reads a CSV file and prints the first 10 records:

```python
# src/hello_data.py
import argparse
import pandas as pd

parser = argparse.ArgumentParser()
parser.add_argument("--file_path")
args = parser.parse_args()

df = pd.read_csv(args.file_path)
print(df.head(10))
```

To execute this Python code in the cloud, you define a YAML specification file for the job (updating the blob account name, container name, and file path):

```yml
# hello-data-uri-file.yml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
command: |
  python hello_data.py --file_path ${{inputs.my_csv_file}}
code: src
inputs:
  my_csv_file:
    type: uri_file
    path: https://<account_name>.blob.core.windows.net/<container_name>/path/file.csv
    mode: ro_mount
environment: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
compute: azureml:cpu-cluster
```

Then create a job using the CLI:

```azurecli
az ml job create --file hello-data-uri-file.yml
```

# [URI Folder](#tab/uri-folder-example)

The following Python code gets a CSV file from a folder and prints the first 10 records:

```python
# src/hello_data.py
import argparse
import os
import pandas as pd

parser = argparse.ArgumentParser()
parser.add_argument("--folder_path")
args = parser.parse_args()

file_path = os.path.join(args.folder_path, "MY_FILE.csv")

df = pd.read_csv(file_path)
print(df.head(10))
```

To execute this Python code in the cloud, you define a YAML specification file for the job (updating the blob account name, container name, and file path):

```yml
# hello-data-uri-file.yml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
command: |
  python hello_data.py --folder_path ${{inputs.my_csv_folder}}
code: src
inputs:
  my_csv_folder:
    type: uri_folder
    path: https://<account_name>.blob.core.windows.net/<container_name>/path
    mode: ro_mount
environment: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
compute: azureml:cpu-cluster
```

Then execute using the CLI:

```azurecli
az ml job create --file hello-data-uri-file.yml
```

---

## Share and version Data assets

Azure Machine Learning allows you to create and version data assets in a workspace so that other members of your team can easily consume the data asset by using a name/version. For example:


# [Create Data Asset](#tab/cli-data-create-example)
To create a data asset, firstly define a data specification in a YAML file that provides a name, type and path for the data:

```yml
# cloud-folder-https-example.yml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
name: cloud-folder-example
description: Dataset created from folder in cloud using https URL.
type: uri_folder
path: https://<storage_name>.blob.core.windows.net/<container_name>/path
```

Then in the CLI, create the data asset:

```azurecli
az ml data create --file cloud-folder-https-example.yml --version 1
```

# [Consume Data Asset](#tab/cli-data-consume-example)

To consume the registered data in a job, define your job specification in a YAML file the path to be `azureml:<NAME_OF_DATA_ASSET>:<VERSION>`, for example:

```yml
# hello-data-uri-file.yml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
command: |
  ls ${{inputs.sampledata}}
code: src
inputs:
  sampledata:
    type: uri_folder
    path: azureml:cloud-folder-example@latest
environment: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
compute: azureml:cpu-cluster
```

Next, use the CLI to create your job:

```azurecli
az ml job create --file hello-data-uri-file.yml 
```

---

## Define schema for tabular data with `mltable`
Azure Machine Learning provides a capability for you to define schema for tabular data so that it can be materialized into a Pandas/Dask/Spark dataframe. `mltable` makes it easier when you're sharing tabular data assets with team members because the consumers of the asset don't need to write code that parses the data into a dataframe.

> [!TIP]
> The ideal scenarios to use `mltable` are:
> - the schema of your data is complex and/or changes frequently
> - you need to extract a subset of data
> - AutoML jobs requiring tabular data
>
> If your scenario does not fit the above then it is likely that URIs are a more suitable type.

### A motivating example

Imagine a scenario where you have many text files in a folder:

```text
├── my_data
│   ├── file1.csv
│   ├── file1_use_this.csv
│   ├── file2.csv
│   ├── file2_use_this.csv
.
.
.
│   ├── file1000.csv
│   ├── file1000_use_this.csv
```

Each text file has the following structure:

```text
store_location date zip_code amount x y z noise_col1 noise_col2 
Seattle 20/04/2022 12324 123.4 true false true blah blah 
.
.
.
London 20/04/2022 XX358YY 156 true true true blah blah
```

Some interesting features of this data are:

- the data of interest is only in files that have the following suffix: `_use_this.csv` and other file names that don't match should be ignored.
- The date should be represented as a date and not a string.
- The x, y, z columns are booleans, not strings.
- The store location is an index that is useful for generating subsets of data.
- The file is encoded in `ascii` format.
- Every file in the folder contains the same header.
- The first million records for zip_code are numeric but later on you can see they're alphanumeric.
- There are some dummy (noisy) columns in the data that aren't useful for machine learning.

You could materialize the above text files into a dataframe using Pandas and a URI:

```python
import pandas as pd
import glob
import datetime

files = glob.glob("./my_data/*_use_this.csv")

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
        usecols=["store_location", "zip", "date", "amount", "x", "y", "z"],
        dtype=col_types,
        encoding='ascii'
    )
    dfl.append(csv)

# concatenate the list of dataframes
df = pd.concat(dfl)
# set the index column
df.index_columns("store_location")
```

However, it will be the responsibility of the *consumer* of the data asset to parse the schema into a dataframe. In the scenario defined above, that means the consumers of the data will need to independently ascertain the Python code to materialize the data into a dataframe. 

Passing responsibility to the consumer of the data asset will cause problems when:

- **the schema changes (for example,  a column name changes):** All consumers of the data must update their Python code independently. Other examples can be type changes, columns being added/removed, encoding change, etc.
- **the data size increases** - If the data gets too large for Pandas to process, then all the consumers of the data need to switch to a more scalable library (PySpark/Dask).

Under the above two conditions, `mltable` can help because it enables the creator of the data asset to define the schema in a single file and the consumers can materialize the data into a dataframe easily without needing to write Python code to parse the schema. For the above example, the creator of the data asset defines an MLTable file **in the same directory** as the data:

```text
├── my_data
│   ├── MLTable
│   ├── file1.csv
│   ├── file1_use_this.csv
.
.
.
```

The MLTable file has the following definition that articulates how the data should be processed into a dataframe:

```yaml
type: mltable

paths:
    - search_pattern: ./*_use_this.csv

traits:
    - index_columns: store_location

transforms:
    - read_delimited:
        encoding: ascii
        header: all_files_have_same_headers
        delimiter: " "
    - keep_columns: ["store_location", "zip", "date", "amount", "x", "y", "z"]
    - convert_column_types:
        - columns: ["x", "y", "z"]
          to_type: boolean
        - columns: "date"
          to_type: datetime
```

The consumers can read the data into dataframe using three lines of Python code:

```python
import mltable

tbl = mltable.load("./my_data")

# materialize the table into pandas
pdf = tbl.to_pandas_dataframe()

# or Spark!
sdf = tbl.to_spark_dataframe()

# or Dask!
ddf = tbl.to_dask_dataframe()
```

> [!NOTE]
> You need to install the `mltable` library using `pip install mltable`.

If the schema of the data changes, then it can be updated in a single place (the MLTable file) rather than having to make code changes in multiple places.

Just like `uri_file` and `uri_folder`, you can create a data asset with `mltable` types.

## Next steps 

* [How to work with data](how-to-use-data.md)
