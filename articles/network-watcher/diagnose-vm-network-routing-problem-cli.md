---
title: Diagnose a VM network routing problem - Azure CLI
titleSuffix: Azure Network Watcher
description: In this article, you learn how to use Azure CLI to diagnose a virtual machine network routing problem using the next hop capability of Azure Network Watcher.
author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 10/29/2024
ms.author: halkazwini
ms.custom: devx-track-azurecli

# Customer intent: I need to diagnose virtual machine (VM) network routing problem that prevents communication to different destinations.
---

# Diagnose a virtual machine network routing problem using the Azure CLI

In this article, you learn how to use Azure Network Watcher [next hop](network-watcher-next-hop-overview.md) tool to troubleshoot and diagnose a VM routing problem that's preventing it from correctly communicating with other resources. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. This article requires the Azure CLI version 2.0 or later. Run [az --version](/cli/azure/reference-index#az-version) command to find the installed version. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

## Create a virtual machine

Before you can create a VM, you must create a resource group to contain the VM. Create a resource group with [az group create](/cli/azure/group#az-group-create). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Create a VM with [az vm create](/cli/azure/vm#az-vm-create). If SSH keys do not already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option. The following example creates a VM named *myVm*:

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVm \
  --image Ubuntu2204 \
  --generate-ssh-keys
```

The VM takes a few minutes to create. Don't continue with remaining steps until the VM is created and the Azure CLI returns output.

## Test network communication

To test network communication with Network Watcher, you must first enable a network watcher in the region the VM that you want to test is in, and then use Network Watcher's next hop capability to test communication.

### Enable network watcher

If you already have a network watcher enabled in the East US region, skip to [Use next hop](#use-next-hop). Use the [az network watcher configure](/cli/azure/network/watcher#az-network-watcher-configure) command to create a network watcher in the East US region:

```azurecli-interactive
az network watcher configure \
  --resource-group NetworkWatcherRG \
  --locations eastus \
  --enabled
```

### Use next hop

Azure automatically creates routes to default destinations. You may create custom routes that override the default routes. Sometimes, custom routes can cause communication to fail. To test routing from a VM, use [az network watcher show-next-hop](/cli/azure/network/watcher#az-network-watcher-show-next-hop) to determine the next routing hop when traffic is destined for a specific address.

Test outbound communication from the VM to one of the IP addresses for www.bing.com:

```azurecli-interactive
az network watcher show-next-hop \
  --dest-ip 13.107.21.200 \
  --resource-group myResourceGroup \
  --source-ip 10.0.0.4 \
  --vm myVm \
  --nic myVmVMNic \
  --out table
```

After a few seconds, the output informs you that the **nextHopType** is **Internet**, and that the **routeTableId** is **System Route**. This result lets you know that there is a valid route to the destination.

Test outbound communication from the VM to 172.31.0.100:

```azurecli-interactive
az network watcher show-next-hop \
  --dest-ip 172.31.0.100 \
  --resource-group myResourceGroup \
  --source-ip 10.0.0.4 \
  --vm myVm \
  --nic myVmVMNic \
  --out table
```

The output returned informs you that **None** is the **nextHopType**, and that the **routeTableId** is also **System Route**. This result lets you know that, while there is a valid system route to the destination, there is no next hop to route the traffic to the destination.

## View details of a route

To analyze routing further, review the effective routes for the network interface with the [az network nic show-effective-route-table](/cli/azure/network/nic#az-network-nic-show-effective-route-table) command:

```azurecli-interactive
az network nic show-effective-route-table \
  --resource-group myResourceGroup \
  --name myVmVMNic
```

The following text is included in the returned output:

```console
{
  "additionalProperties": {
    "disableBgpRoutePropagation": false
  },
  "addressPrefix": [
    "0.0.0.0/0"
  ],
  "name": null,
  "nextHopIpAddress": [],
  "nextHopType": "Internet",
  "source": "Default",
  "state": "Active"
},
```

When you used the `az network watcher show-next-hop` command to test outbound communication to 13.107.21.200 in [Use next hop](#use-next-hop), the route with the **addressPrefix** 0.0.0.0/0** was used to route traffic to the address, since no other route in the output includes the address. By default, all addresses not specified within the address prefix of another route are routed to the internet.

When you used the `az network watcher show-next-hop` command to test outbound communication to 172.31.0.100 however, the result informed you that there was no next hop type. In the returned output you also see the following text:

```console
{
  "additionalProperties": {
    "disableBgpRoutePropagation": false
      },
  "addressPrefix": [
    "172.16.0.0/12"
  ],
  "name": null,
  "nextHopIpAddress": [],
  "nextHopType": "None",
  "source": "Default",
  "state": "Active"
},
```

As you can see in the output from the `az network watcher nic show-effective-route-table` command, though there is a default route to the 172.16.0.0/12 prefix, which includes the 172.31.0.100 address, the **nextHopType** is **None**. Azure creates a default route to 172.16.0.0/12, but doesn't specify a next hop type until there is a reason to. If, for example, you added the 172.16.0.0/12 address range to the address space of the virtual network, Azure changes the **nextHopType** to **Virtual network** for the route. A check would then show **Virtual network** as the **nextHopType**.

## Clean up resources

When no longer needed, you can use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all of the resources it contains:

```azurecli-interactive
az group delete --name myResourceGroup --yes
```

## Next steps

In this article, you created a VM and diagnosed network routing from the VM. You learned that Azure creates several default routes and tested routing to two different destinations. Learn more about [routing in Azure](../virtual-network/virtual-networks-udr-overview.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json) and how to [create custom routes](../virtual-network/manage-route-table.yml?toc=%2fazure%2fnetwork-watcher%2ftoc.json#create-a-route).

For outbound VM connections, you can also determine the latency and allowed and denied network traffic between the VM and an endpoint using Network Watcher's [connection troubleshoot](connection-troubleshoot-cli.md) capability. You can monitor communication between a VM and an endpoint, such as an IP address or URL over time using the Network Watcher connection monitor capability. For more information, see [Monitor a network connection](monitor-vm-communication.md).
