---
title: "Tutorial: Get started with a Python script"
titleSuffix: Azure Machine Learning
description: Get started with your first Python script in Azure Machine Learning. This is part 1 of a three-part getting-started series.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: mafong
ms.author: mafong
ms.reviewer: sgilley
ms.date: 07/10/2022
ms.custom: devx-track-python, FY21Q4-aml-seo-hack, contperf-fy21q4, sdkv1, event-tier1-build-2022
---

# Tutorial: Get started with a Python script in Azure Machine Learning (part 1 of 3)

In this tutorial, you run your first Python script in the cloud with Azure Machine Learning. This tutorial is _part 1 of a three-part tutorial series_.

This tutorial avoids the complexity of training a machine learning model. You will run a "Hello World" Python script in the cloud. You will learn how a control script is used to configure and create a run in Azure Machine Learning.

In this tutorial, you will:

> [!div class="checklist"]
>
> - Create and run a "Hello world!" Python script.
> - Create a Python control script to submit "Hello world!" to Azure Machine Learning.
> - Understand the Azure Machine Learning concepts in the control script.
> - Submit and run the "Hello world!" script.
> - View your code output in the cloud.

## Prerequisites

- Complete [Quickstart: Set up your workspace to get started with Azure Machine Learning](quickstart-create-resources.md) to create a workspace, compute instance, and compute cluster to use in this tutorial series.

## Create and run a Python script

This tutorial will use the compute instance as your development computer. First create a few folders and the script:

