---
title: Use managed identities in Azure Kubernetes Service
description: Learn how to use managed identities in Azure Kubernetes Service (AKS)
services: container-service
author: mlearned
ms.topic: article
ms.date: 06/04/2020
ms.author: mlearned
---

# Use managed identities in Azure Kubernetes Service

Currently, an Azure Kubernetes Service (AKS) cluster (specifically, the Kubernetes cloud provider) requires an identity to create additional resources like load balancers and managed disks in Azure, this identity can be either a *managed identity* or a *service principal*. If you use a [service principal](kubernetes-service-principal.md), you must either provide one or AKS creates one on your behalf. If you use managed identity, this will be created for you by AKS automatically. Clusters using service principals eventually reach a state in which the service principal must be renewed to keep the cluster working. Managing service principals adds complexity, which is why it's easier to use managed identities instead. The same permission requirements apply for both service principals and managed identities.

*Managed identities* are essentially a wrapper around service principals, and make their management simpler. Credential rotation for MI happens automatically every 46 days according to Azure Active Directory default. To learn more, read about [managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

AKS creates two managed identities:

- **System-assigned managed identity**: The identity that the Kubernetes cloud provider uses to create Azure resources on behalf of the user, such as a [load balancer](load-balancer-standard.md) or [public IP address](static-ip.md). The life cycle of the system-assigned identity is tied to that of the cluster and should only be used by the cloud provider. The identity is deleted when the cluster is deleted.

- **User-assigned managed identity**: The identity that's used for authorization in the cluster and anything else you want to control. For example, the user-assigned identity is used to authorize AKS to use Azure Container Registries (ACRs), or to authorize the kubelet to get metadata from Azure.

Add-ons also authenticate using a managed identity. For each add-on, a managed identity is created by AKS and lasts for the life of the add-on.

## Before you begin

You must have the following resource installed:

- The Azure CLI, version 2.2.0 or later

## Limitations

* AKS clusters with managed identities can be enabled only during creation of the cluster.
* Existing AKS clusters cannot be updated or upgraded to enable managed identities.
* During cluster **upgrade** operations, the managed identity is temporarily unavailable.

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

> [!NOTE]
> For creating and using your own VNet, static IP address, or attached Azure disk where the resources are outside of the MC_* resource group, use the PrincipalID of the cluster System Assigned Managed Identity to perform a role assignment. For more information on role assignment, see [Delegate access to other Azure resources](kubernetes-service-principal.md#delegate-access-to-other-azure-resources).
>
> Permission grants to cluster Managed Identity used by Azure Cloud provider may take up 60 minutes to populate.

Finally, get credentials to access the cluster:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name MyManagedCluster
```

The cluster will be created in a few minutes. You can then deploy your application workloads to the new cluster and interact with it just as you've done with service-principal-based AKS clusters.