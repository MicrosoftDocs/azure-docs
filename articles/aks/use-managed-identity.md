---
title: Use managed identities in Azure Kubernetes Service
description: Learn how to use managed identities in Azure Kubernetes Service (AKS) 
services: container-service
author: saudas
manager: saudas

ms.service: container-service
ms.topic: article
ms.date: 09/11/2019
ms.author: saudas
---

# Preview: Use managed identities in Azure Kubernetes Service

Currently, The Azure Kubernetes Service (AKS) cluster (specifically, the Kubernetes cloud provider) requires a *service principal* to create additional resources like load balancers and managed disks in Azure. You must provide a service principal, or AKS creates one on your behalf. Service principals typically have an expiration date. Clusters eventually reach a state in which the service principal must be renewed to keep the cluster working. Managing service principals adds complexity.

*Managed identities* are essentially a wrapper around service principals, and make their management simpler. To learn more, read about [managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

AKS creates two managed identities: a *system-assigned managed identity* and a *user-assigned identity*. The Kubernetes cloud provider uses the system-assigned managed identity to create Azure resources on behalf of the user. The life cycle of this system-assigned identity is tied to that of the cluster, and the identity is deleted when the cluster is deleted. The user-assigned managed identity is used for authorization in the cluster: for example, to authorize AKS to access ACRs, or to authorize the kubelet to get metadata from Azure.

In this preview period, a service principal is still required. It's used for authorization of add-ons such as monitoring, virtual node, Azure policy, and HTTP application routing. Work is underway to remove the dependency of add-ons on the service principal SPN, and eventually the requirement of a service principal SPN in AKS will be removed completely.

> [!IMPORTANT]
> AKS preview features are self-service opt-in. Previews are provided "as-is" and "as available" and are excluded from the service level agreements and limited warranty. AKS Previews are partially covered by customer support on best effort basis. As such, these features are not meant for production use. For more information, see the following support articles:
>
> * [AKS Support Policies](support-policies.md)
> * [Azure Support FAQ](faq.md)

## Before you begin

You must have the following:

* The Azure CLI version 2.0.70 or later
* The aks-preview 0.4.14 extension

## Install latest AKS CLI preview extension

You need the **aks-preview 0.4.14** extension or later.

```azurecli
az extension update --name aks-preview 
az extension list
```

> [!CAUTION]
> When you register a feature on a subscription, you can't currently un-register that feature. After you enable some preview features, defaults may be used for all AKS clusters then created in the subscription. Don't enable preview features on production subscriptions. Use a separate subscription to test preview features and gather feedback.

```azurecli-interactive
az feature register --name MSIPreview --namespace Microsoft.ContainerService
```

It may take several minutes for the status to show *Registered*. You can check on the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/MSIPreview')].{Name:name,State:properties.state}"
```

When the state is registered, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Create an AKS cluster with managed identity

You can now create an AKS cluster with managed identities using the following CLI command
```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location westus2
```

## Create an AKS cluster
```azurecli-interactive
az aks create -g MyResourceGroup -n MyManagedCluster --enable-managed-identity
```

## Get credentials to access the cluster
```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name MyManagedCluster
```
Once the cluster is created in a few minutes, you can deploy your application workloads and interact with it as you have been with service principal based AKS clusters. 

> [!IMPORTANT]
> * AKS clusters with managed identities can only be enabled during creation of the cluster
> * Existing AKS clusters cannot be updated/upgraded to enable managed identities