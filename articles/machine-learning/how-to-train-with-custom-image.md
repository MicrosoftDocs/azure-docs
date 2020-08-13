---
title: Train a model using a custom Docker base image
titleSuffix: Azure Machine Learning
description: Learn how to train models with custom Docker images in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: sagopal
author: saachigopal
ms.date: 08/11/2020
ms.topic: conceptual
ms.custom: how-to
---

# Train a model using a custom Docker image
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, learn how to use a custom Docker base image when training models with Azure Machine Learning. 

The example scripts in this article are used to classify pet images by creating a convolutional neural network. 

While Azure Machine Learning provides a default Docker base image, you can also use Azure Machine Learning environments to select a specific base image or use a [custom one](https://docs.microsoft.com/azure/machine-learning/how-to-deploy-custom-docker-image#create-a-custom-base-image) that you provide.
Custom base images allow you to closely manage your dependencies and maintain tighter control over component versions when executing training jobs. 

## Prerequisites 
* An Azure Machine Learning workgroup. For more information, see the [Create a workspace](how-to-manage-workspace.md) article.
* Create a [workspace configuration file](how-to-configure-environment.md#workspace).
* The [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py). 
* An [Azure Container Registry](/azure/container-registry) or other Docker registry that is accessible on the internet.

## Set up the experiment 
This section sets up the training experiment by initializing a workspace, creating an experiment, and uploading the training data and training scripts.

### Initialize a workspace
The [Azure Machine Learning workspace](concept-workspace.md) is the top-level resource for the service. It provides you with a centralized place to work with all the artifacts you create. In the Python SDK, you can access the workspace artifacts by creating a [`workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py) object.

Create a workspace object from the `config.json` file.

```Python
from azureml.core import Workspace

ws = Workspace.from_config()
```
### Prepare scripts
For this tutorial, the training script **train.py** is provided [here](). In practice, you can take any custom training script, as is, and run it with Azure Machine Learning.

### Define your environment
Create an environment object and enable Docker. 

```python
from azureml.core import Environment

myenv = Environment("fastai2")
myenv.docker.enabled = True
```

This specified base image supports the fastai library which allows for distributed deep learning capabilities. 
When you are using your custom Docker image, you might already have your Python environment properly set up. In that case, set the `user_managed_dependencies` flag to True in order to leverage your custom image's built-in python environment.

```python
myenv.docker.base_image = "fastdotai/fastai2:latest"
myenv.python.user_managed_dependencies = True
```

### Create a ScriptRunConfig
This ScriptRunConfig will submit your job for execution on the local compute target.

```python
from azureml.core import ScriptRunConfig

fastaicfg = ScriptRunConfig(source_directory='fastai-example', script='train.py')
fastaicfg.run_config.environment = myenv
```

### Submit your run
```python
from azureml.core import Experiment

run = Experiment(ws,'fastai-custom-image').submit(fastaicfg)
run.wait_for_completion(show_output=True)
```

For more information about customizing your Python environment, see [Create & use software environments](how-to-use-environments.md). 

## Next steps
In this article, you trained a model using a custom Docker image. See these other articles to learn more about Azure Machine Learning.
* [Track run metrics](how-to-track-experiments.md) during training
* [Deploy a model](https://docs.microsoft.com/azure/machine-learning/how-to-deploy-custom-docker-image) using a custom Docker image
