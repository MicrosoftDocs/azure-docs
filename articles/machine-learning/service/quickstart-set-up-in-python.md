---
title: Installation Quickstart with Azure Machine Learning Python SDK | Microsoft Docs
description: In this Quickstart, you can learn how to install and get started with Azure Machine Learning using the Azure Machine Learning SDK for Python.
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

# Quickstart: Get started with Azure Machine Learning SDK for Python

In this quickstart, you will learn how to get started with Azure Machine Learning Services using Python. You’ll create an Azure Machine Learning Workspace and a project in that workspace directly from your preferred Python IDE. 

A workspace is the top-level resource that contains your run histories, compute resources, models, and deployments.

A project is a local folder. It contains the scripts you use to solve your machine learning problem, plus the configuration files to attach it to your workspace in Azure Cloud.

This quickstart shows you how to:

* Install the SDK for Python
* Create a workspace and a project with the SDK
* Run Python code in the project and view the output

## Prerequisites

As part of the Microsoft Azure portfolio, Azure Machine Learning services require an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Additionally, you must have adequate permissions to create assets such as Resource Groups, Virtual Machines, and so on.

You can install the SDK on a Windows, Linux, or MacOS computer with following prerequisites installed:

* [Python](https://www.python.org/) 3.5 or higher
* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
* [Continuum Anaconda]() or [Miniconda](https://conda.io/miniconda.html) package manager (recommended)

## Install the SDK

Open your command-line editor, and install the azureml-sdk Python package

```
pip install azureml-sdk
```

## Create a resource group

1. Sign in to your Azure subscription.

    From a command line, run the following command and follow the prompts for interactive login:
    
    ```azurecli
    az login
    ```

1. Check which Azure subscriptions are available to you, and set an active one.
 
    Select the SubscriptionId value from the output of the `az account list` command.
    
    ```azurecli
    az account list --output table
    az account set --subscription <SubscriptionId>
    az account show
    ```

 1. Create a resource group to hold your workspace.

     * The only supported location choice is eastus2.  
     * In this example, the resource group is named *myrg*.
    
    ```azurecli
    az group create --name myrg --location eastus2
    ```

## Create a workspace and attach a project

1. Create a folder for your Azure ML Project.

   ```
   mkdir myproject
   cd myproject
   ```

1. Create your workspace and project under the resource group.

   Open a Python editor and run the following commands. Use the SubscriptionId you selected when you created your resource group earlier.

   ```python
   from azureml.core import Workspace, Project

   # Create workspace
   ws = Workspace.create(name="myws", subscription_id="<SubscriptionId>", resource_group="myrg")

   # Attach current folder as project
   proj = Project.attach(workspace_object=ws, run_history_name="myhistory")
   ```

   The `run_history_name` argument specifies the name of the run history used to group together and track your runs.

   >[!NOTE]
   >In addition to a workspace, the `Workspace.create` command creates storage account, Azure Container Registry, Azure Key Vault, and AppInsights resources under your resource group.

## Run Python code

1. Track metrics with this Python code.

   Run the following commands in a Python editor to track a few metrics.

   ```python
   run = Run.start_logging(workspace = ws, run_history_name = "myhistory")
   run.log(SCALAR METRIC TBD)
   run.log(VECTOR METRIC TBD)
   run.upload_file(TBD)
   run.complete()
   ```

2. View the run history from the web portal.

   Use following command to get a link to web portal to view your run history.

   ```python
   import helpers
   print(helpers.get_run_history_url(run))
   ```

SCREENSHOT TBD

## Clean up resources 
[!INCLUDE aml-delete-resource-group]

## Next steps

You have created the necessary resources to start experimenting and deploying models.

Now use these resources as you follow the [full-length tutorial]().
