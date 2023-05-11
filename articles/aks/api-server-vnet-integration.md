---
title: API Server VNet Integration in Azure Kubernetes Service (AKS)
description: Learn how to create an Azure Kubernetes Service (AKS) cluster with API Server VNet Integration
author: asudbring
ms.author: allensu
ms.subservice: aks-networking
ms.topic: how-to
ms.date: 09/09/2022
ms.custom: references_regions, devx-track-azurecli
---

# Create an Azure Kubernetes Service cluster with API Server VNet Integration (Preview)

An Azure Kubernetes Service (AKS) cluster configured with API Server VNet Integration (Preview) projects the API server endpoint directly into a delegated subnet in the VNet where AKS is deployed. API Server VNet Integration enables network communication between the API server and the cluster nodes without requiring a private link or tunnel. The API server is available behind an Internal Load Balancer VIP in the delegated subnet, which the nodes are configured to utilize. By using API Server VNet Integration, you can ensure network traffic between your API server and your node pools remains on the private network only.

## API server connectivity

The control plane or API server is in an Azure Kubernetes Service (AKS)-managed Azure subscription. A customer's cluster or node pool is in the customer's subscription. The server and the virtual machines that make up the cluster nodes can communicate with each other through the API server VIP and pod IPs that are projected into the delegated subnet.

API Server VNet Integration is supported for public or private clusters, and public access can be added or removed after cluster provisioning. Unlike non-VNet integrated clusters, the agent nodes always communicate directly with the private IP address of the API Server Internal Load Balancer (ILB) IP without using DNS. All node to API server traffic is kept on private networking and no tunnel is required for API server to node connectivity. Out-of-cluster clients needing to communicate with the API server can do so normally if public network access is enabled. If public network access is disabled, they should follow the same private DNS setup methodology as standard [private clusters](private-clusters.md).

## Region availability

API Server VNet Integration is available in all global Azure regions.

## Prerequisites

* Azure CLI with aks-preview extension 0.5.97 or later.
* If using ARM or the REST API, the AKS API version must be 2022-04-02-preview or later.

## Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

## Register the 'EnableAPIServerVnetIntegrationPreview' feature flag

Register the `EnableAPIServerVnetIntegrationPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "EnableAPIServerVnetIntegrationPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "EnableAPIServerVnetIntegrationPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Limitations

* Existing AKS private clusters can't be converted to API Server VNet Integration clusters.
* [Private Link Service][private-link-service] won't work if deployed against the API Server injected addresses. The API server can't be exposed to other virtual networks using private link. To access the API server from outside the cluster network, utilize either [VNet peering][virtual-network-peering] or [AKS run command][command-invoke].

## Create an AKS cluster with API Server VNet Integration using Managed VNet

AKS clusters with API Server VNet Integration can be configured in either managed VNet or bring-your-own VNet mode. They can be created as either public clusters (with API server access available via a public IP) or private clusters (where the API server is only accessible via private VNet connectivity), and can be toggled between these two states without redeploying.

### Create a resource group

Create a resource group or use an existing resource group for your AKS cluster.

```azurecli-interactive
az group create -l westus2 -n <resource-group>
```

### Deploy a public cluster

```azurecli-interactive
az aks create -n <cluster-name> \
    -g <resource-group> \
    -l <location> \
    --network-plugin azure \
    --enable-apiserver-vnet-integration
```

The `--enable-apiserver-vnet-integration` flag configures API Server VNet integration for Managed VNet mode.

### Deploy a private cluster

```azurecli-interactive
az aks create -n <cluster-name> \
    -g <resource-group> \
    -l <location> \
    --network-plugin azure \
    --enable-private-cluster \
    --enable-apiserver-vnet-integration
```

The `--enable-private-cluster` flag is mandatory for a private cluster, and `--enable-apiserver-vnet-integration` configures API Server VNet integration for Managed VNet mode.

## Create an AKS Private cluster with API Server VNet Integration using bring-your-own VNet

When using bring-your-own VNet, an API server subnet must be created and delegated to `Microsoft.ContainerService/managedClusters`. This grants the AKS service permissions to inject the API server pods and internal load balancer into that subnet. The subnet may not be used for any other workloads, but may be used for multiple AKS clusters located in the same virtual network. An AKS cluster will require from 2-7 IP addresses depending on cluster scale. The minimum supported API server subnet size is a /28.

The cluster identity needs permissions to both the API server subnet and the node subnet. Lack of permissions at the API server subnet can cause a provisioning failure.

> [!WARNING]
> Running out of IP addresses may prevent API server scaling and cause an API server outage.

### Create a resource group

Create a resource group or use an existing resource group for your AKS cluster.

```azurecli-interactive
az group create -l <location> -n <resource-group>
```

### Create a virtual network

```azurecli-interactive
# Create the virtual network
az network vnet create -n <vnet-name> \
    -g <resource-group> \
    -l <location> \
    --address-prefixes 172.19.0.0/16

