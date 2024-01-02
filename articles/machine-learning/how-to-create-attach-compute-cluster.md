---
title: Create compute clusters
titleSuffix: Azure Machine Learning
description: Learn how to create compute clusters in your Azure Machine Learning workspace. Use the compute cluster as a compute target for training or inference.
services: machine-learning
ms.service: machine-learning
ms.subservice: compute
ms.topic: how-to
ms.custom: devx-track-azurecli, cliv2, sdkv2, event-tier1-build-2022, build-2023
ms.author: vijetaj
author: vijetajo
ms.reviewer: sgilley
ms.date: 10/19/2022
---

# Create an Azure Machine Learning compute cluster

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Learn how to create and manage a [compute cluster](concept-compute-target.md#azure-machine-learning-compute-managed) in your Azure Machine Learning workspace.

You can use Azure Machine Learning compute cluster to distribute a training or batch inference process across a cluster of CPU or GPU compute nodes in the cloud. For more information on the VM sizes that include GPUs, see [GPU-optimized virtual machine sizes](../virtual-machines/sizes-gpu.md). 

In this article, learn how to:

* Create a compute cluster
* Lower your compute cluster cost with low priority VMs
* Set up a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for the cluster

[!INCLUDE [serverless compute](./includes/serverless-compute.md)]

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

* The [Azure CLI extension for Machine Learning service (v2)](how-to-configure-cli.md), [Azure Machine Learning Python SDK](/python/api/overview/azure/ai-ml-readme), or the [Azure Machine Learning Visual Studio Code extension](how-to-setup-vs-code.md).

* If using the Python SDK, [set up your development environment with a workspace](how-to-configure-environment.md).  Once your environment is set up, attach to the workspace in your Python script:

    [!INCLUDE [connect ws v2](includes/machine-learning-connect-ws-v2.md)]


## What is a compute cluster?

Azure Machine Learning compute cluster is a managed-compute infrastructure that allows you to easily create a single or multi-node compute. The compute cluster is a resource that can be shared with other users in your workspace. The compute scales up automatically when a job is submitted, and can be put in an Azure Virtual Network. Compute cluster supports **no public IP** deployment as well in virtual network. The compute executes in a containerized environment and packages your model dependencies in a [Docker container](https://www.docker.com/why-docker).

Compute clusters can run jobs securely in either a [managed virtual network](how-to-managed-network.md) or an [Azure virtual network](how-to-secure-training-vnet.md), without requiring enterprises to open up SSH ports. The job executes in a containerized environment and packages your model dependencies in a Docker container. 

## Limitations

* Compute clusters can be created in a different region than your workspace. This functionality is only available for __compute clusters__, not compute instances.

    > [!WARNING]
    > When using a compute cluster in a different region than your workspace or datastores, you may see increased network latency and data transfer costs. The latency and costs can occur when creating the cluster, and when running jobs on it.

* Azure Machine Learning Compute has default limits, such as the number of cores that can be allocated. For more information, see [Manage and request quotas for Azure resources](how-to-manage-quotas.md).

* Azure allows you to place _locks_ on resources, so that they can't be deleted or are read only. __Do not apply resource locks to the resource group that contains your workspace__. Applying a lock to the resource group that contains your workspace prevents scaling operations for Azure Machine Learning compute clusters. For more information on locking resources, see [Lock resources to prevent unexpected changes](../azure-resource-manager/management/lock-resources.md).

## Create

> [!NOTE]
> If you use serverless compute, you don't need to create a compute cluster.

**Time estimate**: Approximately 5 minutes.

Azure Machine Learning Compute can be reused across runs. The compute can be shared with other users in the workspace and is retained between runs, automatically scaling nodes up or down based on the number of runs submitted, and the max_nodes set on your cluster. The min_nodes setting controls the minimum nodes available.

The dedicated cores per region per VM family quota and total regional quota, which applies to compute cluster creation, is unified and shared with Azure Machine Learning training compute instance quota. 

[!INCLUDE [min-nodes-note](includes/machine-learning-min-nodes.md)]

The compute autoscales down to zero nodes when it isn't used.   Dedicated VMs are created to run your jobs as needed.


Use the following examples to create a compute cluster:
    
# [Python SDK](#tab/python)

To create a persistent Azure Machine Learning Compute resource in Python, specify the **size** and **max_instances** properties. Azure Machine Learning then uses smart defaults for the other properties.
    
* *size**: The VM family of the nodes created by Azure Machine Learning Compute.
* **max_instances*: The max number of nodes to autoscale up to when you run a job on Azure Machine Learning Compute.

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=cluster_basic)]

You can also configure several advanced properties when you create Azure Machine Learning Compute. The properties allow you to create a persistent cluster of fixed size, or within an existing Azure Virtual Network in your subscription.  See the [AmlCompute class](/python/api/azure-ai-ml/azure.ai.ml.entities.amlcompute) for details.

> [!WARNING]
> When setting the `location` parameter, if it is a different region than your workspace or datastores you may see increased network latency and data transfer costs. The latency and costs can occur when creating the cluster, and when running jobs on it.

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```azurecli
az ml compute create -f create-cluster.yml
```

Where the file *create-cluster.yml* is:

:::code language="yaml" source="~/azureml-examples-main/cli/resources/compute/cluster-location.yml":::


> [!WARNING]
> When using a compute cluster in a different region than your workspace or datastores, you may see increased network latency and data transfer costs. The latency and costs can occur when creating the cluster, and when running jobs on it.


# [Studio](#tab/azure-studio)

Create a single- or multi- node compute cluster for your training, batch inferencing or reinforcement learning workloads. 

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com).
 
1. Under __Manage__, select __Compute__.
1. If you have no compute resources, select  **Create** in the middle of the page.
  
    :::image type="content" source="media/how-to-create-attach-studio/create-compute-target.png" alt-text="Screenshot that shows creating a compute target":::

