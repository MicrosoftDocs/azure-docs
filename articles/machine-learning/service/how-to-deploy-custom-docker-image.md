---
title: How to deploy a model using a custom Docker image 
titleSuffix: Azure Machine Learning service
description: 'Learn how to use a custom Docker image when deploying your Azure Machine Learning service models. When deploying a trained model, a Docker image is created to host the image, web server, and other components needed to run the service. While Azure Machine Learning service provides a default image for you, you can also use your own image.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: jordane
author: jpe316
ms.reviewer: larryfr
ms.date: 07/11/2019
---

# Deploy a model using a custom Docker image

Learn how to use a custom Docker image when deploying trained models with the Azure Machine Learning service.

When you deploy a trained model to a web service or IoT Edge device, a Docker image is created. This image contains the model, conda environment, and assets needed to use the model. It also contains a web server to handle incoming requests when deployed as a web service, and components needed to work with Azure IoT Hub.

Azure Machine Learning service provides a default Docker image so you don't have to worry about creating one. You can also use a custom image that you create as a _base image_. A base image is used as the starting point when an image is created for a deployment. It provides the underlying operating system and components. The deployment process then adds additional components, such as your model, conda environment, and other assets, to the image before deploying it.

Typically, you create a custom image when you want to control component versions or save time during deployment. For example, you might want to standardize on a specific version of Python, Conda, or other component. You might also want to install software required by your model, where the installation process takes a long time. Installing the software when creating the base image means that you don't have to install it for each deployment.

> [!IMPORTANT]
> When deploying a model, you cannot override core components such as the web server or IoT Edge components. These components provide a known working environment that is tested and supported by Microsoft.

> [!WARNING]
> Microsoft may not be able to help troubleshoot problems caused by a custom image. If you encounter problems, you may be asked to use the default image or one of the images Microsoft provides to see if the problem is specific to your image.

This document is broken into two sections:

* Create a custom image: Provides information to admins and DevOps on creating a custom image and configuring authentication to an Azure Container Registry using the Azure CLI and Machine Learning CLI.
* Use a custom image: Provides information to Data Scientists and DevOps/MLOps on using custom images when deploying a trained model from the Python SDK or ML CLI.

## Prerequisites

