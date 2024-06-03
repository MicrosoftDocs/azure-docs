---
title: 'CLI (v2) Spark job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Spark job YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2023, build-2023
author: ynpandey
ms.author: yogipandey
ms.date: 05/11/2023
ms.reviewer: franksolomon
---

# CLI (v2) Spark job YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

<!--- The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/sparkJob.schema.json. --->

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | const | **Required.** The type of job. | `spark` | |
| `name` | string | Name of the job. Must be unique across all jobs in the workspace. If omitted, Azure Machine Learning autogenerates a GUID for the name. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be nonunique within the workspace. If omitted, Azure Machine Learning autogenerates a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | Experiment name to organize the job under. The run record of each job is organized under the corresponding experiment in the "Experiments" tab of the studio. If omitted, Azure Machine Learning defaults it to the name of the working directory where the job was created. | | |
| `description` | string | Description of the job. | | |
| `tags` | object | Dictionary of tags for the job. | | |
| `code` | string | Local path to the source code directory to be uploaded and used for the job. | | |
| `code` | string | **Required.** The location of the folder that contains source code and scripts for this job. | | |
| `entry` | object | **Required.** The entry point for the job. It could define a `file`. | | |
| `entry.file` | string | The location of the folder that contains source code and scripts for this job. | | |
| `py_files` | object | A list of `.zip`, `.egg`, or `.py` files, to be placed in the `PYTHONPATH`, for successful execution of the job. | | |
| `jars` | object | A list of `.jar` files to include on the Spark driver, and the executor `CLASSPATH`, for successful execution of the job. | | |
| `files` | object | A list of files that should be copied to the working directory of each executor, for successful job execution. | | |
| `archives` | object | A list of archives that should be extracted into the working directory of each executor, for successful job execution. | | |
| `conf` | object | The Spark driver and executor properties. See [Attributes of the `conf` key](#attributes-of-the-conf-key) | | |
| `environment` | string or object | The environment to use for the job. The environment can be either a reference to an existing versioned environment in the workspace or an inline environment specification. <br><br> To reference an existing environment, use the `azureml:<environment_name>:<environment_version>` syntax or `azureml:<environment_name>@latest` (to reference the latest version of an environment). <br><br> To define an environment inline, follow the [Environment schema](./reference-yaml-environment.md#yaml-syntax). Exclude the `name` and `version` properties, because inline environments don't support them. | | |
| `args` | string | The command line arguments that should be passed to the job entry point Python script. These arguments may contain the input data paths, the location to write the output, for example `"--input_data ${{inputs.<input_name>}} --output_path ${{outputs.<output_name>}}"`  | | |
| `resources` | object | The resources to be used by an Azure Machine Learning serverless Spark compute. One of the `compute` or `resources` should be defined. | | |
| `resources.instance_type` | string | The compute instance type to be used for Spark pool. | `standard_e4s_v3`, `standard_e8s_v3`, `standard_e16s_v3`, `standard_e32s_v3`, `standard_e64s_v3`. | |
| `resources.runtime_version` | string | The Spark runtime version. | `3.2`, `3.3` | |
| `compute` | string | Name of the attached Synapse Spark pool to execute the job on. One of the `compute` or `resources` should be defined. | | |
| `inputs` | object | Dictionary of inputs to the job. The key is a name for the input within the context of the job and the value is the input value. <br><br> Inputs can be referenced in the `args` using the `${{ inputs.<input_name> }}` expression. | | |
| `inputs.<input_name>` | number, integer, boolean, string or object | One of a literal value (of type number, integer, boolean, or string) or an object containing a [job input data specification](#job-inputs). | | |
| `outputs` | object | Dictionary of output configurations of the job. The key is a name for the output within the context of the job and the value is the output configuration. <br><br> Outputs can be referenced in the `args` using the `${{ outputs.<output_name> }}` expression. | | |
| `outputs.<output_name>` | object | The Spark job output. Output for a Spark job can be written to either a file or a folder location by providing an object containing the [job output specification](#job-outputs). | | |
| `identity` | object | The identity is used for data accessing. It can be [UserIdentityConfiguration](#useridentityconfiguration), [ManagedIdentityConfiguration](#managedidentityconfiguration) or None. For UserIdentityConfiguration, the identity of job submitter is used to access the input data and write the result to the output folder. Otherwise, [the appropriate identity is based on the Spark compute type](./apache-spark-azure-ml-concepts.md#ensuring-resource-access-for-spark-jobs). | | |

### Attributes of the `conf` key

| Key | Type | Description | Default value |
| --- | ---- | ----------- | ------------- |
| `spark.driver.cores` | integer | The number of cores for the Spark driver. | |
| `spark.driver.memory` | string | Allocated memory for the Spark driver, in gigabytes (GB); for example, `2g`. | |
| `spark.executor.cores` | integer | The number of cores for the Spark executor. | |
| `spark.executor.memory` | string | Allocated memory for the Spark executor, in gigabytes (GB); for example, `2g`. | |
| `spark.dynamicAllocation.enabled` | boolean | Whether or not executors should be dynamically allocated, as a `True` or `False` value. If this property is set `True`, define `spark.dynamicAllocation.minExecutors` and `spark.dynamicAllocation.maxExecutors`. If this property is set to `False`, define `spark.executor.instances`. | `False` |
| `spark.dynamicAllocation.minExecutors` | integer | The minimum number of Spark executors instances, for dynamic allocation. | |
| `spark.dynamicAllocation.maxExecutors` | integer | The maximum number of Spark executors instances, for dynamic allocation. | |
| `spark.executor.instances` | integer | The number of Spark executor instances. | |


### Job inputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of job input. Specify `uri_file` for input data that points to a single file source, or `uri_folder` for input data that points to a folder source. [Learn more about data access.](./concept-data.md)| `uri_file`, `uri_folder` | |
| `path` | string | The path to the data to use as input. The URI of the input data, such as `azureml://`, `abfss://`, or `wasbs://` can be used. For more information about using the `azureml://` URI format, see [Core yaml syntax](./reference-yaml-core-syntax.md). | | |
| `mode` | string | Mode of how the data should be delivered to the compute target. The `direct` mode passes in the storage location URL as the job input. You have full responsibility to handle storage access credentials. | `direct` | |

### Job outputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of job output. | `uri_file`, `uri_folder` | |
| `path` | string | The URI of the input data, such as `azureml://`, `abfss://`, or `wasbs://`. | | |
| `mode` | string | Mode of output file(s) delivery to the destination storage resource. | `direct` |  |

### Identity configurations

#### UserIdentityConfiguration

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** Identity type.  | `user_identity` |

#### ManagedIdentityConfiguration

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** Identity type.  | `managed`|

## Remarks

The `az ml job` commands can be used for managing Azure Machine Learning Spark jobs.

## Examples

See examples at [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/spark). Several are shown next.

## YAML: A standalone Spark job using attached Synapse Spark pool and managed identity

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/spark/attached-spark-standalone-managed-identity.yml":::

## YAML: A standalone Spark job using serverless Spark compute and user identity

<!--- >:::code language="yaml" source="~/azureml-examples-main/cli/jobs/spark/serverless-spark-standalone-user-identity.yaml"::: --->

## Next steps

- [Install and use the CLI (v2)](./how-to-configure-cli.md)
- [Submit Spark jobs in Azure Machine Learning](./how-to-submit-spark-jobs.md)
