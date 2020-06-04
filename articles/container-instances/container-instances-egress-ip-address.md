---
title: Configure egress IP
description: Configure Azure firewall and user-defined routes for Azure Container Instances workloads that use the firewall's public IP address for ingress and egress
ms.topic: article
ms.date: 06/03/2020
author: dlepow
ms.author: danlep
---

# Set up a static egress IP address for container instances

In this article you use the Azure CLI to create the resources for this scenario:

* An Azure virtual network
* A container group deployed [in the virtual network](container-instances-vnet.md) that hosts a small web app
* An Azure firewall deployed in the network

## Deploy ACI in a virtual network

In a typical case, you might already have an Azure virtual network and deploy the container group into that network. For demonstration purposes, the following command creates a virtual network and subnet at the time it creates the container group. The subnet is delegated to Azure Container Instances. The container group runs a small web app from the `aci-helloworld` image.

If you need one, create an Azure resource group with the [az group create][az-group-create] command. For example:

```azurecli
az group create --name myResourceGroup --location eastus
```

Create the container group with the [az container create][az-container-create] command:

```azurecli
az container create \
  --name appcontainer \
  --resource-group myResourceGroup \
  --image mcr.microsoft.com/azuredocs/aci-helloworld \
  --vnet aci-vnet \
  --vnet-address-prefix 10.0.0.0/16 \
  --subnet aci-subnet \
  --subnet-address-prefix 10.0.0.0/24
```

For use in a later step, get the private IP address of the container group by running the [az container show][az-container-show] command:

```azurecli
aciPrivateIP="$(az container show --name appcontainer \
  --resource-group myResourceGroup \
  --query ipAddress.ip --output tsv)"
```

## Deploy Azure Firewall in network

In the following sections, use the Azure CLI to deploy an Azure firewall in the virtual network. For background, see [Tutorial: Deploy and configure Azure Firewall using the Azure portal](../firewall/deploy-cli.md).

First, use the [az network vnet subnet create][az-network-vnet-subnet-create] to add a subnet named AzureFirewallSubnet for the firewall. (AzureFirewallSubnet is the *required* name of the subnet.)

```azurecli
az network vnet subnet create \
  --name AzureFirewallSubnet \
  --resource-group myResourceGroup \
  --vnet-name aci-vnet   \
  --address-prefix 10.0.1.0/26
```

Use the following [Azure CLI commands](../firewall/deploy-cli.md) to cease a firewall in the subnet.

If not already installed, add the firewall extension to the Azure CLI using the [az extension add][az-extension-add] command:

```azurecli
az extension add --name azure-firewall
```

Create the firewall resources:

```azurecli
az network firewall create \
  --name myFirewall \
  --resource-group myResourceGroup \
  --location eastus

az network public-ip create \
  --name fw-pip \
  --resource-group myResourceGroup \
  --location eastus \
  --allocation-method static \
  --sku standard
    
az network firewall ip-config create \
  --firewall-name myFirewall \
  --name FW-config \
  --public-ip-address fw-pip \
  --resource-group myResourceGroup \
  --vnet-name aci-vnet
```

Update the firewall configuration using the [az network firewall update][az-network-firewall-update] command:

```azurecli
az network firewall update \
  --name myFirewall \
  --resource-group myResourceGroup
```

Get the firewall's private IP address using the [az network firewall ip-config list][az-network-firewall-ip-config-list] command. This private IP address is used in a later command.


```azurecli
fwPrivateIP="$(az network firewall ip-config list \
  --resource-group myResourceGroup \
  --firewall-name myFirewall \
  --query "[].privateIpAddress" --output tsv)"
```
Get the firewall's public IP address using the [az network network public-ip show][az-network-public-ip-show] command. This public IP address is used in a later command.

```azurecli
fwPublicIP="$(az network public-ip show \
  --name fw-pip \
  --resource-group myResourceGroup \
  --query ipAddress --output tsv)"
```

## Define UDR on ACI VNet

Define a use-defined route on the ACI subnet, to divert traffic to the Azure firewall. For more information, see [Route network traffic](../virtual-network/tutorial-create-route-table-cli.md). 

### Create route table

First, run the following [az network route-table create][az-network-route-table-create] command to create the route table. Ensure that you create the route table in the same region as the virtual network.

```azurecli
az network route-table create \
  --name Firewall-rt-table \
  --resource-group myResourceGroup \
  --location eastus \
  --disable-bgp-route-propagation true
```

### Create route

Run [az network-route-table route create][az-network-route-table-route-create] to create a route in the route table. To route traffic to the firewall, set the next hop type to `VirtualAppliance`, and pass the firewall's private IP address.

