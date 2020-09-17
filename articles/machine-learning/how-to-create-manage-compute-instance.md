---
title: Create and manage a compute instance
titleSuffix: Azure Machine Learning
description: 'A compute instance is... Learn how to create a and manage cluster through Azure Machine Learning. '
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: how-to
ms.author: jordane
author: jpe316
ms.reviewer: sgilley
ms.date: 09/01/2020
---

# Create and manage a compute instance

[Azure Machine Learning compute instance](concept-compute-instance.md) is a managed-compute infrastructure that allows you to easily create a single VM. The compute is created within your workspace region, but unlike a [compute cluster](how-to-create-attach-compute-cluster.md), an instance cannot be shared with other users in your workspace. Also the instance does not automatically scale down.  You must stop the resource to prevent ongoing charges.

Use a compute instance as your fully configured and managed development environment in the cloud for machine learning. Or as a compute target for training and inferencing for development and testing purposes. A compute instance can run multiple jobs in parallel and has a job queue. 

Compute instances can run jobs securely in a [virtual network environment](how-to-enable-virtual-network.md#compute-instance), without requiring enterprises to open up SSH ports. The job executes in a containerized environment and packages your model dependencies in a Docker container. 

## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

- The [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md), [Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py&preserve-view=true), or the [Azure Machine Learning Visual Studio Code extension](tutorial-setup-vscode-extension.md).

## Create a compute instance

**Time estimate**: Approximately 5 minutes.

Creating a compute instance is a one time process for your workspace. You can reuse this compute as a development workstation or as a compute target for training. You can have multiple compute instances attached to your workspace.

The dedicated cores per region per VM family quota and total regional quota, which applies to compute instance creation, is unified and shared with Azure Machine Learning training compute cluster quota. Stopping the compute instance does not release quota to ensure you will be able to restart the compute instance.

The following example demonstrates how to create a compute instance with the SDK, CLI, studio, or with an Azure Resource Manager template:

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

* [ComputeInstance class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.computeinstance.computeinstance?view=azure-ml-py&preserve-view=true)
* [ComputeTarget.create](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.computetarget?view=azure-ml-py&preserve-view=true#create-workspace--name--provisioning-configuration-)
* [ComputeInstance.wait_for_completion](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.computeinstance(class)?view=azure-ml-py&preserve-view=true#wait-for-completion-show-output-false--is-delete-operation-false-)


# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az ml computetarget create computeinstance  -n cpu -s "STANDARD_D3_V2" -v
```

For more information, see the [az ml computetarget create computeinstance](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/create?view=azure-cli-latest#ext_azure_cli_ml_az_ml_computetarget_create_computeinstance) reference.

# [Studio](#tab/azure-studio)

In your workspace in Azure Machine Learning studio, create a new compute instance from either the **Compute** section or in the **Notebooks** section when you are ready to run one of your notebooks.

For information on creating a compute instance in the studio, see [Create compute targets in Azure Machine Learning studio](how-to-create-attach-compute-studio.md#compute-instance).

---


You can also create a compute instance with an [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-machine-learning-compute-create-computeinstance).


## Managing a compute instance

# [Python](#tab/python)

# [Azure CLI](#tab/azure-cli)

Manage compute instances.  In all the examples below, the name of the compute instance is **cpu**

+ Create a new computeinstance.

    ```azurecli-interactive
    az ml computetarget create computeinstance  -n cpu -s "STANDARD_D3_V2" -v
    ```

    For more information, see [az ml computetarget create computeinstance](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/create?view=azure-cli-latest#ext-azure-cli-ml-az-ml-computetarget-create-computeinstance).

+ Stop a computeinstance.

    ```azurecli-interactive
    az ml computetarget stop computeinstance -n cpu -v
    ```

    For more information, see [az ml computetarget stop computeinstance](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/computeinstance?view=azure-cli-latest#ext-azure-cli-ml-az-ml-computetarget-computeinstance-stop).

+ Start a computeinstance.

    ```azurecli-interactive
    az ml computetarget start computeinstance -n cpu -v
    ```

    For more information, see [az ml computetarget start computeinstance](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/computeinstance?view=azure-cli-latest#ext-azure-cli-ml-az-ml-computetarget-computeinstance-start).

+ Restart a computeinstance.

    ```azurecli-interactive
    az ml computetarget restart computeinstance -n cpu -v
    ```

    For more information, see [az ml computetarget restart computeinstance](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/computeinstance?view=azure-cli-latest#ext-azure-cli-ml-az-ml-computetarget-computeinstance-restart).

+ Delete a computeinstance.

    ```azurecli-interactive
    az ml computetarget delete -n cpu -v
    ```

    For more information, see [az ml computetarget delete computeinstance](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget?view=azure-cli-latest#ext-azure-cli-ml-az-ml-computetarget-delete).

# [Studio](#tab/azure-studio)

In your workspace in Azure Machine Learning studio, select **Compute**, then select **Compute Instance** on the top.

![Manage a compute instance](./media/concept-compute-instance/manage-compute-instance.png)

You can perform the following actions:

* [Create a compute instance](#create). 
* Refresh the compute instances tab.
* Start, stop, and restart a compute instance.  You do pay for the instance whenever it is running. Stop the compute instance when you are not using it to reduce cost. Stopping a compute instance deallocates it. Then start it again when you need it.
* Delete a compute instance.
* Filter the list of compute instanced to show only those you have created.

For each compute instance in your workspace that you can use, you can:

* Access Jupyter, JupyterLab, RStudio on the compute instance
* SSH into compute instance. SSH access is disabled by default but can be enabled at compute instance creation time. SSH access is through public/private key mechanism. The tab will give you details for SSH connection such as IP address, username, and port number.
* Get details about a specific compute instance such as IP address, and region.

---

### RBAC

[RBAC](/azure/role-based-access-control/overview) allows you to control which users in the workspace can create, delete, start, stop, restart a compute instance. All users in the workspace contributor and owner role can create, delete, start, stop, and restart compute instances across the workspace. However, only the creator of a specific compute instance, or the user assigned if it was created on their behalf, is allowed to access Jupyter, JupyterLab, and RStudio on that compute instance. A compute instance is dedicated to a single user who has root access, and can terminal in through Jupyter/JupyterLab/RStudio. Compute instance will have single-user log in and all actions will use that user’s identity for RBAC and attribution of experiment runs. SSH access is controlled through public/private key mechanism.

These actions can be controlled by RBAC:
* *Microsoft.MachineLearningServices/workspaces/computes/read*
* *Microsoft.MachineLearningServices/workspaces/computes/write*
* *Microsoft.MachineLearningServices/workspaces/computes/delete*
* *Microsoft.MachineLearningServices/workspaces/computes/start/action*
* *Microsoft.MachineLearningServices/workspaces/computes/stop/action*
* *Microsoft.MachineLearningServices/workspaces/computes/restart/action*


### Create on behalf of (preview)

As an administrator, you can create a compute instance on behalf of a data scientist and assign the instance to them with:
* [Azure Resource Manager template](https://docs.microsoft.com/azure/templates/microsoft.machinelearningservices/2020-06-01/workspaces/computes).  For details on how to find the TenantID and ObjectID needed in this template, see [Find identity object IDs for authentication configuration](../healthcare-apis/find-identity-object-ids.md).  You can also find these values in the Azure Active Directory portal.
* REST API

The data scientist you create the compute instance for needs the following RBAC permissions: 
* *Microsoft.MachineLearningServices/workspaces/computes/start/action*
* *Microsoft.MachineLearningServices/workspaces/computes/stop/action*
* *Microsoft.MachineLearningServices/workspaces/computes/restart/action*
* *Microsoft.MachineLearningServices/workspaces/computes/applicationaccess/action*

The data scientist can start, stop, and restart the compute instance. They can use the compute instance for:
* Jupyter
* JupyterLab
* RStudio
* Integrated notebooks

## Install packages

You can install packages directly in Jupyter Notebook or RStudio:

* RStudio Use the **Packages** tab on the bottom right, or the **Console** tab on the top left.  
* Python: Add install code and execute in a Jupyter Notebook cell.

Or you can access a terminal window in any of these ways:

* RStudio: Select the **Terminal** tab on top left.
* Jupyter Lab:  Select the **Terminal** tile under the **Other** heading in the Launcher tab.
* Jupyter:  Select **New>Terminal** on top right in the Files tab.
* SSH to the machine.  Then install Python packages into the **Python 3.6 - AzureML** environment.  Install R packages into the **R** environment.

## Next steps

* [Submit the training run](how-to-set-up-training-targets.md) 
* [How and where to deploy a model](how-to-deploy-and-where.md)
