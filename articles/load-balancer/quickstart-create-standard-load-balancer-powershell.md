---
title: 'Quickstart: Create a public load balancer - Azure PowerShell'
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a load balancer using Azure PowerShell
services: load-balancer
documentationcenter: na
author: asudbring
manager: KumudD
Customer intent: I want to create a load balancer so that I can load balance internet traffic to VMs.
ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/21/2020
ms.author: allensu
ms:custom: seodec18
---

# Quickstart: Create a public load balancer to load balance VMs using Azure PowerShell

Get started with Azure Load Balancer by using Azure CLI to create a public load balancer and three virtual machines.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

* Named **myResourceGroupLB**.
* In the **eastus** location.

```azurepowershell-interactive
$rg = 'MyResourceGroupLB'
$loc = 'eastus'

New-AzResourceGroup -Name $rg -Location $loc
```

## Create a public IP address

To access your web app on the Internet, you need a public IP address for the load balancer. 

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to:

* Create a standard zone redundant public IP address named **myPublicIP**.
* In **myResourceGroupLB**.

```azurepowershell-interactive
$rg = 'MyResourceGroupLB'
$loc = 'eastus'
$pubIP = 'myPublicIP'
$sku = 'Standard'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku
```

To create a zonal public IP address in zone 1, use the following:

```azurepowershell-interactive
$rg = 'MyResourceGroupLB'
$loc = 'eastus'
$pubIP = 'myPublicIP'
$sku = 'Standard'
$all = 'static'

$publicIp = 
New-AzPublicIpAddress -ResourceGroupName $rg -Name $pubIP -Location $loc -AllocationMethod $all -SKU $sku -zone 1
```

## Create standard load balancer

This section details how you can create and configure the following components of the load balancer:

  * A frontend IP pool that receives the incoming network traffic on the load balancer.
  * A backend IP pool where the frontend pool sends the load balanced network traffic.
  * A health probe that determines health of the backend VM instances.
  * A load balancer rule that defines how traffic is distributed to the VMs.

### Create frontend IP

Create a front-end IP with [New-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/new-azloadbalancerfrontendipconfig):

* Named **myFrontEnd**.
* Attached to public IP **myPublicIP**.

```azurepowershell-interactive
$fe='myFrontEnd'
$rg='MyResourceGroupLB'
$loc='eastus'
$pubIP='myPublicIP'

$publicIp = 
Get-AzPublicIpAddress -Name $pubIP -ResourceGroupName $rg

$feip = 
New-AzLoadBalancerFrontendIpConfig -Name $fe -PublicIpAddress $publicIp
```

### Configure back-end address pool

Create a back-end address pool with [New-AzLoadBalancerBackendAddressPoolConfig](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig): 

* Named **myBackEndPool**.
* The VMs attach to this back-end pool in the remaining steps.

```azurepowershell-interactive
$be = 'myBackEndPool'

$bepool = 
New-AzLoadBalancerBackendAddressPoolConfig -Name $be
```

### Create the health probe

A health probe checks all virtual machine instances to ensure they can send network traffic. 

A virtual machine with a failed probe check is removed from the load balancer. The virtual machine is added back into the load balancer when the failure is resolved.

Create a health probe with [Add-AzLoadBalancerProbeConfig](/powershell/module/az.network/add-azloadbalancerprobeconfig):

* Monitors the health of the virtual machines.
* Named **myHealthProbe**.
* Protocol **TCP**.
* Monitoring **Port 80**.

```azurepowershell-interactive
$hp = 'myHealthProbe'
$pro = 'http'
$port = '80'
$int = '360'
$cnt = '5'

$probe = 
New-AzLoadBalancerProbeConfig -Name $hp -Protocol $pro -Port $port -RequestPath / -IntervalInSeconds $int -ProbeCount $cnt
```

### Create the load balancer rule

A load balancer rule defines:

* Frontend IP configuration for the incoming traffic.
* The backend IP pool to receive the traffic.
* The required source and destination port. 

Create a load balancer rule with [Add-AzLoadBalancerRuleConfig](/powershell/module/az.network/add-azloadbalancerruleconfig): 

* Named **myHTTPRule**
* Listening on **Port 80** in the frontend pool **myFrontEnd**.
* Sending load-balanced network traffic to the backend address pool **myBackEndPool** using **Port 80**. 
* Using health probe **myHealthProbe**.
* Protocol **TCP**.
* Enable outbound source network address translation (SNAT) using the frontend IP address.


