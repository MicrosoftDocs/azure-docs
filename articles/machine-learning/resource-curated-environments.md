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
> To view more information about curated environment packages and versions, visit the Environments tab in the Azure Machine Learning [studio](./how-to-manage-environments-in-studio.md).

## Curated environments

### Azure Container for PyTorch (ACPT)

**Description**: Recommended environment for Deep Learning with PyTorch on Azure. It contains the Azure Machine Learning SDK with the latest compatible versions of Ubuntu, Python, PyTorch, CUDA\RocM, and NebulaML. It also provides optimizers like ORT Training, +DeepSpeed+MSCCL+ORT MoE, and checkpointing using NebulaML and more.

To learn more, see [Azure Container for PyTorch (ACPT)](resource-azure-container-for-pytorch.md).

> [!NOTE]
> Currently, due to underlying cuda and cluster incompatibilities, on [NC series](../virtual-machines/nc-series.md) only acpt-pytorch-1.11-cuda11.3 with cuda 11.3 and torch 1.11 can be used.

### PyTorch

**Name**: AzureML-pytorch-1.10-ubuntu18.04-py38-cuda11-gpu  
**Description**: An environment for deep learning with PyTorch containing the Azure Machine Learning Python SDK and other Python packages.  
* GPU: Cuda11
* OS: Ubuntu18.04
* PyTorch: 1.10

Other available PyTorch environments:
* AzureML-pytorch-1.9-ubuntu18.04-py37-cuda11-gpu  
* AzureML-pytorch-1.8-ubuntu18.04-py37-cuda11-gpu
* AzureML-pytorch-1.7-ubuntu18.04-py37-cuda11-gpu


### LightGBM

**Name**: AzureML-lightgbm-3.2-ubuntu18.04-py37-cpu  
**Description**: An environment for machine learning with Scikit-learn, LightGBM, XGBoost, Dask containing the Azure Machine Learning Python SDK and other packages.  
* OS: Ubuntu18.04
* Dask: 2021.6
* LightGBM: 3.2
* Scikit-learn: 0.24
* XGBoost: 1.4


### Sklearn
**Name**: AzureML-sklearn-1.0-ubuntu20.04-py38-cpu  
**Description**: An environment for tasks such as regression, clustering, and classification with Scikit-learn. Contains the Azure Machine Learning Python SDK and other Python packages.  
* OS: Ubuntu20.04
* Scikit-learn: 1.0

Other available Sklearn environments:
* AzureML-sklearn-0.24-ubuntu18.04-py37-cpu


### TensorFlow

**Name**: AzureML-tensorflow-2.4-ubuntu18.04-py37-cuda11-gpu  
**Description**: An environment for deep learning with TensorFlow containing the Azure Machine Learning Python SDK and other Python packages.  
* GPU: Cuda11
* Horovod: 2.4.1
* OS: Ubuntu18.04
* TensorFlow: 2.4


## Automated ML (AutoML)

Azure Machine Learning pipeline training workflows that use AutoML automatically selects a curated environment based on the compute type and whether DNN is enabled. AutoML provides the following curated environments:

| Name | Compute Type | DNN enabled |
| --- | --- | --- |
|AzureML-AutoML | CPU | No |
|AzureML-AutoML-DNN | CPU | Yes |
| AzureML-AutoML-GPU | GPU | No |
| AzureML-AutoML-DNN-GPU | GPU | Yes |

For more information on AutoML and Azure Machine Learning pipelines, see [use automated ML in an Azure Machine Learning pipeline in Python SDK v1](v1/how-to-use-automlstep-in-pipelines.md).

## Support
Version updates for supported environments, including the base images they reference, are released every quarter to address vulnerabilities. Based on usage, some environments may be deprecated (hidden from the product but usable) to support more common machine learning scenarios.
