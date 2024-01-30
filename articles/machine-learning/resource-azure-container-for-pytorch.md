---
title: Azure Container for PyTorch
titleSuffix: Azure Machine Learning
description: Azure Container for PyTorch (ACPT), a curated environment that includes the best of Microsoft technologies for training with PyTorch on Azure.
services: machine-learning
author: sheetalarkadam
ms.author: parinitarahi
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.custom: build-2023, build-2023-dataai
ms.topic: reference
ms.date: 03/20/2023
---

# Azure Container for PyTorch (ACPT)

Azure Container for PyTorch is a lightweight, standalone environment that includes needed components to effectively run optimized training for large models on Azure Machine Learning. The Azure Machine Learning [curated environments](resource-curated-environments.md) are available in the user’s workspace by default and are backed by cached Docker images that use the latest version of the Azure Machine Learning SDK. It helps with reducing preparation costs and faster deployment time. ACPT can be used to quickly get started with various deep learning tasks with PyTorch on Azure.

> [!NOTE]
> Use the [Python SDK](how-to-use-environments.md), [CLI](/cli/azure/ml/environment#az-ml-environment-list), or Azure Machine Learning [studio](how-to-manage-environments-in-studio.md) to get the full list of environments and their dependencies. For more information, see the [environments article](how-to-use-environments.md#use-a-curated-environment).

## Why should I use ACPT?

* Use as is with preinstalled packages or build on top of the curated environment.
* Optimized training framework to set up, develop, accelerate PyTorch model on large workloads.
* Up-to-date stack with the latest compatible versions of Ubuntu, Python, PyTorch, CUDA\RocM, etc.
* Ease of use: All components installed and validated against dozens of Microsoft workloads to reduce setup costs and accelerate time to value.
* Latest Training Optimization Technologies: [ONNX RunTime](https://onnxruntime.ai/) , [DeepSpeed](https://www.deepspeed.ai/),  [MSCCL](https://github.com/microsoft/msccl),and others.
* Integration with Azure Machine Learning: Track your PyTorch experiments on Azure Machine Learning studio or using the SDK.
* The image is also available as a [Data Science Virtual Machine (DSVM)](https://azure.microsoft.com/products/virtual-machines/data-science-virtual-machines/). To learn more about Data Science Virtual Machines, see [the DSVM overview documentation](data-science-virtual-machine/overview.md).
* Azure customer support reduces training and deployment latency.
* Improves training and deployment success rate.
* Avoid unnecessary image builds.
* Only have required dependencies and access right in the image/container.

>[!IMPORTANT]
> To view more information about curated environment packages and versions, visit the Environments tab in the Azure Machine Learning [studio](./how-to-manage-environments-in-studio.md).

## Supported configurations for Azure Container for PyTorch (ACPT)

**Description**: The Azure Curated Environment for PyTorch is our latest PyTorch curated environment. It's optimized for large, distributed deep learning workloads and comes prepackaged with the best of Microsoft technologies for accelerated training, for example, OnnxRuntime Training (ORT), DeepSpeed, MSCCL, etc.

The following configurations are supported:

| Environment Name | OS | GPU Version| Python Version | PyTorch Version | ORT-training Version | DeepSpeed Version | torch-ort Version | Nebula Version | 
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|acpt-pytorch-2.0-cuda11.7|Ubuntu 20.04|cu117|3.8|2.0.1|1.15.1|0.9.5 |1.15.0|0.16.5|
|acpt-pytorch-1.13-cuda11.7|Ubuntu 20.04|cu117|3.8|1.13.1|1.15.1|0.9.5|1.15.0|0.16.5|

Other packages like fairscale, horovod, msccl, protobuf, pyspark, pytest, pytorch-lightning, tensorboard, NebulaML, torchvision, torchmetrics to support all training needs

To learn more, see [Create custom ACPT curated environments](how-to-azure-container-for-pytorch-environment.md).

## Support

Version updates for supported environments, including the base images they reference, are released every two weeks to address vulnerabilities no older than 30 days. Based on usage, some environments may be deprecated (hidden from the product but usable) to support more common machine learning scenarios.
