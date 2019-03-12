---
title: API server whitelisting in Azure Kubernetes Service (AKS)
description: Learn how to secure your cluster using an IP address whitelist for access to the API server in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 03/07/2019
ms.author: iainfou

#Customer intent: As a cluster operator, I want to increase the security of my cluster by limiting access to the API server to only the IP addresses that I specify.
---

# Secure access to the API server using an IP address whitelist in Azure Kubernetes Service (AKS)

In Kubernetes, the API server receives requests to perform actions in the cluster such as to create resources or scale the number of nodes. The API server is the central way to interact with and manage a cluster. To improve cluster security and minimize attacks, the API server should only be accessible from a limited set of IP address ranges.

This article shows you how to use the API server IP address whitelist to limit requests to control plane.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Before you begin

API server IP address whitelisting only works for new AKS clusters that you create. This article shows you how to create an AKS cluster using the Azure CLI. You can instead create an AKS cluster [using the Azure portal][aks-quickstart-portal].

### Azure CLI requirements

You need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

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

To secure access to the otherwise publicly accessible AKS control plane / API server, you can enable and use an IP address whitelist. This whitelist only allows defined IP address ranges to communicate with the API server. A request made to the API server from an IP address that is not part of this whitelist is blocked. You should continue to use RBAC to then authorize users and the actions they request.

To use the IP address whitelist functionality, a public IP address is exposed on the node pool by deploying a basic NGINX service. The API server communicates with the node pool through this whitelisted public IP address. You then define additional IP address ranges that can access the API server.

For more information about the API server and other cluster components, see [Kubernetes core concepts for AKS][concepts-clusters-workloads].

## Create an AKS cluster

API server IP address whitelisting only works for new AKS clusters. You can't enable the IP address whitelisting as part of the cluster create operation. If you try to enable whitelisting as part of the cluster create process, the cluster nodes are unable to access the API server during deployment as the egress IP address isn't defined at that point.

First, create a cluster using the [az aks create][az-aks-create] command. The following example creates a single-node cluster named *myAKSCluster* in the resource group named *myResourceGroup*.

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location eastus

# Create an AKS cluster
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --generate-ssh-keys
```

## Enable IP address whitelisting

To enable the API server IP whitelisting and provide a list of authorized IP address ranges, you update an AKS cluster using a Resource Manager template. In the template, parameters are defined for the cluster name and location, then a comma-separated list of CIDR ranges for access to the API server.

When you specify a CIDR range, start with the first IP address in the range. For example, *137.117.106.90/29* is a valid range, but make sure you specify the first IP address in the range, such as *137.117.106.88/29*.

Create a file name `api-server-ip-whitelist.json` and paste the following Resource Manager template. In this example, the existing cluster is named *myAKSCluster* in the *eastus* region. A single IP address of *172.56.42.28/32* is then authorized to access the API server. Update these values to match your own cluster name and location, and CIDR range(s) to access the API server:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",

    "parameters": {
        "resourceName": {
            "type": "string",
            "metadata": {
                "description": "The name of your existing AKS cluster resource."
            },
            "defaultValue": "myAKSCluster"
        },
        "location": {
            "type": "string",
            "metadata": {
                "description": "The location of your existing AKS cluster resource."
            },
            "defaultValue": "eastus"
        },
        "apiServerAuthorizedIPRanges": {
            "type": "array",
            "metadata": {
                "description": "An array of CIDR to be whitelisted to kube-apiserver"
            },
            "defaultValue": ["172.56.42.28/32"]
        }
    },

    "resources": [
        {
            "apiVersion": "2019-02-01",
            "type": "Microsoft.ContainerService/managedClusters",
            "location": "[parameters('location')]",
            "name": "[parameters('resourceName')]",
            "properties": {
                "apiServerAuthorizedIPRanges": "[parameters('apiServerAuthorizedIPRanges')]"
            }
        }
    ]
}
```

To update your AKS cluster with the API server IP address whitelist, deploy the Resource Manager template using the [az group deployment create][az-group-deployment-create] command. This process creates an incremental deployment against your existing AKS cluster resource:

```azurecli-interactive
az group deployment create \
    --resource-group myResourceGroup \
    --template-file api-server-ip-whitelist.json
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

To update or disable IP whitelisting, edit the *api-server-ip-whitelist.json* again. Change the permitted CIDR ranges, or set `"defaultValue": []` to provide an empty range of IP addresses and allow public access, as shown in the following example.

```json
        "apiServerAuthorizedIPRanges": {
            "type": "array",
            "metadata": {
                "description": "An array of CIDR to be whitelisted to kube-apiserver"
            },
            "defaultValue": []
        }
```

Redeploy the Resource Manager template using the [az group deployment create][az-group-deployment-create] command:

```azurecli-interactive
az group deployment create \
    --resource-group myResourceGroup \
    --template-file api-server-ip-whitelist.json
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
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-aks-update]: /cli/azure/ext/aks-preview/aks#ext-aks-preview-az-aks-update
[concepts-clusters-workloads]: concepts-clusters-workloads.md
[concepts-security]: concepts-security.md
[operator-best-practices-cluster-security]: operator-best-practices-cluster-security.md
[create-aks-sp]: kubernetes-service-principal.md#manually-create-a-service-principal
[az-group-deployment-create]: /cli/azure/group/deployment#az-group-deployment-create
[az-aks-create]: /cli/azure/aks#az-aks-create
