---
title: Deploy container instances into an Azure virtual network
description: Learn how to deploy container groups to a new or existing Azure virtual network.
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: article
ms.date: 09/24/2018
ms.author: danlep
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

## Virtual network deployment limitations

Certain limitations apply when you deploy container groups to a virtual network.

* Windows containers are unsupported
* To deploy container groups to a subnet, the subnet cannot contain any other resource types. Remove all existing resources from an existing subnet prior to deploying container groups to it, or create a new subnet.
* Container groups deployed to a virtual network do not currently support public IP addresses or DNS name labels.
* Due to the additional networking resources involved, deploying a container group to a virtual network is typically somewhat slower than deploying a standard container instance.

## Preview limitations

While this feature is in preview, the following limitations apply when deploying container instances to a virtual network.

**Supported** regions:

* West Europe (westeurope)
* West US (westus)

**Unsupported** network resources:

* Network Security Group
* Azure Load Balancer

**Network resource deletion** requires [additional steps](#delete-network-resources) once you've deployed container groups to the virtual network.

## Required network resources

There are three Azure Virtual Network resources required for deploying container groups to a virtual network: the [virtual network](#virtual-network) itself, a [delegated subnet](#subnet-delegated) within the virtual network, and a [network profile](#network-profile).

### Virtual network

A virtual network defines the address space in which you create one or more subnets. You then deploy Azure resources (like container groups) into the subnets in your virtual network.

### Subnet (delegated)

Subnets segment the virtual network into separate address spaces usable by the Azure resources you place in them. You create one or several subnets within a virtual network.

The subnet that you use for container groups may contain only container groups. When you first deploy a container group to a subnet, Azure delegates that subnet to Azure Container Instances. Once delegated, the subnet can be used only for container groups. If you attempt to deploy resources other than container groups to a delegated subnet, the operation fails.

### Network profile

A network profile is a network configuration template for Azure resources. It specifies certain network properties for the resource, for example, the subnet into which it should be deployed. The first time you deploy a container group to a subnet (and thus a virtual network), Azure creates a network profile for you. You can then use that network profile for future deployments to the subnet.

In the following diagram, several container groups have been deployed to a subnet delegated to Azure Container Instances. Once you've deployed one container group to a subnet, you can deploy additional container groups to it by specifying the same network profile.

![Container groups within a virtual network][aci-vnet-01]

## Deploy to virtual network

You can deploy container groups to a new virtual network and allow Azure to create the required network resources for you, or deploy to an existing virtual network.

### New virtual network

To deploy to a new virtual network and have Azure create the network resources for you automatically, specify the following when you execute [az container create][az-container-create]:

* Virtual network name
* Virtual network address prefix in CIDR format
* Subnet name
* Subnet address prefix in CIDR format

The virtual network and subnet address prefixes specify the address spaces for the virtual network and subnet, respectively. These values are represented in Classless Inter-Domain Routing (CIDR) notation, for example `10.0.0.0/16`. For more information about working with subnets, see [Add, change, or delete a virtual network subnet](../virtual-network/virtual-network-manage-subnet.md).

Once you've deployed your first container group with this method, you can deploy to the same subnet by specifying the virtual network and subnet names, or the network profile that Azure automatically creates for you. Because Azure delegates the subnet to Azure Container Instances, you can deploy *only* container groups to the subnet.

### Existing virtual network

To deploy a container group to an existing virtual network:

1. Create a subnet within your existing virtual network, or empty an existing subnet of *all* other resources
1. Deploy a container group with [az container create][az-container-create] and specify one of the following:
   * Virtual network name and subnet name</br>
    or
   * Network profile name or ID

Once you deploy your first container group to an existing subnet, Azure delegates that subnet to Azure Container Instances. You can no longer deploy resources other than container groups to that subnet.

The following sections describe how to deploy container groups to a virtual network with the Azure CLI. The command examples are formatted for the **Bash** shell. If you prefer another shell such as PowerShell or Command Prompt, adjust the line continuation characters accordingly.

## Deploy to new virtual network

First, deploy a container group and specify the parameters for a new virtual network and subnet. When you specify these parameters, Azure creates the virtual network and subnet, delegates the subnet to Azure Container instances, and also creates a network profile. Once these resources are created, your container group is deployed to the subnet.

Run the following [az container create][az-container-create] command that specifies settings for a new virtual network and subnet. This command deploys the [microsoft/aci-helloworld][aci-helloworld] container that runs a small Node.js webserver serving a static web page. In the next section, you'll deploy a second container group to the same subnet, and test communication between the two container instances.

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

When you deploy to a new virtual network by using this method, the deployment can take a few minutes while the network resources are created. After the initial deployment, additional container group deployments complete more quickly.

## Deploy to existing virtual network

Now that you've deployed a container group to a new virtual network, deploy a second container group to the same subnet, and verify communication between the two container instances.

First, get the IP address of the first container group you deployed, the *appcontainer*:

```azurecli
az container show --resource-group myResourceGroup --name appcontainer --query ipAddress.ip --output tsv
```

The output should display the IP address of the container group in the private subnet:

```console
$ az container show --resource-group myResourceGroup --name appcontainer --query ipAddress.ip --output tsv
10.0.0.4
```

Now, set `CONTAINER_GROUP_IP` to the IP you retrieved with the `az container show` command, and execute the following `az container create` command. This second container, *commchecker*, runs an Alpine Linux-based image and executes `wget` against the first container group's private subnet IP address.

```azurecli
CONTAINER_GROUP_IP=<container-group-IP-here>

az container create \
    --resource-group myResourceGroup \
    --name commchecker \
    --image alpine:3.5 \
    --command-line "wget $CONTAINER_GROUP_IP" \
    --restart-policy never \
    --vnet-name aci-vnet \
    --subnet aci-subnet
```

After this second container deployment has completed, pull its logs so you can see the output of the `wget` command it executed:

```azurecli
az container logs --resource-group myResourceGroup --name commchecker
```

If the second container communicated successfully with the first, output should be similar to:

```console
$ az container logs --resource-group myResourceGroup --name commchecker
Connecting to 10.0.0.4 (10.0.0.4:80)
index.html           100% |*******************************|  1663   0:00:00 ETA
```

The log output should show that `wget` was able to connect and download the index file from the first container using its private IP address on the local subnet. Network traffic between the two container groups remained within the virtual network.

## Deploy to existing virtual network - YAML

You can also deploy a container group to an existing virtual network by using a YAML file. To deploy to a subnet in a virtual network, you specify several additional properties in the YAML:

* `ipAddress`: The IP address settings for the container group.
  * `ports`: The ports to open, if any.
  * `protocol`: The protocol (TCP or UDP) for the opened port.
* `networkProfile`: Specifies network settings like the virtual network and subnet for an Azure resource.
  * `id`: The full Resource Manager resource ID of the `networkProfile`.

To deploy a container group to a virtual network with a YAML file, you first need to get the ID of the network profile. Execute the [az network profile list][az-network-profile-list] command, specifying the name of the resource group that contains your virtual network and delegated subnet.

``` azurecli
az network profile list --resource-group myResourceGroup --query [0].id --output tsv
```

The output of the command displays the full resource ID for the network profile:

```console
$ az network profile list --resource-group myResourceGroup --query [0].id --output tsv
/subscriptions/<Subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkProfiles/aci-network-profile-aci-vnet-aci-subnet
```

Once you have the network profile ID, copy the following YAML into a new file named *vnet-deploy-aci.yaml*. Under `networkProfile`, replace the `id` value with ID you just retrieved, then save the file. This YAML creates a container group named *appcontaineryaml* in your virtual network.

```YAML
apiVersion: '2018-09-01'
location: westus
name: appcontaineryaml
properties:
  containers:
  - name: appcontaineryaml
    properties:
      image: microsoft/aci-helloworld
      ports:
      - port: 80
        protocol: TCP
      resources:
        requests:
          cpu: 1.0
          memoryInGB: 1.5
  ipAddress:
    type: Private
    ports:
    - protocol: tcp
      port: '80'
  networkProfile:
    id: /subscriptions/<Subscription ID>/resourceGroups/container/providers/Microsoft.Network/networkProfiles/aci-network-profile-aci-vnet-subnet
  osType: Linux
  restartPolicy: Always
tags: null
type: Microsoft.ContainerInstance/containerGroups
```

Deploy the container group with the [az container create][az-container-create] command, specifying the YAML file name for the `--file` parameter:

```azurecli
az container create --resource-group myResourceGroup --file vnet-deploy-aci.yaml
```

Once the deployment has completed, run the [az container show][az-container-show] command to display its status:

```console
$ az container show --resource-group myResourceGroup --name appcontaineryaml --output table
Name              ResourceGroup    Status    Image                     IP:ports     Network    CPU/Memory       OsType    Location
----------------  ---------------  --------  ------------------------  -----------  ---------  ---------------  --------  ----------
appcontaineryaml  myResourceGroup  Running   microsoft/aci-helloworld  10.0.0.5:80  Private    1.0 core/1.5 gb  Linux     westus
```

## Clean up resources

### Delete container instances

When you're done working with the container instances you created, delete them with the following commands:

```azurecli
az container delete --resource-group myResourceGroup --name appcontainer -y
az container delete --resource-group myResourceGroup --name commchecker -y
az container delete --resource-group myResourceGroup --name appcontaineryaml -y
```

### Delete network resources

The initial preview of this feature requires several additional commands to delete the network resources you created earlier. If you used the example commands in previous sections of this article to create your virtual network and subnet, then you can use the following script to delete those network resources.

Before executing the script, set the `RES_GROUP` variable to the name of the resource group containing the virtual network and subnet that should be deleted. The script is formatted for the Bash shell. If you prefer another shell such as PowerShell or Command Prompt, you'll need to adjust variable assignment and accessors accordingly.

> [!WARNING]
> This script deletes resources! It deletes the virtual network and all subnets it contains. Be sure that you no longer need *any* of the resources in the virtual network, including any subnets it contains, prior to running this script. Once deleted, **these resources are unrecoverable**.

```azurecli
# Replace <my-resource-group> with the name of your resource group
RES_GROUP=<my-resource-group>

# Get network profile ID
NETWORK_PROFILE_ID=$(az network profile list --resource-group $RES_GROUP --query [0].id --output tsv)

# Delete the network profile
az network profile delete --id $NETWORK_PROFILE_ID -y

# Get the service association link (SAL) ID
SAL_ID=$(az network vnet subnet show --resource-group $RES_GROUP --vnet-name aci-vnet --name aci-subnet --query id --output tsv)/providers/Microsoft.ContainerInstance/serviceAssociationLinks/default

# Delete the default SAL ID for the subnet
az resource delete --ids $SAL_ID --api-version 2018-07-01

# Delete the subnet delegation to Azure Container Instances
az network vnet subnet update --resource-group $RES_GROUP --vnet-name aci-vnet --name aci-subnet --remove delegations 0

# Delete the subnet
az network vnet subnet delete --resource-group $RES_GROUP --vnet-name aci-vnet --name aci-subnet

# Delete virtual network
az network vnet delete --resource-group $RES_GROUP --name aci-vnet
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
[az-container-show]: /cli/azure/container#az-container-show
[az-network-vnet-create]: /cli/azure/network/vnet#az-network-vnet-create
[az-network-profile-list]: /cli/azure/network/profile#az-network-profile-list