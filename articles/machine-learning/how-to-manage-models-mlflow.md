---
title: Manage models registries in Azure Machine Learning with MLflow
titleSuffix: Azure Machine Learning
description: Explains how to use MLflow for managing models in Azure Machine Learning
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.service: machine-learning
ms.subservice: core
ms.date: 06/08/2022
ms.topic: conceptual
ms.custom: how-to, devx-track-python
---

# Manage models registries in Azure Machine Learning with MLflow

Azure Machine Learning supports MLflow for model management. This represents a convenient way to support the entire model lifecycle for users familiar with the MLFlow client. The following article describes the different capabilities and how it compares with other options.

## Support matrix for managing models with MLflow

The MLflow client exposes several methods to retrieve and manage models. The following table shows which of those methods are currently supported in MLflow when connected to Azure ML. It also compares it with other models management capabilities in Azure ML.

| Feature | MLflow | Azure ML with MLflow | Azure ML CLIv2 | Azure ML Studio |
| :- | :-: | :-: | :-: | :-: |
| Registering models in MLflow format | **&check;** | **&check;** | **&check;** | **&check;** |
| Registering models not in MLflow format |  |  | **&check;** | **&check;** |
| Registering models from runs outputs/artifacts | **&check;** | **&check;**<sup>1</sup> | **&check;**<sup>2</sup> | **&check;** |
| Registering models from runs outputs/artifacts in a different tracking server/workspace | **&check;** |  |  |  |
| Listing registered models | **&check;** | **&check;** | **&check;** | **&check;** |
| Retrieving details of registered model's versions | **&check;** | **&check;** | **&check;** | **&check;** |
| Editing registered model's versions description | **&check;** | **&check;** | **&check;** | **&check;** |
| Editing registered model's versions tags | **&check;** | **&check;** | **&check;** | **&check;** |
| Renaming registered models | **&check;** | <sup>3</sup> | <sup>3</sup> | <sup>3</sup> |
| Deleting a registered model (container) | **&check;** | <sup>3</sup> | <sup>3</sup> | <sup>3</sup> |
| Deleting a registered model's version | **&check;** | **&check;** | **&check;** | **&check;** |
| Manage MLflow model stages | **&check;** | **&check;** |  |  |
| Search registered models by name | **&check;** | **&check;** | **&check;** | **&check;**<sup>4</sup> |
| Search registered models using string comparators `LIKE` and `ILIKE` | **&check;** |  |  | **&check;**<sup>4</sup> |
| Search registered models by tag |  |  |  | **&check;**<sup>4</sup> |

> [!NOTE]
> - <sup>1</sup> Use URIs with format `runs:/<ruin-id>/<path>`.
> - <sup>2</sup> Use URIs with format `azureml://jobs/<job-id>/outputs/artifacts/<path>`.
> - <sup>3</sup> Registered models are immutable objects in Azure ML.
> - <sup>4</sup> Use search box in Azure ML Studio. Partial match supported.

### Prerequisites

* Install the `azureml-mlflow` package.
* If you are running outside an Azure ML compute, configure the MLflow tracking URI or MLflow's registry URI to point to the workspace you are working on. For more information about how to Set up tracking environment, see [Track runs using MLflow with Azure Machine Learning](how-to-use-mlflow-cli-runs.md#set-up-tracking-environment) for more details.

## Registering new models in the registry

### Creating models from an existing run 

If you have an MLflow model logged inside of a run and you want to register it in a registry, you can do that by using the run ID and the path where the model was logged. See [Manage experiments and runs with MLflow](how-to-track-experiments-mlflow.md) to know how to query this information if you don't have it.

```python
mlflow.register_model(f"runs:/{run_id}/{artifact_path}", model_name)
```

> [!NOTE]
> Models can only be registered to the registry in the same workspace where the run was tracked. Cross-workspace operations are not supported by the moment in Azure Machine Learning.

### Creating models from assets

If you have a folder with an MLModel MLflow model, then you can register it directly. There's no need for the model to be always in the context of a run. To do that you can use the URI schema `file://path/to/model` to register MLflow models stored in the local file system. Let's create a simple model using `Scikit-Learn` and save it in MLflow format in the local storage:

```python
from sklearn import linear_model

reg = linear_model.LinearRegression()
reg.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])

mlflow.sklearn.save_model(reg, "./regressor")
```

> [!TIP]
> The method `save_model()` works in the same way as `log_model()`. While `log_model()` saves the model inside on an active run, `save_model()` uses the local file system for saving the model.

