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

The Azure Machine Learning Command Line Interface (CLI) extension is for data scientists and developers working with Azure Machine Learning service. It allows you to quickly automate machine learning workflows and put them into production, such as:
+ Run experiments to create machine learning models

+ Register machine learning models for customer usage

+ Package, deploy and track the lifecycle of your machine learning models

This machine learning CLI is an extension of [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) and was built on top of the Python-based <a href="http://aka.ms/aml-sdk" target="_blank">SDK</a> for Azure Machine Learning service.

## Common machine learning CLI commands

Use the rich set of `az ml` commands to interact the service in any command-line environment, including Azure portal cloud shell.

Here is a sample of common commands:

### Workspace Creation & Compute Provisioning

+ Create an Azure Machine Learning Workspace, the top level resource for machine learning.
  ```AzureCLI
  az ml workspace create -n myworkspace -g myresourcegroup
  ```
    
+ Create a DSVM (data science VM) for training models
  ```AzureCLI
  az ml computetarget setup dsvm -n mydsvm -w my_workspacepup
  ```

### Experiment Submission
+ Attach to a project (run configuration) for submitting an experiment.
  ```AzureCLI
  az ml project attach --history myhistory
  ```

+ Submit an experiment against the Azure Machine Learning service on the compute target of your choice (this example uses a Data Science VM)
  ```AzureCLI
  az ml run submit -c mydsvm code/02_modeling/train.py
  ```

### Model registration, image ceation & deployment

+ Register a model with Azure Machine Learning.
  ```AzureCLI
  az ml model register -n mymodel -m mymodel.pkl
  ```

+ Create an image to contain your machine learning model and dependencies. 
  ```AzureCLI
  az ml image create -n myimage -r python -m rfmodel.pkl -f score.py -c myenv.yml
  ```

+ Deploy your packaged model to targets including ACI and AKS.
  ```AzureCLI
  az ml service create aci -n myaciservice -i myimage:1
  ```
    
## Full command list
You can find the full list of commands for the CLI extension (and their supported parameters) by running ```az ml COMMANDNAME -h```. 
