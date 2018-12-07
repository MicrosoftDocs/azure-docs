---
title: Using the machine learning CLI extension
titleSuffix: Azure Machine Learning service
description: Learn about the Azure Machine Learning CLI extension for the Azure CLI. The Azure CLI is a cross-platform command-line utility that enables you to work with resources in the Azure cloud. The Machine Learning extension enables you to work with the Azure Machine Learning Service. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual

ms.reviewer: jmartens
ms.author: jordane
author: jpe316
ms.date: 12/04/2018
ms.custom: seodec18
---

# Use the CLI extension for Azure Machine Learning service

The Azure Machine Learning CLI is an extension to the [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest), a cross-platform command-line interface for the Azure platform. This extension provides commands for working with the Azure Machine Learning service from the command line. It allows you to create scripts that automate your machine learning workflows. For example, you can create scripts that perform the following actions:

+ Run experiments to create machine learning models

+ Register machine learning models for customer usage

+ Package, deploy, and track the lifecycle of your machine learning models

The CLI is not a replacement for the Azure Machine Learning SDK. It is a complementary tool that is optimized to handle highly parameterized tasks such as:

* Creating compute resources

* Parameterized experiment submission

* Model registration

* Image creation

* Service deployment

## Prerequisites

* The [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest).

> [!NOTE]
> To use the CLI, you must have an Azure subscription. If you don’t have an Azure subscription, create a [free account](https://aka.ms/AMLfree) before you begin.

## Install the extension

To install the Machine Learning CLI extension, use the following command:

```azurecli-interactive
az extension add -s https://azuremlsdktestpypi.blob.core.windows.net/wheels/sdk-release/Preview/E7501C02541B433786111FE8E140CAA1/azure_cli_ml-1.0.2-py2.py3-none-any.whl --pip-extra-index-urls  https://azuremlsdktestpypi.azureedge.net/sdk-release/Preview/E7501C02541B433786111FE8E140CAA1
```

When prompted, select `y` to install the extension.

To verify that the extension has been installed, use the following command to display a list of ML-specific subcommands:

```azurecli-interactive
az ml -h
```

> [!TIP]
> To update the extension you must __remove__ it, and then __install__ it. This installs the latest version.

## Remove the extension

To remove the CLI extension, use the following command:

```azurecli-interactive
az extension remove -n azure-cli-ml
```

## Resource management

The following commands demonstrate how to use the CLI to manage resources used by Azure Machine Learning.


+ Create an Azure Machine Learning service workspace:

    ```azurecli-interactive
    az ml workspace create -n myworkspace -g myresourcegroup
    ```

+ Set a default workspace:

    ```azurecli-interactive
    az configure --defaults aml_workspace=myworkspace group=myresourcegroup
    ```

+ Create a managed compute target for distributed training:

    ```azurecli-interactive
    az ml computetarget create amlcompute -n mycompute --max_nodes 4 --size Standard_NC6
    ```

* Update a managed compute target:

    ```azurecli-interactive
    az ml computetarget update --name mycompute --workspace –-group --max_nodes 4 --min_nodes 2 --idle_time 300
    ```

* Attach an unmanaged compute target for training or deployment:

    ```azurecli-interactive
    az ml computetarget attach aks -n myaks -i myaksresourceid -g myrg -w myworkspace
    ```

## Experiments

The following commands demonstrate how to use the CLI to work with experiments:

* Attach a project (run configuration) before submitting an experiment:

    ```azurecli-interactive
    az ml project attach --experiment-name myhistory
    ```

* Start a run of your experiment. When using this command, specify a compute target. In this example, `local` uses the local computer to train the model using the `train.py` script:

    ```azurecli-interactive
    az ml run submit -c local train.py
    ```

* View a list of submitted experiments:

    ```azurecli-interactive
    az ml history list
    ```

## Model registration, image creation & deployment

The following commands demonstrate how to register a trained model, and then deploy it as a production service:

+ Register a model with Azure Machine Learning:

  ```azurecli-interactive
  az ml model register -n mymodel -m sklearn_regression_model.pkl
  ```

+ Create an image that contains your machine learning model and dependencies: 

  ```azurecli-interactive
  az ml image create container -n myimage -r python -m mymodel:1 -f score.py -c myenv.yml
  ```

+ Deploy an image to a compute target:

  ```azurecli-interactive
  az ml service create aci -n myaciservice --image-id myimage:1
  ```
