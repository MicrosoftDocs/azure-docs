---
title: Register and work with models
titleSuffix: Azure Machine Learning
description: Learn how to register and work with different model types in Azure Machine Learning (custom, MLflow, and Triton).
services: machine-learning
author: abeomor
ms.author: osomorog
ms.service: machine-learning
ms.subservice: mlops
ms.date: 04/15/2022
ms.topic: conceptual
ms.custom: devx-track-python, cli-v2, sdk-v2, event-tier1-build-2022
---

# Work with Models in Azure Machine Learning

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

Azure Machine Learning allows you to work with different types of models. In this article, you'll learn about using Azure Machine Learning to work with different model types (Custom, MLflow, and Triton), how to register a model from different locations and how to use the SDK, UI and CLI to manage your models. 

> [!TIP]
> If you have model assets created using the SDK/CLI v1, you can still use those with SDK/CLI v2. For more information, see the [Consuming V1 Model Assets in V2](#consuming-v1-model-assets-in-v2) section.


## Prerequisites

* An Azure subscription - If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
* An Azure Machine Learning workspace.
* The Azure Machine Learning [SDK v2 for Python](https://aka.ms/sdk-v2-install).
* The Azure Machine Learning [CLI v2](how-to-configure-cli.md).


## Creating a model in the model registry

[Model registration](concept-model-management-and-deployment.md) allows you to store and version your models in the Azure cloud, in your workspace. The model registry makes it easy to organize and keep track of your trained models.

The code snippets in this section cover the following scenarios:

* Registering model as an asset in Azure Machine Learning using CLI
* Registering model as an asset in Azure Machine Learning using SDK
* Registering model as an asset in Azure Machine Learning using UI

These snippets use `custom` and `mlflow`.

- `custom` is a type that refers to a model file.
- `mlflow` is a type that refers to a model trained with [mlflow](how-to-use-mlflow-cli-runs.md). MLflow trained model are in a folder that contains the `MLmodel file`, `model file`, `conda dependecies` and the `requirements.txt`. 

### Registering model as an asset in Azure Machine Learning using CLI

Use the tabs below to select where your model is located.

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

A model can be created from a cloud path using any one of the following supported URI formats.


```cli
az ml model create --name my-model --version 1 --path azureml://datastores/myblobstore/paths/models/cifar10/cifar.pt
```

The examples use shorthand `azureml` scheme for pointing to a path on the `datastore` using syntax `azureml://datastores/${{datastore-name}}/paths/${{path_on_datastore}}`. 

For a complete example, see the [CLI Reference](/cli/azure/ml/model).

# [Job Output](#tab/use-job-output)

__Use the mlflow run URI format__

This option is optimized for mlflow users who are likely already familiar with the mlflow run URI format. This option allows mlflow users to create a model from artifacts in the default artifact location (where all mlflow-logged models and artifacts will be located). This establishes a lineage between a registered model and the run the model came from.

Format:
`runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>`

Example:
`runs:/$RUN_ID/model/`

```cli
az ml model create --name my-model --version 1 --path runs:/$RUN_ID/model/ --type mlflow_model
```

__Use the azureml job URI format__

We'll also have an azureml job reference URI format to allow users to register a model from artifacts in any of the job's outputs. This format is aligned with the existing azureml datastore reference URI format, and also supports referencing artifacts from named outputs of the job (not just the default artifact location). This also enables establishing a lineage between a registered model and the job it was trained from if the user didn't directly register their model within the training script using mlflow.

Format:
`azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>`

Examples:
- Default artifact location: `azureml://jobs/$RUN_ID/outputs/artifacts/paths/model/`
    * this is equivalent to `runs:/$RUN_ID/model/` from the #2 mlflow run URI format
    * **note: "artifacts"** is the reserved key word we use to refer to the output that represents the **default artifact location**
- From a named output dir: `azureml://jobs/$RUN_ID/outputs/trained-model`
- From a specific file or folder path within the named output dir:
    * `azureml://jobs/$RUN_ID/outputs/trained-model/paths/cifar.pt`
    * `azureml://jobs/$RUN_ID/outputs/checkpoints/paths/model/`

Saving model from a named output:

```cli
az ml model create --name my-model --version 1 --path azureml://jobs/$RUN_ID/outputs/trained-model
```

For a complete example, see the [CLI Reference](/cli/azure/ml/model).

---

### Registering model as an asset in Azure Machine Learning using SDK

Use the tabs below to select where your model is located.

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

A model can be created from a cloud path using any one of the following supported URI formats.

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

The examples use shorthand `azureml` scheme for pointing to a path on the `datastore` using syntax `azureml://datastores/${{datastore-name}}/paths/${{path_on_datastore}}`. 

# [Job Output](#tab/use-job-output)

__Use the mlflow run URI format__

This option is optimized for mlflow users who are likely already familiar with the mlflow run URI format. This option allows mlflow users to create a model from artifacts in the default artifact location (where all mlflow-logged models and artifacts will be located). This establishes a lineage between a registered model and the run the model came from.

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

__Use the azureml job URI format__

We'll also have an azureml job reference URI format to allow users to register a model from artifacts in any of the job's outputs. This format is aligned with the existing azureml datastore reference URI format, and also supports referencing artifacts from named outputs of the job (not just the default artifact location). This also enables establishing a lineage between a registered model and the job it was trained from if the user didn't directly register their model within the training script using mlflow.

Format:
`azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>`

Examples:
- Default artifact location: `azureml://jobs/$RUN_ID/outputs/artifacts/paths/model/`
    * this is equivalent to `runs:/$RUN_ID/model/` from the mlflow run URI format
    * **note: "artifacts"** is the reserved key word we use to refer to the output that represents the **default artifact location**
- From a named output dir: `azureml://jobs/$RUN_ID/outputs/trained-model`
- From a specific file or folder path within the named output dir:
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

### Registering model as an asset in Azure Machine Learning using UI

To create a model in Azure Machine Learning, open the Models page in Azure Machine Learning. Click **Create** and select where your model is located. 

:::image type="content" source="./media/how-to-manage-models/register-model-as-asset.png" alt-text="Screenshot of the UI to register a model." lightbox="./media/how-to-manage-models/register-model-as-asset.png":::

Use the tabs below to select where your model is located.

# [Local model](#tab/use-local)

To upload a model from your computer, Select **Local** and upload the model you want to save in the model registry.

:::image type="content" source="./media/how-to-manage-models/register-model-local.png" alt-text="Screenshot of registering a local model in the UI." lightbox="./media/how-to-manage-models/register-model-local.png":::

# [Datastore](#tab/use-datastore)

To add a model from an Azure Machine Learning Datastore, Select **Datastore** and pick the datastore and folder where the model is located.

:::image type="content" source="./media/how-to-manage-models/register-model-datastore.png" alt-text="Screenshot of registering a model from a datastore in the UI." lightbox="./media/how-to-manage-models/register-model-datastore.png":::

# [Job Output](#tab/use-job-output)

To add a model from an Azure Machine Learning Job, Select **Job Output** and pick the job and folder in the job output where the model is located.

:::image type="content" source="./media/how-to-manage-models/select-job-output.png" alt-text="Screenshot of selecting the job output in the UI." lightbox="./media/how-to-manage-models/select-job-output.png":::

To add a model from an Azure Machine Learning Job, locate the Job in the Job UI and select **Create Model**. You can then folder in the job output where the model is located. 

:::image type="content" source="./media/how-to-manage-models/register-model-job-output.png" alt-text="Screenshot of creating a model from job output in the UI." lightbox="./media/how-to-manage-models/register-model-job-output.png":::


---

## Consuming V1 model assets in V2

> [!NOTE]
> Full backward compatibility is provided, all model registered with the V1 SDK will be assign the type of `custom`. 


## Next steps

* [Install and set up Python SDK v2 (preview)](https://aka.ms/sdk-v2-install)
* [No-code deployment for Mlflow models](how-to-deploy-mlflow-models-online-endpoints.md)
* Learn more about [MLflow and Azure Machine Learning](concept-mlflow.md)
