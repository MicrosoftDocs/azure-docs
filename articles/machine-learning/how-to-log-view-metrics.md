---
title: Log & view metrics and log files
titleSuffix: Azure Machine Learning
description: Enable logging on your ML training runs to monitor real-time run metrics with MLflow, and to help diagnose errors and warnings.
services: machine-learning
author: swinner95
ms.author: shwinne
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.date: 04/28/2022
ms.topic: how-to
ms.custom: sdkv1, event-tier1-build-2022
---

[//]: # (needs PM review; Lots of code, what needs to be changed?)

# Log & view metrics and log files

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning Python SDK you are using:"]
> * [v1](./v1/how-to-log-view-metrics.md)
> * [v2 (preview)](how-to-log-view-metrics.md)

Log real-time information using [MLflow Tracking](https://www.mlflow.org/docs/latest/tracking.html). You can log models, metrics, and artifacts with MLflow as it supports local mode to cloud portability.

> [!IMPORTANT]
> Unlike the Azure Machine Learning SDK v1, there is no logging functionality in the SDK v2 preview.

Logs can help you diagnose errors and warnings, or track performance metrics like parameters and model performance. In this article, you learn how to enable logging in the following scenarios:

> [!div class="checklist"]
> * Log training run metrics
> * Interactive training sessions
> * Python native `logging` settings
> * Logging from additional sources


> [!TIP]
> This article shows you how to monitor the model training process. If you're interested in monitoring resource usage and events from Azure Machine learning, such as quotas, completed training jobs, or completed model deployments, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).

## Prerequisites

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* You must have an Azure Machine Learning workspace. A workspace is created in [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).
* You must have the `aureml-core`, `mlflow`, and `azure-mlflow` packages installed. If you don't, use the following command to install them in your development environment:

    ```bash
    pip install azureml-core mlflow azureml-mlflow
    ```

## Data types

The following table describes how to log specific value types:

|Logged Value|Example code| Notes|
|----|----|----|
|Log a numeric value (int or float) | `mlflow.log_metric('my_metric', 1)`| |
|Log a boolean value | `mlflow.log_metric('my_metric', 0)`| 0 = True, 1 = False|
|Log a string | `mlflow.log_text('foo', 'my_string')`| Logged as an artifact|
|Log numpy metrics or PIL image objects|`mlflow.log_image(img, 'figure.png')`||
|Log matlotlib plot or image file|` mlflow.log_figure(fig, "figure.png")`||

## Log a training job with MLflow

To set up for logging with MLflow, import `mlflow` and set the tracking URI:

> [!TIP]
> You do not need to set the tracking URI when using a notebook running on an Azure Machine Learning compute instance.

```python
from azureml.core import Workspace
import mlflow

ws = Workspace.from_config()
# Set the tracking URI to the Azure ML backend
# Not needed if running on Azure ML compute instance
# or compute cluster
mlflow.set_tracking_uri(ws.get_mlflow_tracking_uri())
```

### Interactive jobs

When training interactively, such as in a Jupyter Notebook, use the following pattern:

1. Create or set the active experiment. 
1. Start the job.
1. Use logging methods to log metrics and other information.
1. End the job.

For example, the following code snippet demonstrates setting the tracking URI, creating an experiment, and then logging during a job

```python
from mlflow.tracking import MlflowClient

# Create a new experiment if one doesn't already exist
mlflow.create_experiment("mlflow-experiment")

# Start the run, log metrics, end the run
mlflow_run = mlflow.start_run()
mlflow.log_metric('mymetric', 1)
mlflow.end_run()
```

> [!TIP]
> Technically you don't have to call `start_run()` as a new run is created if one doesn't exist and you call a logging API. In that case, you can use `mlflow.active_run()` to retrieve the run. However, the `mlflow.ActiveRun` object returned by `mlflow.active_run()` won't contain items like parameters, metrics, etc. For more information, see [mlflow.active_run()](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.active_run).

You can also use the context manager paradigm:

```python
from mlflow.tracking import MlflowClient

# Create a new experiment if one doesn't already exist
mlflow.create_experiment("mlflow-experiment")

# Start the run, log metrics, end the run
with mlflow.start_run() as run:
    # Run started when context manager is entered, and ended when context manager exits
    mlflow.log_metric('mymetric', 1)
    mlflow.log_metric('anothermetric',1)
    pass
```

For more information on MLflow logging APIs, see the [MLflow reference](https://www.mlflow.org/docs/latest/python_api/mlflow.html#mlflow.log_artifact).

### Remote runs

For remote training runs, the tracking URI and experiment are set automatically. Otherwise, the options for logging the run are the same as for interactive logging:

* Call `mlflow.start_run()`, log information, and then call `mlflow.end_run()`.
* Use the context manager paradigm with `mlflow.start_run()`.
* Call a logging API such as `mlflow.log_metric()`, which will start a run if one doesn't already exist.

## Log a model

To save the model from a training run, use the `log_model()` API for the framework you're working with. For example, [mlflow.sklearn.log_model()](https://mlflow.org/docs/latest/python_api/mlflow.sklearn.html#mlflow.sklearn.log_model). For frameworks that MLflow doesn't support, see [Convert custom models to MLflow](how-to-convert-custom-model-to-mlflow.md).

## View job information

You can view the logged information using MLflow through the [MLflow.entities.Run](https://mlflow.org/docs/latest/python_api/mlflow.entities.html#mlflow.entities.Run) object. After a training job completes, you can retrieve it using the [MlFlowClient()](https://mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient):

```python
from mlflow.tracking import MlflowClient

# Use MlFlow to retrieve the run that was just completed
client = MlflowClient()
finished_mlflow_run = MlflowClient().get_run(mlflow_run.info.run_id)
```

You can view the metrics, parameters, and tags for the run in the data field of the run object.

```python
metrics = finished_mlflow_run.data.metrics
tags = finished_mlflow_run.data.tags
params = finished_mlflow_run.data.params
```

>[!NOTE]
> The metrics dictionary under `mlflow.entities.Run.data.metrics` only returns the most recently logged value for a given metric name. For example, if you log, in order, 1, then 2, then 3, then 4 to a metric called `sample_metric`, only 4 is present in the metrics dictionary for `sample_metric`.
> 
> To get all metrics logged for a particular metric name, you can use [`MlFlowClient.get_metric_history()`](https://www.mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.get_metric_history).

<a name="view-the-experiment-in-the-web-portal"></a>

## View job metrics in the studio UI

You can browse completed job records, including logged metrics, in the [Azure Machine Learning studio](https://ml.azure.com).

Navigate to the **Experiments** tab. To view all your jobs in your Workspace across Experiments, select the **All jobs** tab. You can drill down on jobs for specific Experiments by applying the Experiment filter in the top menu bar.

For the individual Experiment view, select the **All experiments** tab. On the experiment run dashboard, you can see tracked metrics and logs for each run. 

You can also edit the job list table to select multiple jobs and display either the last, minimum, or maximum logged value for your jobs. Customize your charts to compare the logged metrics values and aggregates across multiple jobs. You can plot multiple metrics on the y-axis of your chart and customize your x-axis to plot your logged metrics. 


### View and download log files for a job 

Log files are an essential resource for debugging the Azure ML workloads. After submitting a training job, drill down to a specific run to view its logs and outputs:  

1. Navigate to the **Experiments** tab.
1. Select the runID for a specific run.
1. Select **Outputs and logs** at the top of the page.
2. Select **Download all** to download all your logs into a zip folder.
3. You can also download individual log files by choosing the log file and selecting **Download**

:::image type="content" source="media/how-to-log-view-metrics/download-logs.png" alt-text="Screenshot of Output and logs section of a run.":::

#### user_logs folder

This folder contains information about the user generated logs. This folder is open by default, and the **std_log.txt** log is selected. The **std_log.txt** is where your code's logs (for example, print statements) show up. This file contains `stdout` log and `stderr` logs from your control script and training script, one per process.  In most cases, you'll monitor the logs here.

#### system_logs folder

This folder contains the logs generated by Azure Machine Learning and it will be closed by default. The logs generated by the system are grouped into different folders, based on the stage of the job in the runtime.

#### Other folders

For jobs training on multi-compute clusters, logs are present for each node IP. The structure for each node is the same as single node jobs. There's one more logs folder for overall execution, stderr, and stdout logs.

Azure Machine Learning logs information from various sources during training, such as AutoML or the Docker container that runs the training job. Many of these logs aren't documented. If you encounter problems and contact Microsoft support, they may be able to use these logs during troubleshooting.

## Interactive logging session

Interactive logging sessions are typically used in notebook environments. The method [mlflow.start_run()](https://www.mlflow.org/docs/latest/python_api/mlflow.html#mlflow.start_run) starts a new MLflow run and sets it as active. Any metrics logged during the run are added the run record. The method [mlflow.end_run()](https://www.mlflow.org/docs/latest/python_api/mlflow.html#mlflow.end_run) ends the current active run.

## Other logging sources

Azure Machine Learning can also log information from other sources during training, such as automated machine learning runs, or Docker containers that run the jobs. These logs aren't documented, but if you encounter problems and contact Microsoft support, they may be able to use these logs during troubleshooting.

For information on logging metrics in Azure Machine Learning designer, see [How to log metrics in the designer](how-to-track-designer-experiments.md).

## Next steps

* [Train ML models with MLflow and Azure Machine Learning](how-to-train-mlflow-projects.md).
* [Migrate from SDK v1 logging to MLflow tracking](reference-migrate-sdk-v1-mlflow-tracking.md).
