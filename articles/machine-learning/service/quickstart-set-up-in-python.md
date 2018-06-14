---
title: Installation Quickstart for Azure Machine Learning Python SDK | Microsoft Docs
description: In this Quickstart, you can learn how to install and get started with Azure Machine Learning using the Python SDK.
services: machine-learning
author: rastala
ms.author: roastala
manager: haining
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

## Log in to your Azure Subscription and create resource group

1. Log in to your Azure subscription.

   From command line, run following command and follow the prompts for interactive login:

   ```azurecli
   az login
   ```

 2. Check which Azure subscriptions are available to you, and set an active one. 
 
    Select the SubscriptionId value from the output of *az account list* command.

    ```azurecli
    az account list --output table
    az account set --subscription <SubscriptionId>
    az account show
    ```

   3. Create Azure resource group to hold your Workspace

      Supported location choices are eastus2, others TBD

      ```azurecli
      az group create --name myrg --location eastus2
      ```

## Create Workspace and attach Project

Azure ML Workspace is the top-level Azure resource that contains your run histories, compute resources, models, and deployments.

A project is a local folder. It contain the scripts you use to solve your machine learning problem, and configuration files that attach it to your workspace in Azure Cloud.

1. Create folder for your Azure ML Project

   ```
   mkdir myproject
   cd myproject
   ```

2. Create Workspace and Project under the resource group 

   Open Python editor and run following commands. Use the SubscriptionId you selected when creating resource group earlier.

   ```python
   from azureml.core import Workspace, Project

   # Create workspace
   ws = Workspace.create(name="myws", subscription_id=<SubscriptionId>, resource_group="myrg")

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
   run.log(SCALAR METRIC TBD)
   run.log(VECTOR METRIC TBD)
   run.upload_file(TBD)
   run.complete()
   ```

2. View run history from web portal.

   Use following command to get a link to web portal to view your run history.

   ```python
   import helpers
   print(helpers.get_run_history_url(run))
   ```

SCREENSHOT TBD

## Next steps

You have now created the necessary Azure Machine Learning resources to start experimenting and deploying models.

For a more in-depth experience of this workflow, follow the full-length *TBD* tutorial.
