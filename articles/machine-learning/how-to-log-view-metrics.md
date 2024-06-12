---
title: Log metrics, parameters, and files with MLflow
titleSuffix: Azure Machine Learning
description: Enable logging on your ML training runs to monitor real-time run metrics with MLflow, and to help diagnose errors and warnings.
services: machine-learning
ms.author: fasantia
author: santiagxf
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 04/26/2024
ms.topic: how-to
ms.custom: sdkv2
---

# Log metrics, parameters, and files with MLflow

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

Azure Machine Learning supports logging and tracking experiments using [MLflow Tracking](https://www.mlflow.org/docs/latest/tracking.html). You can log models, metrics, parameters, and artifacts with MLflow, either locally on your computer or in a cloud environment.

> [!IMPORTANT]
> Unlike the Azure Machine Learning SDK v1, there's no logging functionality in the Azure Machine Learning SDK for Python (v2). If you used Azure Machine Learning SDK v1 before, we recommend that you leverage MLflow for tracking experiments. See [Migrate logging from SDK v1 to MLflow](reference-migrate-sdk-v1-mlflow-tracking.md) for specific guidance.

Logs can help you diagnose errors and warnings, or track performance metrics like parameters and model performance. This article explains how to enable logging in the following scenarios:

> [!div class="checklist"]
> * Log metrics, parameters, and models when submitting jobs.
> * Track runs when training interactively.
> * Log metrics asynchronously.
> * View diagnostic information about training.

> [!TIP]
> This article shows you how to monitor the model training process. If you're interested in monitoring resource usage and events from Azure Machine Learning, such as quotas, completed training jobs, or completed model deployments, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).

## Prerequisites

* You must have an Azure Machine Learning workspace. If you don't have one, see [Create workspace resources](quickstart-create-resources.md).
* You must have the `mlflow` and `azureml-mlflow` packages installed. If you don't, use the following command to install them in your development environment:

    ```bash
    pip install mlflow azureml-mlflow
    ```

    > [!NOTE]
    > For asynchronous logging of metrics, you need to have `MLflow` version 2.8.0+ and `azureml-mlflow` version 1.55+.

* If you're doing remote tracking (tracking experiments that run outside Azure Machine Learning), configure MLflow to track experiments. For more information, see [Configure MLflow for Azure Machine Learning](how-to-use-mlflow-configure-tracking.md).

* To log metrics, parameters, artifacts, and models in your experiments in Azure Machine Learning using MLflow, just import MLflow into your script:

    ```python
    import mlflow
    ```

### Configure experiments

MLflow organizes the information in experiments and runs (in Azure Machine Learning, runs are called jobs). There are some differences in how to configure them depending on how you run your code:

# [Training interactively](#tab/interactive)

When training interactively, such as in a Jupyter Notebook, use the following pattern:

1. Create or set the active experiment.
1. Start the job.
1. Use logging methods to log metrics and other information.
1. End the job.

For example, the following code snippet configures the experiment, and then logs during a job:

```python
import mlflow
# Set the experiment
mlflow.set_experiment("mlflow-experiment")

# Start the run
mlflow_run = mlflow.start_run()
# Log metrics or other information
mlflow.log_metric('mymetric', 1)
# End run 
mlflow.end_run()
```

> [!TIP]
> Technically you don't have to call `start_run()` because a new run is created if one doesn't exist and you call a logging API. In that case, you can use `mlflow.active_run()` to retrieve the run currently being used. For more information, see [mlflow.active_run()](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.active_run).

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

When you start a new run with `mlflow.start_run`, it might be useful to indicate the parameter `run_name`, which then translates to the name of the run in Azure Machine Learning user interface and helps you identify the run quicker:

```python
with mlflow.start_run(run_name="iris-classifier-random-forest") as run:
    mlflow.log_metric('mymetric', 1)
    mlflow.log_metric('anothermetric',1)
```

For more information on MLflow logging APIs, see the [MLflow reference](https://www.mlflow.org/docs/latest/python_api/mlflow.html#mlflow.log_artifact).

# [Training with jobs](#tab/jobs)

When running training jobs in Azure Machine Learning, you don't need to call `mlflow.start_run` because runs are automatically started. Hence, you can use mlflow tracking capabilities directly in your training scripts:

```python
import mlflow

mlflow.autolog()

mlflow.log_metric('mymetric', 1)
mlflow.log_metric('anothermetric',1)
```

> [!TIP]
> When submitting jobs using Azure Machine Learning CLI v2, you can set the experiment name using the property `experiment_name` in the YAML definition of the job. You don't have to configure it on your training script. See [YAML: display name, experiment name, description, and tags](reference-yaml-job-command.md#yaml-display-name-experiment-name-description-and-tags) for details.

---

## Log parameters

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

## Log metrics

Metrics, as opposite to parameters, are always numeric, and they can be logged either synchronously or asynchronously. When metrics are logged, they are immediately available for consumption upon call return. The following table describes how to log specific numeric types:

|Logged value|Example code| Notes|
|----|----|----|
|Log a numeric value (int or float) | `mlflow.log_metric("my_metric", 1)`| |
|Log a numeric value (int or float) over time | `mlflow.log_metric("my_metric", 1, step=1)`| Use parameter `step` to indicate the step at which you log the metric value. It can be any integer number. It defaults to zero. |
|Log a boolean value | `mlflow.log_metric("my_metric", 0)`| 0 = True, 1 = False|

> [!IMPORTANT]
> **Performance considerations:** If you need to log multiple metrics (or multiple values for the same metric), avoid making calls to `mlflow.log_metric` in loops. Better performance can be achieved by using [asynchronous logging](#log-metrics-asynchronously) with `mlflow.log_metric("metric1", 9.42, synchronous=False)` or by [logging a batch of metrics](#log-curves-or-list-of-values).

### Log metrics asynchronously

MLflow also allows logging of metrics in an asynchronous way. Asynchronous metric logging is particularly useful in cases where large training jobs with tens of compute nodes might be running and trying to log metrics concurrently. It's also useful when a small number of nodes is trying to log a high number of metrics.

Asynchronous metric logging allows you to log metrics immediately by avoiding waiting for them to materialize in the backend service. This approach scales to large training routines that log hundreds of thousands of metric values and it's the recommended approach.

MLflow logs metrics synchronously by default, however, you can change this behavior at any time:

```python
import mlflow

mlflow.config.enable_async_logging()
```

The same property can be set, using an environment variable:

```python
export MLFLOW_ENABLE_ASYNC_LOGGING=True
```

To log specific metrics asynchronously, use the MLflow logging API as you typically would, but add the extra parameter `synchronous=False`.

```python
import mlflow

with mlflow.start_run():
    # (...)
    mlflow.log_metric("metric1", 9.42, synchronous=False)
    # (...)
```

When you use `log_metric(synchronous=False)`, control is automatically returned to the caller once the operation is accepted; however, the value is not available for reading inmediately. Asynchronous logging of metrics does guarantee order and they are persisted with the timestamp of when they were logged.

> [!IMPORTANT]
> Even with `synchronous=False`, Azure Machine Learning guarantees the ordering of metrics.

If you need to wait for a particular value to be persisted in the backend, then you can use the metric operation returned to wait on it, as shown in the following example:

```python
import mlflow

with mlflow.start_run():
    # (...)
    run_operation = mlflow.log_metric("metric1", 9.42, synchronous=False)
    # (...)
    run_operation.wait()
    # (...)
```

You can asynchronously log one metric at a time or log a batch of metrics, as shown in the following example:

```python
import mlflow
import time
from mlflow.entities import Metric

with mlflow.start_run() as current_run:
    mlflow_client = mlflow.tracking.MlflowClient()

    metrics = {"metric-0": 3.14, "metric-1": 6.28}
    timestamp = int(time.time() * 1000)
    metrics_arr = [Metric(key, value, timestamp, 0) for key, value in metrics.items()]

    run_operation = mlflow_client.log_batch(
        run_id=current_run.info.run_id,
        metrics=metrics_arr,
        synchronous=False,
    )
```

The `wait()` operation is also available when logging a batch of metrics:

```python
run_operation.wait()
```

You don't have to call `wait()` on your routines if you don't need immediate access to the metric values. Azure Machine Learning automatically waits when the job is about to finish, to see if there is any pending metric to be persisted. By the time a job is completed in Azure Machine Learning, all metrics are guaranteed to be persisted.


### Log curves or list of values

Curves (or a list of numeric values) can be logged with MLflow by logging the same metric multiple times. The following example shows how to do it:

```python
list_to_log = [1, 2, 3, 2, 1, 2, 3, 2, 1]
from mlflow.entities import Metric
from mlflow.tracking import MlflowClient
import time

client = MlflowClient()
client.log_batch(mlflow.active_run().info.run_id, 
                 metrics=[Metric(key="sample_list", value=val, timestamp=int(time.time() * 1000), step=0) for val in list_to_log])
```


## Log images

MLflow supports two ways of logging images. Both ways persist the given image as an artifact inside of the run.

|Logged value|Example code| Notes|
|----|----|----|
|Log numpy metrics or PIL image objects|`mlflow.log_image(img, "figure.png")`| `img` should be an instance of `numpy.ndarray` or `PIL.Image.Image`. `figure.png` is the name of the artifact generated inside of the run. It doesn't have to be an existing file.|
|Log matlotlib plot or image file|` mlflow.log_figure(fig, "figure.png")`| `figure.png` is the name of the artifact generated inside of the run. It doesn't have to be an existing file. |

## Log files

In general, files in MLflow are called artifacts. You can log artifacts in multiple ways in Mlflow:

|Logged value|Example code| Notes|
|----|----|----|
|Log text in a text file | `mlflow.log_text("text string", "notes.txt")`| Text is persisted inside of the run in a text file with name *notes.txt*. |
|Log dictionaries as JSON and YAML files | `mlflow.log_dict(dictionary, "file.yaml"` | `dictionary` is a dictionary object containing all the structure that you want to persist as a JSON or YAML file. |
|Log a trivial file already existing | `mlflow.log_artifact("path/to/file.pkl")`| Files are always logged in the root of the run. If `artifact_path` is provided, then the file is logged in a folder as indicated in that parameter. |
|Log all the artifacts in an existing folder | `mlflow.log_artifacts("path/to/folder")`| Folder structure is copied to the run, but the root folder indicated isn't included. |

> [!TIP]
> When you log large files with `log_artifact` or `log_model`, you might encounter time out errors before the upload of the file is completed. Consider increasing the timeout value by adjusting the environment variable `AZUREML_ARTIFACTS_DEFAULT_TIMEOUT`. It's default value is *300* (seconds).

## Log models

MLflow introduces the concept of *models* as a way to package all the artifacts required for a given model to function. Models in MLflow are always a folder with an arbitrary number of files, depending on the framework used to generate the model. Logging models has the advantage of tracking all the elements of the model as a single entity that can be *registered* and then *deployed*. On top of that, MLflow models enjoy the benefit of [no-code deployment](how-to-deploy-mlflow-models.md) and can be used with the [Responsible AI dashboard](how-to-responsible-ai-dashboard.md) in studio. For more information, see [From artifacts to models in MLflow](concept-mlflow-models.md).

To save the model from a training run, use the `log_model()` API for the framework you're working with. For example, [mlflow.sklearn.log_model()](https://mlflow.org/docs/latest/python_api/mlflow.sklearn.html#mlflow.sklearn.log_model). For more information, see [Logging MLflow models](how-to-log-mlflow-models.md). For migrating existing models to MLflow, see [Convert custom models to MLflow](how-to-convert-custom-model-to-mlflow.md).

> [!TIP]
> When you log large models, you might encounter the error `Failed to flush the queue within 300 seconds`. Usually, it means the operation is timing out before the upload of the model artifacts is completed. Consider increasing the timeout value by adjusting the environment variable `AZUREML_ARTIFACTS_DEFAULT_TIMEOUT`.

## Automatic logging

With Azure Machine Learning and MLflow, users can log metrics, model parameters, and model artifacts automatically when training a model. Each framework decides what to track automatically for you. A [variety of popular machine learning libraries](https://mlflow.org/docs/latest/tracking.html#automatic-logging) are supported. [Learn more about Automatic logging with MLflow](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.autolog).

To enable [automatic logging](https://mlflow.org/docs/latest/tracking.html#automatic-logging), insert the following code before your training code:

```Python
mlflow.autolog()
```

> [!TIP]
> You can control what gets automatically logged with autolog. For instance, if you indicate `mlflow.autolog(log_models=False)`, MLflow logs everything but models for you. Such control is useful in cases where you want to log models manually but still enjoy automatic logging of metrics and parameters. Also notice that some frameworks might disable automatic logging of models if the trained model goes beyond specific boundaries. Such behavior depends on the flavor used and we recommend that you view the documentation if this is your case.

## View information about jobs or runs with MLflow

You can view the logged information using MLflow through the [MLflow.entities.Run](https://mlflow.org/docs/latest/python_api/mlflow.entities.html#mlflow.entities.Run) object:

```python
import mlflow

run = mlflow.get_run(run_id="<RUN_ID>")
```

You can view the metrics, parameters, and tags for the run in the data field of the run object.

```python
metrics = run.data.metrics
params = run.data.params
tags = run.data.tags
```

>[!NOTE]
> The metrics dictionary returned by `mlflow.get_run` or `mlflow.search_runs` only returns the most recently logged value for a given metric name. For example, if you log a metric called `iteration` multiple times with values, *1*, then *2*, then *3*, then *4*, only *4* is returned when calling `run.data.metrics['iteration']`.
> 
> To get all metrics logged for a particular metric name, you can use `MlFlowClient.get_metric_history()` as explained in the example [Getting params and metrics from a run](how-to-track-experiments-mlflow.md#get-params-and-metrics-from-a-run).

<a name="view-the-experiment-in-the-web-portal"></a>

> [!TIP]
> MLflow can retrieve metrics and parameters from multiple runs at the same time, allowing for quick comparisons across multiple trials. To learn more, see [Query & compare experiments and runs with MLflow](how-to-track-experiments-mlflow.md).

MLflow can query any artifact logged by a run. Artifacts can't be accessed using the run object itself and the MLflow client should be used instead:

```python
client = mlflow.tracking.MlflowClient()
client.list_artifacts("<RUN_ID>")
```

This method lists all the artifacts logged in the run, but they remain stored in the artifacts store (Azure Machine Learning storage). To download any of them, use the method `download_artifact`:

```python
file_path = client.download_artifacts("<RUN_ID>", path="feature_importance_weight.png")
```

For more information, please refer to [Getting metrics, parameters, artifacts and models](how-to-track-experiments-mlflow.md#get-metrics-parameters-artifacts-and-models).

## View information about jobs or runs in the studio

You can browse completed job records, including logged metrics, in the [Azure Machine Learning studio](https://ml.azure.com).

Navigate to the **Jobs** tab. To view all your jobs in your Workspace across Experiments, select the **All jobs** tab. You can drill down on jobs for specific experiments by applying the **Experiment** filter in the top menu bar. Select the job of interest to enter the details view, and then select the **Metrics** tab.

Select the logged metrics to render charts on the right side. You can customize the charts by applying smoothing, changing the color, or plotting multiple metrics on a single graph. You can also resize and rearrange the layout as you wish. After you create your desired view, you can save it for future use and share it with your teammates using a direct link.

:::image type="content" source="media/how-to-log-view-metrics/metrics.png" alt-text="Screenshot of the metrics view." lightbox="media/how-to-log-view-metrics/metrics.png":::

### View and download diagnostic logs

Log files are an essential resource for debugging the Azure Machine Learning workloads. After submitting a training job, drill down to a specific run to view its logs and outputs:  

1. Navigate to the **Jobs** tab.
1. Select the runID for a specific run.
1. Select **Outputs and logs** at the top of the page.
1. Select **Download all** to download all your logs into a zip folder.
1. You can also download individual log files by choosing the log file and selecting **Download**

:::image type="content" source="media/how-to-log-view-metrics/download-logs.png" alt-text="Screenshot of Output and logs section of a run." lightbox="media/how-to-log-view-metrics/download-logs.png":::

#### user_logs folder

This folder contains information about the user generated logs. This folder is open by default, and the **std_log.txt** log is selected. The **std_log.txt** is where your code's logs (for example, print statements) show up. This file contains `stdout` log and `stderr` logs from your control script and training script, one per process. In most cases, you monitor the logs here.

#### system_logs folder

This folder contains the logs generated by Azure Machine Learning and it's closed by default. The logs generated by the system are grouped into different folders, based on the stage of the job in the runtime.

#### Other folders

For jobs training on multi-compute clusters, logs are present for each IP node. The structure for each node is the same as single node jobs. There's one more logs folder for overall execution, stderr, and stdout logs.

Azure Machine Learning logs information from various sources during training, such as AutoML or the Docker container that runs the training job. Many of these logs aren't documented. If you encounter problems and contact Microsoft support, they might be able to use these logs during troubleshooting.

## Related content

* [Train ML models with MLflow and Azure Machine Learning](how-to-train-mlflow-projects.md)
* [Migrate from SDK v1 logging to MLflow tracking](reference-migrate-sdk-v1-mlflow-tracking.md)
