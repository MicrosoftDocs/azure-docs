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
ms.date: 09/15/2020
ms.custom: devx-track-python
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
> This tutorial series focuses the Azure Machine Learning concepts suited to Python *jobs-based* machine learning tasks that are compute-intensive and/or require reproducibility. If you are more interested in an exploratory workflow, you could instead use [Jupyter or RStudio on an Azure Machine Learning compute instance](tutorial-1st-experiment-sdk-setup.md).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try [Azure Machine Learning](https://aka.ms/AMLFree).
- Familiarity with Python and [Machine Learning concepts](concept-azure-machine-learning-architecture.md). Examples include environments, training, and scoring.
- Local development environment, such as Visual Studio Code, Jupyter, or PyCharm.
- Python (version 3.5 to 3.7).


## Install the Azure Machine Learning SDK

Throughout this tutorial, we make use of the Azure Machine Learning SDK for Python.

You can use the tools most familiar to you (for example, Conda and pip) to set up a Python environment to use throughout this tutorial. Install into your Python environment the Azure Machine Learning SDK for Python via pip:

```bash
pip install azureml-sdk
```

## Create a directory structure for code
We recommend that you set up the following simple directory structure for this tutorial:

```markdown
tutorial
└──.azureml
```

- `tutorial`: Top-level directory of the project.
- `.azureml`: Hidden subdirectory for storing Azure Machine Learning configuration files.

## Create an Azure Machine Learning workspace

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

Run this code from the `tutorial` directory:

```bash
cd <path/to/tutorial>
python ./01-create-workspace.py
```

> [!TIP]
> If running this code gives you an error that you do not have access to the subscription, see [Create a workspace](how-to-manage-workspace.md?tab=python#create-multi-tenant) for information on authentication options.


After you've successfully run *01-create-workspace.py*, your folder structure will look like:

```markdown
tutorial
└──.azureml
|  └──config.json
└──01-create-workspace.py
```

The file `.azureml/config.json` contains the metadata necessary to connect to your Azure Machine Learning
workspace. Namely, it contains your subscription ID, resource group, and workspace name. 

> [!NOTE]
> The contents of `config.json` are not secrets. It's fine to share these details.
>
> Authentication is still required to interact with your Azure Machine Learning workspace.

## Create an Azure Machine Learning compute cluster

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
                                                           idle_seconds_before_scaledown=2400)
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)

cpu_cluster.wait_for_completion(show_output=True)
```

Run the Python file:

```bash
python ./02-create-compute.py
```


> [!NOTE]
> When the cluster is created, it will have 0 nodes provisioned. The cluster *does not* incur costs until you submit a job. This cluster will scale down when it has been idle for 2,400 seconds (40 minutes).

Your folder structure will now look as follows:

```bash
tutorial
└──.azureml
|  └──config.json
└──01-create-workspace.py
└──02-create-compute.py
```

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
