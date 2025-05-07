---
title: 'Quickstart: Create an internal load balancer - Azure PowerShell'
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create an internal load balancer using Azure PowerShell
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: quickstart
ms.date: 07/23/2024
ms.author: mbender
ms.custom: devx-track-azurepowershell, mode-api, template-quickstart
#Customer intent: I want to create a load balancer so that I can load balance internal traffic to VMs.
---

# Quickstart: Create an internal load balancer to load balance virtual machines using Azure PowerShell

Get started with Azure Load Balancer creating an internal load balancer and two virtual machines with Azure PowerShell. Also, you deploy other resources including Azure Bastion, NAT Gateway, a virtual network, and the required subnets.

:::image type="content" source="media/quickstart-load-balancer-standard-internal-portal/internal-load-balancer-resources.png" alt-text="Diagram of resources deployed for internal load balancer." lightbox="media/quickstart-load-balancer-standard-internal-portal/internal-load-balancer-resources.png":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)

- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).

```azurepowershell-interactive
$rg = @{
    Name = 'CreateINTLBQS-rg'
    Location = 'westus2'
}
New-AzResourceGroup @rg
```

## Configure virtual network

When you create an internal load balancer, a virtual network is configured as the network for the load balancer. Before you deploy VMs and test your load balancer, create the supporting virtual network resources.

- Create a public IP for the NAT gateway

- Create a virtual network for the backend virtual machines

- Create a network security group to define inbound connections to your virtual network

- Create an Azure Bastion host to securely manage the virtual machines in the backend pool

## Create a public IP address

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP address for the NAT gateway.

```azurepowershell-interactive
## Create public IP address for NAT gateway and place IP in variable ##
$gwpublicip = @{
    Name = 'myNATgatewayIP'
    ResourceGroupName = $rg.name
    Location = 'westus2'
    Sku = 'Standard'
    AllocationMethod = 'static'
    Zone = 1,2,3
}
$gwpublicip = New-AzPublicIpAddress @gwpublicip
```

To create a zonal public IP address in zone 1, use the following command:

```azurepowershell-interactive
## Create a zonal public IP address for NAT gateway and place IP in variable ##
$gwpublicip = @{
    Name = 'myNATgatewayIP'
    ResourceGroupName = $rg.name
    Location = 'westus2'
    Sku = 'Standard'
    AllocationMethod = 'static'
    Zone = 1
}
$gwpublicip = New-AzPublicIpAddress @gwpublicip

```
> [!NOTE]
> The public IP address is used by the NAT gateway to provide outbound connectivity for the virtual machines in the backend pool. This is recommended when you create an internal load balancer and need the backend pool resources to have outbound connectivity. For more information, see [NAT gateway](load-balancer-outbound-connections.md).

### Create virtual network, network security group, bastion host, and NAT gateway

* Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork)

* Create a network security group rule with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig)

* Create an Azure Bastion host with [New-AzBastion](/powershell/module/az.network/new-azbastion)

* Create the NAT gateway resource with [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway)

* Use [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) to associate the NAT gateway to the subnet of the virtual network

> [!IMPORTANT]
> [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

```azurepowershell-interactive

## Create NAT gateway resource ##
$nat = @{
    ResourceGroupName = $rg.name
    Name = 'myNATgateway'
    IdleTimeoutInMinutes = '10'
    Sku = 'Standard'
    Location = 'westus2'
    PublicIpAddress = $gwpublicip
}
$natGateway = New-AzNatGateway @nat

## Create backend subnet config ##
$subnet = @{
    Name = 'myBackendSubnet'
    AddressPrefix = '10.1.0.0/24'
    NatGateway = $natGateway
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet 

## Create Azure Bastion subnet. ##
$bastsubnet = @{
    Name = 'AzureBastionSubnet' 
    AddressPrefix = '10.1.1.0/24'
}
$bastsubnetConfig = New-AzVirtualNetworkSubnetConfig @bastsubnet

## Create the virtual network ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = $rg.name
    Location = 'westus2'
    AddressPrefix = '10.1.0.0/16'
    Subnet = $subnetConfig,$bastsubnetConfig
}
$vnet = New-AzVirtualNetwork @net

## Create public IP address for bastion host. ##
$bastionip = @{
    Name = 'myBastionIP'
    ResourceGroupName = $rg.name
    Location = 'westus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
}
$bastionip = New-AzPublicIpAddress @bastionip

## Create bastion host ##
$bastion = @{
    ResourceGroupName = $rg.name
    Name = 'myBastion'
    PublicIpAddress = $bastionip
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
    ResourceGroupName = $rg.name
    Location = 'westus2'
    SecurityRules = $rule1
}
New-AzNetworkSecurityGroup @nsg

```
## Create load balancer

This section details how you can create and configure the following components of the load balancer:

* Create a frontend IP with [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig) for the frontend IP pool. This IP receives the incoming traffic on the load balancer

* Create a backend address pool with [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig) for traffic sent from the frontend of the load balancer

* Create a health probe with [Add-AzLoadBalancerProbeConfig](/powershell/module/az.network/add-azloadbalancerprobeconfig) that determines the health of the backend VM instances

* Create a load balancer rule with [Add-AzLoadBalancerRuleConfig](/powershell/module/az.network/add-azloadbalancerruleconfig) that defines how traffic is distributed to the VMs

* Create a public load balancer with [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer)

```azurepowershell-interactive
## Place virtual network created in previous step into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = $rg.name
}
$vnet = Get-AzVirtualNetwork @net

## Create load balancer frontend configuration and place in variable. ##
$lbip = @{
    Name = 'myFrontEnd'
    PrivateIpAddress = '10.1.0.4'
    SubnetId = $vnet.subnets[0].Id
}
$feip = New-AzLoadBalancerFrontendIpConfig @lbip

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
}
$rule = New-AzLoadBalancerRuleConfig @lbrule -EnableTcpReset

## Create the load balancer resource. ##
$loadbalancer = @{
    ResourceGroupName = $rg.name
    Name = 'myLoadBalancer'
    Location = 'westus2'
    Sku = 'Standard'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bePool
    LoadBalancingRule = $rule
    Probe = $healthprobe
}
New-AzLoadBalancer @loadbalancer

```

## Create virtual machines

In this section, you create the two virtual machines for the backend pool of the load balancer.

* Create three network interfaces with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface)

