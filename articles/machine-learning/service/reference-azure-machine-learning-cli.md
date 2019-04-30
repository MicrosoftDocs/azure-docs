---
title: Machine learning CLI extension
titleSuffix: Azure Machine Learning service
description: Learn about the Azure Machine Learning CLI extension for the Azure CLI. The Azure CLI is a cross-platform command-line utility that enables you to work with resources in the Azure cloud. The Machine Learning extension enables you to work with the Azure Machine Learning Service. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.reviewer: jmartens
ms.author: jordane
author: jpe316
ms.date: 04/30/2019
ms.custom: seodec18
---

# Use the CLI extension for Azure Machine Learning service

The Azure Machine Learning CLI is an extension to the [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest), a cross-platform command-line interface for the Azure platform. This extension provides commands for working with the Azure Machine Learning service. It allows you to automate your machine learning activities. The following list provides some example actions that you can do with the CLI extension:

+ Run experiments to create machine learning models

+ Register machine learning models for customer usage

+ Package, deploy, and track the lifecycle of your machine learning models

The CLI is not a replacement for the Azure Machine Learning SDK. It is a complementary tool that is optimized to handle highly parameterized tasks which suit themselves well to automation.

## Prerequisites

* To use the CLI, you must have an Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

* The [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest).

## Install the extension

To install the Machine Learning CLI extension, use the following command:

```azurecli-interactive
az extension add -n azure-cli-ml
```

> [!TIP]
> Example files you can use with the commands below can be found [here](http://aka.ms/azml-deploy-cloud).

When prompted, select `y` to install the extension.

To verify that the extension has been installed, use the following command to display a list of ML-specific subcommands:

```azurecli-interactive
az ml -h
```

## Remove the extension

To remove the CLI extension, use the following command:

```azurecli-interactive
az extension remove -n azure-cli-ml
```

## Resource management

The following commands demonstrate how to use the CLI to manage resources used by Azure Machine Learning.

+ If you do not already have one, create a resource group:

    ```azurecli-interactive
    az group create -n myresourcegroup -l westus2
    ```

+ Create an Azure Machine Learning service workspace:

    ```azurecli-interactive
    az ml workspace create -w myworkspace -g myresourcegroup
    ```

    For more information, see [az ml workspace create](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/workspace?view=azure-cli-latest#ext-azure-cli-ml-az-ml-workspace-create).

+ Attach a workspace configuration to a folder to enable CLI contextual awareness.

    ```azurecli-interactive
    az ml folder attach -w myworkspace -g myresourcegroup
    ```

    For more information, see [az ml folder attach](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/folder?view=azure-cli-latest#ext-azure-cli-ml-az-ml-folder-attach).

+ Attach an Azure blob container as a Datastore.

    ```azurecli-interactive
    az ml datastore attach-blob  -n datastorename -a accountname -c containername
    ```

    For more information, see [az ml datastore attach-blob](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/datastore?view=azure-cli-latest#ext-azure-cli-ml-az-ml-datastore-attach-blob).

+ Attach an AKS cluster as a Compute Target.

    ```azurecli-interactive
    az ml computetarget attach aks -n myaks -i myaksresourceid -g myrg -w myworkspace
    ```

    For more information, see [az ml computetarget attach aks](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/attach?view=azure-cli-latest#ext-azure-cli-ml-az-ml-computetarget-attach-aks)

+ Create a new AMLcompute target

    ```azurecli-interactive
    az ml computetarget create amlcompute -n cpu --min-nodes 1 --max-nodes 1 -s STANDARD_D3_V2
    ```

    For more information, see [az ml computetarget create amlcompute](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/create?view=azure-cli-latest#ext-azure-cli-ml-az-ml-computetarget-create-amlcompute)
    
## <a id="experiments"></a>Run experiments

+ Attach a workspace configuration to a folder to enable CLI contextual awareness.

    ```azurecli-interactive
    az ml folder attach -w myworkspace -g myresourcegroup
    ```

    For more information, see [az ml folder attach](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/folder?view=azure-cli-latest#ext-azure-cli-ml-az-ml-folder-attach).

* Start a run of your experiment. When using this command, specify the name of the runconfig file (the text before \*.runconfig if you are looking at your file system) against the -c parameter.

    ```azurecli-interactive
    az ml run submit-script -c local -e testexperiment train.py
    ```

    For more information, see [az ml run submit-script](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/run?view=azure-cli-latest#ext-azure-cli-ml-az-ml-run-submit-script).

* View a list of experiments:

    ```azurecli-interactive
    az ml experiment list
    ```

    For more information, see [az ml experiment list](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/experiment?view=azure-cli-latest#ext-azure-cli-ml-az-ml-experiment-list).

## Model registration, profiling, deployment

The following commands demonstrate how to register a trained model, and then deploy it as a production service:

+ Register a model with Azure Machine Learning:

    ```azurecli-interactive
    az ml model register -n mymodel -p sklearn_regression_model.pkl
    ```

    For more information, see [az ml model register](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/model?view=azure-cli-latest#ext-azure-cli-ml-az-ml-model-register).

+ Deploy your model to AKS

    ```azurecli-interactive
    az ml model deploy -n myservice -m mymodel:1 --ic inferenceconfig.json --dc deploymentconfig.json
    ```

    For more information, see [az ml model deploy](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/model?view=azure-cli-latest#ext-azure-cli-ml-az-ml-model-deploy).


## Next steps

* [Command reference for the Machine Learning CLI extension](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml?view=azure-cli-latest).