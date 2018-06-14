---
title: Installation Quickstart for Azure Machine Learning CLI | Microsoft Docs
description: In this Quickstart, you can learn how to install and get started with Azure Machine Learning using CLI.
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

# Quickstart: Install and get started with Azure Machine Learning CLI Extension

You can use Azure Machine Learning Python CLI Extension (Azure ML CLI)

This quickstart shows you how to:

* Install the Azure ML CLI
* Create Azure ML Workspace and Project
* Train a basic machine learning model

As part of the Microsoft Azure portfolio, Azure Machine Learning services require an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Additionally, you must have adequate permissions to create assets such as Resource Groups, Virtual Machines, and so on. 

<a name="prerequisites"></a>You can install the Azure ML CLI on a Windows, Linux or MacOS computer with following prerequisites installed:

* Python 3.5 or higher
* Azure CLI 2.0

## Install Azure ML CLI

>[!NOTE]
>The installation can take several minutes to complete.

On your computer, open command line editor and install the Azure ML CLI extension

```azurecli
az extension add <EXACT COMMAND TBD>
```

## Create Azure ML Workspace

Azure ML Workspace is the top-level Azure resource that contains your run histories, compute resources, models, and deployments.

1. Log in to your Azure subscription.

    From command line, run following command and follow the prompts for interactive login:
    
    ```azurecli
    az login
    ```
    
    Select the Azure subscription to use for creating the workspace:
    
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

1. Create Workspace under the resource group 

    ```
    az ml workspace create --name myws --group myrg
    ```

    >[!NOTE]
    >In addition to Azure ML Workspace, this command creates storage account, Azure Container Registry, Azure Key Vault and AppInsights resources under your resource group.

## Attach Project

In Azure Machine Learning, a project is a local folder. It contain the scripts you use to solve your machine learning problem, and configuration files that attach it to your workspace in Azure Cloud.

1. Create a folder for your project

    ```
    mkdir myproject
    cd myproject
    ```

1. Attach the folder as a Azure ML project. The *history* argument specifies the name of run history used to group together and track your runs.

    ```azurecli
    az ml project attach --history myhistory -w myws
    ```

## Run a Python script

1. Copy script to your project folder.

    Copy hello.py (Location and content TBD) script to your project folder.

1. Run hello.py script on your local computer.

    ```azurecli
    az ml run submit -c local hello.py
    ```

1. View results of your run.

    The run should output a web link to your console. Copy-paste this link to your web browser and open it. This opens a web portal view that shows the results of your run.

## Next steps

You have now created the necessary Azure Machine Learning resources to start experimenting and deploying models.

For a more in-depth experience of this workflow, follow the full-length *TBD* tutorial.
