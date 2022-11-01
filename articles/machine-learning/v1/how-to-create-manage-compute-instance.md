---
title: Create and manage a compute instance with CLI v1
titleSuffix: Azure Machine Learning
description: Learn how to create and manage an Azure Machine Learning compute instance with CLI v1. Use as your development environment, or as  compute target for dev/test purposes.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: devx-track-azurecli, references_regions, cliv1, event-tier1-build-2022
ms.author: sgilley
author: sdgilley
ms.reviewer: sgilley
ms.date: 05/02/2022
---

# Create and manage an Azure Machine Learning compute instance with CLI v1

[!INCLUDE [cli v1](../../../includes/machine-learning-cli-v1.md)]

> [!div class="op_single_selector" title1="Select the Azure Machine Learning CLI version you are using:"]
> * [CLI v1](how-to-create-manage-compute-instance.md)
> * [CLI v2 (current version)](../how-to-create-manage-compute-instance.md)

Learn how to create and manage a [compute instance](../concept-compute-instance.md) in your Azure Machine Learning workspace with CLI v1.

Use a compute instance as your fully configured and managed development environment in the cloud. For development and testing, you can also use the instance as a [training compute target](../concept-compute-target.md#train) or for an [inference target](../concept-compute-target.md#deploy).   A compute instance can run multiple jobs in parallel and has a job queue. As a development environment, a compute instance can't be shared with other users in your workspace.

Compute instances can run jobs securely in a [virtual network environment](../how-to-secure-training-vnet.md), without requiring enterprises to open up SSH ports. The job executes in a containerized environment and packages your model dependencies in a Docker container.

In this article, you learn how to:

* Create a compute instance
* Manage (start, stop, restart, delete) a compute instance

> [!NOTE]
> This article covers only how to do these tasks using CLI v1.  For more recent ways to manage a compute instance, see [Create an Azure Machine Learning compute cluster](../how-to-create-manage-compute-instance.md).

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](../how-to-manage-workspace.md).

* The [Azure CLI extension for Machine Learning service (v1)](reference-azure-machine-learning-cli.md)

    [!INCLUDE [cli v1 deprecation](../../../includes/machine-learning-cli-v1-deprecation.md)]

## Create

> [!IMPORTANT]
> Items marked (preview) below are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

**Time estimate**: Approximately 5 minutes.

Creating a compute instance is a one time process for your workspace. You can reuse the compute as a development workstation or as a compute target for training. You can have multiple compute instances attached to your workspace. 

The dedicated cores per region per VM family quota and total regional quota, which applies to compute instance creation, is unified and shared with Azure Machine Learning training compute cluster quota. Stopping the compute instance doesn't release quota to ensure you'll be able to restart the compute instance. It isn't possible to change the virtual machine size of compute instance once it's created.

The following example demonstrates how to create a compute instance:

[!INCLUDE [cli v1](../../../includes/machine-learning-cli-v1.md)]

```azurecli-interactive
az ml computetarget create computeinstance  -n instance -s "STANDARD_D3_V2" -v
```

For more information, see [Az PowerShell module `az ml computetarget create computeinstance`](/cli/azure/ml(v1)/computetarget/create#az-ml-computetarget-create-computeinstance) reference.


## Manage

Start, stop, restart, and delete a compute instance. A compute instance doesn't automatically scale down, so make sure to stop the resource to prevent ongoing charges. Stopping a compute instance deallocates it. Then start it again when you need it. While stopping the compute instance stops the billing for compute hours, you'll still be billed for disk, public IP, and standard load balancer. 

> [!TIP]
> The compute instance has 120GB OS disk. If you run out of disk space, [use the terminal](../how-to-access-terminal.md) to clear at least 1-2 GB before you stop or restart the compute instance. Please do not stop the compute instance by issuing sudo shutdown from the terminal. The temp disk size on compute instance depends on the VM size chosen and is mounted on /mnt.

[!INCLUDE [cli v1](../../../includes/machine-learning-cli-v1.md)]

In the examples below, the name of the compute instance is **instance**

* Stop

    ```azurecli-interactive
    az ml computetarget stop computeinstance -n instance -v
    ```

    For more information, see [Az PowerShell module `az ml computetarget stop computeinstance`](/cli/azure/ml(v1)/computetarget/computeinstance#az-ml-computetarget-computeinstance-stop).

* Start

    ```azurecli-interactive
    az ml computetarget start computeinstance -n instance -v
    ```

    For more information, see [Az PowerShell module `az ml computetarget start computeinstance`](/cli/azure/ml(v1)/computetarget/computeinstance#az-ml-computetarget-computeinstance-start).

* Restart

    ```azurecli-interactive
    az ml computetarget restart computeinstance -n instance -v
    ```

    For more information, see [Az PowerShell module `az ml computetarget restart computeinstance`](/cli/azure/ml(v1)/computetarget/computeinstance#az-ml-computetarget-computeinstance-restart).

* Delete

    ```azurecli-interactive
    az ml computetarget delete -n instance -v
    ```

    For more information, see [Az PowerShell module `az ml computetarget delete computeinstance`](/cli/azure/ml(v1)/computetarget#az-ml-computetarget-delete).

[Azure RBAC](../../role-based-access-control/overview.md) allows you to control which users in the workspace can create, delete, start, stop, restart a compute instance. All users in the workspace contributor and owner role can create, delete, start, stop, and restart compute instances across the workspace. However, only the creator of a specific compute instance, or the user assigned if it was created on their behalf, is allowed to access Jupyter, JupyterLab, and RStudio on that compute instance. A compute instance is dedicated to a single user who has root access, and can terminal in through Jupyter/JupyterLab/RStudio. Compute instance will have single-user sign in and all actions will use that user’s identity for Azure RBAC and attribution of experiment runs. SSH access is controlled through public/private key mechanism.

These actions can be controlled by Azure RBAC:
* *Microsoft.MachineLearningServices/workspaces/computes/read*
* *Microsoft.MachineLearningServices/workspaces/computes/write*
* *Microsoft.MachineLearningServices/workspaces/computes/delete*
* *Microsoft.MachineLearningServices/workspaces/computes/start/action*
* *Microsoft.MachineLearningServices/workspaces/computes/stop/action*
* *Microsoft.MachineLearningServices/workspaces/computes/restart/action*
* *Microsoft.MachineLearningServices/workspaces/computes/updateSchedules/action*

To create a compute instance, you'll need permissions for the following actions:
* *Microsoft.MachineLearningServices/workspaces/computes/write*
* *Microsoft.MachineLearningServices/workspaces/checkComputeNameAvailability/action*


## Next steps

* [Access the compute instance terminal](../how-to-access-terminal.md)
* [Create and manage files](../how-to-manage-files.md)
* [Update the compute instance to the latest VM image](../concept-vulnerability-management.md#compute-instance)
* [Submit a training run](how-to-set-up-training-targets.md)
