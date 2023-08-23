---
title: Azure Machine Learning glossary
description: Glossary of terms for the Azure Machine Learning platform.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: build-2023
ms.topic: overview
author: frogglew
ms.author: saoh
ms.reviewer: sgilley
ms.date: 09/21/2022
monikerRange: 'azureml-api-2'
---
 
# Azure Machine Learning glossary

The Azure Machine Learning glossary is a short dictionary of terminology for the Azure Machine Learning platform. For the general Azure terminology, see also:

* [Microsoft Azure glossary: A dictionary of cloud terminology on the Azure platform](../azure-glossary-cloud-terminology.md)
* [Cloud computing terms](https://azure.microsoft.com/overview/cloud-computing-dictionary/) - General industry cloud terms.
* [Azure fundamental concepts](/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts) - Microsoft Cloud Adoption Framework for Azure.

## Component

An Azure Machine Learning [component](concept-component.md) is a self-contained piece of code that does one step in a machine learning pipeline. Components are the building blocks of advanced machine learning pipelines. Components can do tasks such as data processing, model training, model scoring, and so on. A component is analogous to a function - it has a name, parameters, expects input, and returns output. 


## Compute

A compute is a designated compute resource where you run your job or host your endpoint. Azure Machine Learning supports the following types of compute:

* **Compute cluster** - a managed-compute infrastructure that allows you to easily create a cluster of CPU or GPU compute nodes in the cloud. 

    [!INCLUDE [serverless compute](./includes/serverless-compute.md)]

* **Compute instance** - a fully configured and managed development environment in the cloud. You can use the instance as a training or inference compute for development and testing. It's similar to a virtual machine on the cloud.
* **Kubernetes cluster** - used to deploy trained machine learning models to Azure Kubernetes Service. You can create an Azure Kubernetes Service (AKS) cluster from your Azure Machine Learning workspace, or attach an existing AKS cluster.
* **Attached compute** - You can attach your own compute resources to your workspace and use them for training and inference.


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


## Datastore

Azure Machine Learning datastores securely keep the connection information to your data storage on Azure, so you don't have to code it in your scripts. You can register and create a datastore to easily connect to your storage account, and access the data in your underlying storage service. The CLI v2 and SDK v2 support the following types of cloud-based storage services:

* Azure Blob Container
* Azure File Share
* Azure Data Lake
* Azure Data Lake Gen2

## Environment

Azure Machine Learning environments are an encapsulation of the environment where your machine learning task happens. They specify the software packages, environment variables, and software settings around your training and scoring scripts. The environments are managed and versioned entities within your Machine Learning workspace. Environments enable reproducible, auditable, and portable machine learning workflows across various computes.

### Types of environment

Azure Machine Learning supports two types of environments: curated and custom.

Curated environments are provided by Azure Machine Learning and are available in your workspace by default. Intended to be used as is, they contain collections of Python packages and settings to help you get started with various machine learning frameworks. These pre-created environments also allow for faster deployment time. For a full list, see the [curated environments article](resource-curated-environments.md).

In custom environments, you're responsible for setting up your environment. Make sure to install the packages and any other dependencies that your training or scoring script needs on the compute. Azure Machine Learning allows you to create your own environment using

* A docker image
* A base docker image with a conda YAML to customize further
* A docker build context

## Model

Azure machine learning models consist of the binary file(s) that represent a machine learning model and any corresponding metadata. Models can be created from a local or remote file or directory. For remote locations `https`, `wasbs` and `azureml` locations are supported. The created model will be tracked in the workspace under the specified name and version. Azure Machine Learning supports three types of storage format for models:

* `custom_model`
* `mlflow_model`
* `triton_model`

## Workspace

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. The workspace keeps a history of all jobs, including logs, metrics, output, and a snapshot of your scripts. The workspace stores references to resources like datastores and compute. It also holds all assets like models, environments, components and data asset.

## Next steps

[What is Azure Machine Learning?](overview-what-is-azure-machine-learning.md)
