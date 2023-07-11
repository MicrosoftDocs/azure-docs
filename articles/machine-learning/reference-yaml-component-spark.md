---
title: 'CLI (v2) Spark component YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Spark component YAML schema.
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

# CLI (v2) Spark component YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

<!--- The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/sparkComponent.schema.json. --->

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | const | **Required.** The type of component. | `spark` | |
| `name` | string | **Required.** Name of the component. Must start with lowercase letter. Allowed characters are lowercase letters, numbers, and underscore(_). Maximum length is 255 characters.| | |
| `version` | string | Version of the component. If omitted, Azure Machine Learning autogenerates a version. | | |
| `display_name` | string | Display name of the component in the studio UI. Can be nonunique within the workspace. | | |
| `description` | string | Description of the component. | | |
| `tags` | object | Dictionary of tags for the component. | | |
| `code` | string | **Required.** The location of the folder that contains source code and scripts for the component. | | |
| `entry` | object | **Required.** The entry point for the component. It could define a `file` or a `class_name`. | | |
| `entry.file` | string | The location of the folder that contains source code and scripts for the component. | | |
| `entry.class_name` | string | The name of the class that serves as an entry point for the component. | | |
| `py_files` | object | A list of `.zip`, `.egg`, or `.py` files, to be placed in the `PYTHONPATH`, for successful execution of the job with this component. | | |
| `jars` | object | A list of `.jar` files to include on the Spark driver, and the executor `CLASSPATH`, for successful execution of the job with this component. | | |
| `files` | object | A list of files that should be copied to the working directory of each executor, for successful execution of the job with this component. | | |
| `archives` | object | A list of archives that should be extracted into the working directory of each executor, for successful execution of the job  with this component. | | |
| `conf` | object | The Spark driver and executor properties. See [Attributes of the `conf` key](#attributes-of-the-conf-key) | | |
| `environment` | string or object | The environment to use for the component. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification. <br><br> To reference an existing environment, use the `azureml:<environment_name>:<environment_version>` syntax or `azureml:<environment_name>@latest` (to reference the latest version of an environment). <br><br> To define an environment inline, follow the [Environment schema](./reference-yaml-environment.md#yaml-syntax). Exclude the `name` and `version` properties, because inline environments don't support them. | | |
| `args` | string | The command line arguments that should be passed to the component entry point Python script or class. These arguments may contain the paths of input data and the location to write the output, for example `"--input_data ${{inputs.<input_name>}} --output_path ${{outputs.<output_name>}}"`  | | |
| `inputs` | object | Dictionary of component inputs. The key is a name for the input within the context of the component and the value is the input value. <br><br> Inputs can be referenced in the `args` using the `${{ inputs.<input_name> }}` expression. | | |
| `inputs.<input_name>` | number, integer, boolean, string or object | One of a literal value (of type number, integer, boolean, or string) or an object containing a [component input data specification](#component-inputs). | | |
| `outputs` | object | Dictionary of output configurations of the component. The key is a name for the output within the context of the component and the value is the output configuration. <br><br> Outputs can be referenced in the `args` using the `${{ outputs.<output_name> }}` expression. | |
| `outputs.<output_name>` | object | The Spark component output. Output for a Spark component can be written to either a file or a folder location by providing an object containing the [component output specification](#component-outputs). | |

### Attributes of the `conf` key

| Key | Type | Description | Default value |
| --- | ---- | ----------- | ------------- |
| `spark.driver.cores` | integer | The number of cores for the Spark driver. | |
| `spark.driver.memory` | string | Allocated memory for the Spark driver, in gigabytes (GB), for example, `2g`. | |
| `spark.executor.cores` | integer | The number of cores for the Spark executor. | |
| `spark.executor.memory` | string | Allocated memory for the Spark executor, in gigabytes (GB), for example `2g`. | | 
| `spark.dynamicAllocation.enabled` | boolean | Whether or not executors should be dynamically allocated as a `True` or `False` value. If this property is set `True`, define `spark.dynamicAllocation.minExecutors` and `spark.dynamicAllocation.maxExecutors`. If this property is set to `False`, define `spark.executor.instances`. | `False` |
| `spark.dynamicAllocation.minExecutors` | integer | The minimum number of Spark executors instances, for dynamic allocation. | |
| `spark.dynamicAllocation.maxExecutors` | integer | The maximum number of Spark executors instances, for dynamic allocation. | |
| `spark.executor.instances` | integer | The number of Spark executor instances. | |

### Component inputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of component input. Specify `uri_file` for input data that points to a single file source, or `uri_folder` for input data that points to a folder source. [Learn more about data access.](./concept-data.md)| `uri_file`, `uri_folder` | |
| `mode` | string | Mode of how the data should be delivered to the compute target. The `direct` mode passes in the URL of the storage location as the component input. You have full responsibility to handle storage access credentials. | `direct` | |

### Component outputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of component output. | `uri_file`, `uri_folder` | |
| `mode` | string | The mode of delivery of the output file(s) to the  destination storage resource. | `direct` |  |

## Remarks

The `az ml component` commands can be used for managing Azure Machine Learning Spark component.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/spark). Several are shown next.

## YAML: A sample Spark component

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/spark/spark-job-component.yml":::

## YAML: A sample pipeline job with a Spark component

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/spark/attached-spark-pipeline-user-identity.yml":::

## Next steps

- [Install and use the CLI (v2)](./how-to-configure-cli.md)
- [Submit Spark jobs in Azure Machine Learning](./how-to-submit-spark-jobs.md)
