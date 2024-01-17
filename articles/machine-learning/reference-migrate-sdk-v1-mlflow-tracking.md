---
title: Migrate logging from SDK v1 to MLflow
titleSuffix: Azure Machine Learning
description: Comparison of SDK v1 logging APIs and MLflow tracking
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022, ignite-2022

author: fkriti
ms.author: kritifaujdar
ms.date: 01/16/2024
ms.reviewer: larryfr
---

# Migrate logging from SDK v1 to SDK v2

Azure Machine Learning uses MLflow Tracking for metric logging and artifact storage for your experiments, whether you created the experiments via the Azure Machine Learning Python SDK, the Azure Machine Learning CLI, or Azure Machine Learning studio. We recommend using MLflow for tracking experiments. 

If you're migrating from SDK v1 to SDK v2, use the information in this section to understand the MLflow equivalents of SDK v1 logging APIs.

## Why MLflow?

MLflow, with over 13 million monthly downloads, has become the standard platform for end-to-end MLOps, enabling teams of all sizes to track, share, package and deploy any model for batch or real-time inference. Azure Machine Learning integrates with MLflow, which enables your training code to achieve true portability and seamless integration with other platforms since it doesn't hold any Azure Machine Learning specific instructions.

## Prepare for migrating to MLflow

To use MLflow tracking, you need to install Mlflow SDK package `mlflow` and Azure Machine Learning plug-in for MLflow `azureml-mlflow`. All Azure Machine Learning environments have these packages already available for you but you need to include them if creating your own environment.

```bash
pip install mlflow azureml-mlflow
```

## Connect to your workspace

Azure Machine Learning allows users to perform tracking in training jobs running on your workspace or running remotely (tracking experiments running outside Azure Machine Learning). If performing remote tracking, you need to indicate the workspace you want to connect MLflow to.

# [Azure Machine Learning compute](#tab/aml)

You are already connected to your workspace when running on Azure Machine Learning compute.

# [Remote compute](#tab/remote)

**Configure tracking URI**

[!INCLUDE [configure-mlflow-tracking](includes/machine-learning-mlflow-configure-tracking.md)]

**Configure authentication**

