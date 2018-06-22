---
title: Installation Quickstart with Azure Machine Learning Python SDK | Microsoft Docs
description: In this Quickstart, you can learn how to install and get started with Azure Machine Learning using the Azure Machine Learning SDK for Python.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: quickstart

author: rastala
ms.author: roastala
ms.reviewer: sdgilley
ms.date: 7/27/2018
---

# Quickstart: Create a workspace and project with Azure Machine Learning's Python SDK

In this quickstart, you'll use a Python SDK to get started with [Azure Machine Learning Services](overview-what-is-azure-ml.md). 

Using any Python environment, including Jupyter Notebooks or your favorite Python IDE, you'll learn how to:
1. Create a workspace, which is the top-level resource for this service.
2. Attach a project containing your machine learning scripts.
3. Run a script @@TO DO WHAT and view the output. 

## Prerequisites

Make sure you have the following prerequisites before starting the quickstart steps:

+ An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
+ Adequate permissions to create Azure assets such as resource groups
+ [Python 3.5 or higher](https://www.python.org/) installed
+ [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) installed
+ A package manager installed, such as [Continuum Anaconda](https://anaconda.org/anaconda/continuum-docs) or [Miniconda](https://conda.io/miniconda.html)

## Install the SDK

Install the Azure Machine Learning SDK for Python. You'll use this SDK to create your workspace and run code. You can [do a lot more with this SDK](reference-azure-machine-learning-sdk.md). 

1. In a command-line window, create and activate the conda package manager environment with numpy and cython. This example uses Python 3.6.

   On Windows:
   ```sh 
   conda create -n myenv Python=3.6 cython numpy
   activate myenv
   ```

   On Linux or MacOS:
   ```sh 
   conda create -n myenv Python=3.6 cython numpy
   source activate myenv
   ```

1. Install the SDK
   ```sh 
   pip install azureml-sdk
   ```

## Create a resource group

A resource group is a container that holds related resources for an Azure solution. Using Azure CLI, sign into Azure, specify the subscription, and create a resource group.

1. In a command-line window, sign in with the Azure CLI command, [`az login`](https://docs.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login). Follow the prompts for interactive sign in:
    
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

1. Create a resource group to hold your workspace. <br>
   In this quickstart:
   + The name of the resource group is `myrg`.
   + The region is `eastus2`. You can use any [available region](https://azure.microsoft.com/global-infrastructure/services/) close to your data. 

   ```azurecli
   az group create --name myrg --location eastus2
   ```

## Create a workspace and attach a project

1. In a command-line window, create a folder on your local machine for your Azure Machine Learning project. 
   ```
   mkdir myproject
   cd myproject
   ```

1. In a Python editor, create your workspace under the resource group and attach the project to the new workspace.
   
   An **Azure Machine Learning Workspace** is the top-level resource that can be used by one or more users to store their compute resources, models, deployments, and run histories. The run history file stores each run in your project so you can monitor your model during training.  For your convenience, the following resources are added automatically to your workspace when regionally available: [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/), [Azure storage](https://azure.microsoft.com/en-us/services/storage/), [Azure Application Insights](https://azure.microsoft.com/en-us/services/application-insights/), and [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/).

   A **project** is a local folder that contains the scripts needed to solve your machine learning problem and the configuration files  required to attach the project to your workspace in Azure Cloud.

   In this quickstart:
   + The workspace name is `myws`.
   + The run history file is `myhistory`. 

   ```python
   from azureml.core import Workspace, Project
   
   # Create workspace named myws in your resource group
   ws = Workspace.create(name="myws", subscription_id="<your-subscription-id>", resource_group="myrg")
   
   # Attach current directory as a project in workspace `myws` and specify 
   # and specify name of run history file for this project, `myhistory`
   helloproj = Project.attach(workspace_object=ws, run_history_name="myhistory")
   ```
   
   Which returns:
   ```
   {'Run history name': 'tf-mnist',
    'Subscription id': 'fac34303-435d-4486-8c3f-7094d82a0b60',
    'Resource group': 'aml-notebooks',
    'Workspace name': 'haieuapws',
    'Project path': '/Users/bsmith/git/my-stuff/mnist-project'}
   ```

   Replace \<your-subscription-id\> with the ID value for the subscription you used to create the resource group and use the same resource group name as before, `myrg`. Do not include the brackets.

## Run scripts and view output

1. Start tracking metrics with this Python code. These metrics are stored in the run history file.

   ```python
   #Specify the project
   #helloproj = Project()

   # Log metric values
   run.log("A single value",1.23)
   run.log_list("A list of values",[1,2,3,4,5])
 
   # Save an output artifact, such as model or data file  
   with open("myOutputFile.txt","w") as f:
   f.write("My results")
   run.upload_file(name="results",path_or_stream="myOutputFile.txt")
 
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
You have now created the necessary resources to start experimenting and deploying models. You also created a project, ran a script, and explored the run history of the script.

For an in-depth workflow experience, follow the Azure Machine Learning tutorial on building, training, and deploying a model.

> [!div class="nextstepaction"]
> [Tutorial: Build, train, and deploy](tutorial-build-train-deploy-with-azure-machine-learning.md)