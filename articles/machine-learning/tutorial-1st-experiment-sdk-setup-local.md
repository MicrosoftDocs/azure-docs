---
title: "Tutorial: Get started with machine learning - Python"
titleSuffix: Azure Machine Learning 
description: In this tutorial, you'll get started with the Azure Machine Learning SDK for Python running in your personal development environment.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: aminsaied
ms.author: amsaied
ms.reviewer: sgilley
ms.date: 02/11/2021
ms.custom: devx-track-python
adobe-target: true
---

# Tutorial: Get started with Azure Machine Learning in your development environment (part 1 of 4)

In this *four-part tutorial series*, you'll learn the fundamentals of Azure Machine Learning and complete jobs-based Python machine learning tasks on the Azure cloud platform. 

In part 1 of this tutorial series, you will:

> [!div class="checklist"]
> * Install the Azure Machine Learning SDK.
> * Set up the directory structure for code.
> * Create an Azure Machine Learning workspace.
> * Configure your local development environment.
> * Set up a compute cluster.

> [!NOTE]
> This tutorial series focuses on the Azure Machine Learning concepts required to submit **batch jobs** - this is where the code is submitted to the cloud to run in the background without any user interaction. This is useful for finished scripts or code you wish to run repeatedly, or for compute-intensive machine learning tasks. If you are more interested in an exploratory workflow, you could instead use [Jupyter or RStudio on an Azure Machine Learning compute instance](tutorial-1st-experiment-sdk-setup.md).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try [Azure Machine Learning](https://aka.ms/AMLFree).
- [Anaconda](https://www.anaconda.com/download/) or [Miniconda](https://www.anaconda.com/download/) to manage Python virtual environments and install packages.  
- If you're not familiar with using conda, see [Getting started with conda](https://conda.io/projects/conda/en/latest/user-guide/getting-started.html).

## Install the Azure Machine Learning SDK

Throughout this tutorial, you will use the Azure Machine Learning SDK for Python. To avoid Python dependency issues, you'll create an isolated environment. This tutorial series uses conda to create that environment. If you prefer to use other solutions, such as `venv`, `virtualenv`, or docker, make sure you use a Python version >=3.5 and < 3.9.

Check if you have conda installed on your system:
    
```bash
conda --version
```
    
If this command returns a `conda not found` error, [download and install Miniconda](https://docs.conda.io/en/latest/miniconda.html). 

Once you have installed Conda, use a terminal or Anaconda Prompt window to create a new environment:

```bash
conda create -n tutorial python=3.8
```

Next, install the Azure Machine Learning SDK into the conda environment you created:

```bash
conda activate tutorial
pip install azureml-core
```
    
> [!NOTE]
> It takes approximately 2 minutes for the Azure Machine Learning SDK install to complete.
>
> If you get a timeout error, try `pip install --default-timeout=100 azureml-core` instead.


> [!div class="nextstepaction"]
> [I installed the SDK](?success=install-sdk#dir) [I ran into an issue](https://www.research.net/r/7C8Z3DN?issue=install-sdk)

## <a name="dir"></a>Create a directory structure for code

We recommend that you set up the following simple directory structure for this tutorial:

:::image type="content" source="media/tutorial-1st-experiment-sdk-local/directory-structure-1.png" alt-text="directory structure: tutorial top level with .azureml subdirectory":::


- `tutorial`: Top-level directory of the project.
- `.azureml`: Hidden subdirectory for storing Azure Machine Learning configuration files.

For example, to create this in a bash window:

```bash
mkdir tutorial
cd tutorial
mkdir .azureml
```

> [!TIP]
> To create or view the structure in a graphical window, first enable the ability to see and create hidden files and folders:
>
> * In a Mac Finder window use **Command + Shift + .** to toggle the display of hidden files/folders.  
> * In a Windows 10 File Explorer, see [how to view hidden files and folders](https://support.microsoft.com/en-us/windows/view-hidden-files-and-folders-in-windows-10-97fbc472-c603-9d90-91d0-1166d1d9f4b5). 
> * In the Linux Graphical Interface, use **Ctrl + h** or the **View** menu and check the box to **Show hidden files**.




> [!div class="nextstepaction"]
> [I created a directory](?success=create-dir#workspace) [I ran into an issue](https://www.research.net/r/7C8Z3DN?issue=create-dir)

## <a name="workspace"></a>Create an Azure Machine Learning workspace

A workspace is a top-level resource for Azure Machine Learning and is a centralized place to:

- Manage resources such as compute.
- Store assets like notebooks, environments, datasets, pipelines, models, and endpoints.
- Collaborate with other team members.

In the top-level directory, `tutorial`, add a new Python file called `01-create-workspace.py` by using the following code. Adapt the parameters (name, subscription ID, resource group, and [location](https://azure.microsoft.com/global-infrastructure/services/?products=machine-learning-service)) with your preferences.

You can run the code in an interactive session or as a Python file.

>[!NOTE]
> When you're using a local development environment (for example, your computer), you'll be asked to authenticate to your workspace by using a *device code* the first time you run the following code. Follow the on-screen instructions.

```python
# tutorial/01-create-workspace.py
from azureml.core import Workspace

ws = Workspace.create(name='<my_workspace_name>', # provide a name for your workspace
                      subscription_id='<azure-subscription-id>', # provide your subscription ID
                      resource_group='<myresourcegroup>', # provide a resource group name
                      create_resource_group=True,
                      location='<NAME_OF_REGION>') # For example: 'westeurope' or 'eastus2' or 'westus2' or 'southeastasia'.

# write out the workspace details to a configuration file: .azureml/config.json
ws.write_config(path='.azureml')
```

In the window that has the activated *tutorial1* conda environment, run this code from the `tutorial` directory.

```bash
cd <path/to/tutorial>
python ./01-create-workspace.py
```

> [!TIP]
> If running this code gives you an error that you do not have access to the subscription, see [Create a workspace](how-to-manage-workspace.md?tab=python#create-multi-tenant) for information on authentication options.


After you've successfully run *01-create-workspace.py*, your folder structure will look like:

:::image type="content" source="media/tutorial-1st-experiment-sdk-local/directory-structure-2.png" alt-text="File config.json appears in .azureml subdirectory after running 01-create-workspace.py":::

The file `.azureml/config.json` contains the metadata necessary to connect to your Azure Machine Learning
workspace. Namely, it contains your subscription ID, resource group, and workspace name. 

> [!NOTE]
> The contents of `config.json` are not secrets. It's fine to share these details.
>
> Authentication is still required to interact with your Azure Machine Learning workspace.

> [!div class="nextstepaction"]
> [I created a workspace](?success=create-workspace#cluster) [I ran into an issue](https://www.research.net/r/7C8Z3DN?issue=create-workspace)

## <a name="cluster"></a> Create an Azure Machine Learning compute cluster

Create a Python script in the `tutorial` top-level directory called `02-create-compute.py`. Populate it with the following code to create an Azure Machine Learning compute cluster that will autoscale between zero and four nodes:

```python
# tutorial/02-create-compute.py
from azureml.core import Workspace
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException

ws = Workspace.from_config() # This automatically looks for a directory .azureml

# Choose a name for your CPU cluster
cpu_cluster_name = "cpu-cluster"

# Verify that the cluster does not exist already
try:
    cpu_cluster = ComputeTarget(workspace=ws, name=cpu_cluster_name)
    print('Found existing cluster, use it.')
except ComputeTargetException:
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2',
                                                           idle_seconds_before_scaledown=2400,
                                                           min_nodes=0,
                                                           max_nodes=4)
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)

cpu_cluster.wait_for_completion(show_output=True)
```

In the window that has the activated *tutorial1* conda environment, run the Python file:

```bash
python ./02-create-compute.py
```


> [!NOTE]
> When the cluster is created, it will have 0 nodes provisioned. The cluster *does not* incur costs until you submit a job. This cluster will scale down when it has been idle for 2,400 seconds (40 minutes).

Your folder structure will now look as follows:

:::image type="content" source="media/tutorial-1st-experiment-sdk-local/directory-structure-3.png" alt-text="Add 02-create-compute.py to the tutorial directory":::

> [!div class="nextstepaction"]
> [I created a compute cluster](?success=create-compute-cluster#next-steps) [I ran into an issue](https://www.research.net/r/7C8Z3DN?issue=create-compute-cluster)

## View in the studio

Sign in to [Azure Machine Learning studio](https://ml.azure.com) to view the workspace and compute instance you created.

1. Select the **Subscription** you used to create the workspace.
1. Select the **Machine Learning workspace** you created, *tutorial-ws*.
1. Once the workspace loads, on the left side, select **Compute**.
1. At the top, select the **Compute clusters** tab.

:::image type="content" source="media/tutorial-1st-experiment-sdk-local/compute-instance-in-studio.png" alt-text="Screenshot: View the compute instance in your workspace.":::

This view shows the provisioned compute cluster, along with the number of idle nodes, busy nodes, and unprovisioned nodes.  Since you haven't used the cluster yet, all the nodes are currently unprovisioned.

## Next steps

In this setup tutorial, you have:

- Created an Azure Machine Learning workspace.
- Set up your local development environment.
- Created an Azure Machine Learning compute cluster.

In the other parts of this tutorial you will learn:

* Part 2. Run code in the cloud by using the Azure Machine Learning SDK for Python.
* Part 3. Manage the Python environment that you use for model training.
* Part 4. Upload data to Azure and consume that data in training.

Continue to the next tutorial, to walk through submitting a script to the Azure Machine Learning compute cluster.

> [!div class="nextstepaction"]
> [Tutorial: Run a "Hello world!" Python script on Azure](tutorial-1st-experiment-hello-world.md)