```azurepowershell-interactive
$lbr = 'myHTTPRule'
$pro = 'tcp'
$port = '80'


## $feip and $bePool are the variables from previous steps. ##

$rule = New-AzLoadBalancerRuleConfig -Name $lbr -Protocol $pro -Probe $probe -FrontendPort $port -BackendPort $port -FrontendIpConfiguration $feip -BackendAddressPool $bePool --DisableOutboundSNAT $false
```
> [!NOTE]
> The command above enables outbound connectivity for the resources in the backend pool of the load balancer. For advanced outbound connectivity configuration, omit **(-DisableOutboundSNAT $false)** and refer to **[Outbound connections in Azure](load-balancer-outbound-connections.md)** and **[Configure load balancing and outbound rules in Standard Load Balancer by using Azure CLI](configure-load-balancer-outbound-cli.md)**.

### Create the NAT rules

Create NAT rules with [New-AzLoadBalancerInboundNatRuleConfig](/powershell/module/az.network/new-azloadbalancerinboundnatruleconfig) to allow RDP connections to the backend servers: 

### VM1 

* Named **myLBrdp1**
* Protocol **TCP**.
* Frontend port **Port 4221**.
* Backend port **Port 3389**.

```azurepowershell-interactive
$nat = 'myLBrdp1'
$pro = 'tcp'
$fe = '4221'
$be = '3389'

## $feip is the public IP variable from the previous step. ##

$natrule1 = 
New-AzLoadBalancerInboundNatRuleConfig -Name $nat -FrontendIpConfiguration $feip -Protocol $pro -FrontendPort $fe -BackendPort $be
```

### VM2 

* Named **myLBrdp2**
* Protocol **TCP**.
* Frontend port **Port 4222**.
* Backend port **Port 3389**.

```azurecli-interactive
$nat = 'myLBrdp2'
$pro = 'tcp'
$fe = '4222'
$be = '3389'

$natrule2 = 
New-AzLoadBalancerInboundNatRuleConfig -Name $nat -FrontendIpConfiguration $feip -Protocol $pro -FrontendPort $fe -BackendPort $be
```

### VM3 

* Named **myLBrdp3**
* Protocol **TCP**.
* Frontend port **Port 4223**.
* Backend port **Port 3389**.

```azurecli-interactive
$nat = 'myLBrdp3'
$pro = 'tcp'
$fe = '4223'
$be = '3389'

$natrule3 = 
New-AzLoadBalancerInboundNatRuleConfig -Name $nat -FrontendIpConfiguration $feip -Protocol $pro -FrontendPort $fe -BackendPort $be
```

### Create load balancer resource

Create a public load Balancer with [New-AzLoadBalancer](/powershell/module/az.network/new-azloadbalancer):

* Named **myLoadBalancer**
* In **eastus**.
* In resource group **myResourceGroupLB**.

The following example creates a public Standard Load Balancer named myLoadBalancer using the front-end IP configuration, back-end pool, health probe, load-balancing rule, and NAT rules that you created in the preceding steps:

```azurepowershell-interactive
$lbn = 'myLoadBalancer'
$rg = 'MyResourceGroupLB'
$loc = 'eastus'
$sku = 'Standard'

## $feip, $bepool, $probe, $rule, $natrule1, $natrule2, and $natrule3 are variables with configuration information from previous steps. ##

$lb = 
New-AzLoadBalancer -ResourceGroupName $rg -Name $lbn -SKU $sku -Location $loc -FrontendIpConfiguration $feip -BackendAddressPool $bepool -Probe $probe -LoadBalancingRule $rule -InboundNatRule $natrule1,$natrule2,$natrule3
```

## Configure virtual network

Before you deploy VMs and test your load balancer, create the supporting virtual network resources.

### Create a virtual network

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork):

* Named **myVNet**.
* In resource group **myResourceGroupLB**.
* Subnet named **myBackendSubnet**.
* Virtual network **10.0.0.0/16**.
* Subnet **10.0.0.0/24**.

```azurepowershell
# Create subnet config
$subnetConfig = New-AzVirtualNetworkSubnetConfig `
  -Name "mySubnet" `
  -AddressPrefix 10.0.2.0/24

# Create the virtual network
$vnet = New-AzVirtualNetwork `
  -ResourceGroupName "myResourceGroupSLB" `
  -Location $location `
  -Name "myVnet" `
  -AddressPrefix 10.0.0.0/16 `
  -Subnet $subnetConfig
