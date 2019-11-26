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

# Preview - Use managed identities in Azure Kubernetes Service

Currently, an Azure Kubernetes Service (AKS) cluster (specifically, the Kubernetes cloud provider) requires a *service principal* to create additional resources like load balancers and managed disks in Azure. Either you must provide a service principal or AKS creates one on your behalf. Service principals typically have an expiration date. Clusters eventually reach a state in which the service principal must be renewed to keep the cluster working. Managing service principals adds complexity.

*Managed identities* are essentially a wrapper around service principals, and make their management simpler. To learn more, read about [managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

AKS creates two managed identities:

- **System-assigned managed identity**: The identity that the Kubernetes cloud provider uses to create Azure resources on behalf of the user. The life cycle of the system-assigned identity is tied to that of the cluster. The identity is deleted when the cluster is deleted.
- **User-assigned managed identity**: The identity that's used for authorization in the cluster. For example, the user-assigned identity is used to authorize AKS to use access control records (ACRs), or to authorize the kubelet to get metadata from Azure.

In this preview period, a service principal is still required. It's used for authorization of add-ons such as monitoring, virtual nodes, Azure Policy, and HTTP application routing. Work is underway to remove the dependency of add-ons on the service principal name (SPN). Eventually, the requirement of an SPN in AKS will be removed completely.

> [!IMPORTANT]
> AKS preview features are available on a self-service, opt-in basis. Previews are provided "as-is" and "as available," and are excluded from the Service Level Agreements and limited warranty. AKS previews are partially covered by customer support on best-effort basis. As such, these features are not meant for production use. For more information, see the following support articles:
>
> - [AKS Support Policies](support-policies.md)
> - [Azure Support FAQ](faq.md)

## Before you begin

You must have the following resources installed:

- The Azure CLI, version 2.0.70 or later
- The aks-preview 0.4.14 extension

To install the aks-preview 0.4.14 extension or later, use the following Azure CLI commands:

```azurecli
az extension add --name aks-preview
az extension list
```

> [!CAUTION]
> After you register a feature on a subscription, you can't currently unregister that feature. When you enable some preview features, defaults might be used for all AKS clusters created afterward in the subscription. Don't enable preview features on production subscriptions. Instead, use a separate subscription to test preview features and gather feedback.

```azurecli-interactive
az feature register --name MSIPreview --namespace Microsoft.ContainerService
```

It might take several minutes for the status to show as **Registered**. You can check the registration status by using the [az feature list](https://docs.microsoft.com/cli/azure/feature?view=azure-cli-latest#az-feature-list) command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/MSIPreview')].{Name:name,State:properties.state}"
```

When the status shows as registered, refresh the registration of the `Microsoft.ContainerService` resource provider by using the [az provider register](https://docs.microsoft.com/cli/azure/provider?view=azure-cli-latest#az-provider-register) command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

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

Finally, get credentials to access the cluster:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name MyManagedCluster
```

The cluster will be created in a few minutes. You can then deploy your application workloads to the new cluster and interact with it just as you've done with service-principal-based AKS clusters.

> [!IMPORTANT]
>
> - AKS clusters with managed identities can be enabled only during creation of the cluster.
> - Existing AKS clusters cannot be updated or upgraded to enable managed identities.
