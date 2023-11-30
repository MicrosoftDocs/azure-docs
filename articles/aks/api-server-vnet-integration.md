---
title: API Server VNet Integration in Azure Kubernetes Service (AKS)
description: Learn how to create an Azure Kubernetes Service (AKS) cluster with API Server VNet Integration
author: asudbring
ms.author: allensu
ms.subservice: aks-networking
ms.topic: how-to
ms.date: 05/19/2023
ms.custom: references_regions, devx-track-azurecli
---

# Create an Azure Kubernetes Service cluster with API Server VNet Integration (Preview)

An Azure Kubernetes Service (AKS) cluster configured with API Server VNet Integration projects the API server endpoint directly into a delegated subnet in the VNet where AKS is deployed. API Server VNet Integration enables network communication between the API server and the cluster nodes without requiring a private link or tunnel. The API server is available behind an internal load balancer VIP in the delegated subnet, which the nodes are configured to utilize. By using API Server VNet Integration, you can ensure network traffic between your API server and your node pools remains on the private network only.

## API server connectivity

The control plane or API server is in an AKS-managed Azure subscription. Your cluster or node pool is in your Azure subscription. The server and the virtual machines that make up the cluster nodes can communicate with each other through the API server VIP and pod IPs that are projected into the delegated subnet.

API Server VNet Integration is supported for public or private clusters. You can add or remove public access after cluster provisioning. Unlike non-VNet integrated clusters, the agent nodes always communicate directly with the private IP address of the API server internal load balancer (ILB) IP without using DNS. All node to API server traffic is kept on private networking, and no tunnel is required for API server to node connectivity. Out-of-cluster clients needing to communicate with the API server can do so normally if public network access is enabled. If public network access is disabled, you should follow the same private DNS setup methodology as standard [private clusters](private-clusters.md).

## Region availability

API Server VNet Integration is available in all global Azure regions.

## Prerequisites

* Azure CLI with aks-preview extension 0.5.97 or later.
* If using ARM or the REST API, the AKS API version must be 2022-04-02-preview or later.

## Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

* Install the aks-preview extension using the [`az extension add`][az-extension-add] command.

    ```azurecli
    az extension add --name aks-preview
    ```

* Update to the latest version of the extension released using the [`az extension update`][az-extension-update] command.

    ```azurecli
    az extension update --name aks-preview
    ```

## Register the 'EnableAPIServerVnetIntegrationPreview' feature flag

1. Register the `EnableAPIServerVnetIntegrationPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "EnableAPIServerVnetIntegrationPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command:

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "EnableAPIServerVnetIntegrationPreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

## Create an AKS cluster with API Server VNet Integration using managed VNet

You can configure your AKS clusters with API Server VNet Integration in managed VNet or bring-your-own VNet mode. You can create the as public clusters (with API server access available via a public IP) or private clusters (where the API server is only accessible via private VNet connectivity). You can also toggle between a public and private state without redeploying your cluster.

### Create a resource group

* Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create -l westus2 -n <resource-group>
    ```

### Deploy a public cluster

* Deploy a public AKS cluster with API Server VNet integration for managed VNet using the [`az aks create`][az-aks-create] command with the `--enable-api-server-vnet-integration` flag.

    ```azurecli-interactive
    az aks create -n <cluster-name> \
        -g <resource-group> \
        -l <location> \
        --network-plugin azure \
        --enable-apiserver-vnet-integration
    ```

### Deploy a private cluster

* Deploy a private AKS cluster with API Server VNet integration for managed VNet using the [`az aks create`][az-aks-create] command with the `--enable-api-server-vnet-integration` and `--enable-private-cluster` flags.

    ```azurecli-interactive
    az aks create -n <cluster-name> \
        -g <resource-group> \
        -l <location> \
        --network-plugin azure \
        --enable-private-cluster \
        --enable-apiserver-vnet-integration
    ```

## Create a private AKS cluster with API Server VNet Integration using bring-your-own VNet

When using bring-your-own VNet, you must create and delegate an API server subnet to `Microsoft.ContainerService/managedClusters`, which grants the AKS service permissions to inject the API server pods and internal load balancer into that subnet. You can't use the subnet for any other workloads, but you can use it for multiple AKS clusters located in the same virtual network. The minimum supported API server subnet size is a */28*.

The cluster identity needs permissions to both the API server subnet and the node subnet. Lack of permissions at the API server subnet can cause a provisioning failure.

> [!WARNING]
> An AKS cluster reserves at least 9 IPs in the subnet address space. Running out of IP addresses may prevent API server scaling and cause an API server outage.

### Create a resource group

* Create a resource group using the [`az group create`][az-group-create] command.

```azurecli-interactive
az group create -l <location> -n <resource-group>
```

