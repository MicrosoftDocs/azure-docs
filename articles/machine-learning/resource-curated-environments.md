---
title: Curated environments
titleSuffix: Azure Machine Learning
description: Learn about Azure Machine Learning curated environments, a set of pre-configured environments that help reduce experiment and deployment preparation times.
services: machine-learning
author: ssalgadodev
ms.author: osiotugo
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.date: 09/10/2023
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Azure Machine Learning Curated Environments

This article lists the curated environments with latest framework versions in Azure Machine Learning. Curated environments are provided by Azure Machine Learning and are available in your workspace by default. The curated environments rely on cached Docker images that use the latest version of the Azure Machine Learning SDK. Using a curated environment can reduce the run preparation cost and allow for faster deployment time. Use these environments to quickly get started with various machine learning frameworks.

> [!NOTE]
> Use the [Python SDK](how-to-use-environments.md), [CLI](/cli/azure/ml/environment#az-ml-environment-list), or Azure Machine Learning [studio](how-to-manage-environments-in-studio.md) to get the full list of environments and their dependencies. For more information, see the [environments article](how-to-use-environments.md#use-a-curated-environment).


## Why should I use curated environments?

* Reduces training and deployment latency.
* Improves training and deployment success rate.
* Avoid unnecessary image builds.
* Only have required dependencies and access right in the image/container.

>[!IMPORTANT]
> For more information about curated environment packages and versions, see [How to manage environments in the Azure Machine Learning studio](./how-to-manage-environments-in-studio.md).

