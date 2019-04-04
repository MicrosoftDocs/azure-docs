---
title: API server whitelisting in Azure Kubernetes Service (AKS)
description: Learn how to secure your cluster using an IP address whitelist for access to the API server in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 04/04/2019
ms.author: iainfou

#Customer intent: As a cluster operator, I want to increase the security of my cluster by limiting access to the API server to only the IP addresses that I specify.
---

# Preview - Secure access to the API server using an IP address whitelist in Azure Kubernetes Service (AKS)

In Kubernetes, the API server receives requests to perform actions in the cluster such as to create resources or scale the number of nodes. The API server is the central way to interact with and manage a cluster. To improve cluster security and minimize attacks, the API server should only be accessible from a limited set of IP address ranges.

This article shows you how to use the API server IP address whitelist to limit requests to control plane. This feature is currently in preview.

> [!IMPORTANT]
> AKS preview features are self-service and opt-in. Previews are provided to gather feedback and bugs from our community. However, they are not supported by Azure technical support. If you create a cluster, or add these features to existing clusters, that cluster is unsupported until the feature is no longer in preview and graduates to general availability (GA).
>
> If you encounter issues with preview features, [open an issue on the AKS GitHub repo][aks-github] with the name of the preview feature in the bug title.

## Before you begin

API server IP address whitelisting only works for new AKS clusters that you create. This article shows you how to create an AKS cluster using the Azure CLI.

You need the Azure CLI version 2.0.61 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

### Install aks-preview CLI extension

The CLI commands to configure API server IP address whitelisting are available in the *aks-preview* CLI extension. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, as shown in the following example:

```azurecli-interactive
az extension add --name aks-preview
```

> [!NOTE]
> If you've previously installed the *aks-preview* extension, install any available updates using the `az extension update --name aks-preview` command.

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

## Limitations

The following limitations apply when you configure the API server IP address whitelist:

* You cannot currently use Azure Dev Spaces as the communication with the API server is also blocked.

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

To enable the API server IP whitelisting, you provide a list of authorized IP address ranges. When you specify a CIDR range, start with the first IP address in the range. For example, *137.117.106.90/29* is a valid range, but make sure you specify the first IP address in the range, such as *137.117.106.88/29*.

To enable the API server IP address whitelist, you use [az aks update][az-aks-update] command and specify the *--api-server-authorized-ip-ranges* to allow. These IP address ranges are usually address ranges used by your on-premises networks.

The following example enables the API server IP address whitelist on the cluster named *myAKSCluster* in the resource group named *myResourceGroup*. The IP address ranges to add to the whitelist are *172.0.0.10/16* and *168.10.0.10/18*:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --api-server-authorized-ip-ranges 172.0.0.10/16,168.10.0.10/18
```

## Update or disable IP address whitelisting

To update or disable IP whitelisting, you again use [az aks update][az-aks-update] command. Specify the updated CIDR range you wish to allow, or specify an empty range to disable the API server IP address whitelist, as shown in the following example:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --api-server-authorized-ip-ranges ""
```

## Next steps

In this article, you enabled the API server IP address whitelist. This approach is one part of how you can run a secure AKS cluster.

For more information, see [Security concepts for applications and clusters in AKS][concepts-security] and [Best practices for cluster security and upgrades in AKS][operator-best-practices-cluster-security].

<!-- LINKS - external -->
[aks-github]: https://github.com/azure/aks/issues]

<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-aks-update]: /cli/azure/ext/aks-preview/aks#ext-aks-preview-az-aks-update
[concepts-clusters-workloads]: concepts-clusters-workloads.md
[concepts-security]: concepts-security.md
[operator-best-practices-cluster-security]: operator-best-practices-cluster-security.md
[create-aks-sp]: kubernetes-service-principal.md#manually-create-a-service-principal
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-extension-add]: /cli/azure/extension#az-extension-add
