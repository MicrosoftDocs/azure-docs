---
title: Extend Prebuilt Docker Image in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: 'Extend Prebuilt docker images in Azure Machine Learning'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: ssambare
author: shivanissambare
ms.date: 05/07/2021
ms.topic: how-to
ms.reviewer: larryfr
ms.custom: deploy, docker, prebuilt
---

# Extend a Prebuilt Docker Image in Azure Machine Learning

If existing Azure Machine Learning Prebuilt Docker image and our [extensibility](./how-to-prebuilt-docker-images-inference-python-extensibility.md) solutions cannot fulfill your inference service requirements then you can easily extend from one of Prebuilt docker images to accommodate your needs directly with a Dockerfile.

By extending from Azure Machine Learning Prebuilt Docker image, you can leverage existing Azure Machine Learning network stack and prebuilt machine learning libraries without creating an image from scratch.

## Create Dockerfile and Build It

Below is a sample Dockerfile to use Azure Machine Learning Prebuilt Docker image as a base image:

```Dockerfile
FROM mcr.microsoft.com/azureml/<image_name>:<tag>

<Additional steps>
```

Then put the above Dockerfile into the folder with all the necessary files and run the following command to build the image:

```bash
docker build -f <above dockerfile> -t <image_name>:<tag> .
```

More details about `docker build` can be found here in the [official documentation](https://docs.docker.com/engine/reference/commandline/build/).

If the `docker build` command is not feasible locally, using the ACR associated with the Azure Machine Learning Workspace can help with building the Docker image in the cloud. Here is the [tutorial](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-quick-task).

The following sections contain more specific details in the Dockerfile.

## Install Additional Packages

If there are any additional `apt` packages needs to be installed in the Ubuntu container, the following Dockerfile is a good starting point:

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

You can also install addition pip packages with the following command in the Dockerfile:

```Dockerfile
RUN pip install <library>
```

## Build Model and Code into Images

If the model and code need to be built into the image, the following environment variables need to be set in the Dockerfile:

* `AML_APP_ROOT`: the directory containers user code
* `AZUREML_ENTRY_SCRIPT`: the entry script of the user code. `init()` and `run()` need to be in this file.
* `AZUREML_MODEL_DIR`: the folder contains model files. the entry script should use this folder as the root folder of the model.

Here is a template:

```Dockerfile
FROM <prebuilt docker image from MCR>

# Code
COPY <local_code_folder> /var/azureml-app
ENV AML_APP_ROOT=/var/azureml-app
ENV AZUREML_ENTRY_SCRIPT=<entryscript_file_name>

# Model
COPY <model_folder> /var/azureml-app/azureml-models
ENV AZUREML_MODEL_DIR=/var/azureml-app/azureml-models
```

A sample folder structure in the container will be like this:

``` bash
└── var
    └── azureml-app
        ├── azureml-models
        │   └── model.onnx
        ├── bar
        │   ├── __init__.py
        │   └── bar.py
        ├── foo
        │   ├── __init__.py
        │   └── foo.py
        ├── score.py
        └── util
            ├── __init__.py
            └── misc.py
```

## Dockerfile Sample

A full sample Dockerfile with additional packages, model and code could look like this:

```Dockerfile
FROM mcr.microsoft.com/azureml/pytorch1.6-py3.7-inference-cpu:latest

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
ENV AML_APP_ROOT=/var/azureml-app
ENV AZUREML_ENTRY_SCRIPT=score.py

# Model
COPY model /var/azureml-app/azureml-models
ENV AZUREML_MODEL_DIR=/var/azureml-app/azureml-models
```

## Using Dockerfile in Azure ML SDK

To use a Dockerfile via the AML SDK, one can either [use your own local Dockerfile](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-use-environments#use-your-own-dockerfile) or use a [pre-built Docker image and create a custom base image](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-use-environments#use-a-prebuilt-docker-image).

For simplicity, we recommend first validating a Dockerfile works locally before trying to create a custom base image via Azure Container Registry.

## Benefits and Tradeoffs

Using a Dockerfile allows for full customization of the image before deployment. This allows you to have maximum control over what dependencies or environment variables,among other things, are set in the container.

The main tradeoff for this approach is that an extra image build will take place during deployment, which will slow down the deployment process. We encourage to use the other extensibility solutions if possible, as this cuts down on the time it takes to deploy the container.