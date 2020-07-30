---
title: Log ML experiments & metrics
titleSuffix: Azure Machine Learning
description: Monitor your Azure ML experiments and monitor run metrics to enhance the model creation process. Add logging to your training script using run.log, Run.start_logging, or ScriptRunConfig.
services: machine-learning
author: likebupt
ms.author: keli19
ms.reviewer: peterlu
ms.service: machine-learning
ms.subservice: core
ms.date: 07/30/2020
ms.topic: conceptual
ms.custom: how-to
---

# Enable logging in Azure ML training runs
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

The Azure Machine Learning Python SDK lets log real-time information using both the default Python logging package, and SDK-specific functionality. This can be used to log locally and to send logs to your workspace in the portal.

Logs can help with diagnosing errors and warnings, or track performance metrics like parameters used and model accuracy across training runs. In this article, you learn different ways of enabling logging in the following areas:

> [!div class="checklist"]
> * Interactive training sessions
> * Submitting training jobs using ScriptRunConfig
> * Python native `logging` settings
> * Logging from additional sources

[Create an Azure Machine Learning workspace](how-to-manage-workspace.md). Use the [guide](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py) for more information the SDK.

> [!TIP]
> This article shows you how to monitor the model training process. If you're interested in monitoring resource usage and events from Azure Machine learning, such as quotas, completed training runs, or completed model deployments, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).

## Data types

You can log multiple data types including scalar values, lists, tables, images, directories, and more. For more information, and Python code examples for different data types, see the [Run class reference page](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py).

## Logging with interactive logging session

