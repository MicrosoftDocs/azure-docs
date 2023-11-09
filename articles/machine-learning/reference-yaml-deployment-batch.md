---
title: 'CLI (v2) batch deployment YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) batch deployment YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022
ms.reviewer: mopeakande 
author: santiagxf 
ms.author: fasantia
ms.date: 03/31/2022
---

# CLI (v2) batch deployment YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/batchDeployment.schema.json.

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `name` | string | **Required.** Name of the deployment. | | |
| `description` | string | Description of the deployment. | | |
| `tags` | object | Dictionary of tags for the deployment. | | |
| `endpoint_name` | string | **Required.** Name of the endpoint to create the deployment under. | | |
| `type` | string | **Required.** Type of the bath deployment. Use `model` for [model deployments](concept-endpoints-batch.md#model-deployments) and `pipeline` for [pipeline component deployments](concept-endpoints-batch.md#pipeline-component-deployment). <br><br>**New in version 1.7**. | `model`, `pipeline` | `model` |
| `settings` | object | Configuration of the deployment. See specific YAML reference for model and pipeline component for allowed values. <br><br>**New in version 1.7**. | | |

> [!TIP]
> The key `type` has been introduced in version 1.7 of the CLI extension and above. To fully support backward compatibility, this property defaults to `model`. However, if not explicitly indicated, the key `settings` is not enforced and all the properties for the model deployment settings should be indicated in to root of the YAML specification.

### YAML syntax for model deployments

When `type: model`, the following syntax is enforced:

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `model` | string or object | **Required.** The model to use for the deployment. This value can be either a reference to an existing versioned model in the workspace or an inline model specification. <br><br> To reference an existing model, use the `azureml:<model-name>:<version>` syntax. <br><br> To define a model inline, follow the [Model schema](reference-yaml-model.md#yaml-syntax). <br><br> As a best practice for production scenarios, you should create the model separately and reference it here. | | |
| `code_configuration` | object | Configuration for the scoring code logic. <br><br> This property is not required if your model is in MLflow format. | | |
| `code_configuration.code` | string | The local directory that contains all the Python source code to score the model. | | |
| `code_configuration.scoring_script` | string | The Python file in the above directory. This file must have an `init()` function and a `run()` function. Use the `init()` function for any costly or common preparation (for example, load the model in memory). `init()` is called only once at beginning of process. Use `run(mini_batch)` to score each entry; the value of `mini_batch` is a list of file paths. The `run()` function should return a pandas DataFrame or an array. Each returned element indicates one successful run of input element in the `mini_batch`. For more information on how to author scoring script, see [Understanding the scoring script](batch-inference/how-to-batch-scoring-script.md#understanding-the-scoring-script).| | |
| `environment` | string or object | The environment to use for the deployment. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification. <br><br> This property is not required if your model is in MLflow format. <br><br> To reference an existing environment, use the `azureml:<environment-name>:<environment-version>` syntax. <br><br> To define an environment inline, follow the [Environment schema](reference-yaml-environment.md#yaml-syntax). <br><br> As a best practice for production scenarios, you should create the environment separately and reference it here. | | |
| `compute` | string | **Required.** Name of the compute target to execute the batch scoring jobs on. This value should be a reference to an existing compute in the workspace using the `azureml:<compute-name>` syntax. | | |
| `resources.instance_count` | integer | The number of nodes to use for each batch scoring job. | | `1` |
| `settings` | object | Specific configuration of the model deployment. <br><br>**Changed in version 1.7**. | | |
| `settings.max_concurrency_per_instance` | integer | The maximum number of parallel `scoring_script` runs per instance. | | `1` |
| `settings.error_threshold` | integer | The number of file failures that should be ignored. If the error count for the entire input goes above this value, the batch scoring job is terminated. `error_threshold` is for the entire input and not for individual mini batches. If omitted, any number of file failures is allowed without terminating the job.  | | `-1` |
| `settings.logging_level` | string | The log verbosity level. | `warning`, `info`, `debug` | `info` |
| `settings.mini_batch_size` | integer | The number of files the `code_configuration.scoring_script` can process in one `run()` call. | | `10` |
| `settings.retry_settings` | object | Retry settings for scoring each mini batch. | | |
| `settings.retry_settings.max_retries` | integer | The maximum number of retries for a failed or timed-out mini batch. | | `3` |
| `settings.retry_settings.timeout` | integer | The timeout in seconds for scoring a single mini batch. Use larger values when the mini-batch size is bigger or the model is more expensive to run. | | `30` |
| `settings.output_action` | string | Indicates how the output should be organized in the output file. Use `summary_only` if you are generating the output files as indicated at [Customize outputs in model deployments](how-to-deploy-model-custom-output.md). Use `append_row` if you are returning predictions as part of the `run()` function `return` statement. | `append_row`, `summary_only` | `append_row` |
| `settings.output_file_name` | string | Name of the batch scoring output file. | | `predictions.csv` |
| `settings.environment_variables` | object | Dictionary of environment variable key-value pairs to set for each batch scoring job. | | |

### YAML syntax for pipeline component deployments

When `type: pipeline`, the following syntax is enforced:

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `component` | string or object | **Required.** The pipeline component used for the deployment. This value can be either a reference to an existing versioned pipeline component in the workspace or in a registry, or an inline pipeline specification. <br><br> To reference an existing component, use the `azureml:<component-name>:<version>` syntax. <br><br> To define a pipeline component inline, follow the [Pipeline component schema](reference-yaml-component-pipeline.md#yaml-syntax). <br><br> As a best practice for production scenarios, you should create the component separately and reference it here. <br><br>**New in version 1.7**. | | |
| `settings` | object | Default settings for the pipeline job. See [Attributes of the settings key](reference-yaml-job-pipeline.md#attributes-of-the-settings-key) for the set of configurable properties. <br><br>**New in version 1.7**. | | |

## Remarks

The `az ml batch-deployment` commands can be used for managing Azure Machine Learning batch deployments.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/batch). Some of them are referenced below:

## YAML: MLflow model deployment

A model deployment containing an MLflow model, which doesn't require to indicate `code_configuration` or `environment`:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/heart-classifier-mlflow/deployment-simple/deployment.yml":::

## YAML: Custom model deployment with scoring script

A model deployment indicating the scoring script to use and the environment:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/mnist-classifier/deployment-torch/deployment.yml":::

## YAML: Legacy model deployments

If the attribute `type` is not indicated in the YAML, then a model deployment is inferred. However, the key `settings` will not be available and the properties should be placed in the root of the YAML as indicated in this example. It's **strongly advisable to always specify the property `type`**.

```yml
$schema: https://azuremlschemas.azureedge.net/latest/batchDeployment.schema.json
endpoint_name: heart-classifier-batch
name: classifier-xgboost-mlflow
description: A heart condition classifier based on XGBoost
model: azureml:heart-classifier-mlflow@latest
compute: azureml:batch-cluster
resources:
  instance_count: 2
max_concurrency_per_instance: 2
mini_batch_size: 2
output_action: append_row
output_file_name: predictions.csv
retry_settings:
  max_retries: 3
  timeout: 300
error_threshold: -1
logging_level: info
```

## YAML: Pipeline component deployment (preview)

A simple pipeline component deployment:

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-pipelines/hello-batch/deployment.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
