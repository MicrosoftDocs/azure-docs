---
title: 'Manage Azure Machine Learning environments with the CLI (v2)'
titleSuffix: Azure Machine Learning
description: Learn how to manage Azure ML environments using Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: mx-iao
ms.author: minxia
ms.date: 09/27/2021
ms.reviewer: laobri
ms.custom: devx-track-azurecli, devplatv2
---

# Manage Azure Machine Learning environments with the CLI (v2)

Azure Machine Learning environments define the execution environments for your jobs or deployments and encapsulate the dependencies for your code. Azure ML uses the environment specification to create the Docker container that your training or scoring code runs in on the specified compute target. You can define an environment from a conda specification, Docker image, or Docker build context.

In this article, learn how to create and manage Azure ML environments using the CLI (v2).

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

- To use the CLI, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
- [Install and set up the Azure CLI extension for Machine Learning](how-to-configure-cli.md)

> [!TIP]
> For a full-featured development environment, use Visual Studio Code and the [Azure Machine Learning extension](how-to-setup-vs-code.md) to [manage Azure Machine Learning resources](how-to-manage-resources-vscode.md) and [train machine learning models](tutorial-train-deploy-image-classification-model-vscode.md).

### Clone examples repository

To run the training examples, first clone the examples repository and change into the `cli` directory:

:::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="git_clone":::

Note that `--depth 1` clones only the latest commit to the repository which reduces time to complete the operation.

## Curated environments

There are two types of environments in Azure ML, curated and custom environments. Curated environments are predefined environments containing popular ML frameworks and tooling. Custom environments are user-defined and can be created via `az ml environment create`.

Curated environments are provided by Azure ML and are available in your workspace by default. Azure ML routinely updates these environments with the latest framework version releases and maintains them for bug fixes and security patches. They are backed by cached Docker images, which reduces the job preparation cost and model deployment time.

You can use these curated environments out of the box for training or deployment by referencing a specific environment using the `azureml:<curated-environment-name>:<version>` syntax. You can also use them as reference for your own custom environments by modifying the Dockerfiles that back these curated environments.

For a list of curated environments, see [Azure Machine Learning curated environments](resource-curated-environments.md). You can also view the set of available curated environments in the Azure ML studio UI, or using the CLI (v2) via `az ml environments list`.

## Create an environment

You can define an environment from a conda specification, Docker image, or Docker build context. Configure the environment using a YAML specification file and create the environment using the following CLI command:

```cli
az ml environment create --file my_environment.yml
```

For the YAML reference documentation for Azure ML environments, see [CLI (v2) environment YAML schema](reference-yaml-environment.md).

### Create an environment from a Docker image

To define an environment from a Docker image, provide the image URI of the image hosted in a registry such as Docker Hub or Azure Container Registry. 

The following example is a YAML specification file for an environment defined from a Docker image. An image from the official PyTorch repository on Docker Hub is specified to the `image` property in the YAML file.

:::code language="yaml" source="~/azureml-examples-main/cli/assets/environment/docker-image.yml":::

To create the environment:

```cli
az ml environment create --file assets/environment/docker-image.yml
```

> [!TIP]
> Azure ML maintains a set of CPU and GPU Ubuntu Linux-based base images with common system dependencies. For example, the GPU images contain Miniconda, OpenMPI, CUDA, cuDNN, and NCCL. You can use these images for your environments, or use their corresponding Dockerfiles as reference when building your own custom images.
>  
> For the set of base images and their corresponding Dockerfiles, see the [AzureML-Containers repo](https://github.com/Azure/AzureML-Containers).

### Create an environment from a Docker build context

### Create an environment from a conda specification

You can define an environment using the standard conda YAML configuration file of the dependencies for a conda environment. See https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-file-manually for information on this standard format.

You must also specify a base Docker image for this environment. Azure ML will build the conda environment on top of the Docker image provided.

The following example is a YAML specification file for an environment defined from a conda specification. Here the relative path to the conda file from the Azure ML environment YAML file is specified to the `conda_file` property. You can alternatively define the conda specification inline for the `conda_file` property, rather than define it in a separate file.

:::code language="yaml" source="~/azureml-examples-main/cli/assets/environment/docker-image-plus-conda.yml":::

To create the environment:

```cli
az ml environment create --file assets/environment/docker-image-plus-conda.yml
```

Azure ML will build the final Docker image from this environment specification when the environment is used in a job or deployment. You can also manually trigger a build of the environment in the studio UI.

## Manage environments

### List

### Show

### Update

### Delete

## Use environments for training

## Use environments for model deployments

## Next steps

- [Train]()
- [Deploy]()
- [YAML reference]()