* Set an administrator username and password for the VMs with [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential)

* Create the virtual machines with:
    
    * [New-AzVM](/powershell/module/az.compute/new-azvm)
    
    * [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig)
    
    * [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem)
    
    * [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage)
    
    * [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)

```azurepowershell-interactive
# Set the administrator and password for the VMs. ##
$cred = Get-Credential

## Place virtual network created in previous step into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = $rg.name
}
$vnet = Get-AzVirtualNetwork @net

## Place the load balancer into a variable. ##
$lb = @{
    Name = 'myLoadBalancer'
    ResourceGroupName = $rg.name
}
$bepool = Get-AzLoadBalancer @lb  | Get-AzLoadBalancerBackendAddressPoolConfig

## Place the network security group into a variable. ##
$sg = @{
    Name = 'myNSG'
    ResourceGroupName = $rg.name
}
$nsg = Get-AzNetworkSecurityGroup @sg

## For loop with variable to create virtual machines for load balancer backend pool. ##
for ($i=1; $i -le 2; $i++)
{
    ## Command to create network interface for VMs ##
    $nic = @{
    Name = "myNicVM$i"
    ResourceGroupName = $rg.name
    Location = 'westus2'
    Subnet = $vnet.Subnets[0]
    NetworkSecurityGroup = $nsg
    LoadBalancerBackendAddressPool = $bepool
    }
    $nicVM = New-AzNetworkInterface @nic

    ## Create a virtual machine configuration for VMs ##
    $vmsz = @{
        VMName = "myVM$i"
        VMSize = 'Standard_DS1_v2'  
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
        ResourceGroupName = $rg.name
        Location = 'westus2'
        VM = $vmConfig
        Zone = "$i"
    }
}
New-AzVM @vm -asjob
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

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

## Install IIS

Use [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) to install the Custom Script Extension. 

The extension runs `PowerShell Add-WindowsFeature Web-Server` to install the IIS webserver and then updates the Default.htm page to show the hostname of the VM:

> [!IMPORTANT]
> Ensure the virtual machine deployments have completed from the previous steps before proceeding.  Use `Get-Job` to check the status of the virtual machine deployment jobs.

```azurepowershell-interactive
## For loop with variable to install custom script extension on virtual machines. ##
for ($i=1; $i -le 2; $i++)
{
    $ext = @{
        Publisher = 'Microsoft.Compute'
        ExtensionType = 'CustomScriptExtension'
        ExtensionName = 'IIS'
        ResourceGroupName = $rg.name
        VMName = "myVM$i"
        Location = 'westus2'
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

## Create the test virtual machine

Create the virtual machine with:

* [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface)

* [New-AzVM](/powershell/module/az.compute/new-azvm)

* [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig)

* [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem)

* [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage)

* [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)

```azurepowershell-interactive
# Set the administrator and password for the VM. ##
$cred = Get-Credential

## Place the virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = $rg.name
}
$vnet = Get-AzVirtualNetwork @net

## Place the network security group into a variable. ##
$sg = @{
    Name = 'myNSG'
    ResourceGroupName = $rg.name 
}
$nsg = Get-AzNetworkSecurityGroup @sg

## Command to create network interface for VM ##
$nic = @{
    Name = "myNicTestVM"
    ResourceGroupName = $rg.name
    Location = 'westus2'
    Subnet = $vnet.Subnets[0]
    NetworkSecurityGroup = $nsg
}
$nicVM = New-AzNetworkInterface @nic

## Create a virtual machine configuration for VMs ##
$vmsz = @{
    VMName = "myTestVM"
    VMSize = 'Standard_DS1_v2' 
}
$vmos = @{
    ComputerName = "myTestVM"
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
    ResourceGroupName = $rg.name
    Location = 'westus2'
    VM = $vmConfig
}
New-AzVM @vm
```

## Test the load balancer

1. [Sign in](https://portal.azure.com) to the Azure portal.

1. Find the private IP address for the load balancer on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myLoadBalancer**.

2. Make note or copy the address next to **Private IP Address** in the **Overview** of **myLoadBalancer**.

3. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **myTestVM** that is located in the **CreateIntLBQS-rg** resource group.

4. On the **Overview** page, select **Connect**, then **Bastion**.

6. Enter the username and password entered during VM creation.

7. Open **Internet Explorer** on **myTestVM**.

8. Enter the IP address from the previous step into the address bar of the browser. The custom IIS Web server page is displayed.

    :::image type="content" source="./media/quickstart-load-balancer-standard-internal-portal/load-balancer-test.png" alt-text="Screenshot of web browser showing default web page for load balanced VM" border="true":::
   
To see the load balancer distribute traffic across all three VMs, you can force-refresh your web browser from the test machine.

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, load balancer, and the remaining resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name $rg.name
```

## Next steps

In this quickstart:

* You created an internal load balancer

* Attached virtual machines

* Configured the load balancer traffic rule and health probe

* Tested the load balancer

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)
