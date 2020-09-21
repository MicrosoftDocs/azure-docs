---
title: Train a model using a custom Docker image
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

In this article, learn how to use a custom Docker image when training models with Azure Machine Learning. 

The example scripts in this article are used to classify pet images by creating a convolutional neural network. 

While Azure Machine Learning provides a default Docker base image, you can also use Azure Machine Learning environments to specify a specific base image, such as one of the set of maintained [Azure ML base images](https://github.com/Azure/AzureML-Containers) or your own [custom image](https://docs.microsoft.com/azure/machine-learning/how-to-deploy-custom-docker-image#create-a-custom-base-image). Custom base images allow you to closely manage your dependencies and maintain tighter control over component versions when executing training jobs. 

## Prerequisites 
Run this code on either of these environments:
* Azure Machine Learning compute instance - no downloads or installation necessary
    * Complete the [Tutorial: Setup environment and workspace](tutorial-1st-experiment-sdk-setup.md) to create a dedicated notebook server pre-loaded with the SDK and the sample       repository.
    * In the Azure Machine Learning [examples repository](https://github.com/Azure/azureml-examples), find a completed notebook by navigating to this directory: **notebooks > fastai > train-pets-resnet34.ipynb** 

* Your own Jupyter Notebook server
    * Create a [workspace configuration file](how-to-configure-environment.md#workspace).
    * The [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py&preserve-view=true). 
    * An [Azure Container Registry](/azure/container-registry) or other Docker registry that is accessible on the internet.

## Set up the experiment 
This section sets up the training experiment by initializing a workspace, creating an experiment, and uploading the training data and training scripts.

### Initialize a workspace
The [Azure Machine Learning workspace](concept-workspace.md) is the top-level resource for the service. It provides you with a centralized place to work with all the artifacts you create. In the Python SDK, you can access the workspace artifacts by creating a [`workspace`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py&preserve-view=true) object.

Create a workspace object from the `config.json` file created in the [prerequisites section](#prerequisites).

```Python
from azureml.core import Workspace

ws = Workspace.from_config()
```

### Prepare scripts
For this tutorial, the training script **train.py** is provided [here](https://github.com/Azure/azureml-examples/blob/main/code/models/fastai/pets-resnet34/train.py). In practice, you can take any custom training script, as is, and run it with Azure Machine Learning.

### Define your environment
Create an environment object and enable Docker. 

```python
from azureml.core import Environment

fastai_env = Environment("fastai2")
fastai_env.docker.enabled = True
```

This specified base image supports the fast.ai library which allows for distributed deep learning capabilities. For more information, see the [fast.ai DockerHub](https://hub.docker.com/u/fastdotai). 

When you are using your custom Docker image, you might already have your Python environment properly set up. In that case, set the `user_managed_dependencies` flag to True in order to leverage your custom image's built-in python environment. By default, Azure ML will build a Conda environment with dependencies you specified, and will execute the run in that environment instead of using any Python libraries that you installed on the base image.

```python
fastai_env.docker.base_image = "fastdotai/fastai2:latest"
fastai_env.python.user_managed_dependencies = True
```

To use an image from a private container registry that is not in your workspace, you must use `docker.base_image_registry` to specify the address of the repository and a user name and password:

```python
# Set the container registry information
fastai_env.docker.base_image_registry.address = "myregistry.azurecr.io"
fastai_env.docker.base_image_registry.username = "username"
fastai_env.docker.base_image_registry.password = "password"
```

It is also possible to use a custom Dockerfile. Use this approach if you need to install non-Python packages as dependencies and remember to set the base image to None.

```python 
# Specify docker steps as a string. 
dockerfile = r"""
FROM mcr.microsoft.com/azureml/base:intelmpi2018.3-ubuntu16.04
RUN echo "Hello from custom container!"
"""

# Set base image to None, because the image is defined by dockerfile.
fastai_env.docker.base_image = None
fastai_env.docker.base_dockerfile = dockerfile

# Alternatively, load the string from a file.
fastai_env.docker.base_image = None
fastai_env.docker.base_dockerfile = "./Dockerfile"
```

### Create or attach existing AmlCompute
You will need to create a [compute target](https://docs.microsoft.com/azure/machine-learning/concept-azure-machine-learning-architecture#compute-target) for training your model. In this tutorial, you create AmlCompute as your training compute resource.

Creation of AmlCompute takes approximately 5 minutes. If the AmlCompute with that name is already in your workspace this code will skip the creation process.

As with other Azure services, there are limits on certain resources (e.g. AmlCompute) associated with the Azure Machine Learning service. Please read [this article](https://docs.microsoft.com/azure/machine-learning/how-to-manage-quotas) on the default limits and how to request more quota. 

```python
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException

# choose a name for your cluster
cluster_name = "gpu-cluster"

try:
    compute_target = ComputeTarget(workspace=ws, name=cluster_name)
    print('Found existing compute target.')
except ComputeTargetException:
    print('Creating a new compute target...')
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_NC6',
                                                           max_nodes=4)

    # create the cluster
    compute_target = ComputeTarget.create(ws, cluster_name, compute_config)

    compute_target.wait_for_completion(show_output=True)

# use get_status() to get a detailed status for the current AmlCompute
print(compute_target.get_status().serialize())
```

### Create a ScriptRunConfig
This ScriptRunConfig will configure your job for execution on the desired [compute target](https://docs.microsoft.com/azure/machine-learning/how-to-set-up-training-targets#compute-targets-for-training).

```python
from azureml.core import ScriptRunConfig

fastai_config = ScriptRunConfig(source_directory='fastai-example', script='train.py')
fastai_config.run_config.environment = fastai_env
fastai_config.run_config.target = compute_target
```

### Submit your run
When a training run is submitted using a ScriptRunConfig object, the submit method returns an object of type ScriptRun. The returned ScriptRun object gives you programmatic access to information about the training run. 

```python
from azureml.core import Experiment

run = Experiment(ws,'fastai-custom-image').submit(fastai_config)
run.wait_for_completion(show_output=True)
```

> [!WARNING]
> Azure Machine Learning runs training scripts by copying the entire source directory. If you have sensitive data that you don't want to upload, use a [.ignore file](how-to-save-write-experiment-files.md#storage-limits-of-experiment-snapshots) or don't include it in the source directory . Instead, access your data using a [datastore](https://docs.microsoft.com/python/api/azureml-core/azureml.data?view=azure-ml-py&preserve-view=true).

For more information about customizing your Python environment, see [create & use software environments](how-to-use-environments.md). 

## Next steps
In this article, you trained a model using a custom Docker image. See these other articles to learn more about Azure Machine Learning.
* [Track run metrics](how-to-track-experiments.md) during training
* [Deploy a model](https://docs.microsoft.com/azure/machine-learning/how-to-deploy-custom-docker-image) using a custom Docker image.
