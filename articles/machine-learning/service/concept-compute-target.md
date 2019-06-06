---
title: Compute targets
titleSuffix: Azure Machine Learning service
description: A compute target lets you to specify the compute resource where you run your training script or host your service deployment. This location may be your local machine or a cloud-based compute resource.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sgilley
author: sdgilley
ms.date: 05/30/2019
# As a data scientist, I want to understand what a compute target is and why I need it.
---

#  What is a compute target in Azure Machine Learning service? 

A compute target lets you to specify the compute resource where you run your training script or host your service deployment. This location may be your local machine or a cloud-based compute resource.

Compute targets make it easy to change your compute environment without changing your code.  A typical model development lifecycle:

* Start with dev/experimentation on a small amount of data. At this stage, we recommend using a local environment. For example, your local computer or a cloud-based VM.
* Scale up your training on larger data sets, or do distributed training using one of the [training targets](#train).  
* Deploy to several web hosting environments, or to IoT devices using one of the [deployment targets](#deploy).

The compute resources you use for your compute targets are attached to a [workspace](concept-workspace.md). Compute resources other than the local machine are shared by users of the workspace.

## <a name="train"></a> Training targets

Azure Machine Learning service has varying support across different compute resources.  You can also attach your own compute resource, although support for various scenarios may vary as detailed below:

[!INCLUDE [aml-compute-target-train](../../../includes/aml-compute-target-train.md)]


## <a name="deploy"></a>Deployment targets

The following compute resources can be used to host your model deployment.

[!INCLUDE [aml-compute-target-deploy](../../../includes/aml-compute-target-deploy.md)]


## Managed compute

A managed compute resource is created and managed by Azure Machine Learning service. This compute is optimized for machine learning workloads. Azure Machine Learning Compute is the only managed compute as of May 30, 2019. Additional managed compute resources may be added in the future.

### <a name="amlcompute"></a> Azure Machine Learning Compute

You can use Azure Machine Learning Compute for training and for batch inferencing (Preview).  With this compute resource, you have:

* Single- or multi-node cluster
* Autoscales each time you submit a run 
* Automatic cluster management and job scheduling 
* Support for both CPU and GPU resources

You can create Azure Machine Learning Compute instances with any of the following:

* The Azure portal
* The Azure Machine Learning SDK
* The Azure CLI

All other compute resources must be created outside the workspace and then attached to it.

## Unmanaged compute

An unmanaged compute resource is *not* managed by Azure Machine Learning service. You create this type of compute outside Azure Machine Learning, then attach it to your workspace. Unmanaged compute resources can require additional steps for you to maintain or to improve performance for machine learning workloads.

## Next steps

* [Set up compute targets for model training](how-to-set-up-training-targets.md)
* [Deploy models with the Azure Machine Learning service](how-to-deploy-and-where.md)