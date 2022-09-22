---
title: 'CLI (v2) mltable YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) mltable YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022

author: xunwan
ms.author: xunwan
ms.date: 09/15/2022
ms.reviewer: s-polly
---

# CLI (v2) data YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/MLTable.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | const | `mltable` to abstract the schema definition for tabular data so that it is easier for consumers of the data to materialize the table into a Pandas/Dask/Spark dataframe | `mltable` | `mltable`|
| `paths` | array | Paths can be a `file` path, `folder` path or `pattern` for paths. `pattern` specifies a search pattern to allow globbing of files and folders containing data. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, and `adl`. See [Core yaml syntax](reference-yaml-core-syntax.md) for more information on how to use the `azureml://` URI format. |`file`, `folder`, `pattern`  | |
| `transformations`| array | Defined sequence of transformations that are applied to data loaded from defined paths. |`read_delimited`, `read_parquet` , `read_json_lines` , `take` to take the first N rows from dataset, `take_random_sample` to take a random sample of records in the dataset approximately by the probability specified, `skip` to skip the first N records from top of the dataset, `drop_columns`, `keep_columns`,... || 

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/sdk/assets/data). Several are shown below.


## MLTABLE paths: pattern

```yaml
type: mltable
paths:
  - file: https://dprepdata.blob.core.windows.net/demo/Titanic2.csv
transformations:
  - take: 1
```

## MLTABLE paths: file

```yaml
type: mltable
paths:
  - pattern: ./*.txt
transformations:
  - read_delimited:
      delimiter: ,
      encoding: ascii
      header: all_files_same_headers
```


## MLTABLE transformations: read_delimited

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

## MLTABLE transformations: read_json_lines
```yaml
paths:
  - file: ./order_invalid.jsonl
transformations:
  - read_json_lines:
        encoding: utf8
        invalid_lines: drop
        include_path_column: false
```

## MLTABLE transformations: read_json_lines, convert_column_types
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

## MLTABLE transformations: read_parquet
```yaml
type: mltable
traits:
  index_columns: ID
paths:
  - file: ./crime.parquet
transformations:
  - read_parquet
```

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
