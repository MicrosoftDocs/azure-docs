---
title: Configure kubenet networking in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to configure kubenet (basic) network in Azure Kubernetes Service (AKS) to deploy an AKS cluster into an existing virtual network and subnet.
author: asudbring
ms.author: allensu
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 05/02/2023
---

# Use kubenet networking with your own IP address ranges in Azure Kubernetes Service (AKS)

AKS clusters use [kubenet][kubenet] and create an Azure virtual network and subnet for you by default. With kubenet, nodes get an IP address from the Azure virtual network subnet. Pods receive an IP address from a logically different address space to the Azure virtual network subnet of the nodes. Network address translation (NAT) is then configured so the pods can reach resources on the Azure virtual network. The source IP address of the traffic is NAT'd to the node's primary IP address. This approach greatly reduces the number of IP addresses you need to reserve in your network space for pods to use.

With [Azure Container Networking Interface (CNI)][cni-networking], every pod gets an IP address from the subnet and can be accessed directly. These IP addresses must be planned in advance and unique across your network space. Each node has a configuration parameter for the maximum number of pods it supports. The equivalent number of IP addresses per node are then reserved up front for that node. This approach requires more planning, and often leads to IP address exhaustion or the need to rebuild clusters in a larger subnet as your application demands grow. You can configure the maximum pods deployable to a node at cluster creation time or when creating new node pools. If you don't specify `maxPods` when creating new node pools, you receive a default value of *110* for kubenet.

This article shows you how to use kubenet networking to create and use a virtual network subnet for an AKS cluster. For more information on network options and considerations, see [Network concepts for Kubernetes and AKS][aks-network-concepts].

## Prerequisites

* The virtual network for the AKS cluster must allow outbound internet connectivity.
* Don't create more than one AKS cluster in the same subnet.
* AKS clusters can't use `169.254.0.0/16`, `172.30.0.0/16`, `172.31.0.0/16`, or `192.0.2.0/24` for the Kubernetes service address range, pod address range, or cluster virtual network address range. The range can't be updated after you create your cluster.
* The cluster identity used by the AKS cluster must at least have the [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor) role on the subnet within your virtual network. CLI helps set the role assignment automatically. If you're using an ARM template or other clients, you need to manually set the role assignment. You must also have the appropriate permissions, such as the subscription owner, to create a cluster identity and assign it permissions. If you want to define a [custom role](../role-based-access-control/custom-roles.md) instead of using the built-in Network Contributor role, you need the following permissions:
  * `Microsoft.Network/virtualNetworks/subnets/join/action`
  * `Microsoft.Network/virtualNetworks/subnets/read`

> [!WARNING]
> To use Windows Server node pools, you must use Azure CNI. The kubenet network model isn't available for Windows Server containers.

## Before you begin

You need the Azure CLI version 2.0.65 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Overview of kubenet networking with your own subnet

In many environments, you have defined virtual networks and subnets with allocated IP address ranges, and you use these resources to support multiple services and applications. To provide network connectivity, AKS clusters can use *kubenet* (basic networking) or Azure CNI (*advanced networking*).

With *kubenet*, only the nodes receive an IP address in the virtual network subnet. Pods can't communicate directly with each other. Instead, User Defined Routing (UDR) and IP forwarding handle connectivity between pods across nodes. UDRs and IP forwarding configuration is created and maintained by the AKS service by default, but you can [bring your own route table for custom route management][byo-subnet-route-table] if you want. You can also deploy pods behind a service that receives an assigned IP address and load balances traffic for the application. The following diagram shows how the AKS nodes receive an IP address in the virtual network subnet, but not the pods:

![Kubenet network model with an AKS cluster](media/use-kubenet/kubenet-overview.png)

Azure supports a maximum of *400* routes in a UDR, so you can't have an AKS cluster larger than 400 nodes. AKS [virtual nodes][virtual-nodes] and Azure Network Policies aren't supported with *kubenet*. [Calico Network Policies][calico-network-policies] are supported.

With *Azure CNI*, each pod receives an IP address in the IP subnet and can communicate directly with other pods and services. Your clusters can be as large as the IP address range you specify. However, you must plan the IP address range in advance, and all the IP addresses are consumed by the AKS nodes based on the maximum number of pods they can support. Advanced network features and scenarios such as [virtual nodes][virtual-nodes] or Network Policies (either Azure or Calico) are supported with *Azure CNI*.

### Limitations & considerations for kubenet

