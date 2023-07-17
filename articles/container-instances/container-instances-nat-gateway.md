---
title: Configure Container Group Egress with NAT Gateway
description: Configure NAT gateway for Azure Container Instances workloads that use the NAT gateway's public IP address for static egress
author: tomvcassidy
ms.topic: how-to
ms.service: container-instances
ms.custom: devx-track-azurecli
services: container-instances
ms.author: tomcassidy
ms.date: 05/03/2022
---

# Configure a NAT gateway for static IP address for outbound traffic from a container group

Setting up a [container group](container-instances-container-groups.md) with an external-facing IP address allows external clients to use the IP address to access a container in the group. For example, a browser can access a web app running in a container. However, currently a container group uses a different IP address for outbound traffic. This egress IP address isn't exposed programmatically, which makes container group monitoring and configuration of client firewall rules more complex.

This article provides steps to configure a container group in a [virtual network](container-instances-virtual-network-concepts.md) integrated with a [Network Address Translation (NAT) gateway](../virtual-network/nat-gateway/nat-overview.md). By configuring a NAT gateway to SNAT a subnet address range delegated to Azure Container Instances (ACI), you can identify outbound traffic from your container groups. The container group egress traffic will use the public IP address of the NAT gateway. A single NAT gateway can be used by multiple container groups deployed in the virtual network's subnet delegated to ACI.

In this article, you use the Azure CLI to create the resources for this scenario:

* Container groups deployed on a delegated subnet [in the virtual network](container-instances-vnet.md)
* A NAT gateway deployed in the network with a static public IP address

You then validate egress from example container groups through the NAT gateway.

> [!NOTE]
> The ACI service recommends integrating with a NAT gateway for containerized workloads that have static egress but not static ingress requirements. For ACI architecture that supports both static ingress and egress, please see the following tutorial: [Use Azure Firewall for ingress and egress](container-instances-egress-ip-address.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../includes/cli-launch-cloud-shell-sign-in.md)]

> [!NOTE]
> To download the complete script, go to [full script](https://github.com/Azure-Samples/azure-cli-samples/blob/master/container-instances/nat-gateway.sh).

## Get started

This tutorial makes use of a randomized variable. If you are using an existing resource group, modify the value of this variable appropriately.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/nat-gateway.sh" id="variable":::

**Azure resource group**: If you don't have an Azure resource group already, create a resource group with the [az group create][az-group-create] command. Modify the location value as appropriate.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/nat-gateway.sh" id="creategroup":::

## Deploy ACI in a virtual network

In a typical case, you might already have an Azure virtual network in which to deploy a container group. For demonstration purposes, the following commands create a virtual network and subnet when the container group is created. The subnet is delegated to Azure Container Instances.

The container group runs a small web app from the `aci-helloworld` image. As shown in other articles in the documentation, this image packages a small web app written in Node.js that serves a static HTML page.

Create the container group with the [az container create][az-container-create] command:

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/nat-gateway.sh" id="container":::

> [!NOTE]
> Adjust the value of `--subnet address-prefix` for the IP address space you need in your subnet. The smallest supported subnet is /29, which provides eight IP addresses. Some >IP addresses are reserved for use by Azure, which you can read more about [here](../virtual-network/ip-services/private-ip-addresses.md).

## Create a public IP address

In the following sections, use the Azure CLI to deploy an Azure NAT gateway in the virtual network. For background, see [Quickstart: Create a NAT gateway using Azure CLI](../virtual-network/nat-gateway/quickstart-create-nat-gateway-cli.md).

First, use the [az network vnet public-ip create][az-network-public-ip-create] to create a public IP address for the NAT gateway. This will be used to access the Internet. You will receive a warning about an upcoming breaking change where Standard SKU IP addresses will be availability zone aware by default. You can learn more about the use of availability zones and public IP addresses [here](../virtual-network/ip-services/virtual-network-network-interface-addresses.md).

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/nat-gateway.sh" id="publicip":::

Store the public IP address in a variable for use during the validation step later in this script.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/nat-gateway.sh" id="storeip":::

## Deploy a NAT gateway into a virtual network

Use the following [az network nat gateway create][az-network-nat-gateway-create] to create a NAT gateway that uses the public IP you created in the previous step.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/nat-gateway.sh" id="natgateway":::

## Configure NAT service for source subnet

We'll configure the source subnet **aci-subnet** to use a specific NAT gateway resource **myNATgateway** with [az network vnet subnet update][az-network-vnet-subnet-update]. This command will activate the NAT service on the specified subnet.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/nat-gateway.sh" id="subnet":::

## Test egress from a container group

Test inbound access to the `appcontainer` running in the virtual network by browsing to the firewall's public IP address. Previously, you stored the public IP address in variable $NG_PUBLIC_IP

Deploy the following sample container into the virtual network. When it runs, it sends a single HTTP request to `http://checkip.dyndns.org`, which displays the IP address of the sender (the egress IP address). If the application rule on the firewall is configured properly, the firewall's public IP address is returned.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/nat-gateway.sh" id="sidecar":::

View the container logs to confirm the IP address is the same as the public IP address we created in the first step of the tutorial.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/nat-gateway.sh" id="viewlogs":::

Output is similar to:

```console
<html><head><title>Current IP Check</title></head><body>Current IP Address: 52.142.18.133</body></html>
```

This IP address should match the public IP address created in the first step of the tutorial.

:::code language="azurecli" source="~/azure_cli_scripts/container-instances/nat-gateway.sh" id="echo":::

## Clean up resources

When no longer needed, you can use [az group delete](/cli/azure/group) to remove the resource group and all related resources as follows. The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive
az group delete --name $resourceGroup --yes --no-wait
```

## Next steps

In this article, you set up container groups in a virtual network behind an Azure NAT gateway. By using this configuration, you set up a single, static IP address egress from Azure Container Instances container groups.

For troubleshooting assistance, see the [Troubleshoot Azure Virtual Network NAT connectivity](../virtual-network/nat-gateway/troubleshoot-nat.md).

[az-group-create]: /cli/azure/group#az_group_create
[az-container-create]: /cli/azure/container#az_container_create
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_create
[az-network-public-ip-create]: /cli/azure/network/public-ip/#az_network_public_ip_create
[az-network-public-ip-show]: /cli/azure/network/public-ip/#az_network_public_ip_show
[az-network-nat-gateway-create]: /cli/azure/network/nat/gateway/#az_network_nat_gateway_create
[az-network-vnet-subnet-update]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_update
[az-container-exec]: /cli/azure/container#az_container_exec
[azure-cli-install]: /cli/azure/install-azure-cli
