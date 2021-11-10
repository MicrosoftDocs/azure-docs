---
title: GPU-accelerated pools
description: Introduction to GPUs inside Synapse Analytics.
services: synapse-analytics
author: midesa
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: spark
ms.date: 11/10/2021
ms.author: midesa
---

# GPU-accelerated Apache Spark pools in Azure Synapse Analytics

Azure Synapse Analytics now supports Apache Spark pools accelerated with graphics processing units (GPUs). 

By leveraging NVIDIA GPUs, data scientists and engineers can reduce the time necessary to run data integration pipelines, score machine learning models, and more. This article describes how GPU-accelerated pools can be created and used with Azure Synapse Analytics. This article also details the GPU drivers and libraries that are pre-installed as part of the GPU-accelerated runtime.

> [!NOTE]
> Azure Synapse GPU-enabled pools are currently in Public Preview.

## Create a GPU-accelerated pool
To simplify the process for creating and managing pools, Azure Synapse takes care of pre-installing low-level libraries and setting up all the complex networking requirements between compute nodes. This integration allows users to get started with GPU- accelerated pools within just a few minutes. To learn more about how to create a GPU-accelerated pool, you can visit the quickstart on how to [create a GPU-accelerated pool](../quickstart-create-apache-gpu-pool-portal.md).

> [!NOTE]
>  - GPU-accelerated pools can be created in workspaces located in East US, Australia East, and North Europe.
>  - GPU-accelerated pools are only availble with the Apache Spark 3 runtime.
>  - You might need to request a [limit increase](./apache-spark-rapids-gpu.md#quotas-and-resource-constraints-in-azure-synapse-gpu-enabled-pools) in order to create GPU-enabled clusters. 

## GPU-accelerated Runtime

### NVIDIA GPU driver, CUDA, and cuDNN
Azure Synapse Analytics now offers GPU-accelerated Apache Spark pools pools, which include various NVIDIA libraries and configurations. By default, Azure Synapse Analytics installs the NVIDIA driver and libraries required to use GPUs on Spark driver and worker instances:
 - CUDA 11.2
 - libnccl2=2.8.4
 - libnccl-dev=2.8.4
 - libcudnn8=8.1.1 
 - libcudnn8-dev=8.1.1

> [!NOTE]
> This software contains source code provided by NVIDIA Corporation. Specifically, to support the GPU-accelerated pools, Azure Synapse Apache Spark pools include code from [CUDA Samples](https://docs.nvidia.com/cuda/eula/#nvidia-cuda-samples-preface).

### NVIDIA End User License Agreement (EULA)
When you select a GPU-accelerated Hardware option in Synapse Spark, you implicitly agree to the terms and conditions outlined in the [NVIDIA EULA](https://docs.databricks.com/_static/documents/nvidia-cloud-end-user-license-agreement_clean.pdf) with respect to:
  - CUDA 11.2: [EULA :: CUDA Toolkit Documentation (nvidia.com)](https://docs.nvidia.com/cuda/eula/index.html)
  - libnccl2=2.8.4: [nccl/LICENSE.txt at master · NVIDIA/nccl (github.com)](https://github.com/NVIDIA/nccl/blob/master/LICENSE.txt)
  - libnccl-dev=2.8.4: [nccl/LICENSE.txt at master · NVIDIA/nccl (github.com)](https://github.com/NVIDIA/nccl/blob/master/LICENSE.txt)
  - libcudnn8=8.1.1: [Software License Agreement :: NVIDIA Deep Learning cuDNN Documentation](https://docs.nvidia.com/deeplearning/cudnn/sla/index.html)
  - libcudnn8-dev=8.1.1: [Software License Agreement :: NVIDIA Deep Learning cuDNN Documentation](https://docs.nvidia.com/deeplearning/cudnn/sla/index.html)
  - The CUDA, NCCL, and cuDNN libraries, and the [NVIDIA End User License Agreement (with NCCL Supplement)](https://docs.nvidia.com/deeplearning/nccl/sla/index.html#overview) for the NCCL library

## Next steps
- [Azure Synapse Analytics](overview-what-is.md)
