---
title: 'CLI (v2) command component YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) command component YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022
author: cloga
ms.author: lochen
ms.date: 08/08/2022
ms.reviewer: lagayhar
---

# CLI (v2) command component YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/commandComponent.schema.json.



[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | const | The type of component. | `command` | `command` |
| `name` | string | **Required.** Name of the component. Must start with lowercase letter. Allowed characters are lowercase letters, numbers, and underscore(_). Maximum length is 255 characters.| | |
| `version` | string | Version of the component. If omitted, Azure Machine Learning will autogenerate a version. | | |
| `display_name` | string | Display name of the component in the studio UI. Can be non-unique within the workspace. | | |
| `description` | string | Description of the component. | | |
| `tags` | object | Dictionary of tags for the component. | | |
| `is_deterministic` | boolean |This option determines if the component will produce the same output for the same input data. You should usually set this to `false` for components that load data from external sources, such as importing data from a URL. This is because the data at the URL might change over time. | | `true` |
| `command` | string | **Required.** The command to execute. | | |
| `code` | string | Local path to the source code directory to be uploaded and used for the component. | | |
| `environment` | string or object | **Required.** The environment to use for the component. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification. <br><br> To reference an existing environment, use the `azureml:<environment-name>:<environment-version>` syntax. <br><br> To define an environment inline, follow the [Environment schema](reference-yaml-environment.md#yaml-syntax). Exclude the `name` and `version` properties as they aren't supported for inline environments. | | |
| `distribution` | object | The distribution configuration for distributed training scenarios. One of [MpiConfiguration](#mpiconfiguration), [PyTorchConfiguration](#pytorchconfiguration), or [TensorFlowConfiguration](#tensorflowconfiguration). | | |
| `resources.instance_count` | integer | The number of nodes to use for the job. | | `1` |
| `inputs` | object | Dictionary of component inputs. The key is a name for the input within the context of the component and the value is the component input definition. <br><br> Inputs can be referenced in the `command` using the `${{ inputs.<input_name> }}` expression. | | |
| `inputs.<input_name>` | object | The component input definition. See [Component input](#component-input) for the set of configurable properties. | | |
| `outputs` | object | Dictionary of component outputs. The key is a name for the output within the context of the component and the value is the component output definition. <br><br> Outputs can be referenced in the `command` using the `${{ outputs.<output_name> }}` expression. | |
| `outputs.<output_name>` | object | The component output definition. See [Component output](#component-output) for the set of configurable properties. | |

### Distribution configurations

#### MpiConfiguration

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** Distribution type.  | `mpi` |
| `process_count_per_instance` | integer | **Required.** The number of processes per node to launch for the job.  | |

#### PyTorchConfiguration

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** Distribution type.  | `pytorch` | |
| `process_count_per_instance` | integer | The number of processes per node to launch for the job. | |  `1` |

#### TensorFlowConfiguration

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** Distribution type.  | `tensorflow` |
| `worker_count` | integer | The number of workers to launch for the job. | | Defaults to `resources.instance_count`. |
| `parameter_server_count` | integer | The number of parameter servers to launch for the job. | | `0` |

### Component input

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | **Required.** The type of component input. [Learn more about data access](concept-data.md) | `number`, `integer`, `boolean`, `string`, `uri_file`, `uri_folder`, `mltable`, `mlflow_model`| |
| `description` | string | Description of the input. | | |
| `default` | number, integer, boolean, or string | The default value for the input. | | |
| `optional` | boolean | Whether the input is required. If set to `true`, you need use the command includes optional inputs with `$[[]]`| | `false` |
| `min` | integer or number | The minimum accepted value for the input. This field can only be specified if `type` field is `number` or `integer`. | |
| `max` | integer or number | The maximum accepted value for the input. This field can only be specified if `type` field is `number` or `integer`. | |
| `enum` | array | The list of allowed values for the input. Only applicable if `type` field is `string`.| |

### Component output

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | **Required.** The type of component output. | `uri_file`, `uri_folder`, `mltable`, `mlflow_model` | |
| `description` | string | Description of the output. | | |

## Remarks

The `az ml component` commands can be used for managing Azure Machine Learning components.

## Examples

Command component examples are available in the examples GitHub repository. Select examples for are shown below.

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/pipelines-with-components). Several are shown below.

## YAML: Hello world command component

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines-with-components/basics/2a_basic_component/component.yml":::

## YAML: Component with different input types

:::code language="yaml" source="~/azureml-examples-main/cli/assets/component/train.yml":::

### Define optional inputs in command line
When the input is set as `optional = true`, you need use `$[[]]` to embrace the command line with inputs. For example `$[[--input1 ${{inputs.input1}}]`. The command line at runtime may have different inputs.
- If  you're using only specify the required `training_data` and `model_output` parameters, the command line will look like:

```azurecli
python train.py --training_data some_input_path --learning_rate 0.01 --learning_rate_schedule time-based --model_output some_output_path
```

If no value is specified at runtime, `learning_rate` and `learning_rate_schedule` will use the default value.

- If all inputs/outputs provide values during runtime, the command line will look like:
```azurecli
python train.py --training_data some_input_path --max_epocs 10 --learning_rate 0.01 --learning_rate_schedule time-based --model_output some_output_path
```

## Common errors and recommendation

Following are some common errors and corresponding recommended suggestions when you define a component.

| Key | Errors | Recommendation | 
| --- | ---- | ----------- |
|command|1. Only optional inputs can be in `$[[]]`<br> 2. Using `\` to make a new line isn't supported in command.<br>3. Inputs or outputs aren't found.|1. Check that all the inputs or outputs used in command are already defined in the `inputs` and `outputs` sections, and use the correct format for optional inputs `$[[]]` or required ones `${{}}`.<br>2. Don't use `\` to make a new line.|
|environment|1. No definition exists for environment `{envName}` version `{envVersion}`. <br>2. No environment exists for name `{envName}`, version `{envVersion}`.<br>3. Couldn't find asset with ID `{envAssetId}`. |1. Make sure the environment name and version you refer in the component definition exists. <br>2. You need to specify the version if you refer to a registered environment.|
|inputs/outputs|1. Inputs/outputs names conflict with system reserved parameters.<br>2. Duplicated names of inputs or outputs.|1. Don't use any of these reserved parameters as your inputs/outputs name: `path`, `ld_library_path`, `user`, `logname`, `home`, `pwd`, `shell`.<br>2. Make sure names of inputs and outputs aren't duplicated.|

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
- [Create ML pipelines using components (CLI v2)](how-to-create-component-pipelines-cli.md)
