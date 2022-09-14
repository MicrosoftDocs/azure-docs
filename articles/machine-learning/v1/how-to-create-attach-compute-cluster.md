---
title: Create compute clusters CLI v1
titleSuffix: Azure Machine Learning
description: Learn how to create compute clusters in your Azure Machine Learning workspace with CLI v1. Use the compute cluster as a compute target for training or inference.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: devx-track-azurecli, cliv1, event-tier1-build-2022
ms.author: sgilley
author: sdgilley
ms.reviewer: sgilley
ms.date: 05/02/2022
---

# Create an Azure Machine Learning compute cluster with CLI v1

[!INCLUDE [cli v1](../../../includes/machine-learning-cli-v1.md)]

> [!div class="op_single_selector" title1="Select the Azure Machine Learning CLI version you are using:"]
> * [CLI v1](how-to-create-attach-compute-cluster.md)
> * [CLI v2 (current version)](../how-to-create-attach-compute-cluster.md)

Learn how to create and manage a [compute cluster](../concept-compute-target.md#azure-machine-learning-compute-managed) in your Azure Machine Learning workspace.

You can use Azure Machine Learning compute cluster to distribute a training or batch inference process across a cluster of CPU or GPU compute nodes in the cloud. For more information on the VM sizes that include GPUs, see [GPU-optimized virtual machine sizes](../../virtual-machines/sizes-gpu.md). 

In this article, learn how to:

* Create a compute cluster
* Lower your compute cluster cost
* Set up a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for the cluster

This article covers only the CLI v1 way to accomplish these tasks.  To see how to use the SDK, CLI v2, or studio, see [Create an Azure Machine Learning compute cluster (CLI v2)](../how-to-create-attach-compute-cluster.md)

> [!NOTE]
> This article covers only how to do these tasks using CLI v1.  For more recent ways to manage a compute instance, see [Create an Azure Machine Learning compute cluster](../how-to-create-attach-compute-cluster.md).

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](../how-to-manage-workspace.md).

* The [Azure CLI extension for Machine Learning service (v1)](reference-azure-machine-learning-cli.md), [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro), or the [Azure Machine Learning Visual Studio Code extension](../how-to-setup-vs-code.md).

    [!INCLUDE [cli v1 deprecation](../../../includes/machine-learning-cli-v1-deprecation.md)]


## What is a compute cluster?

