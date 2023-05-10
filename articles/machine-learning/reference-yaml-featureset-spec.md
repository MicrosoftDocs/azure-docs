---
title: 'CLI (v2) feature set specification YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) featureset spec YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: reference
author: qjxu
ms.author: qiax
ms.reviewer: franksolomon
ms.date: 05/23/2023
ms.custom: cliv2
---

# CLI (v2) feature set specification YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]


[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax


| Key                                                   | Type   | Description                                                                                                                                                                                                                                                       | Allowed values                                                  | Default value |
|-------------------------------------------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|---------------|
| $schema                                               | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including $schema at the top of your file enables you to invoke schema and resource completions.                                                                |                                                                 |               |
| source | object | **Required.** Data source for feature set.                                                                                                                                                                                                                        |                                                                 | |
| source.type | string | **Required.** Type of data source.                                                                                                                                                                                                                                | mltable, csv, parquet, deltaTable                                         | |
| source.path | string | **Required.** Path of the data source. It could be a path to a single file, a folder, or path with wildcard. Only Azure storage and ABFS schema is supported.                                                                                                     |                                                                 | |
| source.timestamp_column | object | **Required.** Timestamp column in source data.                                                                                                                                                                                                                    |                                                                 | |
| source.timestamp_column.name | string | **Required.** The timestamp column name in source data.                                                                                                                                                                                                           |                                                                 | |
| source.timestamp_column.format | string | The timestamp column format. If not provided, leverage Spark to infer the timestamp value.                                                                                                                                                                        |                                                                 | |
| source.source_delay| object | The source data delay. Please refer to [todo: feature-retrieval-concept-todo] for detail.                                                                                                                                                                         |                                                                 | |
| source.source_delay.days | integer | The number of days of the source data delay.                                                                                                                                                                                                                      |                                                                 | |
| source.source_delay.hours | integer | The number of hours of the source data delay.                                                                                                                                                                                                                     |                                                                 | |
| source.source_delay.minutes | integer | The number of minutes of the source data delay.                                                                                                                                                                                                                   |                                                                 | |
| feature_transformation_code | object         | The folder where transformation code definition is located.                                                                                                                                                                                                       |                                                                 | |
| feature_transformation_code.path | string | The relative path within featureset spec folder to find the transformer code folder.                                                                                                                                                                              |                                                                 | |
| feature_transformation_code.transformer_class | string | This is a spark ml transformer class in the format of `{module_name}.{transformer_class_name}`. The system expects to find a `{module_name}.py` file under the `feature_transformation_code.path`. The `{transformer_class_name}` is defined in this python file. |                                                                 | |
| features | list of object | **Required.** The features for this feature set.                                                                                                                                                                                                                  |                                                                 | |
| features.name | string | **Required.** The feature name.                                                                                                                                                                                                                                   |                                                                 | |
| features.type| string | **Required.** The feature data type.                                                                                                                                                                                                                              | string, integer, long, float, double, binary, datetime, boolean | |
| index_columns | list of object | **Required.** The index columns for the features. The source data should contain these columns.                                                                                                                                                                   |                                                                 | |
| index_columns.name| string | **Required.** The index column name.                                                                                                                                                                                                                              |                                                                 | |
| index_columns.type | string | **Required.** The index column data type.                                                                                                                                                                                                                         | string, integer, long, float, double, binary, datetime, boolean | |
| source_lookback | object | The look back time window for source data. Please refer to [todo: feature-retrieval-concept-todo] for detail.                                                                                                                                                     |                                                                 | |
| source_lookback.days | integer | The number of days of the source look back.                                                                                                                                                                                                                       |                                                                 | |
| source_lookback.hours | integer | The number of hours of the source look back.                                                                                                                                                                                                                      |                                                                 | |
| source_lookback.minutes | integer | The number of minutes of the source look back.                                                                                                                                                                                                                    |                                                                 | |
| temporal_join_lookback| object | The look back time window when doing point-of-time join. Please refer to [todo: feature-retrieval-concept-todo] for detail.                                                                                                                                       |                                                                 | |
| temporal_join_lookback.days | integer | The number of days of the temporal join lookback.                                                                                                                                                                                                                 |                                                                 | |
| temporal_join_lookback.hours | integer | The number of hours of the temporal join lookback.                                                                                                                                                                                                                |                                                                 | |
| temporal_join_lookback.minutes | integer | The number of minutes of the temporal join lookback.                                                                                                                                                                                                              |                                                                 | |

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli). Some common examples are shown below.

### YAML Example without Transformation Code
[todo: azureml-examples/sdk/python/featurestore_sample/featurestore/featuresets/accounts/spec/FeaturesetSpec.yaml]

### YAML Example with Transformation Code
[todo: azureml-examples/sdk/python/featurestore_sample/featurestore/featuresets/transactions/spec/FeaturesetSpec.yaml]

```yaml
$schema: http://azureml/sdk-2-0/FeatureSetSpec.json

source:
  type: parquet
  path: abfs://file_system@account_name.dfs.core.windows.net/datasources/transactions-source/*.parquet
  timestamp_column: # name of the column representing the timestamp.
    name: timestamp
  source_delay:
    days: 0
    hours: 3
    minutes: 0
feature_transformation_code: # [Optional] This transformation logic will be applied on the source to generate features defined in featureset
  path: ./code # relative path within featureset spec folder to transformation code
  transformer_class: transaction_transform.TrsactionFeatureTransformer # a spark ml transformer class, format: {module_name}.{transformer_class_name}
features: # schema and properties of features generated by the feature_transformation_code
  - name: transaction_7d_count
    type: long
  - name: transaction_amount_7d_sum
    type: double
  - name: transaction_amount_7d_avg
    type: double
  - name: transaction_3d_count
    type: long
  - name: transaction_amount_3d_sum
    type: double
  - name: transaction_amount_3d_avg
    type: double
index_columns:
  - name: accountID
    type: string
source_lookback:
  days: 7
  hours: 0
  minutes: 0
temporal_join_lookback:
  days: 1
  hours: 0
  minutes: 0
```

### YAML Example using DeltaTable as Source
[todo: azureml-examples/sdk/python/featurestore_sample/featurestore/featuresets/transactions_deltaTable/spec/FeaturesetSpec.yaml]