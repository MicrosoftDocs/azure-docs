---
title: 'CLI (v2) pipeline component YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) pipeline component YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2
author: cloga
ms.author: lochen
ms.date: 02/28/2023
ms.reviewer: larryfr
---

# CLI (v2) pipeline component YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/pipelineComponent.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | const | The type of component. | `pipeline` | `pipeline` |
| `name` | string | **Required.** Name of the component. Must start with lowercase letter. Allowed characters are lowercase letters, numbers, and underscore(_). Maximum length is 255 characters.| | |
| `version` | string | Version of the component. If omitted, Azure ML will autogenerate a version. | | |
| `display_name` | string | Display name of the component in the studio UI. Can be non-unique within the workspace. | | |
| `description` | string | Description of the component. | | |
| `tags` | object | Dictionary of tags for the component. | | |
| `settings` | object | Default settings for the pipeline job. See [Attributes of the `settings` key](#attributes-of-the-settings-key) for the set of configurable properties. | | |
| `jobs` | object | **Required.** Dictionary of the set of individual jobs to run as steps within the pipeline. These jobs are considered child jobs of the parent pipeline job. <br><br> The key is the name of the step within the context of the pipeline job. This name is different from the unique job name of the child job. The value is the job specification, which can follow the [command job schema](reference-yaml-job-command.md#yaml-syntax) or [sweep job schema](reference-yaml-job-sweep.md#yaml-syntax). Currently only command jobs and sweep jobs can be run in a pipeline. Later releases will have support for other job types. | | |
| `inputs` | object | Dictionary of inputs to the pipeline job. The key is a name for the input within the context of the job and the value is the input value. <br><br> These pipeline inputs can be referenced by the inputs of an individual step job in the pipeline using the `${{ parent.inputs.<input_name> }}` expression. For more information on how to bind the inputs of a pipeline step to the inputs of the top-level pipeline job, see the [Expression syntax for binding inputs and outputs between steps in a pipeline job](reference-yaml-core-syntax.md#binding-inputs-and-outputs-between-steps-in-a-pipeline-job). | | |
| `inputs.<input_name>` | number, integer, boolean, string or object | One of a literal value (of type number, integer, boolean, or string) or an object containing a [job input data specification](#job-inputs). | | |
| `outputs` | object | Dictionary of output configurations of the pipeline job. The key is a name for the output within the context of the job and the value is the output configuration. <br><br> These pipeline outputs can be referenced by the outputs of an individual step job in the pipeline using the `${{ parents.outputs.<output_name> }}` expression. For more information on how to bind the inputs of a pipeline step to the inputs of the top-level pipeline job, see the [Expression syntax for binding inputs and outputs between steps in a pipeline job](reference-yaml-core-syntax.md#binding-inputs-and-outputs-between-steps-in-a-pipeline-job). | |
| `outputs.<output_name>` | object | You can leave the object empty, in which case by default the output will be of type `uri_folder` and Azure ML will system-generate an output location for the output based on the following templatized path: `{settings.datastore}/azureml/{job-name}/{output-name}/`. File(s) to the output directory will be written via read-write mount. If you want to specify a different mode for the output, provide an object containing the [job output specification](#job-outputs). | |

### Attributes of the `settings` key

| Key | Type | Description | Default value |
| --- | ---- | ----------- | ------------- |
| `default_datastore` | string | Name of the datastore to use as the default datastore for the pipeline job. This value must be a reference to an existing datastore in the workspace using the `azureml:<datastore-name>` syntax. Any outputs defined in the `outputs` property of the parent pipeline job or child step jobs will be stored in this datastore. If omitted, outputs will be stored in the workspace blob datastore. | |
| `default_compute` | string | Name of the compute target to use as the default compute for all steps in the pipeline. If compute is defined at the step level, it will override this default compute for that specific step. This value must be a reference to an existing compute in the workspace using the `azureml:<compute-name>` syntax. | |
| `continue_on_step_failure` | boolean | Whether the execution of steps in the pipeline should continue if one step fails. The default value is `False`, which means that if one step fails, the pipeline execution will be stopped, canceling any running steps. | `False` |

### Component input

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | **Required.** The type of component input. [Learn more about data access](concept-data.md) | `number`, `integer`, `boolean`, `string`, `uri_file`, `uri_folder`, `mltable`, `mlflow_model`, `custom_model`| |
| `description` | string | Description of the input. | | |
| `default` | number, integer, boolean, or string | The default value for the input. | | |
| `optional` | boolean | Whether the input is required. If set to `true`, you need use the command includes optional inputs with `$[[]]`| | `false` |
| `min` | integer or number | The minimum accepted value for the input. This field can only be specified if `type` field is `number` or `integer`. | |
| `max` | integer or number | The maximum accepted value for the input. This field can only be specified if `type` field is `number` or `integer`. | |
| `enum` | array | The list of allowed values for the input. Only applicable if `type` field is `string`.| |

### Component output

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | **Required.** The type of component output. | `uri_file`, `uri_folder`, `mltable`, `mlflow_model`, `custom_model` | |
| `description` | string | Description of the output. | | |

## Remarks

The `az ml component` commands can be used for managing Azure Machine Learning components.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/lochen/pipeline-component-pup/cli/jobs/pipelines-with-components/pipeline_with_pipeline_component).

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
- [Create ML pipelines using components](how-to-create-component-pipelines-cli.md)
