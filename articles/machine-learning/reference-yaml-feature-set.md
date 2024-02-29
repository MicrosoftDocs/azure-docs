---
title: 'CLI (v2) feature set YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) feature set YAML schema.
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

# CLI (v2) feature set YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax


| Key | Type | Description | Allowed values | Default value |
|--|--|--|--|--|
| $schema | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including $schema at the top of your file enables you to invoke schema and resource completions. |  |  |
| name | string | **Required.** Feature set name. |  |  |
| version | string | **Required.** Feature set version. |  |  |
| description | string | Feature set description. |  |  |
| specification | object | **Required.** Feature set specification. |  |  |
| specification.path | string | **Required** Path to the local feature set spec folder. |  |  |
| entities | object (list of string) | **Required.** The entities that this feature set is associated to. |  |  |
| stage | string | Feature set stage. | Development, Production, Archived | Development |
| tags | object | Dictionary of tags for the feature set. |  |  |
| materialization_settings | object | Feature set materialization setting. |  |  |
| materialization_settings.offline_enabled | boolean | Whether materializing feature values to an offline storage is enabled. | True, False |  |
| materialization_settings.schedule | object | The materialization schedule. See [CLI (v2) schedule YAML schema](reference-yaml-schedule.md) |  |  |
| materialization_settings.schedule.frequency | string | **Required** if schedule is configured. Enum to describe the frequency of a recurrence schedule. | Day, Hour, Minute, Week, Month | Day |
| materialization_settings.schedule.interval | integer | **Required** if schedule is configured. The interval between recurrent jobs. |  |  |
| materialization_settings.schedule.time_zone | string | The schedule trigger time zone. |  | UTC |
| materialization_settings.schedule.start_time | string | The schedule trigger time. |  |  |
| materialization_settings.notification | object | The materialization notification setting. |  |  |
| materialization_settings.notification.email_on | object (list of string) | **Required** if notification is configured. The email notification is sent when job status matches this setting. | JobFailed, JobCompleted, JobCancelled. |  |
| materialization_settings.notification.emails | object (list of string) | **Required** if notification is configured. The email address the notification is sent to. |  |  |
| materialization_settings.resource | object | The Azure Machine Learning Spark compute resource used for materialization job. |  |  |
| materialization_settings.resource.instance_type | string | Azure Machine Learning Spark compute instance type. | Standard_E4s_v3, Standard_E8s_v3, Standard_E16s_v3, Standard_E32s_v3, Standard_E64s_v3. Refer to  [Interactive Data Wrangling with Apache Spark in Azure Machine Learning (preview)](interactive-data-wrangling-with-apache-spark-azure-ml.md) to get updated list of supported types. |  |
| materialization_settings.spark_configuration | dictionary | dictionary of spark configuration |  |  |

## Remarks

The `az ml feature-set` command can be used for managing feature set.
## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli). Several are shown below.

## YAML: basic

```yaml
$schema: http://azureml/sdk-2-0/Featureset.json

name: transactions
version: "1"
description: 7-day and 3-day rolling aggregation of transactions featureset
specification:
  path: ./spec # path to feature set specification folder. Can be local (absolute path or relative path to current location) or cloud uri. Contains FeatureSetSpec.yaml + transformation code
entities: # entities associated with this feature-set
  - azureml:account:1
stage: Development
```

## YAML: with materialization configuration

```yaml
name: transactions
version: "1"
description: 7-day and 3-day rolling aggregation of transactions featureset
specification:
  path: ./spec # path to feature set specification folder. Can be local (absolute path or relative path to current location) or cloud uri. Contains FeatureSetSpec.yaml + transformation code
entities: # entities associated with this feature-set
  - azureml:account:1
stage: Development
materialization_settings:
    offline_enabled: True
    schedule: # we use existing definition of schedule under job with some constraints. Recurrence pattern will not be supported.
        type: recurrence  # Only recurrence type would be supported
        frequency: Day # Only support Day and Hour
        interval: 1 #every day
        time_zone: "Pacific Standard Time"
    notification: 
        email_on:
        - JobFailed
        emails:
        - alice@microsoft.com

    resource:
        instance_type: Standard_E8S_V3
    spark_configuration:
        spark.driver.cores: 4
        spark.driver.memory: 36g
        spark.executor.cores: 4
        spark.executor.memory: 36g
        spark.executor.instances: 2
```
## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
- [Troubleshoot managed feature store](troubleshooting-managed-feature-store.md)