Interactive logging sessions are typically used in notebook environments. The method [Experiment.start_logging()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment(class)?view=azure-ml-py#start-logging--args----kwargs-) starts an interactive logging session. Any metrics logged during the session are added to the run record in the experiment. The logging session ends with [run.complete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#complete--set-status-true-), marks the run as completed and ends the logging session.

The following code snippet uses an interactive logging session to logs  training parameters (alpha), performance (mean square error), and uploads the trained model to a specified output location.

[!notebook-python[] (~/MachineLearningNotebooks/how-to-use-azureml/training/train-within-notebook/train-within-notebook.ipynb?name=create_experiment)]

For a complete sample notebook that uses interactive logging, see [Train a model in a notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-within-notebook/train-within-notebook.ipynb).

## Logging with ScriptRunConfig

You can use the [**ScriptRunConfig**](https://docs.microsoft.com/python/api/azureml-core/azureml.core.scriptrunconfig?view=azure-ml-py) class to encapsulate scripts and environments for repeatable runs. Use this option to add logging code inside of ScriptRunConfig runs. You can also use this option to show a visual Jupyter Notebooks widget for monitoring.

This example performs a parameter sweep over alpha values and captures the results using logs for the experiment run.

1. Create a training script that includes the logging logic, `train.py`.

   [!code-python[] (~/MachineLearningNotebooks/how-to-use-azureml/training/train-on-local/train.py)]


1. Submit the ```train.py``` script to run in a user-managed environment. The entire script folder is submitted for training.

   [!notebook-python[] (~/MachineLearningNotebooks/how-to-use-azureml/training/train-on-local/train-on-local.ipynb?name=src)]
   [!notebook-python[] (~/MachineLearningNotebooks/how-to-use-azureml/training/train-on-local/train-on-local.ipynb?name=run)]

To enable local logging of application state during training progress, use the `show_output` parameter. Enabling verbose logging allows you to see details from the training process as well as information about any remote resources or compute targets. Use the following code to enable logging upon experiment submission.

```python
run = exp.submit(src, show_output=True)
```

You can also use the same parameter in the `wait_for_completion` function on the resulting run.

```python
run.wait_for_completion(show_output=True)
```

For a complete sample notebook that uses ScriptRunConfigs logs, see [Train a mode locally](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-local/train-on-local.ipynb).

## Logging with native Python

Certain logs in the SDK may contain an error that instructs you to set the logging level to DEBUG. To set the logging level, add the following code to your script.

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Logging from additional sources

Azure Machine Learning can also log information from other sources during training, such as automated machine learning runs, or Docker containers that run the jobs. These logs aren't documented, but if you encounter problems and contact Microsoft support, they may be able to use these logs during troubleshooting.


## Monitor an experiment run

In this section, you learn how to view your custom logs during run execution.

For general information on how to manage your experiments, see [Start, monitor, and cancel training runs](how-to-manage-runs.md).

### Monitor runs from the studio

To see the runs for a specific compute target from your browser, use the following steps:

1. From the [Azure Machine Learning studio](https://ml.azure.com/), select your workspace, and then select __Compute__ from the left side of the page.

1. Select __Training Clusters__ to display a list of compute targets used for training. Then select the cluster.

    ![Select the training cluster](./media/how-to-track-experiments/select-training-compute.png)

1. Select __Runs__. The list of runs that use this cluster is displayed. To view details for a specific run, use the link in the __Run__ column. To view details for the experiment, use the link in the __Experiment__ column.

    ![Select runs for training cluster](./media/how-to-track-experiments/show-runs-for-compute.png)
    
    > [!TIP]
    > Since training compute targets are a shared resource, they can have multiple runs queued or active at a given time.
    > 
    > A run can contain child runs, so one training job can result in multiple entries.

Once a run completes, it is no longer displayed on this page. To view information on completed runs, visit the __Experiments__ section of the studio and select the experiment and run. For more information, see the [View metrics for completed runs](#view-metrics-for-completed-runs) section.

### Monitor runs using the Jupyter notebook widget

When you use the **ScriptRunConfig** method to submit runs, you can watch the progress of the run using the [Jupyter widget](https://docs.microsoft.com/python/api/azureml-widgets/azureml.widgets?view=azure-ml-py). Like the run submission, the widget is asynchronous and provides live updates every 10-15 seconds until the job completes.

View the Jupyter widget while waiting for the run to complete.
    
```python
from azureml.widgets import RunDetails
RunDetails(run).show()
```

![Screenshot of Jupyter notebook widget](./media/how-to-track-experiments/run-details-widget.png)

You can also get a link to the same display in your workspace.

```python
print(run.get_portal_url())
```

#### Monitor automated machine learning runs

For automated machine learning runs, to access the charts from a previous run, replace `<<experiment_name>>` with the appropriate experiment name:

```python
from azureml.widgets import RunDetails
from azureml.core.run import Run

experiment = Experiment (workspace, <<experiment_name>>)
run_id = 'autoML_my_runID' #replace with run_ID
run = Run(experiment, run_id)
RunDetails(run).show()
```

![Jupyter notebook widget for Automated Machine Learning](./media/how-to-track-experiments/azure-machine-learning-auto-ml-widget.png)

## View metrics for completed runs

### Show output upon completion

When you use **ScriptRunConfig**, you can use ```run.wait_for_completion(show_output = True)``` to show when the model training is complete. The ```show_output``` flag gives you verbose output. 

<a id="queryrunmetrics"></a>
### Query run metrics

You can view the metrics of a trained model using ```run.get_metrics()```. For example, you could use this with the example above to determine the best model by looking for the model with the lowest mean square error (mse) value.

<a name="view-the-experiment-in-the-web-portal"></a>
### View run records in the studio

You can browse completed run records, including logged metrics, in the [Azure Machine Learning studio](https://ml.azure.com).

Navigate to the **Experiments** tab and select your experiment. On the experiment run dashboard, you can see tracked metrics and logs for each run. 

You can drill down to a specific run to view its outputs or logs, or download the snapshot of the experiment you submitted so you can share the experiment folder with others.

You can edit the run list table to select multiple runs and display either the last, minimum, or maximum logged value for your runs. Customize your charts to compare the logged metrics values and aggregates across multiple runs.

:::image type="content" source="media/how-to-track-experiments/experimentation-tab.gif" alt-text="Run details in the Azure Machine Learning studio":::


### Format charts in the studio

You can use the following methods in the logging APIs to influence how metrics are visualized in the Azure Machine Learning studio.

|Logged Value|Example code| Format in portal|
|----|----|----|
|Log an array of numeric values| `run.log_list(name='Fibonacci', value=[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89])`|single-variable line chart|
|Log a single numeric value with the same metric name repeatedly used (like from within a for loop)| `for i in tqdm(range(-10, 10)):    run.log(name='Sigmoid', value=1 / (1 + np.exp(-i))) angle = i / 2.0`| Single-variable line chart|
|Log a row with 2 numerical columns repeatedly|`run.log_row(name='Cosine Wave', angle=angle, cos=np.cos(angle))   sines['angle'].append(angle)      sines['sine'].append(np.sin(angle))`|Two-variable line chart|
|Log table with 2 numerical columns|`run.log_table(name='Sine Wave', value=sines)`|Two-variable line chart|


## Example notebooks
The following notebooks demonstrate concepts in this article:
* [how-to-use-azureml/training/train-within-notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-within-notebook)
* [how-to-use-azureml/training/train-on-local](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-local)
* [how-to-use-azureml/track-and-monitor-experiments/logging-api](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/track-and-monitor-experiments/logging-api)

[!INCLUDE [aml-clone-in-azure-notebook](../../includes/aml-clone-for-examples.md)]

## Next steps

Try these next steps to learn how to use the Azure Machine Learning SDK for Python:

* See an example of how to register the best model and deploy it in the tutorial, [Train an image classification model with Azure Machine Learning](tutorial-train-models-with-aml.md).

* Learn how to [Train PyTorch Models with Azure Machine Learning](how-to-train-pytorch.md).
