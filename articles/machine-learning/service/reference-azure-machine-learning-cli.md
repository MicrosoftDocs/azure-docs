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

[!INCLUDE [aml-preview-note](../../../includes/aml-preview-note.md)]

# CLI commands 

Use the rich set of `az ml` commands to interact the service in any command-line environment, including Azure portal cloud shell.  

## Workspace interaction

```az ml workspace create -n myws -g myrg```

## Experiment interaction

```az ml experiment submit```
Enables you to submit an experiment against Azure ML experimentation services, across a variety of supported compute targets.

## Operationalization interaction

### Model Registration
```az ml model register```
Register a model produced locally or in an AML training run for operationalization.

### Image Creation
```az ml image create```
Create an image for your ML model.
Currently the CLI only supports creating WebApiContainer images.

### Service Creation
```az ml service create```
Creates a service from your ML model.
Supported targets include ACI and AKS.