* An Azure Machine Learning service workgroup. For more information, see the [Create a workspace](setup-create-workspace.md) article.
* The Azure Machine Learning SDK. For more information, see the Python SDK section of the [Create a workspace](setup-create-workspace.md#sdk) article.
* The [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).
* The [CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
* An [Azure Container Registry](/azure/container-registry) or other Docker registry that is accessible on the internet.
* The steps in this document assume that you are familiar with creating and using an __inference configuration__ object as part of model deployment. For more information, see the "prepare to deploy" section of [Where to deploy and how](how-to-deploy-and-where.md#prepare-to-deploy).

## Create a custom image

The information in this section assumes that you are using an Azure Container Registry to store Docker images. Use the following checklist when planning to create custom images for Azure Machine Learning service:

* Will you use the Azure Container Registry created for the Azure Machine Learning service workspace, or a standalone Azure Container Registry?

    When using images stored in the __container registry for the workspace__, you do not need to authenticate to the registry. Authentication is handled by the workspace.

    > [!WARNING]
    > The Azure Container Rzegistry for your workspace is __created the first time you train or deploy a model__ using the workspace. If you've created a new workspace, but not trained or created a model, no Azure Container Registry will exist for the workspace.

    For information on retrieving the name of the Azure Container Registry for your workspace, see the [Get container registry name](#getname) section of this article.

    When using images stored in a __standalone container registry__, you will need to configure a service principal that has at least read access. You then provide the service principal ID (username) and password to anyone that uses images from the registry. The exception is if you make the container registry publicly accessible.

    For information on creating a private Azure Container Registry, see [Create a private container registry](/azure/container-registry/container-registry-get-started-azure-cli).

    For information on using service principals with Azure Container Registry, see [Azure Container Registry authentication with service principals](/azure/container-registry/container-registry-auth-service-principal).

* Azure Container Registry and image information: Provide the image name to anyone that needs to use it. For example, an image named `myimage`, stored in a registry named `myregistry`, is referenced as `myregistry.azurecr.io/myimage` when using the image for model deployment

* Image requirements: Azure Machine Learning service only supports Docker images that provide the following software:

    * Ubuntu 16.04 or greater.
    * Conda 4.5.# or greater.
    * Python 3.5.# or 3.6.#.

<a id="getname"></a>

### Get container registry information

In this section, learn how to get the name of the Azure Container Registry for your Azure Machine Learning service workspace.

> [!WARNING]
> The Azure Container Registry for your workspace is __created the first time you train or deploy a model__ using the workspace. If you've created a new workspace, but not trained or created a model, no Azure Container Registry will exist for the workspace.

If you've already trained or deployed models using the Azure Machine Learning service, a container registry was created for your workspace. To find the name of this container registry, use the following steps:

1. Open a new shell or command-prompt and use the following command to authenticate to your Azure subscription:

    ```azurecli-interactive
    az login
    ```

    Follow the prompts to authenticate to the subscription.

2. Use the following command to list the container registry for the workspace. Replace `<myworkspace>` with your Azure Machine Learning service workspace name. Replace `<resourcegroup>` with the Azure resource group that contains your workspace:

    ```azurecli-interactive
    az ml workspace show -w <myworkspace> -g <resourcegroup> --query containerRegistry
    ```

    The information returned is similar to the following text:

    ```text
    /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.ContainerRegistry/registries/<registry_name>
    ```

    The `<registry_name>` value is the name of the Azure Container Registry for your workspace.

### Build a custom image

The steps in this section walk-through creating a custom Docker image in your Azure Container Registry.

1. Create a new text file named `Dockerfile`, and use the following text as the contents:

    ```text
    FROM ubuntu:16.04

    ARG CONDA_VERSION=4.5.12
    ARG PYTHON_VERSION=3.6

    ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
    ENV PATH /opt/miniconda/bin:$PATH

    RUN apt-get update --fix-missing && \
        apt-get install -y wget bzip2 && \
        apt-get clean && \
        rm -rf /var/lib/apt/lists/*

    RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-${CONDA_VERSION}-Linux-x86_64.sh -O ~/miniconda.sh && \
        /bin/bash ~/miniconda.sh -b -p /opt/miniconda && \
        rm ~/miniconda.sh && \
        /opt/miniconda/bin/conda clean -tipsy

    RUN conda install -y conda=${CONDA_VERSION} python=${PYTHON_VERSION} && \
        conda clean -aqy && \
        rm -rf /opt/miniconda/pkgs && \
        find / -type d -name __pycache__ -prune -exec rm -rf {} \;
    ```

2. From a shell or command-prompt, use the following to authenticate to the Azure Container Registry. Replace the `<registry_name>` with the name of the container registry you want to store the image in:

    ```azurecli-interactive
    az acr login --name <registry_name>
    ```

3. To upload the Dockerfile, and build it, use the following command. Replace `<registry_name>` with the name of the container registry you want to store the image in:

    ```azurecli-interactive
    az acr build --image myimage:v1 --registry <registry_name> --file Dockerfile .
    ```

    During the build process, information is streamed to back to the command line. If the build is successful, you receive a message similar to the following text:

    ```text
    Run ID: cda was successful after 2m56s
    ```

For more information on building images with an Azure Container Registry, see [Build and run a container image using Azure Container Registry Tasks](https://docs.microsoft.com/azure/container-registry/container-registry-quickstart-task-cli)

For more information on uploading existing images to an Azure Container Registry, see [Push your first image to a private Docker container registry](/azure/container-registry/container-registry-get-started-docker-cli).

## Use a custom image

To use a custom image, you need the following information:

* The __image name__. For example, `mcr.microsoft.com/azureml/o16n-sample-user-base/ubuntu-miniconda` is the path to a basic Docker Image provided by Microsoft.
* If the image is in a __private repository__, you need the following information:

    * The registry __address__. For example, `myregistry.azureecr.io`.
    * A service principal __username__ and __password__ that has read access to the registry.

    If you do not have this information, speak to the administrator for the Azure Container Registry that contains your image.

### Publicly available images

Microsoft provides several docker images on a publicly accessible repository, which can be used with the steps in this section:

| Image | Description |
| ----- | ----- |
| `mcr.microsoft.com/azureml/o16n-sample-user-base/ubuntu-miniconda` | Basic image for Azure Machine Learning service |
| `mcr.microsoft.com/azureml/onnxruntime:v0.4.0` | Contains the ONNX runtime. |
| `mcr.microsoft.com/azureml/onnxruntime:v0.4.0-cuda10.0-cudnn7` | Contains the ONNX runtime and CUDA components. |
| `mcr.microsoft.com/azureml/onnxruntime:v0.4.0-tensorrt19.03` | Contains ONNX runtime and TensorRT. |

> [!TIP]
> Since these images are publicly available, you do not need to provide an address, username or password when using them.

> [!IMPORTANT]
> Microsoft images that use CUDA or TensorRT must be used on Microsoft Azure Services only.

> [!TIP]
>__If your model is trained on Azure Machine Learning Compute__, using __version 1.0.22 or greater__ of the Azure Machine Learning SDK, an image is created during training. To discover the name of this image, use `run.properties["AzureML.DerivedImageName"]`. The following example demonstrates how to use this image:
>
> ```python
> # Use an image built during training with SDK 1.0.22 or greater
> image_config.base_image = run.properties["AzureML.DerivedImageName"]
> ```

### Use an image with the Azure Machine Learning SDK

To use a custom image, set the `base_image` property of the [inference configuration object](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.inferenceconfig?view=azure-ml-py) to the address of the image:

```python
# use an image from a registry named 'myregistry'
inference_config.base_image = "myregistry.azurecr.io/myimage:v1"
```

This format works for both images stored in the Azure Container Registry for your workspace and container registries that are publicly accessible. For example, the following code uses a default image provided by Microsoft:

```python
# use an image available in public Container Registry without authentication
inference_config.base_image = "mcr.microsoft.com/azureml/o16n-sample-user-base/ubuntu-miniconda"
```

To use an image from a __private container registry__ that is not in your workspace, you must specify the address of the repository and a user name and password:

```python
# Use an image available in a private Container Registry
inference_config.base_image = "myregistry.azurecr.io/mycustomimage:1.0"
inference_config.base_image_registry.address = "myregistry.azurecr.io"
inference_config.base_image_registry.username = "username"
inference_config.base_image_registry.password = "password"
```

### Use an image with the Machine Learning CLI

> [!IMPORTANT]
> Currently the Machine Learning CLI can use images from the Azure Container Registry for your workspace or publicly accessible repositories. It cannot use images from standalone private registries.

When deploying a model using the Machine Learning CLI, you provide an inference configuration file that references the custom image. The following JSON document demonstrates how to reference an image in a public container registry:

```json
{
   "entryScript": "score.py",
   "runtime": "python",
   "condaFile": "infenv.yml",
   "extraDockerfileSteps": null,
   "sourceDirectory": null,
   "enableGpu": false,
   "baseImage": "mcr.microsoft.com/azureml/o16n-sample-user-base/ubuntu-miniconda",
   "baseImageRegistry": "mcr.microsoft.com"
}
```

This file is used with the `az ml model deploy` command. The `--ic` parameter is used to specify the inference configuration file.

```azurecli
az ml model deploy -n myservice -m mymodel:1 --ic inferenceconfig.json --dc deploymentconfig.json --ct akscomputetarget
```

For more information on deploying a model using the ML CLI, see the "model registration, profiling, and deployment" section of the [CLI extension for Azure Machine Learning service](reference-azure-machine-learning-cli.md#model-registration-profiling-deployment) article.

## Next steps

* Learn more about [Where to deploy and how](how-to-deploy-and-where.md).
* Learn how to [Train and deploy machine learning models using Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning?view=azure-devops).
