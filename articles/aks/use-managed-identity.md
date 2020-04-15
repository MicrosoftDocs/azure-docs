---
title: Use managed identities in Azure Kubernetes Service
description: Learn how to use managed identities in Azure Kubernetes Service (AKS)
services: container-service
author: saudas
manager: saudas
ms.topic: article
ms.date: 04/02/2020
ms.author: saudas
---

# Use managed identities in Azure Kubernetes Service

Currently, an Azure Kubernetes Service (AKS) cluster (specifically, the Kubernetes cloud provider) requires and identity to create additional resources like load balancers and managed disks in Azure, this identity can be either a *managed identity* or a *service principal*. If you use a [service principal](kubernetes-service-principal.md), you must either provide one or AKS creates one on your behalf. If you use managed identity, this will be created for you by AKS automatically. Clusters using service principals eventually reach a state in which the service principal must be renewed to keep the cluster working. Managing service principals adds complexity, which is why it's easier to use managed identities instead. The same permission requirements apply for both service principals and managed identities.

*Managed identities* are essentially a wrapper around service principals, and make their management simpler. To learn more, read about [managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

AKS creates two managed identities:

- **System-assigned managed identity**: The identity that the Kubernetes cloud provider uses to create Azure resources on behalf of the user. The life cycle of the system-assigned identity is tied to that of the cluster. The identity is deleted when the cluster is deleted.
- **User-assigned managed identity**: The identity that's used for authorization in the cluster. For example, the user-assigned identity is used to authorize AKS to use Azure Container Registries (ACRs), or to authorize the kubelet to get metadata from Azure.

Add-ons also authenticate using a managed identity. For each add-on, a managed identity is created by AKS and lasts for the life of the add-on. For creating and using your own VNet, static IP address, or attached Azure disk where the resources are outside of the MC_* resource group, use the PrincipalID of the cluster to perform a role assignment. For more information on role assignment, see [Delegate access to other Azure resources](kubernetes-service-principal.md#delegate-access-to-other-azure-resources).

## Before you begin

You must have the following resource installed:

- The Azure CLI, version 2.2.0 or later

## Create an AKS cluster with managed identities

You can now create an AKS cluster with managed identities by using the following CLI commands.

First, create an Azure resource group:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location westus2
```

Then, create an AKS cluster:

```azurecli-interactive
az aks create -g MyResourceGroup -n MyManagedCluster --enable-managed-identity
```

A successful cluster creation using managed identities contains this service principal profile information:

```json
"servicePrincipalProfile": {
    "clientId": "msi",
    "secret": null
  }
```

Finally, get credentials to access the cluster:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name MyManagedCluster
```

The cluster will be created in a few minutes. You can then deploy your application workloads to the new cluster and interact with it just as you've done with service-principal-based AKS clusters.

> [!IMPORTANT]
>
> - AKS clusters with managed identities can be enabled only during creation of the cluster.
> - Existing AKS clusters cannot be updated or upgraded to enable managed identities.
