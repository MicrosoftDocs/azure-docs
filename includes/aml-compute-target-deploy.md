---
title: "include file"
description: "include file"
services: machine-learning
author: sdgilley
ms.service: machine-learning
ms.author: sgilley
manager: cgronlund
ms.custom: "include file"
ms.topic: "include"
ms.date: 10/21/2021
---


The compute target you use to host your model will affect the cost and availability of your deployed endpoint. Use this table to choose an appropriate compute target.

| Compute target | Used for | GPU support | Description |
| ----- | ----- | ----- | ----- | 
| [Local&nbsp;web&nbsp;service](../articles/machine-learning/v1/how-to-deploy-local-container-notebook-vm.md) | Testing/debugging |  &nbsp; | Use for limited testing and troubleshooting. Hardware acceleration depends on use of libraries in the local system.
| [Azure Machine Learning Kubernetes](../articles/machine-learning/how-to-attach-kubernetes-anywhere.md) | Real-time inference <br/><br/> Batch inference | Yes | Run inferencing workloads on on-premises, cloud, and edge Kubernetes clusters. |  
| [Azure Container Instances](../articles/machine-learning/v1/how-to-deploy-azure-container-instance.md) | Real-time inference <br/><br/> Recommended for dev/test purposes only.| &nbsp;  | Use for low-scale CPU-based workloads that require less than 48 GB of RAM. Doesn't require you to manage a cluster. <br/><br/> Supported in the designer. |
| [Azure Machine Learning compute clusters](../articles/machine-learning/tutorial-pipeline-batch-scoring-classification.md) | Batch&nbsp;inference | [Yes](../articles/machine-learning/tutorial-pipeline-batch-scoring-classification.md) (machine learning pipeline) |  Run batch scoring on serverless compute. Supports normal and low-priority VMs. No support for real-time inference.|

> [!NOTE]
> Although compute targets like local, and Azure Machine Learning compute clusters support GPU for training and experimentation, using GPU for inference _when deployed as a web service_ is supported only on Azure Machine Learning Kubernetes.
>
> Using a GPU for inference _when scoring with a machine learning pipeline_ is supported only on Azure Machine Learning compute.
> 
> When choosing a cluster SKU, first scale up and then scale out. Start with a machine that has 150% of the RAM your model requires, profile the result and find a machine that has the performance you need. Once you've learned that, increase the number of machines to fit your need for concurrent inference.

> [!NOTE]
> * Container instances are suitable only for small models less than 1 GB in size.
