---
title: Use software environments CLI v1
titleSuffix: Azure Machine Learning
description: Create and manage environments for model training and deployment with CLI v1. Manage Python packages and other settings for the environment.
author: ositanachi  
ms.author: osiotugo 
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: core
ms.date: 04/19/2022
ms.topic: how-to
ms.custom: UpdateFrequency5, devx-track-python, cliv1, event-tier1-build-2022
ms.devlang: azurecli
---

# Create & use software environments in Azure Machine Learning with CLI v1

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]


In this article, learn how to create and manage Azure Machine Learning [environments](/python/api/azureml-core/azureml.core.environment.environment) using CLI v1. Use the environments to track and reproduce your projects' software dependencies as they evolve. The [Azure Machine Learning CLI](reference-azure-machine-learning-cli.md) v1 mirrors most of the functionality of the Python SDK v1. You can use it to create and manage environments.

Software dependency management is a common task for developers. You want to ensure that builds are reproducible without extensive manual software configuration. The Azure Machine Learning `Environment` class accounts for local development solutions such as pip and Conda and distributed cloud development through Docker capabilities.

For a high-level overview of how environments work in Azure Machine Learning, see [What are ML environments?](../concept-environments.md) For information about managing environments in the Azure Machine Learning studio, see [Manage environments in the studio](../how-to-manage-environments-in-studio.md). For information about configuring development environments, see [Set up a Python development environment for Azure Machine Learning](how-to-configure-environment.md).

## Prerequisites

* An [Azure Machine Learning workspace](../quickstart-create-resources.md)

[!INCLUDE [cli-version-info](../includes/machine-learning-cli-v1-deprecation.md)]

## Scaffold an environment

The following command scaffolds the files for a default environment definition in the specified directory. These files are JSON files. They work like the corresponding class in the SDK. You can use the files to create new environments that have custom settings. 

```azurecli-interactive
az ml environment scaffold -n myenv -d myenvdir
```

## Register an environment

Run the following command to register an environment from a specified directory:

```azurecli-interactive
az ml environment register -d myenvdir
```

## List environments

Run the following command to list all registered environments:

```azurecli-interactive
az ml environment list
```

## Download an environment

To download a registered environment, use the following command:

```azurecli-interactive
az ml environment download -n myenv -d downloaddir
```

## Next steps

* After you have a trained model, learn [how and where to deploy models](how-to-deploy-and-where.md).
* View the [`Environment` class SDK reference](/python/api/azureml-core/azureml.core.environment%28class%29).
