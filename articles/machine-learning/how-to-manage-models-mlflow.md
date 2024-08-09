---
title: Manage models registry with MLflow
titleSuffix: Azure Machine Learning
description: Explore how to use MLflow in Azure Machine Learning to manage a models registry, and register, edit, query, and delete models.
services: machine-learning
author: msakande
ms.author: mopeakande
ms.reviewer: fasantia
ms.service: azure-machine-learning
ms.subservice: core
ms.date: 08/08/2024
ms.topic: concept-article
ms.custom: how-to

#customer intent: As a developer, I want to use MLflow in Azure Machine Learning to manage a models registry, so I can register, edit, query, and delete models.
---

# Manage models registry in Azure Machine Learning with MLflow

Azure Machine Learning supports MLflow for model management when connected to a workspace. This approach is a convenient way to support the entire model lifecycle for users familiar with the MLFlow client.

This article describes capabilities for managing a model registry with MLflow and how this method compares with other management options.

## Prerequisites

[!INCLUDE [mlflow-prereqs](includes/machine-learning-mlflow-prereqs.md)]

- The procedures in this article use a `client` object to refer to the MLflow client.

   Some operations can be executed directly by using the MLflow fluent API, `mlflow.<method>`. Other operations require an MLflow client to enable communication with Machine Learning in the MLflow protocol. The following code creates an `MlflowClient` object:

   ```python
   import mlflow

   client = mlflow.tracking.MlflowClient()
   ```

### Limitations

- Azure Machine Learning doesn't support renaming models.

- Machine Learning doesn't support deleting the entire model container.

- Organizational registries aren't supported for model management with MLflow.

- Model deployment from a specific model stage isn't currently supported in Machine Learning.

- Cross-workspace operations aren't currently supported in Machine Learning.

## Register new models

The models registry offers a convenient and centralized way to manage models in a workspace. Each workspace has its own independent models registry. The following sections demonstrate two ways you can register models in the registry by using the MLflow SDK.

### Create models from existing run 

If you have an MLflow model logged inside a run, and you want to register it in a registry, use the run ID and path where the model is logged. You can query for this information by following the instructions in [Manage experiments and runs with MLflow](how-to-track-experiments-mlflow.md).

```python
mlflow.register_model(f"runs:/{run_id}/{artifact_path}", model_name)
```

> [!TIP]
> Register models from runs or by using the `mlflow.<flavor>.log_model` method from inside the run. This approach preserves lineage from the job that generated the asset.

### Create models from assets

If you have a folder with an **MLModel** MLflow model, you can register it directly. There's no need for the model to be always in the context of a run. For this approach, you can use the URI schema `file://path/to/model` to register MLflow models stored in the local file system.

The following code creates a simple model by using the `Scikit-Learn` package and saves the model in MLflow format in local storage:

```python
from sklearn import linear_model

reg = linear_model.LinearRegression()
reg.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])

mlflow.sklearn.save_model(reg, "./regressor")
```

> [!TIP]
> The `save_model()` method works in the same way as the `log_model()` method. While the `log_model()` method saves the model inside an active run, the `save_model()` method uses the local file system to save the model.

The following code registers the model by using the local path:

```python
import os

model_local_path = os.path.abspath("./regressor")
mlflow.register_model(f"file://{model_local_path}", "local-model-test")
```

## Query model registries

You can use the MLflow SDK to query and search for models registered in the registry. The following sections demonstrate two ways to query for a model.

### Query all models in registry

You can query all registered models in the registry by using the MLflow client.

The following code prints the names of all models in the registry:

```python
for model in client.search_registered_models():
    print(f"{model.name}")
```

Use the `order_by` method to organize the output by a specific property, such as `name`, `version`, `creation_timestamp`, or `last_updated_timestamp`:

```python
client.search_registered_models(order_by=["name ASC"])
```

> [!NOTE]
> For MLflow versions earlier than 2.0, use the `MlflowClient.list_registered_models()` method instead.

### Get specific model versions

The `search_registered_models()` method retrieves the model object, which contains all the model versions. To get the last registered model version for a given model, you can use the `get_registered_model()` method:

```python
client.get_registered_model(model_name)
```

To get a specific version of a model, use the following code:

```python
client.get_model_version(model_name, version=2)
```

## Load models from registry

You can load models directly from the registry to restore logged models objects. For this task, use the functions `mlflow.<flavor>.load_model()` or `mlflow.pyfunc.load_model()` and indicate the URI of the model to load.

You can implement these functions with the following syntax:

