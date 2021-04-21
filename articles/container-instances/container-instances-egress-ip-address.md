---
title: Configure static outbound IP
description: Configure Azure firewall and user-defined routes for Azure Container Instances workloads that use the firewall's public IP address for ingress and egress
ms.topic: article
ms.date: 07/16/2020
---

# Configure a single public IP address for outbound and inbound traffic to a container group

Setting up a [container group](container-instances-container-groups.md) with an external-facing IP address allows external clients to use the IP address to access a container in the group. For example, a browser can access a web app running in a container. However, currently a container group uses a different IP address for outbound traffic. This egress IP address isn't exposed programmatically, which makes container group monitoring and configuration of client firewall rules more complex.

This article provides steps to configure a container group in a [virtual network](container-instances-virtual-network-concepts.md) integrated with [Azure Firewall](../firewall/overview.md). By setting up a user-defined route to the container group and firewall rules, you can route and identify traffic to and from the container group. Container group ingress and egress use the public IP address of the firewall. A single egress IP address can be used by multiple container groups deployed in the virtual network's subnet delegated to Azure Container Instances.

In this article you use the Azure CLI to create the resources for this scenario:

* Container groups deployed on a delegated subnet [in the virtual network](container-instances-vnet.md) 
* An Azure firewall deployed in the network with a static public IP address
* A user-defined route on the container groups' subnet
* A NAT rule for firewall ingress and an application rule for egress

You then validate ingress and egress from example container groups through the firewall.

## Deploy ACI in a virtual network

In a typical case, you might already have an Azure virtual network in which to deploy a container group. For demonstration purposes, the following commands create a virtual network and subnet when the container group is created. The subnet is delegated to Azure Container Instances. 

The container group runs a small web app from the `aci-helloworld` image. As shown in other articles in the documentation, this image packages a small web app written in Node.js that serves a static HTML page.

If you need one, first create an Azure resource group with the [az group create][az-group-create] command. For example:

```azurecli
az group create --name myResourceGroup --location eastus
```

To simplify the following command examples, use an environment variable for the resource group's name:

```console
export RESOURCE_GROUP_NAME=myResourceGroup
```

Create the container group with the [az container create][az-container-create] command:

```azurecli
az container create \
  --name appcontainer \
  --resource-group $RESOURCE_GROUP_NAME \
  --image mcr.microsoft.com/azuredocs/aci-helloworld \
  --vnet aci-vnet \
  --vnet-address-prefix 10.0.0.0/16 \
  --subnet aci-subnet \
  --subnet-address-prefix 10.0.0.0/24
```

> [!TIP]
> Adjust the value of `--subnet address-prefix` for the IP address space you need in your subnet. The smallest supported subnet is /29, which provides eight IP addresses. Some IP addresses are reserved for use by Azure.

For use in a later step, get the private IP address of the container group by running the [az container show][az-container-show] command:

```azurecli
ACI_PRIVATE_IP="$(az container show --name appcontainer \
  --resource-group $RESOURCE_GROUP_NAME \
  --query ipAddress.ip --output tsv)"
```

## Deploy Azure Firewall in network

In the following sections, use the Azure CLI to deploy an Azure firewall in the virtual network. For background, see [Tutorial: Deploy and configure Azure Firewall using the Azure portal](../firewall/deploy-cli.md).

First, use the [az network vnet subnet create][az-network-vnet-subnet-create] to add a subnet named AzureFirewallSubnet for the firewall. AzureFirewallSubnet is the *required* name of this subnet.

```azurecli
az network vnet subnet create \
  --name AzureFirewallSubnet \
  --resource-group $RESOURCE_GROUP_NAME \
  --vnet-name aci-vnet   \
  --address-prefix 10.0.1.0/26
```

Use the following [Azure CLI commands](../firewall/deploy-cli.md) to create a firewall in the subnet.

If not already installed, add the firewall extension to the Azure CLI using the [az extension add][az-extension-add] command:

```azurecli
az extension add --name azure-firewall
```

Create the firewall resources:

