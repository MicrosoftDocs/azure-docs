---
title: 'Tutorial: Get started with a Python script (v1)'
titleSuffix: Azure Machine Learning
description: Get started with your first Python script in Azure Machine Learning, with SDK v1. This is part 1 of a two-part getting-started series.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: aminsaied
ms.author: amsaied
ms.reviewer: sgilley
ms.date: 04/03/2024
ms.custom: UpdateFrequency5, devx-track-python, sdkv1
---

# Tutorial: Get started with a Python script in Azure Machine Learning (SDK v1, part 1 of 3)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]


In this tutorial, you run your first Python script in the cloud with Azure Machine Learning. This tutorial is *part 1 of a two-part tutorial series*.

This tutorial avoids the complexity of training a machine learning model. You'll run a "Hello World" Python script in the cloud. You'll learn how a control script is used to configure and create a run in Azure Machine Learning.

In this tutorial, you will:

> [!div class="checklist"]
> * Create and run a "Hello world!" Python script.
> * Create a Python control script to submit "Hello world!" to Azure Machine Learning.
> * Understand the Azure Machine Learning concepts in the control script.
> * Submit and run the "Hello world!" script.
> * View your code output in the cloud.

## Prerequisites

- Complete [Create resources you need to get started](../quickstart-create-resources.md) to create a workspace and compute instance to use in this tutorial series.
- * [Create a cloud-based compute cluster](how-to-create-attach-compute-cluster.md#create). Name it 'cpu-cluster' to match the code in this tutorial.

## Create and run a Python script

This tutorial uses the compute instance as your development computer. First create a few folders and the script:

1. Sign in to the [Azure Machine Learning studio](https://ml.azure.com) and select your workspace if prompted.
1. On the left, select **Notebooks**
1. In the **Files** toolbar, select **+**, then select **Create new folder**.
  :::image type="content" source="./media/tutorial-1st-experiment-hello-world/create-folder.png" alt-text="Screenshot shows create a new folder tool in toolbar.":::
1. Name the folder **get-started**.
1. To the right of the folder name, use the **...** to create another folder under **get-started**.
  :::image type="content" source="./media/tutorial-1st-experiment-hello-world/create-sub-folder.png" alt-text="Screenshot shows create a subfolder menu.":::
1. Name the new folder **src**. Use the **Edit location** link if the file location isn't correct.
1. To the right of the **src** folder, use the **...** to create a new file in the **src** folder. 
1. Name your file *hello.py*. Switch the **File type** to *Python (*.py)*.

Copy this code into your file:

```python
# src/hello.py
print("Hello world!")
```

Your project folder structure will now look like: 

:::image type="content" source="./media/tutorial-1st-experiment-hello-world/directory-structure.png" alt-text="Folder structure shows hello.py in src subfolder.":::


### Test your script

You can run your code locally, which in this case means on the compute instance. Running code locally has the benefit of interactive debugging of code. 

If you have previously stopped your compute instance, start it now with the **Start compute** tool to the right of the compute dropdown. Wait about a minute for state to change to  *Running*.

:::image type="content" source="./media/tutorial-1st-experiment-hello-world/start-compute.png" alt-text="Screenshot shows starting the compute instance if it is stopped":::

Select **Save and run script in terminal** to run the script.

:::image type="content" source="./media/tutorial-1st-experiment-hello-world/save-run-in-terminal.png" alt-text="Screenshot shows save and run script in terminal tool in the toolbar":::

You see the output of the script in the terminal window that opens. Close the tab and select **Terminate** to close the session.

## Create a control script

A *control script* allows you to run your `hello.py` script on different compute resources. You use the control script to control how and where your machine learning code is run. 

Select the **...** at the end of **get-started** folder to create a new file. Create a Python file called *run-hello.py* and copy/paste the following code into that file:

```python
# get-started/run-hello.py
from azureml.core import Workspace, Experiment, Environment, ScriptRunConfig

ws = Workspace.from_config()
experiment = Experiment(workspace=ws, name='day1-experiment-hello')

config = ScriptRunConfig(source_directory='./src', script='hello.py', compute_target='cpu-cluster')

run = experiment.submit(config)
aml_url = run.get_portal_url()
print(aml_url)
```

> [!TIP]
> If you used a different name when you created your compute cluster, make sure to adjust the name in the code `compute_target='cpu-cluster'` as well.

### Understand the code

Here's a description of how the control script works:

:::row:::
   :::column span="":::
      `ws = Workspace.from_config()`
   :::column-end:::
   :::column span="2":::
      [Workspace](/python/api/azureml-core/azureml.core.workspace.workspace) connects to your Azure Machine Learning workspace, so that you can communicate with your Azure Machine Learning resources.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      `experiment =  Experiment( ... )`
   :::column-end:::
   :::column span="2":::
      [Experiment](/python/api/azureml-core/azureml.core.experiment.experiment) provides a simple way to organize multiple jobs under a single name. Later you can see how experiments make it easy to compare metrics between dozens of jobs.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      `config = ScriptRunConfig( ... )` 
   :::column-end:::
   :::column span="2":::
      [ScriptRunConfig](/python/api/azureml-core/azureml.core.scriptrunconfig) wraps your `hello.py` code and passes it to your workspace. As the name suggests, you can use this class to _configure_ how you want your _script_ to _run_ in Azure Machine Learning. It also specifies what compute target the script runs on. In this code, the target is the compute cluster that you created in the [setup tutorial](../quickstart-create-resources.md).
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      `run = experiment.submit(config)`
   :::column-end:::
   :::column span="2":::
       Submits your script. This submission is called a [run](/python/api/azureml-core/azureml.core.run%28class%29). In v2, it has been renamed to a job. A run/job encapsulates a single execution of your code. Use a job to monitor the script progress, capture the output, analyze the results, visualize metrics, and more.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      `aml_url = run.get_portal_url()` 
   :::column-end:::
   :::column span="2":::
        The `run` object provides a handle on the execution of your code. Monitor its progress from the Azure Machine Learning studio with the URL that prints from the Python script. 
   :::column-end:::
:::row-end:::


## Submit and run your code in the cloud

1. Select **Save and run script in terminal** to run your control script, which in turn runs `hello.py` on the compute cluster that you created in the [setup tutorial](../quickstart-create-resources.md).

1. In the terminal, you may be asked to sign in to authenticate. Copy the code and follow the link to complete this step.

1. Once you're authenticated, you see a link in the terminal. Select the link to view the job.

## Monitor your code in the cloud in the studio

The output from your script contains a link to the studio that looks something like this:
`https://ml.azure.com/experiments/hello-world/runs/<run-id>?wsid=/subscriptions/<subscription-id>/resourcegroups/<resource-group>/workspaces/<workspace-name>`.

Follow the link. At first, you see a status of **Queued** or **Preparing**. The first run takes 5-10 minutes to complete. This is because the following occurs:

* A docker image is built in the cloud
* The compute cluster is resized from 0 to 1 node
* The docker image is downloaded to the compute. 

Subsequent jobs are quicker (~15 seconds) as the docker image is cached on the compute. You can test this by resubmitting the code below after the first job has completed.

Wait about 10 minutes. You see a message that the job has completed. Then use **Refresh** to see the status change to *Completed*. Once the job completes, go to the **Outputs + logs** tab. There you can see a `std_log.txt` file in the `user_logs` folder.  The output of your script is in this file.

The `azureml-logs` and `system-logs` folders contain files that can be useful when you're debugging remote jobs in the cloud.

## Next step

In this tutorial, you took a simple "Hello world!" script and ran it on Azure. You saw how to connect to your Azure Machine Learning workspace, create an experiment, and submit your `hello.py` code to the cloud.

In the next tutorial, you build on these learnings by running something more interesting than `print("Hello world!")`.

> [!div class="nextstepaction"]
> [Tutorial: Train a model](tutorial-1st-experiment-sdk-train.md)

>[!NOTE] 
> If you want to finish the tutorial series here and not progress to the next step, remember to [clean up your resources](tutorial-1st-experiment-sdk-train.md#clean-up-resources).
