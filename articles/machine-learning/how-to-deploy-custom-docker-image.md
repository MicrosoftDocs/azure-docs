---
title: Deploy models with custom Docker image
titleSuffix: Azure Machine Learning
description: Learn how to use a custom Docker base image to deploy your Azure Machine Learning models. While Azure Machine Learning provides a default base image for you, you can also use your own base image.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: sagopal
author: saachigopal
ms.reviewer: larryfr
ms.date: 11/16/2020
ms.topic: how-to
ms.custom: devx-track-python, deploy
---

# Deploy a model using a custom Docker base image

Learn how to use a custom Docker base image when deploying trained models with Azure Machine Learning.

Azure Machine Learning will use a default base Docker image if none is specified. You can find the specific Docker image used with `azureml.core.runconfig.DEFAULT_CPU_IMAGE`. You can also use Azure Machine Learning __environments__ to select a specific base image, or use a custom one that you provide.

A base image is used as the starting point when an image is created for a deployment. It provides the underlying operating system and components. The deployment process then adds additional components, such as your model, conda environment, and other assets, to the image.

Typically, you create a custom base image when you want to use Docker to manage your dependencies, maintain tighter control over component versions or save time during deployment. You might also want to install software required by your model, where the installation process takes a long time. Installing the software when creating the base image means that you don't have to install it for each deployment.

> [!IMPORTANT]
> When you deploy a model, you cannot override core components such as the web server or IoT Edge components. These components provide a known working environment that is tested and supported by Microsoft.

> [!WARNING]
> Microsoft may not be able to help troubleshoot problems caused by a custom image. If you encounter problems, you may be asked to use the default image or one of the images Microsoft provides to see if the problem is specific to your image.

This document is broken into two sections:

* Create a custom base image: Provides information to admins and DevOps on creating a custom image and configuring authentication to an Azure Container Registry using the Azure CLI and Machine Learning CLI.
* Deploy a model using a custom base image: Provides information to Data Scientists and DevOps / ML Engineers on using custom images when deploying a trained model from the Python SDK or ML CLI.

## Prerequisites

