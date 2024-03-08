---
title: 'CLI (v2) feature entity YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) feature entity YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: reference
author: qjxu
ms.author: qiax
ms.reviewer: franksolomon
ms.date: 05/23/2023
ms.custom: cliv2, build-2023
---

# CLI (v2) feature entity YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]


[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax


| Key | Type | Description | Allowed values | Default value |
|--|--|--|--|--|
| $schema | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including $schema at the top of your file enables you to invoke schema and resource completions. |  |  |
| name | string | **Required.** Feature store entity name. |  |  |
| version | string | **Required.** Feature store entity version. |  |  |
| description | string | Feature store entity description. |  |  |
| stage | string | Feature store entity stage. | Development, Production, Archived | Development |
| tags | object | Dictionary of tags for the feature store entity. |  |  |
| index_columns | list of object | **Required.** The index columns of the feature store entity. |  |  |
| index_columns.name | string | **Required.** The index column name. |  |  |
| index_columns.type | string | **Required.** The index column data type. | string, integer, long, float, double, binary, datetime, boolean |  |

## Remarks

The `az ml feature-store-entity` command can be used for managing a feature store entity.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli). A basic example is shown below.

## YAML: basic

```yaml
$schema: http://azureml/sdk-2-0/FeatureStoreEntity.json

name: account
version: "1"
description: This entity represents user account index key accountID.
index_columns:
  - name: accountID
    type: string
tags:
  data_type: nonPII
```

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
- [Troubleshoot managed feature store](troubleshooting-managed-feature-store.md)
