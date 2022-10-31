---
title: 'CLI (v2) Automated ML Image Classification job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Automated ML Image Classification job YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-ignite-2022

ms.author: shoja
author: shouryaj
ms.date: 10/11/2022
ms.reviewer: ssalgado
---

# CLI (v2) Automated ML Image Classification job YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLImageClassificationJob.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | const | The type of job. | `automl` | `automl` |
| `task` | const | The type of automl task. | `image_classification` | `image_classification` |
| `name` | string | Name of the job. Must be unique across all jobs in the workspace. If omitted, Azure ML will autogenerate a GUID for the name. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be non-unique within the workspace. If omitted, Azure ML will autogenerate a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | Experiment name to organize the job under. Each job's run record will be organized under the corresponding experiment in the studio's "Experiments" tab. If omitted, Azure ML will default it to the name of the working directory where the job was created. | | |
| `description` | string | Description of the job. | | |
| `tags` | object | Dictionary of tags for the job. | | |
| `compute` | string | Name of the compute target to execute the job on. This can be either a reference to an existing compute in the workspace (using the `azureml:<compute_name>` syntax) or `local` to designate local execution. **Note:** jobs in pipeline didn't support `local` as `compute` | | `local` |
| `log_verbosity` | number | Different levels of log verbosity. |`not_set`, `debug`, `info`, `warning`, `error`, `critical` | `info` |
| `primary_metric` | string |  The metric that AutoML will optimize for model selection. |`accuracy`, `auc_weighted`, `average_precision_score_weighted`, `norm_macro_recall`, `precision_score_weighted` | `accuracy` |
| `target_column_name` | string |  The name of the column to target for predictions. It must always be specified. This parameter is applicable to 'training_data' and 'validation_data'. | |  |
| `training_data` | object |  The data to be used within the job. It should contain both training feature columns and a target column. the parameter training_data must always be provided. Refer to [training/validation input data specification](#training-or-validation-data) for further details on how to write this object.| |  |
| `validation_data` | object |  The validation data to be used within the job. It should contain both training features and label column (optionally a sample weights column). If 'validation_data' is specified, then 'training_data' and 'target_column_name' parameters must be specified. Refer to [training/validation input data specification](#training-or-validation-data) for further details on how to write this object.| |  |
| `validation_data_size` | float |  What fraction of the data to hold out for validation when user validation data is not specified. This should be between 0.0 and 1.0 non-inclusive. | |  |
| `limits` | object | Dictionary of limit configurations of the job. The key is name for the limit within the ocntext of the job and the value is limit value. If you want to specify a different mode for the output, provide an object containing the [limits](#limits). | | |
| `training_parameters` | object | Dictionary containing training parameters for the job. Provide an object which has keys as listed in  [training parameters](#training-parameters). | | |

### Limits

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `timeout_minutes` | integer | Maximum amount of time in minutes that the whole AutoML job can take before the job terminates. This timeout includes setup, featurization and training runs but does not include the ensembling and model explainability runs at the end of the process since those actions need to happen once all the trials (children jobs) are done. If not specified, the default job's total timeout is 6 days (8,640 minutes). To specify a timeout less than or equal to 1 hour (60 minutes), make sure your dataset's size is not greater than 10,000,000 (rows times column) or an error results. | | 8640 |
| `max_trials` | integer | The maximum total number of different algorithm and parameter combinations (trials) to try during an AutoML job. If using 'enable_early_termination' the number of trials used can be smaller.  | | 1000 |
| `max_concurrent_trials` | integer | Represents the maximum number of trials (children jobs) that would be executed in parallel. | | 1 |
| `trial_timeout_minutes` | integer | Maximum time in minutes that each trial (child job) can run for before it terminates. If not specified, a value of 1 month or 43200 minutes is used.  | | 43200 |

### Training Or Validation Data

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `description` | string | The detailed information that describes this input data. | | |
| `path` | sring | The maximum total number of different algorithm and parameter combinations (trials) to try during an AutoML job. If not specified, the default is 1000 trials. If using 'enable_early_termination' the number of trials used can be smaller.  | | |
| `mode` | string | | |
| `type` | const |  In order to generate computer vision models, you need to bring labeled image data as input for model training in the form of an MLTable. | mltable | mltable|

### Training Parameters

#### Model specific hyperparameters

#### Model agnostic hyperparameters

#### Image classification (multi-class and multi-label) specific hyperparameters

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `model_name` | string | Model name to be used for image classification task at hand. | `mobilenetv2`, `resnet18`, `resnet34`, `resnet50`, `resnet101`, `resnet152`, `resnest50`, `resnest101`, `seresnext`, `vits16r224`, `vitb16r224`, `vitl16r224` | |
| `training_crop_size` | integer | Image crop size that's input to your neural network for train dataset. <br><br> Notes: <br>- `seresnext` doesn't take an arbitrary size. <br>- ViT-variants should have the same `validation_crop_size` and `training_crop_size`. <br>- Training run may get into CUDA OOM if the size is too big.|  | 224|
| `validation_crop_size` | integer | Image crop size that's input to your neural network for validation dataset. <br><br> Notes: <br>- `seresnext` doesn't take an arbitrary size. <br>- ViT-variants should have the same `validation_crop_size` and `training_crop_size`. <br>- Training run may get into CUDA OOM if the size is too big.| | 224 |
| `validation_resize_size` | integer | Image size to which to resize before cropping for validation dataset. <br><br> Notes: <br>- `seresnext` doesn't take an arbitrary size. <br>- Training run may get into CUDA OOM if the size is too big. | | 256 |
| `weighted_loss` | integer | - `0` for no weighted loss. <br>- `1` for weighted loss with sqrt (class_weights). <br>- `2` for weighted loss with class_weights. | `0`, `1`, `2`| `0` |


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

### Job inputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of job input. Specify `uri_file` for input data that points to a single file source, or `uri_folder` for input data that points to a folder source. | `uri_file`, `uri_folder`, `mlflow_model`, `custom_model`| `uri_folder` |
| `path` | string | The path to the data to use as input. This can be specified in a few ways: <br><br> - A local path to the data source file or folder, e.g. `path: ./iris.csv`. The data will get uploaded during job submission. <br><br> - A URI of a cloud path to the file or folder to use as the input. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, `adl`. See [Core yaml syntax](reference-yaml-core-syntax.md) for more information on how to use the `azureml://` URI format. <br><br> - An existing registered Azure ML data asset to use as the input. To reference a registered data asset use the `azureml:<data_name>:<data_version>` syntax or `azureml:<data_name>@latest` (to reference the latest version of that data asset), e.g. `path: azureml:cifar10-data:1` or `path: azureml:cifar10-data@latest`. | | |
| `mode` | string | Mode of how the data should be delivered to the compute target. <br><br> For read-only mount (`ro_mount`), the data will be consumed as a mount path. A folder will be mounted as a folder and a file will be mounted as a file. Azure ML will resolve the input to the mount path. <br><br> For `download` mode the data will be downloaded to the compute target. Azure ML will resolve the input to the downloaded path. <br><br> If you only want the URL of the storage location of the data artifact(s) rather than mounting or downloading the data itself, you can use the `direct` mode. This will pass in the URL of the storage location as the job input. Note that in this case you are fully responsible for handling credentials to access the storage. | `ro_mount`, `download`, `direct` | `ro_mount` |

### Job outputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of job output. For the default `uri_folder` type, the output will correspond to a folder. | `uri_folder` , `mlflow_model`, `custom_model`| `uri_folder` |
| `mode` | string | Mode of how output file(s) will get delivered to the destination storage. For read-write mount mode (`rw_mount`) the output directory will be a mounted directory. For upload mode the file(s) written will get uploaded at the end of the job. | `rw_mount`, `upload` | `rw_mount` |

## Remarks

The `az ml job` command can be used for managing Azure Machine Learning jobs.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs). Several are shown below.

## YAML: hello world

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world.yml":::

## YAML: display name, experiment name, description, and tags

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-org.yml":::

## YAML: environment variables

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-env-var.yml":::

## YAML: source code

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-code.yml":::

## YAML: literal inputs

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-input.yml":::

## YAML: write to default outputs

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-output.yml":::

## YAML: write to named data output

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-output-data.yml":::

## YAML: datastore URI file input

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-iris-datastore-file.yml":::

## YAML: datastore URI folder input

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-iris-datastore-folder.yml":::

## YAML: URI file input

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-iris-file.yml":::

## YAML: URI folder input

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-iris-folder.yml":::

## YAML: Notebook via papermill

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-notebook.yml":::

## YAML: basic Python model training

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/scikit-learn/iris/job.yml":::

## YAML: basic R model training with local Docker build context

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/r/iris/job.yml":::

## YAML: distributed PyTorch

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/pytorch/cifar-distributed/job.yml":::

## YAML: distributed TensorFlow

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/tensorflow/mnist-distributed/job.yml":::

## YAML: distributed MPI

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/tensorflow/mnist-distributed-horovod/job.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
