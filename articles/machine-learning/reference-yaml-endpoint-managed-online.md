---
title: 'Managed online endpoints (preview) YAML reference'
titleSuffix: Azure Machine Learning
description: Learn about the YAML files used to deploy models as managed online endpoints
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: rsethur
ms.author: seramasu
ms.date: 08/03/2021
ms.reviewer: laobri
---

# CLI (v2) managed online endpoint YAML schema

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

> [!NOTE]
> A fully specified sample YAML for managed online endpoints is available for [reference](https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.template.yaml)

## Schema

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json. The schema is provided below in JSON and YAML formats for convenience.

# [JSON](#tab/json)

:::code language="json" source="~/azureml-examples-main/cli/.schemas/jsons/latest/managedOnlineEndpoint.schema.json":::

# [YAML](#tab/yaml)

:::code language="yaml" source="~/azureml-examples-main/cli/.schemas/yamls/latest/managedOnlineEndpoint.schema.yml":::

---

## Remarks

| Key | Description |
| --- | --- |
| $schema    | \[__Optional__\] The YAML schema. You can view the schema in the above example in a browser to see all available options in the YAML file.|
| name       | Name of the endpoint. Needs to be unique at the Azure region level.|
| traffic | Percentage of traffic from endpoint to divert to each deployment. Traffic values need to sum to 100. |
| auth_mode | use `key` for key based authentication and `aml_token` for Azure Machine Learning token-based authentication. `key` doesn't expire but `aml_token` does. Get the most recent token with the `az ml endpoint list-keys` command). |
| identity | Used to configure system-assigned and user-assigned managed identities. |
| app_insights_enabled | `True` to enable integration with Azure AppInsights associated with your Azure Machine Learning workspace. `False` by default.
| tags | Dictionary of Azure Tags to be associated with the Endpoint. |
| description | Description of the endpoint. |
| target | If this key isn't defined, the endpoint will be deployed as a managed online endpoint. To use AKS, set the value of this key to the name of the registered compute target, such as `target:azureml:my-aks`. 
| deployments | Contains a list of deployments to be created in the endpoint. In this case, we have only one deployment, named `blue`. |

### Attributes of the `deployments` key
 
| Key | Description |
| --- | --- |
| name  | The name of the deployment. |
| model | The name of the registered model version in the form `model: azureml:my-model:1`. You can also specify model properties inline: `name`, `version`, and `local_path`. The model files will be uploaded and registered automatically. A downside of inline specification is that you must increment the version manually if you want to update the model files.|
| code_configuration.code.local_path | The directory that contains all the Python source code for scoring the model. Nested directories/packages are supported. |
| code_configuration.scoring_script | The Python file in the above scoring directory. This Python code must have an `init()` function and a `run()` function. The function `init()` will be called after the model is created or updated (you can use it to cache the model in memory, and so forth). The `run()` function is called at every invocation of the endpoint to do the actual scoring/prediction. |
| environment | Contains the details of the Azure Machine Learning environment to host the model and code. As a best practice for production, you should separately register the model and environment and specify the registered name and version in the YAML. For example, `environment: azureml:my-env:1`. |
| instance_type | The VM SKU to host your deployment instances. For more information, see [Managed online endpoints supported VM SKUs](reference-managed-online-endpoints-vm-sku-list.md).|
| scale_settings.scale_type | Currently, this value must be `manual`. To scale up or scale down after the endpoint and deployment are created, update the `instance_count` in the YAML and run the command `az ml endpoint update -n $ENDPOINT_NAME --file <yaml filepath>`. |
| scale_settings.instance_count | The number of instances in the deployment. Base the value on the workload you expect. For high availability, Microsoft recommends you set it to at least `3`. |
| scale_settings.min_instances | The minimum number of instances to always be present. |
| scale_settings.max_instances | The maximum number of instances that the deployment can scale to. The quota will be reserved for max_instances. |
| request_settings.request_timeout_ms | The scoring timeout in milliseconds. The default value is 5000 for managed online endpoints. |
| request_settings.max_concurrent_requests_per_instance | The number of maximum concurrent requests per node allowed per deployment. Defaults to 1. __Do not change this setting from the default value of 1 unless instructed by Microsoft Technical Support or a member of Azure Machine Learning team.__ |
| request_settings.max_queue_wait_ms | The maximum amount of time a request will stay in the queue (in milliseconds). Defaults to 500. |
| liveness_probe | Liveness probe monitors the health of the container regularly. |
| liveness_probe.period | How often (in seconds) to perform the liveness probe. Defaults to 10 seconds. Minimum value is 1. |
| liveness_probe.initial_delay | The number of seconds after the container has started before liveness probes are initiated. Defaults to 10. |
| liveness_probe.timeout | The number of seconds after which the liveness probe times out. Defaults to 2 seconds. Minimum value is 1. |
| liveness_probe.failure_threshold | The system will try failure_threshold times before giving up. Defaults to 30. Minimum value is 1. |
| liveness_probe.success_threshold | The minimum consecutive successes for the liveness probe to be considered successful after having failed. Defaults to 1. Minimum value is 1. |
| readiness_probe | Readiness probe validates if the container is ready to serve traffic. The properties and defaults are the same as liveness probe. |
| tags | A dictionary of Azure Tags you want associated with the deployment. |
| description | A description of the deployment. |

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
- Learn how to [deploy a model with a managed online endpoint](how-to-deploy-managed-online-endpoints.md)
- [Troubleshooting managed online endpoints deployment and scoring (preview)](how-to-troubleshoot-managed-online-endpoints.md)
