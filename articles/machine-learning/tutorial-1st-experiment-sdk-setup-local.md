---
title: "Tutorial:  Set up your local computer for Azure Machine Learning (Python)"
titleSuffix: Machine Learning - Azure 
description: In this tutorial, you'll to get started with the Azure Machine Learning Python SDK running on your local computer.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: aminsaied
ms.author: amsaied
ms.reviewer: sgilley
ms.date: 09/09/2020
ms.custom: devx-track-python
---

# Tutorial: Set up your local computer for Azure Machine Learning

In this tutorial, you complete the end-to-end steps to get started with the Azure Machine Learning Python SDK running on your local computer. This tutorial is a precursor to all other Python tutorials that want to perform them on your local computer. 

You could instead run the tutorials in a [compute instance](concept-compute-instance.md), a managed, pre-configured virtual machine (VM).  Use [Tutorial:  Set up a remote computer for Azure Machine Learning](tutorial-1st-experiment-sdk-setup.md) if you wish to run the tutorials on the compute instance.

In this tutorial, you:

> [!div class="checklist"]
> * Create an [Azure Machine Learning Workspace](concept-workspace.md) to use in the next tutorial.
> * Set up your local development environment.
> * Create an AzureML compute cluster.

## Prerequisites

- An Azure Subscription. If you don't have an Azure subscription, create a free account before you begin. Try [Azure Machine Learning](https://aka.ms/AMLFree) today.
- Familiarity with Python and [Machine Learning concepts](concept-azure-machine-learning-architecture.md). For example, environments, training, scoring, and so on.
- A local development environment - a laptop with Python installed and your favorite IDE (for example: VSCode, Pycharm, Jupyter, and so on).

>[!NOTE]
> This article is focused heavily on the AzureML features and concepts that help with __jobs-based__ machine learning tasks that have the following traits:
>
> - Python-based and
> - long running and/or
> - distributed (require many machines and processes) and/or
> - repeatable (require reproducible, auditable, and portable environment)
>
> If your machine learning tasks do not fit this profile - for example, you tend to run ad-hoc analysis with python code in a Jupyter notebook, or R code in Rstudio - **we would recommend you use the [Jupyter or RStudio functionality on a AzureML compute instance](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-run-jupyter-notebooks)**. This will be the fastest way for you to onboard to AzureML.

## Introduction

The goal of this article is to introduce you to the fundamental concepts of Azure Machine Learning (AzureML), including:

- Setting up a workspace and local (for example, laptop) ML developer environment
- Running code in the cloud using Azure ML's Python SDK
- Managing python environments to use to train a model
- Uploading data to Azure and consuming the data in your ML training

In this setup guide, we will:

1. Install the AzureML SDK
1. Set up directory structure for code
1. Create an AzureML workspace
1. Configure your local development environment
1. Set up a compute cluster


## Install the AzureML SDK

Throughout this article, we make use of the Azure ML Python SDK. The SDK allows us to use
Python to interact with AzureML.

You can use the tools most familiar to you - for example: conda, pip, and so on - to set up an environment to use throughout this article. Install into the environment the AzureML Python SDK via pip:

```bash
pip install azureml-sdk
```

## Create directory structure for code
We recommend that you have the following simple directory set up for this article:

```markdown
article
└──.azureml
```

- **article** (top-level directory of the project)
- **.azureml** (hidden subdirectory of article):  The `.azureml` directory is used to store AzureML configuration files.

## Create an Azure Machine Learning Workspace

A workspace is a top-level resource for Azure Machine Learning and is a centralized place to:

- Manage resources such as compute
- Store assets like Notebooks, Environments, Datasets, Pipelines, Models, Endpoints, and so on
- Collaborate with other team members

In the top-parent directory - `article` - add a new Python file called `01-create-workspace.py` with the code below. Adapt the parameters (name, subscription ID, resource group, and location) with your preferences. You can run the code in an interactive session, or as a python file.

>[!NOTE]
> When using a local (e.g. laptop) development environment you will be asked to authenticate to your workspace using a *device code* the first time you execute the code below. Follow the on-screen instructions.

```python
# article/01-create-workspace.py
from azureml.core import Workspace

ws = Workspace.create(name='<my_workspace_name>', # provide a name for your workspace
                      subscription_id='<azure-subscription-id>', # provide your subscription id
                      resource_group='<myresourcegroup>', # provide a resource group name
                      create_resource_group=True,
                      location='<azure-region>' # provide an azure region)

# write out the workspace details to a configuration file: .azureml/config.json
ws.write_config(path='.azureml')
```

Run this code from the `article` directory:

```bash
cd <path/to/article>
python ./01-create-workspace.py
```

Once the above code snippet has been run, your folder structure will look like:

```markdown
article
└──.azureml
|  └──config.json
└──01-create-workspace.py
```

The file `.azureml/config.json` contains the metadata necessary to connect to your AzureML
workspace - namely your subscription id, resource group and workspace name. We'll make use
of this as we progress through the article with the following:

```python
ws = Workspace.from_config()
```

> [!NOTE]
> The contents of `config.json` are not secrets - it is perfectly fine to share these details.
> Authentication is still required to interact with your AzureML workspace.

## Create an AzureML compute cluster

Create a python script in the `article` top-level directory called `02-create-compute.py` and populate with the following code to create an AzureML compute cluster that will auto-scale between zero and four nodes:

```python
# article/02-create-compute.py
from azureml.core import Workspace
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException

ws = Workspace.from_config()

# Choose a name for your CPU cluster
cpu_cluster_name = "cpu-cluster"

# Verify that cluster does not exist already
try:
    cpu_cluster = ComputeTarget(workspace=ws, name=cpu_cluster_name)
    print('Found existing cluster, use it.')
except ComputeTargetException:
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2',
                                                            max_nodes=4, 
                                                            idle_seconds_before_scaledown=2400)
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)

cpu_cluster.wait_for_completion(show_output=True)
```

> [!NOTE]
> When the cluster has been created it will have 0 nodes provisioned as no jobs have been submitted. Whilst there are 0 nodes provisioned you **do not** incur costs. This cluster will scale down when it has been idle for 2400 seconds (40 minutes). If there have been no jobs running on the cluster for 40 minutes it will automatically scale down to 0, and will not incur costs. 

Your folder structure will now look as follows:

```bash
article
└──.azureml
|  └──config.json
└──01-create-workspace.py
└──02-create-compute.py
```


## Next steps

In this setup tutorial you have:

1. Created an Azure ML workspace
1. Set up your local development environment
1. Created an AzureML compute cluster.

In the next article, you walk through submitting an ML script to the AzureML compute cluster.

> [!div class="nextstepaction"]
> [Tutorial: Hello Azure](tutorial-1st-experiment-hello-azure.md)
