---
title: Installation Quickstart with Azure Machine Learning CLI | Microsoft Docs
description: In this quickstart, you will learn how to get started with Azure Machine Learning Services using the Azure Machine Learning CLI extension.
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

# Quickstart: Create a workspace and project with Azure Machine Learning's CLI extension

Azure Machine Learning Services is an integrated, end-to-end data science and advanced analytics solution. It helps professional data scientists prepare data, develop experiments, and deploy models at cloud scale.

In this quickstart, you'll get started with Azure Machine Learning Services using the Azure Machine Learning CLI extension. You’ll learn how to:
+ Install the Azure Machine Learning extension to the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
+ Create an Azure Machine Learning Workspace
+ Create a project and attach it to the workspace
+ Run a small Python script in the project and view the output

The **Azure Machine Learning Workspace** is the top-level resource that can be used by one or more users to store their compute resources, models, deployments, and run histories. For your convenience, the following resources are added automatically to your workspace when regionally available: [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/), [Azure storage](https://docs.microsoft.com/en-us/azure/storage/), [Azure Application Insights, and [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/).

The **project**, which is a local folder, contains  the scripts that solve your machine learning problem as well as the configuration files to attach the project to your workspace in Azure Cloud.

This CLI was build on top of the [Python-based SDK for Azure Machine Learning services](reference-azure-machine-learning-sdk.md).

## Prerequisites

To create a workspace, you need an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Additionally, you must have adequate permissions to create Azure assets such as resource groups, virtual machines, and more.

Before you can install the CLI extension on Windows, Linux, or MacOS, install these prerequisites: 
+ [Python 3.5 or higher](https://www.python.org/)
+ [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)

## Install the CLI

On your computer, open a command-line editor and install the machine learning extension to Azure CLI.  The installation can take several minutes to complete.

```azurecli
az extension add <EXACT COMMAND TBD>
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

1. In the command-line window, create an Azure Machine Learning Workspace under the resource group. In this quickstart, the workspace name is `myws`.
   ```
   az ml workspace create --name myws --group myrg
   ```

2. In the command-line window, create a folder on your local machine for your Azure Machine Learning project. 
   ```
   mkdir myproject
   cd myproject
   ```

2. Attach the folder as a project to the workspace. The `history` argument specifies a name for the run history file that captures the metrics for each run.  

    ```azurecli
    az ml project attach --history myhistory -w myws
    ```

## Run a Python script

1. Copy the [hello.py]() script to your project folder on your machine.

1. Run the script on your local computer.

   ```azurecli
   az ml run submit -c local hello.py
   ```

   This command runs the code and outputs a web link to your console. Copy-paste the link into your web browser.

1. In a web browser, visit the URL. A web portal appears with the results of the run. You can inspect the results of that run or previous runs, if they exist.

## Clean up resources 

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps
You have now created the necessary resources to start experimenting and deploying models. You have also created a project, ran a script, and explored the run history of the script.

For a more in-depth experience of this workflow, follow the full-length tutorial that contains detailed steps for building, training, and deploying models with Azure Machine Learning Services. 

> [!div class="nextstepaction"]
> [Tutorial: Build, train, and deploy](tutorial-build-train-deploy-with-azure-machine-learning.md)