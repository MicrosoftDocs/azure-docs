---
title: Use managed identities for access control (preview)
titleSuffix: Azure Machine Learning
description: Learn how to use managed identities to control access to Azure resources from Azure Machine Learning workspace.
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.topic: how-to
ms.date: 10/22/2020
---

# Use Managed identities with Azure Machine Learning (preview)

[Managed identities](../active-directory/managed-identities-azure-resources/overview.md) allow you to configure your workspace with the *minimum required permissions to access resources*. 

When configuring Azure Machine Learning workspace in trustworthy manner, it is important to ensure that different services associated with the workspace have the correct level of access. For example, during machine learning workflow the workspace needs access to Azure Container Registry (ACR) for Docker images, and storage accounts for training data. 

Furthermore, managed identities allow fine-grained control over permissions, for example you can grant or revoke access from specific compute resources to a specific ACR.

In this article, you'll learn how to use managed identities to:

 * Configure and use ACR for your Azure Machine Learning workspace without having to enable admin user access to ACR.
 * Access a private ACR external to your workspace, to pull base images for training or inference.
 * Create workspace with user-assigned managed identity to access associated resources.

> [!IMPORTANT]
> Using managed identities to control access to resources with Azure Machine Learning is currently in preview. Preview functionality is provided "as-is", with no guarantee of support or service level agreement. For more information, see the [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
 
## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).
- The [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md)
- The [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro).
- To assign roles, the login for your Azure subscription must have the [Managed Identity Operator](../role-based-access-control/built-in-roles.md#managed-identity-operator) role, or other role that grants the required actions (such as __Owner__).
- You must be familiar with creating and working with [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md).

## Configure managed identities

In some situations, it's necessary to disallow admin user access to Azure Container Registry. For example, the ACR may be shared and you need to disallow admin access by other users. Or, creating ACR with admin user enabled is disallowed by a subscription level policy.

> [!IMPORTANT]
> When using Azure Machine Learning for inference on Azure Container Instance (ACI), admin user access on ACR is __required__. Do not disable it if you plan on deploying models to ACI for inference.

When you create ACR without enabling admin user access, managed identities are used to access the ACR to build and pull Docker images.

You can bring your own ACR with admin user disabled when you create the workspace. Alternatively, let Azure Machine Learning create workspace ACR and disable admin user afterwards.

### Bring your own ACR

If ACR admin user is disallowed by subscription policy, you should first create ACR without admin user, and then associate it with the workspace. Also, if you have existing ACR with admin user disabled, you can attach it to the workspace.

[Create ACR from Azure CLI](../container-registry/container-registry-get-started-azure-cli.md) without setting ```--admin-enabled``` argument, or from Azure portal without enabling admin user. Then, when creating Azure Machine Learning workspace, specify the Azure resource ID of the ACR. The following example demonstrates creating a new Azure ML workspace that uses an existing ACR:

> [!TIP]
> To get the value for the `--container-registry` parameter, use the [az acr show](/cli/azure/acr#az_acr_show) command to show information for your ACR. The `id` field contains the resource ID for your ACR.

```azurecli-interactive
az ml workspace create -w <workspace name> \
-g <workspace resource group> \
-l <region> \
--container-registry /subscriptions/<subscription id>/resourceGroups/<acr resource group>/providers/Microsoft.ContainerRegistry/registries/<acr name>
```

### Let Azure Machine Learning service create workspace ACR

If you do not bring your own ACR, Azure Machine Learning service will create one for you when you perform an operation that needs one. For example, submit a training run to Machine Learning Compute, build an environment, or deploy a web service endpoint. The ACR created by the workspace will have admin user enabled, and you need to disable the admin user manually.

1. Create a new workspace

    ```azurecli-interactive
    az ml workspace show -n <my workspace> -g <my resource group>
    ```

1. Perform an action that requires ACR. For example, the [tutorial on training a model](tutorial-train-models-with-aml.md).

1. Get the ACR name created by the cluster:

    ```azurecli-interactive
    az ml workspace show -w <my workspace> \
    -g <my resource group>
    --query containerRegistry
    ```

    This command returns a value similar to the following text. You only want the last portion of the text, which is the ACR instance name:

    ```output
    /subscriptions/<subscription id>/resourceGroups/<my resource group>/providers/MicrosoftContainerReggistry/registries/<ACR instance name>
    ```

1. Update the ACR to disable the admin user:

    ```azurecli-interactive
    az acr update --name <ACR instance name> --admin-enabled false
    ```

### Create compute with managed identity to access Docker images for training

To access the workspace ACR, create machine learning compute cluster with system-assigned managed identity enabled. You can enable the identity from  Azure portal or Studio when creating compute, or from Azure CLI using the below. For more information, see [using managed identity with compute clusters](how-to-create-attach-compute-cluster.md#managed-identity).

# [Python](#tab/python)

When creating a compute cluster with the [AmlComputeProvisioningConfiguration](/python/api/azureml-core/azureml.core.compute.amlcompute.amlcomputeprovisioningconfiguration), use the `identity_type` parameter to set the managed identity type.

# [Azure CLI](#tab/azure-cli)

```azurecli-interaction
az ml computetarget create amlcompute --name cpucluster -w <workspace> -g <resource group> --vm-size <vm sku> --assign-identity '[system]'
```

# [Portal](#tab/azure-portal)

For information on configuring managed identity when creating a compute cluster in studio, see [Set up managed identity](how-to-create-attach-compute-studio.md#managed-identity).

---

A managed identity is automatically granted ACRPull role on workspace ACR to enable pulling Docker images for training.

> [!NOTE]
> If you create compute first, before workspace ACR has been created, you have to assign the ACRPull role manually.

## Access base images from private ACR

By default, Azure Machine Learning uses Docker base images that come from a public repository managed by Microsoft. It then builds your training or inference environment on those images. For more information, see [What are ML environments?](concept-environments.md).

To use a custom base image internal to your enterprise, you can use managed identities to access your private ACR. There are two use cases:

 * Use base image for training as is.
 * Build Azure Machine Learning managed image with custom image as a base.

### Pull Docker base image to machine learning compute cluster for training as is

Create machine learning compute cluster with system-assigned managed identity enabled as described earlier. Then, determine the principal ID of the managed identity.

```azurecli-interactive
az ml computetarget amlcompute identity show --name <cluster name> -w <workspace> -g <resource group>
```

Optionally, you can update the compute cluster to assign a user-assigned managed identity:

```azurecli-interactive
az ml computetarget amlcompute identity assign --name cpucluster \
-w $mlws -g $mlrg --identities <my-identity-id>
```

To allow the compute cluster to pull the base images, grant the managed service identity ACRPull role on the private ACR

```azurecli-interactive
az role assignment create --assignee <principal ID> \
--role acrpull \
--scope "/subscriptions/<subscription ID>/resourceGroups/<private ACR resource group>/providers/Microsoft.ContainerRegistry/registries/<private ACR name>"
```

Finally, when submitting a training run, specify the base image location in the [environment definition](how-to-use-environments.md#use-existing-environments).

```python
from azureml.core import Environment
env = Environment(name="private-acr")
env.docker.base_image = "<ACR name>.azurecr.io/<base image repository>/<base image version>"
env.python.user_managed_dependencies = True
```

> [!IMPORTANT]
> To ensure that the base image is pulled directly to the compute resource, set `user_managed_dependencies = True` and do not specify a Dockerfile. Otherwise Azure Machine Learning service will attempt to build a new Docker image and fail, because only the compute cluster has access to pull the base image from ACR.

### Build Azure Machine Learning managed environment into base image from private ACR for training or inference

In this scenario, Azure Machine Learning service builds the training or inference environment on top of a base image you supply from a private ACR. Because the image build task happens on the workspace ACR using ACR Tasks, you must perform more steps to allow access.

1. Create __user-assigned managed identity__ and grant the identity ACRPull access to the __private ACR__.  
1. Grant the workspace __system-assigned managed identity__ a Managed Identity Operator role on the __user-assigned managed identity__ from the previous step. This role allows the workspace to assign the user-assigned managed identity to ACR Task for building the managed environment. 

    1. Obtain the principal ID of workspace system-assigned managed identity:

        ```azurecli-interactive
        az ml workspace show -w <workspace name> -g <resource group> --query identityPrincipalId
        ```

    1. Grant the Managed Identity Operator role:

        ```azurecli-interactive
        az role assignment create --assignee <principal ID> --role managedidentityoperator --scope <UAI resource ID>
        ```

        The UAI resource ID is Azure resource ID of the user assigned identity, in the format `/subscriptions/<subscription ID>/resourceGroups/<resource group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<UAI name>`.

1. Specify the external ACR and client ID of the __user-assigned managed identity__ in workspace connections by using [Workspace.set_connection method](/python/api/azureml-core/azureml.core.workspace.workspace#set-connection-name--category--target--authtype--value-):

    ```python
    workspace.set_connection(
        name="privateAcr", 
        category="ACR", 
        target = "<acr url>", 
        authType = "RegistryConnection", 
        value={"ResourceId": "<UAI resource id>", "ClientId": "<UAI client ID>"})
    ```

Once the configuration is complete, you can use the base images from private ACR when building environments for training or inference. The following code snippet demonstrates how to specify the base image ACR and image name in an environment definition:

```python
from azureml.core import Environment

env = Environment(name="my-env")
env.docker.base_image = "<acr url>/my-repo/my-image:latest"
```

Optionally, you can specify the managed identity resource URL and client ID in the environment definition itself by using [RegistryIdentity](/python/api/azureml-core/azureml.core.container_registry.registryidentity). If you use registry identity explicitly, it overrides any workspace connections specified earlier:

```python
from azureml.core.container_registry import RegistryIdentity

identity = RegistryIdentity()
identity.resource_id= "<UAI resource ID>"
identity.client_id="<UAI client ID>”
env.docker.base_image_registry.registry_identity=identity
env.docker.base_image = "my-acr.azurecr.io/my-repo/my-image:latest"
```

## Use Docker images for inference

Once you've configured ACR without admin user as described earlier, you can access Docker images for inference without admin keys from your Azure Kubernetes service (AKS). When you create or attach AKS to workspace, the cluster's service principal is automatically assigned ACRPull access to workspace ACR.

> [!NOTE]
> If you bring your own AKS cluster, the cluster must have service principal enabled instead of managed identity.

## Create workspace with user-assigned managed identity

When creating workspace, you can specify a user-assigned managed identity that will be used to access the associated resources: ACR, KeyVault, Storage, and App Insights.

First [create a user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli), and take note of the ARM resource ID of the managed identity.

Then, use Azure CLI or Python SDK to create the workspace. When using the CLI, specify the ID using the `--primary-user-assigned-identity` parameter. When using the SDK, use `primary_user_assigned_identity`. The following are examples of using the Azure CLI and Python to create a new workspace using these parameters:

__Azure CLI__

```azurecli-interactive
az ml workspace create -w <workspace name> -g <resource group> --primary-user-assigned-identity <managed identity ARM ID>
```

__Python__

```python
from azureml.core import Workspace

ws = Workspace.create(name="workspace name", 
    subscription_id="subscription id", 
    resource_group="resource group name",
    primary_user_assigned_identity="managed identity ARM ID")
```

You can also use [an ARM template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-machine-learning-advanced) to create a workspace with user-assigned managed identity.

> [!IMPORTANT]
> If you bring your own associated resources, instead of having Azure Machine Learning service create them, you must grant the managed identity roles on those resources. Use the [role assignment ARM template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-machine-learning-dependencies-role-assignment) to make the assignments.

For a workspace with (customer-managed keys for encryption)[https://docs.microsoft.com/azure/machine-learning/concept-data-encryption], you can pass in a user-assigned managed identity to authenticate from storage to Key Vault. Use argument
 __user-assigned-identity-for-cmk-encryption__ (CLI) or __user_assigned_identity_for_cmk_encryption__ (SDK) to pass in the managed identity. This managed identity can be the same or different as the workspace primary user assigned managed identity.

If you have an existing workspace, you can update it from system-assigned to user-assigned managed identity using ```az ml workspace update``` CLI command, or ```Workspace.update``` Python SDK method.


## Next steps

* Learn more about [enterprise security in Azure Machine Learning](concept-enterprise-security.md).
