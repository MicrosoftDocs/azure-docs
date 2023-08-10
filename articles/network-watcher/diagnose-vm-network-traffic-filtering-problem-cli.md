---
title: 'Quickstart: Diagnose a VM network traffic filter problem - Azure CLI'
titleSuffix: Azure Network Watcher
description: In this quickstart, you learn how to diagnose a virtual machine network traffic filter problem using the IP flow verify capability of Azure Network Watcher in Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: quickstart
ms.date: 06/30/2023
ms.custom: template-quickstart, devx-track-azurecli, engagement-fy23, mode-api
#Customer intent: I need to diagnose a virtual machine (VM) network traffic filter problem that prevents communication to and from a VM.
---

# Quickstart: Diagnose a virtual machine network traffic filter problem using the Azure CLI

Azure allows and denies network traffic to and from a virtual machine based on its [effective security rules](network-watcher-security-group-view-overview.md). These security rules come from the network security groups applied to the virtual machine's network interface and subnet.

In this quickstart, you deploy a virtual machine and use Network Watcher [IP flow verify](network-watcher-ip-flow-verify-overview.md) to test the connectivity to and from different IP addresses. Using the IP flow verify results, you determine the cause of a communication failure and learn how you can resolve it.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription. 

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. This quickstart requires version 2.0 or later of the Azure CLI. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.
 
## Create a virtual machine

In this section, you create a virtual network and a subnet in the East US region. Then, you create a virtual machine in the subnet with a default network security group.

1. Before you can create a VM, you must create a resource group to contain the VM. Create a resource group with [az group create](/cli/azure/group). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

2. Create a VM with [az vm create](/cli/azure/vm). If SSH keys don't already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option. The following example creates a VM named *myVm*:

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVm \
  --image UbuntuLTS \
  --generate-ssh-keys
```

The VM takes a few minutes to create. Don't continue with the remaining steps until the VM is created and the Azure CLI returns the output.

## Test network communication using IP flow verify

In this section, you use the IP flow verify capability of Network Watcher to test network communication to and from the virtual machine.

When you create a VM, Azure allows and denies network traffic to and from the VM, by default. You might override Azure's defaults later, allowing or denying additional types of traffic. To test whether traffic is allowed or denied to different destinations and from a source IP address, use the [az network watcher test-ip-flow](/cli/azure/network/watcher#az-network-watcher-test-ip-flow) command.

Test outbound communication from the VM to one of the IP addresses for www.bing.com:

```azurecli-interactive
az network watcher test-ip-flow \
  --direction outbound \
  --local 10.0.0.4:60000 \
  --protocol TCP \
  --remote 13.107.21.200:80 \
  --vm myVm \
  --nic myVmVMNic \
  --resource-group myResourceGroup \
  --out table
```

After several seconds, the result returned informs you that access is allowed by a security rule named **DenyAllOutBound**.

Test outbound communication from the VM to 172.31.0.100:

```azurecli-interactive
az network watcher test-ip-flow \
  --direction outbound \
  --local 10.0.0.4:60000 \
  --protocol TCP \
  --remote 172.31.0.100:80 \
  --vm myVm \
  --nic myVmVMNic \
  --resource-group myResourceGroup \
  --out table
```

The result returned informs you that access is denied by a security rule named **DenyAllOutBound**.

Test inbound communication to the VM from 172.31.0.100:

```azurecli-interactive
az network watcher test-ip-flow \
  --direction inbound \
  --local 10.0.0.4:80 \
  --protocol TCP \
  --remote 172.31.0.100:60000 \
  --vm myVm \
  --nic myVmVMNic \
  --resource-group myResourceGroup \
  --out table
```

The result returned informs you that access is denied because of a security rule named **DenyAllInBound**. Now that you know which security rules are allowing or denying traffic to or from a VM, you can determine how to resolve the problems.

## View details of a security rule

To determine why the rules in the previous section are allowing or preventing communication, review the effective security rules for the network interface with the [az network nic list-effective-nsg](/cli/azure/network/nic#az-network-nic-list-effective-nsg) command:

```azurecli-interactive
az network nic list-effective-nsg \
  --resource-group myResourceGroup \
  --name myVmVMNic
