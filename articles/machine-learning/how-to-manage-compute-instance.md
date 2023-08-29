---
title: Manage a compute instance
titleSuffix: Azure Machine Learning
description: Learn how to manage an Azure Machine Learning compute instance. Use as your development environment, or as  compute target for dev/test purposes.
services: machine-learning
ms.service: machine-learning
ms.subservice: compute
ms.custom: event-tier1-build-2022, devx-track-azurecli
ms.topic: how-to
author: jesscioffi
ms.author: jcioffi
ms.reviewer: sgilley
ms.date: 07/05/2023
---

# Manage an Azure Machine Learning compute instance

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Learn how to manage a [compute instance](concept-compute-instance.md) in your Azure Machine Learning workspace. 

Use a compute instance as your fully configured and managed development environment in the cloud. For development and testing, you can also use the instance as a [training compute target](concept-compute-target.md#training-compute-targets).   A compute instance can run multiple jobs in parallel and has a job queue. As a development environment, a compute instance can't be shared with other users in your workspace.

In this article, you learn how to start, stop, restart, delete a compute instance. See [Create an Azure Machine Learning compute instance](how-to-create-compute-instance.md) to learn how to create a compute instance.

> [!NOTE]
> This article shows CLI v2 in the sections below. If you are still using CLI v1, see [Create an Azure Machine Learning compute cluster CLI v1](v1/how-to-create-manage-compute-instance.md?view=azureml-api-1&preserve-view=true).

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md). In the storage account, the "Allow storage account key access" option must be enabled for compute instance creation to be successful.

* The [Azure CLI extension for Machine Learning service (v2)](https://aka.ms/sdk-v2-install), [Azure Machine Learning Python SDK (v2)](https://aka.ms/sdk-v2-install), or the [Azure Machine Learning Visual Studio Code extension](how-to-setup-vs-code.md).

* If using the Python SDK, [set up your development environment with a workspace](how-to-configure-environment.md).  Once your environment is set up, attach to the workspace in your Python script:

  [!INCLUDE [connect ws v2](includes/machine-learning-connect-ws-v2.md)]

## Manage

Start, stop, restart, and delete a compute instance. A compute instance doesn't always automatically scale down, so make sure to stop the resource to prevent ongoing charges. Stopping a compute instance deallocates it. Then start it again when you need it. While stopping the compute instance stops the billing for compute hours, you'll still be billed for disk, public IP, and standard load balancer. 

You can [enable automatic shutdown](how-to-create-compute-instance.md#configure-idle-shutdown) to automatically stop the compute instance after a specified time.

You can also [create a schedule](how-to-create-compute-instance.md#schedule-automatic-start-and-stop) for the compute instance to automatically start and stop based on a time and day of week.

> [!TIP]
> The compute instance has 120GB OS disk. If you run out of disk space, [use the terminal](how-to-access-terminal.md) to clear at least 1-2 GB before you stop or restart the compute instance. Please do not stop the compute instance by issuing sudo shutdown from the terminal. The temp disk size on compute instance depends on the VM size chosen and is mounted on /mnt.

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]


In the examples below, the name of the compute instance is stored in the variable `ci_basic_name`.

* Get status

  [!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=ci_basic_state)]


* Stop

  [!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=stop_compute)]


* Start

  [!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=start_compute)]


* Restart

  [!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=restart_compute)]


* Delete

  [!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=delete_compute)]


# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

In the examples below, the name of the compute instance is **instance**, in workspace **my-workspace**, in resource group **my-resource-group**.

* Stop

    ```azurecli
    az ml compute stop --name instance --resource-group my-resource-group --workspace-name my-workspace
    ```

* Start

    ```azurecli
    az ml compute start --name instance --resource-group my-resource-group --workspace-name my-workspace
    ```

* Restart

    ```azurecli
    az ml compute restart --name instance --resource-group my-resource-group --workspace-name my-workspace
    ```

