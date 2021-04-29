---
title: What are compute targets
titleSuffix: Azure Machine Learning
description: Learn how to designate a compute resource or environment to train or deploy your model with Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sgilley
author: sdgilley
ms.date: 09/29/2020
#Customer intent: As a data scientist, I want to understand what a compute target is and why I need it.
---

# What are compute targets in Azure Machine Learning?

A *compute target* is a designated compute resource or environment where you run your training script or host your service deployment. This location might be your local machine or a cloud-based compute resource. Using compute targets makes it easy for you to later change your compute environment without having to change your code.

In a typical model development lifecycle, you might:

1. Start by developing and experimenting on a small amount of data. At this stage, use your local environment, such as a local computer or cloud-based virtual machine (VM), as your compute target.
1. Scale up to larger data, or do distributed training by using one of these [training compute targets](#train).
1. After your model is ready, deploy it to a web hosting environment or IoT device with one of these [deployment compute targets](#deploy).

The compute resources you use for your compute targets are attached to a [workspace](concept-workspace.md). Compute resources other than the local machine are shared by users of the workspace.

## <a name="train"></a> Training compute targets

Azure Machine Learning has varying support across different compute targets. A typical model development lifecycle starts with development or experimentation on a small amount of data. At this stage, use a local environment like your local computer or a cloud-based VM. As you scale up your training on larger datasets or perform distributed training, use Azure Machine Learning compute to create a single- or multi-node cluster that autoscales each time you submit a run. You can also attach your own compute resource, although support for different scenarios might vary.

[!INCLUDE [aml-compute-target-train](../../includes/aml-compute-target-train.md)]

Learn more about how to [submit a training run to a compute target](how-to-set-up-training-targets.md).

## <a name="deploy"></a> Compute targets for inference

When performing inference, Azure Machine Learning creates a Docker container that hosts the model and associated resources needed to use it. This container is then used in a compute target.

[!INCLUDE [aml-deploy-target](../../includes/aml-compute-target-deploy.md)]

Learn [where and how to deploy your model to a compute target](how-to-deploy-and-where.md).

<a name="amlcompute"></a>
## Azure Machine Learning compute (managed)

A managed compute resource is created and managed by Azure Machine Learning. This compute is optimized for machine learning workloads. Azure Machine Learning compute clusters and [compute instances](concept-compute-instance.md) are the only managed computes.

You can create Azure Machine Learning compute instances or compute clusters from:

* [Azure Machine Learning studio](how-to-create-attach-compute-studio.md).
* The Python SDK and CLI:
    * [Compute instance](how-to-create-manage-compute-instance.md).
    * [Compute cluster](how-to-create-attach-compute-cluster.md).
* The [R SDK](https://azure.github.io/azureml-sdk-for-r/reference/index.html#section-compute-targets) (preview).
* An Azure Resource Manager template. For an example template, see [Create an Azure Machine Learning compute cluster](https://github.com/Azure/azure-quickstart-templates/tree/master/101-machine-learning-compute-create-amlcompute).
* A machine learning [extension for the Azure CLI](reference-azure-machine-learning-cli.md#resource-management).

When created, these compute resources are automatically part of your workspace, unlike other kinds of compute targets.


|Capability  |Compute cluster  |Compute instance  |
|---------|---------|---------|
|Single- or multi-node cluster     |    **&check;**       |         |
|Autoscales each time you submit a run     |     **&check;**      |         |
|Automatic cluster management and job scheduling     |   **&check;**        |     **&check;**      |
|Support for both CPU and GPU resources     |  **&check;**         |    **&check;**       |


> [!NOTE]
> When a compute *cluster* is idle, it autoscales to 0 nodes, so you don't pay when it's not in use. A compute *instance* is always on and doesn't autoscale. You should [stop the compute instance](how-to-create-manage-compute-instance.md#manage) when you aren't using it to avoid extra cost.

### Supported VM series and sizes

When you select a node size for a managed compute resource in Azure Machine Learning, you can choose from among select VM sizes available in Azure. Azure offers a range of sizes for Linux and Windows for different workloads. To learn more, see [VM types and sizes](../virtual-machines/sizes.md).

There are a few exceptions and limitations to choosing a VM size:

* Some VM series aren't supported in Azure Machine Learning.
* Some VM series are restricted. To use a restricted series, contact support and request a quota increase for the series. For information on how to contact support, see [Azure support options](https://azure.microsoft.com/support/options/).

See the following table to learn more about supported series and restrictions.

| **Supported VM series**  | **Restrictions** | **Category** | **Supported by** |
|------------|------------|------------|------------|
| D | None. | General purpose | Compute clusters and instance |
| DDSv4 | None. | General purpose | Compute clusters and instance |
| Dv2 | None. | General purpose | Compute clusters and instance |
| Dv3 | None.| General purpose | Compute clusters and instance |
| DSv2 | None. | General purpose | Compute clusters and instance |
| DSv3 | None.| General purpose | Compute clusters and instance |
| EAv4 | None. | Memory optimized | Compute clusters and instance |
| Ev3 | None. | Memory optimized | Compute clusters and instance |
| FSv2 | None. | Compute optimized | Compute clusters and instance |
| H | None. | High performance compute | Compute clusters and instance |
| HB | Requires approval. | High performance compute | Compute clusters and instance |
| HBv2 | Requires approval. |  High performance compute | Compute clusters and instance |
| HCS | Requires approval. |  High performance compute | Compute clusters and instance |
| M | Requires approval. | Memory optimized | Compute clusters and instance |
| NC | None. |  GPU | Compute clusters and instance |
| NC Promo | None. | GPU | Compute clusters and instance |
| NCsv2 | Requires approval. | GPU | Compute clusters and instance |
| NCsv3 | Requires approval. | GPU | Compute clusters and instance |  
| NDs | Requires approval. | GPU | Compute clusters and instance | 
| NDv2 | Requires approval. | GPU | Compute clusters and instance | 
| NV | None. | GPU | Compute clusters and instance | 
| NVv3 | Requires approval. | GPU | Compute clusters and instance | 


While Azure Machine Learning supports these VM series, they might not be available in all Azure regions. To check whether VM series are available, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).

> [!NOTE]
> Azure Machine Learning doesn't support all VM sizes that Azure Compute supports. To list the available VM sizes, use one of the following methods:
> * [REST API](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/machinelearningservices/resource-manager/Microsoft.MachineLearningServices/stable/2020-08-01/examples/ListVMSizesResult.json)
> * [Python SDK](/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute#supported-vmsizes-workspace--location-none-)
>

### Compute isolation

Azure Machine Learning compute offers VM sizes that are isolated to a specific hardware type and dedicated to a single customer. Isolated VM sizes are best suited for workloads that require a high degree of isolation from other customers' workloads for reasons that include meeting compliance and regulatory requirements. Utilizing an isolated size guarantees that your VM will be the only one running on that specific server instance.

The current isolated VM offerings include:

* Standard_M128ms
* Standard_F72s_v2
* Standard_NC24s_v3
* Standard_NC24rs_v3*

*RDMA capable

To learn more about isolation, see [Isolation in the Azure public cloud](../security/fundamentals/isolation-choices.md).

## Unmanaged compute

An unmanaged compute target is *not* managed by Azure Machine Learning. You create this type of compute target outside Azure Machine Learning and then attach it to your workspace. Unmanaged compute resources can require additional steps for you to maintain or to improve performance for machine learning workloads.

## Next steps

Learn how to:
* [Use a compute target to train your model](how-to-set-up-training-targets.md)
* [Deploy your model to a compute target](how-to-deploy-and-where.md)
