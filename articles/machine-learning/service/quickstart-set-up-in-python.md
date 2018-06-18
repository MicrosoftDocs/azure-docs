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

# Quickstart: Create a workspace and project with Azure Machine Learning's Python SDK

In this quickstart, you'll use a Python SDK to get started with Azure Machine Learning Services, an integrated, end-to-end data science and advanced analytics solution. Azure Machine Learning Services helps professional data scientists prepare data, develop experiments, and deploy models at cloud scale.

You'll get started using your preferred Python IDE and:
+ Install the Azure Machine Learning SDK for Python
+ Create an Azure Machine Learning Workspace, the top-level resource for this service
+ Attach a project that contains the scripts and configuration files
+ Run Python code from the project and view the output

## Prerequisites

Make sure you have the following prerequisites before starting the quickstart steps:

+ An Azure subscription to create a workspace. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

+ Adequate permissions to create Azure assets such as resource groups, virtual machines, and more.

+ [Python 3.5 or higher](https://www.python.org/) installed

+ [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) installed
    
+ A package manager installed, such as [Continuum Anaconda](https://anaconda.org/anaconda/continuum-docs) or [Miniconda](https://conda.io/miniconda.html)

## Install the SDK

Install the Azure Machine Learning SDK for Python. You'll use this SDK to create your workspace and run code. You can [do a lot more with this SDK](reference-azure-machine-learning-sdk.md). 

In a command-line window, create the conda environment and install the SDK. This example uses Python 3.6.

   ``` 
   #Set your conda environment with numpy and cython
   conda create -n myenv Python=3.6 cython numpy
   
   #Activate the package manager environment
   ## Windows:
   activate myenv

   ## Linux or MacOS: 
   ##source activate myenv

   #Install the SDK
   pip install azureml-sdk
   ```

## Create a resource group

A resource group is a container that holds related resources for an Azure solution. Using Azure CLI, sign into Azure, specify the subscription, and create a resource group.

1. In a command-line window, sign in with the Azure CLI command, [`az login`](https://docs.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login). Follow the prompts for interactive login:
    
    ```azurecli
    az login
    ```

1. List the available Azure subscriptions, and specify the one you want to use: 
   ```azurecli
   az account list --output table
   az account set --subscription <your-subscription-id>
   az account show
   ```
   where \<your-subscription-id\> is ID value for the subscription you want to use that was output by az account list. Do not include the brackets.

1. Create a resource group to hold your workspace. In this quickstart, the name of the resource group is `myrg` and the region is `eastus2`. You can use any [available region](https://azure.microsoft.com/global-infrastructure/services/) close to your data. 

   ```azurecli
   az group create --name myrg --location eastus2
   ```

## Create a workspace and attach a project

The **Azure Machine Learning Workspace** is the top-level resource that can be used by one or more users to store their compute resources, models, deployments, and run histories. For your convenience, the following resources are added automatically to your workspace when regionally available: [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/), [Azure storage](https://docs.microsoft.com/azure/storage/), [Azure Application Insights](https://docs.microsoft.com/en-us/azure/application-insights/), and [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/).

The **project** is a local folder that contains the scripts needed to solve your machine learning problem and the configuration files  required to attach the project to your workspace in Azure Cloud.


1. In a command-line window, create a folder on your local machine for your Azure Machine Learning project. 
   ```
   mkdir myproject
   cd myproject
   ```

1. In a Python editor, create your workspace under the resource group and attach the project to the new workspace.

   In this quickstart, the workspace name is `myws` and the run history file is `myhistory`. The run history file stores each run in your project so you can monitor your model during training.

   ```python
   from azureml.core import Workspace, Project
   
   # Create workspace named myws in your resource group
   ws = Workspace.create(name="myws", subscription_id="<your-subscription-id>", resource_group="myrg")
   
   # Attach current directory as a project in workspace `myws` and specify 
   # and specify name of run history file for this project, `myhistory`
   helloproj = Project.attach(workspace_object=ws, run_history_name="myhistory")
   ```

   Replace \<your-subscription-id\> with the ID value for the subscription you used to create the resource group and use the same resource group name as before, `myrg`. Do not include the brackets.

## Run Python code

1. Start tracking metrics with this Python code. These metrics are stored in the run history file.

   ```python
   #Specify the project
   #helloproj = Project()

   run = Run.start_logging(workspace = ws, run_history_name = "myhistory")
   run.log(SCALAR METRIC TBD)
   run.log(VECTOR METRIC TBD)
   run.upload_file(TBD)
   run.complete()
   ```

1. Get the URL to the run history for the code you just ran. This command outputs a web link to your console. Copy-paste the link into your web browser.

   ```python
   import helpers
   print(helpers.get_run_history_url(run))
   ```

1. In a web browser, visit the URL. A web portal appears with the results of the run. You can inspect the results of that run or previous runs, if they exist.

## Clean up resources 

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps
You have now created the necessary resources to start experimenting and deploying models. You have also created a project, ran a script, and explored the run history of the script.

For an in-depth workflow experience, follow the Azure Machine Learning tutorial which builds, trains and deploys a model. 

> training, and"nextstepaction"]
> [Tutorial: Build, train, and deploy](tutorial-build-train-deploy-with-azure-machine-learning.md)