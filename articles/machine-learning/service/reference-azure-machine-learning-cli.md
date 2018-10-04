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

The Azure Machine Learning Command Line Interface (CLI) extension is for data scientists and developers working with Azure Machine Learning service. It allows you to quickly automate machine learning workflows and put them into production, such as:
+ Run experiments to create machine learning models

+ Register machine learning models for customer usage

+ Package, deploy and track the lifecycle of your machine learning models

This machine learning CLI is an extension of [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) and was built on top of the Python-based <a href="http://aka.ms/aml-sdk" target="_blank">SDK</a> for Azure Machine Learning service.

> [!NOTE]
> The CLI is currently in early preview and will be updated.

## Installing and uninstalling

You can install the CLI using this command from our preview PyPi index:
```AzureCLI
az extension add -s https://azuremlsdktestpypi.blob.core.windows.net/wheels/sdk-release/Preview/E7501C02541B433786111FE8E140CAA1/azure_cli_ml-0.1.50-py2.py3-none-any.whl --pip-extra-index-urls  https://azuremlsdktestpypi.azureedge.net/sdk-release/Preview/E7501C02541B433786111FE8E140CAA1
```

You can remove the CLI using this command:
```AzureCLI
az extension remove -n azure-cli-ml
```

You can update the CLI using the **remove** and **add** steps above.

## Using the CLI vs. the SDK
The CLI is better suited to automation by a dev-ops persona, or as part of a continuous integration and delivery pipeline. It is optimized to handle infrequent and highly parameterized tasks. 

Examples include:
- compute provisioning
- parameterized experiment submission
- model registration, image creation
- service deployment

Data scientists are recommended to use the Azure ML SDK.

## Common machine learning CLI commands
> [!NOTE]
> Sample files you can use to successfully execute the below commands can be found [here.](https://github.com/Azure/MachineLearningNotebooks/tree/cli/cli)

Use the rich set of `az ml` commands to interact the service in any command-line environment, including Azure portal cloud shell.

Here is a sample of common commands:

### Workspace creation & compute setup

+ Create an Azure Machine Learning service workspace, the top level resource for machine learning.
   ```AzureCLI
   az ml workspace create -n myworkspace -g myresourcegroup
   ```

+ Set the CLI to use this workspace by default.
   ```AzureCLI
   az configure --defaults aml_workspace=myworkspace group=myresourcegroup
   ```

+ Create a DSVM (data science VM). You can also create BatchAI clusters for distributed training or AKS clusters for deployment.
  ```AzureCLI
  az ml computetarget setup dsvm -n mydsvm
  ```

### Experiment submission
+ Attach to a project (run configuration) for submitting an experiment. This is used to keep track of your experiment runs.
  ```AzureCLI
  az ml project attach --experiment-name myhistory
  ```

+ Submit an experiment against the Azure Machine Learning service on the compute target of your choice. This example will execute against your local compute environment. Make sure your conda environment file captures your python dependencies.

  ```AzureCLI
  az ml run submit -c local train.py
  ```

+ View a list of submitted experiments.
```AzureCLI
az ml history list
```

### Model registration, image ceation & deployment

+ Register a model with Azure Machine Learning.
  ```AzureCLI
  az ml model register -n mymodel -m sklearn_regression_model.pkl
  ```

+ Create an image to contain your machine learning model and dependencies. 
  ```AzureCLI
  az ml image create container -n myimage -r python -m mymodel:1 -f score.py -c myenv.yml
  ```

+ Deploy your packaged model to targets including ACI and AKS.
  ```AzureCLI
  az ml service create aci -n myaciservice --image-id myimage:1
  ```
    
## Full command list
You can find the full list of commands for the CLI extension (and their supported parameters) by running ```az ml COMMANDNAME -h```. 