You can now register the model from the local path:

```python
import os

model_local_path = os.path.abspath("./regressor")
mlflow.register_model(f"file://{model_local_path}", "local-model-test")
```

> [!NOTE]
> Notice how the model URI schema `file:/` requires absolute paths.

## Querying model registries

### Querying all the models in the registry

You can query all the registered models in the registry using the MLflow client with the method `list_registered_models`. The MLflow client is required to do all these operations.

```python
using mlflow

client = mlflow.tracking.MlflowClient()
```

The following sample prints all the model's names:

```python
for model in client.list_registered_models():
    print(f"{model.name}")
```

### Getting specific versions of the model

The command above will retrieve the model object which contains all the model versions. However, if you want to get the last registered model version of a given model, you can use `get_registered_model`:

```python
client.get_registered_model(model_name)
```

If you need a specific version of the model, you can indicate so:

```python
client.get_model_version(model_name, version=2)
```

## Loading models from registry

You can load models directly from the registry to restore the models objects that were logged. Use the functions `mlflow.<flavor>.load_model()` or `mlflow.pyfunc.load_model()` indicating the URI of the model you want to load using the following syntax:

* `models:/<model-name>/latest`, to load the last version of the model.
* `models:/<model-name>/<version-number>`, to load a specific version of the model.
* `models:/<model-name>/<stage-name>`, to load a specific version in a given stage for a model. View [Model stages](#model-stages) for details.

> [!TIP]
> For learning about the difference between `mlflow.<flavor>.load_model()` and `mlflow.pyfunc.load_model()`, view [Loading MLflow models back](concept-mlflow-models.md#loading-mlflow-models-back) article.

## Model stages

MLflow supports model's stages to manage model's lifecycle. Model's version can transition from one stage to another. Stages are assigned to a model's version (instead of models) which means that a given model can have multiple versions on different stages.

> [!IMPORTANT]
> Stages can only be accessed using the MLflow SDK. They don't show up in the [Azure ML Studio portal](https://ml.azure.com) and can't be retrieved using neither Azure ML SDK, Azure ML CLI, or Azure ML REST API. Creating deployment from a given model's stage is not supported by the moment.

### Querying model stages

You can use the MLflow client to check all the possible stages a model can be:

```python
client.get_model_version_stages(model_name, version="latest")
```

You can see what model's version is on each stage by getting the model from the registry. The following example gets the model's version currently in the stage `Staging`.

```python
client.get_latest_versions(model_name, stages=["Staging"])
```

> [!NOTE]
> Multiple versions can be in the same stage at the same time in Mlflow, however, this method returns the latest version (greater version) among all of them.

> [!WARNING]
> Stage names are case sensitive.

### Transitioning models

Transitioning a model's version to a particular stage can be done using the MLflow client. 

```python
client.transition_model_version_stage(model_name, version=3, stage="Staging")
```

By default, if there were an existing model version in that particular stage, it will remain there. Hence, it won't be replaced as multiple model's versions can be in the same stage at the same time. Alternatively, you can indicate `archive_existing_versions=True` to tell MLflow to move the existing model's version to the stage `Archived`.

```python
client.transition_model_version_stage(
    model_name, version=3, stage="Staging", archive_existing_versions=True
)
```

### Loading models from stages

ou can load a model in a particular stage directly from Python using the `load_model` function and the following URI format. Notice that for this method to success, you need to have all the libraries and dependencies already installed in the environment you're working at.

```python
model = mlflow.pyfunc.load_model(f"models:/{model_name}/Staging")
```

## Editing and deleting models

Editing registered models is supported in both Mlflow and Azure ML, however, there are some differences between them that are important to notice:

> [!WARNING]
> Renaming models is not supported in Azure Machine Learning as model objects are immmutable.

### Editing models

You can edit model's description and tags from a model using Mlflow:

```python
client.update_model_version(model_name, version=1, description="My classifier description")
```

To edit tags, you have to use the method `set_model_version_tag` and `remove_model_version_tag`:

```python
client.set_model_version_tag(model_name, version="1", key="type", value="classification")
```

Removing a tag:

```python
client.delete_model_version_tag(model_name, version="1", key="type")
```

### Deleting a model's version

You can delete any model version in the registry using the MLflow client, as demonstrated in the following example:

```python
client.delete_model_version(model_name, version="2")
```

> [!NOTE]
> Azure Machine Learning doesn't support deleting the entire model container. To achieve the same thing, you will need to delete all the model versions from a given model.
