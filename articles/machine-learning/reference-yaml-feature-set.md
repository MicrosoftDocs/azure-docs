---
title: 'CLI (v2) feature set  YAML schema'
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

# CLI (v2) feature set YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/data.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax


| Key                                                   | Type                   | Description                                                                                                                                                                                        | Allowed values                                                                                                                                                                                                                                                                                     | Default value |
|-------------------------------------------------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| $schema                                               | string                 | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including $schema at the top of your file enables you to invoke schema and resource completions. |                                                                                                                                                                                                                                                                                                    |               |
| name                                                  | string                 | **Required.** Feature set name.                                                                                                                                                                    |                                                                                                                                                                                                                                                                                                    |               |
| version                                               | string                 | **Required.** Feature set version.                                                                                                                                                                 |                                                                                                                                                                                                                                                                                                    |               |
| description                                           | string                 | Feature set description.                                                                                                                                                                           |                                                                                                                                                                                                                                                                                                    |               |
| specification                                         | object                 | **Required.** Feature set specification.                                                                                                                                                           |                                                                                                                                                                                                                                                                                                    |               |
| specification.path                                    | string                 | **Required** if specification is configured. Path to the local feature set spec folder.                                                                                                            |                                                                                                                                                                                                                                                                                                    |               |
| entities                                              | object (list of string) | **Required.** The entities that this feature set is associated to.                                                                                                                                 |                                                                                                                                                                                                                                                                                                    |               |
| stage                                                 | string                 | Feature set stage.                                                                                                                                                                                 | Development, Production, Archived                                                                                                                                                                                                                                                                  | Development   |
| tags                                                  | object                 | Dictionary of tags for the feature set.                                                                                                                                                            |                                                                                                                                                                                                                                                                                                    |               |
| materialization_settings                              | object                 | Feature set materialization setting.                                                                                                                                                               |                                                                                                                                                                                                                                                                                                    |               |
| materialization_settings.offline_enabled              | boolean                | Whether materialing feature values to an offline storage is enabled.                                                                                                                               | True, False                                                                                                                                                                                                                                                                                        |               |
| materialization_settings.schedule                     | object                 | The materialization schedule. Please see [definition](https://learn.microsoft.com/en-us/azure/machine-learning/reference-yaml-schedule?view=azureml-api-2)                                         |                                                                                                                                                                                                                                                                                                    |               |
| materialization_settings.schedule.frequency           | string                 | **Required** if schedule is configured. Enum to describe the frequency of a recurrence schedule.                                                                                                   | Day, Hour, Minute, Week, Month                                                                                                                                                                                                                                                                     | day           |
| materialization_settings.schedule.interval            | integer                | **Required** if schedule is configured. The interval between recurrent jobs.                                                                                                                       |                                                                                                                                                                                                                                                                                                    |               |
| materialization_settings.schedule.time_zone | string | The schedule trigger time zone.                                                                                                                                                                    |                                                                                                                                                                                                                                                                                                    |               |
| materialization_settings.schedule.start_time | string | The schedule trigger time.                                                                                                                                                                         |                                                                                                                                                                                                                                                                                                    |               |
| materialization_settings.notification                 | object                 | The materialization notification setting.                                                                                                                                                          |                                                                                                                                                                                                                                                                                                    |               |
| materialization_settings.notification.email_on_status | object (list of string) | **Required** if notification is configured. The email notification is sent when job status matches this setting.                                                                                   | JobFailed, JobCompleted, JobCancelled.                                                                                                                                                                                                                                                             |               |
| materialization_settings.notification.emails          | object (list of string) | **Required** if notification is configured. The email address the notification is sent to.                                                                                                         |                                                                                                                                                                                                                                                                                                    |               |
| materialization_settings.resource                     | object                 | The AzureML spark compute resource used for materialization job.                                                                                                                                   |                                                                                                                                                                                                                                                                                                    |               |
| materialization_settings.resource.instance_type       | string                 | The AzureML spark compute instance type.                                                                                                                                                               | Standard_E4s_v3, Standard_E8s_v3, Standard_E16s_v3, Standard_E32s_v3, Standard_E64s_v3. Please refer to this [document](https://learn.microsoft.com/en-us/azure/machine-learning/interactive-data-wrangling-with-apache-spark-azure-ml?view=azureml-api-2) to get updated list of supported types. |               |
| materialization_settings.spark_configuration          | dictionary     | dictionary of spark configuration                                                                                                                                                                  |                                                                                                                                                                                                                                                                                                    |               |

## Remarks

The `az ml feature-set` command can be used for managing feature set.
## Examples

Examples are available in the [examples GitHub repository](./examples). Several are shown below.

## YAML: basic

[todo: azureml-examples/sdk/python/featurestore_sample/featurestore/featuresets/transactions/featureset_asset.yaml]

```yaml
$schema: http://azureml/sdk-2-0/Featureset.json

name: transactions
version: "1"
description: 7-day and 3-day rolling aggregation of transactions featureset
specification:
  path: ./spec # path to feature set specification folder. Can be local (absolute path or relative path to current location) or cloud uri. Contains FeaturesetSpec.yaml + transformation code
entities: # entities associated with this feature-set
  - azureml:account:1
stage: Development
```

## YAML: with materialization configuration
[todo: azureml-examples/sdk/python/featurestore_sample/featurestore/featuresets/transactions/featureset_asset_materialization.yaml]
```yaml
name: transactions
version: "1"
description: 7-day and 3-day rolling aggregation of transactions featureset
specification:
  path: ./spec # path to feature set specification folder. Can be local (absolute path or relative path to current location) or cloud uri. Contains FeaturesetSpec.yaml + transformation code
entities: # entities associated with this feature-set
  - azureml:account:1
stage: Development
materialization_settings:
    offline_enabled: True
    schedule: # we use existing definition of schedule under job with some constraints. Recurrence pattern will not be supported.
        type: recurrence  # Only recurrence type would be supported
        frequency: day # Will only support day and hours
        interval: 1 #every day
        time_zone: "Pacific Standard Time"
    notification: # We use the existing definition of notification under job
        email_on_status:
        - JobFailed
        emails:
        - qiax@microsoft.com

    resource:
        instance_type: Standard_E8S_V3
    spark_configuration:
        spark.driver.cores: 4
        spark.driver.memory: 36g
        spark.executor.cores: 4
        spark.executor.memory: 36g
        spark.executor.instances: 2
```