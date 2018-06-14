---
title: Tutorial - Build, train, deploy models in Azure Machine Learning | Microsoft Docs
description: In this tutorial, you can learn how build, train, and deploy a model with Azure Machine Learning in Python.
services: machine-learning
author: haining
ms.author: haining
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc
ms.topic: quickstart
ms.date: 7/27/2018
---

# Quickstart: Create a project and get started with Azure Machine Learning Python SDK

You can use Azure Machine Learning Python SD

This quickstart shows you how to:

* Install the Azure Machine Learning Python SDK
* Create Workspace and Project
* Train a basic machine learning model 

As part of the Microsoft Azure portfolio, Azure Machine Learning services require an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Additionally, you must have adequate permissions to create assets such as Resource Groups, Virtual Machines, and so on.

<a name="prerequisites"></a>You can install the SDK on a Windows, Linux or MacOS computer with following prerequisites installed:

* Python 3.5 or higher
* Azure CLI 2.0
* Continuum Anaconda or Miniconda package manager (recommended)

## Install SDK

Open command line editor, and install the azureml-sdk Python package

```
pip install azureml-sdk
```

## Create Workspace and attach Project

Azure ML Workspace is the top-level Azure resource that contains your run histories, compute resources, models, and deployments.

1. Log in to your Azure subscription.

From command line, run following command and follow the prompts for interactive login:

```azurecli
az login
```

Select the Azure subscription to use for creating the workspace

```azurecli
az account list
az account set --subscription <my subscription>
az account show
```

1. Create Azure resource group to hold your Workspace

Supported location choices are eastus2, others TBD

```azurecli
az group create --name myrg --location eastus2
```

1. Create folder for your Azure ML Project

In Azure Machine Learning, a project is a local folder. It contain the scripts you use to solve your machine learning problem, and configuration files that attach it to your workspace in Azure Cloud.

```
mkdir myproject
cd myproject
```

1. Create Workspace and Project under the resource group 

Open Python editor and run following commands:

```python
from azureml.core import Workspace, Project

# Create workspace
ws = Workspace.create(name="myws", subscription_id=<my_subscription>, resource_group="myrg")

# Attach current folder as project
proj = Project.attach(workspace_object="ws", run_history_name="myhistory")

```

The *run_history_name* argument specifies the name of run history used to group together and track your runs.

>[!NOTE]
>In addition to Azure ML Workspace, the *Workspace.create* command creates storage account, Azure Container Registry, Azure Key Vault and AppInsights resources under your resource group.

## Run a Python code

1. Track metrics from Python code

Run following commands in Python editor to track few metrics.

```python
run = Run.start_logging(workspace = ws, run_history_name = "myhistory")
run.log(TBD)
run.log(TBD)
run.complete()
```

1. View run history from web portal.

Use following command to get a link to web portal to view your run history.

```python
import helpers
print(helpers.get_run_history_url(run))
```

SCREENSHOT TBD

## Next steps

You have now created the necessary Azure Machine Learning resources to start experimenting and deploying models.

For a more in-depth experience of this workflow, follow the full-length *TBD* tutorial.