1. Sign in to the [Azure Machine Learning studio](https://ml.azure.com) and select your workspace if prompted.
1. On the left, select **Notebooks**
1. In the **Files** toolbar, select **+**, then select **Create new folder**.
   :::image type="content" source="media/tutorial-1st-experiment-hello-world/create-folder.png" alt-text="Screenshot shows create a new folder tool in toolbar.":::
1. Name the folder **get-started**.
1. To the right of the folder name, use the **...** to create another folder under **get-started**.
   :::image type="content" source="media/tutorial-1st-experiment-hello-world/create-sub-folder.png" alt-text="Screenshot shows create a subfolder menu.":::
1. Name the new folder **src**. Use the **Edit location** link if the file location is not correct.
1. To the right of the **src** folder, use the **...** to create a new file in the **src** folder.
1. Name your file _hello.py_. Switch the **File type** to _Python (_.py)\*.

Copy this code into your file:

```python
# src/hello.py
print("Hello world!")
```

Your project folder structure will now look like:

:::image type="content" source="media/tutorial-1st-experiment-hello-world/directory-structure.png" alt-text="Folder structure shows hello.py in src subfolder.":::

### <a name="test"></a>Test your script

You can run your code locally, which in this case means on the compute instance. Running code locally has the benefit of interactive debugging of code.

If you have previously stopped your compute instance, start it now with the **Start compute** tool to the right of the compute dropdown. Wait about a minute for state to change to _Running_.

:::image type="content" source="media/tutorial-1st-experiment-hello-world/start-compute.png" alt-text="Screenshot shows starting the compute instance if it is stopped":::

Select **Save and run script in terminal** to run the script.

:::image type="content" source="media/tutorial-1st-experiment-hello-world/save-run-in-terminal.png" alt-text="Screenshot shows save and run script in terminal tool in the toolbar":::

You'll see the output of the script in the terminal window that opens. Close the tab and select **Terminate** to close the session.

## <a name="control-script"></a> Create a control script

A _control script_ allows you to run your `hello.py` script on different compute resources. You use the control script to control how and where your machine learning code is run.

Select the **...** at the end of **get-started** folder to create a new file. Create a Python file called _run-hello.py_ and copy/paste the following code into that file:

```python
# get-started/run-hello.py
from azure.ai.ml import MLClient, command, Input
from azure.identity import DefaultAzureCredential

subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace = "<AML_WORKSPACE_NAME>"

ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)

job = command(
    code="./src",
    command="python hello.py",
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu@latest",
    compute="cpu-cluster",
    display_name="hello-world-example",
)

returned_job = ml_client.create_or_update(job)
aml_url = returned_job.studio_url
print(aml_url)
```

> [!TIP]
> If you used a different name when you created your compute cluster, make sure to adjust the name in the code `compute_target='cpu-cluster'` as well.

### Understand the code

Here's a description of how the control script works:

:::row:::
:::column span="":::
`ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)`
:::column-end:::
:::column span="2":::
[MlClient](/python/api/azure-ai-ml/azure.ai.ml.mlclient) manages your Azure Machine Learning workspace and it's assets and resources
:::column-end:::
:::row-end:::
:::row:::
:::column span="":::
`job = command(...)`
:::column-end:::
:::column span="2":::
[command](/python/api/azure-ai-ml/azure.ai.ml?view=azure-python-preview#azure-ai-ml-command) provides a simple way to construct a standalone command job or one as part of a dsl.pipeline.
:::column-end:::
:::row-end:::
:::row:::
:::column span="":::
`returned_job = ml_client.create_or_update(job)`
:::column-end:::
:::column span="2":::
Submits your script. This submission is called a [job](/python/api/azure-ai-ml/azure.ai.ml.entities.job). A job encapsulates a single execution of your code. Use a job to monitor the script progress, capture the output, analyze the results, visualize metrics, and more.
:::column-end:::
:::row-end:::
:::row:::
:::column span="":::
`aml_url = returned_job.studio_url`
:::column-end:::
:::column span="2":::
The `job` object provides a handle on the execution of your code. Monitor its progress from the Azure Machine Learning studio with the URL that's printed from the Python script.  
 :::column-end:::
:::row-end:::

## <a name="submit"></a> Submit and run your code in the cloud

1. Select **Save and run script in terminal** to run your control script, which in turn runs `hello.py` on the compute cluster that you created in the [setup tutorial](quickstart-create-resources.md).

1. In the terminal, you may be asked to sign in to authenticate. Copy the code and follow the link to complete this step.

1. Once you're authenticated, you'll see a link in the terminal. Select the link to view the run.

   [!INCLUDE [amlinclude-info](../../includes/machine-learning-py38-ignore.md)]

## View the output

1. In the page that opens, you'll see the run status.
1. When the status of the run is **Completed**, select **Output + logs** at the top of the page.
1. Select **std_log.txt** to view the output of your run.

## <a name="monitor"></a>Monitor your code in the cloud in the studio

The output from your script will contain a link to the studio that looks something like this:
`https://ml.azure.com/runs/<run-id>?wsid=/subscriptions/<subscription-id>/resourcegroups/<resource-group>/workspaces/<workspace-name>`.

Follow the link. At first, you'll see a status of **Queued** or **Preparing**. The very first run will take 5-10 minutes to complete. This is because the following occurs:

- A docker image is built in the cloud
- The compute cluster is resized from 0 to 1 node
- The docker image is downloaded to the compute.

Subsequent runs are much quicker (~15 seconds) as the docker image is cached on the compute. You can test this by resubmitting the code below after the first run has completed.

Wait about 10 minutes. You'll see a message that the run has completed. Then use **Refresh** to see the status change to _Completed_. Once the job completes, go to the **Outputs + logs** tab.

The `70_driver_log.txt` file contains the standard output from a run. This file can be useful when you're debugging remote runs in the cloud.

```txt
1. [2022-07-11T03:20:54.156522] Entering context manager injector.
2. [2022-07-11T03:20:54.676601] context_manager_injector.py Command line Options: Namespace(inject=['ProjectPythonPath:context_managers.ProjectPythonPath', 'RunHistory:context_managers.RunHistory', 'TrackUserError:context_managers.TrackUserError', 'UserExceptions:context_managers.UserExceptions'], invocation=['python hello.py'])
3. Script type = COMMAND
4. [2022-07-11T03:20:54.680010] Command=python hello.py
5. [2022-07-11T03:20:54.680285] Entering Run History Context Manager.
6. [2022-07-11T03:20:58.157586] Command Working Directory=
7. [2022-07-11T03:20:58.157871] Starting Linux command : python hello.py
8. hello world
9. [2022-07-11T03:20:58.189470] Command finished with return code 0
10.
11.
12. [2022-07-11T03:20:58.189935] The experiment completed successfully. Finalizing run...
13. Cleaning up all outstanding Run operations, waiting 900.0 seconds
14. 1 items cleaning up...
15. 2022/07/11 03:20:59 Not exporting to RunHistory as the exporter is either stopped or there is no data.
16. Stopped: false
17. OriginalData: 1
18. FilteredData: 0.
19. Cleanup took 0.34975385665893555 seconds
20. [2022-07-11T03:20:59.156192] Finished context manager injector.
```

On line 8, you see the "Hello world!" output.

## Next steps

In this tutorial, you took a simple "Hello world!" script and ran it on Azure. You saw how to connect to your Azure Machine Learning workspace, create an experiment, and submit your `hello.py` code to the cloud.

In the next tutorial, you build on these learnings by running something more interesting than `print("Hello world!")`.

> [!div class="nextstepaction"] > [Tutorial: Train a model](tutorial-1st-experiment-sdk-train.md)

> [!NOTE]
> If you want to finish the tutorial series here and not progress to the next step, remember to [clean up your resources](tutorial-1st-experiment-bring-data.md#clean-up-resources).
