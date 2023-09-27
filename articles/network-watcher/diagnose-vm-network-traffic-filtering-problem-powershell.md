---
title: 'Quickstart: Diagnose a VM traffic filter problem - Azure PowerShell'
titleSuffix: Azure Network Watcher
description: In this quickstart, you learn how to diagnose a virtual machine network traffic filter problem using Azure Network Watcher IP flow verify in Azure PowerShell.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: quickstart
ms.date: 08/23/2023
ms.custom: devx-track-azurepowershell, mode-api
#Customer intent: I want to diagnose a virtual machine (VM) network traffic filter using IP flow verify to know which security rule is denying the traffic and causing the communication problem to the VM.
---

# Quickstart: Diagnose a virtual machine network traffic filter problem using Azure PowerShell

In this quickstart, you deploy a virtual machine and use Network Watcher [IP flow verify](network-watcher-ip-flow-verify-overview.md) to test the connectivity to and from different IP addresses. Using the IP flow verify results, you determine the security rule that's blocking the traffic and causing the communication failure and learn how you can resolve it. You also learn how to use the [effective security rules](effective-security-rules-overview.md) for a network interface to determine why a security rule is allowing or denying traffic.

:::image type="content" source="./media/diagnose-vm-network-traffic-filtering-problem-powershell/ip-flow-verify-quickstart-diagram.png" alt-text="Diagram shows the resources created in Network Watcher quickstart.":::

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription. 

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This quickstart requires the Azure PowerShell `Az` module. To find the installed version, run `Get-Module -ListAvailable Az`. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

## Create a virtual machine

In this section, you create a virtual network and a subnet in the East US region. Then, you create a virtual machine in the subnet with a default network security group.

1. Create a resource group using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). An Azure resource group is a logical container into which Azure resources are deployed and managed.

    ```azurepowershell-interactive
    # Create a resource group.
    New-AzResourceGroup -Name 'myResourceGroup' -Location 'eastus' 
    ```

1. Create a subnet configuration for the virtual machine subnet and the Bastion host subnet using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig).

    ```azurepowershell-interactive
    # Create subnets configuration.
    $Subnet = New-AzVirtualNetworkSubnetConfig -Name 'mySubnet' -AddressPrefix '10.0.0.0/24'
    ```

1. Create a virtual network using [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork).

    ```azurepowershell-interactive
    # Create a virtual network.
    New-AzVirtualNetwork -Name 'myVNet' -ResourceGroupName 'myResourceGroup' -Location 'eastus' -AddressPrefix '10.0.0.0/16' -Subnet $Subnet
    ```

1. Create a default network security group using [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup).

    ```azurepowershell-interactive
    # Create a network security group. 
    New-AzNetworkSecurityGroup -Name 'myVM-nsg' -ResourceGroupName 'myResourceGroup' -Location  'eastus'
    ```

1. Create a virtual machine using [New-AzVM](/powershell/module/az.compute/new-azvm). When prompted, enter a username and password.

    ```azurepowershell-interactive
    # Create a Linux virtual machine using the latest Ubuntu 20.04 LTS image.
    New-AzVm -ResourceGroupName 'myResourceGroup' -Name 'myVM' -Location 'eastus' -VirtualNetworkName 'myVNet' -SubnetName 'mySubnet' -SecurityGroupName 'myVM-nsg' -Image 'Canonical:0001-com-ubuntu-server-focal:20_04-lts-gen2:latest'
    ```

## Test network communication using IP flow verify

In this section, you use the IP flow verify capability of Network Watcher to test network communication to and from the virtual machine.

1. Use [Test-AzNetworkWatcherIPFlow](/powershell/module/az.network/test-aznetworkwatcheripflow) to test outbound communication from **myVM** to **13.107.21.200** using IP flow verify (`13.107.21.200` is one of the public IP addresses used by `www.bing.com`):

    ```azurepowershell-interactive
    # Place myVM configuration into a variable.
    $vm = Get-AzVM -ResourceGroupName 'myResourceGroup' -Name 'myVM'
    
    # Start the IP flow verify session to test outbound flow to www.bing.com.
    Test-AzNetworkWatcherIPFlow -Location 'eastus' -TargetVirtualMachineId $vm.Id -Direction 'Outbound' -Protocol 'TCP' -RemoteIPAddress '13.107.21.200' -RemotePort '80' -LocalIPAddress '10.0.0.4' -LocalPort '60000'
    ```

    After a few seconds, you get similar output to the following example:
    
    ```output
    Access RuleName
    ------ --------
    Allow  defaultSecurityRules/AllowInternetOutBound
    ```

    The test result indicates that access is allowed to **13.107.21.200** because of the default security rule **AllowInternetOutBound**. By default, Azure virtual machines can access the internet.

1. Change **RemoteIPAddress** to **10.0.1.10** and repeat the test. **10.0.1.10** is a private IP address in **myVNet** address space. 

    ```azurepowershell-interactive
    # Start the IP flow verify session to test outbound flow to 10.0.1.10.
    Test-AzNetworkWatcherIPFlow -Location 'eastus' -TargetVirtualMachineId $vm.Id -Direction 'Outbound' -Protocol 'TCP' -RemoteIPAddress '10.0.1.10' -RemotePort '80' -LocalIPAddress '10.0.0.4' -LocalPort '60000'
    ```
    
    After a few seconds, you get similar output to the following example:
    
    ```output
    Access RuleName
    ------ --------
    Allow  defaultSecurityRules/AllowVnetOutBound
    ```

    The result of the second test indicates that access is allowed to **10.0.1.10** because of the default security rule **AllowVnetOutBound**. By default, an Azure virtual machine can access all IP addresses in the address space of its virtual network.

