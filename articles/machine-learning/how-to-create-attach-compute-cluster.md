---
title: Create compute clusters
titleSuffix: Azure Machine Learning
description: Learn how to create compute clusters in your Azure Machine Learning workspace. Use the compute cluster as a compute target for training or inference.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: how-to, devx-track-azurecli
ms.author: sgilley
author: sdgilley
ms.reviewer: sgilley
ms.date: 10/02/2020
---

# Create an Azure Machine Learning compute cluster

Learn how to create and manage a [compute cluster](concept-compute-target.md#azure-machine-learning-compute-managed) in your Azure Machine Learning workspace.

You can use Azure Machine Learning compute cluster to distribute a training or batch inference process across a cluster of CPU or GPU compute nodes in the cloud. For more information on the VM sizes that include GPUs, see [GPU-optimized virtual machine sizes](../virtual-machines/sizes-gpu.md). 

In this article, learn how to:

* Create a compute cluster
* Lower your compute cluster cost
* Set up a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for the cluster

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

* The [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md), [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro), or the [Azure Machine Learning Visual Studio Code extension](tutorial-setup-vscode-extension.md).

* If using the Python SDK, [set up your development environment with a workspace](how-to-configure-environment.md).  Once your environment is set up, attach to the workspace in your Python script:

    ```python
    from azureml.core import Workspace
    
    ws = Workspace.from_config() 
    ```

## What is a compute cluster?

Azure Machine Learning compute cluster is a managed-compute infrastructure that allows you to easily create a single or multi-node compute. The compute is created within your workspace region as a resource that can be shared with other users in your workspace. The compute scales up automatically when a job is submitted, and can be put in an Azure Virtual Network. The compute executes in a containerized environment and packages your model dependencies in a [Docker container](https://www.docker.com/why-docker).

Compute clusters can run jobs securely in a [virtual network environment](how-to-secure-training-vnet.md), without requiring enterprises to open up SSH ports. The job executes in a containerized environment and packages your model dependencies in a Docker container. 

## Limitations

* Some of the scenarios listed in this document are marked as __preview__. Preview functionality is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

* We currently support only creation (and not updating) of clusters through ARM templates [https://docs.microsoft.com/azure/templates/microsoft.machinelearningservices/workspaces/computes?tabs=json]. For updating compute, we recommend using the SDK, CLI or UX for now.

* Azure Machine Learning Compute has default limits, such as the number of cores that can be allocated. For more information, see [Manage and request quotas for Azure resources](how-to-manage-quotas.md).

* Azure allows you to place _locks_ on resources, so that they cannot be deleted or are read only. __Do not apply resource locks to the resource group that contains your workspace__. Applying a lock to the resource group that contains your workspace will prevent scaling operations for Azure ML compute clusters. For more information on locking resources, see [Lock resources to prevent unexpected changes](../azure-resource-manager/management/lock-resources.md).

> [!TIP]
> Clusters can generally scale up to 100 nodes as long as you have enough quota for the number of cores required. By default clusters are setup with inter-node communication enabled between the nodes of the cluster to support MPI jobs for example. However you can scale your clusters to 1000s of nodes by simply [raising a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest), and requesting to allow list your subscription, or workspace, or a specific cluster for disabling inter-node communication.


## Create

**Time estimate**: Approximately 5 minutes.

Azure Machine Learning Compute can be reused across runs. The compute can be shared with other users in the workspace and is retained between runs, automatically scaling nodes up or down based on the number of runs submitted, and the max_nodes set on your cluster. The min_nodes setting controls the minimum nodes available.

The dedicated cores per region per VM family quota and total regional quota, which applies to compute cluster creation, is unified and shared with Azure Machine Learning training compute instance quota. 

[!INCLUDE [min-nodes-note](../../includes/machine-learning-min-nodes.md)]

The compute autoscales down to zero nodes when it isn't used.   Dedicated VMs are created to run your jobs as needed.
    
# [Python](#tab/python)


To create a persistent Azure Machine Learning Compute resource in Python, specify the **vm_size** and **max_nodes** properties. Azure Machine Learning then uses smart defaults for the other properties.
    
* **vm_size**: The VM family of the nodes created by Azure Machine Learning Compute.
* **max_nodes**: The max number of nodes to autoscale up to when you run a job on Azure Machine Learning Compute.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/amlcompute2.py?name=cpu_cluster)]

You can also configure several advanced properties when you create Azure Machine Learning Compute. The properties allow you to create a persistent cluster of fixed size, or within an existing Azure Virtual Network in your subscription.  See the [AmlCompute class](/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute) for details.


# [Azure CLI](#tab/azure-cli)


```azurecli-interactive
az ml computetarget create amlcompute -n cpu --min-nodes 1 --max-nodes 1 -s STANDARD_D3_V2
```

For more information, see [az ml computetarget create amlcompute](/cli/azure/ml/computetarget/create#az_ml_computetarget_create_amlcompute).

# [Studio](#tab/azure-studio)

For information on creating a compute cluster in the studio, see [Create compute targets in Azure Machine Learning studio](how-to-create-attach-compute-studio.md#amlcompute).

---

 ## <a id="low-pri-vm"></a> Lower your compute cluster cost

You may also choose to use [low-priority VMs](concept-plan-manage-cost.md#low-pri-vm) to run some or all of your workloads. These VMs do not have guaranteed availability and may be preempted while in use. You will have to restart a preempted job. 

Use any of these ways to specify a low-priority VM:
    
# [Python](#tab/python)
    
```python
compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2',
                                                            vm_priority='lowpriority',
                                                            max_nodes=4)
```
    
# [Azure CLI](#tab/azure-cli)

Set the `vm-priority`:
    
```azurecli-interactive
az ml computetarget create amlcompute --name lowpriocluster --vm-size Standard_NC6 --max-nodes 5 --vm-priority lowpriority
```

# [Studio](#tab/azure-studio)

In the studio, choose **Low Priority** when you create a VM.

--- 

## <a id="managed-identity"></a> Set up managed identity

[!INCLUDE [aml-clone-in-azure-notebook](../../includes/aml-managed-identity-intro.md)]

# [Python](#tab/python)

* Configure managed identity in your provisioning configuration:  

    * System assigned managed identity created in a workspace named `ws`
        ```python
        # configure cluster with a system-assigned managed identity
        compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2',
                                                                max_nodes=5,
                                                                identity_type="SystemAssigned",
                                                                )
        cpu_cluster_name = "cpu-cluster"
        cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)
        ```
    
    * User-assigned managed identity created in a workspace named `ws`
    
        ```python
        # configure cluster with a user-assigned managed identity
        compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2',
                                                                max_nodes=5,
                                                                identity_type="UserAssigned",
                                                                identity_id=['/subscriptions/<subcription_id>/resourcegroups/<resource_group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<user_assigned_identity>'])
    
        cpu_cluster_name = "cpu-cluster"
        cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)
        ```

* Add managed identity to an existing compute cluster named `cpu_cluster`
    
    * System-assigned managed identity:
    
        ```python
        # add a system-assigned managed identity
        cpu_cluster.add_identity(identity_type="SystemAssigned")
        ````
    
    * User-assigned managed identity:
    
        ```python
        # add a user-assigned managed identity
        cpu_cluster.add_identity(identity_type="UserAssigned", 
                                    identity_id=['/subscriptions/<subcription_id>/resourcegroups/<resource_group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<user_assigned_identity>'])
        ```

# [Azure CLI](#tab/azure-cli)

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

# [Studio](#tab/azure-studio)

See [Set up managed identity in studio](how-to-create-attach-compute-studio.md#managed-identity).

---

[!INCLUDE [aml-clone-in-azure-notebook](../../includes/aml-managed-identity-note.md)]

### Managed identity usage

[!INCLUDE [aml-clone-in-azure-notebook](../../includes/aml-managed-identity-default.md)]

## Troubleshooting

There is a chance that some users who created their Azure Machine Learning workspace from the Azure portal before the GA release might not be able to create AmlCompute in that workspace. You can either raise a support request against the service or create a new workspace through the portal or the SDK to unblock yourself immediately.

If your Azure Machine Learning compute cluster appears stuck at resizing (0 -> 0) for the node state, this may be caused by Azure resource locks.

[!INCLUDE [resource locks](../../includes/machine-learning-resource-lock.md)]

## Next steps

Use your compute cluster to:

* [Submit a training run](how-to-set-up-training-targets.md) 
* [Run batch inference](./tutorial-pipeline-batch-scoring-classification.md).
