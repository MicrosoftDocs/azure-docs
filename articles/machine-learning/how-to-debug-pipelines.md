---
title: Debug & troubleshoot ML pipelines
titleSuffix: Azure Machine Learning
description: Debug your Azure Machine Learning pipelines in Python. Learn common pitfalls for developing pipelines, and tips to help you debug your scripts before and during remote execution. Learn how to use Visual Studio Code to interactively debug your machine learning pipelines.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: lobrien
ms.author: laobri
ms.date: 08/28/2020
ms.topic: conceptual
ms.custom: troubleshooting, devx-track-python
---

# Debug and troubleshoot machine learning pipelines

In this article, you learn how to debug and troubleshoot [machine learning pipelines](concept-ml-pipelines.md) in the [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py&preserve-view=true) and [Azure Machine Learning designer](https://docs.microsoft.com/azure/machine-learning/concept-designer). Information is provided on how to:

## Troubleshooting tips

The following table contains common problems during pipeline development, with potential solutions.

| Problem | Possible solution |
|--|--|
| Unable to pass data to `PipelineData` directory | Ensure you have created a directory in the script that corresponds to where your pipeline expects the step output data. In most cases, an input argument will define the output directory, and then you create the directory explicitly. Use `os.makedirs(args.output_dir, exist_ok=True)` to create the output directory. See the [tutorial](tutorial-pipeline-batch-scoring-classification.md#write-a-scoring-script) for a scoring script example that shows this design pattern. |
| Dependency bugs | If you see dependency errors in your remote pipeline that did not occur when locally testing, confirm your remote environment dependencies and versions match those in your test environment. (See [Environment building, caching, and reuse](https://docs.microsoft.com/azure/machine-learning/concept-environments#environment-building-caching-and-reuse)|
| Ambiguous errors with compute targets | Try deleting and re-creating compute targets. Re-creating compute targets is quick and can solve some transient issues. |
| Pipeline not reusing steps | Step reuse is enabled by default, but ensure you haven't disabled it in a pipeline step. If reuse is disabled, the `allow_reuse` parameter in the step will be set to `False`. |
| Pipeline is rerunning unnecessarily | To ensure that steps only rerun when their underlying data or scripts change, decouple your source-code directories for each step. If you use the same source directory for multiple steps, you may experience unnecessary reruns. Use the `source_directory` parameter on a pipeline step object to point to your isolated directory for that step, and ensure you aren't using the same `source_directory` path for multiple steps. |
| Step slowing down over training epochs or other looping behavior | Try switching any file writes, including logging, from `as_mount()` to `as_upload()`. The **mount** mode uses a remote virtualized filesystem and uploads the entire file each time it is appended to. |

## Debugging techniques

There are three major techniques for debugging pipelines: 

* Debug individual pipeline steps on your local computer
* Use logging and Application Insights to isolate and diagnose the source of the problem
* Attach a remote debugger to a pipeline running in Azure

### Debug scripts locally

One of the most common failures in a pipeline is that the domain script does not run as intended, or contains runtime errors in the remote compute context that are difficult to debug.

Pipelines themselves cannot be run locally, but running the scripts in isolation on your local machine allows you to debug faster because you don't have to wait for the compute and environment build process. Some development work is required to do this:

* If your data is in a cloud datastore, you will need to download data and make it available to your script. Using a small sample of your data is a good way to cut down on runtime and quickly get feedback on script behavior
* If you are attempting to simulate an intermediate pipeline step, you may need to manually build the object types that the particular script is expecting from the prior step
* You will also need to define your own environment, and replicate the dependencies defined in your remote compute environment

Once you have a script setup to run on your local environment, it is much easier to do debugging tasks like:

* Attaching a custom debug configuration
* Pausing execution and inspecting object-state
* Catching type or logical errors that won't be exposed until runtime

> [!TIP] 
> Once you can verify that your script is running as expected, a good next step is running the script in a single-step pipeline before 
> attempting to run it in a pipeline with multiple steps.

## Configure, write to, and review pipeline logs

Testing scripts locally is a great way to debug major code fragments and complex logic before you start building a pipeline, but at some point you will likely need to debug scripts during the actual pipeline run itself, especially when diagnosing behavior that occurs during the interaction between pipeline steps. We recommend liberal use of `print()` statements in your step scripts so that you can see object state and expected values during remote execution, similar to how you would debug JavaScript code.

### Logging options and behavior

The table below provides information for different debug options for pipelines. It isn't an exhaustive list, as other options exist besides just the Azure Machine Learning, Python, and OpenCensus ones shown here.

| Library                    | Type   | Example                                                          | Destination                                  | Resources                                                                                                                                                                                                                                                                                                                    |
|----------------------------|--------|------------------------------------------------------------------|----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Azure Machine Learning SDK | Metric | `run.log(name, val)`                                             | Azure Machine Learning Portal UI             | [How to track experiments](how-to-track-experiments.md)<br>[azureml.core.Run class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run%28class%29?view=azure-ml-py&preserve-view=true)                                                                                                                                                 |
| Python printing/logging    | Log    | `print(val)`<br>`logging.info(message)`                          | Driver logs, Azure Machine Learning designer | [How to track experiments](how-to-track-experiments.md)<br><br>[Python logging](https://docs.python.org/2/library/logging.html)                                                                                                                                                                       |
| OpenCensus Python          | Log    | `logger.addHandler(AzureLogHandler())`<br>`logging.log(message)` | Application Insights - traces                | [Debug pipelines in Application Insights](how-to-debug-pipelines-application-insights.md)<br><br>[OpenCensus Azure Monitor Exporters](https://github.com/census-instrumentation/opencensus-python/tree/master/contrib/opencensus-ext-azure)<br>[Python logging cookbook](https://docs.python.org/3/howto/logging-cookbook.html) |

#### Logging options example

```python
import logging

from azureml.core.run import Run
from opencensus.ext.azure.log_exporter import AzureLogHandler

run = Run.get_context()

# Azure ML Scalar value logging
run.log("scalar_value", 0.95)

# Python print statement
print("I am a python print statement, I will be sent to the driver logs.")

# Initialize python logger
logger = logging.getLogger(__name__)
logger.setLevel(args.log_level)

# Plain python logging statements
logger.debug("I am a plain debug statement, I will be sent to the driver logs.")
logger.info("I am a plain info statement, I will be sent to the driver logs.")

handler = AzureLogHandler(connection_string='<connection string>')
logger.addHandler(handler)

# Python logging with OpenCensus AzureLogHandler
logger.warning("I am an OpenCensus warning statement, find me in Application Insights!")
logger.error("I am an OpenCensus error statement with custom dimensions", {'step_id': run.id})
``` 

## Azure Machine Learning designer

For pipelines created in the designer, you can find the **70_driver_log** file in either the authoring page, or in the pipeline run detail page.

### Enable logging for real-time endpoints

In order to troubleshoot and debug real-time endpoints in the designer, you must enable Application Insight logging using the SDK. Logging lets you troubleshoot and debug model deployment and usage issues. For more information, see [Logging for deployed models](how-to-enable-logging.md#logging-for-deployed-models). 

### Get logs from the authoring page

When you submit a pipeline run and stay in the authoring page, you can find the log files generated for each module as each module finishes running.

1. Select a module that has finished running in the authoring canvas.
1. In the right pane of the module, go to the  **Outputs + logs** tab.
1. Expand the right pane, and select the **70_driver_log.txt** to view the file in browser. You can also download logs locally.

    ![Expanded output pane in the designer](./media/how-to-debug-pipelines/designer-logs.png)?view=azure-ml-py&preserve-view=true)?view=azure-ml-py&preserve-view=true)

### Get logs from pipeline runs

You can also find the log files for specific runs in the pipeline run detail page, which can be found in either the **Pipelines** or **Experiments** section of the studio.

1. Select a pipeline run created in the designer.

    ![Pipeline run page](./media/how-to-debug-pipelines/designer-pipelines.png)

1. Select a module in the preview pane.
1. In the right pane of the module, go to the  **Outputs + logs** tab.
1. Expand the right pane to view the **70_driver_log.txt** file in browser, or select the file to download the logs locally.

> [!IMPORTANT]
> To update a pipeline from the pipeline run details page, you must **clone** the pipeline run to a new pipeline draft. A pipeline run is a snapshot of the pipeline. It's similar to a log file, and cannot be altered. 

## Application Insights
For more information on using the OpenCensus Python library in this manner, see this guide: [Debug and troubleshoot machine learning pipelines in Application Insights](how-to-debug-pipelines-application-insights.md)

## Interactive debugging with Visual Studio Code

In some cases, you may need to interactively debug the Python code used in your ML pipeline. By using Visual Studio Code (VS Code) and debugpy, you can attach to the code as it runs in the training environment. For more information, visit the [interactive debugging in VS Code guide](how-to-debug-visual-studio-code.md#debug-and-troubleshoot-machine-learning-pipelines).

## Next steps

* See the SDK reference for help with the [azureml-pipelines-core](https://docs.microsoft.com/python/api/azureml-pipeline-core/?view=azure-ml-py&preserve-view=true) package and the [azureml-pipelines-steps](https://docs.microsoft.com/python/api/azureml-pipeline-steps/?view=azure-ml-py&preserve-view=true) package.

* See the list of [designer exceptions and error codes](algorithm-module-reference/designer-error-codes.md).
