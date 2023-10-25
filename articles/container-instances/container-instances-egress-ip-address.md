---
title: Configure static outbound IP
description: Configure Azure firewall and user-defined routes for Azure Container Instances workloads that use the firewall's public IP address for ingress and egress
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
ms.custom: devx-track-azurecli
services: container-instances
ms.topic: how-to
ms.date: 05/03/2022
---

# Configure a single public IP address for outbound and inbound traffic to a container group

Setting up a [container group](container-instances-container-groups.md) with an external-facing IP address allows external clients to use the IP address to access a container in the group. For example, a browser can access a web app running in a container. However, currently a container group uses a different IP address for outbound traffic. This egress IP address isn't exposed programmatically, which makes container group monitoring and configuration of client firewall rules more complex.

This article provides steps to configure a container group in a [virtual network](container-instances-virtual-network-concepts.md) integrated with [Azure Firewall](../firewall/overview.md). By setting up a user-defined route to the container group and firewall rules, you can route and identify traffic to and from the container group. Container group ingress and egress use the public IP address of the firewall. A single egress IP address can be used by multiple container groups deployed in the virtual network's subnet delegated to Azure Container Instances.

In this article, you use the Azure CLI to create the resources for this scenario:

* Container groups deployed on a delegated subnet [in the virtual network](container-instances-vnet.md)
* An Azure firewall deployed in the network with a static public IP address
* A user-defined route on the container groups' subnet
* A NAT rule for firewall ingress and an application rule for egress

You then validate ingress and egress from example container groups through the firewall.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../includes/cli-launch-cloud-shell-sign-in.md)]

