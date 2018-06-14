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

# Quickstart: Get started with the Azure Machine Learning CLI extension

In this quickstart, you will learn how to get started with Azure Machine Learning Services using the Azure Machine Learning CLI extension. You’ll create an Azure Machine Learning Workspace and a project in that workspace directly from the CLI.

A workspace is the top-level resource that contains your run histories, compute resources, models, and deployments.

A project is a local folder. It contains the scripts you use to solve your machine learning problem, plus the configuration files to attach it to your workspace in Azure Cloud.

This quickstart shows you how to:

* Install the CLI
* Create a workspace and project with the CLI
* Run a small Python script in the project and view the output

## Prerequisites

As part of the Microsoft Azure portfolio, Azure Machine Learning services require an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Additionally, you must have adequate permissions to create assets such as Resource Groups, Virtual Machines, and so on.

You can install the Azure ML CLI on a Windows, Linux, or MacOS computer with following prerequisites installed:

* [Python](https://www.python.org/) 3.5 or higher
* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)

## Install the CLI

>[!NOTE]
>The installation can take several minutes to complete.

On your computer, open a command-line editor and install the Azure ML CLI extension

```azurecli
az extension add <EXACT COMMAND TBD>
```

## Create a resource group

1. Sign in to your Azure subscription.

    From the command-line, run the following and follow the prompts for interactive login:

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


## Create a workspace

1. Create a workspace under the resource group.

    ```
    az ml workspace create --name myws --group myrg
    ```

    >[!NOTE]
    >In addition to Azure ML Workspace, this command creates storage account, Azure Container Registry, Azure Key Vault and AppInsights resources under your resource group.

## Attach a project

1. Create a folder for your project.

    ```
    mkdir myproject
    cd myproject
    ```

2. Attach the folder as a project. The `history` argument specifies a name for the run history used to group together and track your runs.

    ```azurecli
    az ml project attach --history myhistory -w myws
    ```

## Run a Python script

1. Copy the script to your project folder.

    Copy [hello.py]() to your project folder.

2. Run the script on your local computer.

    ```azurecli
    az ml run submit -c local hello.py
    ```

3. View the results of your run.

    The run outputs a web link to your console. Copy-paste the link into your web browser. This opens a web portal view that shows the results of your run.

## Clean up resources 
[!INCLUDE aml-delete-resource-group]

## Next steps

You have created the necessary resources to start experimenting and deploying models.

Now use these resources as you follow the [full-length tutorial]().