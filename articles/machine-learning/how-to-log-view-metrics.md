---
title: Log & view parameters, metrics and files
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

# Log & view metrics and log files

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning Python SDK you are using:"]
> * [v1](./v1/how-to-log-view-metrics.md)
> * [v2 (current)](how-to-log-view-metrics.md)

Azure Machine Learning supports logging and tracking experiments using [MLflow Tracking](https://www.mlflow.org/docs/latest/tracking.html). You can log models, metrics, parameters, and artifacts with MLflow as it supports local mode to cloud portability.

> [!IMPORTANT]
> Unlike the Azure Machine Learning SDK v1, there is no logging functionality in the Azure Machine Learning SDK for Python (v2). If you were using Azure Machine Learning SDK v1 before, we recommend you to start leveraging MLflow for tracking experiments. See [Migrate logging from SDK v1 to MLflow](reference-migrate-sdk-v1-mlflow-tracking.md) for specific guidance.

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
* You must have `mlflow`, and `azureml-mlflow` packages installed. If you don't, use the following command to install them in your development environment:

    ```bash
    pip install mlflow azureml-mlflow
    ```

> [!IMPORTANT]
> If you are running outside of any Azure Machine Learning Compute and you want to do remote tracking (running your training routine in other compute but tracking on Azure Machine Learning), you must have MLflow configured to do tracking to your workspace. See [Setup your tracking environment](how-to-use-mlflow-cli-runs.md?#set-up-tracking-environment) for more details.

## Logging parameters

MLflow supports the logging parameters used by your experiments. Parameters can be of any type, and can be logged using the following syntax:

```python
mlflow.log_param("num_epochs", 20)
```

MLflow also offers a convenient way to log multiple parameters by indicating all of them using a dictionary. Several frameworks can also pass parameters to models using dictionaries and hence this is a convenient way to log them in the experiment.

```python
params = {
    "num_epochs": 20,
    "dropout_rate": .6,
    "objective": "binary_crossentropy"
}

mlflow.log_params(params)
```

> [!NOTE] 
> Azure ML SDK v1 logging can't log parameters. We recommend the use of MLflow for tracking experiments as it offers a superior set of features.

## Logging metrics

Metrics, as opposite to parameters, are always numeric. The following table describes how to log specific numeric types:

|Logged Value|Example code| Notes|
|----|----|----|
|Log a numeric value (int or float) | `mlflow.log_metric("my_metric", 1)`| |
|Log a numeric value (int or float) over time | `mlflow.log_metric("my_metric", 1, step=1)`| Use parameter `step` to indicate the step at which you are logging the metric value. It can be any integer number. It defaults to zero. |
|Log a boolean value | `mlflow.log_metric("my_metric", 0)`| 0 = True, 1 = False|

> [!IMPORTANT]
> __Performance considerations:__ If you need to log multiple metrics (or multiple values for the same metric) avoid making calls to `mlflow.log_metric` in loops. Better performance can be achieved by logging batch of metrics. Use the method `mlflow.log_metrics` which accepts a dictionary with all the metrics you want to log at once or use `mlflow.log_batch` which accepts multiple type of elements for logging.

### Logging curves or list of values

Curves (or list of numeric values) can be logged with MLflow by logging the same metric multiple times. The following example shows how to do it:

```python
list_to_log = [1, 2, 3, 2, 1, 2, 3, 2, 1]
from mlflow.entities import Metric
from mlflow.tracking import MlflowClient
import time

client = MlflowClient()
client.log_batch(mlflow.active_run().info.run_id, 
                 metrics=[Metric(key="sample_list", value=val, timestamp=int(time.time() * 1000), step=0) for val in list_to_log])
```

## Logging images

MLflow supports two ways of logging images:

|Logged Value|Example code| Notes|
|----|----|----|
|Log numpy metrics or PIL image objects|`mlflow.log_image(img, "figure.png")`| `img` should be an instance of `numpy.ndarray` or `PIL.Image.Image`. `figure.png` is the name of the artifact that will be generated inside of the run. It doesn't have to be an existing file.|
|Log matlotlib plot or image file|` mlflow.log_figure(fig, "figure.png")`| `figure.png` is the name of the artifact that will be generated inside of the run. It doesn't have to be an existing file. |

## Logging other types of data

|Logged Value|Example code| Notes|
|----|----|----|
|Log text in a text file | `mlflow.log_text("text string", "notes.txt")`| Text is persisted inside of the run in a text file with name `notes.txt`. |
|Log dictionaries as `JSON` and `YAML` files | `mlflow.log_dict(dictionary, "file.yaml"` | `dictionary` is a dictionary object containing all the structure that you want to persist as `JSON` or `YAML` file. |
|Log a trivial file already existing | `mlflow.log_artifact("path/to/file.pkl")`| Files are always logged in the root of the run. If `artifact_path` is provided, then the file is logged in a folder as indicated in that parameter. |
|Log all the artifacts in an existing folder | `mlflow.log_artifacts("path/to/folder")`| Folder structure is copied to the run, but the root folder indicated is not included. |

## Logging models

MLflow introduces the concept of "models" as a way to package all the artifacts required for a given model to function. Models in MLflow are always a folder with an arbitrary number of files, depending on the framework used to generate the model. Logging models has the advantage of tracking all the elements of the model as a single entity that can be __registered__ and then __deployed__. On top of that, MLflow models enjoy the benefit of [no-code deployment](how-to-deploy-mlflow-models.md) and can be used with the [Responsible AI dashboard](how-to-responsible-ai-dashboard.md) in studio. Read the article [From artifacts to models in MLflow](concept-mlflow-models.md) for more information.

To save the model from a training run, use the `log_model()` API for the framework you're working with. For example, [mlflow.sklearn.log_model()](https://mlflow.org/docs/latest/python_api/mlflow.sklearn.html#mlflow.sklearn.log_model). For more details about how to log MLflow models see [Logging MLflow models](how-to-log-mlflow-models.md) For migrating existing models to MLflow, see [Convert custom models to MLflow](how-to-convert-custom-model-to-mlflow.md).

## Automatic logging

With Azure Machine Learning and MLFlow, users can log metrics, model parameters and model artifacts automatically when training a model.  A [variety of popular machine learning libraries](https://mlflow.org/docs/latest/tracking.html#automatic-logging) are supported. 

To enable [automatic logging](https://mlflow.org/docs/latest/tracking.html#automatic-logging) insert the following code before your training code:

```Python
mlflow.autolog()
```

> [!TIP]
> You can control what gets automatically logged wit autolog. For instance, if you indicate `mlflow.autolog(log_models=False)`, MLflow will log everything but models for you. Such control is useful in cases where you want to log models manually but still enjoy automatic logging of metrics and parameters. Also notice that some frameworks may disable automatic logging of models if the trained model goes behond specific boundaries. Such behavior depends on the flavor used and we recommend you to view they documentation if this is your case.

[Learn more about Automatic logging with MLflow](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.autolog). 

## Configuring experiments and runs in Azure Machine Learning

MLflow organizes the information in experiments and runs (in Azure Machine Learning, runs are called Jobs). There are some differences in how to configure them depending on how you are running your code:

# [Training interactively](#tab/interactive)

When training interactively, such as in a Jupyter Notebook, use the following pattern:

1. Create or set the active experiment. 
1. Start the job.
1. Use logging methods to log metrics and other information.
1. End the job.

For example, the following code snippet demonstrates configuring the experiment, and then logging during a job:

```python
import mlflow
mlflow.set_experiment("mlflow-experiment")

# Start the run, log metrics, end the run
mlflow_run = mlflow.start_run()
mlflow.log_metric('mymetric', 1)
mlflow.end_run()
```

> [!TIP]
> Technically you don't have to call `start_run()` as a new run is created if one doesn't exist and you call a logging API. In that case, you can use `mlflow.active_run()` to retrieve the run. However, the `mlflow.ActiveRun` object returned by `mlflow.active_run()` won't contain items like parameters, metrics, etc. For more information, see [mlflow.active_run()](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.active_run).

You can also use the context manager paradigm:

```python
import mlflow
mlflow.set_experiment("mlflow-experiment")

# Start the run, log metrics, end the run
with mlflow.start_run() as run:
    # Run started when context manager is entered, and ended when context manager exits
    mlflow.log_metric('mymetric', 1)
    mlflow.log_metric('anothermetric',1)
    pass
```

When you start a new run with `mlflow.start_run`, it may be useful to indicate the parameter `run_name` which will then translate to the name of the run in Azure Machine Learning user interface and help you identify the run quicker:

```python
with mlflow.start_run(run_name="iris-classifier-random-forest") as run:
    mlflow.log_metric('mymetric', 1)
    mlflow.log_metric('anothermetric',1)
```

For more information on MLflow logging APIs, see the [MLflow reference](https://www.mlflow.org/docs/latest/python_api/mlflow.html#mlflow.log_artifact).

# [Training with jobs](#tab/jobs)

When running training jobs in Azure Machine Learning you don't need to configure the MLflow tracking URI as it is already configured for you. On top of that, you don't need to call `mlflow.start_run` as runs are automatically started. Hence, you can use mlflow tracking capabilities directly in your training scripts:

```python
import mlflow

mlflow.set_experiment("my-experiment")

mlflow.autolog()

mlflow.log_metric('mymetric', 1)
mlflow.log_metric('anothermetric',1)
```

> [!TIP]
> When submitting jobs using Azure ML CLI v2, you can set the experiment name using the property `experiment_name` in the YAML definition of the job. You don't have to configure it on your training script. See [YAML: display name, experiment name, description, and tags](reference-yaml-job-command.md#yaml-display-name-experiment-name-description-and-tags) for details.

---

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
params = finished_mlflow_run.data.params
tags = finished_mlflow_run.data.tags
```

>[!NOTE]
> The metrics dictionary under `mlflow.entities.Run.data.metrics` only returns the most recently logged value for a given metric name. For example, if you log, in order, 1, then 2, then 3, then 4 to a metric called `sample_metric`, only 4 is present in the metrics dictionary for `sample_metric`.
> 
> To get all metrics logged for a particular metric name, you can use [`MlFlowClient.get_metric_history()`](https://www.mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.get_metric_history).

<a name="view-the-experiment-in-the-web-portal"></a>

## View job metrics in the studio UI

You can browse completed job records, including logged metrics, in the [Azure Machine Learning studio](https://ml.azure.com).

Navigate to the **Jobs** tab. To view all your jobs in your Workspace across Experiments, select the **All jobs** tab. You can drill down on jobs for specific Experiments by applying the Experiment filter in the top menu bar. Click on the job of interest to enter the details view, and then select the **Metrics** tab.

Select the logged metrics to render charts on the right side.

:::image type="content" source="media/how-to-log-view-metrics/metrics-old.png" alt-text="Screenshot of the current metrics view.":::

### View and download log files for a job 

Log files are an essential resource for debugging the Azure ML workloads. After submitting a training job, drill down to a specific run to view its logs and outputs:  

1. Navigate to the **Jobs** tab.
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
