---
title: Query & compare experiments and runs with MLflow
titleSuffix: Azure Machine Learning
description: Explains how to use MLflow for managing experiments and runs in Azure Machine Learning
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: core
ms.date: 06/08/2022
ms.topic: conceptual
ms.custom: how-to, ignite-2022
---

# Query & compare experiments and runs with MLflow

Experiments and jobs (or runs) in Azure Machine Learning can be queried using MLflow. You don't need to install any specific SDK to manage what happens inside of a training job, creating a more seamless transition between local runs and the cloud by removing cloud-specific dependencies. In this article, you'll learn how to query and compare experiments and runs in your workspace using Azure Machine Learning and MLflow SDK in Python.

MLflow allows you to:

* Create, query, delete and search for experiments in a workspace.
* Query, delete, and search for runs in a workspace.
* Track and retrieve metrics, parameters, artifacts and models from runs.

See [Support matrix for querying runs and experiments in Azure Machine Learning](#support-matrix-for-querying-runs-and-experiments) for a detailed comparison between MLflow Open-Source and MLflow when connected to Azure Machine Learning.

> [!NOTE]
> The Azure Machine Learning Python SDK v2 does not provide native logging or tracking capabilities. This applies not just for logging but also for querying the metrics logged. Instead, use MLflow to manage experiments and runs. This article explains how to use MLflow to manage experiments and runs in Azure Machine Learning.

### REST API

Query and searching experiments and runs is also available using the MLflow REST API. See [Using MLflow REST with Azure Machine Learning](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/using-rest-api/using_mlflow_rest_api.ipynb) for an example about how to consume it.

### Prerequisites

[!INCLUDE [mlflow-prereqs](includes/machine-learning-mlflow-prereqs.md)]

## Query and search experiments

Use MLflow to search for experiments inside of your workspace. See the following examples:

* Get all active experiments:

    ```python
    mlflow.search_experiments()
    ```
    
    > [!NOTE]
    > In legacy versions of MLflow (<2.0) use method `mlflow.list_experiments()` instead.

* Get all the experiments, including archived:

    ```python
    from mlflow.entities import ViewType
    
    mlflow.search_experiments(view_type=ViewType.ALL)
    ```

* Get a specific experiment by name:

    ```python
    mlflow.get_experiment_by_name(experiment_name)
    ```

* Get a specific experiment by ID:

    ```python
    mlflow.get_experiment('1234-5678-90AB-CDEFG')
    ```

### Searching experiments

The `search_experiments()` method available since Mlflow 2.0 allows searching experiment matching a criteria using `filter_string`.

* Retrieve multiple experiments based on their IDs:

    ```python
    mlflow.search_experiments(filter_string="experiment_id IN ("
        "'CDEFG-1234-5678-90AB', '1234-5678-90AB-CDEFG', '5678-1234-90AB-CDEFG')"
    )
    ```

* Retrieve all experiments created after a given time:

    ```python
    import datetime

    dt = datetime.datetime(2022, 6, 20, 5, 32, 48)
    mlflow.search_experiments(filter_string=f"creation_time > {int(dt.timestamp())}")
    ```

* Retrieve all experiments with a given tag:

    ```python
    mlflow.search_experiments(filter_string=f"tags.framework = 'torch'")
    ```

## Query and search runs

MLflow allows searching runs inside of any experiment, including multiple experiments at the same time. The method `mlflow.search_runs()` accepts the argument `experiment_ids` and `experiment_name` to indicate on which experiments you want to search. You can also indicate `search_all_experiments=True` if you want to search across all the experiments in the workspace:

* By experiment name:

    ```python
    mlflow.search_runs(experiment_names=[ "my_experiment" ])
    ```  

* By experiment ID:

    ```python
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ])
    ```

* Search across all experiments in the workspace:

    ```python
    mlflow.search_runs(filter_string="params.num_boost_round='100'", search_all_experiments=True)
    ``` 

Notice that `experiment_ids` supports providing an array of experiments, so you can search runs across multiple experiments if required. This may be useful in case you want to compare runs of the same model when it is being logged in different experiments (by different people, different project iterations, etc.).

> [!IMPORTANT]
> If `experiment_ids`, `experiment_names`, or `search_all_experiments` are not indicated, then MLflow will search by default in the current active experiment. You can set the active experiment using `mlflow.set_experiment()`

By default, MLflow returns the data in Pandas `Dataframe` format, which makes it handy when doing further processing our analysis of the runs. Returned data includes columns with:

- Basic information about the run.
- Parameters with column's name `params.<parameter-name>`.
- Metrics (last logged value of each) with column's name `metrics.<metric-name>`.

All metrics and parameters are also returned when querying runs. However, for metrics containing multiple values (for instance, a loss curve, or a PR curve), only the last value of the metric is returned. If you want to retrieve all the values of a given metric, uses `mlflow.get_metric_history` method. See [Getting params and metrics from a run](#getting-params-and-metrics-from-a-run) for an example.

### Ordering runs

By default, experiments are ordered descending by `start_time`, which is the time the experiment was queue in Azure Machine Learning. However, you can change this default by using the parameter `order_by`.

* Order runs by attributes, like `start_time`:

    ```python
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ],
                       order_by=["attributes.start_time DESC"])
    ```
  
* Order runs and limit results. The following example returns the last single run in the experiment:

    ```python
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], 
                       max_results=1, order_by=["attributes.start_time DESC"])
    ```

* Order runs by the attribute `duration`:

    ```python
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], 
                       order_by=["attributes.duration DESC"])
    ```

    > [!TIP]
    > `attributes.duration` is not present in MLflow OSS, but provided in Azure Machine Learning for convenience.

* Order runs by metric's values:

    ```python
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ]).sort_values("metrics.accuracy", ascending=False)
    ```

    > [!WARNING]
    > Using `order_by` with expressions containing `metrics.*`, `params.*`, or `tags.*` in the parameter `order_by` is not supported by the moment. Please use `order_values` method from Pandas as shown in the example.

  
### Filtering runs

You can also look for a run with a specific combination in the hyperparameters using the parameter `filter_string`. Use `params` to access run's parameters, `metrics` to access metrics logged in the run, and `attributes` to access run information details. MLflow supports expressions joined by the AND keyword (the syntax does not support OR):

* Search runs based on a parameter's value:

    ```python
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], 
                       filter_string="params.num_boost_round='100'")
    ```

    > [!WARNING]
    > Only operators `=`, `like`, and `!=` are supported for filtering `parameters`.

* Search runs based on a metric's value:

    ```python
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], 
                       filter_string="metrics.auc>0.8")
    ```

* Search runs with a given tag:

    ```python
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], 
                       filter_string="tags.framework='torch'")
    ```

* Search runs created by a given user:

    ```python
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], 
                       filter_string="attributes.user_id = 'John Smith'")
    ```

* Search runs that have failed. See [Filter runs by status](#filter-runs-by-status) for possible values:

    ```python
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], 
                       filter_string="attributes.status = 'Failed'")
    ```

* Search runs created after a given time:

    ```python
    import datetime

    dt = datetime.datetime(2022, 6, 20, 5, 32, 48)
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], 
                       filter_string=f"attributes.creation_time > '{int(dt.timestamp())}'")
    ```

    > [!TIP]
    > Notice that for the key `attributes`, values should always be strings and hence encoded between quotes.

* Search runs taking longer than one hour:

    ```python
    duration = 360 * 1000 # duration is in milliseconds
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], 
                       filter_string=f"attributes.duration > '{duration}'")
    ```

    > [!TIP]
    > `attributes.duration` is not present in MLflow OSS, but provided in Azure Machine Learning for convenience.
    
* Search runs having the ID in a given set:

    ```python
    mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], 
                       filter_string="attributes.run_id IN ('1234-5678-90AB-CDEFG', '5678-1234-90AB-CDEFG')")
    ```

### Filter runs by status

When filtering runs by status, notice that MLflow uses a different convention to name the different possible status of a run compared to Azure Machine Learning. The following table shows the possible values:

| Azure Machine Learning Job status | MLFlow's `attributes.status` | Meaning |
| :-: | :-: | :- |
| Not started | `Scheduled` | The job/run was received by Azure Machine Learning. |
| Queue | `Scheduled` | The job/run is scheduled for running, but it hasn't started yet. |
| Preparing | `Scheduled` | The job/run has not started yet, but a compute has been allocated for its execution and it's preparing the environment and its inputs. |
| Running | `Running` | The job/run is currently under active execution. |
| Completed | `Finished` | The job/run has been completed without errors. |
| Failed | `Failed` | The job/run has been completed with errors. |
| Canceled | `Killed` | The job/run has been canceled by the user or terminated by the system. |

Example:

```python
mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], 
                   filter_string="attributes.status = 'Failed'")
```
  
## Getting metrics, parameters, artifacts and models

The method `search_runs` returns a Pandas `Dataframe` containing a limited amount of information by default. You can get Python objects if needed, which may be useful to get details about them. Use the `output_format` parameter to control how output is returned:

```python
runs = mlflow.search_runs(
    experiment_ids=[ "1234-5678-90AB-CDEFG" ],
    filter_string="params.num_boost_round='100'",
    output_format="list",
)
```

Details can then be accessed from the `info` member. The following sample shows how to get the `run_id`:

```python
last_run = runs[-1]
print("Last run ID:", last_run.info.run_id)
```
  
### Getting params and metrics from a run

When runs are returned using `output_format="list"`, you can easily access parameters using the key `data`:

```python
last_run.data.params
```

In the same way, you can query metrics:

```python
last_run.data.metrics
```

For metrics that contain multiple values (for instance, a loss curve, or a PR curve), only the last logged value of the metric is returned. If you want to retrieve all the values of a given metric, uses `mlflow.get_metric_history` method. This method requires you to use the `MlflowClient`:

```python
client = mlflow.tracking.MlflowClient()
client.get_metric_history("1234-5678-90AB-CDEFG", "log_loss")
```

### Getting artifacts from a run

Any artifact logged by a run can be queried by MLflow. Artifacts can't be accessed using the run object itself and the MLflow client should be used instead:

```python
client = mlflow.tracking.MlflowClient()
client.list_artifacts("1234-5678-90AB-CDEFG")
```

The method above will list all the artifacts logged in the run, but they will remain stored in the artifacts store (Azure Machine Learning storage). To download any of them, use the method `download_artifact`:

```python
file_path = mlflow.artifacts.download_artifacts(
    run_id="1234-5678-90AB-CDEFG", artifact_path="feature_importance_weight.png"
)
```

> [!NOTE]
> In legacy versions of MLflow (<2.0), use the method `MlflowClient.download_artifacts()` instead.

### Getting models from a run

Models can also be logged in the run and then retrieved directly from it. To retrieve it, you need to know the artifact's path where it is stored. The method `list_artifacats` can be used to find artifacts that are representing a model since MLflow models are always folders. You can download a model by indicating the path where the model is stored using the `download_artifact` method:

```python
artifact_path="classifier"
model_local_path = mlflow.artifacts.download_artifacts(
  run_id="1234-5678-90AB-CDEFG", artifact_path=artifact_path
)
```
  
You can then load the model back from the downloaded artifacts using the typical function `load_model` in the flavor-specific namespace. The following example uses `xgboost`:

```python
model = mlflow.xgboost.load_model(model_local_path)
```

MLflow also allows you to both operations at once and download and load the model in a single instruction. MLflow will download the model to a temporary folder and load it from there. The method `load_model` uses an URI format to indicate from where the model has to be retrieved. In the case of loading a model from a run, the URI structure is as follows:

```python
model = mlflow.xgboost.load_model(f"runs:/{last_run.info.run_id}/{artifact_path}")
```

> [!TIP]
> For query and loading models registered in the Model Registry, view [Manage models registries in Azure Machine Learning with MLflow](how-to-manage-models-mlflow.md).

## Getting child (nested) runs

MLflow supports the concept of child (nested) runs. They are useful when you need to spin off training routines requiring being tracked independently from the main training process. Hyper-parameter tuning optimization processes or Azure Machine Learning pipelines are typical examples of jobs that generate multiple child runs. You can query all the child runs of a specific run using the property tag `mlflow.parentRunId`, which contains the run ID of the parent run.

```python
hyperopt_run = mlflow.last_active_run()
child_runs = mlflow.search_runs(
    filter_string=f"tags.mlflow.parentRunId='{hyperopt_run.info.run_id}'"
)
```

## Compare jobs and models in Azure Machine Learning studio (preview)

To compare and evaluate the quality of your jobs and models in Azure Machine Learning studio, use the [preview panel](./how-to-enable-preview-features.md) to enable the feature. Once enabled, you can compare the parameters, metrics, and tags between the jobs and/or models you selected.

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

:::image type="content" source="media/how-to-track-experiments-mlflow/compare.gif" alt-text="Screenshot of the preview panel showing how to compare jobs and models in Azure Machine Learning studio.":::

The [MLflow with Azure Machine Learning notebooks](https://github.com/Azure/azureml-examples/tree/main/sdk/python/using-mlflow) demonstrate and expand upon concepts presented in this article.

  * [Training and tracking a classifier with MLflow](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/train-and-log/xgboost_classification_mlflow.ipynb): Demonstrates how to track experiments using MLflow, log models and combine multiple flavors into pipelines.
  * [Manage experiments and runs with MLflow](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/runs-management/run_history.ipynb): Demonstrates how to query experiments, runs, metrics, parameters and artifacts from Azure Machine Learning using MLflow.

## Support matrix for querying runs and experiments

The MLflow SDK exposes several methods to retrieve runs, including options to control what is returned and how. Use the following table to learn about which of those methods are currently supported in MLflow when connected to Azure Machine Learning:

| Feature | Supported by MLflow | Supported by Azure Machine Learning |
| :- | :-: | :-: |
| Ordering runs by attributes | **&check;** | **&check;** |
| Ordering runs by metrics | **&check;** | <sup>1</sup> |
| Ordering runs by parameters | **&check;** | <sup>1</sup> |
| Ordering runs by tags | **&check;** | <sup>1</sup> |
| Filtering runs by attributes | **&check;** | **&check;** |
| Filtering runs by metrics | **&check;** | **&check;** |
| Filtering runs by metrics with special characters (escaped) | **&check;** |  |
| Filtering runs by parameters | **&check;** | **&check;** |
| Filtering runs by tags | **&check;** | **&check;** |
| Filtering runs with numeric comparators (metrics) including `=`, `!=`, `>`, `>=`, `<`, and `<=`  | **&check;** | **&check;** |
| Filtering runs with string comparators (params, tags, and attributes): `=` and `!=` | **&check;** | **&check;**<sup>2</sup> |
| Filtering runs with string comparators (params, tags, and attributes): `LIKE`/`ILIKE` | **&check;** | **&check;** |
| Filtering runs with comparators `AND` | **&check;** | **&check;** |
| Filtering runs with comparators `OR` |  |  |
| Renaming experiments | **&check;** |  |

> [!NOTE]
> - <sup>1</sup> Check the section [Ordering runs](#ordering-runs) for instructions and examples on how to achieve the same functionality in Azure Machine Learning.
> - <sup>2</sup> `!=` for tags not supported.

## Next steps

* [Manage your models with MLflow](how-to-manage-models.md).
* [Deploy models with MLflow](how-to-deploy-mlflow-models.md).
