---
title: 'Quickstart: Create a basic internal load balancer - Azure PowerShell'
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a basic internal load balancer using Azure PowerShell
author: mbender-ms
ms.author: mbender
ms.date: 06/08/2023
ms.topic: quickstart
ms.service: load-balancer
ms.custom: devx-track-azurepowershell, mode-api
#Customer intent: I want to create a load balancer so that I can load balance internet traffic to VMs.
---

# Quickstart: Create a basic internal load balancer to load balance VMs using Azure PowerShell

Get started with Azure Load Balancer by using Azure PowerShell to create a public load balancer and two virtual machines.

>[!NOTE]
>Standard SKU load balancer is recommended for production workloads. For more information about SKUs, see **[Azure Load Balancer SKUs](../skus.md)**.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)

- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
$rg = @{
    Name = 'CreatePubLBQS-rg'
    Location = 'westus3'
}
New-AzResourceGroup @rg
```

## Create a public IP address

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP address.

```azurepowershell-interactive
$publicip = @{
    Name = 'myPublicIP'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'westus3'
    Sku = 'Basic'
    AllocationMethod = 'static'
}
New-AzPublicIpAddress @publicip
```

## Create a load balancer

This section details how you can create and configure the following components of the load balancer:

* Create a front-end IP with [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig) for the frontend IP pool. This IP receives the incoming traffic on the load balancer

* Create a back-end address pool with [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig) for traffic sent from the frontend of the load balancer. This pool is where your backend virtual machines are deployed

* Create a health probe with [Add-AzLoadBalancerProbeConfig](/powershell/module/az.network/add-azloadbalancerprobeconfig) that determines the health of the backend VM instances

* Create a load balancer rule with [Add-AzLoadBalancerRuleConfig](/powershell/module/az.network/add-azloadbalancerruleconfig) that defines how traffic is distributed to the VMs

* Create a public load balancer with [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer)

```azurepowershell-interactive
## Place public IP created in previous steps into variable. ##
$pip = @{
    Name = 'myPublicIP'
    ResourceGroupName = 'CreatePubLBQS-rg'
}
$publicIp = Get-AzPublicIpAddress @pip

## Create load balancer frontend configuration and place in variable. ##
$fip = @{
    Name = 'myFrontEnd'
    PublicIpAddress = $publicIp 
}
$feip = New-AzLoadBalancerFrontendIpConfig @fip

## Create backend address pool configuration and place in variable. ##
$bepool = New-AzLoadBalancerBackendAddressPoolConfig -Name 'myBackEndPool'

## Create the health probe and place in variable. ##
$probe = @{
    Name = 'myHealthProbe'
    Protocol = 'tcp'
    Port = '80'
    IntervalInSeconds = '360'
    ProbeCount = '5'
}
$healthprobe = New-AzLoadBalancerProbeConfig @probe

## Create the load balancer rule and place in variable. ##
$lbrule = @{
    Name = 'myHTTPRule'
    Protocol = 'tcp'
    FrontendPort = '80'
    BackendPort = '80'
    IdleTimeoutInMinutes = '15'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bePool
    Probe = $probe
}
$rule = New-AzLoadBalancerRuleConfig @lbrule

