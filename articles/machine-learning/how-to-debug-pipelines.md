---
title: Debug & troubleshoot ML pipelines
titleSuffix: Azure Machine Learning
description: Debug your Azure Machine Learning pipelines in Python. Learn common pitfalls for developing pipelines, and tips to help you debug your scripts before and during remote execution. Learn how to use Visual Studio Code to interactively debug your machine learning pipelines.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: troubleshooting
author: likebupt
ms.author: keli19
ms.date: 03/18/2020
ms.custom: tracking-python
---

# Debug and troubleshoot machine learning pipelines
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to debug and troubleshoot [machine learning pipelines](concept-ml-pipelines.md) in the [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py) and [Azure Machine Learning designer (preview)](https://docs.microsoft.com/azure/machine-learning/concept-designer). Information is provided on how to:

* Debug using the Azure Machine Learning SDK
* Debug using the Azure Machine Learning designer
* Debug using Application Insights
* Debug interactively using Visual Studio Code (VS Code) and the Python Tools for Visual Studio (PTVSD)

## Debug and troubleshoot in the Azure Machine Learning SDK
The following sections provide an overview of common pitfalls when building pipelines, and different strategies for debugging your code that's running in a pipeline. Use the following tips when you're having trouble getting a pipeline to run as expected.

### Testing scripts locally

One of the most common failures in a pipeline is that an attached script (data cleansing script, scoring script, etc.) is not running as intended, or contains runtime errors in the remote compute context that are difficult to debug in your workspace in the Azure Machine Learning studio. 

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

### Debugging scripts from remote context

Testing scripts locally is a great way to debug major code fragments and complex logic before you start building a pipeline, but at some point you will likely need to debug scripts during the actual pipeline run itself, especially when diagnosing behavior that occurs during the interaction between pipeline steps. We recommend liberal use of `print()` statements in your step scripts so that you can see object state and expected values during remote execution, similar to how you would debug JavaScript code.

The log file `70_driver_log.txt` contains: 

* All printed statements during your script's execution
* The stack trace for the script 

To find this and other log files in the portal, first click on the pipeline run in your workspace.

![Pipeline run list page](./media/how-to-debug-pipelines/pipelinerun-01.png)

Navigate to the pipeline run detail page.

![Pipeline run detail page](./media/how-to-debug-pipelines/pipelinerun-02.png)

Click on the module for the specific step. Navigate to the **Logs** tab. Other logs include information about your environment image build process and step preparation scripts.

![Pipeline run detail page log tab](./media/how-to-debug-pipelines/pipelinerun-03.png)

> [!TIP]
> Runs for *published pipelines* can be found in the **Endpoints** tab in your workspace. 
> Runs for *non-published pipelines* can be found in **Experiments** or **Pipelines**.

### Troubleshooting tips

The following table contains common problems during pipeline development, with potential solutions.

| Problem | Possible solution |
|--|--|
| Unable to pass data to `PipelineData` directory | Ensure you have created a directory in the script that corresponds to where your pipeline expects the step output data. In most cases, an input argument will define the output directory, and then you create the directory explicitly. Use `os.makedirs(args.output_dir, exist_ok=True)` to create the output directory. See the [tutorial](tutorial-pipeline-batch-scoring-classification.md#write-a-scoring-script) for a scoring script example that shows this design pattern. |
| Dependency bugs | If you have developed and tested scripts locally but find dependency issues when running on a remote compute in the pipeline, ensure your compute environment dependencies and versions match your test environment. (See [Environment building, caching, and reuse](https://docs.microsoft.com/azure/machine-learning/concept-environments#environment-building-caching-and-reuse)|
| Ambiguous errors with compute targets | Deleting and re-creating compute targets can solve certain issues with compute targets. |
| Pipeline not reusing steps | Step reuse is enabled by default, but ensure you haven't disabled it in a pipeline step. If reuse is disabled, the `allow_reuse` parameter in the step will be set to `False`. |
| Pipeline is rerunning unnecessarily | To ensure that steps only rerun when their underlying data or scripts change, decouple your directories for each step. If you use the same source directory for multiple steps, you may experience unnecessary reruns. Use the `source_directory` parameter on a pipeline step object to point to your isolated directory for that step, and ensure you aren't using the same `source_directory` path for multiple steps. |

### Logging options and behavior

The table below provides information for different debug options for pipelines. It isn't an exhaustive list, as other options exist besides just the Azure Machine Learning, Python, and OpenCensus ones shown here.

| Library                    | Type   | Example                                                          | Destination                                  | Resources                                                                                                                                                                                                                                                                                                                    |
|----------------------------|--------|------------------------------------------------------------------|----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Azure Machine Learning SDK | Metric | `run.log(name, val)`                                             | Azure Machine Learning Portal UI             | [How to track experiments](how-to-track-experiments.md#available-metrics-to-track)<br>[azureml.core.Run class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=experimental)                                                                                                                                                 |
| Python printing/logging    | Log    | `print(val)`<br>`logging.info(message)`                          | Driver logs, Azure Machine Learning designer | [How to track experiments](how-to-track-experiments.md#available-metrics-to-track)<br><br>[Python logging](https://docs.python.org/2/library/logging.html)                                                                                                                                                                       |
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

## Debug and troubleshoot in Azure Machine Learning designer (preview)

This section provides an overview of how to troubleshoot  pipelines in the designer. For pipelines created in the designer, you can find the **70_driver_log** file in either the authoring page, or in the pipeline run detail page.

### Get logs from the authoring page

When you submit a pipeline run and stay in the authoring page, you can find the log files generated for each module as each module finishes running.

1. Select a module that has finished running in the authoring canvas.
1. In the right pane of the module, go to the  **Outputs + logs** tab.
1. Expand the right pane, and select the **70_driver_log.txt** to view the file in browser. You can also download logs locally.

    ![Expanded output pane in the designer](./media/how-to-debug-pipelines/designer-logs.png)

### Get logs from pipeline runs

You can also find the log files for specific runs in the pipeline run detail page, which can be found in either the **Pipelines** or **Experiments** section of the studio.

1. Select a pipeline run created in the designer.

    ![Pipeline run page](./media/how-to-debug-pipelines/designer-pipelines.png)

1. Select a module in the preview pane.
1. In the right pane of the module, go to the  **Outputs + logs** tab.
1. Expand the right pane to view the **70_driver_log.txt** file in browser, or select the file to download the logs locally.

> [!IMPORTANT]
> To update a pipeline from the pipeline run details page, you must **clone** the pipeline run to a new pipeline draft. A pipeline run is a snapshot of the pipeline. It's similar to a log file, and cannot be altered. 

## Debug and troubleshoot in Application Insights
For more information on using the OpenCensus Python library in this manner, see this guide: [Debug and troubleshoot machine learning pipelines in Application Insights](how-to-debug-pipelines-application-insights.md)

## Debug and troubleshoot in Visual Studio Code

In some cases, you may need to interactively debug the Python code used in your ML pipeline. By using Visual Studio Code (VS Code) and the Python Tools for Visual Studio (PTVSD), you can attach to the code as it runs in the training environment.

### Prerequisites

* An __Azure Machine Learning workspace__ that is configured to use an __Azure Virtual Network__.
* An __Azure Machine Learning pipeline__ that uses Python scripts as part of the pipeline steps. For example, a PythonScriptStep.
* An Azure Machine Learning Compute cluster, which is __in the virtual network__ and is __used by the pipeline for training__.
* A __development environment__ that is __in the virtual network__. The development environment might be one of the following:

    * An Azure Virtual Machine in the virtual network
    * A Compute instance of Notebook VM in the virtual network
    * A client machine connected to the virtual network by a virtual private network (VPN).

For more information on using an Azure Virtual Network with Azure Machine Learning, see [Secure Azure ML experimentation and inference jobs within an Azure Virtual Network](how-to-enable-virtual-network.md).

### How it works

Your ML pipeline steps run Python scripts. These scripts are modified to perform the following actions:
    
1. Log the IP address of the host that they are running on. You use the IP address to connect the debugger to the script.

2. Start the PTVSD debug component, and wait for a debugger to connect.

3. From your development environment, you monitor the logs created by the training process to find the IP address where the script is running.

4. You tell VS Code the IP address to connect the debugger to by using a `launch.json` file.

5. You attach the debugger and interactively step through the script.

### Configure Python scripts

To enable debugging, make the following changes to the Python script(s) used by steps in your ML pipeline:

1. Add the following import statements:

    ```python
    import ptvsd
    import socket
    from azureml.core import Run
    ```

1. Add the following arguments. These arguments allow you to enable the debugger as needed, and set the timeout for attaching the debugger:

    ```python
    parser.add_argument('--remote_debug', action='store_true')
    parser.add_argument('--remote_debug_connection_timeout', type=int,
                    default=300,
                    help=f'Defines how much time the Azure ML compute target '
                    f'will await a connection from a debugger client (VSCODE).')
    ```

1. Add the following statements. These statements load the current run context so that you can log the IP address of the node that the code is running on:

    ```python
    global run
    run = Run.get_context()
    ```

1. Add an `if` statement that starts PTVSD and waits for a debugger to attach. If no debugger attaches before the timeout, the script continues as normal.

    ```python
    if args.remote_debug:
        print(f'Timeout for debug connection: {args.remote_debug_connection_timeout}')
        # Log the IP and port
        ip = socket.gethostbyname(socket.gethostname())
        print(f'ip_address: {ip}')
        ptvsd.enable_attach(address=('0.0.0.0', 5678),
                            redirect_output=True)
        # Wait for the timeout for debugger to attach
        ptvsd.wait_for_attach(timeout=args.remote_debug_connection_timeout)
        print(f'Debugger attached = {ptvsd.is_attached()}')
    ```

The following Python example shows a basic `train.py` file that enables debugging:

```python
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license.

import argparse
import os
import ptvsd
import socket
from azureml.core import Run

print("In train.py")
print("As a data scientist, this is where I use my training code.")

parser = argparse.ArgumentParser("train")

parser.add_argument("--input_data", type=str, help="input data")
parser.add_argument("--output_train", type=str, help="output_train directory")

# Argument check for remote debugging
parser.add_argument('--remote_debug', action='store_true')
parser.add_argument('--remote_debug_connection_timeout', type=int,
                    default=300,
                    help=f'Defines how much time the AML compute target '
                    f'will await a connection from a debugger client (VSCODE).')
# Get run object, so we can find and log the IP of the host instance
global run
run = Run.get_context()

args = parser.parse_args()

# Start debugger if remote_debug is enabled
if args.remote_debug:
    print(f'Timeout for debug connection: {args.remote_debug_connection_timeout}')
    # Log the IP and port
    ip = socket.gethostbyname(socket.gethostname())
    print(f'ip_address: {ip}')
    ptvsd.enable_attach(address=('0.0.0.0', 5678),
                        redirect_output=True)
    # Wait for the timeout for debugger to attach
    ptvsd.wait_for_attach(timeout=args.remote_debug_connection_timeout)
    print(f'Debugger attached = {ptvsd.is_attached()}')

print("Argument 1: %s" % args.input_data)
print("Argument 2: %s" % args.output_train)

if not (args.output_train is None):
    os.makedirs(args.output_train, exist_ok=True)
    print("%s created" % args.output_train)
```

### Configure ML pipeline

To provide the Python packages needed to start PTVSD and get the run context, create an environment
and set `pip_packages=['ptvsd', 'azureml-sdk==1.0.83']`. Change the SDK version to match the one you are using. The following code snippet demonstrates how to create an environment:

```python
# Use a RunConfiguration to specify some additional requirements for this step.
from azureml.core.runconfig import RunConfiguration
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core.runconfig import DEFAULT_CPU_IMAGE

# create a new runconfig object
run_config = RunConfiguration()

# enable Docker 
run_config.environment.docker.enabled = True

# set Docker base image to the default CPU-based image
run_config.environment.docker.base_image = DEFAULT_CPU_IMAGE

# use conda_dependencies.yml to create a conda environment in the Docker image for execution
run_config.environment.python.user_managed_dependencies = False

# specify CondaDependencies obj
run_config.environment.python.conda_dependencies = CondaDependencies.create(conda_packages=['scikit-learn'],
                                                                           pip_packages=['ptvsd', 'azureml-sdk==1.0.83'])
```

In the [Configure Python scripts](#configure-python-scripts) section, two new arguments were added to the scripts used by your ML pipeline steps. The following code snippet demonstrates how to use these arguments to enable debugging for the component and set a timeout. It also demonstrates how to use the environment created earlier by setting `runconfig=run_config`:

```python
# Use RunConfig from a pipeline step
step1 = PythonScriptStep(name="train_step",
                         script_name="train.py",
                         arguments=['--remote_debug', '--remote_debug_connection_timeout', 300],
                         compute_target=aml_compute, 
                         source_directory=source_directory,
                         runconfig=run_config,
                         allow_reuse=False)
```

When the pipeline runs, each step creates a child run. If debugging is enabled, the modified script logs information similar to the following text in the `70_driver_log.txt` for the child run:

```text
Timeout for debug connection: 300
ip_address: 10.3.0.5
```

Save the `ip_address` value. It is used in the next section.

> [!TIP]
> You can also find the IP address from the run logs for the child run for this pipeline step. For more information on viewing this information, see [Monitor Azure ML experiment runs and metrics](how-to-track-experiments.md).

### Configure development environment

1. To install the Python Tools for Visual Studio (PTVSD) on your VS Code development environment, use the following command:

    ```
    python -m pip install --upgrade ptvsd
    ```

    For more information on using PTVSD with VS Code, see [Remote Debugging](https://code.visualstudio.com/docs/python/debugging#_remote-debugging).

1. To configure VS Code to communicate with the Azure Machine Learning compute that is running the debugger, create a new debug configuration:

    1. From VS Code, select the __Debug__ menu and then select __Open configurations__. A file named __launch.json__ opens.

    1. In the __launch.json__ file, find the line that contains `"configurations": [`, and insert the following text after it. Change the `"host": "10.3.0.5"` entry to the IP address returned in your logs from the previous section. Change the `"localRoot": "${workspaceFolder}/code/step"` entry to a local directory that contains a copy of the script being debugged:

        ```json
        {
            "name": "Azure Machine Learning Compute: remote debug",
            "type": "python",
            "request": "attach",
            "port": 5678,
            "host": "10.3.0.5",
            "redirectOutput": true,
            "pathMappings": [
                {
                    "localRoot": "${workspaceFolder}/code/step1",
                    "remoteRoot": "."
                }
            ]
        }
        ```

        > [!IMPORTANT]
        > If there are already other entries in the configurations section, add a comma (,) after the code that you inserted.

        > [!TIP]
        > The best practice is to keep the resources for scripts in separate directories, which is why the `localRoot` example value references `/code/step1`.
        >
        > If you are debugging multiple scripts, in different directories, create a separate configuration section for each script.

    1. Save the __launch.json__ file.

### Connect the debugger

1. Open VS Code and open a local copy of the script.
2. Set breakpoints where you want the script to stop once you've attached.
3. While the child process is running the script, and the `Timeout for debug connection` is displayed in the logs, use the F5 key or select __Debug__. When prompted, select the __Azure Machine Learning Compute: remote debug__ configuration. You can also select the debug icon from the side bar, the __Azure Machine Learning: remote debug__ entry from the Debug dropdown menu, and then use the green arrow to attach the debugger.

    At this point, VS Code connects to PTVSD on the compute node and stops at the breakpoint you set previously. You can now step through the code as it runs, view variables, etc.

    > [!NOTE]
    > If the log displays an entry stating `Debugger attached = False`, then the timeout has expired and the script continued without the debugger. Submit the pipeline again and connect the debugger after the `Timeout for debug connection` message, and before the timeout expires.

## Next steps

* See the SDK reference for help with the [azureml-pipelines-core](https://docs.microsoft.com/python/api/azureml-pipeline-core/?view=azure-ml-py) package and the [azureml-pipelines-steps](https://docs.microsoft.com/python/api/azureml-pipeline-steps/?view=azure-ml-py) package.

* See the list of [designer exceptions and error codes](algorithm-module-reference/designer-error-codes.md).