- `models:/<model-name>/latest`: Load the last version of the model.
- `models:/<model-name>/<version-number>`: Load a specific version of the model.
- `models:/<model-name>/<stage-name>`: Load a specific version in a given stage for a model. For more information, see [Work with model stages](#work-with-model-stages).

To understand the differences between the functions `mlflow.<flavor>.load_model()` and `mlflow.pyfunc.load_model()`, see [Workflows for loading MLflow models](concept-mlflow-models.md#workflows-for-loading-mlflow-models).

## Work with model stages

MLflow supports stages for a model to manage the model lifecycle. The model version can transition from one stage to another. Stages are assigned to specific versions for a model. A model can have multiple versions on different stages.

> [!IMPORTANT]
> Stages can be accessed only by using the MLflow SDK. They aren't visible in the [Azure Machine Learning studio](https://ml.azure.com). Stages can't be retrieved by using the Azure Machine Learning SDK, the Azure Machine Learning CLI, or the Azure Machine Learning REST API. Deployment from a specific model stage isn't currently supported.

### Query model stages

The following code uses the MLflow client to check all possible stages for a model:

```python
client.get_model_version_stages(model_name, version="latest")
```

You can see the model versions for each model stage by retrieving the model from the registry. The following code gets the model version that's currently in the `Staging` stage:

```python
client.get_latest_versions(model_name, stages=["Staging"])
```

Multiple model versions can be in the same stage at the same time in MLflow. In the previous example, the method returns the latest version (most recently published) among all versions for the stage.

> [!IMPORTANT]
> In the MLflow SDK, stage names are case sensitive.

### Transition models

Transitioning a model version to a particular stage can be done by using the MLflow client:

```python
client.transition_model_version_stage(model_name, version=3, stage="Staging")
```

When you transition a model version to a particular stage, if the stage has other model versions, the existing versions remain unchanged. This behavior is by default.

Another approach is to set the `archive_existing_versions=True` parameter during the transition. This approach instructs MLflow to move any existing model versions to the stage `Archived`:

```python
client.transition_model_version_stage(
    model_name, version=3, stage="Staging", archive_existing_versions=True
)
```

### Load models from stages

You can load a model in a particular stage directly from Python by using the `load_model` function and the following URI format. For this method to succeed, all libraries and dependencies must be installed in your working environment.

Load the model from the `Staging` stage:

```python
model = mlflow.pyfunc.load_model(f"models:/{model_name}/Staging")
```

## Edit and delete models

Editing registered models is supported in both MLflow and Azure Machine Learning, but there are some important differences. The following sections describe some options.

> [!NOTE]
> Renaming models isn't supported in Azure Machine Learning because model objects are immmutable.

### Edit model description and tags

You can edit information about a model by using the MLflow SDK, including the description and tags:

```python
client.update_model_version(model_name, version=1, description="My classifier description")
```

To edit tags, use the `set_model_version_tag` and `remove_model_version_tag` methods:

```python
client.set_model_version_tag(model_name, version="1", key="type", value="classification")
```

To remove a tag, use the `delete_model_version_tag` method:

```python
client.delete_model_version_tag(model_name, version="1", key="type")
```

### Delete model version

You can delete any model version in the registry by using the MLflow client:

```python
client.delete_model_version(model_name, version="2")
```

> [!NOTE]
> Machine Learning doesn't support deleting the entire model container. To achieve this task, delete all model versions for a given model.

## Review support for managing models with MLflow

The MLflow client exposes several methods to retrieve and manage models. The following table lists the methods currently supported in MLflow when connected to Azure Machine Learning. The table also compares MLflow with other models management capabilities in Azure Machine Learning.

| Feature | MLflow | Azure Machine Learning with MLflow | Azure Machine Learning CLI v2 | Azure Machine Learning studio |
| --- | :---: | :---: | :---: | :---: |
| Register models in MLflow format | **&check;** | **&check;** | **&check;** | **&check;** |
| Register models not in MLflow format |  |  | **&check;** | **&check;** |
| Register models from runs outputs/artifacts | **&check;** | **&check;** <sup>1</sup> | **&check;** <sup>2</sup> | **&check;** |
| Register models from runs outputs/artifacts in a different tracking server/workspace | **&check;** |  | **&check;** <sup>5</sup> | **&check;** <sup>5</sup> |
| Search/list registered models | **&check;** | **&check;** | **&check;** | **&check;** |
| Retrieving details of registered model's versions | **&check;** | **&check;** | **&check;** | **&check;** |
| Edit registered model's versions description | **&check;** | **&check;** | **&check;** | **&check;** |
| Edit registered model's versions tags | **&check;** | **&check;** | **&check;** | **&check;** |
| Rename registered models | **&check;** | <sup>3</sup> | <sup>3</sup> | <sup>3</sup> |
| Delete a registered model (container) | **&check;** | <sup>3</sup> | <sup>3</sup> | <sup>3</sup> |
| Delete a registered model's version | **&check;** | **&check;** | **&check;** | **&check;** |
| Manage MLflow model stages | **&check;** | **&check;** |  |  |
| Search registered models by name | **&check;** | **&check;** | **&check;** | **&check;** <sup>4</sup> |
| Search registered models by using string comparators `LIKE` and `ILIKE` | **&check;** |  |  | **&check;** <sup>4</sup> |
| Search registered models by tag |  |  |  | **&check;** <sup>4</sup> |
| [Organizational registries](how-to-manage-registries.md) support | | | **&check;** | **&check;** |

Table footnotes:

- 1: Use Uniform Resource Identifiers (URIs) with the format `runs:/<ruin-id>/<path>`.
- 2: Use URIs with the format `azureml://jobs/<job-id>/outputs/artifacts/<path>`.
- 3: Registered models are immutable objects in Azure Machine Learning.
- 4: Use the search box in Azure Machine Learning studio. Partial matching is supported.
- 5: Use [registries](how-to-manage-registries.md) to move models across different workspaces and preserve lineage.

## Related content

- Explore [logging for MLflow models](how-to-log-mlflow-models.md)
- [Query and compare experiments and runs with MLflow](how-to-track-experiments-mlflow.md)
- Review [guidelines for deploying MLflow models](how-to-deploy-mlflow-models.md)
