---
title: include file
description: include file
services: load-balancer
ms.service: sap-on-azure
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 01/17/2024
author: dennispadia
ms.author: depadia
---

To create Azure standard load balancer for high availability setup of SAP system using Azure PowerShell, follow below steps.

```azurepowershell-interactive
# Create frontend IP configurations
$ascs_fip = New-AzLoadBalancerFrontendIpConfig -Name MyASCSFrontendIpName -SubnetId MyASCSSubnetName
$ers_fip = New-AzLoadBalancerFrontendIpConfig -Name MyERSFrontendIpName -SubnetId MyERSSubnetName

# Create backend pool
$bePool = New-AzLoadBalancerBackendAddressPoolConfig -Name MyBackendPool

# Create health probes for ASCS and ERS
$ascs_healthprobe = New-AzLoadBalancerProbeConfig -Name MyASCSHealthProbe -Protocol 'tcp' -Port MyASCSHealthProbePort -IntervalInSeconds 5 -ProbeThreshold 2 -ProbeCount 1
$ers_healthprobe = New-AzLoadBalancerProbeConfig -Name $ers_hp_name -Protocol 'tcp' -Port MyASCSHealthProbePort -IntervalInSeconds 5 -ProbeThreshold 2 -ProbeCount 1

# Create load balancing rules for ASCS and ERS
$ascs_rule = New-AzLoadBalancerRuleConfig -Name MyASCSRuleName -Probe $ascs_healthprobe -Protocol 'All' -IdleTimeoutInMinutes 30 -FrontendIpConfiguration $ascs_fip -BackendAddressPool $bePool -EnableFloatingIP
$ers_rule = New-AzLoadBalancerRuleConfig -Name MyERSRuleName -Probe $ers_healthprobe -Protocol 'All' -IdleTimeoutInMinutes 30 -FrontendIpConfiguration $ers_fip -BackendAddressPool $bePool -EnableFloatingIP

# Create the load balancer resource
$lb = New-AzLoadBalancer -ResourceGroupName MyResourceGroup -Name MyLB -Location MyRegion -Sku 'Standard' -FrontendIpConfiguration $ascs_fip, $ers_fip -BackendAddressPool $bePool -LoadBalancingRule $ascs_rule, $ers_rule -Probe $ascs_healthprobe, $ers_healthprobe
```

</br>
<details>
<summary>Expand to view full PowerShell code</summary>

```azurepowershell-interactive
# Define variables for Resource Group, and Database VMs.

$rg_name = 'resourcegroup-name'
$vm1_name = 'ascs-vm-name'
$vm2_name = 'ers-vm-name'

# Define variables for the load balancer that will be utilized in the creation of the load balancer resource.

$lb_name = 'sap-ci-sid-ilb'
$bkp_name = 'ascs-ers-backendpool'
$ascs_fip_name = 'ascs-frontendip'
$ers_fip_name = 'ers-frontendip'
 
$ascs_hp_name = 'ascs-healthprobe'
$ascs_hp_port = '62000'
$ers_hp_name = 'ers-healthprobe'
$ers_hp_port = '62101'
 
$ascs_rule_name = 'ascs-lb-rule'
$ers_rule_name = 'ers-lb-rule'
 
# Command to get VMs network information like NIC name, IP configuration name, Virtual Network name, and Subnet 
 
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
 
# Create frontend IP resource for ASCS and ERS.
# Allocation of private IP address is dynamic using below command. If you want to pass static IP address, include parameter -PrivateIpAddress
 
$ascs_lb_fip = @{
    Name = $ascs_fip_name
    SubnetId = $vm1_primaryip.Subnet.Id
}
$ascs_fip = New-AzLoadBalancerFrontendIpConfig @ascs_lb_fip
 
$ers_lb_fip = @{
    Name = $ers_fip_name
    SubnetId = $vm2_primaryip.Subnet.Id
}
$ers_fip = New-AzLoadBalancerFrontendIpConfig @ers_lb_fip

# Create backend pool
 
$bepool = New-AzLoadBalancerBackendAddressPoolConfig -Name $bkp_name

# Create the health probe for ASCS and ERS
 
$ascs_probe = @{
    Name = $ascs_hp_name
    Protocol = 'tcp'
    Port = $ascs_hp_port
    IntervalInSeconds = '5'
    ProbeThreshold = '2'
    ProbeCount = '1'
}
$ascs_healthprobe = New-AzLoadBalancerProbeConfig @ascs_probe
    
$ers_probe = @{
    Name = $ers_hp_name
    Protocol = 'tcp'
    Port = $ers_hp_port
    IntervalInSeconds = '5'
    ProbeThreshold = '2'
    ProbeCount = '1'
}
$ers_healthprobe = New-AzLoadBalancerProbeConfig @ers_probe

# Create load balancing rule for ASCS and ERS
 
$ascs_lbrule = @{
    Name = $ascs_rule_name
    Probe = $ascs_healthprobe
    Protocol = 'All'
    IdleTimeoutInMinutes = '30'
    FrontendIpConfiguration = $ascs_fip
    BackendAddressPool = $bePool 
} 
$ascs_rule = New-AzLoadBalancerRuleConfig @ascs_lbrule -EnableFloatingIP 
 
$ers_lbrule = @{
    Name = $ers_rule_name
    Probe = $ers_healthprobe
    Protocol = 'All'
    IdleTimeoutInMinutes = '30'
    FrontendIpConfiguration = $ers_fip
    BackendAddressPool = $bePool 
} 
$ers_rule = New-AzLoadBalancerRuleConfig @ers_lbrule -EnableFloatingIP

# Create the load balancer resource
 
$loadbalancer = @{
    ResourceGroupName = $rg_name
    Name = $lb_name
    Location = $location
    Sku = 'Standard'
    FrontendIpConfiguration = $ascs_fip,$ers_fip
    BackendAddressPool = $bePool 
    LoadBalancingRule = $ascs_rule,$ers_rule
    Probe = $ascs_healthprobe,$ers_healthprobe 
} 
$lb = New-AzLoadBalancer @loadbalancer

# Add ASCS and ERS VMs in backend pool of load balanceer
 
$vm1_primaryip.LoadBalancerBackendAddressPools.Add($lb.BackendAddressPools[0])
$vm2_primaryip.LoadBalancerBackendAddressPools.Add($lb.BackendAddressPools[0])
$vm1_nic_info | Set-AzNetworkInterface
$vm2_nic_info | Set-AzNetworkInterface
```

</details>
