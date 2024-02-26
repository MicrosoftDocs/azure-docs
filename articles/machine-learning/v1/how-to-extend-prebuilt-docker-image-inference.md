---
title: Extend prebuilt Docker image
titleSuffix: Azure Machine Learning
description: 'Extend Prebuilt docker images in Azure Machine Learning'
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.author: sehan
author: dem108
ms.date: 10/21/2021
ms.topic: how-to
ms.reviewer: larryfr
ms.custom: UpdateFrequency5, deploy, docker, prebuilt
---

# Extend a prebuilt Docker image

In some cases, the [prebuilt Docker images for model inference](../concept-prebuilt-docker-images-inference.md) and [extensibility](./how-to-prebuilt-docker-images-inference-python-extensibility.md) solutions for Azure Machine Learning may not meet your inference service needs.

In this case, you can use a Dockerfile to create a new image, using one of the prebuilt images as the starting point. By extending from an existing prebuilt Docker image, you can use the Azure Machine Learning network stack and libraries without creating an image from scratch.

**Benefits and tradeoffs**

Using a Dockerfile allows for full customization of the image before deployment. It allows you to have maximum control over what dependencies or environment variables, among other things, are set in the container.

The main tradeoff for this approach is that an extra image build will take place during deployment, which slows down the deployment process. If you can use the [Python package extensibility](./how-to-prebuilt-docker-images-inference-python-extensibility.md) method, deployment will be faster.
## Prerequisites

* An Azure Machine Learning workspace. For a tutorial on creating a workspace, see [Create resources to get started](../quickstart-create-resources.md).
* Familiarity with authoring a [Dockerfile](https://docs.docker.com/engine/reference/builder/).
* Either a local working installation of [Docker](https://www.docker.com/), including the `docker` CLI, **OR** an Azure Container Registry (ACR) associated with your Azure Machine Learning workspace.

    > [!WARNING]
    > The Azure Container Registry for your workspace is created the first time you train or deploy a model using the workspace. If you've created a new workspace, but not trained or created a model, no Azure Container Registry will exist for the workspace.
## Create and build Dockerfile

Below is a sample Dockerfile that uses an Azure Machine Learning prebuilt Docker image as a base image:

```Dockerfile
FROM mcr.microsoft.com/azureml/<image_name>:<tag>

COPY requirements.txt /tmp/requirements.txt​

RUN pip install –r /tmp/requirements.txt​
```

Then put the above Dockerfile into the directory with all the necessary files and run the following command to build the image:

```bash
docker build -f <above dockerfile> -t <image_name>:<tag> .
```

> [!TIP]
> More details about `docker build` can be found here in the [Docker documentation](https://docs.docker.com/engine/reference/commandline/build/).

If the `docker build` command isn't available locally, use the Azure Container Registry ACR for your Azure Machine Learning Workspace to build the Docker image in the cloud. For more information, see [Tutorial: Build and deploy container images with Azure Container Registry](../../container-registry/container-registry-tutorial-quick-task.md).

> [!IMPORTANT]
> Microsoft recommends that you first validate that your Dockerfile works locally before trying to create a custom base image via Azure Container Registry.

The following sections contain more specific details on the Dockerfile.

## Install extra packages

If there are any other `apt` packages that need to be installed in the Ubuntu container, you can add them in the Dockerfile. The following example demonstrates how to use the `apt-get` command from a Dockerfile:

```Dockerfile
FROM <prebuilt docker image from MCR>

# Switch to root to install apt packages
USER root:root

RUN apt-get update && \
    apt-get install -y \
    <package-1> \
    ... 
    <package-n> && \
    apt-get clean -y && \
    rm -rf /var/lib/apt/lists/*

# Switch back to non-root user
USER dockeruser
```

You can also install addition pip packages from a Dockerfile. The following example demonstrates using `pip install`:

```Dockerfile
RUN pip install <library>
```

<a id="buildmodel"></a>

## Build model and code into images

If the model and code need to be built into the image, the following environment variables need to be set in the Dockerfile:

* `AZUREML_ENTRY_SCRIPT`: The entry script of your code. This file contains the `init()` and `run()` methods.
* `AZUREML_MODEL_DIR`: The directory that contains the model file(s). The entry script should use this directory as the root directory of the model.

The following example demonstrates setting these environment variables in the Dockerfile:

```Dockerfile
FROM <prebuilt docker image from MCR>

# Code
COPY <local_code_directory> /var/azureml-app
ENV AZUREML_ENTRY_SCRIPT=<entryscript_file_name>

# Model
COPY <model_directory> /var/azureml-app/azureml-models
ENV AZUREML_MODEL_DIR=/var/azureml-app/azureml-models
```

## Example Dockerfile

The following example demonstrates installing `apt` packages, setting environment variables, and including code and models as part of the Dockerfile:

```Dockerfile
FROM mcr.microsoft.com/azureml/pytorch-1.6-ubuntu18.04-py37-cpu-inference:latest 

USER root:root

# Install libpng-tools and opencv
RUN apt-get update && \
    apt-get install -y \
    libpng-tools \
    python3-opencv && \
    apt-get clean -y && \
    rm -rf /var/lib/apt/lists/*

# Switch back to non-root user
USER dockeruser

# Code
COPY code /var/azureml-app
ENV AZUREML_ENTRY_SCRIPT=score.py

# Model
COPY model /var/azureml-app/azureml-models
ENV AZUREML_MODEL_DIR=/var/azureml-app/azureml-models
```

## Next steps

To use a Dockerfile with the Azure Machine Learning Python SDK, see the following documents:

* [Use your own local Dockerfile](../how-to-use-environments.md#use-your-own-dockerfile)
* [Use a pre-built Docker image and create a custom base image](../how-to-use-environments.md#use-a-prebuilt-docker-image)

To learn more about deploying a model, see [How to deploy a model](how-to-deploy-and-where.md).

To learn how to troubleshoot prebuilt docker image deployments, see [how to troubleshoot prebuilt Docker image deployments](how-to-troubleshoot-prebuilt-docker-image-inference.md).