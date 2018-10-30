---
title: About the Azure Machine Learning CLI extension
description: Learn about the machine learning CLI extension for Azure Machine Learning. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: reference

ms.reviewer: jmartens
ms.author: jordane
author: jpe316
ms.date: 09/24/2018
---

# What is the Azure Machine Learning CLI?

The Azure Machine Learning CLI is an extension to the [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest), a cross-platform command-line interface for the Azure platform. This extension provides commands for working with the Azure Machine Learning service from the command line. It allows you to create scripts that automate your machine learning workflows. For example, you can create scripts that perform the following actions:

+ Run experiments to create machine learning models

+ Register machine learning models for customer usage

+ Package, deploy and track the lifecycle of your machine learning models

The CLI is not a replacement for the Azure Machine Learning SDK. It is a complementary tool that is optimized to handle highly parameterized tasks such as:

* Creating compute resources

* Parameterized experiment submission

* Model registration

* Image creation

* Service deployment

## Prerequisites

* The [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest).

> [!NOTE]
> To use the CLI, you must have an Azure subscription. If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Installing and uninstalling

To install the Machine Learning CLI extension, use the following command:

```azurecli-interactive
az extension add TBD
```

When prompted, select `y` to install the extension.

To verify that the extension has been installed, use the following command to display a list of ML specific sub-commands:

```azurecli-interactive
az ml -h
```

To remove the CLI extension, use the following command:

```azurecli-interactive
az extension remove -n azure-cli-ml
```

You can update the CLI using the **remove** and **add** steps above.

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

+ Create a DSVM (data science VM). You can also create BatchAI clusters for distributed training or AKS clusters for deployment. TBD: change to managed compute and maybe add an example for aci showing how to attach an external.


  ```azurecli-interactive
  az ml computetarget setup dsvm -n mydsvm
  ```

## Experiments

TBD: commands for submitting/working with experiments

## Model registration, image ceation & deployment

TBD: Validate these re: aml compute vs. external

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
    