```azurecli
az network route-table route create \
  --resource-group myResourceGroup \
  --name DG-Route \
  --route-table-name Firewall-rt-table \
  --address-prefix 0.0.0.0/0 \
  --next-hop-type VirtualAppliance \
  --next-hop-ip-address $fwpPrivateIP
```

### Associate route table to ACI subnet

Run the [az network vnet subnet update][az-network-vnet-subnet-update] command to associate the route table with the subnet delegated to Azure Container Instances.

```azurecli
az network vnet subnet update \
  --name aci-subnet \
  --resource-group myResourceGroup \
  --vnet-name aci-vnet \
  --address-prefixes 10.0.0.0/24 \
  --route-table Firewall-rt-table
```

## Configure NAT rule on firewall to ACI subnet

Create a [NAT rule](../firewall/rule-processing.md) on the firewall to translate and filter inbound Internet traffic to the application container running in the subnet delegated to Azure Container Instances. For details, see [Filter inbound Internet traffic with Azure Firewall DNAT](../firewall/tutorial-firewall-dnat.md)

Create a NAT rule and collection by using the [az network firewall nat-rule create][az-network-firewall-nat-rule-create] command:

```azurecli
az network firewall nat-rule create \
  --firewall-name myFirewall \
  --collection-name myNATCollection \
  --action dnat \
  --name myRule \
  --protocols TCP \
  --source-addresses '*' \
  --destination-addresses $fwPublicIP \
  --destination-ports 80 \
  --resource-group myResourceGroup \
  --translated-address $aciPrivateIP \
  --translated-port 80 \
  --priority 200
```


## Create outbound application rule on the firewall

Run the following [az network firewall application-rule create][az-network-firewall-application-rule-create] command to create an outbound rule on the firewall. This sample rule allows access from the subnet delegated to Azure Container Instances to the FQDN `checkip.dyndns.org`. HTTP access to the site is set up to confirm the egress IP address from Azure Container Instances.

```azurecli
az network firewall application-rule create \
  --collection-name myAppCollection \
  --firewall-name myFirewall \
  --name Allow-CheckIP \
  --protocols Http=80 Https=443 \
  --resource-group myResourceGroup \
  --target-fqdns checkip.dyndns.org \
  --source-addresses 10.0.0.0/24 \
  --priority 200 \
  --action Allow
```

### Test container group access through the firewall

The following sections verify that the subnet delegated to Azure Container Instances is properly configured behind the Azure firewall. The previous steps routed both incoming traffic to the subnet and outgoing traffic from the subnet through the firewall.

### Test ingress to a container group

Test access to the *appcontainer* running in the virtual network by browsing to the firewall's public IP address. Previously, you stored the value in variable $fwPublicIP:

```bash
echo $fwPublicIP
```

Output is similar to:

```console
52.142.18.133
```

If the NAT rule on the firewall allows access, you see the following when you browse to the firewall's public IP address in your browser:

[INSERT IMAGE]

### Test egress from a container group


Deploy the following sample container into the virtual network. When it runs, it sends a single HTTP request to `http://checkip.dyndns.org`, which displays the IP address of the sender (the egress IP address). If the application rule on the firewall is configured, the firewall's public IP address is returned.

```azurecli
az container create \
  --resource-group myResourceGroup \
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
  --resource-group myResourceGroup \
  --name testegress 
```

Output is similar to:

```console
<html><head><title>Current IP Check</title></head><body>Current IP Address: 52.142.18.133</body></html>
```

## Next steps





[az-group-create]: /cli/azure/group#az-group-create
[az-container-create]: /cli/azure/container#az-container-create
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az-network-vnet-subnet-create
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-network-firewall-update]: /cli/azure/network/firewall#az-network-firewall-update
[az-network-public-ip-show]: /cli/azure/network/public-ip/#az-network-public-ip-show
[az-network-route-table-create]:/cli/azure/network/route-table/#az-network-route-table-create
[az-network-route-table-route-create]: /cli/azure/network/route-table/route#az-network-route-table-route-create
[az-network-firewall-ip-config-list]: /cli/azure/network/firewall/ip-config#[]az-network-firewall-ip-config-list
[az-network-vnet-subnet-update]: /cli/azure/network/vnet/subnet#az-network-vnet-subnet-update
[az-container-exec]: /cli/azure/container#az-container-exec
[az-vm-create]: /cli/azure/vm#az-vm-create
[az-vm-open-port]: /cli/azure/vm#az-vm-open-port
[az-vm-list-ip-addresses]: /cli/azure/vm#az-vm-list-ip-addresses
[az-network-firewall-application-rule-create]: /cli/azure/network/firewall/application-rule#az-network-firewall-application-rule-create
[az-network-firewall-nat-rule-create]: /cli/azure/ext/azure-firewall/network/firewall/nat-rule






