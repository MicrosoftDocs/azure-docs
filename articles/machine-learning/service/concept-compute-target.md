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

#  What are compute targets in Azure Machine Learning service? 

A **compute target** is a designated compute resource/environment where you run your training script or host your service deployment. This location may be your local machine or a cloud-based compute resource. Using compute targets make it easy for you to later change your compute environment without having to change your code.  

In a typical model development lifecycle, you might:
1. Start by developing and experimenting on a small amount of data. At this stage, we recommend your local environment (local computer or cloud-based VM) as your compute target. 
2. Scale up to larger data, or do distributed training using one of these [training compute targets](#train).  
3. Once your model is ready, deploy it to a web hosting environment or IoT device with one of these [deployment compute targets](#deploy).

The compute resources you use for your compute targets are attached to a [workspace](concept-workspace.md). Compute resources other than the local machine are shared by users of the workspace.

## <a name="train"></a> Training compute targets

Azure Machine Learning service has varying support across different compute resources.  You can also attach your own compute resource, although support for various scenarios may vary.

[!INCLUDE [aml-compute-target-train](../../../includes/aml-compute-target-train.md)]


## <a name="deploy"></a>Deployment compute targets

The following compute resources can be used to host your model deployment.

[!INCLUDE [aml-compute-target-deploy](../../../includes/aml-compute-target-deploy.md)]

<a name="amlcompute"></a>
## Azure Machine Learning compute (managed)

A managed compute resource is created and managed by Azure Machine Learning service. This type of compute is optimized for machine learning workloads.  You can use Azure Machine Learning (managed) Compute for training and batch inferencing.  With this compute resource, you have:

* Single- or multi-node cluster
* Autoscales each time you submit a run 
* Automatic cluster management and job scheduling 
* Support for both CPU and GPU resources

You can create Azure Machine Learning Compute instances in Azure portal, with the SDK, or with the CLI. When created it is automatically part of your workspace unlike other kinds of compute targets.

## Unmanaged compute

An unmanaged compute target is *not* managed by Azure Machine Learning service. You create this type of compute target outside Azure Machine Learning, then attach it to your workspace. Unmanaged compute resources can require additional steps for you to maintain or to improve performance for machine learning workloads.

## Next steps

* [Set up compute targets for model training](how-to-set-up-training-targets.md)
* [Deploy models with the Azure Machine Learning service](how-to-deploy-and-where.md)