> [!NOTE]
> To download the complete script, go to [full script](https://github.com/Azure-Samples/azure-cli-samples/blob/master/container-instances/egress-ip-address.sh).

## Get started

This tutorial makes use of a randomized variable. If you are using an existing resource group, modify the value of this variable appropriately.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="variable":::

**Azure resource group**: If you don't have an Azure resource group already, create a resource group with the [az group create][az-group-create] command. Modify the location value as appropriate.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="creategroup":::

## Deploy ACI in a virtual network

In a typical case, you might already have an Azure virtual network in which to deploy a container group. For demonstration purposes, the following commands create a virtual network and subnet when the container group is created. The subnet is delegated to Azure Container Instances.

The container group runs a small web app from the `aci-helloworld` image. As shown in other articles in the documentation, this image packages a small web app written in Node.js that serves a static HTML page.

Create the container group with the [az container create][az-container-create] command:

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="container":::

> [!TIP]
> Adjust the value of `--subnet address-prefix` for the IP address space you need in your subnet. The smallest supported subnet is /29, which provides eight IP addresses. Some IP addresses are reserved for use by Azure.

For use in a later step, get the private IP address of the container group by running the [az container show][az-container-show] command:

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="privateip":::

## Deploy Azure Firewall in network

In the following sections, use the Azure CLI to deploy an Azure firewall in the virtual network. For background, see [Tutorial: Deploy and configure Azure Firewall using the Azure portal](../firewall/deploy-cli.md).

First, use the [az network vnet subnet create][az-network-vnet-subnet-create] to add a subnet named AzureFirewallSubnet for the firewall. AzureFirewallSubnet is the *required* name of this subnet.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="subnet":::

Use the following [Azure CLI commands](../firewall/deploy-cli.md) to create a firewall in the subnet.

If not already installed, add the firewall extension to the Azure CLI using the [az extension add][az-extension-add] command:

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="firewallext":::

Create the firewall resources using the [az network firewall create][az-network-firewall-create] command:

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="firewall":::

Update the firewall configuration using the [az network firewall update][az-network-firewall-update] command:

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="firewallupdate":::

Get the firewall's private IP address using the [az network firewall ip-config list][az-network-firewall-ip-config-list] command. This private IP address is used in a later command.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="storeprivateip":::

Get the firewall's public IP address using the [az network public-ip show][az-network-public-ip-show] command. This public IP address is used in a later command.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="storepublicip":::

## Define user-defined route on ACI subnet

Define a use-defined route on the ACI subnet, to divert traffic to the Azure firewall. For more information, see [Route network traffic](../virtual-network/tutorial-create-route-table-cli.md). 

### Create route table

First, run the following [az network route-table create][az-network-route-table-create] command to create the route table. Create the route table in the same region as the virtual network.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="routetable":::

### Create route

Run [az network-route-table route create][az-network-route-table-route-create] to create a route in the route table. To route traffic to the firewall, set the next hop type to `VirtualAppliance`, and pass the firewall's private IP address as the next hop address.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="createroute":::

### Associate route table to ACI subnet

Run the [az network vnet subnet update][az-network-vnet-subnet-update] command to associate the route table with the subnet delegated to Azure Container Instances.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="associateroute":::

## Configure rules on firewall

By default, Azure Firewall denies (blocks) inbound and outbound traffic.

### Configure NAT rule on firewall to ACI subnet

Create a [NAT rule](../firewall/rule-processing.md) on the firewall to translate and filter inbound internet traffic to the application container you started previously in the network. For details, see [Filter inbound Internet traffic with Azure Firewall DNAT](../firewall/tutorial-firewall-dnat.md)

Create a NAT rule and collection by using the [az network firewall nat-rule create][az-network-firewall-nat-rule-create] command:

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="natrule":::

Add NAT rules as needed to filter traffic to other IP addresses in the subnet. For example, other container groups in the subnet could expose IP addresses for inbound traffic, or other internal IP addresses could be assigned to the container group after a restart.

### Create outbound application rule on the firewall

Run the following [az network firewall application-rule create][az-network-firewall-application-rule-create] command to create an outbound rule on the firewall. This sample rule allows access from the subnet delegated to Azure Container Instances to the FQDN `checkip.dyndns.org`. HTTP access to the site is used in a later step to confirm the egress IP address from Azure Container Instances.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="outboundrule":::

## Test container group access through the firewall

The following sections verify that the subnet delegated to Azure Container Instances is properly configured behind the Azure firewall. The previous steps routed both incoming traffic to the subnet and outgoing traffic from the subnet through the firewall.

### Test ingress to a container group

Test inbound access to the `appcontainer` running in the virtual network by browsing to the firewall's public IP address. Previously, you stored the public IP address in variable $FW_PUBLIC_IP:

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="echo":::

Output is similar to:

```console
52.142.18.133
```

If the NAT rule on the firewall is configured properly, you see the following when you enter the firewall's public IP address in your browser:

:::image type="content" source="media/container-instances-egress-ip-address/aci-ingress-ip-address.png" alt-text="Browse to firewall's public IP address":::

### Test egress from a container group

Deploy the following sample container into the virtual network. When it runs, it sends a single HTTP request to `http://checkip.dyndns.org`, which displays the IP address of the sender (the egress IP address). If the application rule on the firewall is configured properly, the firewall's public IP address is returned.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/egress-ip-address.sh" id="egress":::

View the container logs to confirm the IP address is the same as the public IP address of the firewall.

```azurecli
az container logs \
  --sed 's/$RESOURCE_GROUP_NAME/$resourceGroup/g'
  --name testegress 
```

Output is similar to:

```console
<html><head><title>Current IP Check</title></head><body>Current IP Address: 52.142.18.133</body></html>
```

## Clean up resources

When no longer needed, you can use [az group delete](/cli/azure/group) to remove the resource group and all related resources as follows. The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive
az group delete --name $resourceGroup --yes --no-wait
```

## Next steps

In this article, you set up container groups in a virtual network behind an Azure firewall. You configured a user-defined route and NAT and application rules on the firewall. By using this configuration, you set up a single, static IP address for ingress and egress from Azure Container Instances.

For more information about managing traffic and protecting Azure resources, see the [Azure Firewall](../firewall/index.yml) documentation.

[az-group-create]: /cli/azure/group#az_group_create
[az-container-create]: /cli/azure/container#az_container_create
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_create
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-network-firewall-create]: /cli/azure/network/firewall#az_network_firewall_create
[az-network-firewall-update]: /cli/azure/network/firewall#az_network_firewall_update
[az-network-public-ip-show]: /cli/azure/network/public-ip/#az_network_public_ip_show
[az-network-route-table-create]:/cli/azure/network/route-table/#az_network_route_table_create
[az-network-route-table-route-create]: /cli/azure/network/route-table/route#az_network_route_table_route_create
[az-network-firewall-ip-config-list]: /cli/azure/network/firewall/ip-config#az_network_firewall_ip_config_list
[az-network-vnet-subnet-update]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_update
[az-container-exec]: /cli/azure/container#az_container_exec
[az-vm-create]: /cli/azure/vm#az_vm_create
[az-vm-open-port]: /cli/azure/vm#az_vm_open_port
[az-vm-list-ip-addresses]: /cli/azure/vm#az_vm_list_ip_addresses
[az-network-firewall-application-rule-create]: /cli/azure/network/firewall/application-rule#az_network_firewall_application_rule_create
[az-network-firewall-nat-rule-create]: /cli/azure/network/firewall/nat-rule#az_network_firewall_nat_rule_create
