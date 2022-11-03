---
title: Migrate logging from SDK v1 to MLflow
titleSuffix: Azure Machine Learning
description: Comparison of SDK v1 logging APIs and MLflow tracking
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022, ignite-2022

author: Abeomor
ms.author: osomorog
ms.date: 05/04/2022
ms.reviewer: larryfr
---

# Migrate logging from SDK v1 to SDK v2

The Azure Machine Learning Python SDK v2 does not provide native logging APIs. Instead, we recommend that you use [MLflow Tracking](https://www.mlflow.org/docs/latest/tracking.html). If you're migrating from SDK v1 to SDK v2, use the information in this section to understand the MLflow equivalents of SDK v1 logging APIs.

## Setup

To use MLflow tracking, import `mlflow` and optionally set the tracking URI for your workspace. If you're training on an Azure Machine Learning compute resource, such as a compute instance or compute cluster, the tracking URI is set automatically. If you're using a different compute resource, such as your laptop or desktop, you need to set the tracking URI.

```python
import mlflow

# The rest of this is only needed if you are not using an Azure ML compute
## Construct AzureML MLFLOW TRACKING URI
def get_azureml_mlflow_tracking_uri(region, subscription_id, resource_group, workspace):
return "azureml://{}.api.azureml.ms/mlflow/v1.0/subscriptions/{}/resourceGroups/{}/providers/Microsoft.MachineLearningServices/workspaces/{}".format(region, subscription_id, resource_group, workspace)

region='<REGION>' ## example: westus
subscription_id = '<SUBSCRIPTION_ID>' ## example: 11111111-1111-1111-1111-111111111111
resource_group = '<RESOURCE_GROUP>' ## example: myresourcegroup
workspace = '<AML_WORKSPACE_NAME>' ## example: myworkspacename

MLFLOW_TRACKING_URI = get_azureml_mlflow_tracking_uri(region, subscription_id, resource_group, workspace)

## Set the MLFLOW TRACKING URI
mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
```

## Experiments and runs

__SDK v1__

```python
from azureml.core import Experiment

# create an AzureML experiment and start a run
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

* The string will be logged as an _artifact_, not as a metric. In Azure Machine Learning studio, the value will be displayed in the __Outputs + logs__ tab.

### Log an image to a PNG or JPEG file

__SDK v1__

```python
azureml_run.log_image("sample_image", path="Azure.png")
```

__SDK v2 with MLflow__

```python
mlflow.log_artifact("Azure.png")
```

The image is logged as an artifact and will appear in the __Images__ tab in Azure Machine Learning Studio.

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

* The image is logged as an artifact and will appear in the __Images__ tab in Azure Machine Learning Studio.
* The `mlflow.log_figure` method is __experimental__.


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

You can access run information using the MLflow run object's `data` and `info` properties. For more information, see [mlflow.entities.Run](https://mlflow.org/docs/latest/python_api/mlflow.entities.html#mlflow.entities.Run) reference.

The following example shows how to retrieve a finished run:

```python
from mlflow.tracking import MlflowClient

# Use MlFlow to retrieve the run that was just completed
client = MlflowClient()
finished_mlflow_run = MlflowClient().get_run(mlflow_run.info.run_id)
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

To download an artifact, use [MlFlowClient.download_artifacts](https://www.mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.download_artifacts):

```python
client.download_artifacts(finished_mlflow_run.info.run_id, "Azure.png")
```
## Next steps

* [Track ML experiments and models with MLflow](how-to-use-mlflow-cli-runs.md)
* [Log and view metrics](how-to-log-view-metrics.md)