Once the tracking is configured, you also need to configure how the authentication needs to happen to the associated workspace. By default, the Azure Machine Learning plugin for MLflow performs interactive authentication by opening the default browser to prompt for credentials. Refer to [Configure MLflow for Azure Machine Learning: Configure authentication](how-to-use-mlflow-configure-tracking.md#configure-authentication) for more ways to configure authentication for MLflow in Azure Machine Learning workspaces.

[!INCLUDE [configure-mlflow-auth](includes/machine-learning-mlflow-configure-auth.md)]

---

## Experiments and runs

__SDK v1__

```python
from azureml.core import Experiment

# create an Azure Machine Learning experiment and start a run
experiment = Experiment(ws, "create-experiment-sdk-v1")
azureml_run = experiment.start_logging()
```

__SDK v2 with MLflow__

```python
# Set the MLflow experiment and start a run
mlflow.set_experiment("logging-with-mlflow")
mlflow_run = mlflow.start_run()
```

## Logging API comparison

### Log an integer or float metric

__SDK v1__

```python
azureml_run.log("sample_int_metric", 1)
```

__SDK v2 with MLflow__

```python
mlflow.log_metric("sample_int_metric", 1)
```

### Log a boolean metric

__SDK v1__

```python
azureml_run.log("sample_boolean_metric", True)
```

__SDK v2 with MLflow__

```python
mlflow.log_metric("sample_boolean_metric", 1)
```

### Log a string metric

__SDK v1__

```python
azureml_run.log("sample_string_metric", "a_metric")
```

__SDK v2 with MLflow__

```python
mlflow.log_text("sample_string_text", "string.txt")
```

* The string is logged as an _artifact_, not as a metric. In Azure Machine Learning studio, the value is displayed in the __Outputs + logs__ tab.

### Log an image to a PNG or JPEG file

__SDK v1__

```python
azureml_run.log_image("sample_image", path="Azure.png")
```

__SDK v2 with MLflow__

```python
mlflow.log_artifact("Azure.png")
```

The image is logged as an artifact and it appears in the __Images__ tab in Azure Machine Learning Studio.

### Log a matplotlib.pyplot

__SDK v1__

```python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3])
azureml_run.log_image("sample_pyplot", plot=plt)
```

__SDK v2 with MLflow__

```python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3])
fig, ax = plt.subplots()
ax.plot([0, 1], [2, 3])
mlflow.log_figure(fig, "sample_pyplot.png")
```

* The image is logged as an artifact and it appears in the __Images__ tab in Azure Machine Learning Studio.

### Log a list of metrics

__SDK v1__

```python
list_to_log = [1, 2, 3, 2, 1, 2, 3, 2, 1]
azureml_run.log_list('sample_list', list_to_log)
```

__SDK v2 with MLflow__

```python
list_to_log = [1, 2, 3, 2, 1, 2, 3, 2, 1]
from mlflow.entities import Metric
from mlflow.tracking import MlflowClient
import time

metrics = [Metric(key="sample_list", value=val, timestamp=int(time.time() * 1000), step=0) for val in list_to_log]
MlflowClient().log_batch(mlflow_run.info.run_id, metrics=metrics)
```
* Metrics appear in the __metrics__ tab in Azure Machine Learning studio.
* Text values are not supported.

### Log a row of metrics

__SDK v1__

```python
azureml_run.log_row("sample_table", col1=5, col2=10)
```

__SDK v2 with MLflow__

```python
metrics = {"sample_table.col1": 5, "sample_table.col2": 10}
mlflow.log_metrics(metrics)
```

* Metrics do not render as a table in Azure Machine Learning studio.
* Text values are not supported.
* Logged as an _artifact_, not as a metric.

### Log a table

__SDK v1__

```python
table = {
"col1" : [1, 2, 3],
"col2" : [4, 5, 6]
}
azureml_run.log_table("table", table)
```

__SDK v2 with MLflow__

```python
# Add a metric for each column prefixed by metric name. Similar to log_row
row1 = {"table.col1": 5, "table.col2": 10}
# To be done for each row in the table
mlflow.log_metrics(row1)

# Using mlflow.log_artifact
import json

with open("table.json", 'w') as f:
json.dump(table, f)
mlflow.log_artifact("table.json")
```

* Logs metrics for each column.
* Metrics do not render as a table in Azure Machine Learning studio.
* Text values are not supported.
* Logged as an _artifact_, not as a metric.

### Log an accuracy table

__SDK v1__

```python
ACCURACY_TABLE = '{"schema_type": "accuracy_table", "schema_version": "v1", "data": {"probability_tables": ' +\
        '[[[114311, 385689, 0, 0], [0, 0, 385689, 114311]], [[67998, 432002, 0, 0], [0, 0, ' + \
        '432002, 67998]]], "percentile_tables": [[[114311, 385689, 0, 0], [1, 0, 385689, ' + \
        '114310]], [[67998, 432002, 0, 0], [1, 0, 432002, 67997]]], "class_labels": ["0", "1"], ' + \
        '"probability_thresholds": [0.52], "percentile_thresholds": [0.09]}}'

azureml_run.log_accuracy_table('v1_accuracy_table', ACCURACY_TABLE)
```

__SDK v2 with MLflow__

```python
ACCURACY_TABLE = '{"schema_type": "accuracy_table", "schema_version": "v1", "data": {"probability_tables": ' +\
        '[[[114311, 385689, 0, 0], [0, 0, 385689, 114311]], [[67998, 432002, 0, 0], [0, 0, ' + \
        '432002, 67998]]], "percentile_tables": [[[114311, 385689, 0, 0], [1, 0, 385689, ' + \
        '114310]], [[67998, 432002, 0, 0], [1, 0, 432002, 67997]]], "class_labels": ["0", "1"], ' + \
        '"probability_thresholds": [0.52], "percentile_thresholds": [0.09]}}'

mlflow.log_dict(ACCURACY_TABLE, 'mlflow_accuracy_table.json')
```

* Metrics do not render as an accuracy table in Azure Machine Learning studio.
* Logged as an _artifact_, not as a metric.
* The `mlflow.log_dict` method is _experimental_.

### Log a confusion matrix

__SDK v1__

```python
CONF_MATRIX = '{"schema_type": "confusion_matrix", "schema_version": "v1", "data": {"class_labels": ' + \
    '["0", "1", "2", "3"], "matrix": [[3, 0, 1, 0], [0, 1, 0, 1], [0, 0, 1, 0], [0, 0, 0, 1]]}}'

azureml_run.log_confusion_matrix('v1_confusion_matrix', json.loads(CONF_MATRIX))
```

__SDK v2 with MLflow__

```python
CONF_MATRIX = '{"schema_type": "confusion_matrix", "schema_version": "v1", "data": {"class_labels": ' + \
    '["0", "1", "2", "3"], "matrix": [[3, 0, 1, 0], [0, 1, 0, 1], [0, 0, 1, 0], [0, 0, 0, 1]]}}'

mlflow.log_dict(CONF_MATRIX, 'mlflow_confusion_matrix.json')
```

* Metrics do not render as a confusion matrix in Azure Machine Learning studio.
* Logged as an _artifact_, not as a metric.
* The `mlflow.log_dict` method is _experimental_.

### Log predictions

__SDK v1__

```python
PREDICTIONS = '{"schema_type": "predictions", "schema_version": "v1", "data": {"bin_averages": [0.25,' + \
    ' 0.75], "bin_errors": [0.013, 0.042], "bin_counts": [56, 34], "bin_edges": [0.0, 0.5, 1.0]}}'

azureml_run.log_predictions('test_predictions', json.loads(PREDICTIONS))
```

__SDK v2 with MLflow__

```python
PREDICTIONS = '{"schema_type": "predictions", "schema_version": "v1", "data": {"bin_averages": [0.25,' + \
    ' 0.75], "bin_errors": [0.013, 0.042], "bin_counts": [56, 34], "bin_edges": [0.0, 0.5, 1.0]}}'

mlflow.log_dict(PREDICTIONS, 'mlflow_predictions.json')
```

* Metrics do not render as a confusion matrix in Azure Machine Learning studio.
* Logged as an _artifact_, not as a metric.
* The `mlflow.log_dict` method is _experimental_.

### Log residuals

__SDK v1__

```python
RESIDUALS = '{"schema_type": "residuals", "schema_version": "v1", "data": {"bin_edges": [100, 200, 300], ' + \
'"bin_counts": [0.88, 20, 30, 50.99]}}'

azureml_run.log_residuals('test_residuals', json.loads(RESIDUALS))
```

__SDK v2 with MLflow__

```python
RESIDUALS = '{"schema_type": "residuals", "schema_version": "v1", "data": {"bin_edges": [100, 200, 300], ' + \
'"bin_counts": [0.88, 20, 30, 50.99]}}'

mlflow.log_dict(RESIDUALS, 'mlflow_residuals.json')
```

* Metrics do not render as a confusion matrix in Azure Machine Learning studio.
* Logged as an _artifact_, not as a metric.
* The `mlflow.log_dict` method is _experimental_.

## View run info and data

You can access run information using the properties `data` and `info` of the MLflow [run (mlflow.entities.Run)](https://mlflow.org/docs/latest/python_api/mlflow.entities.html#mlflow.entities.Run) object.

> [!TIP]
> Experiments and runs tracking information in Azure Machine Learning can be queried using MLflow, which provides a comprehensive search API to query and search for experiments and runs easily, and quickly compare results. For more information about all the capabilities in MLflow in this dimension, see [Query & compare experiments and runs with MLflow](how-to-track-experiments-mlflow.md)

The following example shows how to retrieve a finished run:

```python
from mlflow.tracking import MlflowClient

# Use MlFlow to retrieve the run that was just completed
client = MlflowClient()
finished_mlflow_run = MlflowClient().get_run("<RUN_ID>")
```

The following example shows how to view the `metrics`, `tags`, and `params`:

```python
metrics = finished_mlflow_run.data.metrics
tags = finished_mlflow_run.data.tags
params = finished_mlflow_run.data.params
```

> [!NOTE]
> The `metrics` will only have the most recently logged value for a given metric. For example, if you log in order a value of `1`, then `2`, `3`, and finally `4` to a metric named `sample_metric`, only `4` will be present in the `metrics` dictionary. To get all metrics logged for a specific named metric, use [MlFlowClient.get_metric_history](https://mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.get_metric_history):
>
> ```python
> with mlflow.start_run() as multiple_metrics_run:
>     mlflow.log_metric("sample_metric", 1)
>     mlflow.log_metric("sample_metric", 2)
>     mlflow.log_metric("sample_metric", 3)
>     mlflow.log_metric("sample_metric", 4)
> 
> print(client.get_run(multiple_metrics_run.info.run_id).data.metrics)
> print(client.get_metric_history(multiple_metrics_run.info.run_id, "sample_metric"))
> ```
> 
> For more information, see the [MlFlowClient](https://mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient) reference.

The `info` field provides general information about the run, such as start time, run ID, experiment ID, etc.:

```python
run_start_time = finished_mlflow_run.info.start_time
run_experiment_id = finished_mlflow_run.info.experiment_id
run_id = finished_mlflow_run.info.run_id
```

## View run artifacts

To view the artifacts of a run, use [MlFlowClient.list_artifacts](https://mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.list_artifacts):

```python
client.list_artifacts(finished_mlflow_run.info.run_id)
```

To download an artifact, use [mlflow.artifacts.download_artifacts](https://www.mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.download_artifacts):

```python
mlflow.artifacts.download_artifacts(run_id=finished_mlflow_run.info.run_id, artifact_path="Azure.png")
```

## Next steps

* [Track ML experiments and models with MLflow](how-to-use-mlflow-cli-runs.md).
* [Log metrics, parameters and files with MLflow](how-to-log-view-metrics.md).
* [Logging MLflow models](how-to-log-mlflow-models.md).
* [Query & compare experiments and runs with MLflow](how-to-track-experiments-mlflow.md).
* [Manage models registries in Azure Machine Learning with MLflow](how-to-manage-models-mlflow.md).
