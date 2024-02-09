---
title: 'CLI (v2) Azure Arc-enabled Kubernetes online deployment YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Azure Arc-enabled Kubernetes online deployment YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.custom: event-tier1-build-2022, build-2023
ms.topic: reference

author: Bozhong68
ms.author: bozhlin
ms.date: 08/31/2022
ms.reviewer: ssalgado
---

# CLI (v2) Azure Arc-enabled Kubernetes online deployment YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/kubernetesOnlineDeployment.schema.json.

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `name` | string | **Required.** Name of the deployment. <br><br> Naming rules are defined [here](how-to-manage-quotas.md#azure-machine-learning-online-endpoints-and-batch-endpoints).| | |
| `description` | string | Description of the deployment. | | |
| `tags` | object | Dictionary of tags for the deployment. | | |
| `endpoint_name` | string | **Required.** Name of the endpoint to create the deployment under. | | |
| `model` | string or object | The model to use for the deployment. This value can be either a reference to an existing versioned model in the workspace or an inline model specification. <br><br> To reference an existing model, use the `azureml:<model-name>:<model-version>` syntax. <br><br> To define a model inline, follow the [Model schema](reference-yaml-model.md#yaml-syntax). <br><br> As a best practice for production scenarios, you should create the model separately and reference it here. <br><br> This field is optional for [custom container deployment](how-to-deploy-custom-container.md) scenarios.| | |
| `model_mount_path` | string | The path to mount the model in a custom container. Applicable only for [custom container deployment](how-to-deploy-custom-container.md) scenarios. If the `model` field is specified, it's mounted on this path in the container. | | |
| `code_configuration` | object | Configuration for the scoring code logic. <br><br> This field is optional for [custom container deployment](how-to-deploy-custom-container.md) scenarios. | | |
| `code_configuration.code` | string | Local path to the source code directory for scoring the model. | | |
| `code_configuration.scoring_script` | string | Relative path to the scoring file in the source code directory. | | |
| `environment_variables` | object | Dictionary of environment variable key-value pairs to set in the deployment container. You can access these environment variables from your scoring scripts. | | |
| `environment` | string or object | **Required.** The environment to use for the deployment. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification. <br><br> To reference an existing environment, use the `azureml:<environment-name>:<environment-version>` syntax. <br><br> To define an environment inline, follow the [Environment schema](reference-yaml-environment.md#yaml-syntax). <br><br> As a best practice for production scenarios, you should create the environment separately and reference it here. | | |
| `instance_type` | string | The instance type used to place the inference workload. If omitted, the inference workload will be placed on the default instance type of the Kubernetes cluster specified in the endpoint's `compute` field. If specified, the inference workload will be placed on that selected instance type. <br><br> The set of instance types for a Kubernetes cluster is configured via the Kubernetes cluster custom resource definition (CRD), hence they aren't part of the Azure Machine Learning YAML schema for attaching Kubernetes compute.For more information, see [Create and select Kubernetes instance types](./how-to-manage-kubernetes-instance-types.md). | | |
| `instance_count` | integer | The number of instances to use for the deployment. Specify the value based on the workload you expect. This field is only required if you're using the `default` scale type (`scale_settings.type: default`). <br><br> `instance_count` can be updated after deployment creation using `az ml online-deployment update` command. | | |
| `app_insights_enabled` | boolean | Whether to enable integration with the Azure Application Insights instance associated with your workspace. | | `false` |
| `scale_settings` | object | The scale settings for the deployment. The two types of scale settings supported are the `default` scale type and the `target_utilization` scale type. <br><br> With the `default` scale type (`scale_settings.type: default`), you can manually scale the instance count up and down after deployment creation by updating the `instance_count` property. <br><br> To configure the `target_utilization` scale type (`scale_settings.type: target_utilization`), see [TargetUtilizationScaleSettings](#targetutilizationscalesettings) for the set of configurable properties. | | |
| `scale_settings.type` | string | The scale type. | `default`, `target_utilization` | `target_utilization` |
| `data_collector` | object | Data collection settings for the deployment. See [DataCollector](#datacollector) for the set of configurable properties. | | |
| `request_settings` | object | Scoring request settings for the deployment. See [RequestSettings](#requestsettings) for the set of configurable properties. | | |
| `liveness_probe` | object | Liveness probe settings for monitoring the health of the container regularly. See [ProbeSettings](#probesettings) for the set of configurable properties. | | |
| `readiness_probe` | object | Readiness probe settings for validating if the container is ready to serve traffic. See [ProbeSettings](#probesettings) for the set of configurable properties. | | |
| `resources` | object | Container resource requirements. | | |
| `resources.requests` | object | Resource requests for the container. See [ContainerResourceRequests](#containerresourcerequests) for the set of configurable properties. | | |
| `resources.limits` | object | Resource limits for the container. See [ContainerResourceLimits](#containerresourcelimits) for the set of configurable properties. | | |

### RequestSettings

| Key | Type | Description | Default value |
| --- | ---- | ----------- | ------------- |
| `request_timeout_ms` | integer | The scoring timeout in milliseconds. | `5000` |
| `max_concurrent_requests_per_instance` | integer | The maximum number of concurrent requests per instance allowed for the deployment. <br><br> **Do not change this setting from the default value unless instructed by Microsoft Technical Support or a member of the Azure Machine Learning team.** | `1` |
| `max_queue_wait_ms` | integer | The maximum amount of time in milliseconds a request will stay in the queue. | `500` |

### ProbeSettings

| Key | Type | Description | Default value |
| --- | ---- | ----------- | ------------- |
| `period` | integer | How often (in seconds) to perform the probe. | `10` |
| `initial_delay` | integer | The number of seconds after the container has started before the probe is initiated. Minimum value is `1`. | `10` |
| `timeout` | integer | The number of seconds after which the probe times out. Minimum value is `1`. | `2` |
| `success_threshold` | integer | The minimum consecutive successes for the probe to be considered successful after having failed. Minimum value is `1`. | `1` |
| `failure_threshold` | integer | When a probe fails, the system will try `failure_threshold` times before giving up. Giving up in the case of a liveness probe means the container will be restarted. In the case of a readiness probe the container will be marked Unready. Minimum value is `1`. | `30` |

### TargetUtilizationScaleSettings

| Key | Type | Description | Default value |
| --- | ---- | ----------- | ------------- |
| `type` | const | The scale type | `target_utilization` |
| `min_instances` | integer | The minimum number of instances to use. | `1` |
| `max_instances` | integer | The maximum number of instances to scale to. | `1` |
| `target_utilization_percentage` | integer | The target CPU usage for the autoscaler. | `70` |
| `polling_interval` | integer | How often the autoscaler should attempt to scale the deployment, in seconds. | `1` |


### ContainerResourceRequests

| Key | Type | Description |
| --- | ---- | ----------- |
| `cpu` | string | The number of CPU cores requested for the container. |
| `memory` | string | The memory size requested for the container |
| `nvidia.com/gpu` | string | The number of Nvidia GPU cards requested for the container |

### ContainerResourceLimits

| Key | Type | Description |
| --- | ---- | ----------- |
| `cpu` | string | The limit for the number of CPU cores for the container. |
| `memory` | string | The limit for the memory size for the container. |
| `nvidia.com/gpu` | string | The limit for the number of Nvidia GPU cards for the container |

### DataCollector

| Key | Type | Description | Default value |
| --- | ---- | ----------- | ------------- |
| `sampling_rate` | float | The percentage, represented as a decimal rate, of data to collect. For instance, a value of 1.0 represents collecting 100% of data. | `1.0` |
| `rolling_rate` | string | The rate to partition the data in storage. Value can be: Minute, Hour, Day, Month, Year. | `Hour` |
| `collections` | object | Set of individual `collection_name`s and their respective settings for this deployment. | |
| `collections.<collection_name>` | object | Logical grouping of production inference data to collect (example: `model_inputs`). There are two reserved names: `request` and `response`, which respectively correspond to HTTP request and response payload data collection. All other names are arbitrary and definable by the user. <br><br> **Note**: Each `collection_name` should correspond to the name of the `Collector` object used in the deployment `score.py` to collect the production inference data. For more information on payload data collection and data collection with the provided Python SDK, see [Collect data from models in production](how-to-collect-production-data.md). | |
| `collections.<collection_name>.enabled` | boolean | Whether to enable data collection for the specified `collection_name`. | `'False''` |
| `collections.<collection_name>.data.name` | string | The name of the data asset to register with the collected data. | `<endpoint>-<deployment>-<collection_name>` |
| `collections.<collection_name>.data.path` | string | The full Azure Machine Learning datastore path where the collected data should be registered as a data asset. | `azureml://datastores/workspaceblobstore/paths/modelDataCollector/<endpoint_name>/<deployment_name>/<collection_name>` |
| `collections.<collection_name>.data.version` | integer | The version of the data asset to be registered with the collected data in Blob storage. | `1` |

## Remarks

The `az ml online-deployment` commands can be used for managing Azure Machine Learning Kubernetes online deployments.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online).

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
