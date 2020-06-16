---
title: What are compute targets
titleSuffix: Azure Machine Learning
description: Define where you want to train or deploy your model with Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sgilley
author: sdgilley
ms.date: 03/30/2020
# As a data scientist, I want to understand what a compute target is and why I need it.
---

#  What are compute targets in Azure Machine Learning? 

A **compute target** is a designated compute resource/environment where you run your training script or host your service deployment. This location may be your local machine or a cloud-based compute resource. Using compute targets make it easy for you to later change your compute environment without having to change your code.  

In a typical model development lifecycle, you might:
1. Start by developing and experimenting on a small amount of data. At this stage, we recommend your local environment (local computer or cloud-based VM) as your compute target. 
2. Scale up to larger data, or do distributed training using one of these [training compute targets](#train).  
3. Once your model is ready, deploy it to a web hosting environment or IoT device with one of these [deployment compute targets](#deploy).

The compute resources you use for your compute targets are attached to a [workspace](concept-workspace.md). Compute resources other than the local machine are shared by users of the workspace.

## <a name="train"></a> Training compute targets

Azure Machine Learning has varying support across different compute resources.  You can also attach your own compute resource, although support for various scenarios may vary.

[!INCLUDE [aml-compute-target-train](../../includes/aml-compute-target-train.md)]

Learn more about [setting up and using a compute target for model training](how-to-set-up-training-targets.md).

## <a name="deploy"></a>Deployment targets

The following compute resources can be used to host your model deployment.

[!INCLUDE [aml-compute-target-deploy](../../includes/aml-compute-target-deploy.md)]

Learn [where and how to deploy your model to a compute target](how-to-deploy-and-where.md).

<a name="amlcompute"></a>
## Azure Machine Learning compute (managed)

A managed compute resource is created and managed by Azure Machine Learning. This compute is optimized for machine learning workloads. Azure Machine Learning compute clusters and [compute instances](concept-compute-instance.md) are the only managed computes. Additional managed compute resources may be added in the future.

You can create Azure Machine Learning compute instances (preview) or compute clusters from:
* Azure Machine Learning studio
* Azure portal
* Python SDK [ComputeInstance](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.computeinstance(class)?view=azure-ml-py) and [AmlCompute](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute(class)?view=azure-ml-py) classes
* [R SDK](https://azure.github.io/azureml-sdk-for-r/reference/index.html#section-compute-targets)
* Resource Manager template

You can also create compute clusters using the [machine learning extension for the Azure CLI](tutorial-train-deploy-model-cli.md#create-the-compute-target-for-training).

When created these compute resources are automatically part of your workspace, unlike other kinds of compute targets.

### Compute clusters

You can use Azure Machine Learning compute clusters for training and for batch inferencing (preview).  With this compute resource, you have:

* Single- or multi-node cluster
* Autoscaling each time you submit a run 
* Automatic cluster management and job scheduling 
* Support for both CPU and GPU resources

### Supported VM series and sizes

When you select a node size for a managed compute resource in Azure Machine Learning, you can choose from among select VM sizes available in Azure. Azure offers a range of sizes for Linux and Windows for different workloads. Refer here to learn more about the different [VM types and sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes).

There are a few exceptions and limitations to choosing a VM size:
* Some VM series are not supported in Azure Machine Learning.
* Some VM series are restricted. To use a restricted series, contact support and request a quota increase for the series. For information on contacting support, see [Azure support options](https://azure.microsoft.com/support/options/)

See the following table to learn more about supported series and restrictions. 

| **Supported VM series**  | **Restrictions** |
|------------|------------|
| D | None |
| Dv2 | None |  
| DSv2 | None |  
| FSv2 | None |  
| M | Requires approval |
| NC | None |    
| NCsv2 | Requires approval |
| NCsv3 | Requires approval |  
| NDs | Requires approval |
| NDv2 | Requires approval |
| NV | None |
| NVv3 | Requires approval | 


While Azure Machine Learning supports these VM series, they may not be available in all Azure regions. You can check with VM series are available here: [Products Available by Region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).

## Unmanaged compute

An unmanaged compute target is *not* managed by Azure Machine Learning. You create this type of compute target outside Azure Machine Learning, then attach it to your workspace. Unmanaged compute resources can require additional steps for you to maintain or to improve performance for machine learning workloads.

## Next steps

Learn how to:
* [Set up a compute target to train your model](how-to-set-up-training-targets.md)
* [Deploy your model to a compute target](how-to-deploy-and-where.md)
