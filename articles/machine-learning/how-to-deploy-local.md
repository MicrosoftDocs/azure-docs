---
title: How to run and deploy locally 
titleSuffix: Azure Machine Learning
description: 'Learn how to run trained models on your local machine.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: laobri
author: lobrien
ms.date: 11/17/2020
ms.topic: conceptual
ms.custom: how-to, deploy
---

# Deploy models trained with Azure Machine Learning on your local machine

This article teaches you how to use your local computer as a target for training or deploying models originating on Azure Machine Learning. Azure Machine Learning's flexibility allows it to work with most Python machine learning frameworks. Machine learning solutions generally have complex dependencies that can be difficult to duplicate. This article will show you how to trade off total control versus ease of use.

Some scenarios for local deploy include:

* Quickly iterating data, scripts, and models early in a project
* Debugging and troubleshooting in later stages
* Final deployment on user-managed hardware

## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md)
- A model. If you don't have a trained model, you can use the model and dependency files provided in [this tutorial](https://aka.ms/azml-deploy-cloud)
- The [Azure Machine Learning software development kit (SDK) for Python](/python/api/overview/azure/ml/intro?preserve-view=true&view=azure-ml-py)
- A conda manager such as Anaconda or miniconda, if you wish to mirror Azure Machine Learning's package dependencies
- Docker, if you wish to use a containerized version of the Azure Machine Learning environment

## Prepare your local machine

The most foolproof way to locally run an Azure Machine Learning model is with a Docker image. A Docker image provides an isolated, containerized experience that duplicates, except for hardware issues, the Azure execution environment. For more information on installing and configuring Docker for development scenarios, see [Overview of Docker remote development on Windows](../../../windows/dev-environment/docker/overview.md).

While it's possible to attach a debugger to a process running in Docker (see [Attach to a running container](https://code.visualstudio.com/docs/remote/attach-container)), you may prefer to debug and iterate your Python code without involving Docker. In this scenario, it's important that your local machine uses the same libraries that are used when you run your experiment in Azure Machine Learning. To manage Python dependencies, Azure uses [conda](https://docs.conda.io/). While you may recreate the environment using other package managers, installing and configuring conda on your local machine is the easiest way to synchronize. 

If, instead of running in Docker or a conda environment, you wish total control of your development environment, you will need to manage your Python versions, package dependencies, and machine learning libraries. Currently, the Azure Machine Learning Python SDK supports Python 3.6 and 3.7. Beyond that, there are too many variations and dependencies to document. 

## Prepare your entry script

Even if you use Docker to manage the model and dependencies, the Python scoring script must be local. The script must have two methods:

- An `init()` method that takes no arguments and returns nothing 
- A `run()` method that takes a JSON-formatted string and returns a JSON-serializable object.

The argument to the `run()` method will be of the form: 

```json
{
    "data": <model-specific-data-structure>
}
```

The object you return from the `run()` method must implement `toJSON() -> string`.

The following example demonstrates how to load a registered scikit-learn model and score it with numpy data. This example is based on the model and dependencies of [this tutorial](https://aka.ms/azml-deploy-cloud):

tk confirm this works with exact https://aka.ms/azml-deploy-cloud tk 
```python
import json
import numpy as np
import pickle
from sklearn.linear_model import Ridge
from azureml.core.model import Model

def init():
    global model
    model_path = Model.get_model_path('diabetes-model')

    with open(model_path, 'rb') as file:
        model = pickle.load(file)

def run(data):
    try:
        result = model.predict(data)
        # you can return any datatype as long as it is JSON-serializable
        return result.tolist()
    except Exception as e:
        error = str(e)
        return error
```

For more advanced examples, including automatic Swagger schema generation and binary (i.e. image) data, read [Advanced entry script authoring](how-to-deploy-advanced-entry-script.md). 
