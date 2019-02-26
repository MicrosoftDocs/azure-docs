---
title: API server whitelisting in Azure Kubernetes Service (AKS)
description: Learn how to secure your cluster using an IP address whitelist for access to the API server in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 02/20/2019
ms.author: iainfou
---

# Secure access to the API server using an IP address whitelist in Azure Kubernetes Service (AKS)

In Kubernetes, the API server receives requests to perform actions in the cluster such as to create resources or scale the number of nodes. The API server is the central way to interact with and manage a cluster. To improve cluster security and minimize attacks, the API server should only be accessible from a limited set of IP address ranges.

This article shows you how to use the API server IP address whitelist to limit requests to control plane.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

As the current preview deployment steps use a Resource Manager template, you also need to first [manually create a service principal][create-aks-sp].

### Azure CLI requirements

You need the Azure CLI version 2.0.58 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

To use the API server IP address whitelist, you need the *aks-preview* Azure CLI extension. Install this extension using the [az extension add][az-extension-add] command, as shown in the following example:

```azurecli-interactive
az extension add --name aks-preview
```

### Register feature flag for your subscription

To use the API server IP address whitelist, first enable a feature flag on your subscription. To register the *APIServerSecurityPreview* feature flag, use the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --name APIServerSecurityPreview --namespace Microsoft.ContainerService
```

It takes a few minutes for the status to show *Registered*. You can check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/APIServerSecurityPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Overview of API server IP address whitelisting

The Kubernetes API server is how the underlying Kubernetes APIs are exposed. This component provides the interaction for management tools, such as `kubectl` or the Kubernetes dashboard. AKS provides a single-tenant cluster master, with a dedicated API server. By default, the API server is assigned a public IP address, and you should control access using role-based access controls (RBAC).

To run a more secure AKS cluster, you can enable and use an IP address whitelist. This whitelist only allows defined IP address ranges to communicate with the API server. A request made to the API server from an IP address that is not part of this whitelist is blocked. You should continue to use RBAC to then authorize users and the actions they request.

For more information about the API server and other cluster components, see [Kubernetes core concepts for AKS][concepts-clusters-workloads].

## Enable IP address whitelisting

Update *parameters-with-whitelisting.json* with your own service principal client ID and secret, such as in the following example:

```json
"servicePrincipalClientId": {
    "value": "d017b0f2-9d78-47c2-982a-4a85ba95a7f0"
},
"servicePrincipalClientSecret": {
    "value": "98749598-5e53-4d5e-bb83-dd4f45884624"
},
```

Adjust the *parameters-with-whitelisting.json* to whitelist the IP address ranges for your environment. Provide IP address ranges in CIDR format and in a comma-separated list, as shown in the following example:

```json
"apiServerAuthorizedIPRanges": {
    "value": ["40.71.84.169/32", "131.107.0.0/16", "167.220.2.74/32"]
}
```

Now create a resource group, such as *myResourceGroup*, in your approved region and then deploy the Resource Manager template:

```azurecli-interactive
az group create --name myResourceGroup --location eastus

az group deployment create \
    --resource-group myResourceGroup \
    --template-file template-with-whitelisting.json \
    --parameters parameters-with-whitelisting.json
```

<!--

** THESE ARE THE PROPOSED CLI COMMANDS. THESE WILL REPLACE THE TEMPLATE-DRIVEN APPROACH **

To enable the API server IP address whitelist, you use [az aks update][az-aks-update] command and specify the *--api-server-authorized-ip-ranges* to allow. These IP address ranges are usually address ranges used by your on-premises networks.

The following example enables the API server IP address whitelist on the cluster named *myAKSCluster* in the resource group named *myResourceGroup*. The IP address ranges to add to the whitelist are *172.0.0.10/16* and *168.10.0.10/18*:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --api-server-authorized-ip-ranges 172.0.0.10/16,168.10.0.10/18
```

-->

## Update or disable IP address whitelisting

To update or disable IP whitelisting, edit the *parameters-with-whitelisting.json* again. Change the permitted CIDR ranges, or set `"value": null` to provide an empty range of IP addresses and allow public access:

```json
"apiServerAuthorizedIPRanges": {
    "value": ["40.71.84.169/32", "131.107.0.0/16", "167.220.2.74/32"]
}
```

Redeploy the Resource Manager template to perform an incremental update of the AKS cluster with your permitted IP address ranges:

```azurecli-interactive
az group deployment create \
    --resource-group myResourceGroup \
    --template-file template-with-whitelisting.json \
    --parameters parameters-with-whitelisting.json
```

<!--

** THESE ARE THE PROPOSED CLI COMMANDS. THESE WILL REPLACE THE TEMPLATE-DRIVEN APPROACH **

To disable the API server IP address whitelist, you again use [az aks update][az-aks-update] command and specify an empty *--api-server-authorized-ip-ranges* as shown in the following example:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --api-server-authorized-ip-ranges ""
```

-->

## Next steps

In this article, you enabled the API server IP address whitelist. This approach is one part of how you can run a secure AKS cluster.

For more information, see [Security concepts for applications and clusters in AKS][concepts-security] and [Best practices for cluster security and upgrades in AKS][operator-best-practices-cluster-security].

<!-- LINKS - external -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-aks-update]: /cli/azure/ext/aks-preview/aks#ext-aks-preview-az-aks-update
[concepts-clusters-workloads]: concepts-clusters-workloads.md
[concepts-security]: concepts-security.md
[operator-best-practices-cluster-security]: operator-best-practices-cluster-security.md
[create-aks-sp]: kubernetes-service-principal.md#manually-create-a-service-principal