1. If you see a list of compute resources, select **+New** above the list.

    :::image type="content" source="media/how-to-create-attach-studio/select-new.png" alt-text="Select new":::

1. In the tabs at the top, select __Compute cluster__

1. Fill out the form as follows:

    |Field  |Description  |
    |---------|---------|
    | Location | The Azure region where the compute cluster is created. By default, this is the same location as the workspace. If you don't have sufficient quota in the default region, switch to a different region for more options. </br>When using a different region than your workspace or datastores, you may see increased network latency and data transfer costs. The latency and costs can occur when creating the cluster, and when running jobs on it. |
    |Virtual machine type |  Choose CPU or GPU. This type can't be changed after creation     |
    |Virtual machine priority | Choose **Dedicated** or **Low priority**.  Low priority virtual machines are cheaper but don't guarantee the compute nodes. Your job may be preempted.
    |Virtual machine size     |  Supported virtual machine sizes might be restricted in your region. Check the [availability list](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines)     |

1. Select **Next** to proceed to **Advanced Settings** and fill out the form as follows:

    |Field  |Description  |
    |---------|---------|
    |Compute name     | * Name is required and must be between 3 to 24 characters long.<br><br> * Valid characters are upper and lower case letters, digits, and the  **-** character.<br><br> * Name must start with a letter<br><br> * Name needs to be unique across all existing computes within an Azure region. You see an alert if the name you choose isn't unique<br><br> * If **-**  character is used, then it needs to be followed by at least one letter later in the name    |
    |Minimum number of nodes | Minimum number of nodes that you want to provision. If you want a dedicated number of nodes, set that count here. Save money by setting the minimum to 0, so you don't pay for any nodes when the cluster is idle. |
    |Maximum number of nodes | Maximum number of nodes that you want to provision. The compute automatically scales to a maximum of this node count when a job is submitted. |
    | Idle seconds before scale down | Idle time before scaling the cluster down to the minimum node count. |
    | Enable SSH access | Use the same instructions as [Enable SSH access](#enable-ssh-access) for a compute instance (above). |
    |Advanced settings     |  Optional. Configure network settings.<br><br> * If an *Azure Virtual Network*, Specify the **Resource group**, **Virtual network**, and **Subnet** to create the compute instance inside the network). For more information, see [network requirements](./how-to-secure-training-vnet.md).<br><br> * If an *Azure Machine Learning managed network*, the compute cluster is automatically in the managed network. For more information, see [managed computes with a managed network](how-to-managed-network-compute.md).<br><br> * No public IP configures whether the compute cluster has a public IP address when in a network.<br><br> * Assign a [managed identity](#set-up-managed-identity) to grant access to resources.

1. Select __Create__.


### Enable SSH access

SSH access is disabled by default.  SSH access can't be changed after creation. Make sure to enable access if you plan to debug interactively with [VS Code Remote](how-to-set-up-vs-code-remote.md).  

[!INCLUDE [enable-ssh](includes/machine-learning-enable-ssh.md)]

### Connect with SSH access

[!INCLUDE [ssh-access](includes/machine-learning-ssh-access.md)]

---

 ## Lower your compute cluster cost with low priority VMs

You may also choose to use [low-priority VMs](how-to-manage-optimize-cost.md#low-pri-vm) to run some or all of your workloads. These VMs don't have guaranteed availability and may be preempted while in use. You have to restart a preempted job. 

Using Azure Low Priority Virtual Machines allows you to take advantage of Azure's unused capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure evicts Azure Low Priority Virtual Machines. Therefore, Azure Low Priority Virtual Machine is great for workloads that can handle interruptions. The amount of available capacity can vary based on size, region, time of day, and more. When deploying Azure Low Priority Virtual Machines, Azure allocates the VMs if there's capacity available, but there's no SLA for these VMs. An Azure Low Priority Virtual Machine offers no high availability guarantees. At any point in time when Azure needs the capacity back, the Azure infrastructure evicts Azure Low Priority Virtual Machines 

Use any of these ways to specify a low-priority VM:
    
# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=cluster_low_pri)]

    
# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

Set the `vm-priority`:
    
```azurecli
az ml compute create -f create-cluster.yml
```

Where the file *create-cluster.yml* is:

:::code language="yaml" source="~/azureml-examples-main/cli/resources/compute/cluster-low-priority.yml":::

> [!NOTE]
> When you use [serverless compute](./how-to-use-serverless-compute.md), you don't need to create a compute cluster. To specify a low-priority serverless compute, set the `job_tier` to `Spot` in the [queue settings](./how-to-use-serverless-compute.md#configure-properties-for-command-jobs).

# [Studio](#tab/azure-studio)

In the studio, choose **Low Priority** when you create a VM.

--- 

## Set up managed identity

For information on how to configure a managed identity with your compute cluster, see [Set up authentication between Azure Machine Learning and other services](how-to-identity-based-service-authentication.md#compute-cluster).

## Troubleshooting

There's a chance that some users who created their Azure Machine Learning workspace from the Azure portal before the GA release might not be able to create AmlCompute in that workspace. You can either raise a support request against the service or create a new workspace through the portal or the SDK to unblock yourself immediately.

[!INCLUDE [retiring vms](./includes/retiring-vms.md)]

### Stuck at resizing

If your Azure Machine Learning compute cluster appears stuck at resizing (0 -> 0) for the node state, Azure resource locks may be the cause.

[!INCLUDE [resource locks](includes/machine-learning-resource-lock.md)]

## Next steps

Use your compute cluster to:

* [Submit a training run](./how-to-train-model.md) 
* [Run batch inference](./tutorial-pipeline-batch-scoring-classification.md).
