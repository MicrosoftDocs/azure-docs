---
title: Register and work with models
titleSuffix: Azure Machine Learning
description: Learn how to use the Azure Machine Learning CLI or Python SDK to create and work with different registered model types and locations.
services: machine-learning
author: Blackmist
ms.author: larryfr
ms.reviewer: kritifaujdar
ms.service: azure-machine-learning
ms.subservice: mlops
ms.date: 06/12/2024
ms.topic: how-to
ms.custom: cli-v2, sdk-v2, devx-track-azurecli, update-code2, devx-track-python
---

# Work with registered models in Azure Machine Learning

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you learn to register and work with models in Azure Machine Learning by using:
- The Azure Machine Learning studio UI.
- The Azure Machine Learning V2 CLI.
- The Python Azure Machine Learning V2 SDK.

You learn how to:
- Create registered models in the model registry from local files, datastores, or job outputs.
- Work with different types of models, such as custom, MLflow, and Triton.
- Use models as inputs or outputs in training jobs.
- Manage the lifecycle of model assets.

<a name="create-a-model-in-the-model-registry"></a>
## Model registration

[Model registration](concept-model-management-and-deployment.md) lets you store and version your models in your workspace in the Azure cloud. The model registry helps you organize and keep track of your trained models. You can register models as assets in Azure Machine Learning by using the Azure CLI, the Python SDK, or the Machine Learning studio UI.

### Supported paths

To register a model, you need to specify a path that points to the data or job location. The following table shows the various data locations Azure Machine Learning supports, and the syntax for the `path` parameter:

|Location  | Syntax  |
|---------|---------|
|Local computer     | `<model-folder>/<model-filename>`         |
|Azure Machine Learning datastore   |   `azureml://datastores/<datastore-name>/paths/<path_on_datastore>`      |
|Azure Machine Learning job   |   `azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>`      |
|MLflow job   |   `runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>`      |
|Model asset in a Machine Learning workspace  | `azureml:<model-name>:<version>`|
|Model asset in a Machine Learning registry  | `azureml://registries/<registry-name>/models/<model-name>/versions/<version>`|

### Supported modes

When you use models for inputs or outputs, you can specify one of the following *modes*. For example, you can specify whether the model should be read-only mounted or downloaded to the compute target.

- `ro_mount`: Mount the data to the compute target as read-only.
- `rw_mount`: Read-write mount the data.
- `download`: Download the data to the compute target.
- `upload`: Upload the data from the compute target.
- `direct`: Pass in the URI as a string.

The following table shows the available mode options for different model type inputs and outputs.

|Type | `upload` | `download` | `ro_mount` | `rw_mount` | `direct` |
|------ | ------ | :---: | :---: | :---: | :---: | :---: |
|`custom` file input  |   |  |   |  |    |
|`custom` folder input |   | ✓ | ✓  | |✓  |
|`mlflow` input |   | ✓ |  ✓ |   |   |
|`custom` file output  | ✓  |   |    | ✓  | ✓   |
|`custom` folder output | ✓  |   |   | ✓ | ✓  |
|`mlflow` output | ✓  |   |    | ✓  | ✓ |

## Prerequisites