## Create the load balancer resource. ##
$loadbalancer = @{
    ResourceGroupName = 'CreatePubLBQS-rg'
    Name = 'myLoadBalancer'
    Location = 'westus3'
    Sku = 'Basic'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bePool
    LoadBalancingRule = $rule
    Probe = $healthprobe
}
New-AzLoadBalancer @loadbalancer
```

## Configure virtual network

Before you deploy VMs and test your load balancer, create the supporting virtual network resources.

Create a virtual network for the backend virtual machines.

Create a network security group to define inbound connections to your virtual network.

Create an Azure Bastion host to securely manage the virtual machines in the backend pool.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../../includes/bastion-pricing.md)]

>

### Create virtual network, network security group and bastion host.

* Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork)

* Create a network security group rule with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig)

* Create an Azure Bastion host with [New-AzBastion](/powershell/module/az.network/new-azbastion)

* Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup)

* Create the NAT gateway resource with [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway)



```azurepowershell-interactive
## Create backend subnet config ##
$subnet = @{
    Name = 'myBackendSubnet'
    AddressPrefix = '10.1.0.0/24'
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet 

## Create Azure Bastion subnet. ##
$bastsubnet = @{
    Name = 'AzureBastionSubnet' 
    AddressPrefix = '10.1.1.0/26'
}
$bastsubnetConfig = New-AzVirtualNetworkSubnetConfig @bastsubnet

## Create the virtual network ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'westus3'
    AddressPrefix = '10.1.0.0/16'
    Subnet = $subnetConfig,$bastsubnetConfig
}
$vnet = New-AzVirtualNetwork @net

## Create public IP address for bastion host. ##
$ip = @{
    Name = 'myBastionIP'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'westus3'
    Sku = 'Standard'
    AllocationMethod = 'Static'
}
$publicip = New-AzPublicIpAddress @ip

## Create bastion host ##
$bastion = @{
    ResourceGroupName = 'CreatePubLBQS-rg'
    Name = 'myBastion'
    PublicIpAddress = $publicip
    VirtualNetwork = $vnet
}
New-AzBastion @bastion -AsJob

## Create rule for network security group and place in variable. ##
$nsgrule = @{
    Name = 'myNSGRuleHTTP'
    Description = 'Allow HTTP'
    Protocol = '*'
    SourcePortRange = '*'
    DestinationPortRange = '80'
    SourceAddressPrefix = 'Internet'
    DestinationAddressPrefix = '*'
    Access = 'Allow'
    Priority = '2000'
    Direction = 'Inbound'
}
$rule1 = New-AzNetworkSecurityRuleConfig @nsgrule

## Create network security group ##
$nsg = @{
    Name = 'myNSG'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'westus3'
    SecurityRules = $rule1
}
New-AzNetworkSecurityGroup @nsg
```

## Create virtual machines

In this section, you'll create the two virtual machines for the backend pool of the load balancer.

* Create two network interfaces with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface)

* Set an administrator username and password for the VMs with [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential)

* Use [New-AzAvailabilitySet](/powershell/module/az.compute/new-azvm) to create an availability set for the virtual machines.

* Create the virtual machines with:
    
    * [New-AzVM](/powershell/module/az.compute/new-azvm)
    
    * [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig)
    
    * [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem)
    
    * [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage)
    
    * [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)

```azurepowershell-interactive
# Set the administrator and password for the VMs. ##
$cred = Get-Credential

## Place the virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'CreatePubLBQS-rg'
}
$vnet = Get-AzVirtualNetwork @net

## Place the load balancer into a variable. ##
$lb = @{
    Name = 'myLoadBalancer'
    ResourceGroupName = 'CreatePubLBQS-rg'
}
$bepool = Get-AzLoadBalancer @lb  | Get-AzLoadBalancerBackendAddressPoolConfig

## Place the network security group into a variable. ##
$ns = @{
    Name = 'myNSG'
    ResourceGroupName = 'CreatePubLBQS-rg'
}
$nsg = Get-AzNetworkSecurityGroup @ns

## Create availability set for the virtual machines. ##
$set = @{
    Name = 'myAvSet'
    ResourceGroupName = 'CreatePubLBQS-rg'
    Location = 'westus3'
    Sku = 'Aligned'
    PlatformFaultDomainCount = '2'
    PlatformUpdateDomainCount =  '2'
}
$avs = New-AzAvailabilitySet @set

