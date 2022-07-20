---
title: 'Manage Azure Machine Learning environments with the CLI (v2)'
titleSuffix: Azure Machine Learning
description: Learn how to manage Azure ML environments using Azure CLI extension for Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: blackmist
ms.author: larryfr
ms.date: 03/31/2022
ms.reviewer: nibaccam
ms.custom: devx-track-azurecli, devplatv2, event-tier1-build-2022
---

# Manage Azure Machine Learning environments with the CLI (v2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning CLI extension you are using:"]
> * [v1](./v1/how-to-use-environments.md)
> * [v2 (current version)](how-to-manage-environments-v2.md)



Azure Machine Learning environments define the execution environments for your jobs or deployments and encapsulate the dependencies for your code. Azure ML uses the environment specification to create the Docker container that your training or scoring code runs in on the specified compute target. You can define an environment from a conda specification, Docker image, or Docker build context.

In this article, learn how to create and manage Azure ML environments using the CLI (v2).


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

There are two types of environments in Azure ML: curated and custom environments. Curated environments are predefined environments containing popular ML frameworks and tooling. Custom environments are user-defined and can be created via `az ml environment create`.

Curated environments are provided by Azure ML and are available in your workspace by default. Azure ML routinely updates these environments with the latest framework version releases and maintains them for bug fixes and security patches. They are backed by cached Docker images, which reduces job preparation cost and model deployment time.

You can use these curated environments out of the box for training or deployment by referencing a specific environment using the `azureml:<curated-environment-name>:<version>` or `azureml:<curated-environment-name>@latest` syntax. You can also use them as reference for your own custom environments by modifying the Dockerfiles that back these curated environments.

You can see the set of available curated environments in the Azure ML studio UI, or by using the CLI (v2) via `az ml environments list`.

## Create an environment

You can define an environment from a conda specification, Docker image, or Docker build context. Configure the environment using a YAML specification file and create the environment using the following CLI command:

```cli
az ml environment create --file my_environment.yml
```

For the YAML reference documentation for Azure ML environments, see [CLI (v2) environment YAML schema](reference-yaml-environment.md).

### Create an environment from a Docker image

To define an environment from a Docker image, provide the image URI of the image hosted in a registry such as Docker Hub or Azure Container Registry. 

The following example is a YAML specification file for an environment defined from a Docker image. An image from the official PyTorch repository on Docker Hub is specified via the `image` property in the YAML file.

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

Instead of defining an environment from a prebuilt image, you can also define one from a Docker [build context](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#understand-build-context). To do so, specify the directory that will serve as the build context. This directory should contain a Dockerfile and any other files needed to build the image.

The following example is a YAML specification file for an environment defined from a build context. The local path to the build context folder is specified in the `build.path` field, and the relative path to the Dockerfile within that build context folder is specified in the `build.dockerfile_path` field. If `build.dockerfile_path` is omitted in the YAML file, Azure ML will look for a Dockerfile named `Dockerfile` at the root of the build context.

In this example, the build context contains a Dockerfile named `Dockerfile` and a `requirements.txt` file that is referenced within the Dockerfile for installing Python packages.

:::code language="yaml" source="~/azureml-examples-main/cli/assets/environment/docker-context.yml":::

To create the environment:

```cli
az ml environment create --file assets/environment/docker-context.yml
```

Azure ML will start building the image from the build context when the environment is created. You can monitor the status of the build and view the build logs in the studio UI.

### Create an environment from a conda specification

You can define an environment using a standard conda YAML configuration file that includes the dependencies for the conda environment. See [Creating an environment manually](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-file-manually) for information on this standard format.

You must also specify a base Docker image for this environment. Azure ML will build the conda environment on top of the Docker image provided. If you install some Python dependencies in your Docker image, those packages will not exist in the execution environment thus causing runtime failures. By default, Azure ML will build a Conda environment with dependencies you specified, and will execute the job in that environment instead of using any Python libraries that you installed on the base image.

The following example is a YAML specification file for an environment defined from a conda specification. Here the relative path to the conda file from the Azure ML environment YAML file is specified via the `conda_file` property. You can alternatively define the conda specification inline using the `conda_file` property, rather than defining it in a separate file.

:::code language="yaml" source="~/azureml-examples-main/cli/assets/environment/docker-image-plus-conda.yml":::

To create the environment:

```cli
az ml environment create --file assets/environment/docker-image-plus-conda.yml
```

Azure ML will build the final Docker image from this environment specification when the environment is used in a job or deployment. You can also manually trigger a build of the environment in the studio UI.

## Manage environments

The CLI (v2) provides a set of commands under `az ml environment` for managing the lifecycle of your Azure ML environment assets.

### List

List all the environments in your workspace:

```cli
az ml environment list
```

List all the environment versions under a given name:

```cli
az ml environment list --name docker-image-example
```

### Show

Get the details of a specific environment:

```cli
az ml environment list --name docker-image-example --version 1
```

### Update

Update mutable properties of a specific environment:

```cli
az ml environment update --name docker-image-example --version 1 --set description="This is an updated description."
```

> [!IMPORTANT]
> For environments, only `description` and `tags` can be updated. All other properties are immutable; if you need to change any of those properties you should create a new version of the environment.

### Archive and restore

Archiving an environment will hide it by default from list queries (`az ml environment list`). You can still continue to reference and use an archived environment in your workflows. You can archive either an environment container or a specific environment version.

Archiving an environment container will archive all versions of the environment under that given name. If you create a new environment version under an archived environment container, that new version will automatically be set as archived as well.

Archive an environment container:
```cli
az ml environment archive --name docker-image-example
```            
            
Archive a specific environment version:
```cli
az ml environment archive --name docker-image-example --version 1
```

You can restore an archived environment to no longer hide it from list queries.

If an entire environment container is archived, you can restore that archived container. You cannot restore only a specific environment version if the entire environment container is archived - you will need to restore the entire container.

Restore an environment container:
```cli
az ml environment restore --name docker-image-example
``` 

If only individual environment version(s) within an environment container are archived, you can restore those individual version(s).

Restore a specific environment version:
```cli
az ml environment restore --name docker-image-example --version 1
``` 

## Use environments for training

To use an environment for a training job, specify the `environment` field of the job YAML configuration. You can either reference an existing registered Azure ML environment via `environment: azureml:<environment-name>:<environment-version>` or `environment: azureml:<environment-name>@latest` (to reference the latest version of an environment), or define an environment specification inline. If defining an environment inline, do not specify the `name` and `version` fields, as these environments are treated as "unregistered" environments and are not tracked in your environment asset registry.

When you submit a training job, the building of a new environment can take several minutes. The duration depends on the size of the required dependencies. The environments are cached by the service. So as long as the environment definition remains unchanged, you incur the full setup time only once.

For more information on how to use environments in jobs, see [Train models with the CLI (v2)](how-to-train-cli.md).

## Use environments for model deployments

You can also use environments for your model deployments for both online and batch scoring. To do so, specify the `environment` field in the deployment YAML configuration.

For more information on how to use environments in deployments, see [Deploy and score a machine learning model by using a managed online endpoint](how-to-deploy-managed-online-endpoints.md).

## Next steps

- [Train models (create jobs) with the CLI (v2)](how-to-train-cli.md)
- [Deploy and score a machine learning model by using a managed online endpoint](how-to-deploy-managed-online-endpoints.md)
- [Environment YAML schema reference](reference-yaml-environment.md)
