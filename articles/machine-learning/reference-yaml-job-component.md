---
title: 'CLI (v2) component job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) component job YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: mx-iao
ms.author: minxia
ms.date: 10/21/2021
ms.reviewer: laobri
---

# CLI (v2) component job YAML schema

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/commandJob.schema.json.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | const | The type of job. | `component` | |
| `component` | object | **Required.** The component to invoke and run in a job. This value can be either a reference to an existing versioned component in the workspace, an inline component specification, or the local path to a separate component YAML specification file. <br><br> To reference an existing component, use the `azureml:<component-name>:<component-version>` syntax. <br><br> To define a component inline or in a separate YAML file, follow the [Command component schema](reference-yaml-component-command.md#yaml-syntax). Exclude the `name` and `version` properties as they are not applicable for inline component specifications. | | |
| `compute` | string | Name of the compute target to execute the job on. This value should be a reference to an existing compute in the workspace using the `azureml:<compute-name>` syntax. If omitted, Azure ML will use the compute defined in the pipeline job's `compute` property. | | |
| `inputs` | object | Dictionary of inputs to the job. The key corresponds to the name of one of the component inputs and the value is the runtime input value. <br><br> Inputs can be referenced in the `command` using the `${{ inputs.<input_name> }}` expression. | | |
| `inputs.<input_name>` | number, integer, boolean, string, or object | One of a literal value (of type number, integer, boolean, or string), [JobInputUri](#jobinputuri), or [JobInputDataset](#jobinputdataset). You can also reference outputs from another job in same pipeline via `jobs.<COMPONENT_NAME>.outputs.<OUTPUT_NAME>` | | |
| `outputs` | object | Dictionary of output configurations of the job. The key corresponds to the name corresponding to the name of one of the component outputs and the value is the runtime output configuration. <br><br> Outputs can be referenced in the `command` using the `${{ outputs.<output_name> }}` expression. | |
| `outputs.<output_name>` | object | You can either specify an optional `mode` or leave the object empty. For each named output specified in the `outputs` dictionary, Azure ML will autogenerate an output location based on the following templatized path: `{default-datastore}/azureml/{job-name}/{output-name}/`. Users will be allowed to provide a custom location in a later release. | |
| `outputs.<output_name>.mode` | string | Mode of how output file(s) will get delivered to the destination storage. For read-write mount mode, the output directory will be a mounted directory. For upload mode, the files written to the output directory will get uploaded at the end of the job. | `rw_mount`, `upload` | `rw_mount` |
| `overrides` | object | Certain settings of a component can be overridden with different runtime settings when the component is run in a job. For a command component, the `resources` and `distribution` properties can be overridden via `overrides.resources` and `overrides.distribution`. | | |

### Job inputs

#### JobInputUri

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `file` | string | URI to a single file to use as input. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, `adl`. For more information on how to use the `azureml` URI format, see [Core yaml syntax](reference-yaml-core-syntax.md). **One of `file` or `folder` is required.**  | | |
| `folder` | string | URI to a folder to use as input. Supported URI types are `azureml`, `wasbs`, `abfss`, `adl`. For more information on how to use the `azureml` URI format, see [Core yaml syntax](reference-yaml-core-syntax.md). **One of `file` or `folder` is required.**   | | |
| `mode` | string | Mode of how the data should be delivered to the compute target. For read-only mount and read-write mount, the data will be consumed as a mount path. A folder will be mounted as a folder and a file will be mounted as a file. For download mode, the data will be consumed as a downloaded path. | `ro_mount`, `rw_mount`, `download` | `ro_mount` |

#### JobInputDataset

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `dataset` | string or object | **Required.** A dataset to use as input. This value can be either a reference to an existing versioned dataset in the workspace or an inline dataset specification. <br><br> To reference an existing dataset, use the `azureml:<dataset-name>:<dataset-version>` syntax. <br><br> To define a dataset inline, follow the [Dataset schema](reference-yaml-dataset.md#yaml-syntax). Exclude the `name` and `version` properties as they are not supported for inline datasets. | | |
| `mode` | string | Mode of how the dataset should be delivered to the compute target. For read-only mount, the dataset will be consumed as a mount path. A folder will be mounted as a folder and a file will be mounted as the parent folder. For download mode, the dataset will be consumed as a downloaded path. | `ro_mount`, `download` | `ro_mount` |

## Remarks

Component jobs can be run inside pipeline jobs. `az ml job` commands can be used for managing Azure Machine Learning pipeline jobs.

Component jobs currently cannot be run as standalone jobs and can only be run inside pipelines.

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