```

The output includes the following text for the **AllowInternetOutbound** rule that allowed outbound access to www.bing.com in a previous step under [Test network communication using IP flow verify](#test-network-communication-using-ip-flow-verify) section:

```console
{
 "access": "Allow",
 "additionalProperties": {},
 "destinationAddressPrefix": "Internet",
 "destinationAddressPrefixes": [
  "Internet"
 ],
 "destinationPortRange": "0-65535",
 "destinationPortRanges": [
  "0-65535"
 ],
 "direction": "Outbound",
 "expandedDestinationAddressPrefix": [
  "1.0.0.0/8",
  "2.0.0.0/7",
  "4.0.0.0/6",
  "8.0.0.0/7",
  "11.0.0.0/8",
  "12.0.0.0/6",
  ...
 ],
 "expandedSourceAddressPrefix": null,
 "name": "defaultSecurityRules/AllowInternetOutBound",
 "priority": 65001,
 "protocol": "All",
 "sourceAddressPrefix": "0.0.0.0/0",
 "sourceAddressPrefixes": [
  "0.0.0.0/0"
 ],
 "sourcePortRange": "0-65535",
 "sourcePortRanges": [
  "0-65535"
 ]
},
```

You can see in the previous output that **destinationAddressPrefix** is **Internet**. It's not clear how 13.107.21.200 relates to **Internet** though. You see several address prefixes listed under **expandedDestinationAddressPrefix**. One of the prefixes in the list is **12.0.0.0/6**, which encompasses the 12.0.0.1-15.255.255.254 range of IP addresses. Since 13.107.21.200 is within that address range, the **AllowInternetOutBound** rule allows the outbound traffic. Additionally, there are no higher priority (lower number) rules shown in the previous output that override this rule. To deny outbound communication to an IP address, you could add a security rule with a higher priority, that denies port 80 outbound to the IP address.

When you ran the [az network watcher test-ip-flow](/cli/azure/network/watcher#az-network-watcher-test-ip-flow) command to test outbound communication to 172.131.0.100 in [Test network communication using IP flow verify](#test-network-communication-using-ip-flow-verify) section, the output informed you that the **DenyAllOutBound** rule denied the communication. The **DenyAllOutBound** rule equates to the **DenyAllOutBound** rule listed in the following output from the [az network nic list-effective-nsg](/cli/azure/network/nic#az-network-nic-list-effective-nsg) command:

```console
{
 "access": "Deny",
 "additionalProperties": {},
 "destinationAddressPrefix": "0.0.0.0/0",
 "destinationAddressPrefixes": [
  "0.0.0.0/0"
 ],
 "destinationPortRange": "0-65535",
 "destinationPortRanges": [
  "0-65535"
 ],
 "direction": "Outbound",
 "expandedDestinationAddressPrefix": null,
 "expandedSourceAddressPrefix": null,
 "name": "defaultSecurityRules/DenyAllOutBound",
 "priority": 65500,
 "protocol": "All",
 "sourceAddressPrefix": "0.0.0.0/0",
 "sourceAddressPrefixes": [
  "0.0.0.0/0"
 ],
 "sourcePortRange": "0-65535",
 "sourcePortRanges": [
  "0-65535"
 ]
}
```

The rule lists **0.0.0.0/0** as the **destinationAddressPrefix**. The rule denies the outbound communication to 172.131.0.100 because the address is not within the **destinationAddressPrefix** of any of the other outbound rules in the output from the [az network nic list-effective-nsg](/cli/azure/network/nic#az-network-nic-list-effective-nsg) command. To allow the outbound communication, you could add a security rule with a higher priority, that allows outbound traffic to port 80 at 172.131.0.100.

When you ran the [az network watcher test-ip-flow](/cli/azure/network/watcher#az-network-watcher-test-ip-flow) command in [Test network communication using IP flow verify](#test-network-communication-using-ip-flow-verify) section to test inbound communication from 172.131.0.100, the output informed you that the **DenyAllInBound** rule denied the communication. The **DenyAllInBound** rule equates to the **DenyAllInBound** rule listed in the following output from the [az network nic list-effective-nsg](/cli/azure/network/nic#az-network-nic-list-effective-nsg) command:

```console
{
 "access": "Deny",
 "additionalProperties": {},
 "destinationAddressPrefix": "0.0.0.0/0",
 "destinationAddressPrefixes": [
  "0.0.0.0/0"
 ],
 "destinationPortRange": "0-65535",
 "destinationPortRanges": [
  "0-65535"
 ],
 "direction": "Inbound",
 "expandedDestinationAddressPrefix": null,
 "expandedSourceAddressPrefix": null,
 "name": "defaultSecurityRules/DenyAllInBound",
 "priority": 65500,
 "protocol": "All",
 "sourceAddressPrefix": "0.0.0.0/0",
 "sourceAddressPrefixes": [
  "0.0.0.0/0"
 ],
 "sourcePortRange": "0-65535",
 "sourcePortRanges": [
  "0-65535"
 ]
},
```

The **DenyAllInBound** rule is applied because, as shown in the output, no other higher priority rule exists in the output from the [az network nic list-effective-nsg](/cli/azure/network/nic#az-network-nic-list-effective-nsg) command that allows port 80 inbound to the VM from 172.131.0.100. To allow the inbound communication, you could add a security rule with a higher priority that allows port 80 inbound from 172.131.0.100.

The checks in this quickstart tested Azure configuration. If the checks return the expected results and you still have network problems, ensure that you don't have a firewall between your VM and the endpoint you're communicating with and that the operating system in your VM doesn't have a firewall that is allowing or denying communication.

## Clean up resources

When no longer needed, you can use [az group delete](/cli/azure/group) to remove the resource group and all of the resources it contains:

```azurecli-interactive
az group delete --name myResourceGroup --yes
```

## Next steps

In this quickstart, you created a VM and diagnosed inbound and outbound network traffic filters. You learned that network security group rules allow or deny traffic to and from a VM. Learn more about [security rules](../virtual-network/network-security-groups-overview.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json) and how to [create security rules](../virtual-network/manage-network-security-group.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json#create-a-security-rule).

Even with the proper network traffic filters in place, communication to a virtual machine can still fail, due to routing configuration. To learn how to diagnose virtual machine routing problems, see [Diagnose a virtual machine network routing problem](diagnose-vm-network-routing-problem-cli.md). To diagnose outbound routing, latency, and traffic filtering problems with one tool, see [Troubleshoot connections with Azure Network Watcher](network-watcher-connectivity-cli.md).