1. Change **RemoteIPAddress** to **10.10.10.10** and repeat the test. **10.10.10.10** is a private IP address that isn't in **myVNet** address space.

    ```azurepowershell-interactive
    # Start the IP flow verify session to test outbound flow to 10.10.10.10.
    Test-AzNetworkWatcherIPFlow -Location 'eastus' -TargetVirtualMachineId $vm.Id -Direction 'Outbound' -Protocol 'TCP' -RemoteIPAddress '10.10.10.10' -RemotePort '80' -LocalIPAddress '10.0.0.4' -LocalPort '60000'
    ```
    
    After a few seconds, you get similar output to the following example:
    
    ```output
    Access RuleName
    ------ --------
    Allow  defaultSecurityRules/DenyAllOutBound
    ```

    The result of the third test indicates that access is denied to **10.10.10.10** because of the default security rule **DenyAllOutBound**.

1. Change **Direction** to **Inbound**, the **LocalPort** to **80**, and the **RemotePort** to **60000**, and then repeat the test. 

    ```azurepowershell-interactive
    # Start the IP flow verify session to test inbound flow from 10.10.10.10.
    Test-AzNetworkWatcherIPFlow -Location 'eastus' -TargetVirtualMachineId $vm.Id -Direction 'Inbound' -Protocol 'TCP' -RemoteIPAddress '10.10.10.10' -RemotePort '60000' -LocalIPAddress '10.0.0.4' -LocalPort '80'
    ```
    
    After a few seconds, you get similar output to the following example:
    
    ```output
    Access RuleName
    ------ --------
    Allow  defaultSecurityRules/DenyAllInBound
    ```

    The result of the fourth test indicates that access is denied from **10.10.10.10** because of the default security rule **DenyAllInBound**. By default, all access to an Azure virtual machine from outside the virtual network is denied.

## View details of a security rule

To determine why the rules in the previous section allow or deny communication, review the effective security rules for the network interface of **myVM** virtual machine using [Get-AzEffectiveNetworkSecurityGroup](/powershell/module/az.network/get-azeffectivenetworksecuritygroup) cmdlet:

```azurepowershell-interactive
# Get the effective security rules for the network interface of myVM.
Get-AzEffectiveNetworkSecurityGroup -NetworkInterfaceName 'myVM' -ResourceGroupName 'myResourceGroup'
```

The returned output includes the following information for the **AllowInternetOutbound** rule that allowed outbound access to `www.bing.com`:

```output
{
 "Name": "defaultSecurityRules/AllowInternetOutBound",
 "Protocol": "All",
 "SourcePortRange": [
   "0-65535"
 ],
 "DestinationPortRange": [
   "0-65535"
 ],
 "SourceAddressPrefix": [
   "0.0.0.0/0",
   "0.0.0.0/0"
 ],
 "DestinationAddressPrefix": [
   "Internet"
 ],
 "ExpandedSourceAddressPrefix": [],
 "ExpandedDestinationAddressPrefix": [
   "1.0.0.0/8",
   "2.0.0.0/7",
   "4.0.0.0/9",
   "4.144.0.0/12",
   "4.160.0.0/11",
   "4.192.0.0/10",
   "5.0.0.0/8",
   "6.0.0.0/7",
   "8.0.0.0/7",
   "11.0.0.0/8",
   "12.0.0.0/8",
   "13.0.0.0/10",
   "13.64.0.0/11",
   "13.104.0.0/13",
   "13.112.0.0/12",
   "13.128.0.0/9",
   "14.0.0.0/7",
   ...
   ...
   ...
   "200.0.0.0/5",
   "208.0.0.0/4"
 ],
 "Access": "Allow",
 "Priority": 65001,
 "Direction": "Outbound"
},
```

You can see in the output that address prefix **13.104.0.0/13** is among the address prefixes of **AllowInternetOutBound** rule. This prefix encompasses the IP address **13.107.21.200**, which you utilized to test outbound communication to `www.bing.com`.

Similarly, you can check the other rules to see the source and destination IP address prefixes under each rule.

## Clean up resources

When no longer needed, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to delete the resource group and all of the resources it contains:

```azurepowershell-interactive
# Delete the resource group and all resources it contains.
Remove-AzResourceGroup -Name 'myResourceGroup' -Force
```

## Next steps

In this quickstart, you created a VM and diagnosed inbound and outbound network traffic filters. You learned that network security group rules allow or deny traffic to and from a VM. Learn more about [security rules](../virtual-network/network-security-groups-overview.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json) and how to [create security rules](../virtual-network/manage-network-security-group.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json#create-a-security-rule).

Even with the proper network traffic filters in place, communication to a virtual machine can still fail, due to routing configuration. To learn how to diagnose virtual machine routing problems, see [Diagnose a virtual machine network routing problem](diagnose-vm-network-routing-problem-powershell.md). To diagnose outbound routing, latency, and traffic filtering problems with one tool, see [Troubleshoot connections with Azure Network Watcher](network-watcher-connectivity-powershell.md).