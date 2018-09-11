---
title: About the Azure Machine Learning CLI extension
description: Learn about the machine learning CLI extension for Azure Machine Learning. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual

ms.author: jordane
author: jpe316
ms.reviewer: jmartens
ms.date: 09/24/2018
---
# What is the Azure Machine Learning CLI?

The Azure Machine Learning CLI extension enables data scientists and developers working with Azure Machine Learning service to quickly automate machine learning workflows and put them into production, such as:
+ Run experiments to create machine learning models
+ Register machine learning models for customer usage
+ Package, deploy and track the lifecycle of your machine learning models

This machine learning CLI is an extension of [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) and was built on top of the [Python-based SDK for Azure Machine Learning service](reference-azure-machine-learning-sdk.md).

## Common machine learning CLI commands

Use the rich set of `az ml` commands to interact the service in any command-line environment, including Azure portal cloud shell.

Here is a sample of common commands:

+ Create an Azure Machine Learning Workspace, the top level resource for machine learning.

    ```azurecli
    ## Create a workspace
    az ml workspace create -n myworkspace -g myresourcegroup
    ```

+ Submit an experiment against the Azure Machine Learning service on the compute target of your choice.

    ```azurecli
    ## Run your experiment
    az ml experiment submit
    ```

+ Prepare for deployment by registering a model produced locally or in a training run. Create an image to contain your machine learning model and dependencies. Currently the CLI only supports creating WebApiContainer images. Supported deployment targets include ACI and AKS.

    ```azurecli
    ## Prepare to deploy your model as a web service
    
    ## - Register a model 
    az ml model register
    
    ## - Create an image 
    az ml image create
    
    ## - Deploy the model as a web service
    az ml service create
    ```

## Next steps

For the full set of CLI commands, look through [the CLI reference documentation]().	
