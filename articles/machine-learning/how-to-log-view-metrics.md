---
title: Log & view metrics and log files
titleSuffix: Azure Machine Learning
description: Enable logging on your ML training runs to monitor real-time run metrics, and to help diagnose errors and warnings.
services: machine-learning
author: swinner95
ms.author: shwinne
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.date: 04/19/2021
ms.topic: conceptual
ms.custom: how-to
---

# Log & view metrics and log files

Log real-time information using both the default Python logging package and Azure Machine Learning Python SDK-specific functionality. You can log locally and send logs to your workspace in the portal.

Logs can help you diagnose errors and warnings, or track performance metrics like parameters and model performance. In this article, you learn how to enable logging in the following scenarios:

> [!div class="checklist"]
> * Log run metrics
> * Interactive training sessions
> * Submitting training jobs using ScriptRunConfig
> * Python native `logging` settings
> * Logging from additional sources


> [!TIP]
> This article shows you how to monitor the model training process. If you're interested in monitoring resource usage and events from Azure Machine learning, such as quotas, completed training runs, or completed model deployments, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).

## Data types

You can log multiple data types including scalar values, lists, tables, images, directories, and more. For more information, and Python code examples for different data types, see the [Run class reference page](/python/api/azureml-core/azureml.core.run%28class%29).

### Logging run metrics 