- An Azure subscription with a free or paid version of Azure Machine Learning. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
- An [Azure Machine Learning workspace](quickstart-create-resources.md#create-the-workspace).

To run the code samples in this article and work with the Azure Machine Learning V2 CLI or Python Azure Machine Learning V2 SDK, you also need:

# [Azure CLI](#tab/cli)

- Azure CLI version 2.38.0 or greater installed.
- V2 of the `ml` extension installed by running the following command. For more information, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

  ```azurecli
  az extension add -n ml
  ```

# [Python SDK](#tab/python)

- Python 3.8 or greater installed.
- The Azure Machine Learning [SDK v2 for Python](https://aka.ms/sdk-v2-install) installed by running the following command:
  
  ```bash
  pip install azure-ai-ml azure-identity
  ```
---

> [!NOTE]
> V2 provides full backward compatibility. You can still use model assets from the v1 SDK or CLI. All models registered with the v1 CLI or SDK are assigned the type `custom`.

## Register a model by using the studio UI

To register a model by using the Azure Machine Learning studio UI:

1. In your workspace in the studio, select **Models** from the left navigation.

1. On the **Model List** page, select **Register**, and select one of the following locations from the dropdown list:
   - **From local files**
   - **From a job output**
   - **From datastore**
   - **From local files (based on framework)**
   
1. On the first **Register model** screen:
   1. Navigate to the local file, datastore, or job output for your model.
   1. Select the input model type: **MLflow**, **Triton**, or **Unspecified type**.
   
1. On the **Model settings** screen, provide a name and other optional settings for your registered model, and select **Next**.

1. On the **Review** screen, review the configuration and then select **Register**.

:::image type="content" source="./media/how-to-manage-models/register-model-local.png" alt-text="Screenshot of the UI to register a model." lightbox="./media/how-to-manage-models/register-model-local.png":::

<a name="register-your-model-as-an-asset-in-machine-learning-by-using-the-cli"></a>
<a name="register-your-model-as-an-asset-in-machine-learning-by-using-the-sdk"></a>
## Register a model by using the Azure CLI or Python SDK

The following code snippets cover how to register a model as an asset in Azure Machine Learning by using the Azure CLI or Python SDK. These snippets use `custom` and `mlflow` model types.

- `custom` type refers to a model file or folder trained with a custom standard that Azure Machine Learning doesn't currently support.
- `mlflow` type refers to a model trained with [MLflow](how-to-use-mlflow-cli-runs.md). MLflow trained models are in a folder that contains the *MLmodel* file, the *model* file, the *conda dependencies* file, and the *requirements.txt* file.

>[!TIP]
>You can follow along with the Python versions of the following samples by running the [model.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/assets/model/model.ipynb) notebook in the [azureml-examples](https://github.com/azure/azureml-examples) repository.

### Connect to your workspace

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, you connect to your Azure Machine Learning workspace to create the registered model.

# [Azure CLI](#tab/cli)

1. Sign in to Azure by running `az login` and following the prompts.

1. In the following commands, replace `<subscription-id>`, `<workspace-name>`, `<resource-group>`, and `<location>` placeholders with the values for your environment.

   ```azurecli
   az account set --subscription <subscription-id>
   az configure --defaults workspace=<workspace-name> group=<resource-group> location=<location>
   ```

# [Python SDK](#tab/python)

1. Import the required libraries:

    ```python
    from azure.ai.ml import MLClient, Input
    from azure.ai.ml.entities import Model
    from azure.ai.ml.constants import AssetTypes
    from azure.identity import DefaultAzureCredential
    ```

1. Configure workspace details and get a handle to the workspace. In the following code snippet, replace the `<subscription-id>`, `<resource-group>`, and `<workspace-name>` placeholders with the values for your environment.

    ```python
    subscription_id = "<subscription-id>"
    resource_group = "<resource-group>"
    workspace = "<workspace-name>"
    
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
    ```

---

### Create the registered model

You can create a registered model from a model that's:

- Located on your local computer.
- Located on an Azure Machine Learning datastore.
- Output from an Azure Machine Learning job.

#### Local file or folder

# [Azure CLI](#tab/cli)

1. Create a YAML file *\<file-name>.yml*. In the file, provide a name for your registered model, a path to the local model file, and a description. For example:

   :::code language="yaml" source="~/azureml-examples-main/cli/assets/model/local-file.yml":::

1. Run the following command, using the name of your YAML file:

   ```azurecli
   az ml model create -f <file-name>.yml
   ```

For a complete example, see the [model YAML](https://github.com/Azure/azureml-examples/tree/main/cli/assets/model).

# [Python SDK](#tab/python)

The following example shows creating a registered model from a local file.

[!Notebook-python[] (~/azureml-examples-main/sdk/python/assets/model/model.ipynb?name=file_model)]

---

#### Datastore

You can create a model from a cloud path by using any of the [supported URI formats](#supported-paths).

# [Azure CLI](#tab/cli)

The following example uses the shorthand `azureml` scheme for pointing to a path on the datastore by using the syntax `azureml://datastores/<datastore-name>/paths/<path_on_datastore>`.

```azurecli
az ml model create --name my-model --version 1 --path azureml://datastores/myblobstore/paths/models/cifar10/cifar.pt
```

For a complete example, see the [CLI reference](/cli/azure/ml/model).

# [Python SDK](#tab/python)

The following example uses the shorthand `azureml` scheme for pointing to a path on the datastore by using the syntax `azureml://datastores/${{datastore-name}}/paths/${{path_on_datastore}}`.

[!Notebook-python[] (~/azureml-examples-main/sdk/python/assets/model/model.ipynb?name=cloud_model)]

---

#### Job output

If your model data comes from a job output, you have two options for specifying the model path. You can use the MLflow `runs:` URI format or the `azureml://jobs` URI format.

>[!NOTE]
>The *artifacts* reserved keyword represents output from the default artifact location.

- **MLflow runs: URI format**

  This option is optimized for MLflow users, who are probably already familiar with the MLflow `runs:` URI format. This option creates a model from artifacts in the default artifact location, where all MLflow-logged models and artifacts are located. This option also establishes a lineage between a registered model and the run the model came from.

  Format: `runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>`

  Example:

  # [Azure CLI](#tab/cli)

  ```azurecli
  az ml model create --name my-registered-model --version 1 --path runs:/my_run_0000000000/model/ --type mlflow_model
  ```

  # [Python SDK](#tab/python)

  ```python
  from azure.ai.ml.entities import Model
  from azure.ai.ml.constants import ModelType
  
  run_model = Model(
      path="runs:/my_run_0000000000/model/"
      name="my-registered-model",
      description="Model created from run.",
      type=ModelType.MLFLOW_MODEL
  )
  
  ml_client.models.create_or_update(run_model) 
  ```

---

- **azureml://jobs URI format**

  The `azureml://jobs` reference URI option lets you register a model from artifacts in any of the job's output paths. This format aligns with the `azureml://datastores` reference URI format, and also supports referencing artifacts from named outputs other than the default artifact location.

  If you didn't directly register your model within the training script by using MLflow, you can use this option to establish a lineage between a registered model and the job it was trained from.

  Format: `azureml://jobs/<run-id>/outputs/<output-name>/paths/<path-to-model>`

  - Default artifact location: `azureml://jobs/<run-id>/outputs/artifacts/paths/<path-to-model>/`. This location is equivalent to MLflow `runs:/<run-id>/<model>`.
  - Named output folder: `azureml://jobs/<run-id>/outputs/<named-output-folder>`
  - Specific file within the named output folder: `azureml://jobs/<run-id>/outputs/<named-output-folder>/paths/<model-filename>`
  - Specific folder path within the named output folder: `azureml://jobs/<run-id>/outputs/<named-output-folder>/paths/<model-folder-name>`

  Example:
  
  # [Azure CLI](#tab/cli)

  Save a model from a named output folder:

  ```azurecli
  az ml model create --name run-model-example --version 1 --path azureml://jobs/my_run_0000000000/outputs/artifacts/paths/model/
  ```

  For a complete example, see the [CLI reference](/cli/azure/ml/model).

  # [Python SDK](#tab/python)

  Save a model from a named output:

  [!notebook-python[] (~/azureml-examples-main/sdk/python/assets/model/model.ipynb?name=run_model)]

  For a complete example, see the [model notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/assets/model/model.ipynb).

---

## Use models for training

The v2 Azure CLI and Python SDK also let you use models as inputs or outputs in training jobs.

### Use a model as input in a training job

# [Azure CLI](#tab/cli)

1. Create a job specification YAML file, *\<file-name>.yml*. In the `inputs` section of the job, specify:

   - The model `type`, which can be `mlflow_model`, `custom_model`, or `triton_model`.
   - The `path` where your model is located, which can be any of the paths listed in the comment of the following example.

   :::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-model-as-input.yml":::

1. Run the following command, substituting your YAML filename.

   ```azurecli
   az ml job create -f <file-name>.yml
   ```

For a complete example, see the [model GitHub repo](https://github.com/Azure/azureml-examples/tree/main/cli/assets/model).

# [Python SDK](#tab/python)

The `Input` class allows you to define:

- The model asset type, which can be one of the following values:
  - `AssetTypes.CUSTOM_MODEL`
  - `AssetTypes.MLFLOW_MODEL`
  - `AssetTypes.TRITON_MODEL`

- The `path` to your model data, which can be one of the following locations:
  - Local path: `<model-folder>/<model-filename>`
  - Azure Machine Learning datastore: `azureml://datastores/<datastore-name>/paths/<path_on_datastore>`
  - MLflow run: `runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>`
  - Job: `azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>`
  - Model asset: `azureml:<my_model>:<version>`

The following example inputs an MLflow model from a local folder.

```python
from azure.ai.ml import command
from azure.ai.ml.entities import Model
from azure.ai.ml import Input
from azure.ai.ml.constants import AssetTypes
from azure.ai.ml import MLClient

my_job_inputs = {
    "input_model": Input(type=AssetTypes.MLFLOW_MODEL, path="mlflow-model")
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
### Write a model as output for a job

Your job can write a model to your cloud-based storage by using *outputs*.

# [Azure CLI](#tab/cli)

1. Create a job specification YAML file *\<file-name>.yml*. Populate the `outputs` section with the output model type and path.

   :::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-model-as-output.yml":::

1. Create a job by using the CLI:

   ```azurecli
   az ml job create --file <file-name>.yml
   ```
For a complete example, see the [model GitHub repo](https://github.com/Azure/azureml-examples/tree/main/cli/assets/model).

# [Python SDK](#tab/python)

The `Output` class allows you to define:

- The model asset type, which can be one of the following values:
  - `AssetTypes.CUSTOM_MODEL`
  - `AssetTypes.MLFLOW_MODEL`
  - `AssetTypes.TRITON_MODEL`

- The `path` for your model data, which can be one of the following locations:
  - Local path: `mlflow-model/model.pkl`
  - Azure Machine Learning datastore: `azureml://datastores/<datastore-name>/paths/<path_on_datastore>`
  - MLflow run: `runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>`
  - Job: `azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>`
  - Model asset: `azureml:<my_model>:<version>`

The following example creates an output that mounts your default datastore in read-write mode. The code simply loads the local MLflow model as input and exports the same model as an output of the job saved in the mounted datastore.

```python
from azure.ai.ml import command
from azure.ai.ml.entities import Model
from azure.ai.ml import Input, Output
from azure.ai.ml.constants import AssetTypes

my_job_inputs = {
    "input_model": Input(type=AssetTypes.MLFLOW_MODEL, path="mlflow-model"),
    "input_data": Input(type=AssetTypes.URI_FILE, path="./mlflow-model/input_example.json"),}

my_job_outputs = {
    "output_folder": Output(type=AssetTypes.CUSTOM_MODEL)
}

job = command(
    code="./src",  # local path where the code is stored
    command="python load_write_model.py --input_model ${{inputs.input_model}} --output_folder ${{outputs.output_folder}}",
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

## Manage models

The Azure CLI and Python SDK also allow you to manage the lifecycle of your Azure Machine Learning model assets.

### List

# [Azure CLI](#tab/cli)

List all the models in your workspace:

```azurecli
az ml model list
```

List all the model versions under a given name:

```azurecli
az ml model list --name run-model-example
```

# [Python SDK](#tab/python)

List all the models in your workspace:

```python
models = ml_client.models.list()
for model in models:
    print(model.name)
```

List all the model versions under a given name:

```python
models = ml_client.models.list(name="run-model-example")
for model in models:
    print(model.version)
```
---

### Show

Get the details of a specific model:

# [Azure CLI](#tab/cli)

```azurecli
az ml model show --name run-model-example --version 1
```

# [Python SDK](#tab/python)

```python
model_example = ml_client.models.get(name="run-model-example", version="1")
print(model_example)
```
---

### Update

Update mutable properties of a specific model:

> [!IMPORTANT]
> For models, only `description` and `tags` can be updated. All other properties are immutable, and if you need to change them, you should create a new version of the model.

# [Azure CLI](#tab/cli)

```azurecli
az ml model update --name  run-model-example --version 1 --set description="This is an updated description." --set tags.stage="Prod"
```

# [Python SDK](#tab/python)

```python
model_example.description="This is an updated description."
model_example.tags={"stage":"Prod"}
ml_client.models.create_or_update(model=model_example)
```

---

### Archive

Archiving a model hides it from list queries like `az ml model list` by default. You can continue to reference and use an archived model in your workflows.

You can archive all versions or only specific versions of a model. If you don't specify a version, all versions of the model are archived. If you create a new model version under an archived model container, the new version is also automatically set as archived.

# [Azure CLI](#tab/cli)

Archive all versions of a model:

```azurecli
az ml model archive --name run-model-example
```

Archive a specific model version:

```azurecli
az ml model archive --name run-model-example --version 1
```

# [Python SDK](#tab/python)

Archive all versions of a model:

```python
ml_client.models.archive(name="run-model-example")
```

Archive a specific model version:

```python
ml_client.models.archive(name="run-model-example", version="1")
```

---

## Related content

- [Share models, components, and environments across workspaces with registries](how-to-share-models-pipelines-across-workspaces-with-registries.md)
- [Azure Machine Learning package client library for Python - version 1.16.1](https://aka.ms/sdk-v2-install)
- [Azure CLI ml extension](/cli/azure/ml)
- [MLflow and Azure Machine Learning](concept-mlflow.md)
- [Deploy MLflow models to online endpoints](how-to-deploy-mlflow-models-online-endpoints.md)
