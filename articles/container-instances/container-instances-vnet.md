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

A network profile is a network configuration template for Azure resources. It specifies certain network properties for the resource, for example, the subnet into which it should be deployed. The first time you deploy a container group to a subnet (and thus a virtual network), Azure creates a network profile for you. You can then use that network profile for future deployments to the subnet.

In the following diagram, several container groups have been deployed to a subnet delegated to Azure Container Instances. Once you've deployed one container group to a subnet, you can deploy additional container groups to it by specifying the same network profile.

![Container groups within a virtual network][aci-vnet-01]

## Deploy to virtual network

You can deploy container groups to a new virtual network and allow Azure to create the required network resources for you automatically, or to an existing virtual network.

### New virtual network

To deploy to a new virtual network and have Azure create the network resources for you automatically:

1. Deploy a container group with [az container create][az-container-create] and specify the following:
   * Virtual network name
   * Virtual network address prefix in CIDR format
   * Subnet name
   * Subnet address prefix in CIDR format

Once you've deployed your first container group with this method, you can deploy to the same subnet by specifying the virtual network and subnet names, or the network profile that Azure automatically creates for you.

After deploying a container group using this method, Azure delegates the subnet to Azure Container Instances. You can deploy *only* container groups to that subnet.

### Existing virtual network

To deploy a container group to an existing virtual network:

1. Create a subnet within your existing virtual network, or empty an existing subnet of *all* other resources
1. Deploy a container group with [az container create][az-container-create] and specify one of the following:
   * Virtual network name and subnet name</br>
    or
   * Network profile name or ID

Once you deploy your first container group to an existing subnet, Azure delegates that subnet to Azure Container Instances. You can no longer deploy resources other than container groups to that subnet.

The following sections describe how to deploy container groups to a virtual network with the Azure CLI. The command examples are formatted for the **Bash** shell. If you prefer another shell such as PowerShell or Command Prompt, you'll need to adjust the line continuation characters accordingly.

## Deploy to new virtual network

First, deploy a container group and specify the settings for a new virtual network and subnet.

Use the [az network vnet create][az-network-vnet-create] command to create a virtual network and subnet. The following command creates a virtual network with one subnet.

```azurecli
az container create \
    --name appcontainer \
    --resource-group myResourceGroup \
    --image microsoft/aci-helloworld \
    --vnet-name aci-vnet \
    --vnet-address-prefix 10.0.0.0/16 \
    --subnet aci-subnet \
    --subnet-address-prefix 10.0.0.0/24
```

The prefixes defined by `--vnet-address-prefix` and `--subnet-address-prefix` define the address spaces for the virtual network and subnet, respectively. These values are represented in Classless Inter-Domain Routing (CIDR) notation. For more information about working with subnets, see [Add, change, or delete a virtual network subnet](../virtual-network/virtual-network-manage-subnet.md).

## Deploy to existing virtual network

PLACEHOLDER

Now that you have the prerequisites created (virtual network, delegated subnet, and network profile) you can deploy a container group to the virtual network.

The following command deploys a container group using the network profile you created in the previous section. The [microsoft/aci-helloworld][aci-helloworld] container image runs a small Node.js webserver serving a static web page. In the next section, you'll deploy a second container group to the same subnet and test communication between the two container instances.

```azurecli
# PLACEHOLDER
az container create \
    --name appcontainer \
    --resource-group myResourceGroup \
    --image microsoft/aci-helloworld \
    --network-profile myACINetworkProfile
```

## Verify communication

To verify that you've successfully deployed a container into a virtual network, deploy another container group in the same virtual network that queries the first on its subnet IP address. Then, view the logs of the second container to verify they've communicated within the virtual network.

First, get the IP of the container group you deployed in the previous section:

```azurecli
az container show --resource-group myResourceGroup --name appcontainer --query ipAddress --output tsv
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

**Unsupported** resources:

* Network Security Group
* Azure Load Balancer
* Windows containers

## Clean up resources

When you're done working with the container instances you created, delete both with the following commands:

```azurecli
az container delete --resource-group myResourceGroup --name appcontainer -y
az container delete --resource-group myResourceGroup --name myCommChecker -y
```

If you no longer need the network resources you created, you can delete them all with the following commands:

```azurecli
az network profile delete --resourcegroup myResourceGroup --name myACINetworkProfile -y
az network vnet subnet delete --resourcegroup myResourceGroup --name myACISubnet -y
az network vnet delete --resource-group myResourceGroup --name appcontainer -y
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
[az-container-create]: /cli/azure/container#az-container-create
[az-network-vnet-create]: /cli/azure/network/vnet#az-network-vnet-create