Use the following methods in the logging APIs to influence the metrics visualizations. Note the [service limits](./resource-limits-quotas-capacity.md#metrics) for these logged metrics. 

|Logged Value|Example code| Format in portal|
|----|----|----|
|Log an array of numeric values| `run.log_list(name='Fibonacci', value=[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89])`|single-variable line chart|
|Log a single numeric value with the same metric name repeatedly used (like from within a for loop)| `for i in tqdm(range(-10, 10)):    run.log(name='Sigmoid', value=1 / (1 + np.exp(-i))) angle = i / 2.0`| Single-variable line chart|
|Log a row with 2 numerical columns repeatedly|`run.log_row(name='Cosine Wave', angle=angle, cos=np.cos(angle))   sines['angle'].append(angle)      sines['sine'].append(np.sin(angle))`|Two-variable line chart|
|Log table with 2 numerical columns|`run.log_table(name='Sine Wave', value=sines)`|Two-variable line chart|
|Log image|`run.log_image(name='food', path='./breadpudding.jpg', plot=None, description='desert')`|Use this method to log an image file or a matplotlib plot to the run. These images will be visible and comparable in the run record|

### Logging with MLflow
Use MLFlowLogger to log metrics.

```python
from azureml.core import Run
# connect to the workspace from within your running code
run = Run.get_context()
ws = run.experiment.workspace

# workspace has associated ml-flow-tracking-uri
mlflow_url = ws.get_mlflow_tracking_uri()

#Example: PyTorch Lightning
from pytorch_lightning.loggers import MLFlowLogger

mlf_logger = MLFlowLogger(experiment_name=run.experiment.name, tracking_uri=mlflow_url)
mlf_logger._run_id = run.id
```

## View run metrics

## Via the SDK
You can view the metrics of a trained model using ```run.get_metrics()```. See the example below. 

```python
from azureml.core import Run
run = Run.get_context()
run.log('metric-name', metric_value)

metrics = run.get_metrics()
# metrics is of type Dict[str, List[float]] mapping mertic names
# to a list of the values for that metric in the given run.

metrics.get('metric-name')
# list of metrics in the order they were recorded
```

<a name="view-the-experiment-in-the-web-portal"></a>

## View run metrics in AML studio UI

You can browse completed run records, including logged metrics, in the [Azure Machine Learning studio](https://ml.azure.com).

Navigate to the **Experiments** tab. To view all your runs in your Workspace across Experiments, select the **All runs** tab. You can drill down on runs for specific Experiments by applying the Experiment filter in the top menu bar.

For the individual Experiment view, select the **All experiments** tab. On the experiment run dashboard, you can see tracked metrics and logs for each run. 

You can also edit the run list table to select multiple runs and display either the last, minimum, or maximum logged value for your runs. Customize your charts to compare the logged metrics values and aggregates across multiple runs. You can plot multiple metrics on the y-axis of your chart and customize your x-axis to plot your logged metrics. 


### View and download log files for a run 

Log files are an essential resource for debugging the Azure ML workloads. After submitting a training job, drill down to a specific run to view its logs and outputs:  

1. Navigate to the **Experiments** tab.
1. Select the runID for a specific run.
1. Select **Outputs and logs** at the top of the page.
2. Select **Download all** to download all your logs into a zip folder.
3. You can also download individual log files by choosing the log file and selecting **Download**

:::image type="content" source="media/how-to-log-view-metrics/download-logs.png" alt-text="Screenshot of Output and logs section of a run.":::

The tables below show the contents of the log files in the folders you'll see in this section.

> [!NOTE]
> You will not necessarily see every file for every run. For example, the 20_image_build_log*.txt only appears when a new image is built (e.g. when you change you environment).

#### `azureml-logs` folder

|File  |Description  |
|---------|---------|
|20_image_build_log.txt     | Docker image building log for the training environment, optional, one per run. Only applicable when updating your Environment. Otherwise AML will reuse cached image. If successful, contains image registry details for the corresponding image.         |
|55_azureml-execution-<node_id>.txt     | stdout/stderr log of host tool, one per node. Pulls image to compute target. Note, this log only appears once you have secured compute resources.         |
|65_job_prep-<node_id>.txt     |   stdout/stderr log of job preparation script, one per node. Download your code to compute target and datastores (if requested).       |
|70_driver_log(_x).txt      |  stdout/stderr log from AML control script and customer training script, one per process. **Standard output from your script. This file is where your code's logs (for example, print statements) show up.** In the majority of cases, you will monitor the logs here.       |
|70_mpi_log.txt     |   MPI framework log, optional, one per run. Only for MPI run.   |
|75_job_post-<node_id>.txt     |  stdout/stderr log of job release script, one per node. Send logs, release the compute resources back to Azure.        |
|process_info.json      |   show which process is running on which node.  |
|process_status.json      | show process status, such as if a process is not started, running, or completed.         |

#### `logs > azureml` folder

|File  |Description  |
|---------|---------|
|110_azureml.log      |         |
|job_prep_azureml.log     |   system log for job preparation        |
|job_release_azureml.log     | system log for job release        |

#### `logs > azureml > sidecar > node_id` folder

When sidecar is enabled, job prep and job release scripts will be run within sidecar container.  There is one folder for each node. 

|File  |Description  |
|---------|---------|
|start_cms.txt     |  Log of process that starts when Sidecar Container starts       |
|prep_cmd.txt      |   Log for ContextManagers entered when `job_prep.py` is run (some of this content will be streamed to `azureml-logs/65-job_prep`)       |
|release_cmd.txt     |  Log for ComtextManagers exited when `job_release.py` is run        |

#### Other folders

For jobs training on multi-compute clusters, logs are present for each node IP. The structure for each node is the same as single node jobs. There is one more logs folder for overall execution, stderr, and stdout logs.

Azure Machine Learning logs information from various sources during training, such as AutoML or the Docker container that runs the training job. Many of these logs are not documented. If you encounter problems and contact Microsoft support, they may be able to use these logs during troubleshooting.


## Interactive logging session

Interactive logging sessions are typically used in notebook environments. The method [Experiment.start_logging()](/python/api/azureml-core/azureml.core.experiment%28class%29#start-logging--args----kwargs-) starts an interactive logging session. Any metrics logged during the session are added to the run record in the experiment. The method [run.complete()](/python/api/azureml-core/azureml.core.run%28class%29#complete--set-status-true-) ends the sessions and marks the run as completed.

## ScriptRun logs

In this section, you learn how to add logging code inside of runs created when configured with ScriptRunConfig. You can use the [**ScriptRunConfig**](/python/api/azureml-core/azureml.core.scriptrunconfig) class to encapsulate scripts and environments for repeatable runs. You can also use this option to show a visual Jupyter Notebooks widget for monitoring.

This example performs a parameter sweep over alpha values and captures the results using the [run.log()](/python/api/azureml-core/azureml.core.run%28class%29#log-name--value--description----) method.

1. Create a training script that includes the logging logic, `train.py`.

   [!code-python[](~/MachineLearningNotebooks/how-to-use-azureml/training/train-on-local/train.py)]


1. Submit the ```train.py``` script to run in a user-managed environment. The entire script folder is submitted for training.

   [!notebook-python[] (~/MachineLearningNotebooks/how-to-use-azureml/training/train-on-local/train-on-local.ipynb?name=src)]


   [!notebook-python[] (~/MachineLearningNotebooks/how-to-use-azureml/training/train-on-local/train-on-local.ipynb?name=run)]

    The `show_output` parameter turns on verbose logging, which lets you see details from the training process as well as information about any remote resources or compute targets. Use the following code to turn on verbose logging when you submit the experiment.

```python
run = exp.submit(src, show_output=True)
```

You can also use the same parameter in the `wait_for_completion` function on the resulting run.

```python
run.wait_for_completion(show_output=True)
```

## Native Python logging

Some logs in the SDK may contain an error that instructs you to set the logging level to DEBUG. To set the logging level, add the following code to your script.

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Other logging sources

Azure Machine Learning can also log information from other sources during training, such as automated machine learning runs, or Docker containers that run the jobs. These logs aren't documented, but if you encounter problems and contact Microsoft support, they may be able to use these logs during troubleshooting.

For information on logging metrics in Azure Machine Learning designer, see [How to log metrics in the designer](how-to-track-designer-experiments.md)

## Example notebooks

The following notebooks demonstrate concepts in this article:
* [how-to-use-azureml/training/train-on-local](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-local)
* [how-to-use-azureml/track-and-monitor-experiments/logging-api](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/track-and-monitor-experiments/logging-api)

[!INCLUDE [aml-clone-in-azure-notebook](../../includes/aml-clone-for-examples.md)]

## Next steps

See these articles to learn more on how to use Azure Machine Learning:

* See an example of how to register the best model and deploy it in the tutorial, [Train an image classification model with Azure Machine Learning](tutorial-train-models-with-aml.md).