# Create an API server subnet
az network vnet subnet create -g <resource-group> \
    --vnet-name <vnet-name> \
    --name <apiserver-subnet-name> \
    --delegations Microsoft.ContainerService/managedClusters \
    --address-prefixes 172.19.0.0/28

# Create a cluster subnet
az network vnet subnet create -g <resource-group> \
    --vnet-name <vnet-name> \
    --name <cluster-subnet-name> \
    --address-prefixes 172.19.1.0/24
```

### Create a managed identity and give it permissions on the virtual network

```azurecli-interactive
# Create the identity
az identity create -g <resource-group> -n <managed-identity-name> -l <location>

# Assign Network Contributor to the API server subnet
az role assignment create --scope <apiserver-subnet-resource-id> \
    --role "Network Contributor" \
    --assignee <managed-identity-client-id>

# Assign Network Contributor to the cluster subnet
az role assignment create --scope <cluster-subnet-resource-id> \
    --role "Network Contributor" \
    --assignee <managed-identity-client-id>
```

### Deploy a public cluster

```azurecli-interactive
az aks create -n <cluster-name> \
    -g <resource-group> \
    -l <location> \
    --network-plugin azure \
    --enable-apiserver-vnet-integration \
    --vnet-subnet-id <cluster-subnet-resource-id> \
    --apiserver-subnet-id <apiserver-subnet-resource-id> \
    --assign-identity <managed-identity-resource-id>
```

### Deploy a private cluster

```azurecli-interactive
az aks create -n <cluster-name> \
    -g <resource-group> \
    -l <location> \
    --network-plugin azure \
    --enable-private-cluster \
    --enable-apiserver-vnet-integration \
    --vnet-subnet-id <cluster-subnet-resource-id> \
    --apiserver-subnet-id <apiserver-subnet-resource-id> \
    --assign-identity <managed-identity-resource-id>
```

## Convert an existing AKS cluster to API Server VNet Integration

Existing AKS public clusters can be converted to API Server VNet Integration clusters by supplying an API server subnet that meets the requirements listed earlier (in the same VNet as the cluster nodes, permissions granted for the AKS cluster identity, and size of at least /28). This is a one-way migration; clusters can't have API Server VNet Integration disabled after it's been enabled.

This upgrade performs a node-image version upgrade on all node pools - all workloads are restarted while they undergo a rolling image upgrade.

> [!WARNING]
> Converting a cluster to API Server VNet Integration results in a change of the API Server IP address, though the hostname remains the same. If the IP address of the API server has been configured in any firewalls or network security group rules, those rules may need to be updated.

```azurecli-interactive
az aks update -n <cluster-name> \
    -g <resource-group> \
    --enable-apiserver-vnet-integration \
    --apiserver-subnet-id <apiserver-subnet-resource-id>
```

## Enable or disable private cluster mode on an existing cluster with API Server VNet Integration

AKS clusters configured with API Server VNet Integration can have public network access/private cluster mode enabled or disabled without redeploying the cluster. The API server hostname doesn't change, but public DNS entries are modified or removed if necessary.

### Enable private cluster mode

```azurecli-interactive
az aks update -n <cluster-name> \
    -g <resource-group> \
    --enable-private-cluster
```

### Disable private cluster mode

```azurecli-interactive
az aks update -n <cluster-name> \
    -g <resource-group> \
    --disable-private-cluster
```

## Next steps

For associated best practices, see [Best practices for network connectivity and security in AKS][operator-best-practices-network].

<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[private-link-service]: ../private-link/private-link-service-overview.md#limitations
[private-endpoint-service]: ../private-link/private-endpoint-overview.md
[virtual-network-peering]: ../virtual-network/virtual-network-peering-overview.md
[azure-bastion]: ../bastion/tutorial-create-host-portal.md
[express-route-or-vpn]: ../expressroute/expressroute-about-virtual-network-gateways.md
[devops-agents]: /azure/devops/pipelines/agents/agents
[availability-zones]: availability-zones.md
[command-invoke]: command-invoke.md
[container-registry-private-link]: ../container-registry/container-registry-private-link.md
[virtual-networks-name-resolution]: ../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server
[operator-best-practices-network]: operator-best-practices-network.md
