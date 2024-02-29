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

The Azure Machine Learning glossary is a short dictionary of terminology for the Machine Learning platform. For general Azure terminology, see also:

* [Microsoft Azure glossary: A dictionary of cloud terminology on the Azure platform](../azure-glossary-cloud-terminology.md)
* [Cloud computing terms](https://azure.microsoft.com/overview/cloud-computing-dictionary/): General industry cloud terms
* [Azure fundamental concepts](/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts): Microsoft Cloud Adoption Framework for Azure

## Component

A Machine Learning [component](concept-component.md) is a self-contained piece of code that does one step in a machine learning pipeline. Components are the building blocks of advanced machine learning pipelines. Components can do tasks such as data processing, model training, and model scoring. A component is analogous to a function. It has a name and parameters, expects input, and returns output.

## Compute

A compute is a designated compute resource where you run your job or host your endpoint. Machine Learning supports the following types of compute:

* **Compute cluster**: A managed-compute infrastructure that you can use to easily create a cluster of CPU or GPU compute nodes in the cloud.

    [!INCLUDE [serverless compute](./includes/serverless-compute.md)]

* **Compute instance**: A fully configured and managed development environment in the cloud. You can use the instance as a training or inference compute for development and testing. It's similar to a virtual machine in the cloud.
* **Kubernetes cluster**: Used to deploy trained machine learning models to Azure Kubernetes Service (AKS). You can create an AKS cluster from your Machine Learning workspace or attach an existing AKS cluster.
* **Attached compute**: You can attach your own compute resources to your workspace and use them for training and inference.

## Data

Machine Learning allows you to work with different types of data:

* URIs (a location in local or cloud storage):
  * `uri_folder`
  * `uri_file`
* Tables (a tabular data abstraction):
  * `mltable`
* Primitives:
  * `string`
  * `boolean`
  * `number`

For most scenarios, you use URIs (`uri_folder` and `uri_file`) to identify a location in storage that can be easily mapped to the file system of a compute node in a job by either mounting or downloading the storage to the node.

The `mltable` parameter is an abstraction for tabular data that's used for automated machine learning (AutoML) jobs, parallel jobs, and some advanced scenarios. If you're starting to use Machine Learning and aren't using AutoML, we strongly encourage you to begin with URIs.

## Datastore

Machine Learning datastores securely keep the connection information to your data storage on Azure so that you don't have to code it in your scripts. You can register and create a datastore to easily connect to your storage account and access the data in your underlying storage service. The Azure Machine Learning CLI v2 and SDK v2 support the following types of cloud-based storage services:

* Azure Blob Storage container
* Azure Files share
* Azure Data Lake Storage
* Azure Data Lake Storage Gen2

## Environment

Machine Learning environments are an encapsulation of the environment where your machine learning task happens. They specify the software packages, environment variables, and software settings around your training and scoring scripts. The environments are managed and versioned entities within your Machine Learning workspace. Environments enable reproducible, auditable, and portable machine learning workflows across various computes.

### Types of environment

Machine Learning supports two types of environments: curated and custom.

Curated environments are provided by Machine Learning and are available in your workspace by default. They're intended to be used as is. They contain collections of Python packages and settings to help you get started with various machine learning frameworks. These precreated environments also allow for faster deployment time. For a full list, see [Azure Machine Learning curated environments](resource-curated-environments.md).

In custom environments, you're responsible for setting up your environment. Make sure to install the packages and any other dependencies that your training or scoring script needs on the compute. Machine Learning allows you to create your own environment by using:

* A Docker image.
* A base Docker image with a conda YAML to customize further.
* A Docker build context.

## Model

Machine Learning models consist of the binary files that represent a machine learning model and any corresponding metadata. You can create models from a local or remote file or directory. For remote locations, `https`, `wasbs`, and `azureml` locations are supported. The created model is tracked in the workspace under the specified name and version. Machine Learning supports three types of storage format for models:

* `custom_model`
* `mlflow_model`
* `triton_model`

## Workspace

The workspace is the top-level resource for Machine Learning. It provides a centralized place to work with all the artifacts you create when you use Machine Learning. The workspace keeps a history of all jobs, including logs, metrics, output, and a snapshot of your scripts. The workspace stores references to resources like datastores and compute. It also holds all assets like models, environments, components, and data assets.

## Next steps

[What is Azure Machine Learning?](overview-what-is-azure-machine-learning.md)
