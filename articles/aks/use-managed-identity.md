---
title: Use Managed Identities in Azure Kubernetes Service
description: Learn how to use managed identities in Azure Kubernetes Service (AKS) 
services: container-service
author: saudas
manager: saudas

ms.service: container-service
ms.topic: article
ms.date: 09/11/2019
ms.author: saudas
---

# Preview - Use Managed Identities in Azure Kubernetes Service

Currently, users must provide a service principal or AKS creates one on your behalf in order for the AKS cluster (specifically the Kubernetes cloud provider) to create additional resources like load balancers and managed disks in Azure. Service principals are typically created with an expiration date. Clusters will eventually reach a state where the service principal will need to be renewed otherwise the cluster will not work. Managing service principals adds complexity. Managed Identities are essentially a wrapper around Service Principals and make their management simpler. Read more about [managed identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview) article.

AKS creates two managed identities one a system assigned managed identity and the other a user assigned identity. A system assigned managed identity is used by the kubernetes cloud provider to create Azure resources on behalf of the user. The life cycle of this system assigned managed identity is tied to that of the cluster and is deleted when the cluster is deleted. AKS also creates a User assigned managed identity that is used in the cluster for authorizing AKS to access ACRs, kubelet to get metadata from Azure, etc.

In this preview period, a service principal is still required. It will be used for authorization of add-ons such as monitoring, virtual node, azure policy, and http application routing. There is work ongoing to remove the dependency of the addons on the SPN and eventually SPN requirement in AKS will be removed completely.

> [!IMPORTANT]
> AKS preview features are self-service opt-in. Previews are provided "as-is" and "as available" and are excluded from the service level agreements and limited warranty. AKS Previews are partially covered by customer support on best effort basis. As such, these features are not meant for production use. For additional infromation, please see the following support articles:
>
> * [AKS Support Policies](support-policies.md)
> * [Azure Support FAQ](faq.md)

## Before you begin

You must have the following:

* You also need the Azure CLI version 2.0.70 or later and the aks-preview 0.4.14 extension

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