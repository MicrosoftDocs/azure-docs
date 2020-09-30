---
title: Managed Identities with Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to use managed identities to control access to Azure resources from Azure Machine Learning workspace.
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.topic: conceptual
ms.date: 09/29/2020
---

# Use Managed Identities with Azure Machine Learning

[Managed identities](/azure/active-directory/managed-identities-azure-resources/overview) allow you to configure your workspace with the *minimum required permissions to access resources*. 

When configuring Azure Machine Learning workspace in trustworthy manner, it is important to ensure that different services associated with the workspace have the correct level of access. For example, during machine learning workflow the workspace needs access to Azure Container Registry (ACR) for Docker images, and storage accounts for training data. 

Furthermore, managed identities allow fine-grained control over permissions, for example you can grant or revoke access from specific compute resource to a specific ACR.

In this article, you'll learn how to use managed identities to:

 * Configure and use ACR for your Azure Machine Learning workspace without having to enable admin user access to ACR.
 * Access a private ACR external to your workspace, to pull base images for training or inference.
 * Access data sets for training by using managed identities instead of storage access keys.
 
## Pre-requisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).
- The [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md)
- The [Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py)(tutorial-setup-vscode-extension.md).
- To assign roles, the login for your Azure subscription must have the [Managed Identity Operator](/azure/role-based-access-control/built-in-roles#managed-identity-operator) role, or other role that grants the required actions (such as __Owner__).

## Configure managed identities for your workspace

In some situations, it's necessary to disallow admin user access to Azure Container Registry. For example, the ACR may be shared and you need to disallow admin access by other users. Or, creating ACR with admin user enabled is disallowed by a subscription level policy.

> [!IMPORTANT]
> When using Azure Machine Learning for inference on Azure Container Instance (ACI), admin user access on ACR is __required__. Do not disable it if you plan on deploying models to ACI for inference.

When you create ACR without enabling admin user access, managed identities are used to access the ACR to build and pull Docker images.

You can bring your own ACR with admin user disabled when you create the workspace. Alternatively, let Azure Machine Learning create workspace ACR and disable admin user afterwards.

### Bring your own ACR

If ACR admin user is disallowed by subscription policy, you should first create ACR without admin user, and then associate it with the workspace. Also, if you have existing ACR with admin user disabled, you can attach it to the workspace.

[Create ACR from Azure CLI](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-azure-cli) without setting ```--admin-enabled``` argument, or from Azure portal without enabling admin user. Then, when creating Azure Machine Learning workspace, specify the Azure resource ID of the ACR. The following example demonstrates creating a new Azure ML workspace that uses an existing ACR:

> [!TIP]
> To get the value for the `--container-registry` parameter, use the [az acr show](https://docs.microsoft.com/cli/azure/acr?view=azure-cli-latest#az_acr_show) command to show information for your ACR. The `id` field contains the resource ID for your ACR.

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

    This returns a value similar to the following text. You only want the last portion of the text, which is the ACR instance name:

    ```text
    /subscriptions/<subscription id>/resourceGroups/<my resource group>/providers/MicrosoftContainerReggistry/registries/<ACR instance name>
    ```

1. Update the ACR to disable the admin user:

    ```azurecli-interactive
    az acr update --name <ACR instance name> --admin-enabled false
    ```

### Create compute with managed identity to access Docker images for training

To access the workspace ACR, create machine learning compute cluster with system-assigned managed identity enabled. You can enable the identity from  Azure portal or Studio when creating compute, or from Azure CLI using

# [Python](#tab/python)

When creating a compute cluster with the [AmlComputeProvisioningConfiguration](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.compute.amlcompute.amlcomputeprovisioningconfiguration?view=azure-ml-py), use the `identity_type` parameter to set the managed identity type. If `identity_type="UserAssigned"`, use `identity_id` to specify the identity of the managed identity.

# [Azure CLI](#tab/azure-cli)

```azurecli-interaction
az ml computetarget create amlcompute --name cpucluster -w <workspace> -g <resource group> --vm-size <vm sku> --assign-identity '[system]'
```

# [Portal](#tab/azure-portal)

For information on configuring managed identity when creating a compute cluster in studio, see the [Set up managed identity](how-to-create-attach-compute-studio.md#managed-identity) section of the how to create and attach compute targets for training article.

---

A managed identity is automatically granted ACRPull role on workspace ACR to enable pulling Docker images for training.

>[!NOTE]
> If you create compute first, before workspace ACR has been created, you have to assign the ACRPull role manually.

## Access base images from private ACR

By default, Azure Machine Learning uses Docker base images that come from a public repository managed by Microsoft. It then builds your training or inferencing environment on those images. See [What are ML environments?](concept-environments.md) for an overview of environments.

To use a custom base image internal to your enterprise, you can use managed identities to access your own private ACR. There are two use cases:

 * Use base image for training as is
 * Build Azure Machine Learning managed image with custom image as a base.

### Pull Docker base image to machine learning compute cluster for training as is

Create machine learning compute cluster with system-assigned managed identity enabled as described earlier. Then, determine principal ID of the managed identity.

```azurecli-interactive
az ml computetarget amlcompute identity show --name <cluster name> -w <workspace> -g <resource group>
```

Optionally, you can update the compute cluster to assign a user-assigned managed identity:

```azurecli-interactive
az ml computetarget amlcompute identity assign --name cpucluster -w $mlws -g $mlrg --identities <my-identity-id>
```

To allow the compute cluster to pull the base images, grant the managed service identity ACRPull role on the private ACR

```azurecli-interactive
az role assignment create --assignee <principal ID> --role acrpull --scope "/subscriptions/<subscription ID>/resourceGroups/<private ACR resource group>/providers/Microsoft.ContainerRegistry/registries/<private ACR name>"
```

Finally, when submitting a training run, specify the base image location in [environment definition](how-to-use-environments.md).

```python
from azureml.core import Environment
env = Environment(name="private-acr")
env.docker.base_image = "<ACR name>.azurecr.io/<base image repository>/<base image version>"
env.python.user_managed_dependencies = True
```

You must set user-managed dependencies to True and not specify Dockerfile to ensure that base image pulled directly to compute. Otherwise Azure Machine Learning service will attempt to build a new Docker image and fail, because only the compute cluster has access to pull the base image from ACR. If user-managed dependencies is set to False, follow the instructions in next section.

### Build Azure Machine Learning managed environment into base image from private ACR for training or inferencing

In this scenario, Azure Machine Learning service builds the training or inferencing environment on top of a base image you supply from private ACR. Because the image build task happens on workspace ACR using ACR Tasks, you must perform additional steps to allow access.

First, create user-assigned managed identity, and grant the identity ACRPull access to external ACR. In this scenario, you must use a user-assigned managed identity.

Then, grant workspace system-assigned managed identity a Managed Identity Operator role on user-assigned managed identity. This role allows workspace to assign the user-assigned managed identity to ACR Task for building the managed environment. 

Obtain the principal ID of workspace system-assigned managed identity

```azurecli-interactive
az ml workspace show -w <workspace name> -g <resource group> --query identityPrincipalId
```

Grant the Managed Identity Operator role

```azurecli-interactive
az role assignment create --assignee <principal ID> --role managedidentityoperator --scope <UAI resource ID>
```

Here the UAI resource ID is Azure resource ID of the user assigned identity, in format ```/subscriptions/<subscription ID>/resourceGroups/<resource group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<UAI name>```

Finally, specify external ACR and client ID of user-assigned managed identity in workspace connections by using [Workspace.set_connection method](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py#set-connection-name--category--target--authtype--value-):

```python
workspace.set_connection(
    name="privateAcr", 
    category="ACR", 
    target = "<acr url>", 
    authType = "RegistryConnection", 
    value={"ResourceId": "<UAI resource id>", "ClientId": "<UAI client ID>"})
```

Once the configuration is complete, you can use the base images from private ACR when building environments for training or inferencing.
Specify the base image ACR and image name in Environment definition.

```python
from azureml.core import Environment

env = Environment(name="my-env")
env.docker.base_image = "<acr url>/my-repo/my-image:latest"
```

Optionally, you can specify the managed identity resource URL and client ID in environment definition itself by using [RegistryIdentity](https://docs.microsoft.com/python/api/azureml-core/azureml.core.container_registry.registryidentity?view=azure-ml-py) object. If you use registry identity explicitly, it overrides any workspace connections specified earlier.

```python
from azureml.core.container_registry import RegistryIdentity

identity = RegistryIdentity()
identity.resource_id= "<UAI resource ID>"
identity.client_id="<UAI client ID>”
env.docker.base_image_registry.registry_identity=identity
env.docker.base_image = "my-acr.azurecr.io/my-repo/my-image:latest"
```

## Use managed identities to access training data

Once you've created machine learning compute cluster with managed identity as described earlier, you can use that identity to access training data without storage account keys. You can use either system- or user-assigned managed identity for this scenario.

### Grant compute's managed identity access to storage account

[Grant the managed identity a reader role](https://docs.microsoft.com/azure/storage/common/storage-auth-aad#assign-azure-roles-for-access-rights) on the storage account in which you store your training data.

### Register data store with workspace

After you've assigned the managed identity, you can create a data store without having to specify storage credentials.

```python
from azureml.core import Datastore

blob_dstore = Datastore.register_azure_blob_container(workspace=workspace,
                                                      datastore_name='my-datastore',
                                                      container_name='my-container',
                                                      account_name='my-storage-account')
```

### Submit training run

When you submit a training run using the data store, the machine learning compute uses its managed identity to access data.

## Use Docker images for inferencing on Azure Kubernetes service without ACR admin user

Once you've set up ACR without admin user as described earlier, you can access Docker images for inferencing without admin keys from your Azure Kubernetes service (AKS). When you create or attach AKS to workspace, the cluster's service principal is automatically assigned ACRPull access to workspace ACR.

>[!NOTE]
> If you bring your own AKS cluster, the cluster must have service principal enabled instead of managed identity.

## Next steps

 * Learn more about [enterprise security in Azure Machine Learning](concept-enterprise-security.md)