```azurecli
az network firewall create \
  --name myFirewall \
  --resource-group $RESOURCE_GROUP_NAME \
  --location eastus

az network public-ip create \
  --name fw-pip \
  --resource-group $RESOURCE_GROUP_NAME \
  --location eastus \
  --allocation-method static \
  --sku standard
    
az network firewall ip-config create \
  --firewall-name myFirewall \
  --name FW-config \
  --public-ip-address fw-pip \
  --resource-group $RESOURCE_GROUP_NAME \
  --vnet-name aci-vnet
```

Update the firewall configuration using the [az network firewall update][az-network-firewall-update] command:

```azurecli
az network firewall update \
  --name myFirewall \
  --resource-group $RESOURCE_GROUP_NAME
```

Get the firewall's private IP address using the [az network firewall ip-config list][az-network-firewall-ip-config-list] command. This private IP address is used in a later command.


```azurecli
FW_PRIVATE_IP="$(az network firewall ip-config list \
  --resource-group $RESOURCE_GROUP_NAME \
  --firewall-name myFirewall \
  --query "[].privateIpAddress" --output tsv)"
```
Get the firewall's public IP address using the [az network public-ip show][az-network-public-ip-show] command. This public IP address is used in a later command.

```azurecli
FW_PUBLIC_IP="$(az network public-ip show \
  --name fw-pip \
  --resource-group $RESOURCE_GROUP_NAME \
  --query ipAddress --output tsv)"
```

## Define user-defined route on ACI subnet

Define a use-defined route on the ACI subnet, to divert traffic to the Azure firewall. For more information, see [Route network traffic](../virtual-network/tutorial-create-route-table-cli.md). 

### Create route table

First, run the following [az network route-table create][az-network-route-table-create] command to create the route table. Create the route table in the same region as the virtual network.

```azurecli
az network route-table create \
  --name Firewall-rt-table \
  --resource-group $RESOURCE_GROUP_NAME \
  --location eastus \
  --disable-bgp-route-propagation true
```

### Create route

Run [az network-route-table route create][az-network-route-table-route-create] to create a route in the route table. To route traffic to the firewall, set the next hop type to `VirtualAppliance`, and pass the firewall's private IP address as the next hop address.

```azurecli
az network route-table route create \
  --resource-group $RESOURCE_GROUP_NAME \
  --name DG-Route \
  --route-table-name Firewall-rt-table \
  --address-prefix 0.0.0.0/0 \
  --next-hop-type VirtualAppliance \
  --next-hop-ip-address $FW_PRIVATE_IP
```

### Associate route table to ACI subnet

Run the [az network vnet subnet update][az-network-vnet-subnet-update] command to associate the route table with the subnet delegated to Azure Container Instances.

```azurecli
az network vnet subnet update \
  --name aci-subnet \
  --resource-group $RESOURCE_GROUP_NAME \
  --vnet-name aci-vnet \
  --address-prefixes 10.0.0.0/24 \
  --route-table Firewall-rt-table
```

## Configure rules on firewall

By default, Azure Firewall denies (blocks) inbound and outbound traffic. 

### Configure NAT rule on firewall to ACI subnet

Create a [NAT rule](../firewall/rule-processing.md) on the firewall to translate and filter inbound internet traffic to the application container you started previously in the network. For details, see [Filter inbound Internet traffic with Azure Firewall DNAT](../firewall/tutorial-firewall-dnat.md)

Create a NAT rule and collection by using the [az network firewall nat-rule create][az-network-firewall-nat-rule-create] command:

```azurecli
az network firewall nat-rule create \
  --firewall-name myFirewall \
  --collection-name myNATCollection \
  --action dnat \
  --name myRule \
  --protocols TCP \
  --source-addresses '*' \
  --destination-addresses $FW_PUBLIC_IP \
  --destination-ports 80 \
  --resource-group $RESOURCE_GROUP_NAME \
  --translated-address $ACI_PRIVATE_IP \
  --translated-port 80 \
  --priority 200
```

Add NAT rules as needed to filter traffic to other IP addresses in the subnet. For example, other container groups in the subnet could expose IP addresses for inbound traffic, or other internal IP addresses could be assigned to the container group after a restart.

### Create outbound application rule on the firewall

