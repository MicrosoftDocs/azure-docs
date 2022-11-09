---
title: Query & compare experiments and runs with MLflow
titleSuffix: Azure Machine Learning
description: Explains how to use MLflow for managing experiments and runs in Azure ML
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: core
ms.date: 06/08/2022
ms.topic: conceptual
ms.custom: how-to, devx-track-python, ignite-2022
---

# Query & compare experiments and runs with MLflow

Experiments and runs in Azure Machine Learning can be queried using MLflow. This removes the need of any Azure Machine Learning specific SDKs to manage anything that happens inside of a training job, allowing dependencies removal and creating a more seamless transition between local runs and cloud. 

> [!NOTE]
> The Azure Machine Learning Python SDK v2 does not provide native logging or tracking capabilities. This applies not just for logging but also for querying the metrics logged. Instead, we recommend to use MLflow to manage experiments and runs. This article explains how to use MLflow to manage experiments and runs in Azure ML.

MLflow allows you to:

* Create, delete and search for experiments in a workspace.
* Start, stop, cancel and query runs for experiments.
* Track and retrieve metrics, parameters, artifacts and models from runs.

In this article, you'll learn how to manage experiments and runs in your workspace using Azure ML and MLflow SDK in Python.

## Using MLflow SDK in Azure ML

