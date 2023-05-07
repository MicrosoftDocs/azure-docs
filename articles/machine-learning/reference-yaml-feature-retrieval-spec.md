---
title: 'CLI (v2) feature retrieval specification YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) feature store YAML schema.
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

# CLI (v2) feature retrieval specification YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/data.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax


| Key                                              | Type   | Description                                                                                                                        | Allowed values        | Default value |
|--------------------------------------------------|--------|------------------------------------------------------------------------------------------------------------------------------------|-----------------------|---------------|
| serialization_version                            | string | The version to serialize this spec file.                                                                                           |                       |               |
| featurestores                                    | list of object | The feature stores.                                                                                                                | | |
| featurestores.featurestore                       | object | The feature store object.                                                                                                          | | |
| featurestores.featurestore.features              | list of object | The list of features to retrieve from this feature store.                                                                          | | |
| featurestores.featurestore.features.feature_name | string | The feature name.                                                                                                                  | | |
| featurestores.featurestore.features.featureset   | string | The feature name and version in the format of `featureset_name:version`.                                                             | | |
| featurestores.featurestore.location                  | string | The location of the feature store.                                                                                                 | | |
| featurestores.featurestore.uri                       | string | The uri of the feature store in the format of `azureml://subscriptions/{sub_id}/resourceGroups/{rg}/workspaces/{featurestore_name}`. | | |
| featurestores.featurestore.workspace_id              | string | The feature store workspace id.                                                                                                    | | |

## Examples

Examples are available in the [examples GitHub repository](./examples). Several are shown below.

## YAML: basic

[todo: azureml-examples/sdk/python/featurestore_sample/project/train/spec/feature_retrieval_spec.yaml]

```yaml
featurestores:
- features:
  - feature_name: transaction_1d_count
    featureset: transaction1d:1
  - feature_name: transaction_amount_1d_sum
    featureset: transaction1d:1
  location: eastus2euap
  uri: azureml://subscriptions/{sub_id}/resourcegroups/{rg}/workspaces/{ws_name}
  workspace_id: {ws_id}
serialization_version: 1
```