```
### Create public IP addresses for the VMs

To access your VMs using a RDP connection, you need public IP address for the VMs. Since a Standard Load Balancer is used in this scenario, you must create Standard public IP addresses for the VMs with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress).

```azurepowershell
$RdpPublicIP_1 = New-AzPublicIpAddress `
  -Name "RdpPublicIP_1" `
  -ResourceGroupName $RgName `
  -Location $location  `
  -SKU Standard `
  -AllocationMethod static
 

$RdpPublicIP_2 = New-AzPublicIpAddress `
  -Name "RdpPublicIP_2" `
  -ResourceGroupName $RgName `
  -Location $location  `
  -SKU Standard `
  -AllocationMethod static


$RdpPublicIP_3 = New-AzPublicIpAddress `
  -Name "RdpPublicIP_3" `
  -ResourceGroupName $RgName `
  -Location $location  `
  -SKU Standard `
  -AllocationMethod static

```

Use ```-SKU Basic``` to create a Basic Public IPs. Microsoft recommends using Standard for production workloads.

### Create network security group
Create network security group to define inbound connections to your virtual network.

#### Create a network security group rule for port 3389
Create a network security group rule to allow RDP connections through port 3389 with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig).

```azurepowershell

$rule1 = New-AzNetworkSecurityRuleConfig -Name 'myNetworkSecurityGroupRuleRDP' -Description 'Allow RDP' `
  -Access Allow -Protocol Tcp -Direction Inbound -Priority 1000 `
  -SourceAddressPrefix Internet -SourcePortRange * `
  -DestinationAddressPrefix * -DestinationPortRange 3389
```

#### Create a network security group rule for port 80
Create a network security group rule to allow inbound connections through port 80 with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig).

```azurepowershell
$rule2 = New-AzNetworkSecurityRuleConfig -Name 'myNetworkSecurityGroupRuleHTTP' -Description 'Allow HTTP' `
  -Access Allow -Protocol Tcp -Direction Inbound -Priority 2000 `
  -SourceAddressPrefix Internet -SourcePortRange * `
  -DestinationAddressPrefix * -DestinationPortRange 80
```

#### Create a network security group

Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup).

```azurepowershell
$nsg = New-AzNetworkSecurityGroup -ResourceGroupName $RgName -Location $location `
-Name 'myNetworkSecurityGroup' -SecurityRules $rule1,$rule2
```

### Create NICs
Create virtual NICs and associate with public IP address and network security groups created in the earlier steps with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface). The following example creates three virtual NICs. (One virtual NIC for each VM you create for your app in the following steps). You can create additional virtual NICs and VMs at any time and add them to the load balancer:

```azurepowershell
# Create NIC for VM1
$nicVM1 = New-AzNetworkInterface -ResourceGroupName $rgName -Location $location `
  -Name 'MyNic1' -PublicIpAddress $RdpPublicIP_1 -LoadBalancerBackendAddressPool $bepool -NetworkSecurityGroup $nsg `
  -LoadBalancerInboundNatRule $natrule1 -Subnet $vnet.Subnets[0]

$nicVM2 = New-AzNetworkInterface -ResourceGroupName $rgName -Location $location `
  -Name 'MyNic2' -PublicIpAddress $RdpPublicIP_2 -LoadBalancerBackendAddressPool $bepool -NetworkSecurityGroup $nsg `
  -LoadBalancerInboundNatRule $natrule2 -Subnet $vnet.Subnets[0]

$nicVM3 = New-AzNetworkInterface -ResourceGroupName $rgName -Location $location `
  -Name 'MyNic3' -PublicIpAddress $RdpPublicIP_3 -LoadBalancerBackendAddressPool $bepool -NetworkSecurityGroup $nsg `
  -LoadBalancerInboundNatRule $natrule3 -Subnet $vnet.Subnets[0]
```

### Create virtual machines

Set an administrator username and password for the VMs with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```azurepowershell
$cred = Get-Credential
```

Now you can create the VMs with [New-AzVM](/powershell/module/az.compute/new-azvm). The following example creates two VMs and the required virtual network components if they do not already exist. In this example, the NICs (*MyNic1*, *MyNic2*, and *MyNic3*) created in the preceding step are assigned to virtual machines *myVM1*, *myVM2*, and *VM3*. In addition, since the NICs are associated to the load balancer's backend pool, the VMs are automatically added to the backend pool.

```azurepowershell

# ############## VM1 ###############

