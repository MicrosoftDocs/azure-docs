---
title: Deploy container instances into an Azure virtual network
description: Learn how to deploy container groups to a new or existing Azure virtual network.
services: container-instances
author: mmacy

ms.service: container-instances
ms.topic: article
ms.date: 09/24/2018
ms.author: marsma
---

# Deploy container instances into an Azure virtual network

[Azure Virtual Network](../virtual-network/virtual-networks-overview.md) provides secure, private networking including filtering, routing, and peering for your Azure and on-premises resources. By deploying container groups into an Azure virtual network, your containers can communicate securely with other resources in the virtual network.

Container groups deployed into an Azure virtual network enable scenarios like:

* Direct communication between container groups in the same subnet
* Send [task-based](container-instances-restart-policy.md) workload output from container instances to a database in the virtual network
* Retrieve content for container instances from a [service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md) in the virtual network
* Container communication with virtual machines in the virtual network
* Container communication with on-premises resources through a [VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoute](../expressroute/expressroute-introduction.md)

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Required network resources

There are three Azure Virtual Network resources required for deploying container groups to a virtual network: the [virtual network](#virtual-network) itself, a [delegated subnet](#subnet-delegated) within the virtual network, and a [network profile](#network-profile).

### Virtual network

A virtual network defines the address space in which you create one or more subnets. You then deploy Azure resources (like container groups) into the subnets in your virtual network.

### Subnet (delegated)

You create one or several subnets within a virtual network. Subnets segment the virtual network into separate address spaces usable by the Azure resources you place in them.

When you first deploy a container group to a subnet, Azure *delegates* that subnet to Azure Container Instances. Once delegated, the subnet can be used *only* for container groups. If you attempt to deploy resources other than container groups to a delegated subnet, the operation fails.

### Network profile

A network profile is a network configuration template for Azure resources. It specifies certain network properties for the resource, for example, the subnet into which it should be deployed. To deploy a container group to a subnet (and thus a virtual network), you specify the network profile when you deploy the container group.

In the following diagram, several container groups have been deployed to a subnet delegated to Azure Container Instances. Each container group is associated with the network profile at deployment time so Azure knows where to place it. Multiple container groups can be deployed using the same network profile. You need to create a new network profile only to specify a different subnet for your container groups.

![Container groups within a virtual network][aci-vnet-01]

## Deploy to existing virtual network

At a high level, the process for deploying a container group to an existing virtual network is:

1. Create a virtual network
1. Create a subnet within the virtual network
1. Delegate the subnet to Azure Container Instances
1. Create a network profile
1. Deploy a container group, specifying the network profile

The following sections describe performing these steps with the Azure CLI. The command examples are formatted for the **Bash** shell. If you prefer another shell such as PowerShell or Command Prompt, you'll need to adjust the line continuation characters accordingly.

## Create virtual network and subnet

First, create a virtual network and a subnet for your container groups. If you already have these resources, you can skip this section and move on to [Delegate subnet](#delegate-subnet).

Use the [az network vnet create][az-network-vnet-create] command to create a virtual network and subnet. The following command creates a virtual network with one subnet.

```azurecli
az network vnet create \
    --resource-group myResourceGroup \
    --name myACIVnet \
    --address-prefix 10.0.0.0/16 \
    --subnet-name myACISubnet \
    --subnet-prefix 10.0.0.0/24
```

The prefixes defined by `--address-prefix` and `--subnet-prefix` define the address spaces for the virtual network and subnet, respectively. These values are represented in Classless Inter-Domain Routing (CIDR) notation. For more information about working with subnets, see [Add, change, or delete a virtual network subnet](../virtual-network/virtual-network-manage-subnet.md).

## Delegate subnet

Now that you have a virtual network and subnet, delegate the subnet to Azure Container Instances so it can create container groups in the subnet.

The subnet you delegate to Azure Container Instances supports *only* container groups. You can't deploy other resource types (virtual machines, for example) to the delegated subnet. If you want to delegate an existing subnet to ACI, you must first remove all resources from it prior to delegation.

```azurecli
# PLACEHOLDER
az network vnet subnet delegate \
    --resource-group myResourceGroup \
    --vnet-name myACIVnet \
    --subnet-name myACISubnet \
    --service-name Microsoft.ContainerInstance/containerGroups
```

## Create network profile

Next, create a network profile to use for deploying container groups to the subnet. You specify the network profile when you deploy a container group, and it specifies the subnet into which it should be deployed.

```azurecli
# PLACEHOLDER
az network profile create \
    --resource-group myResourceGroup \
    --name myACINetworkProfile \
    --vnet-name myACIVnet \
    --subnet-name myACISubnet
```

Use the same network profile for each container group you want to deploy to the subnet. If you want to deploy container groups to a different subnet, create a new network profile and specify it when you deploy those container groups.

## Deploy to virtual network

Now that you have the prerequisites created (virtual network, delegated subnet, and network profile) you can deploy a container group to the virtual network.

The following command deploys a container group using the network profile you created in the previous section. The [microsoft/aci-helloworld][aci-helloworld] container image runs a small Node.js webserver serving a static web page. In the next section, you'll deploy a second container group to the same subnet and test communication between the two container instances.

```azurecli
# PLACEHOLDER
az container create \
    --name myAppContainer \
    --resource-group myResourceGroup \
    --image microsoft/aci-helloworld \
    --network-profile myACINetworkProfile
```

## Verify communication

To verify that you've successfully deployed a container into a virtual network, deploy another container group in the same virtual network that queries the first on its subnet IP address. Then, view the logs of the second container to verify they've communicated within the virtual network.

First, get the IP of the container group you deployed in the previous section:

```azurecli
az container show --resource-group myResourceGroup --name myAppContainer --query ipAddress --output tsv
```

Now deploy a second container into the same subnet. This container instance, *myCommChecker*, runs an Alpine Linux-based image and executes `wget` against the first container group's private subnet IP address. Set `CONTAINER_GROUP_IP` to the IP you retrieved with the previous command.

```azurecli
# PLACEHOLDER

CONTAINER_GROUP_IP=<vnet-IP-here>

az container create \
    --resource-group myResourceGroup \
    --name myCommChecker \
    --image alpine:3.5 \
    --command-line "wget $CONTAINER_GROUP_IP" \
    --restart-policy never
    --network-profile myACINetworkProfile
```

After this second container deployment has completed, pull its logs so you can see the output of the `wget` command it executed:

```azurecli
az container logs --resource-group myResourceGroup --name myCommChecker
```

If the second container communicated successfully with the first, output should be similar to:

```console
$ az container logs --resource-group myResourceGroup --name myCommChecker
Connecting to 10.2.0.4 (10.2.0.4:80)
index.html           100% |*******************************|  1663   0:00:00 ETA
```

The log output should show that `wget` was able to connect and download the index file from the first container using its private IP address on the local subnet. Network traffic between the two container groups remained within the virtual network.

## Virtual network deployment limitations

* To delegate a subnet to Azure Container Instances, the subnet must be empty. Remove all existing resources from the subnet prior to delegation to ACI (or create a new subnet).
* Configuring a public IP address or a DNS name label is currently unsupported for container groups deployed to a virtual network.
* Due to the additional networking resources involved, deploying a container group to a virtual network is typically somewhat slower than deploying a standard container instance.

## Preview limitations

While in preview, the following limitations apply when deploying container instances to a virtual network.

**Supported** regions:

* North Europe (northeurope)

**Unsupported** network resources:

* Network Security Group
* Azure Load Balancer

## Clean up resources

When you're done working with the container instances you created, delete both with the following commands:

```azurecli
az container delete --resource-group myResourceGroup --name myAppContainer -y
az container delete --resource-group myResourceGroup --name myCommChecker -y
```

If you no longer need the network resources you created, you can delete them all with the following commands:

```azurecli
az network profile delete --resourcegroup myResourceGroup --name myACINetworkProfile -y
az network vnet subnet delete --resourcegroup myResourceGroup --name myACISubnet -y
az network vnet delete --resource-group myResourceGroup --name myAppContainer -y
```

## Next steps

Several virtual network resources and features were discussed in this article, though briefly. The Azure Virtual Network documentation covers these topics extensively:

* [Virtual network](../virtual-network/manage-virtual-network.md)
* [Subnet](../virtual-network/virtual-network-manage-subnet.md)
* [Service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md)
* [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md)
* [ExpressRoute](../expressroute/expressroute-introduction.md)

<!-- IMAGES -->
[aci-vnet-01]: ./media/container-instances-vnet/aci-vnet-01.png

<!-- LINKS - External -->
[aci-helloworld]: https://hub.docker.com/r/microsoft/aci-helloworld/
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[az-network-vnet-create]: /cli/azure/network/vnet#az-network-vnet-create