* An Azure Machine Learning workspace. For more information, see the [Create a workspace](how-to-manage-workspace.md) article.
* The [Azure Machine Learning SDK](/python/api/overview/azure/ml/install). 
* The [Azure CLI](/cli/azure/install-azure-cli).
* The [CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
* An [Azure Container Registry](../container-registry/index.yml) or other Docker registry that is accessible on the internet.
* The steps in this document assume that you are familiar with creating and using an __inference configuration__ object as part of model deployment. For more information, see [Where to deploy and how](how-to-deploy-and-where.md).

## Create a custom base image

The information in this section assumes that you are using an Azure Container Registry to store Docker images. Use the following checklist when planning to create custom images for Azure Machine Learning:

* Will you use the Azure Container Registry created for the Azure Machine Learning workspace, or a standalone Azure Container Registry?

    When using images stored in the __container registry for the workspace__, you do not need to authenticate to the registry. Authentication is handled by the workspace.

    > [!WARNING]
    > The Azure Container Registry for your workspace is __created the first time you train or deploy a model__ using the workspace. If you've created a new workspace, but not trained or created a model, no Azure Container Registry will exist for the workspace.

    When using images stored in a __standalone container registry__, you will need to configure a service principal that has at least read access. You then provide the service principal ID (username) and password to anyone that uses images from the registry. The exception is if you make the container registry publicly accessible.

    For information on creating a private Azure Container Registry, see [Create a private container registry](../container-registry/container-registry-get-started-azure-cli.md).

    For information on using service principals with Azure Container Registry, see [Azure Container Registry authentication with service principals](../container-registry/container-registry-auth-service-principal.md).

* Azure Container Registry and image information: Provide the image name to anyone that needs to use it. For example, an image named `myimage`, stored in a registry named `myregistry`, is referenced as `myregistry.azurecr.io/myimage` when using the image for model deployment

### Image requirements

Azure Machine Learning only supports Docker images that provide the following software:
* Ubuntu 16.04 or greater.
* Conda 4.5.# or greater.
* Python 3.6+.

To use Datasets, please install the libfuse-dev package. Also make sure to install any user space packages you may need.

Azure ML maintains a set of CPU and GPU base images published to Microsoft Container Registry that you can optionally leverage (or reference) instead of creating your own custom image. To see the Dockerfiles for those images, refer to the [Azure/AzureML-Containers](https://github.com/Azure/AzureML-Containers) GitHub repository.

For GPU images, Azure ML currently offers both cuda9 and cuda10 base images. The major dependencies installed in these base images are:

| Dependencies | IntelMPI CPU | OpenMPI CPU | IntelMPI GPU | OpenMPI GPU |
| --- | --- | --- | --- | --- |
| miniconda | ==4.5.11 | ==4.5.11 | ==4.5.11 | ==4.5.11 |
| mpi | intelmpi==2018.3.222 |openmpi==3.1.2 |intelmpi==2018.3.222| openmpi==3.1.2 |
| cuda | - | - | 9.0/10.0 | 9.0/10.0/10.1 |
| cudnn | - | - | 7.4/7.5 | 7.4/7.5 |
| nccl | - | - | 2.4 | 2.4 |
| git | 2.7.4 | 2.7.4 | 2.7.4 | 2.7.4 |

The CPU images are built from ubuntu16.04. The GPU images for cuda9 are built from nvidia/cuda:9.0-cudnn7-devel-ubuntu16.04. The GPU images for cuda10 are built from nvidia/cuda:10.0-cudnn7-devel-ubuntu16.04.
<a id="getname"></a>

> [!IMPORTANT]
> When using custom Docker images, it is recommended that you pin package versions in order to better ensure reproducibility.

### Get container registry information

In this section, learn how to get the name of the Azure Container Registry for your Azure Machine Learning workspace.

> [!WARNING]
> The Azure Container Registry for your workspace is __created the first time you train or deploy a model__ using the workspace. If you've created a new workspace, but not trained or created a model, no Azure Container Registry will exist for the workspace.

If you've already trained or deployed models using Azure Machine Learning, a container registry was created for your workspace. To find the name of this container registry, use the following steps:

1. Open a new shell or command-prompt and use the following command to authenticate to your Azure subscription:

    ```azurecli-interactive
    az login
    ```

    Follow the prompts to authenticate to the subscription.

    [!INCLUDE [select-subscription](../../includes/machine-learning-cli-subscription.md)] 

2. Use the following command to list the container registry for the workspace. Replace `<myworkspace>` with your Azure Machine Learning workspace name. Replace `<resourcegroup>` with the Azure resource group that contains your workspace:

    ```azurecli-interactive
    az ml workspace show -w <myworkspace> -g <resourcegroup> --query containerRegistry
    ```

    [!INCLUDE [install extension](../../includes/machine-learning-service-install-extension.md)]

    The information returned is similar to the following text:

    ```text
    /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.ContainerRegistry/registries/<registry_name>
    ```

    The `<registry_name>` value is the name of the Azure Container Registry for your workspace.

### Build a custom base image

The steps in this section walk-through creating a custom Docker image in your Azure Container Registry. For sample dockerfiles, see the [Azure/AzureML-Containers](https://github.com/Azure/AzureML-Containers) GitHub repo).

1. Create a new text file named `Dockerfile`, and use the following text as the contents:

    ```text
    FROM ubuntu:16.04

    ARG CONDA_VERSION=4.7.12
    ARG PYTHON_VERSION=3.7
    ARG AZUREML_SDK_VERSION=1.13.0
    ARG INFERENCE_SCHEMA_VERSION=1.1.0

    ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
    ENV PATH /opt/miniconda/bin:$PATH
    ENV DEBIAN_FRONTEND=noninteractive

    RUN apt-get update --fix-missing && \
        apt-get install -y wget bzip2 && \
        apt-get install -y fuse && \
        apt-get clean -y && \
        rm -rf /var/lib/apt/lists/*

    RUN useradd --create-home dockeruser
    WORKDIR /home/dockeruser
    USER dockeruser

    RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-${CONDA_VERSION}-Linux-x86_64.sh -O ~/miniconda.sh && \
        /bin/bash ~/miniconda.sh -b -p ~/miniconda && \
        rm ~/miniconda.sh && \
        ~/miniconda/bin/conda clean -tipsy
    ENV PATH="/home/dockeruser/miniconda/bin/:${PATH}"

    RUN conda install -y conda=${CONDA_VERSION} python=${PYTHON_VERSION} && \
        pip install azureml-defaults==${AZUREML_SDK_VERSION} inference-schema==${INFERENCE_SCHEMA_VERSION} &&\
        conda clean -aqy && \
        rm -rf ~/miniconda/pkgs && \
        find ~/miniconda/ -type d -name __pycache__ -prune -exec rm -rf {} \;
    ```

2. From a shell or command-prompt, use the following to authenticate to the Azure Container Registry. Replace the `<registry_name>` with the name of the container registry you want to store the image in:

    ```azurecli-interactive
    az acr login --name <registry_name>
    ```

3. To upload the Dockerfile, and build it, use the following command. Replace `<registry_name>` with the name of the container registry you want to store the image in:

    ```azurecli-interactive
    az acr build --image myimage:v1 --registry <registry_name> --file Dockerfile .
    ```

    > [!TIP]
    > In this example, a tag of `:v1` is applied to the image. If no tag is provided, a tag of `:latest` is applied.

    During the build process, information is streamed to back to the command line. If the build is successful, you receive a message similar to the following text:

    ```text
    Run ID: cda was successful after 2m56s
    ```

For more information on building images with an Azure Container Registry, see [Build and run a container image using Azure Container Registry Tasks](../container-registry/container-registry-quickstart-task-cli.md)

For more information on uploading existing images to an Azure Container Registry, see [Push your first image to a private Docker container registry](../container-registry/container-registry-get-started-docker-cli.md).

## Use a custom base image

To use a custom image, you need the following information:

* The __image name__. For example, `mcr.microsoft.com/azureml/o16n-sample-user-base/ubuntu-miniconda:latest` is the path to a simple Docker Image provided by Microsoft.

    > [!IMPORTANT]
    > For custom images that you've created, be sure to include any tags that were used with the image. For example, if your image was created with a specific tag, such as `:v1`. If you did not use a specific tag when creating the image, a tag of `:latest` was applied.

* If the image is in a __private repository__, you need the following information:

    * The registry __address__. For example, `myregistry.azureecr.io`.
    * A service principal __username__ and __password__ that has read access to the registry.

    If you do not have this information, speak to the administrator for the Azure Container Registry that contains your image.

### Publicly available base images

Microsoft provides several docker images on a publicly accessible repository, which can be used with the steps in this section:

| Image | Description |
| ----- | ----- |
| `mcr.microsoft.com/azureml/o16n-sample-user-base/ubuntu-miniconda` | Core image for Azure Machine Learning |
| `mcr.microsoft.com/azureml/onnxruntime:latest` | Contains ONNX Runtime for CPU inferencing |
| `mcr.microsoft.com/azureml/onnxruntime:latest-cuda` | Contains the ONNX Runtime and CUDA for GPU |
| `mcr.microsoft.com/azureml/onnxruntime:latest-tensorrt` | Contains ONNX Runtime and TensorRT for GPU |
| `mcr.microsoft.com/azureml/onnxruntime:latest-openvino-vadm` | Contains ONNX Runtime and OpenVINO for Intel<sup></sup> Vision Accelerator Design based on Movidius<sup>TM</sup> MyriadX VPUs |
| `mcr.microsoft.com/azureml/onnxruntime:latest-openvino-myriad` | Contains ONNX Runtime and OpenVINO for Intel<sup></sup> Movidius<sup>TM</sup> USB sticks |

For more information about the ONNX Runtime base images see the [ONNX Runtime dockerfile section](https://github.com/microsoft/onnxruntime/blob/master/dockerfiles/README.md) in the GitHub repo.

> [!TIP]
> Since these images are publicly available, you do not need to provide an address, username or password when using them.

For more information, see [Azure Machine Learning containers](https://github.com/Azure/AzureML-Containers) repository on GitHub.

### Use an image with the Azure Machine Learning SDK

To use an image stored in the **Azure Container Registry for your workspace**, or a **container registry that is publicly accessible**, set the following [Environment](/python/api/azureml-core/azureml.core.environment.environment) attributes:

+ `docker.enabled=True`
+ `docker.base_image`: Set to the registry and path to the image.

```python
from azureml.core.environment import Environment
# Create the environment
myenv = Environment(name="myenv")
# Enable Docker and reference an image
myenv.docker.enabled = True
myenv.docker.base_image = "mcr.microsoft.com/azureml/o16n-sample-user-base/ubuntu-miniconda:latest"
```

To use an image from a __private container registry__ that is not in your workspace, you must use `docker.base_image_registry` to specify the address of the repository and a user name and password:

```python
# Set the container registry information
myenv.docker.base_image_registry.address = "myregistry.azurecr.io"
myenv.docker.base_image_registry.username = "username"
myenv.docker.base_image_registry.password = "password"

myenv.inferencing_stack_version = "latest"  # This will install the inference specific apt packages.

# Define the packages needed by the model and scripts
from azureml.core.conda_dependencies import CondaDependencies
conda_dep = CondaDependencies()
# you must list azureml-defaults as a pip dependency
conda_dep.add_pip_package("azureml-defaults")
myenv.python.conda_dependencies=conda_dep
```

You must add azureml-defaults with version >= 1.0.45 as a pip dependency. This package contains the functionality needed to host the model as a web service. You must also set inferencing_stack_version property on the environment to "latest", this will install specific apt packages needed by web service. 

After defining the environment, use it with an [InferenceConfig](/python/api/azureml-core/azureml.core.model.inferenceconfig) object to define the inference environment in which the model and web service will run.

```python
from azureml.core.model import InferenceConfig
# Use environment in InferenceConfig
inference_config = InferenceConfig(entry_script="score.py",
                                   environment=myenv)
```

At this point, you can continue with deployment. For example, the following code snippet would deploy a web service locally using the inference configuration and custom image:

```python
from azureml.core.webservice import LocalWebservice, Webservice

deployment_config = LocalWebservice.deploy_configuration(port=8890)
service = Model.deploy(ws, "myservice", [model], inference_config, deployment_config)
service.wait_for_deployment(show_output = True)
print(service.state)
```

For more information on deployment, see [Deploy models with Azure Machine Learning](how-to-deploy-and-where.md).

For more information on customizing your Python environment, see [Create and manage environments for training and deployment](how-to-use-environments.md). 

### Use an image with the Machine Learning CLI

> [!IMPORTANT]
> Currently the Machine Learning CLI can use images from the Azure Container Registry for your workspace or publicly accessible repositories. It cannot use images from standalone private registries.

Before deploying a model using the Machine Learning CLI, create an [environment](/python/api/azureml-core/azureml.core.environment.environment) that uses the custom image. Then create an inference configuration file that references the environment. You can also define the environment directly in the inference configuration file. The following JSON document demonstrates how to reference an image in a public container registry. In this example, the environment is defined inline:

```json
{
    "entryScript": "score.py",
    "environment": {
        "docker": {
            "arguments": [],
            "baseDockerfile": null,
            "baseImage": "mcr.microsoft.com/azureml/o16n-sample-user-base/ubuntu-miniconda:latest",
            "enabled": false,
            "sharedVolumes": true,
            "shmSize": null
        },
        "environmentVariables": {
            "EXAMPLE_ENV_VAR": "EXAMPLE_VALUE"
        },
        "name": "my-deploy-env",
        "python": {
            "baseCondaEnvironment": null,
            "condaDependencies": {
                "channels": [
                    "conda-forge"
                ],
                "dependencies": [
                    "python=3.6.2",
                    {
                        "pip": [
                            "azureml-defaults",
                            "azureml-telemetry",
                            "scikit-learn",
                            "inference-schema[numpy-support]"
                        ]
                    }
                ],
                "name": "project_environment"
            },
            "condaDependenciesFile": null,
            "interpreterPath": "python",
            "userManagedDependencies": false
        },
        "version": "1"
    }
}
```

This file is used with the `az ml model deploy` command. The `--ic` parameter is used to specify the inference configuration file.

```azurecli
az ml model deploy -n myservice -m mymodel:1 --ic inferenceconfig.json --dc deploymentconfig.json --ct akscomputetarget
```

For more information on deploying a model using the ML CLI, see the "model registration, profiling, and deployment" section of the [CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md#model-registration-profiling-deployment) article.

## Next steps

* Learn more about [Where to deploy and how](how-to-deploy-and-where.md).
* Learn how to [Train and deploy machine learning models using Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning).