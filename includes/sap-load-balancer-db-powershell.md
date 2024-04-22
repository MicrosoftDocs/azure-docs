---
title: include file
description: include file
services: load-balancer
ms.service: sap-on-azure
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 01/16/2024
author: dennispadia
ms.author: depadia
---

```azurecli-interactive
# Create frontend IP configurations
$db_fip = New-AzLoadBalancerFrontendIpConfig -Name MyDBFrontendIpName -SubnetId MyDBSubnetName

# Create backend pool
$bePool = New-AzLoadBalancerBackendAddressPoolConfig -Name MyBackendPool

# Create health probe
$db_healthprobe = New-AzLoadBalancerProbeConfig -Name MyDBHealthProbe -Protocol 'tcp' -Port MyDBHealthProbePort -IntervalInSeconds 5 -ProbeThreshold 2 -ProbeCount 1

# Create load balancing rule
$db_rule = New-AzLoadBalancerRuleConfig -Name MyDBRuleName -Probe $db_healthprobe -Protocol 'All' -IdleTimeoutInMinutes 30 -FrontendIpConfiguration $db_fip -BackendAddressPool $bePool -EnableFloatingIP

# Create the load balancer resource
$lb = New-AzLoadBalancer -ResourceGroupName MyResourceGroup -Name MyLB -Location MyRegion -Sku 'Standard' -FrontendIpConfiguration $db_fip -BackendAddressPool $bePool -LoadBalancingRule $db_rule -Probe $db_healthprobe
```

</br>
<details>
<summary>Expand to view full PowerShell code</summary>

```azurepowershell-interactive
# Define variables for Resource Group, and Database VMs.

$rg_name = 'resourcegroup-name'
$vm1_name = 'db1-name'
$vm2_name = 'db2-name'

# Define variables for the load balancer that will be utilized in the creation of the load balancer resource.

$lb_name = 'sap-db-sid-ilb'
$bkp_name = 'db-backendpool'
$db_fip_name = 'db-frontendip'
 
$db_hp_name = 'db-healthprobe'
$db_hp_port = '625<instance-no>'
 
$db_rule_name = 'db-lb-rule'
 
# Command to get VMs network information like primary NIC name, primary IP configuration name, virtual network name, and subnet name.
 
$vm1 = Get-AzVM -ResourceGroupName $rg_name -Name $vm1_name
$vm1_primarynic = $vm1.NetworkProfile.NetworkInterfaces | Where-Object {($_.Primary -eq "True") -or ($_.Primary -eq $null)}
$vm1_nic_name = $vm1_primarynic.Id.Split('/')[-1]
 
$vm1_nic_info = Get-AzNetworkInterface -Name $vm1_nic_name -ResourceGroupName $rg_name
$vm1_primaryip = $vm1_nic_info.IpConfigurations | Where-Object -Property Primary -EQ -Value "True"
$vm1_ipconfig_name = ($vm1_primaryip).Name
 
$vm2 = Get-AzVM -ResourceGroupName $rg_name -Name $vm2_name
$vm2_primarynic = $vm2.NetworkProfile.NetworkInterfaces | Where-Object {($_.Primary -eq "True") -or ($_.Primary -eq $null)}
$vm2_nic_name = $vm2_primarynic.Id.Split('/')[-1]
 
$vm2_nic_info = Get-AzNetworkInterface -Name $vm2_nic_name -ResourceGroupName $rg_name
$vm2_primaryip = $vm2_nic_info.IpConfigurations | Where-Object -Property Primary -EQ -Value "True"
$vm2_ipconfig_name = ($vm2_primaryip).Name
 
$vnet_name = $vm1_primaryip.Subnet.Id.Split('/')[-3]
$subnet_name = $vm1_primaryip.Subnet.Id.Split('/')[-1]
$location = $vm1.Location
 
# Create frontend IP resource.
# Allocation of private IP address is dynamic using below command. If you want to pass static IP address, include parameter -PrivateIpAddress
 
$db_lb_fip = @{
    Name = $db_fip_name
    SubnetId = $vm1_primaryip.Subnet.Id
}
$db_fip = New-AzLoadBalancerFrontendIpConfig @db_lb_fip

# Create backend pool
 
$bepool = New-AzLoadBalancerBackendAddressPoolConfig -Name $bkp_name

# Create the health probe
 
$db_probe = @{
    Name = $db_hp_name
    Protocol = 'tcp'
    Port = $db_hp_port
    IntervalInSeconds = '5'
    ProbeThreshold = '2'
    ProbeCount = '1'
}
$db_healthprobe = New-AzLoadBalancerProbeConfig @db_probe
    
# Create load balancing rule
 
$db_lbrule = @{
    Name = $db_rule_name
    Probe = $db_healthprobe
    Protocol = 'All'
    IdleTimeoutInMinutes = '30'
    FrontendIpConfiguration = $db_fip
    BackendAddressPool = $bePool 
} 
$db_rule = New-AzLoadBalancerRuleConfig @db_lbrule -EnableFloatingIP 
 
# Create the load balancer resource
 
$loadbalancer = @{
    ResourceGroupName = $rg_name
    Name = $lb_name
    Location = $location
    Sku = 'Standard'
    FrontendIpConfiguration = $db_fip
    BackendAddressPool = $bePool
    LoadBalancingRule = $db_rule
    Probe = $db_healthprobe
} 
$lb = New-AzLoadBalancer @loadbalancer

# Add DB VMs in backend pool
 
$vm1_primaryip.LoadBalancerBackendAddressPools.Add($lb.BackendAddressPools[0])
$vm2_primaryip.LoadBalancerBackendAddressPools.Add($lb.BackendAddressPools[0])
$vm1_nic_info | Set-AzNetworkInterface
$vm2_nic_info | Set-AzNetworkInterface
```

</details>
