---
title: About Azure Machine Learning environments
titleSuffix: Azure Machine Learning
description: In this article, learn the advantages of machine learning environments, which enable reproducible, auditable, and portable machine learning dependency definitions across a variety of compute targets.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: trbye
author: trevorbye
ms.date: 01/06/2020
---

# What are Azure Machine Learning environments?
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

Azure Machine Learning environments specify the Python packages, environment variables, and software settings around your training and scoring scripts. They also specify run times (Python, Spark, or Docker). They are managed and versioned entities within your Machine Learning workspace that enable reproducible, auditable, and portable machine learning workflows across a variety of compute targets.

You can use an `Environment` object on your local compute to:
* Develop your training script.
* Reuse the same environment on Azure Machine Learning Compute for model training at scale.
* Deploy your model with that same environment.

The following diagram illustrates how you can use a single `Environment` object in both your run configuration, for training, and your inference and deployment configuration, for web service deployments.

![Diagram of an environment in machine learning workflow](./media/concept-environments/ml-environment.png)

## Types of environments

Environments can broadly be divided into three categories: *curated*, *user-managed*, and *system-managed*.

Curated environments are provided by Azure Machine Learning and are available in your workspace by default. They contain collections of Python packages and settings to help you get started with various machine learning frameworks. 

In user-managed environments, you're responsible for setting up your environment and installing every package that your training script needs on the compute target. Conda doesn't check your environment or install anything for you. If you're defining your own environment, you must list `azureml-defaults` with version `>= 1.0.45` as a pip dependency. This package contains the functionality that's needed to host the model as a web service.

You use system-managed environments when you want [Conda](https://conda.io/docs/) to manage the Python environment and the script dependencies for you. The service assumes this type of environment by default, because of its usefulness on remote compute targets that are not manually configurable.

## Create and manage environments

You can create environments by:

* Defining new `Environment` objects, either by using a curated environment or by defining your own dependencies.
* Using existing `Environment` objects from your workspace. This approach allows for consistency and reproducibility with your dependencies.
* Importing from an existing Anaconda environment definition.
* Using the Azure Machine Learning CLI

For specific code samples, see the "Create an environment" section of [Reuse environments for training and deployment](how-to-use-environments.md#create-an-environment). Environments are also easily managed through your workspace. They include the following functionality:

* Environments are automatically registered to your workspace when you submit an experiment. They can also be manually registered.
* You can fetch environments from your workspace to use for training or deployment, or to make edits to the environment definition.
* With versioning, you can see changes to your environments over time, which ensures reproducibility.
* You can build Docker images automatically from your environments.

For code samples, see the "Manage environments" section of [Reuse environments for training and deployment](how-to-use-environments.md#manage-environments).

## Environment building, caching and reuse

### Building environment as Docker image

Typically, when you first submit a run using an environment, the Environment Management service invokes an [ACR Build Task](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview) on the Azure Container Registry (ACR) associated with the Workspace. The built Docker image is then cached on the Workspace ACR, and pulled to the compute target executing the run.

The image build consists of two steps

 1. Downloading the base image, and executing any Docker steps
 2. Building a conda environment according to conda dependencies specified in the environment definition.

The second step is omitted if you specify user-managed dependencies. In this case you're responsible for installing any Python packages, by including them in your base image, or specifying custom Docker steps within first step. You're also responsible for specifying the correct location for Python executable.

### Image caching and reuse

If you use the same environment definition for another run, the Environment Management service pulls the cached image from Workspace ACR to the compute target, and re-uses it. 

To determine whether to re-use a cached image or build a new one, the Environment Management service computes a hash value from the environment definition and compares it to the hashes of existing environments. The hash is based on:
 
 * Base image property value
 * Custom docker steps property value
 * List of Python packages in Conda definition
 * List of packages in Spark definition 

The hash does not depend on environment name or version, or environment variables values. Following diagram illustrates how two environments with different name and version, but identical base image and Python packages have the same hash and therefore correspond to the same cached image. The third environment has different Python packages and versions, and therefore corresponds to a different cached image.

![Diagram of environment caching as Docker images](./media/concept-environments/environment_caching.png)

For example, following changes on environment definition will change the hash value, and result in an image rebuild:

 * Adding or removing a Python package
 * Changing a pinned package version, for example ```numpy==0.15``` to ```numpy==0.16```

Following operations will not change the hash value, and will result in a cached image being used:
 
 * Renaming an environment
 * Creating a new environment whose properties and Python package list exactly matches an existing environment.
 * Changing an environment variable.

Note also that if you create an environment with unpinned package dependency, for example ```numpy```, that environment will keep using the package version installed at the time of environment creation. To update the package, specify a version number.

## Next steps

* Learn how to [create and use environments](how-to-use-environments.md) in Azure Machine Learning.
* See the Python SDK reference documentation for the [environment class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py).
* See the R SDK reference documentation for [environments](https://azure.github.io/azureml-sdk-for-r/reference/index.html#section-environments).
