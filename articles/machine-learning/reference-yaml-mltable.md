---
title: 'CLI (v2) mltable YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) MLTable YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022

author: xunwan
ms.author: xunwan
ms.date: 09/15/2022
ms.reviewer: franksolomon
---

# CLI (v2) mltable YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

`MLTable` is a way to abstract the schema definition for tabular data so that it is easier for consumers of the data to materialize the table into a Pandas/Dask/Spark dataframe.

The ideal scenarios to use mltable are:

- The schema of your data is complex and/or changes frequently.
- You only need a subset of data. (for example: a sample of rows or files, specific columns, etc.)
- AutoML jobs requiring tabular data.
If your scenario does not fit the above, then it is likely that [URIs](reference-yaml-data.md) are a more suitable type.

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/MLTable.schema.json.


> [!Note]
> If you just want to create an data asset for a job or you want to write your own parsing logic in python you could just use `uri_file`, `uri_folder` as mentioned in [CLI (v2) data YAML schema](reference-yaml-data.md).


[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | const | `mltable` to abstract the schema definition for tabular data so that it is easier for consumers of the data to materialize the table into a Pandas/Dask/Spark dataframe | `mltable` | `mltable`|
| `paths` | array | Paths can be a `file` path, `folder` path or `pattern` for paths. `pattern` specifies a search pattern to allow globbing(* and **) of files and folders containing data. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, and `adl`. See [Core yaml syntax](reference-yaml-core-syntax.md) for more information on how to use the `azureml://` URI format. |`file`, `folder`, `pattern`  | |
| `transformations`| array | Defined sequence of transformations that are applied to data loaded from defined paths. |`read_delimited`, `read_parquet` , `read_json_lines` , `read_delta_lake`, `take` to take the first N rows from dataset, `take_random_sample` to take a random sample of records in the dataset approximately by the probability specified, `drop_columns`, `keep_columns`,... || 

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/sdk/python/assets/data). And please find examples below.

## MLTable paths: file
```yaml
type: mltable
paths:
  - file: https://dprepdata.blob.core.windows.net/demo/Titanic2.csv
transformations:
  - take: 1
```

## MLTable paths: pattern
```yaml
type: mltable
paths:
  - pattern: ./*.txt
transformations:
  - read_delimited:
      delimiter: ,
      encoding: ascii
      header: all_files_same_headers
  - columns: [Trip_Pickup_DateTime, Trip_Dropoff_DateTime]
      column_type:
        datetime:
          formats: ['%Y-%m-%d %H:%M:%S']
```

## MLTable transformations
These transformations apply to all mltable-artifact files:

- `take`: Takes the first *n* records of the table
- `take_random_sample`: Takes a random sample of the table where each record has a *probability* of being selected. The user can also include a *seed*.
- `drop_columns`: Drops the specified columns from the table. This transform supports regex so that users can drop columns matching a particular pattern.
- `keep_columns`: Keeps only the specified columns in the table. This transform supports regex so that users can keep columns matching a particular pattern.
- `convert_column_types`
  - `columns`: The column name you want to convert type of.
  - `column_type`: The type you want to convert the column to. For example: string, float, int, or datetime with specified formats.

## MLTable transformations: read_delimited

```yaml
paths:
  - file: https://dprepdata.blob.core.windows.net/demo/Titanic2.csv
transformations:
  - read_delimited:
      infer_column_types: false
      delimiter: ','
      encoding: 'ascii'
      empty_as_string: false
  - take: 10
```

## Delimited files transformations
The following transformations are specific to delimited files.
- infer_column_types: Boolean to infer column data types. Defaults to `True`. Type inference requires that the data source is accessible from the current compute. Currently type inference will only pull first 200 rows. 
- encoding: Specify the file encoding. Supported encodings are `utf8`, `iso88591`, `latin1`, `ascii`, `utf16`, `utf32`, `utf8bom` and `windows1252`. Defaults to `utf8`.
- header: user can choose one of the following options: `no_header`, `from_first_file`, `all_files_different_headers`, `all_files_same_headers`. Defaults to `all_files_same_headers`.
- delimiter: The separator used to split columns.
- empty_as_string: Specify if empty field values should be loaded as empty strings. The default (`False`) will read empty field values as nulls. Passing this setting as `True` will read empty field values as empty strings. If the values are converted to numeric or datetime, then this setting has no effect, as empty values will be converted to nulls.
- include_path_column: Boolean to keep path information as column in the table. Defaults to `False`. This setting is useful when you are reading multiple files, and want to know which file a particular record originated from. And you can also keep useful information in file path.
- support_multi_line: By default (support_multi_line=`False`), all line breaks, including those in quoted field values, will be interpreted as a record break. Reading data this way is faster and more optimized for parallel execution on multiple CPU cores. However, it may result in silently producing more records with misaligned field values. This setting should be set to `True` when the delimited files are known to contain quoted line breaks.

## MLTable transformations: read_json_lines
```yaml
paths:
  - file: ./order_invalid.jsonl
transformations:
  - read_json_lines:
        encoding: utf8
        invalid_lines: drop
        include_path_column: false
```

## MLTable transformations: read_json_lines, convert_column_types
```yaml
paths:
  - file: ./train_annotations.jsonl
transformations:
  - read_json_lines:
        encoding: utf8
        invalid_lines: error
        include_path_column: false
  - convert_column_types:
      - columns: image_url
        column_type: stream_info
```

### Json lines transformations
Only flat Json files are supported.
Below are the supported transformations that are specific for json lines:

- `include_path_column` Boolean to keep path information as column in the MLTable. Defaults to False. This setting is useful when you are reading multiple files, and want to know which file a particular record originated from. And you can also keep useful information in file path.
- `invalid_lines` How to handle lines that are invalid JSON. Supported values are `error` and `drop`. Defaults to `error`.
- `encoding` Specify the file encoding. Supported encodings are `utf8`, `iso88591`, `latin1`, `ascii`, `utf16`, `utf32`, `utf8bom` and `windows1252`. Default is `utf8`.


## MLTable transformations: read_parquet
```yaml
type: mltable
traits:
  index_columns: ID
paths:
  - file: ./crime.parquet
transformations:
  - read_parquet
```
### Parquet files transformations
If the user doesn't define options for `read_parquet` transformation, default options will be selected (see below).

- `include_path_column`: Boolean to keep path information as column in the table. Defaults to False. This setting is useful when you are reading multiple files, and want to know which file a particular record originated from. And you can also keep useful information in file path.

## MLTable transformations: read_delta_lake
```yaml
type: mltable

paths:
- abfss://my_delta_files

transforms:
 - read_delta_lake:
      timestamp_as_of: '2022-08-26T00:00:00Z'
```

### Delta lake transformations

- `timestamp_as_of`: Timestamp to be specified for time-travel on the specific Delta Lake data.
- `version_as_of`: Version to be specified for time-travel on the specific Delta Lake data.

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
