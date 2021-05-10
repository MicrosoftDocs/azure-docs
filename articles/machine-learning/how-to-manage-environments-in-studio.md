---
title: Manage environments in the studio
titleSuffix: Azure Machine Learning
description: Learn how to create and manage environments in the Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: saachigopal
ms.author:  sagopal
ms.date: 5/10/2021
ms.topic: how-to
ms.custom: devx-track-python
---

# Manage software environments in Azure Machine Learning studio

In this article, learn how to create and manage Azure Machine Learning [environments](/python/api/azureml-core/azureml.core.environment.environment) in the Azure Machine Learning studio. Use the environments to track and reproduce your projects' software dependencies as they evolve.

The examples in this article show how to:

* Browse curated environments.
* Create an environment and specify package dependencies.
* Edit an existing environment specification and its properties.
* Rebuild an environment and view image build logs.

For a high-level overview of how environments work in Azure Machine Learning, see [What are ML environments?](concept-environments.md) For information about configuring development environments, see [here](how-to-configure-environment.md).


## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://aka.ms/AMLFree) before you begin.
* An [Azure Machine Learning workspace](how-to-manage-workspace.md)

## Browse curated environments

Curated environments contain collections of Python packages and are available in your workspace by default. These environments are backed by cached Docker images which reduces the run preparation cost. 

Click on an environment to see detailed information about its contents.

    :::image type="content" source="media/how-to-manage-environments-in-studio/curated-env.png" alt-text="Browse curated environments":::

## Create an environment

To create an environment
1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com).
1. On the left side, select **Environments**.
1. Select 
1. Select



