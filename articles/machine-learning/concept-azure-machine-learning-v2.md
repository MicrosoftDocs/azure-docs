---
title: 'How Azure Machine Learning works (v2)'
titleSuffix: Azure Machine Learning
description: This article gives you a high-level understanding of the resources and assets that make up Azure Machine Learning (v2).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: event-tier1-build-2022, ignite-2022, build-2023
ms.topic: conceptual
ms.author: balapv
author: balapv
ms.reviewer: sgilley
ms.date: 11/04/2022
#Customer intent: As a data scientist, I want to understand the big picture about how Azure Machine Learning works.
---

# How Azure Machine Learning works: resources and assets

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

This article applies to the second version of the [Azure Machine Learning CLI & Python SDK (v2)](concept-v2.md). For version one (v1), see [How Azure Machine Learning works: Architecture and concepts (v1)](v1/concept-azure-machine-learning-architecture.md?view=azureml-api-1&preserve-view=true)

Azure Machine Learning includes several resources and assets to enable you to perform your machine learning tasks. These resources and assets are needed to run any job.

* **Resources**: setup or infrastructural resources needed to run a machine learning workflow. Resources include:
  * [Workspace](#workspace)
  * [Compute](#compute)
  * [Datastore](#datastore)
* **Assets**: created using Azure Machine Learning commands or as part of a training/scoring run. Assets are versioned and can be registered in the Azure Machine Learning workspace. They include:
  * [Model](#model)
  * [Environment](#environment)
  * [Data](#data)
  * [Component](#component)

This document provides a quick overview of these resources and assets.

## Workspace

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. The workspace keeps a history of all jobs, including logs, metrics, output, and a snapshot of your scripts. The workspace stores references to resources like datastores and compute. It also holds all assets like models, environments, components and data asset.

### Create a workspace

### [Azure CLI](#tab/cli)

To create a workspace using CLI v2, use the following command:

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```bash
az ml workspace create --file my_workspace.yml
```

For more information, see [workspace YAML schema](reference-yaml-workspace.md).

### [Python SDK](#tab/sdk)

To create a workspace using Python SDK v2, you can use the following code:

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
ws_basic = Workspace(
    name="my-workspace",
    location="eastus", # Azure region (location) of workspace
    display_name="Basic workspace-example",
    description="This example shows how to create a basic workspace"
)
ml_client.workspaces.begin_create(ws_basic) # use MLClient to connect to the subscription and resource group and create workspace
```

This [Jupyter notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/resources/workspace/workspace.ipynb) shows more ways to create an Azure Machine Learning workspace using SDK v2.

---

## Compute

A compute is a designated compute resource where you run your job or host your endpoint. Azure Machine Learning supports the following types of compute:

* **Compute cluster** - a managed-compute infrastructure that allows you to easily create a cluster of CPU or GPU compute nodes in the cloud.

    [!INCLUDE [serverless compute](./includes/serverless-compute.md)]

* **Compute instance** - a fully configured and managed development environment in the cloud. You can use the instance as a training or inference compute for development and testing. It's similar to a virtual machine on the cloud.
* **Inference cluster** - used to deploy trained machine learning models to Azure Kubernetes Service. You can create an Azure Kubernetes Service (AKS) cluster from your Azure Machine Learning workspace, or attach an existing AKS cluster.
* **Attached compute** - You can attach your own compute resources to your workspace and use them for training and inference.


### [Azure CLI](#tab/cli)

To create a compute using CLI v2, use the following command:

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```bash
az ml compute --file my_compute.yml
```

For more information, see [compute YAML schema](reference-yaml-overview.md#compute).


### [Python SDK](#tab/sdk)

To create a compute using Python SDK v2, you can use the following code:

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
cluster_basic = AmlCompute(
    name="basic-example",
    type="amlcompute",
    size="STANDARD_DS3_v2",
    location="westus",
    min_instances=0,
    max_instances=2,
    idle_time_before_scale_down=120,
)
ml_client.begin_create_or_update(cluster_basic)
```

This [Jupyter notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/resources/compute/compute.ipynb) shows more ways to create compute using SDK v2.

---

## Datastore

Azure Machine Learning datastores securely keep the connection information to your data storage on Azure, so you don't have to code it in your scripts. You can register and create a datastore to easily connect to your storage account, and access the data in your underlying storage service. The CLI v2 and SDK v2 support the following types of cloud-based storage services:

* Azure Blob Container
* Azure File Share
* Azure Data Lake
* Azure Data Lake Gen2

### [Azure CLI](#tab/cli)

To create a datastore using CLI v2, use the following command:

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```bash
az ml datastore create --file my_datastore.yml
```
For more information, see [datastore YAML schema](reference-yaml-overview.md#datastore).


### [Python SDK](#tab/sdk)

To create a datastore using Python SDK v2, you can use the following code:

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
blob_datastore1 = AzureBlobDatastore(
    name="blob-example",
    description="Datastore pointing to a blob container.",
    account_name="mytestblobstore",
    container_name="data-container",
    credentials={
        "account_key": "XXXxxxXXXxXXXXxxXXXXXxXXXXXxXxxXxXXXxXXXxXXxxxXXxxXXXxXxXXXxxXxxXXXXxxxxxXXxxxxxxXXXxXXX"
    },
)
ml_client.create_or_update(blob_datastore1)
```

This [Jupyter notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/resources/datastores/datastore.ipynb) shows more ways to create datastores using SDK v2.

---

## Model

Azure machine learning models consist of the binary file(s) that represent a machine learning model and any corresponding metadata. Models can be created from a local or remote file or directory. For remote locations `https`, `wasbs` and `azureml` locations are supported. The created model will be tracked in the workspace under the specified name and version. Azure Machine Learning supports three types of storage format for models:

* `custom_model`
* `mlflow_model`
* `triton_model`

### Creating a model

### [Azure CLI](#tab/cli)

To create a model using CLI v2, use the following command:

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```bash
az ml model create --file my_model.yml
```

For more information, see [model YAML schema](reference-yaml-model.md).


### [Python SDK](#tab/sdk)

To create a model using Python SDK v2, you can use the following code:

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
my_model = Model(
    path="model.pkl", # the path to where my model file is located
    type="custom_model", # can be custom_model, mlflow_model or triton_model
    name="my-model",
    description="Model created from local file.",
)

ml_client.models.create_or_update(my_model) # use the MLClient to connect to workspace and create/register the model
```

---

## Environment

Azure Machine Learning environments are an encapsulation of the environment where your machine learning task happens. They specify the software packages, environment variables, and software settings around your training and scoring scripts. The environments are managed and versioned entities within your Machine Learning workspace. Environments enable reproducible, auditable, and portable machine learning workflows across a variety of computes.

### Types of environment

Azure Machine Learning supports two types of environments: curated and custom.

Curated environments are provided by Azure Machine Learning and are available in your workspace by default. Intended to be used as is, they contain collections of Python packages and settings to help you get started with various machine learning frameworks. These pre-created environments also allow for faster deployment time. For a full list, see the [curated environments article](resource-curated-environments.md).

In custom environments, you're responsible for setting up your environment and installing packages or any other dependencies that your training or scoring script needs on the compute. Azure Machine Learning allows you to create your own environment using

* A docker image
* A base docker image with a conda YAML to customize further
* A docker build context

### Create an Azure Machine Learning custom environment

### [Azure CLI](#tab/cli)

To create an environment using CLI v2, use the following command:

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```bash
az ml environment create --file my_environment.yml
```
For more information, see [environment YAML schema](reference-yaml-environment.md).



### [Python SDK](#tab/sdk)

To create an environment using Python SDK v2, you can use the following code:

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
my_env = Environment(
    image="pytorch/pytorch:latest", # base image to use
    name="docker-image-example", # name of the model
    description="Environment created from a Docker image.",
)

ml_client.environments.create_or_update(my_env) # use the MLClient to connect to workspace and create/register the environment
```

This [Jupyter notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/assets/environment/environment.ipynb) shows more ways to create custom environments using SDK v2.

---

## Data

Azure Machine Learning allows you to work with different types of data:

* URIs (a location in local/cloud storage)
  * `uri_folder`
  * `uri_file`
* Tables (a tabular data abstraction)
  * `mltable`
* Primitives
  * `string`
  * `boolean`
  * `number`

For most scenarios, you'll use URIs (`uri_folder` and `uri_file`) - a location in storage that can be easily mapped to the filesystem of a compute node in a job by either mounting or downloading the storage to the node.

`mltable` is an abstraction for tabular data that is to be used for AutoML Jobs, Parallel Jobs, and some advanced scenarios. If you're just starting to use Azure Machine Learning and aren't using AutoML, we strongly encourage you to begin with URIs.

## Component

An Azure Machine Learning [component](concept-component.md) is a self-contained piece of code that does one step in a machine learning pipeline. Components are the building blocks of advanced machine learning pipelines. Components can do tasks such as data processing, model training, model scoring, and so on. A component is analogous to a function - it has a name, parameters, expects input, and returns output. 

## Next steps

* [How to upgrade from v1 to v2](how-to-migrate-from-v1.md)
* [Train models with the v2 CLI and SDK](how-to-train-model.md)
