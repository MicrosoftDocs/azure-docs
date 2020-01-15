---
title: 'What are ML Environments'
titleSuffix: Azure Machine Learning
description: In this article, learn the advantages of machine learning environments, that enable reproducible, auditable, and portable machine learning dependency definitions across different compute targets.
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

Environments specify the Python packages, environment variables, and software settings around your training and scoring scripts, and run times (Python, Spark, or Docker). They are managed and versioned entities within your Azure Machine Learning workspace that enable reproducible, auditable, and portable machine learning workflows across different compute targets.

You can use an environment object on your local compute to develop your training script, reuse that same environment on Azure Machine Learning Compute for model training at scale, and even deploy your model with that same environment.

The following illustrates that the same environment object can be used in both your run configuration for training and in your inference and deployment configuration for web service deployments.

![Diagram of environment in machine learning workflow](./media/concept-environments/ml-environment.png)

## Types of environments

Environments can broadly be divided into three categories: **curated**, **user-managed** and **system-managed**.

Curated environments are provided by Azure Machine Learning and are available in your workspace by default. They contain collections of Python packages and settings to help you get started different machine learning frameworks. 

For a user-managed environment, you're responsible for setting up your environment and installing every package your training script needs on the compute target. Conda will not check your environment or install anything for you. Please note that if you are defining your own environment, you must list `azureml-defaults` with version `>= 1.0.45` as a pip dependency. This package contains the functionality needed to host the model as a web service.

System-managed environments are used when you want [Conda](https://conda.io/docs/) to manage the Python environment and the script dependencies for you. The service assumes this type of environment by default, due to its usefulness on remote compute targets that are not manually configurable.

## Creating and managing environments

Environments can be created by:

* Defining new `Environment` objects, either using a curated environment or by defining your own dependencies
* Using existing `Environment` objects from your workspace. This allows for consistency and reproducibility with your dependencies
* Importing from an existing Anaconda environment definition.
* Using the Azure Machine Learning CLI

See the [how-to](how-to-use-environments.md#create-an-environment) for specific code examples. Environments are also easily managed through your workspace and include the following functionality:

* Environments are automatically registered to your workspace when you submit an experiment. They can also be manually registered
* Fetch environments from your workspace, and use them for training, deployment, or make edits to the environment definition
* Versioning allows you to see changes to your environments over time, and ensures reproducibility
* Build Docker images automatically from your environments

See the [manage environments](how-to-use-environments.md#manage-environments) section of the how-to for code samples.

## Next steps

* Learn how-to [create and use environments](how-to-use-environments.md) in Azure Machine Learning
* See the Python SDK reference docs for the [environment class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py).
* See the R SDK reference docs for [environments](https://azure.github.io/azureml-sdk-for-r/reference/index.html#section-environments).