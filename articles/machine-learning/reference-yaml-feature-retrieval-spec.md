---
title: 'CLI (v2) feature retrieval specification YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) feature retrieval specification YAML schema.
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

# CLI (v2) feature retrieval specification YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax


| Key | Type | Description | Allowed values | Default value |
|--|--|--|--|--|
| serialization_version | string | The version to serialize this spec file. | 2 |  |
| featurestores | list of object | The feature stores. |  |  |
| featurestores.featurestore | object | The feature store object. |  |  |
| featurestores.featurestore.features | list of object | The list of features to retrieve from this feature store. |  |  |
| featurestores.featurestore.features.feature_name | string | The feature name. |  |  |
| featurestores.featurestore.features.feature_set | string | The feature name and version in the format of `featureset_name:version`. |  |  |
| featurestores.featurestore.location | string | The location of the feature store. |  |  |
| featurestores.featurestore.uri | string | The URI of the feature store in the format of `azureml://subscriptions/{sub_id}/resourceGroups/{rg}/workspaces/{featurestore_name}`. |  |  |
| featurestores.featurestore.workspace_id | string | The feature store workspace ID. |  |  |

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli). A basic example is shown below.

## YAML: basic

```yaml
featurestores:
- features:
  - feature_name: transaction_1d_count
    feature_set: transaction1d:1
  - feature_name: transaction_amount_1d_sum
    feature_set: transaction1d:1
  location: eastus2euap
  uri: azureml://subscriptions/{sub_id}/resourcegroups/{rg}/workspaces/{ws_name}
  workspace_id: {ws_id}
serialization_version: 1
```

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
- [Troubleshoot managed feature store](troubleshooting-managed-feature-store.md)
