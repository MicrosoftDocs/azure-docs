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
ms.date: 12/22/2020
---

# Azure Machine Learning Curated Environments

This article lists the curated environments in Azure Machine Learning. Curated environments are provided by Azure Machine Learning and are available in your workspace by default. They are backed by cached Docker images that use the latest version of the Azure Machine Learning SDK, reducing the run preparation cost and allowing for faster deployment time. Use these environments to quickly get started with various machine learning frameworks.

> [!NOTE]
> This list is updated as of April 2021. Use the Python SDK to get the most updated list of environments and their dependencies. For more information, see the [environments article](./how-to-use-environments.md#use-a-curated-environment). Upon release of the new set of curated environments, previous ones have been hidden in the product but can still be used. 

## Minimal

- AzureML-Minimal

## PyTorch
- AzureML-Pytorch1.7-Cuda11-OpenMpi4.1.0-py36
     - Version: 1.7
     - Base image: mcr.microsoft.com/azureml/openmpi4.1.0-cuda11.0.3-cudnn8-ubuntu18.04
     - CUDA: 11
     - OpenMPI: 4.1.0
     - Dependencies:
        - python
        - pip
        - pytorch
        - torchvision
        - torchaudio
        - cudatoolkit
        - nvidia-apex
        - azureml-core
        - azureml-defaults
        - azureml-mlflow
        - azureml-telemetry
        - azureml-train-restclients-hyperdrive
        - azureml-train-core
        - matplotlib
        - psutil
        - tqdm
        - pandas
        - theano
        - scipy
        - numpy
        - tensorboard
        - horovod
        - onnxruntime-gpu
        - future
        - deepspeed


## Scikit

- AzureML-Scikit-learn-0.20.3

## TensorFlow

- AzureML-TensorFlow-1.10-CPU

## Triton

- AzureML-Triton

## Tutorial

- AzureML-Tutorial

## VowpalWabbit

- AzureML-VowpalWabbit-8.8.0