* Delete

    ```azurecli
    az ml compute delete --name instance --resource-group my-resource-group --workspace-name my-workspace
    ```

# [Studio](#tab/azure-studio)

In your workspace in Azure Machine Learning studio, select **Compute**, then select **compute instance** on the top.

!Screenshot shows compute tab in studio to manage a compute instance.](./media/concept-compute-instance/manage-compute-instance.png)

You can perform the following actions:

* Create a new compute instance
* Refresh the compute instances tab.
* Start, stop, and restart a compute instance.  You do pay for the instance whenever it's running. Stop the compute instance when you aren't using it to reduce cost. Stopping a compute instance deallocates it. Then start it again when you need it. You can also schedule a time for the compute instance to start and stop.
* Delete a compute instance.
* Filter the list of compute instances to show only ones you've created.

For each compute instance in a workspace that you created (or that was created for you), you can:

* Access Jupyter, JupyterLab, RStudio on the compute instance.
* SSH into compute instance. SSH access is disabled by default but can be enabled at compute instance creation time. SSH access is through public/private key mechanism. The tab will give you details for SSH connection such as IP address, username, and port number. In a virtual network deployment, disabling SSH prevents SSH access from public internet, you can still SSH from within virtual network using private IP address of compute instance node and port 22.
* Select the compute name to:
    * View details about a specific compute instance such as IP address, and region.
    * Create or modify the schedule for starting and stopping the compute instance.  Scroll down to the bottom of the page to edit the schedule.

---

[Azure RBAC](../role-based-access-control/overview.md) allows you to control which users in the workspace can create, delete, start, stop, restart a compute instance. All users in the workspace contributor and owner role can create, delete, start, stop, and restart compute instances across the workspace. However, only the creator of a specific compute instance, or the user assigned if it was created on their behalf, is allowed to access Jupyter, JupyterLab, and RStudio on that compute instance. A compute instance is dedicated to a single user who has root access.  That user has access to Jupyter/JupyterLab/RStudio running on the instance. Compute instance will have single-user sign-in and all actions will use that user's identity for Azure RBAC and attribution of experiment jobs. SSH access is controlled through public/private key mechanism.

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

## Audit and observe compute instance version

Once a compute instance is deployed, it does not get automatically updated. Microsoft [releases](azure-machine-learning-ci-image-release-notes.md) new VM images on a monthly basis. To understand options for keeping recent with the latest version, see [vulnerability management](concept-vulnerability-management.md#compute-instance). 

To keep track of whether an instance's operating system version is current, you could query its version using the CLI, SDK or Studio UI. 

# [Studio UI](#tab/azure-studio)

In your workspace in Azure Machine Learning studio, select Compute, then select compute instance on the top. Select a compute instance's compute name to see its properties including the current operating system.

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
from azure.ai.ml.entities import ComputeInstance, AmlCompute

# Display operating system version
instance = ml_client.compute.get("myci")
print instance.os_image_metadata
```

For more information on the classes, methods, and parameters used in this example, see the following reference documents:

* [`AmlCompute` class](/python/api/azure-ai-ml/azure.ai.ml.entities.amlcompute)
* [`ComputeInstance` class](/python/api/azure-ai-ml/azure.ai.ml.entities.computeinstance)

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```azurecli
az ml compute show --name "myci"
```

---

IT administrators can use [Azure Policy](./../governance/policy/overview.md) to monitor the inventory of instances across workspaces in Azure Policy compliance portal. Assign the built-in policy [Audit Azure Machine Learning Compute Instances with an outdated operating system](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff110a506-2dcb-422e-bcea-d533fc8c35e2) on an Azure subscription or Azure management group scope.

## Next steps

* [Access the compute instance terminal](how-to-access-terminal.md)
* [Create and manage files](how-to-manage-files.md)
* [Update the compute instance to the latest VM image](concept-vulnerability-management.md#compute-instance)
