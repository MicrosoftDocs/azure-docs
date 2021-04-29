---
title: Curated environments
titleSuffix: Azure Machine Learning
description: Learn about Azure Machine Learning curated environments, a set of pre-configured environments that help reduce experiment and deployment preparation times.
services: machine-learning
author: luisquintanilla
ms.author: luquinta
ms.reviewer: luquinta
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.date: 4/2/2021
---

# Azure Machine Learning Curated Environments

This article lists the curated environments in Azure Machine Learning. Curated environments are provided by Azure Machine Learning and are available in your workspace by default. They are backed by cached Docker images that use the latest version of the Azure Machine Learning SDK, reducing the run preparation cost and allowing for faster deployment time. Use these environments to quickly get started with various machine learning frameworks.

> [!NOTE]
> This list is updated as of April 2021. Use the Python SDK or CLI to get the most updated list of environments and their dependencies. For more information, see the [environments article](./how-to-use-environments.md#use-a-curated-environment). Following the release of this new set, previous curated environments will be hidden but can still be used. 

## PyTorch
- AzureML-Pytorch1.7-Cuda11-OpenMpi4.1.0-py36
     - An environment for deep learning with PyTorch containing the Azure ML SDK and additional python packages.
     - PyTorch version: 1.7
     - Python version: 3.6.9
     - Base image: mcr.microsoft.com/azureml/openmpi4.1.0-cuda11.0.3-cudnn8-ubuntu18.04
     - CUDA version: 11.0.3
     - OpenMPI: 4.1.0

## Scikit
- AzureML-Scikit-learn0.20.4-Cuda11-OpenMpi4.1.0-py36
     - An environment for tasks such as regression, clustering, and classification with Scikit-learn. Contains the Azure ML SDK and additional python packages.
     - Scikit-learn version: 20.4
     - Python version: 3.6.9
     - Base image: mcr.microsoft.com/azureml/openmpi4.1.0-cuda11.0.3-cudnn8-ubuntu18.04
     - CUDA version: 11.0.3
     - OpenMPI: 4.1.0

## TensorFlow
- AzureML-TensorFlow2.4-Cuda11-OpenMpi4.1.0-py36
     - An environment for deep learning with Tensorflow containing the Azure ML SDK and additional python packages.
     - Tensorflow version: 2.4
     - Python version: 3.6.9
     - Base image: mcr.microsoft.com/azureml/openmpi4.1.0-cuda11.0.3-cudnn8-ubuntu18.04
     - CUDA version: 11.0.3
     - OpenMPI: 4.1.0
