---
title: 'CLI (v2) MLtable YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) MLTable YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: reference
ms.custom: cliv2

author: SturgeonMi
ms.author: xunwan
ms.date: 02/14/2024
ms.reviewer: franksolomon
---

# CLI (v2) MLtable YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

You can find the source JSON schema at https://azuremlschemas.azureedge.net/latest/MLTable.schema.json.

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## How to author `MLTable` files

This article presents information about the `MLTable` YAML schema only. For more information about MLTable, including
- `MLTable` file authoring
- MLTable *artifacts* creation
- consumption in Pandas and Spark
- end-to-end examples

visit [Working with tables in Azure Machine Learning](how-to-mltable.md).

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning Visual Studio Code extension to author the YAML file, you can invoke schema and resource completions if you include `$schema` at the top of your file | | |
| `type` | const | `mltable` abstracts the schema definition for tabular data. Data consumers can more easily materialize the table into a Pandas/Dask/Spark dataframe | `mltable` | `mltable`|
| `paths` | array | Paths can be a `file` path, `folder` path, or `pattern` for paths. `pattern` supports *globbing* patterns that specify sets of filenames with wildcard characters (`*`, `?`, `[abc]`, `[a-z]`). Supported URI types: `azureml`, `https`, `wasbs`, `abfss`, and `adl`. Visit [Core yaml syntax](reference-yaml-core-syntax.md) for more information about use of the `azureml://` URI format |`file`<br>`folder`<br>`pattern`  | |
| `transformations`| array | A defined transformation sequence, applied to data loaded from defined paths. Visit [Transformations](#transformations) for more information |`read_delimited`<br>`read_parquet`<br>`read_json_lines`<br>`read_delta_lake`<br>`take`<br>`take_random_sample`<br>`drop_columns`<br>`keep_columns`<br>`convert_column_types`<br>`skip`<br>`filter`<br>`extract_columns_from_partition_format` ||

### Transformations

#### Read transformations

|Read Transformation  | Description | Parameters |
|---------|---------|---------|
|`read_delimited` | Adds a transformation step to read the delimited text file(s) provided in `paths` | `infer_column_types`: Boolean to infer column data types. Defaults to True. Type inference requires that the current compute can access the data source. Currently, type inference only pulls the first 200 rows.<br><br>`encoding`: Specify the file encoding. Supported encodings: `utf8`, `iso88591`, `latin1`, `ascii`, `utf16`, `utf32`, `utf8bom`, and `windows1252`. Default encoding: `utf8`.<br><br>`header`: the user can choose one of these options: `no_header`, `from_first_file`, `all_files_different_headers`, `all_files_same_headers`. Defaults to `all_files_same_headers`.<br><br>`delimiter`: The separator that splits the columns.<br><br>`empty_as_string`: Specifies if empty field values should load as empty strings. The default value (False) reads empty field values as nulls. Passing this setting as *True* reads empty field values as empty strings. For values converted to numeric or datetime data types, this setting has no effect, because empty values are converted to nulls.<br><Br>`include_path_column`: Boolean to keep path information as column in the table. Defaults to False. This setting helps when reading multiple files, and you want to know the originating file for a specific record. Additionally, you can keep useful information in the file path.<br><br>`support_multi_line`: By default (`support_multi_line=False`), all line breaks, including line breaks in quoted field values, are interpreted as a record break. This approach to data reading increases speed, and it offers optimization for parallel execution on multiple CPU cores. However, it might result in silent production of more records with misaligned field values. Set this value to `True` when the delimited files are known to contain quoted line breaks |
| `read_parquet` | Adds a transformation step to read the Parquet formatted file(s) provided in `paths` | `include_path_column`: Boolean to keep the path information as a table column. Defaults to False. This setting helps when you read multiple files, and you want to know the originating file for a specific record. Additionally, you can keep useful information in the file path.<br><br>**NOTE:** MLTable only supports reads of parquet files that have columns consisting of primitive types. Columns containing arrays are **not** supported |
| `read_delta_lake` | Adds a transformation step to read a Delta Lake folder provided in `paths`. You can read the data at a particular timestamp or version | `timestamp_as_of`: String. Timestamp to be specified for time-travel on the specific Delta Lake data. To read data at a specific point in time, the datetime string should have an [RFC-3339/ISO-8601 format](https://wikipedia.org/wiki/ISO_8601) (for example: "2022-10-01T00:00:00Z", "2022-10-01T00:00:00+08:00", "2022-10-01T01:30:00-08:00").<br><br>`version_as_of`: Integer. Version to be specified for time-travel on the specific Delta Lake data.<br><br>**You must provide one value of `timestamp_as_of` or `version_as_of`**
| `read_json_lines` | Adds a transformation step to read the json file(s) provided in `paths` | `include_path_column`: Boolean to keep path information as an MLTable column. Defaults to False. This setting helps when you read multiple files, and you want to know the originating file for a specific record. Additionally, you can keep useful information in the file path<br><br>`invalid_lines`: Determines how to handle lines that have invalid JSON. Supported values: `error` and `drop`. Defaults to `error`<br><br>`encoding`: Specify the file encoding. Supported encodings: `utf8`, `iso88591`, `latin1`, `ascii`, `utf16`, `utf32`, `utf8bom`, and `windows1252`. Defaults to `utf8`

#### Other transformations

|Transformation  | Description | Parameters |  Example(s)
|---------|---------|---------|---------|
|`convert_column_types`     |  Adds a transformation step to convert the specified columns into their respective specified new types | `columns`<br>An array of column names to convert<br><br>`column_type`<br>The type into which you want to convert (`int`, `float`, `string`, `boolean`, `datetime`) | <code>- convert_column_types:<br>&emsp; &emsp;- columns: [Age]<br>&emsp; &emsp;&emsp; column_type: int</code><br> Convert the Age column to integer.<br><br><code>- convert_column_types:<br>&emsp; &emsp;- columns: date<br>&emsp; &emsp; &emsp;column_type:<br>&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;datetime:<br>&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;formats:<br>&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;- "%d/%m/%Y"</code><br>Convert the date column to the format `dd/mm/yyyy`. Read [`to_datetime`](/python/api/mltable/mltable.datatype#mltable-datatype-to-datetime) for more information about datetime conversion.<br><br><code>- convert_column_types:<br>&emsp; &emsp;- columns: [is_weekday]<br>&emsp; &emsp; &emsp;column_type:<br>&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;boolean:<br>&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;true_values:['yes', 'true', '1']<br>&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;false_values:['no', 'false', '0']</code><br> Convert the is_weekday column to a boolean; yes/true/1 values in the column map to `True`, and no/false/0 values in the column map to `False`. Read [`to_bool`](/python/api/mltable/mltable.datatype#mltable-datatype-to-bool) for more information about boolean conversion
|`drop_columns`     |   Adds a transformation step to remove specific columns from the dataset | An array of column names to drop | `- drop_columns: ["col1", "col2"]`
| `keep_columns` | Adds a transformation step to keep the specified columns, and remove all others from the dataset | An array of column names to preserve | `- keep_columns: ["col1", "col2"]` |
|`extract_columns_from_partition_format`   |     Adds a transformation step to use the partition information of each path, and then extract them into columns based on the specified partition format.| partition format to use |`- extract_columns_from_partition_format: {column_name:yyyy/MM/dd/HH/mm/ss}` creates a datetime column, where 'yyyy', 'MM', 'dd', 'HH', 'mm' and 'ss' are used to extract year, month, day, hour, minute, and second values for the datetime type |
|`filter`    |    Filter the data, leaving only the records that match the specified expression.    |  An expression as a string | `- filter: 'col("temperature") > 32 and col("location") == "UK"'` <br>Only leave rows where the temperature exceeds 32, and UK is the location |
|`skip`    | Adds a transformation step to skip the first count rows of this MLTable.   | A count of the number of rows to skip | `- skip: 10`<br> Skip first 10 rows
|`take`     | Adds a transformation step to select the first count rows of this MLTable.       | A count of the number of rows from the top of the table to take | `- take: 5`<br> Take the first five rows.
|`take_random_sample`     |    Adds a transformation step to randomly select each row of this MLTable, with probability chance.     | `probability`<br>The probability of selecting an individual row. Must be in the range [0,1].<br><br>`seed`<br>Optional random seed | <code>- take_random_sample:<br>&emsp; &emsp;probability: 0.10<br>&emsp; &emsp;seed:123</code><br> Take a 10 percent random sample of rows using a random seed of 123

## Examples

Examples of MLTable use. Find more examples at:

- [Working with tables in Azure Machine Learning](how-to-mltable.md)
- the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/sdk/python/assets/data)

### Quickstart
This quickstart reads the famous iris dataset from a public https server. To proceed, you must place the `MLTable` files in a folder. First, create the folder and `MLTable` file with:

```bash
mkdir ./iris
cd ./iris
touch ./MLTable
```

Next, place this content in the `MLTable` file:

```yml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json

type: mltable
paths:
    - file: https://azuremlexamples.blob.core.windows.net/datasets/iris.csv

transformations:
    - read_delimited:
        delimiter: ','
        header: all_files_same_headers
        include_path_column: true
```

You can then materialize into Pandas with:

> [!IMPORTANT]
> You must have the `mltable` Python SDK installed. Install this SDK with:
>
> `pip install mltable`.

```python
import mltable

tbl = mltable.load("./iris")
df = tbl.to_pandas_dataframe()
```

Ensure that the data includes a new column named `Path`. This column contains the `https://azuremlexamples.blob.core.windows.net/datasets/iris.csv` data path.

The CLI can create a data asset:

```azurecli
az ml data create --name iris-from-https --version 1 --type mltable --path ./iris
```

The folder containing the `MLTable` automatically uploads to cloud storage (the default Azure Machine Learning datastore).

> [!TIP]
> An Azure Machine Learning data asset is similar to web browser bookmarks (favorites). Instead of remembering long URIs (storage paths) that point to your most frequently-used data, you can create a data asset, and then access that asset with a friendly name.

### Delimited text files

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json
type: mltable

# Supported paths include:
# local: ./<path>
# blob: wasbs://<container_name>@<account_name>.blob.core.windows.net/<path>
# Public http(s) server: https://<url>
# ADLS gen2: abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/
# Datastore: azureml://subscriptions/<subid>/resourcegroups/<rg>/workspaces/<ws>/datastores/<datastore_name>/paths/<path>

paths:
  - file: abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/ # a specific file on ADLS
  # additional options
  # - folder: ./<folder> a specific folder
  # - pattern: ./*.csv # glob all the csv files in a folder

transformations:
    - read_delimited:
        encoding: ascii
        header: all_files_same_headers
        delimiter: ","
        include_path_column: true
        empty_as_string: false
    - keep_columns: [col1, col2, col3, col4, col5, col6, col7]
    # or you can drop_columns...
    # - drop_columns: [col1, col2, col3, col4, col5, col6, col7]
    - convert_column_types:
        - columns: col1
          column_type: int
        - columns: col2
          column_type:
            datetime:
                formats:
                    - "%d/%m/%Y"
        - columns: [col1, col2, col3] 
          column_type:
            boolean:
                mismatch_as: error
                true_values: ["yes", "true", "1"]
                false_values: ["no", "false", "0"]
      - filter: 'col("col1") > 32 and col("col7") == "a_string"'
      # create a column called timestamp with the values extracted from the folder information
      - extract_columns_from_partition_format: {timestamp:yyyy/MM/dd}
      - skip: 10
      - take_random_sample:
          probability: 0.50
          seed: 1394
      # or you can take the first n records
      # - take: 200
```

### Parquet

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json
type: mltable

# Supported paths include:
# local: ./<path>
# blob: wasbs://<container_name>@<account_name>.blob.core.windows.net/<path>
# Public http(s) server: https://<url>
# ADLS gen2: abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/
# Datastore: azureml://subscriptions/<subid>/resourcegroups/<rg>/workspaces/<ws>/datastores/<datastore_name>/paths/<path>

paths:
  - pattern: azureml://subscriptions/<subid>/resourcegroups/<rg>/workspaces/<ws>/datastores/<datastore_name>/paths/<path>/*.parquet
  
transformations:
  - read_parquet:
        include_path_column: false
  - filter: 'col("temperature") > 32 and col("location") == "UK"'
  - skip: 1000 # skip first 1000 rows
  # create a column called timestamp with the values extracted from the folder information
  - extract_columns_from_partition_format: {timestamp:yyyy/MM/dd}
```

### Delta Lake

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json
type: mltable

# Supported paths include:
# local: ./<path>
# blob: wasbs://<container_name>@<account_name>.blob.core.windows.net/<path>
# Public http(s) server: https://<url>
# ADLS gen2: abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/
# Datastore: azureml://subscriptions/<subid>/resourcegroups/<rg>/workspaces/<ws>/datastores/<datastore_name>/paths/<path>

paths:
- folder: abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/

# NOTE: for read_delta_lake, you are *required* to provide either
# timestamp_as_of OR version_as_of.
# timestamp should be in RFC-3339/ISO-8601 format (for example:
# "2022-10-01T00:00:00Z", "2022-10-01T00:00:00+08:00",
# "2022-10-01T01:30:00-08:00")
# To get the latest, set the timestamp_as_of at a future point (for example: '2999-08-26T00:00:00Z')

transformations:
 - read_delta_lake:
      timestamp_as_of: '2022-08-26T00:00:00Z'
      # alternative:
      # version_as_of: 1   
```
> [!IMPORTANT]
> **Limitation**: `mltable` doesn't support extracting partition keys when reading data from Delta Lake.
> The `mltable` transformation `extract_columns_from_partition_format` won't work when you are reading Delta Lake data via `mltable`.

### JSON
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json
paths:
  - file: ./order_invalid.jsonl
transformations:
  - read_json_lines:
        encoding: utf8
        invalid_lines: drop
        include_path_column: false
```

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
- [Working with tables in Azure Machine Learning](how-to-mltable.md)