Azure Machine Learning compute cluster is a managed-compute infrastructure that allows you to easily create a single or multi-node compute. The compute cluster is a resource that can be shared with other users in your workspace. The compute scales up automatically when a job is submitted, and can be put in an Azure Virtual Network. Compute cluster supports **no public IP (preview)** deployment as well in virtual network. The compute executes in a containerized environment and packages your model dependencies in a [Docker container](https://www.docker.com/why-docker).

Compute clusters can run jobs securely in a [virtual network environment](../how-to-secure-training-vnet.md), without requiring enterprises to open up SSH ports. The job executes in a containerized environment and packages your model dependencies in a Docker container. 

## Limitations

* Some of the scenarios listed in this document are marked as __preview__. Preview functionality is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

* Compute clusters can be created in a different region than your workspace. This functionality is in __preview__, and is only available for __compute clusters__, not compute instances. This preview is not available if you are using a private endpoint-enabled workspace. 

    > [!WARNING]
    > When using a compute cluster in a different region than your workspace or datastores, you may see increased network latency and data transfer costs. The latency and costs can occur when creating the cluster, and when running jobs on it.

* We currently support only creation (and not updating) of clusters through [ARM templates](/azure/templates/microsoft.machinelearningservices/workspaces/computes). For updating compute, we recommend using the SDK, Azure CLI or UX for now.

* Azure Machine Learning Compute has default limits, such as the number of cores that can be allocated. For more information, see [Manage and request quotas for Azure resources](../how-to-manage-quotas.md).

* Azure allows you to place _locks_ on resources, so that they cannot be deleted or are read only. __Do not apply resource locks to the resource group that contains your workspace__. Applying a lock to the resource group that contains your workspace will prevent scaling operations for Azure ML compute clusters. For more information on locking resources, see [Lock resources to prevent unexpected changes](../../azure-resource-manager/management/lock-resources.md).

> [!TIP]
> Clusters can generally scale up to 100 nodes as long as you have enough quota for the number of cores required. By default clusters are setup with inter-node communication enabled between the nodes of the cluster to support MPI jobs for example. However you can scale your clusters to 1000s of nodes by simply [raising a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest), and requesting to allow list your subscription, or workspace, or a specific cluster for disabling inter-node communication.

## Create

**Time estimate**: Approximately 5 minutes.

Azure Machine Learning Compute can be reused across runs. The compute can be shared with other users in the workspace and is retained between runs, automatically scaling nodes up or down based on the number of runs submitted, and the max_nodes set on your cluster. The min_nodes setting controls the minimum nodes available.

The dedicated cores per region per VM family quota and total regional quota, which applies to compute cluster creation, is unified and shared with Azure Machine Learning training compute instance quota. 

[!INCLUDE [min-nodes-note](../../../includes/machine-learning-min-nodes.md)]

The compute autoscales down to zero nodes when it isn't used.   Dedicated VMs are created to run your jobs as needed.
    

[!INCLUDE [cli v1](../../../includes/machine-learning-cli-v1.md)]

```azurecli-interactive
az ml computetarget create amlcompute -n cpu --min-nodes 1 --max-nodes 1 -s STANDARD_D3_V2 --location westus2
```

> [!WARNING]
> When using a compute cluster in a different region than your workspace or datastores, you may see increased network latency and data transfer costs. The latency and costs can occur when creating the cluster, and when running jobs on it.

For more information, see Az PowerShell module [az ml computetarget create amlcompute](/cli/azure/ml(v1)/computetarget/create#az-ml-computetarget-create-amlcompute).



 ## Lower your compute cluster cost

You may also choose to use [low-priority VMs](../how-to-manage-optimize-cost.md#low-pri-vm) to run some or all of your workloads. These VMs do not have guaranteed availability and may be preempted while in use. You will have to restart a preempted job. 


[!INCLUDE [cli v1](../../../includes/machine-learning-cli-v1.md)]

Set the `vm-priority`:
    
```azurecli-interactive
az ml computetarget create amlcompute --name lowpriocluster --vm-size Standard_NC6 --max-nodes 5 --vm-priority lowpriority
```


## Set up managed identity

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-managed-identity-intro.md)]


[!INCLUDE [cli v1](../../../includes/machine-learning-cli-v1.md)]


* Create a new managed compute cluster with managed identity

  * User-assigned managed identity

    ```azurecli
    az ml computetarget create amlcompute --name cpu-cluster --vm-size Standard_NC6 --max-nodes 5 --assign-identity '/subscriptions/<subcription_id>/resourcegroups/<resource_group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<user_assigned_identity>'
    ```

  * System-assigned managed identity

    ```azurecli
    az ml computetarget create amlcompute --name cpu-cluster --vm-size Standard_NC6 --max-nodes 5 --assign-identity '[system]'
    ```
* Add a managed identity to an existing cluster:

    * User-assigned managed identity
        ```azurecli
        az ml computetarget amlcompute identity assign --name cpu-cluster '/subscriptions/<subcription_id>/resourcegroups/<resource_group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<user_assigned_identity>'
        ```
    * System-assigned managed identity

        ```azurecli
        az ml computetarget amlcompute identity assign --name cpu-cluster '[system]'
        ```

---

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-managed-identity-note.md)]

### Managed identity usage

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-managed-identity-default.md)]

## Troubleshooting

There is a chance that some users who created their Azure Machine Learning workspace from the Azure portal before the GA release might not be able to create AmlCompute in that workspace. You can either raise a support request against the service or create a new workspace through the portal or the SDK to unblock yourself immediately.

### Stuck at resizing

If your Azure Machine Learning compute cluster appears stuck at resizing (0 -> 0) for the node state, this may be caused by Azure resource locks.

[!INCLUDE [resource locks](../../../includes/machine-learning-resource-lock.md)]

## Next steps

Use your compute cluster to:

* [Submit a training run](how-to-set-up-training-targets.md) 
* [Run batch inference](../tutorial-pipeline-batch-scoring-classification.md).