* An additional hop is required in the design of kubenet, which adds minor latency to pod communication.
* Route tables and user-defined routes are required for using kubenet, which adds complexity to operations.
* Direct pod addressing isn't supported for kubenet due to kubenet design.
* Unlike Azure CNI clusters, multiple kubenet clusters can't share a subnet.
* AKS doesn't apply Network Security Groups (NSGs) to its subnet and doesn't modify any of the NSGs associated with that subnet. If you provide your own subnet and add NSGs associated with that subnet, you must ensure the security rules in the NSGs allow traffic between the node and pod CIDR. For more details, see [Network security groups][aks-network-nsg].
* Features **not supported on kubenet** include:
  * [Azure network policies](use-network-policies.md#create-an-aks-cluster-and-enable-network-policy)
  * [Windows node pools](./windows-faq.md)
  * [Virtual nodes add-on](virtual-nodes.md#network-requirements)

### IP address availability and exhaustion

A common issue with *Azure CNI* is that the assigned IP address range is too small to then add more nodes when you scale or upgrade a cluster. The network team also might not be able to issue a large enough IP address range to support your expected application demands.

As a compromise, you can create an AKS cluster that uses *kubenet* and connect to an existing virtual network subnet. This approach lets the nodes receive defined IP addresses without the need to reserve a large number of IP addresses up front for any potential pods that could run in the cluster. With *kubenet*, you can use a much smaller IP address range and support large clusters and application demands. For example, with a */27* IP address range on your subnet, you can run a 20-25 node cluster with enough room to scale or upgrade. This cluster size can support up to *2,200-2,750* pods (with a default maximum of 110 pods per node). The maximum number of pods per node that you can configure with *kubenet* in AKS is 250.

The following basic calculations compare the difference in network models:

* **kubenet**: A simple */24* IP address range can support up to *251* nodes in the cluster. Each Azure virtual network subnet reserves the first three IP addresses for management operations. This node count can support up to *27,610* pods, with a default maximum of 110 pods per node.
* **Azure CNI**: That same basic */24* subnet range can only support a maximum of *eight* nodes in the cluster. This node count can only support up to *240* pods, with a default maximum of 30 pods per node).

> [!NOTE]
> These maximums don't take into account upgrade or scale operations. In practice, you can't run the maximum number of nodes the subnet IP address range supports. You must leave some IP addresses available for scaling or upgrading operations.

### Virtual network peering and ExpressRoute connections

To provide on-premises connectivity, both *kubenet* and *Azure-CNI* network approaches can use [Azure virtual network peering][vnet-peering] or [ExpressRoute connections][express-route]. Plan your IP address ranges carefully to prevent overlap and incorrect traffic routing. For example, many on-premises networks use a *10.0.0.0/8* address range that's advertised over the ExpressRoute connection. We recommend creating your AKS clusters in Azure virtual network subnets outside this address range, such as *172.16.0.0/16*.

### Choose a network model to use

The following considerations help outline when each network model may be the most appropriate:

**Use *kubenet* when**:

* You have limited IP address space.
* Most of the pod communication is within the cluster.
* You don't need advanced AKS features, such as virtual nodes or Azure Network Policy.

***Use *Azure CNI* when**:

* You have available IP address space.
* Most of the pod communication is to resources outside of the cluster.
* You don't want to manage user defined routes for pod connectivity.
* You need AKS advanced features, such as virtual nodes or Azure Network Policy.

For more information to help you decide which network model to use, see [Compare network models and their support scope][network-comparisons].

## Create a virtual network and subnet

1. Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

2. If you don't have an existing virtual network and subnet to use, create these network resources using the [`az network vnet create`][az-network-vnet-create] command. The following example command creates a virtual network named *myAKSVnet* with the address prefix of *192.168.0.0/16* and a subnet named *myAKSSubnet* with the address prefix *192.168.1.0/24*:

    ```azurecli-interactive
    az network vnet create \
        --resource-group myResourceGroup \
        --name myAKSVnet \
        --address-prefixes 192.168.0.0/16 \
        --subnet-name myAKSSubnet \
        --subnet-prefix 192.168.1.0/24
    ```

3. Get the subnet resource ID using the [`az network vnet subnet show`][az-network-vnet-subnet-show] command and store it as a variable named `SUBNET_ID` for later use.

    ```azurecli-interactive
    SUBNET_ID=$(az network vnet subnet show --resource-group myResourceGroup --vnet-name myAKSVnet --name myAKSSubnet --query id -o tsv)
    ```

## Create an AKS cluster in the virtual network

### Create an AKS cluster with system-assigned managed identities

> [!NOTE]
> When using system-assigned identity, the Azure CLI grants the Network Contributor role to the system-assigned identity after the cluster is created. If you're using an ARM template or other clients, you need to use the [user-assigned managed identity][Create an AKS cluster with user-assigned managed identity] instead.

* Create an AKS cluster with system-assigned managed identities using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --network-plugin kubenet \
        --service-cidr 10.0.0.0/16 \
        --dns-service-ip 10.0.0.10 \
        --pod-cidr 10.244.0.0/16 \
        --docker-bridge-address 172.17.0.1/16 \
        --vnet-subnet-id $SUBNET_ID    
    ```

  Deployment parameters:

  * *--service-cidr* is optional. This address is used to assign internal services in the AKS cluster an IP address. This IP address range should be an address space that isn't in use elsewhere in your network environment, including any on-premises network ranges if you connect, or plan to connect, your Azure virtual networks using Express Route or a Site-to-Site VPN connection. The default value is 10.0.0.0/16.
  * *--dns-service-ip* is optional. The address should be the *.10* address of your service IP address range. The default value is 10.0.0.10.
  * *--pod-cidr*  is optional. This address should be a large address space that isn't in use elsewhere in your network environment. This range includes any on-premises network ranges if you connect, or plan to connect, your Azure virtual networks using Express Route or a Site-to-Site VPN connection. The default value is 10.244.0.0/16.
    * This address range must be large enough to accommodate the number of nodes that you expect to scale up to. You can't change this address range once the cluster is deployed.
    * The pod IP address range is used to assign a */24* address space to each node in the cluster. In the following example, the *--pod-cidr* of *10.244.0.0/16* assigns the first node *10.244.0.0/24*, the second node *10.244.1.0/24*, and the third node *10.244.2.0/24*.
    * As the cluster scales or upgrades, the Azure platform continues to assign a pod IP address range to each new node.
  * *--docker-bridge-address* is optional. The address lets the AKS nodes communicate with the underlying management platform. This IP address must not be within the virtual network IP address range of your cluster and shouldn't overlap with other address ranges in use on your network. The default value is 172.17.0.1/16.

> [!NOTE]
> If you want to enable an AKS cluster to include a [Calico network policy][calico-network-policies], you can use the following command:
>
> ```azurecli-interactive
> az aks create \
>     --resource-group myResourceGroup \
>     --name myAKSCluster \
>     --node-count 3 \
>     --network-plugin kubenet --network-policy calico \
>     --vnet-subnet-id $SUBNET_ID 
> ```

### Create an AKS cluster with user-assigned managed identity

#### Create a managed identity

* Create a managed identity using the [`az identity`][az-identity-create] command. If you have an existing managed identity, find the Principal ID using the `az identity show --ids <identity-resource-id>` command instead.

    ```azurecli-interactive
    az identity create --name myIdentity --resource-group myResourceGroup
    ```

    Your output should resemble the following example output:

    ```output
    {                                  
      "clientId": "<client-id>",
      "clientSecretUrl": "<clientSecretUrl>",
      "id": "/subscriptions/<subscriptionid>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myIdentity", 
      "location": "westus2",
      "name": "myIdentity",
      "principalId": "<principal-id>",
      "resourceGroup": "myResourceGroup",                       
      "tags": {},
      "tenantId": "<tenant-id>",
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
    }
    ```

#### Add role assignment for managed identity

If you're using the Azure CLI, the role is automatically added and you can skip this step. If you're using an ARM template or other clients, you need to use the Principal ID of the cluster managed identity to perform a role assignment.

* Get the virtual network resource ID using the [`az network vnet show`][az-network-vnet-show] command and store it as a variable named `VNET_ID`.

    ```azurecli-interactive
    VNET_ID=$(az network vnet show --resource-group myResourceGroup --name myAKSVnet --query id -o tsv)
    ```

* Assign the managed identity for your AKS cluster *Network Contributor* permissions on the virtual network using the [`az role assignment create`][az-role-assignment-create] command and provide the *\<principalId>*.

    ```azurecli-interactive
    az role assignment create --assignee <control-plane-identity-principal-id> --scope $VNET_ID --role "Network Contributor"

    # Example command
    az role assignment create --assignee 22222222-2222-2222-2222-222222222222 --scope "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myAKSVnet" --role "Network Contributor"
    ```

> [!NOTE]
> Permission granted to your cluster's managed identity used by Azure may take up 60 minutes to populate.

#### Create an AKS cluster

* Create an AKS cluster using the [`az aks create`][az-aks-create] command and provide the control plane's managed identity resource ID for the `assign-identity` argument to assign the user-assigned managed identity.

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --node-count 3 \
        --network-plugin kubenet \
        --vnet-subnet-id $SUBNET_ID \
        --assign-identity <identity-resource-id>
    ```

When you create an AKS cluster, a network security group and route table are automatically created. These network resources are managed by the AKS control plane. The network security group is automatically associated with the virtual NICs on your nodes. The route table is automatically associated with the virtual network subnet. Network security group rules and route tables are automatically updated as you create and expose services.

## Bring your own subnet and route table with kubenet

With kubenet, a route table must exist on your cluster subnet(s). AKS supports bringing your own existing subnet and route table. If your custom subnet doesn't contain a route table, AKS creates one for you and adds rules throughout the cluster lifecycle. If your custom subnet contains a route table when you create your cluster, AKS acknowledges the existing route table during cluster operations and adds/updates rules accordingly for cloud provider operations.

> [!WARNING]
> You can add/update custom rules on the custom route table. However, rules are added by the Kubernetes cloud provider which can't be updated or removed. Rules such as *0.0.0.0/0* must always exist on a given route table and map to the target of your internet gateway, such as an NVA or other egress gateway. Take caution when updating rules.

Learn more about setting up a [custom route table][custom-route-table].

kubenet networking requires organized route table rules to successfully route requests. Due to this design, route tables must be carefully maintained for each cluster that relies on it. Multiple clusters can't share a route table because pod CIDRs from different clusters might overlap which causes unexpected and broken routing scenarios. When configuring multiple clusters on the same virtual network or dedicating a virtual network to each cluster, consider the following limitations:

* A custom route table must be associated to the subnet before you create the AKS cluster.
* The associated route table resource can't be updated after cluster creation. However, custom rules can be modified on the route table.
* Each AKS cluster must use a single, unique route table for all subnets associated with the cluster. You can't reuse a route table with multiple clusters due to the potential for overlapping pod CIDRs and conflicting routing rules.
* For system-assigned managed identity, it's only supported to provide your own subnet and route table via Azure CLI because Azure CLI automatically adds the role assignment. If you're using an ARM template or other clients, you must use a [user-assigned managed identity][Create an AKS cluster with user-assigned managed identity], assign permissions before cluster creation, and ensure the user-assigned identity has write permissions to your custom subnet and custom route table.
* Using the same route table with multiple AKS clusters isn't supported.

> [!NOTE]
> When you create and use your own VNet and route table with the kubenet network plugin, you need to use a [user-assigned control plane identity][bring-your-own-control-plane-managed-identity]. For a system-assigned control plane identity, you can't retrieve the identity ID before creating a cluster, which causes a delay during role assignment.
>
> Both system-assigned and user-assigned managed identities are supported when you create and use your own VNet and route table with the azure network plugin. We highly recommend using a user-assigned managed identity for BYO scenarios.

### Add a route table with a user-assigned managed identity to your AKS cluster

After creating a custom route table and associating it with a subnet in your virtual network, you can create a new AKS cluster specifying your route table with a user-assigned managed identity.
You need to use the subnet ID for where you plan to deploy your AKS cluster. This subnet also must be associated with your custom route table.

1. Get the subnet ID using the [`az network vnet subnet list`][az-network-vnet-subnet-list] command.

    ```azurecli-interactive
    az network vnet subnet list --resource-group myResourceGroup --vnet-name myAKSVnet [--subscription]
    ```

2. Create an AKS cluster with a custom subnet pre-configured with a route table using the [`az aks create`][az-aks-create] command and providing your values for the `--vnet-subnet-id`, `--enable-managed-identity`, and `--assign-identity` parameters.

    ```azurecli-interactive
    az aks create -g myResourceGroup -n myManagedCluster --vnet-subnet-id mySubnetIDResourceID --enable-managed-identity --assign-identity controlPlaneIdentityResourceID
    ```

## Next steps

This article showed you how to deploy your AKS cluster into your existing virtual network subnet. Now, you can start [creating new apps using Helm][develop-helm] or [deploying existing apps using Helm][use-helm].

<!-- LINKS - External -->
[cni-networking]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[kubenet]: https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#kubenet
[Calico-network-policies]: https://docs.projectcalico.org/v3.9/security/calico-network-policy

<!-- LINKS - Internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-identity-create]: /cli/azure/identity#az_identity_create
[aks-network-concepts]: concepts-network.md
[aks-network-nsg]: concepts-network.md#network-security-groups
[az-group-create]: /cli/azure/group#az_group_create
[az-network-vnet-create]: /cli/azure/network/vnet#az_network_vnet_create
[az-network-vnet-show]: /cli/azure/network/vnet#az_network_vnet_show
[az-network-vnet-subnet-show]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_show
[az-network-vnet-subnet-list]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_list
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[az-aks-create]: /cli/azure/aks#az_aks_create
[byo-subnet-route-table]: #bring-your-own-subnet-and-route-table-with-kubenet
[develop-helm]: quickstart-helm.md
[use-helm]: kubernetes-helm.md
[virtual-nodes]: virtual-nodes-cli.md
[vnet-peering]: ../virtual-network/virtual-network-peering-overview.md
[express-route]: ../expressroute/expressroute-introduction.md
[network-comparisons]: concepts-network.md#compare-network-models
[custom-route-table]: ../virtual-network/manage-route-table.md
[Create an AKS cluster with user-assigned managed identity]: configure-kubenet.md#create-an-aks-cluster-with-user-assigned-managed-identity
[bring-your-own-control-plane-managed-identity]: ../aks/use-managed-identity.md#bring-your-own-managed-identity
