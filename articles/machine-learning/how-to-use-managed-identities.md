---
title: Use Managed Identities with Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to use managed identities to control access to Azure resources from Azure Machine Learning Workspace.
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.topic: conceptual
ms.date: 08/07/2020
ms.custom: seodec18
---

# Use Managed Identities with Azure Machine Learning
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

When configuring Azure Machine Learning Workspace in trustworthy manner, it is important to ensure that different services associated with the workspace have correct level of access. [Managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) allow you the configure compute resources so that they have only the minimum required permissions to Azure Container Registries (ACRs) containing the Docker images used for training and inferencing. Furthermore, managed identities allow fine-grained control over permissions, for example you can grant or revoke access from specific compute resource to specific ACR.

This document describes how to use managed identities to:

 * Configure and use ACR for your Azure Machine Learning Workspace without having to enable admin user access.
 * Access private ACR external to Workspace, to pull base images for training or inferencing.
 
## Pre-requisites

You have Azure Machine Learning CLI extension and Azure Machine Learning Python SDK installed.

## Create Azure Machine Learning Workspace without ACR admin user

In some situations it's necessary to disallow admin user access to ACR. For example, the ACR may be shared and you need to disallow admin access by other users. Or, creating ACR with admin user enabled is disallowed by subscription level IT policy. When you create ACR
without admin user, managed identities are used to access the ACR to build and pull Docker images.

> [!NOTE]
> When using Azure Machine Learning for inferencing on Azure Container Instance, ACR admin user must be enabled.

### Let Azure Machine Learning service create Workspace ACR

Create Azure Machine Learning Workspace, and perform an operation that triggers the creation of ACR, such as submit a training run to Machine Learning Compute, build an environment, or deploy a web service endpoint. By default, the ACR created by Workspace will have admin user enabled.

Then, find the name of ACR instance using ```az ml workspace show -n <my workspace> -g <my resource group>``` command, and update the ACR to disable the admin user, either using CLI command ```az acr update --name <my acr> --admin-enabled false```.

### Bring your own ACR

In cases where ACR without admin user already exists, you can associate it with workspace at provisioning time.
Also, if admin user is disallowed by subscription policy, you should first create ACR without admin user, and then associate it with the workspace. 

[Create ACR from Azure CLI](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-azure-cli) without setting ```--admin-enabled``` argument, or from Azure Portal without enabling admin user. Then, when creating Azure Machine Learning Workspace, specify the Azure resource ID of the ACR. For example, use Azure CLI as:

```azurecli-interactive
az ml workspace create -w <workspace name> -g <workspace resource group> -l <region> --container-registry /subscriptions/<subscription id>/resourceGroups/<acr resource group>/providers/Microsoft.ContainerRegistry/registries/<acr name>
```

## Use private ACR for Docker base images using managed identity

You can use managed identities to access private ACR to pull custom Docker base image for training or inferencing. This approach
allows you to secure the base image, for example in case you need to use base image from a repository internal for your enterprise. There are 3 use cases

 * Use base image for training as is
 * Use base image for inferencing as is
 * Build Azure Machine Learning managed image with custom image as base.

### Pull Docker base image to machine learning compute cluster for training as is

Create machine learning compute cluster within your workspace. By default, the cluster has a system-assigned managed identity enabled. Use command 

```azurecli-interactive
az ml computetarget amlcompute identity show --name <cluster name> -w <workspace> -g <resource group>
```

to determine the principal ID of the managed identity.

Optionally, you can update the cluster to assign a user-assigned managed identity:

```azurecli-interactive
az ml computetarget amlcompute identity assign --name cpucluster -w $mlws -g $mlrg --identities
```

Grant the managed service identity ACRPull role on the private ACR

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

Note that you must set user managed dependencies to True and not specify Dockerfile to ensure that base image pulled directly to compute. Otherwise Azure Machine Learning service will attempt to build a new Docker image and fail, because only the compute cluster has access to pull the base image from ACR.

### Pull Docker base image to Azure Kubernetes Service for inferencing as is

When deploying a model as a web service endpoint to Azure Kubernetes Service as inferencing endpoint, you can use the managed idenities to access a private ACR to pull the base image directly to AKS. 

 1. Create AKS cluster with managed identity enabled and attach the cluster to Azure Machine Learning Workspace

 2. Alternatively, create AKS cluster from Azure Machine Learning Workspace.

 3. Find the "agentpool" system-managed assigned identity

 4. Grant the managed service identity ACRPull role on the private ACR as described in previous section.

 5. When deploying web service, specify the base image location in environment definition as described in previous section. 

### Build managed environment into base image from private ACR

Create user-assigned managed identity

Grant the user-assigned managed identity ACRPull access to external ACR

Grant Workspace system-assigned managed identity Managed Identity Operator role on user-assigned managed identity. This role allows Workspace to assign the user-assigned managed identity to ACR Task for building the managed environment.

First obtain the principal Id of Workspace system-assigned managed identity

```azurecli-interactive
az ml workspace show -w <workspace name> -g <resource group> --query identityPrincipalId
```

Then grant this identity Managed Identity Operator role on the user-assigned managed identity created earlier.

```azurecli-interactive
az role assignment create --assignee <principal ID> --role managedidentityoperator --scope <UAI resource ID>
```

Here the UAI resource ID is Azure resource ID of the user assigned identity, in format ```/subscriptions/<subscription ID>/resourceGroups/<resource group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<UAI name>```

Specify external ACR and client ID of user-assigned managed identity in Workspace connections.

Once the configuration is complete, you can use the base images from private ACR when building environments for training or inferencing.
Specify the base image ACR and image name in Environment definition.

```python
from azureml.core import Environment

env = Environment(name="my-env")
env.docker.base_image = "my-acr.azurecr.io/my-repo/my-image:latest"
```

Optionally, you can specify the managed identity resource URL and client ID in environment definition itself.

```python
from azureml.core.container_registry import RegistryIdentity

identity = RegistryIdentity()
identity.resource_id= “<UAI resource ID>"
identity.client_id="<UAI client ID>”
env.docker.base_image_registry.registry_identity=identity
env.docker.base_image = "my-acr.azurecr.io/my-repo/my-image:latest"
```

## Next steps

 * Learn more about [enterprise security in Azure Machine Learning](concept-enterprise-security.md)