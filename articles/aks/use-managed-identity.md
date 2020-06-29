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

Currently, an Azure Kubernetes Service (AKS) cluster (specifically, the Kubernetes cloud provider) requires an identity to create additional resources like load balancers and managed disks in Azure. This identity can be either a *managed identity* or a *service principal*. If you use a [service principal](kubernetes-service-principal.md), you must either provide one or AKS creates one on your behalf. If you use managed identity, this will be created for you by AKS automatically. Clusters using service principals eventually reach a state in which the service principal must be renewed to keep the cluster working. Managing service principals adds complexity, which is why it's easier to use managed identities instead. The same permission requirements apply for both service principals and managed identities.

*Managed identities* are essentially a wrapper around service principals, and make their management simpler. Credential rotation for MI happens automatically every 46 days according to Azure Active Directory default. AKS uses both system-assigned and user-assigned managed identity types. These identities are currently immutable. To learn more, read about [managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

## Before you begin

You must have the following resource installed:

- The Azure CLI, version 2.2.0 or later

## Limitations

* Bring your own managed identities is not currently supported.
* AKS clusters with managed identities can be enabled only during creation of the cluster.
* Existing AKS clusters cannot be updated or upgraded to enable managed identities.
* During cluster **upgrade** operations, the managed identity is temporarily unavailable.

## Summary of managed identities

AKS uses several managed identities for built-in services and add-ons.

| Identity                       | Name    | Use case | Default permissions | Bring your own identity
|----------------------------|-----------|----------|
| Control plane | not visible | Used by AKS to manage networking resources e.g. create a load balancer for ingress, public IP, etc.| Contributor role for Node resource group | Not currently supported
| Kubelet | AKS Cluster Name-agentpool | Authentication with Azure Container Registry (ACR) | Reader role for node resource group | Not currently supported
| Add-on | AzureNPM | No identity required | NA | No
| Add-on | AzureCNI network monitoring | No identity required | NA | No
| Add-on | azurepolicy (gatekeeper) | No identity required | NA | No
| Add-on | azurepolicy | No identity required | NA | No
| Add-on | Calico | No identity required | NA | No
| Add-on | Dashboard | No identity required | NA | No
| Add-on | HTTPApplicationRouting | Manages required network resources | Reader role for node resource group, contributor role for DNS zone | No
| Add-on | Ingress application gateway | Manages required network resources| Contributor role for node resource group | No
| Add-on | omsagent | Used to send AKS metrics to Azure Monitor | Monitoring Metrics Publisher role | No
| Add-on | Virtual-Node (ACIConnector) | Manages required network resources for Azure Container Instances (ACI) | Contributor role for node resource group | No


## Create an AKS cluster with managed identities

You can now create an AKS cluster with managed identities by using the following CLI commands.

First, create an Azure resource group:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location westus2
```

Then, create an AKS cluster:

```azurecli-interactive
az aks create -g myResourceGroup -n myManagedCluster --enable-managed-identity
```

A successful cluster creation using managed identities contains this service principal profile information:

```json
"servicePrincipalProfile": {
    "clientId": "msi"
  }
```

Use the following command to query objectid of your control plane managed identity:

```azurecli-interactive
az aks show -g myResourceGroup -n MyManagedCluster --query "identity"
```

The result should look like:

```json
{
  "principalId": "<object_id>",   
  "tenantId": "<tenant_id>",      
  "type": "SystemAssigned"                                 
}
```

> [!NOTE]
> For creating and using your own VNet, static IP address, or attached Azure disk where the resources are outside of the worker node resource group, use the PrincipalID of the cluster System Assigned Managed Identity to perform a role assignment. For more information on role assignment, see [Delegate access to other Azure resources](kubernetes-service-principal.md#delegate-access-to-other-azure-resources).
>
> Permission grants to cluster Managed Identity used by Azure Cloud provider may take up 60 minutes to populate.

Finally, get credentials to access the cluster:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name MyManagedCluster
```

The cluster will be created in a few minutes. You can then deploy your application workloads to the new cluster and interact with it just as you've done with service-principal-based AKS clusters.