## For loop with variable to create virtual machines for load balancer backend pool. ##
for ($i=1; $i -le 2; $i++)
{
    ## Command to create network interface for VMs ##
    $nic = @{
        Name = "myNicVM$i"
        ResourceGroupName = 'CreatePubLBQS-rg'
        Location = 'westus3'
        Subnet = $vnet.Subnets[0]
        NetworkSecurityGroup = $nsg
        LoadBalancerBackendAddressPool = $bepool
    }
    $nicVM = New-AzNetworkInterface @nic

    ## Create a virtual machine configuration for VMs ##
    $vmsz = @{
        VMName = "myVM$i"
        VMSize = 'Standard_DS1_v2'
        AvailabilitySetId = $avs.Id 
    }
    $vmos = @{
        ComputerName = "myVM$i"
        Credential = $cred
    }
    $vmimage = @{
        PublisherName = 'MicrosoftWindowsServer'
        Offer = 'WindowsServer'
        Skus = '2019-Datacenter'
        Version = 'latest'    
    }
    $vmConfig = New-AzVMConfig @vmsz `
        | Set-AzVMOperatingSystem @vmos -Windows `
        | Set-AzVMSourceImage @vmimage `
        | Add-AzVMNetworkInterface -Id $nicVM.Id

    ## Create the virtual machine for VMs ##
    $vm = @{
        ResourceGroupName = 'CreatePubLBQS-rg'
        Location = 'westus3'
        VM = $vmConfig
    }
    New-AzVM @vm -AsJob
}
```

The deployments of the virtual machines and bastion host are submitted as PowerShell jobs. To view the status of the jobs, use [Get-Job](/powershell/module/microsoft.powershell.core/get-job):

```azurepowershell-interactive
Get-Job

Id     Name            PSJobTypeName   State         HasMoreData     Location             Command
--     ----            -------------   -----         -----------     --------             -------
1      Long Running O… AzureLongRunni… Completed     True            localhost            New-AzBastion
2      Long Running O… AzureLongRunni… Completed     True            localhost            New-AzVM
3      Long Running O… AzureLongRunni… Completed     True            localhost            New-AzVM
```

Ensure the **State** of the VM creation is **Completed** before moving on to the next steps.

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Install IIS

Use [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) to install the Custom Script Extension. 

The extension runs `PowerShell Add-WindowsFeature Web-Server` to install the IIS webserver and then updates the Default.htm page to show the hostname of the VM:

> [!IMPORTANT]
> Ensure the virtual machine deployments have completed from the previous steps before proceeding. Use `Get-Job` to check the status of the virtual machine deployment jobs.

```azurepowershell-interactive
## For loop with variable to install custom script extension on virtual machines. ##
for ($i=1; $i -le 2; $i++)
{
$ext = @{
    Publisher = 'Microsoft.Compute'
    ExtensionType = 'CustomScriptExtension'
    ExtensionName = 'IIS'
    ResourceGroupName = 'CreatePubLBQS-rg'
    VMName = "myVM$i"
    Location = 'westus3'
    TypeHandlerVersion = '1.8'
    SettingString = '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
}
Set-AzVMExtension @ext -AsJob
}
```

The extensions are deployed as PowerShell jobs. To view the status of the installation jobs, use [Get-Job](/powershell/module/microsoft.powershell.core/get-job):

```azurepowershell-interactive
Get-Job

Id     Name            PSJobTypeName   State         HasMoreData     Location             Command
--     ----            -------------   -----         -----------     --------             -------
8      Long Running O… AzureLongRunni… Running       True            localhost            Set-AzVMExtension
9      Long Running O… AzureLongRunni… Running       True            localhost            Set-AzVMExtension
```

Ensure the **State** of the jobs is **Completed** before moving on to the next steps.

## Test the load balancer

Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to get the public IP address of the load balancer:

```azurepowershell-interactive
$ip = @{
    ResourceGroupName = 'CreatePubLBQS-rg'
    Name = 'myPublicIP'
}  
Get-AzPublicIPAddress @ip | select IpAddress
```

Copy the public IP address, and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, load balancer, and the remaining resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'CreatePubLBQS-rg'
```

## Next steps

In this quickstart, you:

* Created an Azure Load Balancer

* Attached 2 VMs to the load balancer

* Tested the load balancer

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](../load-balancer-overview.md)