### Create a virtual network

1. Create a virtual network using the [`az network vnet create`][az-network-vnet-create] command.

    ```azurecli-interactive
    az network vnet create -n <vnet-name> \
    -g <resource-group> \
    -l <location> \
    --address-prefixes 172.19.0.0/16
    ```

2. Create an API server subnet using the [`az network vnet subnet create`][az-network-vnet-subnet-create] command.

    ```azurecli-interactive
    az network vnet subnet create -g <resource-group> \
    --vnet-name <vnet-name> \
    --name <apiserver-subnet-name> \
    --delegations Microsoft.ContainerService/managedClusters \
    --address-prefixes 172.19.0.0/28
    ```

3. Create a cluster subnet using the [`az network vnet subnet create`][az-network-vnet-subnet-create] command.

    ```azurecli-interactive
    az network vnet subnet create -g <resource-group> \
    --vnet-name <vnet-name> \
    --name <cluster-subnet-name> \
    --address-prefixes 172.19.1.0/24
    ```

### Create a managed identity and give it permissions on the virtual network

1. Create a managed identity using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    az identity create -g <resource-group> -n <managed-identity-name> -l <location>
    ```

2. Assign the Network Contributor role to the API server subnet using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment create --scope <apiserver-subnet-resource-id> \
    --role "Network Contributor" \
    --assignee <managed-identity-client-id>
    ```

3. Assign the Network Contributor role to the cluster subnet using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment create --scope <cluster-subnet-resource-id> \
    --role "Network Contributor" \
    --assignee <managed-identity-client-id>
    ```

### Deploy a public cluster

* Deploy a public AKS cluster with API Server VNet integration using the [`az aks create`][az-aks-create] command with the `--enable-api-server-vnet-integration` flag.

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

* Deploy a private AKS cluster with API Server VNet integration using the [`az aks create`][az-aks-create] command with the `--enable-api-server-vnet-integration` and `--enable-private-cluster` flags.

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

You can convert existing public/private AKS clusters to API Server VNet Integration clusters by supplying an API server subnet that meets the requirements listed earlier. These requirements include: in the same VNet as the cluster nodes, permissions granted for the AKS cluster identity, and size of at least */28*. Converting your cluster is a one-way migration. Clusters can't have API Server VNet Integration disabled after it's been enabled.

This upgrade performs a node-image version upgrade on all node pools and restarts all workloads while they undergo a rolling image upgrade.

> [!WARNING]
> Converting a cluster to API Server VNet Integration results in a change of the API Server IP address, though the hostname remains the same. If the IP address of the API server has been configured in any firewalls or network security group rules, those rules may need to be updated.

* Update your cluster to API Server VNet Integration using the [`az aks update`][az-aks-update] command with the `--enable-apiserver-vnet-integration` flag.

    ```azurecli-interactive
    az aks update -n <cluster-name> \
    -g <resource-group> \
    --enable-apiserver-vnet-integration \
    --apiserver-subnet-id <apiserver-subnet-resource-id>
    ```

## Enable or disable private cluster mode on an existing cluster with API Server VNet Integration

AKS clusters configured with API Server VNet Integration can have public network access/private cluster mode enabled or disabled without redeploying the cluster. The API server hostname doesn't change, but public DNS entries are modified or removed if necessary.

> [!NOTE]
> `--disable-private-cluster is currently in preview. For more information, see [Reference and support levels][ref-support-levels].

### Enable private cluster mode

* Enable private cluster mode using the [`az aks update`][az-aks-update] command with the `--enable-private-cluster` flag.

    ```azurecli-interactive
    az aks update -n <cluster-name> \
    -g <resource-group> \
    --enable-private-cluster
    ```

### Disable private cluster mode

* Disable private cluster mode using the [`az aks update`][az-aks-update] command with the `--disable-private-cluster` flag.

    ```azurecli-interactive
    az aks update -n <cluster-name> \
    -g <resource-group> \
    --disable-private-cluster
    ```

## Connect to cluster using kubectl

* Configure `kubectl` to connect to your cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials -g <resource-group> -n <cluster-name>
    ```

## Next steps

For associated best practices, see [Best practices for network connectivity and security in AKS][operator-best-practices-network].

<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[private-link-service]: ../private-link/private-link-service-overview.md#limitations
[virtual-network-peering]: ../virtual-network/virtual-network-peering-overview.md
[command-invoke]: command-invoke.md
[operator-best-practices-network]: operator-best-practices-network.md
[az-group-create]: /cli/azure/group#az-group-create
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-network-vnet-create]: /cli/azure/network/vnet#az-network-vnet-create
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az-network-vnet-subnet-create
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[ref-support-levels]: /cli/azure/reference-types-and-status
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
