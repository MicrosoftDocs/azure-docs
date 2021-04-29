---
title: Create and manage a compute instance
titleSuffix: Azure Machine Learning
description: Learn how to create and manage an Azure Machine Learning compute instance. Use as your development environment, or as  compute target for dev/test purposes.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.author: sgilley
author: sdgilley
ms.reviewer: sgilley
ms.date: 10/02/2020
---

# Create and manage an Azure Machine Learning compute instance

Learn how to create and manage a [compute instance](concept-compute-instance.md) in your Azure Machine Learning workspace.

Use a compute instance as your fully configured and managed development environment in the cloud. For development and testing, you can also use the instance as a [training compute target](concept-compute-target.md#train) or for an [inference target](concept-compute-target.md#deploy).   A compute instance can run multiple jobs in parallel and has a job queue. As a development environment, a compute instance cannot be shared with other users in your workspace.

In this article, you learn how to:

* Create a compute instance 
* Manage (start, stop, restart, delete) a compute instance
* Access the terminal window 
* Install R or Python packages
* Create new environments or Jupyter kernels

Compute instances can run jobs securely in a [virtual network environment](how-to-secure-training-vnet.md), without requiring enterprises to open up SSH ports. The job executes in a containerized environment and packages your model dependencies in a Docker container. 

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

* The [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md), [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro), or the [Azure Machine Learning Visual Studio Code extension](tutorial-setup-vscode-extension.md).

## Create

**Time estimate**: Approximately 5 minutes.

Creating a compute instance is a one time process for your workspace. You can reuse the compute as a development workstation or as a compute target for training. You can have multiple compute instances attached to your workspace.

The dedicated cores per region per VM family quota and total regional quota, which applies to compute instance creation, is unified and shared with Azure Machine Learning training compute cluster quota. Stopping the compute instance does not release quota to ensure you will be able to restart the compute instance. Note it is not possible to change the virtual machine size of compute instance once it is created.

The following example demonstrates how to create a compute instance:

# [Python](#tab/python)

```python
import datetime
import time

from azureml.core.compute import ComputeTarget, ComputeInstance
from azureml.core.compute_target import ComputeTargetException

# Choose a name for your instance
# Compute instance name should be unique across the azure region
compute_name = "ci{}".format(ws._workspace_id)[:10]

# Verify that instance does not exist already
try:
    instance = ComputeInstance(workspace=ws, name=compute_name)
    print('Found existing instance, use it.')
except ComputeTargetException:
    compute_config = ComputeInstance.provisioning_configuration(
        vm_size='STANDARD_D3_V2',
        ssh_public_access=False,
        # vnet_resourcegroup_name='<my-resource-group>',
        # vnet_name='<my-vnet-name>',
        # subnet_name='default',
        # admin_user_ssh_public_key='<my-sshkey>'
    )
    instance = ComputeInstance.create(ws, compute_name, compute_config)
    instance.wait_for_completion(show_output=True)
```

For more information on the classes, methods, and parameters used in this example, see the following reference documents:

* [ComputeInstance class](/python/api/azureml-core/azureml.core.compute.computeinstance.computeinstance)
* [ComputeTarget.create](/python/api/azureml-core/azureml.core.compute.computetarget#create-workspace--name--provisioning-configuration-)
* [ComputeInstance.wait_for_completion](/python/api/azureml-core/azureml.core.compute.computeinstance(class)#wait-for-completion-show-output-false--is-delete-operation-false-)


# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az ml computetarget create computeinstance  -n instance -s "STANDARD_D3_V2" -v
```

For more information, see the [az ml computetarget create computeinstance](/cli/azure/ml/computetarget/create#az_ml_computetarget_create_computeinstance) reference.

# [Studio](#tab/azure-studio)

In your workspace in Azure Machine Learning studio, create a new compute instance from either the **Compute** section or in the **Notebooks** section when you are ready to run one of your notebooks.

For information on creating a compute instance in the studio, see [Create compute targets in Azure Machine Learning studio](how-to-create-attach-compute-studio.md#compute-instance).

---

You can also create a compute instance with an [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-machine-learning-compute-create-computeinstance). 

### Create on behalf of (preview)

As an administrator, you can create a compute instance on behalf of a data scientist and assign the instance to them with:
* [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-machine-learning-compute-create-computeinstance).  For details on how to find the TenantID and ObjectID needed in this template, see [Find identity object IDs for authentication configuration](../healthcare-apis/fhir/find-identity-object-ids.md).  You can also find these values in the Azure Active Directory portal.
* REST API

The data scientist you create the compute instance for needs the following be [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) permissions: 
* *Microsoft.MachineLearningServices/workspaces/computes/start/action*
* *Microsoft.MachineLearningServices/workspaces/computes/stop/action*
* *Microsoft.MachineLearningServices/workspaces/computes/restart/action*
* *Microsoft.MachineLearningServices/workspaces/computes/applicationaccess/action*

The data scientist can start, stop, and restart the compute instance. They can use the compute instance for:
* Jupyter
* JupyterLab
* RStudio
* Integrated notebooks

## Manage

Start, stop, restart, and delete a compute instance. A compute instance does not automatically scale down, so make sure to stop the resource to prevent ongoing charges.

> [!TIP]
> The compute instance has 120GB OS disk. If you run out of disk space, [use the terminal](how-to-access-terminal.md) to clear at least 1-2 GB before you stop or restart the compute instance.

# [Python](#tab/python)

In the examples below, the name of the compute instance is **instance**

* Get status

    ```python
    # get_status() gets the latest status of the ComputeInstance target
    instance.get_status()
    ```

* Stop

    ```python
    # stop() is used to stop the ComputeInstance
    # Stopping ComputeInstance will stop the billing meter and persist the state on the disk.
    # Available Quota will not be changed with this operation.
    instance.stop(wait_for_completion=True, show_output=True)
    ```

* Start

    ```python
    # start() is used to start the ComputeInstance if it is in stopped state
    instance.start(wait_for_completion=True, show_output=True)
    ```

* Restart

    ```python
    # restart() is used to restart the ComputeInstance
    instance.restart(wait_for_completion=True, show_output=True)
    ```

* Delete

    ```python
    # delete() is used to delete the ComputeInstance target. Useful if you want to re-use the compute name 
    instance.delete(wait_for_completion=True, show_output=True)
    ```

# [Azure CLI](#tab/azure-cli)

In the examples below, the name of the compute instance is **instance**

* Stop

    ```azurecli-interactive
    az ml computetarget stop computeinstance -n instance -v
    ```

    For more information, see [az ml computetarget stop computeinstance](/cli/azure/ml/computetarget/computeinstance#az_ml_computetarget_computeinstance_stop).

* Start 

    ```azurecli-interactive
    az ml computetarget start computeinstance -n instance -v
    ```

    For more information, see [az ml computetarget start computeinstance](/cli/azure/ml/computetarget/computeinstance#az_ml_computetarget_computeinstance_start).

* Restart 

    ```azurecli-interactive
    az ml computetarget restart computeinstance -n instance -v
    ```

    For more information, see [az ml computetarget restart computeinstance](/cli/azure/ml/computetarget/computeinstance#az_ml_computetarget_computeinstance_restart).

* Delete

    ```azurecli-interactive
    az ml computetarget delete -n instance -v
    ```

    For more information, see [az ml computetarget delete computeinstance](/cli/azure/ml/computetarget#az_ml_computetarget_delete).

# [Studio](#tab/azure-studio)

In your workspace in Azure Machine Learning studio, select **Compute**, then select **Compute Instance** on the top.

![Manage a compute instance](./media/concept-compute-instance/manage-compute-instance.png)

You can perform the following actions:

* Create a new compute instance 
* Refresh the compute instances tab.
* Start, stop, and restart a compute instance.  You do pay for the instance whenever it is running. Stop the compute instance when you are not using it to reduce cost. Stopping a compute instance deallocates it. Then start it again when you need it.
* Delete a compute instance.
* Filter the list of compute instances to show only those you have created.

For each compute instance in your workspace that you created (or that was created for you), you can:

* Access Jupyter, JupyterLab, RStudio on the compute instance
* SSH into compute instance. SSH access is disabled by default but can be enabled at compute instance creation time. SSH access is through public/private key mechanism. The tab will give you details for SSH connection such as IP address, username, and port number.
* Get details about a specific compute instance such as IP address, and region.

---


[Azure RBAC](../role-based-access-control/overview.md) allows you to control which users in the workspace can create, delete, start, stop, restart a compute instance. All users in the workspace contributor and owner role can create, delete, start, stop, and restart compute instances across the workspace. However, only the creator of a specific compute instance, or the user assigned if it was created on their behalf, is allowed to access Jupyter, JupyterLab, and RStudio on that compute instance. A compute instance is dedicated to a single user who has root access, and can terminal in through Jupyter/JupyterLab/RStudio. Compute instance will have single-user sign in and all actions will use that user’s identity for Azure RBAC and attribution of experiment runs. SSH access is controlled through public/private key mechanism.

These actions can be controlled by Azure RBAC:
* *Microsoft.MachineLearningServices/workspaces/computes/read*
* *Microsoft.MachineLearningServices/workspaces/computes/write*
* *Microsoft.MachineLearningServices/workspaces/computes/delete*
* *Microsoft.MachineLearningServices/workspaces/computes/start/action*
* *Microsoft.MachineLearningServices/workspaces/computes/stop/action*
* *Microsoft.MachineLearningServices/workspaces/computes/restart/action*

## Next steps

* [Access the compute instance terminal](how-to-access-terminal.md)
* [Create and manage files](how-to-manage-files.md)
* [Submit a training run](how-to-set-up-training-targets.md)