Use MLflow to query and manage all the experiments in Azure Machine Learning. The MLflow SDK has capabilities to query everything that happens inside of a training job in Azure Machine Learning. See [Support matrix for querying runs and experiments in Azure Machine Learning](#support-matrix-for-querying-runs-and-experiments) for a detailed comparison between MLflow Open-Source and MLflow when connected to Azure Machine Learning.

### Prerequisites

* Install `azureml-mlflow` plug-in.
* If you're running in a compute not hosted in Azure ML, configure MLflow to point to the Azure ML tracking URL. You can follow the instruction at [Track runs from your local machine](how-to-use-mlflow-cli-runs.md).

## Getting all the experiments

You can get all the active experiments in the workspace using MLFlow:

  ```python
  experiments = mlflow.list_experiments()
  for exp in experiments:
      print(exp.name)
  ```

If you want to retrieve archived experiments too, then include the option `ViewType.ALL` in the `view_type` argument. The following sample shows how:

  ```python
  from mlflow.entities import ViewType

  experiments = mlflow.list_experiments(view_type=ViewType.ALL)
  for exp in experiments:
      print(exp.name)
  ```

## Getting a specific experiment

Details about a specific experiment can be retrieved using the `get_experiment_by_name` method:

  ```python
  exp = mlflow.get_experiment_by_name(experiment_name)
  print(exp)
  ```

## Getting runs inside an experiment

MLflow allows searching runs inside of any experiment, including multiple experiments at the same time. By default, MLflow returns the data in Pandas `Dataframe` format, which makes it handy when doing further processing our analysis of the runs. Returned data includes columns with:

- Basic information about the run.
- Parameters with column's name `params.<parameter-name>`.
- Metrics (last logged value of each) with column's name `metrics.<metric-name>`.

### Getting all the runs from an experiment

By experiment name:

  ```python
  mlflow.search_runs(experiment_names=[ "my_experiment" ])
  ```  
By experiment ID:

  ```python
  mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ])
  ```

> [!TIP]
> Notice that `experiment_ids` supports providing an array of experiments, so you can search runs across multiple experiments if required. This may be useful in case you want to compare runs of the same model when it is being logged in different experiments (by different people, different project iterations, etc). You can also use `search_all_experiments=True` if you want to search across all the experiments in the workspace.

Another important point to notice is that get returning runs, all metrics are parameters are also returned for them. However, for metrics containing multiple values (for instance, a loss curve, or a PR curve), only the last value of the metric is returned. If you want to retrieve all the values of a given metric, uses `mlflow.get_metric_history` method.

### Ordering runs

By default, experiments are ordered descending by `start_time`, which is the time the experiment was queue in Azure ML. However, you can change this default by using the parameter `order_by`.

  ```python
  mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], order_by=["start_time DESC"])
  ```
  
Use the argument `max_results` from `search_runs` to limit the number of runs returned. For instance, the following example returns the last run of the experiment:

  ```python
  mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], max_results=1, order_by=["start_time DESC"])
  ```

> [!WARNING]
> Using `order_by` with expressions containing `metrics.*` in the parameter `order_by` is not supported by the moment. Please use `order_values` method from Pandas as shown in the next example.

You can also order by metrics to know which run generated the best results:

  ```python
  mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ]).sort_values("metrics.accuracy", ascending=False)
  ```
  
### Filtering runs

You can also look for a run with a specific combination in the hyperparameters using the parameter `filter_string`. Use `params` to access run's parameters and `metrics` to access metrics logged in the run. MLflow supports expressions joined by the AND keyword (the syntax does not support OR):

  ```python
  mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ], 
                     filter_string="params.num_boost_round='100'")
  ```

### Filter runs by status

You can also filter experiment by status. It becomes useful to find runs that are running, completed, canceled or failed. In MLflow, `status` is an `attribute`, so we can access this value using the expression `attributes.status`. The following table shows the possible values:

| Azure ML Job status | MLFlow's `attributes.status` | Meaning |
| :-: | :-: | :- |
| Not started | `SCHEDULED` | The job/run was just registered in Azure ML but it has processed it yet. |
| Queue | `SCHEDULED` | The job/run is scheduled for running, but it hasn't started yet. |
| Preparing | `SCHEDULED` | The job/run has not started yet, but a compute has been allocated for the execution and it is on building state. |
| Running | `RUNNING` | The job/run is currently under active execution. |
| Completed | `FINISHED` | The job/run has completed without errors. |
| Failed | `FAILED` | The job/run has completed with errors. |
| Canceled | `KILLED` | The job/run has been canceled or killed by the user/system. |

> [!WARNING]
> Expressions containing `attributes.status` in the parameter `filter_string` are not support at the moment. Please use Pandas filtering expressions as shown in the next example.

The following example shows all the runs that have been completed:

  ```python
  runs = mlflow.search_runs(experiment_ids=[ "1234-5678-90AB-CDEFG" ])
  runs[runs.status == "FINISHED"]
  ```
  
## Getting metrics, parameters, artifacts and models

By default, MLflow returns runs as a Pandas `Dataframe` containing a limited amount of information. You can get Python objects if needed, which may be useful to get details about them. Use the `output_format` parameter to control how output is returned:

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

Any artifact logged by a run can be queried by MLflow. Artifacts can't be access using the run object itself and the MLflow client should be used instead:

  ```python
  client = mlflow.tracking.MlflowClient()
  client.list_artifacts("1234-5678-90AB-CDEFG")
  ```

The method above will list all the artifacts logged in the run, but they will remain stored in the artifacts store (Azure ML storage). To download any of them, use the method `download_artifact`:

  ```python
  file_path = client.download_artifacts("1234-5678-90AB-CDEFG", path="feature_importance_weight.png")
  ```

### Getting models from a run

Models can also be logged in the run and then retrieved directly from it. To retrieve it, you need to know the artifact's path where it is stored. The method `list_artifacats` can be used to find artifacts that are representing a model since MLflow models are always folders. You can download a model by indicating the path where the model is stored using the `download_artifact` method:

  ```python
  artifact_path="classifier"
  model_local_path = client.download_artifacts("1234-5678-90AB-CDEFG", path=artifact_path)
  ```
  
You can then load the model back from the downloaded artifacts using the typical function `load_model`:

  ```python
  model = mlflow.xgboost.load_model(model_local_path)
  ```
> [!NOTE]
> In the example above, we are assuming the model was created using `xgboost`. Change it to the flavor applies to your case.

MLflow also allows you to both operations at once and download and load the model in a single instruction. MLflow will download the model to a temporary folder and load it from there. This can be done using the `load_model` method which uses an URI format to indicate from where the model has to be retrieved. In the case of loading a model from a run, the URI structure is as follows:

  ```python
  model = mlflow.xgboost.load_model(f"runs:/{last_run.info.run_id}/{artifact_path}")
  ```

> [!TIP]
> You can also load models from the registry using MLflow. View [loading MLflow models with MLflow](how-to-manage-models-mlflow.md#loading-models-from-registry) for details.

## Getting child (nested) runs

MLflow supports the concept of child (nested) runs. They are useful when you need to spin off training routines requiring being tracked independently from the main training process. This is the typical case of hyper-parameter tuning for instance. You can query all the child runs of a specific run using the property tag `mlflow.parentRunId`, which contains the run ID of the parent run.

```python
hyperopt_run = mlflow.last_active_run()
child_runs = mlflow.search_runs(
    filter_string=f"tags.mlflow.parentRunId='{hyperopt_run.info.run_id}'"
)
```

## Compare jobs and models in AzureML Studio (preview)

To compare and evaluate the quality of your jobs and models in AzureML Studio, use the [preview panel](./how-to-enable-preview-features.md) to enable the feature. Once enabled, you can compare the parameters, metrics, and tags between the jobs and/or models you selected.

:::image type="content" source="media/how-to-track-experiments-mlflow/compare.gif" alt-text="Screenshot of the preview panel showing how to compare jobs and models in AzureML studio.":::


The [MLflow with Azure ML notebooks](https://github.com/Azure/azureml-examples/tree/main/v1/notebooks/using-mlflow) demonstrate and expand upon concepts presented in this article.

  * [Training and tracking a classifier with MLflow](https://github.com/Azure/azureml-examples/blob/main/v1/notebooks/using-mlflow/train-with-mlflow/xgboost_classification_mlflow.ipynb): Demonstrates how to track experiments using MLflow, log models and combine multiple flavors into pipelines.
  * [Manage experiments and runs with MLflow](https://github.com/Azure/azureml-examples/blob/main/v1/notebooks/using-mlflow/run-history/run_history.ipynb): Demonstrates how to query experiments, runs, metrics, parameters and artifacts from Azure ML using MLflow.


## Support matrix for querying runs and experiments

The MLflow SDK exposes several methods to retrieve runs, including options to control what is returned and how. Use the following table to learn about which of those methods are currently supported in MLflow when connected to Azure Machine Learning:

| Feature | Supported by MLflow | Supported by Azure ML |
| :- | :-: | :-: |
| Ordering runs by run fields (like `start_time`, `end_time`, etc) | **&check;** | **&check;** |
| Ordering runs by attributes | **&check;** | <sup>1</sup> |
| Ordering runs by metrics | **&check;** | <sup>1</sup> |
| Ordering runs by parameters | **&check;** | <sup>1</sup> |
| Ordering runs by tags | **&check;** | <sup>1</sup> |
| Filtering runs by run fields (like `start_time`, `end_time`, etc) |  | <sup>1</sup> |
| Filtering runs by attributes | **&check;** | <sup>1</sup> |
| Filtering runs by metrics | **&check;** | **&check;** |
| Filtering runs by metrics with special characters (escaped) | **&check;** |  |
| Filtering runs by parameters | **&check;** | **&check;** |
| Filtering runs by tags | **&check;** | **&check;** |
| Filtering runs with numeric comparators (metrics) including `=`, `!=`, `>`, `>=`, `<`, and `<=`  | **&check;** | **&check;** |
| Filtering runs with string comparators (params, tags, and attributes): `=` and `!=` | **&check;** | **&check;**<sup>2</sup> |
| Filtering runs with string comparators (params, tags, and attributes): `LIKE`/`ILIKE` | **&check;** |  |
| Filtering runs with comparators `AND` | **&check;** | **&check;** |
| Filtering runs with comparators `OR` |  |  |
| Renaming experiments | **&check;** |  |

> [!NOTE]
> - <sup>1</sup> Check the section [Getting runs inside an experiment](#getting-runs-inside-an-experiment) for instructions and examples on how to achieve the same functionality in Azure ML.
> - <sup>2</sup> `!=` for tags not supported.

## Next steps

* [Manage your models with MLflow](how-to-manage-models.md).
* [Deploy models with MLflow](how-to-deploy-mlflow-models.md).