# Create a virtual machine configuration
$vmConfig = New-AzVMConfig -VMName 'myVM1' -VMSize Standard_DS1_v2 `
 | Set-AzVMOperatingSystem -Windows -ComputerName 'myVM1' -Credential $cred `
 | Set-AzVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2019-Datacenter -Version latest `
 | Add-AzVMNetworkInterface -Id $nicVM1.Id

# Create a virtual machine
$vm1 = New-AzVM -ResourceGroupName $rgName -Zone 1 -Location $location -VM $vmConfig

# ############## VM2 ###############

# Create a virtual machine configuration
$vmConfig = New-AzVMConfig -VMName 'myVM2' -VMSize Standard_DS1_v2 `
 | Set-AzVMOperatingSystem -Windows -ComputerName 'myVM2' -Credential $cred `
 | Set-AzVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2019-Datacenter -Version latest `
 | Add-AzVMNetworkInterface -Id $nicVM2.Id

# Create a virtual machine
$vm2 = New-AzVM -ResourceGroupName $rgName -Zone 2 -Location $location -VM $vmConfig

# ############## VM3 ###############

# Create a virtual machine configuration
$vmConfig = New-AzVMConfig -VMName 'myVM3' -VMSize Standard_DS1_v2 `
 | Set-AzVMOperatingSystem -Windows -ComputerName 'myVM3' -Credential $cred `
 | Set-AzVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2019-Datacenter -Version latest `
| Add-AzVMNetworkInterface -Id $nicVM3.Id

# Create a virtual machine
$vm3 = New-AzVM -ResourceGroupName $rgName -Zone 3 -Location $location -VM $vmConfig
```

It takes a few minutes to create and configure the three VMs.

### Install IIS with a custom web page

Install IIS with a custom web page on both back-end VMs as follows:

1. Get the public IP addresses of the three VMs using `Get-AzPublicIPAddress`.

   ```azurepowershell
     $vm1_rdp_ip = (Get-AzPublicIPAddress -ResourceGroupName $rgName -Name "RdpPublicIP_1").IpAddress
     $vm2_rdp_ip = (Get-AzPublicIPAddress -ResourceGroupName $rgName -Name "RdpPublicIP_2").IpAddress
     $vm3_rdp_ip = (Get-AzPublicIPAddress -ResourceGroupName $rgName -Name "RdpPublicIP_3").IpAddress
    ```
2. Create remote desktop connections with *myVM1*, *myVM2*, and *myVM3* using the public IP addresses of the VMs as follows: 

   ```azurepowershell    
     mstsc /v:$vm1_rdp_ip
     mstsc /v:$vm2_rdp_ip
     mstsc /v:$vm3_rdp_ip
   
    ```

3. Enter the credentials for each VM to start the RDP session.
4. Launch Windows PowerShell on each VM and using the following commands to install IIS server and update the default htm file.

    ```azurepowershell
    # Install IIS
     Install-WindowsFeature -name Web-Server -IncludeManagementTools
    
    # Remove default htm file
     remove-item  C:\inetpub\wwwroot\iisstart.htm
    
    #Add custom htm file
     Add-Content -Path "C:\inetpub\wwwroot\iisstart.htm" -Value $("Hello World from host " + $env:computername)
    ```

5. Close the RDP connections with *myVM1*, *myVM2*, and *myVM3*.


## Test load balancer
Obtain the public IP address of your load balancer with [Get-AzPublicIPAddress](/powershell/module/az.network/get-azpublicipaddress). The following example obtains the IP address for *myPublicIP* created earlier:

```azurepowershell
Get-AzPublicIPAddress `
  -ResourceGroupName "myResourceGroupSLB" `
  -Name "myPublicIP" | select IpAddress
```

You can then enter the public IP address in to a web browser. The website is displayed, including the hostname of the VM that the load balancer distributed traffic to as in the following example:

![Test load balancer](media/quickstart-create-basic-load-balancer-powershell/load-balancer-test.png)

To see the load balancer distribute traffic across all three VMs running your app, you can force-refresh your web browser. 

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, VM, and all related resources.

```azurepowershell
Remove-AzResourceGroup -Name myResourceGroupSLB
```

## Next steps

In this quickstart, you created a Standard Load Balancer, attached VMs to it, configured the Load Balancer traffic rule, health probe, and then tested the Load Balancer. To learn more about Azure Load Balancer, continue to [Azure Load Balancer tutorials](tutorial-load-balancer-standard-public-zone-redundant-portal.md).

Learn more about [Load Balancer and Availability zones](load-balancer-standard-availability-zones.md).
