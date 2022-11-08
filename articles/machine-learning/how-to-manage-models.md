---
title: Register and work with models
titleSuffix: Azure Machine Learning
description: Learn how to register and work with different model types in Azure Machine Learning (such as custom, MLflow, and Triton).
services: machine-learning
author: abeomor
ms.author: osomorog
ms.service: machine-learning
ms.subservice: mlops
ms.date: 04/15/2022
ms.topic: conceptual
ms.custom: devx-track-python, cli-v2, sdk-v2, event-tier1-build-2022, ignite-2022
---

# Work with models in Azure Machine Learning

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

Azure Machine Learning allows you to work with different types of models. In this article, you learn about using Azure Machine Learning to work with different model types, such as custom, MLflow, and Triton. You also learn how to register a model from different locations, and how to use the Azure Machine Learning SDK, the user interface (UI), and the Azure Machine Learning CLI to manage your models.

> [!TIP]
> If you have model assets created that use the SDK/CLI v1, you can still use those with SDK/CLI v2. Full backward compatibility is provided. All models registered with the V1 SDK are assigned the type `custom`.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* An Azure Machine Learning workspace.
* The Azure Machine Learning [SDK v2 for Python](https://aka.ms/sdk-v2-install).
* The Azure Machine Learning [CLI v2](how-to-configure-cli.md).

## Supported paths

When you provide a model you want to register, you'll need to specify a `path` parameter that points to the data or job location. Below is a table that shows the different data locations supported in Azure Machine Learning and examples for the `path` parameter:


|Location  | Examples  |
|---------|---------|
|A path on your local computer     | `mlflow-model/model.pkl`         |
|A path on an AzureML Datastore   |   `azureml://datastores/<datastore-name>/paths/<path_on_datastore>`      |
|A path from an AzureML job   |   `azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>`      |
|A path from an MLflow job   |   `runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>`      |

## Supported modes

When you run a job with model inputs/outputs, you can specify the *mode* - for example, whether you would like the model to be read-only mounted or downloaded to the compute target. The table below shows the possible modes for different type/mode/input/output combinations:

Type | Input/Output | `direct` | `download` | `ro_mount` 
------ | ------ | :---: | :---: | :---: | 
`custom` file | Input  |  ✓ |   |    | 
`custom` folder | Input  |  ✓ | ✓  |  ✓  | 
`mlflow`   | Input |  |  ✓  | ✓ |
`custom` file | Output  | ✓  |  ✓ |   ✓ |  
`custom` folder   | Output | ✓  | ✓  | ✓   |
`mlflow`    | Output | ✓  |  ✓ |   ✓ | 


### Follow along in Jupyter Notebooks

You can follow along this sample in a Jupyter Notebook. In the [azureml-examples](https://github.com/azure/azureml-examples) repository, open the notebook: [model.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/assets/model/model.ipynb).

## Create a model in the model registry

[Model registration](concept-model-management-and-deployment.md) allows you to store and version your models in the Azure cloud, in your workspace. The model registry helps you organize and keep track of your trained models.

The code snippets in this section cover how to:

* Register your model as an asset in Machine Learning by using the CLI.
* Register your model as an asset in Machine Learning by using the SDK.
* Register your model as an asset in Machine Learning by using the UI.

These snippets use `custom` and `mlflow`.

- `custom` is a type that refers to a model file or folder trained with a custom standard not currently supported by Azure ML.
- `mlflow` is a type that refers to a model trained with [mlflow](how-to-use-mlflow-cli-runs.md). MLflow trained models are in a folder that contains the *MLmodel* file, the *model* file, the *conda dependencies* file, and the *requirements.txt* file.

### Register your model as an asset in Machine Learning by using the CLI

Use the following tabs to select where your model is located.

# [Local model](#tab/use-local)

```YAML
$schema: https://azuremlschemas.azureedge.net/latest/model.schema.json
name: local-file-example
path: mlflow-model/model.pkl
description: Model created from local file.
```

```bash
az ml model create -f <file-name>.yml
```

For a complete example, see the [model YAML](https://github.com/Azure/azureml-examples/tree/main/cli/assets/model).


# [Datastore](#tab/use-datastore)

You can create a model from a cloud path by using any one of the following supported URI formats.

```cli
az ml model create --name my-model --version 1 --path azureml://datastores/myblobstore/paths/models/cifar10/cifar.pt
```

The examples use the shorthand `azureml` scheme for pointing to a path on the `datastore` by using the syntax `azureml://datastores/<datastore-name>/paths/<path_on_datastore>`.

For a complete example, see the [CLI reference](/cli/azure/ml/model).

# [Job output](#tab/use-job-output)

You have two options here. You can use the MLflow run URI format, or you can use the `azureml job` URI format.

### MLflow

This option is optimized for MLflow users, who are likely already familiar with the MLflow run URI format. This option helps you create a model from artifacts in the default artifact location (where all MLflow-logged models and artifacts are located). This establishes a lineage between a registered model and the run the model came from.

Format:
`runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>`

Example:
`runs:/$RUN_ID/model/`

```cli
az ml model create --name my-model --version 1 --path runs:/$RUN_ID/model/ --type mlflow_model
```

### azureml job

This option is an `azureml job` reference URI format, which helps you register a model from artifacts in any of the job's outputs. This format is aligned with the existing `azureml` datastore reference URI format, and also supports referencing artifacts from named outputs of the job (not just the default artifact location). You can establish a lineage between a registered model and the job it was trained from, if you didn't directly register your model within the training script by using MLflow.

Format:
`azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>`

Examples:
- Default artifact location: `azureml://jobs/$RUN_ID/outputs/artifacts/paths/model/`
  * This is equivalent to `runs:/$RUN_ID/model/`.
  * *artifacts* is the reserved keyword to refer to the output that represents the default artifact location.
- From a named output directory: `azureml://jobs/$RUN_ID/outputs/trained-model`
- From a specific file or folder path within the named output directory:
  * `azureml://jobs/$RUN_ID/outputs/trained-model/paths/cifar.pt`
  * `azureml://jobs/$RUN_ID/outputs/checkpoints/paths/model/`

Saving model from a named output:

```cli
az ml model create --name my-model --version 1 --path azureml://jobs/$RUN_ID/outputs/trained-model
```

For a complete example, see the [CLI reference](/cli/azure/ml/model).

---

### Register your model as an asset in Machine Learning by using the SDK

Use the following tabs to select where your model is located.

# [Local model](#tab/use-local)

```python
from azure.ai.ml.entities import Model
from azure.ai.ml.constants import ModelType

file_model = Model(
    path="mlflow-model/model.pkl",
    type=ModelType.CUSTOM,
    name="local-file-example",
    description="Model created from local file."
)
ml_client.models.create_or_update(file_model)
```

# [Datastore](#tab/use-datastore)

You can create a model from a cloud path by using any one of the following supported URI formats.

```python
from azure.ai.ml.entities import Model
from azure.ai.ml.constants import ModelType

cloud_model = Model(
    path= "azureml://datastores/workspaceblobstore/paths/model.pkl"
    name="cloud-path-example",
    type=ModelType.CUSTOM,
    description="Model created from cloud path."
)
ml_client.models.create_or_update(cloud_model)
```

The examples use the shorthand `azureml` scheme for pointing to a path on the `datastore` by using the syntax `azureml://datastores/${{datastore-name}}/paths/${{path_on_datastore}}`.

# [Job output](#tab/use-job-output)

You have two options here. You can use the MLflow run URI format, or you can use the `azureml job` URI format.

### MLflow

This option is optimized for MLflow users, who are likely already familiar with the MLflow run URI format. This option helps you create a model from artifacts in the default artifact location (where all MLflow-logged models and artifacts are located). This establishes a lineage between a registered model and the run the model came from.

Format:
`runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>`

Example:
`runs:/$RUN_ID/model/`

```python
from azure.ai.ml.entities import Model
from azure.ai.ml.constants import ModelType

run_model = Model(
    path="runs:/$RUN_ID/model/"
    name="run-model-example",
    description="Model created from run.",
    type=ModelType.MLFLOW
)

ml_client.models.create_or_update(run_model) 
```

### azureml job

This option is an `azureml job` reference URI format, which helps you register a model from artifacts in any of the job's outputs. This format is aligned with the existing `azureml` datastore reference URI format, and also supports referencing artifacts from named outputs of the job (not just the default artifact location). You can establish a lineage between a registered model and the job it was trained from, if you didn't directly register your model within the training script by using MLflow.

Format:
`azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>`

Examples:
- Default artifact location: `azureml://jobs/$RUN_ID/outputs/artifacts/paths/model/`
  * This is equivalent to `runs:/$RUN_ID/model/`.
  * *artifacts* is the reserved keyword to refer to the output that represents the default artifact location.
- From a named output directory: `azureml://jobs/$RUN_ID/outputs/trained-model`
- From a specific file or folder path within the named output directory:
  * `azureml://jobs/$RUN_ID/outputs/trained-model/paths/cifar.pt`
  * `azureml://jobs/$RUN_ID/outputs/checkpoints/paths/model/`

Saving model from a named output:

```python
from azure.ai.ml.entities import Model
from azure.ai.ml.constants import ModelType

run_model = Model(
    path="azureml://jobs/$RUN_ID/outputs/artifacts/paths/model/"
    name="run-model-example",
    description="Model created from run.",
    type=ModelType.CUSTOM
)

ml_client.models.create_or_update(run_model) 
```

For a complete example, see the [model notebook](https://github.com/Azure/azureml-examples/tree/march-sdk-preview/sdk/assets/model).

---

### Register your model as an asset in Machine Learning by using the UI

To create a model in Machine Learning, from the UI, open the **Models** page. Select **Register model**, and select where your model is located. Fill out the required fields, and then select **Register**.

:::image type="content" source="./media/how-to-manage-models/register-model-as-asset.png" alt-text="Screenshot of the UI to register a model." lightbox="./media/how-to-manage-models/register-model-as-asset.png":::

---

## Use model as input in a job

# [Azure CLI](#tab/cli)

Create a job specification YAML file (`<file-name>.yml`). Specify in the `inputs` section of the job:

1. The `type`; whether the model is a `mlflow_model`,`custom_model` or `triton_model`. 
1. The `path` of where your data is located; can be any of the paths outlined in the [Supported Paths](#supported-paths) section. 

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json

# Possible Paths for models:
# AzureML Datastore: azureml://datastores/<datastore-name>/paths/<path_on_datastore>
# MLflow run: runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>
# Job: azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>
# Model Asset: azureml:<my_model>:<version>

command: |
  ls ${{inputs.my_model}}
code: <folder where code is located>
inputs:
  my_model:
    type: <type> # mlflow_model,custom_model, triton_model
    path: <path>
environment: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
compute: azureml:cpu-cluster
```

Next, run in the CLI

```azurecli
az ml job create -f <file-name>.yml
```

# [Python SDK](#tab/python)

The `Input` class allows you to define:

1. The `type`; whether the model is a `mlflow_model`,`custom_model` or `triton_model`. 
1. The `path` of where your data is located; can be any of the paths outlined in the [Supported Paths](#supported-paths) section. 

```python
from azure.ai.ml import command
from azure.ai.ml.entities import Model
from azure.ai.ml import Input
from azure.ai.ml.constants import AssetTypes
from azure.ai.ml import MLClient

# Possible Asset Types for Data:
# AssetTypes.MLFLOW_MODEL
# AssetTypes.CUSTOM_MODEL
# AssetTypes.TRITON_MODEL

# Possible Paths for Model:
# Local path: mlflow-model/model.pkl
# AzureML Datastore: azureml://datastores/<datastore-name>/paths/<path_on_datastore>
# MLflow run: runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>
# Job: azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>
# Model Asset: azureml:<my_model>:<version>

my_job_inputs = {
    "input_model": Input(type=AssetTypes.MLFLOW_MODEL, path="<path>")
}

job = command(
    code="./src",  # local path where the code is stored
    command="ls ${{inputs.input_model}}",
    inputs=my_job_inputs,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:9",
    compute="cpu-cluster",
)

# submit the command
returned_job = ml_client.jobs.create_or_update(job)
# get a URL for the status of the job
returned_job.services["Studio"].endpoint
```

---
## Use model as output in a job

In your job you can write model to your cloud-based storage using *outputs*. 

# [Azure CLI](#tab/cli)

Create a job specification YAML file (`<file-name>.yml`), with the `outputs` section populated with the type and path of where you would like to write your data to:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/CommandJob.schema.json

# Possible Paths for Model:
# Local path: mlflow-model/model.pkl
# AzureML Datastore: azureml://datastores/<datastore-name>/paths/<path_on_datastore>
# MLflow run: runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>
# Job: azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>
# Model Asset: azureml:<my_model>:<version>

code: src
command: >-
  python load_score.py 
  --input_model ${{inputs.input_model}} 
  --output_folder ${{outputs.output_folder}}
inputs:
  input_model: 
    type: <type> # mlflow_model,custom_model, triton_model
    path: <path>
outputs:
  output_folder: 
    type: <type> # mlflow_model,custom_model, triton_model
environment: azureml:<environment_name>@latest
compute: azureml:cpu-cluster
```

Next create a job using the CLI:

```azurecli
az ml job create --file <file-name>.yml
```

# [Python SDK](#tab/python)

```python
from azure.ai.ml import command
from azure.ai.ml.entities import Model
from azure.ai.ml import Input, Output
from azure.ai.ml.constants import AssetTypes

# Possible Asset Types for Model:
# AssetTypes.MLFLOW_MODEL
# AssetTypes.CUSTOM_MODEL
# AssetTypes.TRITON_MODEL

# Possible Paths for Model:
# Local path: mlflow-model/model.pkl
# AzureML Datastore: azureml://datastores/<datastore-name>/paths/<path_on_datastore>
# MLflow run: runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>
# Job: azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>
# Model Asset: azureml:<my_model>:<version>

my_job_inputs = {
    "input_model": Input(type=AssetTypes.MLFLOW_MODEL, path="mlflow-model"),
    "input_data": Input(type=AssetTypes.URI_FILE, path="./mlflow-model/input_example.json"),
}

my_job_outputs = {
    "output_folder": Output(type=AssetTypes.CUSTOM_MODEL)
}

job = command(
    code="./src",  # local path where the code is stored
    command="python load_write_score.py --input_model ${{inputs.input_model}} --input_data ${{inputs.input_data}} --output_folder ${{outputs.output_folder}}",
    inputs=my_job_inputs,
    outputs=my_job_outputs,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:9",
    compute="cpu-cluster",
)

# submit the command
returned_job = ml_client.create_or_update(job)
# get a URL for the status of the job
returned_job.services["Studio"].endpoint

```

---
## Next steps

* [Install and set up Python SDK v2](https://aka.ms/sdk-v2-install)
* [No-code deployment for MLflow models](how-to-deploy-mlflow-models-online-endpoints.md)
* Learn more about [MLflow and Azure Machine Learning](concept-mlflow.md)
