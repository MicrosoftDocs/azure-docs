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

Azure Machine Learning Services is an integrated, end-to-end data science and advanced analytics solution. It helps professional data scientists prepare data, develop experiments, and deploy models at cloud scale.

In this quickstart, you'll get started with Azure Machine Learning Services using your preferred Python IDE. You’ll learn how to:
+ Install the Azure Machine Learning SDK for Python
+ Create an Azure Machine Learning Workspace
+ Create a project and attach it to the workspace
+ Run Python code in the project and view the output

The **Azure Machine Learning Workspace** is the top-level resource that can be used by one or more users to store their compute resources, models, deployments, and run histories. For your convenience, the following resources are added automatically to your workspace when regionally available: [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/), [Azure storage](https://docs.microsoft.com/en-us/azure/storage/), [Azure Application Insights](https://docs.microsoft.com/en-us/azure/application-insights/) and [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/).

The **project**, which is a local folder, contains  the scripts that solve your machine learning problem as well as the configuration files to attach the project to your workspace in Azure Cloud.

## Prerequisites

To create a workspace, you need an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Additionally, you must have adequate permissions to create Azure assets such as resource groups, virtual machines, and more.

Before you can install the SDK on Windows, Linux, or MacOS, install these prerequisites: 
+ [Python 3.5 or higher](https://www.python.org/)
+ [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
+ A package manager such as [Continuum Anaconda](https://anaconda.org/anaconda/continuum-docs) or [Miniconda](https://conda.io/miniconda.html) 

## Install the SDK

Install the Azure Machine Learning SDK for Python you will use later to create your workspace, run code, train and deploy models.

1. In a command-line window, set your environment with numpy and cython. In this example, we install Python 3.6.
   ```
   conda create -n myenv Python=3.6 cython numpy
   ```

2. Activate the package manager environment.

   On Windows, use the following command: 
   ```
   activate myenv
   ```

   On MacOS, use the following command: 
   ```
   source activate myenv
   ```

1. Install the package.
    ```
    pip install azureml-sdk
    ```

## Create a resource group

A resource group is a container that holds related resources for an Azure solution. Using Azure CLI, sign into Azure, specify the subscription, and create a resource group.

1. In a command-line window, sign in with the Azure CLI command, [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az-login). Follow the prompts for interactive login:
    
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

1. Create a resource group to hold your workspace. In this quickstart, the name of the resource group is `myrg`.

   >[!Note]
   > The only supported location for resource groups is `eastus2`.  
    
    ```azurecli
    az group create --name myrg --location eastus2
    ```

## Create a workspace and attach a project

1. In a command-line window, create a folder on your local machine for your Azure Machine Learning project. 
   ```
   mkdir myproject
   cd myproject
   ```

1. In a Python editor, create your workspace and project under the resource group.

   In this quickstart, the workspace name is `myws` and the run history file is `myhistory`. The run history file stores each run in your project so you can monitor your model during training.

   ```python
   from azureml.core import Workspace, Project
   
   # Create workspace named myws in your resource group
   ws = Workspace.create(name="myws", subscription_id="<your-subscription-id>", resource_group="myrg")
   
   # Attach current directory as a project in workspace `myws` and specify 
   # and specify name of run history file for this project, `myhistory`
   proj = Project.attach(workspace_object=ws, run_history_name="myhistory")
   ```

   Replace \<your-subscription-id\> with the ID value for the subscription you used to create the resource group and use the same resource group name as before, `myrg`. Do not include the brackets.

## Run Python code

1. Start tracking metrics with this Python code. These metrics are stored in the run history file.

   ```python
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

For a more in-depth experience of this workflow, follow the full-length tutorial that contains detailed steps for building, training and deploying models with Azure Machine Learning Services. 

> [!div class="nextstepaction"]
> [Tutorial: Build, train, and deploy](tutorial-build-train-deploy-with-azure-machine-learning.md)