---
title: 'CLI (v2) pipeline job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) pipeline job YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: lostmygithubaccount
ms.author: copeters
ms.date: 10/21/2021
ms.reviewer: laobri
---

# CLI (v2) pipeline job YAML schema

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/pipelineJob.schema.json.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | const | **Required.** The type of job. | `pipeline` | |
| `name` | string | Name of the job. Must be unique across all jobs in the workspace. If omitted, Azure ML will autogenerate a GUID for the name. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be non-unique within the workspace. If omitted, Azure ML will autogenerate a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | Experiment name to organize the job under. Each job's run record will be organized under the corresponding experiment in the studio's "Experiments" tab. If omitted, Azure ML will default it to the name of the working directory where the job was created. | | |
| `description` | string | Description of the job. | | |
| `tags` | object | Dictionary of tags for the job. | | |
| `settings` | object | Default settings for the pipeline job. See [Attributes of the `settings` key](#attributes-of-the-settings-key) for the set of configurable properties. | | |
| `jobs` | object | **Required.** Dictionary of the set of individual jobs to run as steps within the pipeline. These jobs are considered child jobs of the parent pipeline job. <br><br> The key is the name of the step within the context of the pipeline job. This name is different from the unique job name of the child job. The value is the job specification, which can follow the [command job schema](reference-yaml-job-command.md#yaml-syntax) or [component job schema](reference-yaml-job-component.md#yaml-syntax). Currently only command jobs and component jobs running command components can be run in a pipeline. Later releases will have support for other job types. | | |
| `inputs` | object | Dictionary of inputs to the pipeline job. The key is a name for the input within the context of the job and the value is the input value. <br><br> These pipeline inputs can be referenced by the inputs of an individual step job in the pipeline using the `${{ inputs.<input_name> }}` expression. | | |
| `inputs.<input_name>` | number, integer, boolean, string, or object | One of a literal value (of type number, integer, boolean, or string), [JobInputUri](#jobinputuri), or [JobInputDataset](#jobinputdataset). | | |
| `outputs` | object | Dictionary of output configurations of the pipeline job. The key is a name for the output within the context of the job and the value is the output configuration. <br><br> These pipeline outputs can be referenced by the outputs of an individual step job in the pipeline using the `${{ outputs.<output_name> }}` expression. | |
| `outputs.<output_name>` | object | You can either specify an optional `mode` or leave the object empty. For each named output specified in the `outputs` dictionary, Azure ML will autogenerate an output location based on the following templatized path: `{default-datastore}/azureml/{job-name}/{output-name}/`. Users will be allowed to provide a custom location in a later release. | |
| `outputs.<output_name>.mode` | string | Mode of how output file(s) will get delivered to the destination storage. For read-write mount mode, the output directory will be a mounted directory. For upload mode, the files written to the output directory will get uploaded at the end of the job. | `rw_mount`, `upload` | `rw_mount` |
| `compute` | string | Name of the default compute target to execute a step job on, if the individual step does not have compute specified. This value must be a reference to an existing compute in the workspace using the `azureml:<compute-name>` syntax. |

### Attributes of the `settings` key

| Key | Type | Description |
| --- | ---- | ----------- |
| `datastore` | string | Name of the datastore to use as the default datastore for the pipeline job. This value must be a reference to an existing datastore in the workspace using the `azureml:<datastore-name>` syntax. Any outputs defined in the `outputs` property of the parent pipeline job or child step jobs will be stored in this datastore. If omitted, outputs will be stored in the workspace blob datastore. |

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

The `az ml job` commands can be used for managing Azure Machine Learning pipeline jobs.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs). Several are shown below.

## YAML: hello pipeline

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-pipeline.yml":::

## YAML: input/output dependency

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-pipeline-io.yml":::

## YAML: common pipeline job settings

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-pipeline-settings.yml":::

## YAML: top-level input and overriding common pipeline job settings

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-pipeline-abc.yml":::

## YAML: model training pipeline

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/cifar-10/job.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