Run the following [az network firewall application-rule create][az-network-firewall-application-rule-create] command to create an outbound rule on the firewall. This sample rule allows access from the subnet delegated to Azure Container Instances to the FQDN `checkip.dyndns.org`. HTTP access to the site is used in a later step to confirm the egress IP address from Azure Container Instances.

```azurecli
az network firewall application-rule create \
  --collection-name myAppCollection \
  --firewall-name myFirewall \
  --name Allow-CheckIP \
  --protocols Http=80 Https=443 \
  --resource-group $RESOURCE_GROUP_NAME \
  --target-fqdns checkip.dyndns.org \
  --source-addresses 10.0.0.0/24 \
  --priority 200 \
  --action Allow
```

## Test container group access through the firewall

The following sections verify that the subnet delegated to Azure Container Instances is properly configured behind the Azure firewall. The previous steps routed both incoming traffic to the subnet and outgoing traffic from the subnet through the firewall.

### Test ingress to a container group

Test inbound access to the *appcontainer* running in the virtual network by browsing to the firewall's public IP address. Previously, you stored the public IP address in variable $FW_PUBLIC_IP:

```bash
echo $FW_PUBLIC_IP
```

Output is similar to:

```console
52.142.18.133
```

If the NAT rule on the firewall is configured properly, you see the following when you enter the firewall's public IP address in your browser:

:::image type="content" source="media/container-instances-egress-ip-address/aci-ingress-ip-address.png" alt-text="Browse to firewall's public IP address":::

### Test egress from a container group


Deploy the following sample container into the virtual network. When it runs, it sends a single HTTP request to `http://checkip.dyndns.org`, which displays the IP address of the sender (the egress IP address). If the application rule on the firewall is configured properly, the firewall's public IP address is returned.

```azurecli
az container create \
  --resource-group $RESOURCE_GROUP_NAME \
  --name testegress \
  --image mcr.microsoft.com/azuredocs/aci-tutorial-sidecar \
  --command-line "curl -s http://checkip.dyndns.org" \
  --restart-policy OnFailure \
  --vnet aci-vnet \
  --subnet aci-subnet
```

View the container logs to confirm the IP address is the same as the public IP address of the firewall.

```azurecli
az container logs \
  --resource-group $RESOURCE_GROUP_NAME \
  --name testegress 
```

Output is similar to:

```console
<html><head><title>Current IP Check</title></head><body>Current IP Address: 52.142.18.133</body></html>
```

## Next steps

In this article, you set up container groups in a virtual network behind an Azure firewall. You configured a user-defined route and NAT and application rules on the firewall. By using this configuration, you set up a single, static IP address for ingress and egress from Azure Container Instances.

For more information about managing traffic and protecting Azure resources, see the [Azure Firewall](../firewall/index.yml) documentation.



[az-group-create]: /cli/azure/group#az_group_create
[az-container-create]: /cli/azure/container#az_container_create
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_create
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-network-firewall-update]: /cli/azure/ext/azure-firewall/network/firewall#ext-azure-firewall-az-network-firewall-update
[az-network-public-ip-show]: /cli/azure/network/public-ip/#az_network_public_ip_show
[az-network-route-table-create]:/cli/azure/network/route-table/#az_network_route_table_create
[az-network-route-table-route-create]: /cli/azure/network/route-table/route#az_network_route_table_route_create
[az-network-firewall-ip-config-list]: /cli/azure/ext/azure-firewall/network/firewall/ip-config#ext-azure-firewall-az-network-firewall-ip-config-list
[az-network-vnet-subnet-update]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_update
[az-container-exec]: /cli/azure/container#az_container_exec
[az-vm-create]: /cli/azure/vm#az_vm_create
[az-vm-open-port]: /cli/azure/vm#az_vm_open_port
[az-vm-list-ip-addresses]: /cli/azure/vm#az_vm_list_ip_addresses
[az-network-firewall-application-rule-create]: /cli/azure/ext/azure-firewall/network/firewall/application-rule#ext-azure-firewall-az-network-firewall-application-rule-create
[az-network-firewall-nat-rule-create]: /cli/azure/ext/azure-firewall/network/firewall/nat-rule#ext-azure-firewall-az-network-firewall-nat-rule-create
