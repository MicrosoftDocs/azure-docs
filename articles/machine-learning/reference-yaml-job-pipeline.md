---
title: 'CLI (v2) pipeline job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) pipeline job YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: update-code3, cliv2
author: cloga
ms.author: lochen
ms.date: 03/06/2024
ms.reviewer: franksolomon
---

# CLI (v2) pipeline job YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

You can find the source JSON schema at https://azuremlschemas.azureedge.net/latest/pipelineJob.schema.json.

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, you can invoke schema and resource completions if you include `$schema` at the top of your file. | | |
| `type` | const | **Required.** The type of job. | `pipeline` | |
| `name` | string | Name of the job. Must be unique across all jobs in the workspace. If omitted, Azure Machine Learning will autogenerate a GUID for the name. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be non-unique within the workspace. If omitted, Azure Machine Learning autogenerates a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | Organize the job under the experiment name. The run record of each job is organized under the corresponding experiment in the "Experiments" tab of the studio. If omitted, Azure Machine Learning defaults `experiment_name` to the name of the working directory where the job was created. | | |
| `tags` | object | Dictionary of tags for the job. | | |
| `settings` | object | Default settings for the pipeline job. Visit [Attributes of the `settings` key](#attributes-of-the-settings-key) for the set of configurable properties. | | |
| `jobs` | object | **Required.** Dictionary of the set of individual jobs to run as steps within the pipeline. These jobs are considered child jobs of the parent pipeline job. <br><br> The key is the name of the step within the context of the pipeline job. This name differs from the unique job name of the child job. The value is the job specification, which can follow the [command job schema](reference-yaml-job-command.md#yaml-syntax) or the [sweep job schema](reference-yaml-job-sweep.md#yaml-syntax). Currently, only command jobs and sweep jobs can be run in a pipeline. Later releases will have support for other job types. | | |
| `inputs` | object | Dictionary of inputs to the pipeline job. The key is a name for the input within the context of the job. The value is the input value. <br><br> The inputs of an individual step job in the pipeline can reference these pipeline inputs with the `${{ parent.inputs.<input_name> }}` expression. For more information about binding the inputs of a pipeline step to the inputs of the top-level pipeline job, visit [Expression syntax for binding inputs and outputs between steps in a pipeline job](reference-yaml-core-syntax.md#binding-inputs-and-outputs-between-steps-in-a-pipeline-job). | | |
| `inputs.<input_name>` | number, integer, boolean, string or object | One of a literal value (of type number, integer, boolean, or string) or an object containing a [job input data specification](#job-inputs). | | |
| `outputs` | object | Dictionary of output configurations of the pipeline job. The key is a name for the output within the context of the job. The value is the output configuration. <br><br> The outputs of an individual step job in the pipeline can reference these pipeline outputs with the `${{ parents.outputs.<output_name> }}` expression. For more information about binding the outputs of a pipeline step to the outputs of the top-level pipeline job, visit the [Expression syntax for binding inputs and outputs between steps in a pipeline job](reference-yaml-core-syntax.md#binding-inputs-and-outputs-between-steps-in-a-pipeline-job). | |
| `outputs.<output_name>` | object | You can leave the object empty. In this case, by default, the output will be of type `uri_folder`, and Azure Machine Learning will system-generate an output location for the output based on this templatized path: `{settings.datastore}/azureml/{job-name}/{output-name}/`. File(s) to the output directory will be written via a read-write mount. To specify a different output mode, provide an object that contains the [job output specification](#job-outputs). | |
| `identity` | object | Accessing of data uses the identity. It can be [User Identity Configuration](#useridentityconfiguration), [Managed Identity Configuration](#managedidentityconfiguration) or None. For UserIdentityConfiguration, the identity of job submitter is used to access input data and write the result to the output folder. Otherwise, UserIdentityConfiguration uses the managed identity of the compute target. | |

### Attributes of the `settings` key

| Key | Type | Description | Default value |
| --- | ---- | ----------- | ------------- |
| `default_datastore` | string | Name of the datastore to use as the default datastore for the pipeline job. This value must be a reference to an existing datastore in the workspace, using the `azureml:<datastore-name>` syntax. Any outputs defined in the `outputs` property of the parent pipeline job or child step jobs are stored in this datastore. If omitted, outputs are stored in the workspace blob datastore. | |
| `default_compute` | string | Name of the compute target to use as the default compute for all the steps in the pipeline. Compute defined at the step level overrides this default compute for that specific step. The `default_compute` value must be a reference to an existing compute in the workspace, using the `azureml:<compute-name>` syntax. | |
| `continue_on_step_failure` | boolean | This setting determines what happens if a step in the pipeline fails. By default, the pipeline will continue to run even if one step fails. This means that any steps that don't depend on the failed step will still execute. However, if you change this setting to **False**, the entire pipeline stops running and any currently running steps will be canceled if one step fails.| `True` |
| `force_rerun` | boolean | Whether to force rerun the whole pipeline. The default value is `False`. This means that by default, the pipeline tries to reuse the output of the previous job if it meets reuse criteria. If set as `True`, all steps in the pipeline will rerun.| `False` |

### Job inputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of job input. Specify `uri_file` for input data that points to a single file source, or `uri_folder` for input data that points to a folder source. For more information, visit [Learn more about data access.](concept-data.md)| `uri_file`, `uri_folder`, `mltable`, `mlflow_model` | `uri_folder` |
| `path` | string | The path to the data to use as input. This can be specified in a few ways: <br><br> - A local path to the data source file or folder, e.g. `path: ./iris.csv`. The data uploads during job submission. <br><br> - A URI of a cloud path to the file or folder to use as the input. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, `adl`. For more information about the use of the `azureml://` URI format, visit [Core yaml syntax](reference-yaml-core-syntax.md). <br><br> - An existing registered Azure Machine Learning data asset to use as the input. To reference a registered data asset, use the `azureml:<data_name>:<data_version>` syntax or `azureml:<data_name>@latest` (to reference the latest version of that data asset), e.g. `path: azureml:cifar10-data:1` or `path: azureml:cifar10-data@latest`. | | |
| `mode` | string | Mode of how the data should be delivered to the compute target. <br><br> For read-only mount (`ro_mount`), the data will be consumed as a mount path. A folder is mounted as a folder and a file is mounted as a file. Azure Machine Learning resolves the input to the mount path. <br><br> For `download` mode, the data is downloaded to the compute target. Azure Machine Learning resolves the input to the downloaded path. <br><br> For just the URL of the storage location of the data artifact or artifacts, instead of mounting or downloading the data itself, use the `direct` mode. This passes in the URL of the storage location as the job input. In this case, you're fully responsible for handling credentials to access the storage. | `ro_mount`, `download`, `direct` | `ro_mount` |

### Job outputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The job output type. For the default `uri_folder` type, the output corresponds to a folder. | `uri_file`, `uri_folder`, `mltable`, `mlflow_model` | `uri_folder` |
| `mode` | string | Mode of the delivery of the output file or files to the destination storage. For read-write mount mode (`rw_mount`), the output directory will be a mounted directory. For the upload mode, the file(s) written are uploaded at the end of the job. | `rw_mount`, `upload` | `rw_mount` |

### Identity configurations

#### UserIdentityConfiguration

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** Identity type.  | `user_identity` |

#### ManagedIdentityConfiguration

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** Identity type.  | `managed` or `managed_identity` |

## Remarks

You can use the `az ml job` command to manage Azure Machine Learning jobs.

## Examples

Visit the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs) for examples. Several are shown here:

## YAML: hello pipeline

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-pipeline.yml":::

## YAML: input/output dependency

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-pipeline-io.yml":::

## YAML: common pipeline job settings

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-pipeline-settings.yml":::

## YAML: top-level input and overriding common pipeline job settings

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-pipeline-abc.yml":::

<!-- ## YAML: model training pipeline

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/cifar-10/job.yml"::: -->

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
- [Create ML pipelines using components](how-to-create-component-pipelines-cli.md)