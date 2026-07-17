---
title: HA Cluster Configure Load Balancer
description: Include File for HA Cluster Configure Load Balancer
services: azure-load-balancer
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 06/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---

During virtual machine (VM) configuration, you can create or select an existing internal load balancer (ILB) in the networking section. Follow the steps outlined to configure a standard load balancer for the high-availability setup of an SAP system. You need a combination of a front end IP, health probe, and load balancing rule for each service you're hosting in your cluster.

Use the following reference when configuring your ILB:
- Frontend IP Configuration: Create one IP for each service you're hosting in your cluster. It must be on the same virtual network & subnet as your VMs.
- Backend Pool: Create one backend pool for your cluster and add your VMs to it.
- Health Probes: Create one health probe for each service in your cluster, use the following options:
   - Protocol: TCP
   - Port: 625## (where ## is the service's instance number)
   - Interval: 5
   - Probe Threshold: 2
- Load Balancing Rules: Create one per service in your cluster.
   - Protocol: TCP
   - Frontend IP: Select the corresponding IP for your service
   - Backend Pool: Select your backend pool
   - High Availability Ports: Use this option
   - Health Probe: Select the corresponding health probe for your service
   - Session Persistence: None
   - Idle Timeout (minutes): 30
   - Enable TCP Reset: No
   - Enable Floating IP: Yes

#### [Azure portal](#tab/lb-portal)

Follow the [Create load balancer][azdoc-ilb-create-portal] guide to set up a standard load balancer for a high availability SAP system using the Azure portal.

> [!NOTE]
> The health probe configuration property `ProbeThreshold` can't be specified in the Portal. So to control the number of successful or failed consecutive probes, set the property "probeThreshold" to 2 by using either the [Azure CLI][azcli-lb-probe-update] or [PowerShell][azps-setlb-probe-update] commands.

#### [Azure CLI](#tab/lb-azurecli)

Use the following commands to create and configure your internal load balancer. Additional command reference can be found at [Create load balancer][azdoc-ilb-create-azcli]

```azurecli-interactive
# Create the load balancer resource (it creates 1 Frontend IP by default).  Allocation of private IP address is dynamic using below command. If you want to pass static IP address, include parameter --private-ip-address.
az network lb create -g <ResourceGroupName> -n <LBName> --sku Standard --vnet-name <VMsVirtualNetworkName> --subnet <VMsSubnetName> --backend-pool-name <BackendPoolName> --frontend-ip-name <Service1FrontendIpName>

# Add Cluster VMs into the Backend Pool
az network nic ip-config address-pool add --address-pool <BackendPoolName> --ip-config-name <ClusterVM1-IpConfigName> --nic-name <ClusterVM1-NicName> -g <ResourceGroupName> --lb-name <LBName>
az network nic ip-config address-pool add --address-pool <BackendPoolName> --ip-config-name <ClusterVM2-IpConfigName> --nic-name <ClusterVM2-NicName> -g <ResourceGroupName> --lb-name <LBName>

# Create the health probe for Service 1 (ASCS or Hana)
az network lb probe create -g <ResourceGroupName> --lb-name <LBName> -n <Service1HealthProbeName> --protocol tcp --port 625<##> --interval 5 --probe-threshold 2

# Create load balancing rule for Service 1 (ASCS or Hana)
az network lb rule create -g <ResourceGroupName> --lb-name <LBName> -n <Service1LoadBalancerRuleName> --frontend-ip-name <Service1FrontendIpName> --backend-pool-name <BackendPoolName> --probe-name <Service1HealthProbeName> --protocol All --frontend-port 0 --backend-port 0 --idle-timeout-in-minutes 30 --enable-floating-ip

# Service N (ERS, PAS, etc)
# Create Seperate IP
az network lb frontend-ip create -g <ResourceGroupName> --lb-name <LBName> -n <ServiceNFrontendIpName> --vnet-name <VMsVirtualNetworkName> --subnet <VMsSubnetName>

# Create the health probe
az network lb probe create -g <ResourceGroupName> --lb-name <LBName> -n <ServiceNHealthProbeName> --protocol tcp --port 625<##> --interval 5 --probe-threshold 2

# Create load balancing rule
az network lb rule create -g <ResourceGroupName> --lb-name <LBName> -n <ServiceNLoadBalancerRuleName> --protocol All --frontend-ip-name <ServiceNFrontendIpName> --frontend-port 0 --backend-pool-name <BackendPoolName> --backend-port 0 --probe-name <ServiceNHealthProbeName> --idle-timeout-in-minutes 30 --enable-floating-ip
```

</br>
<details>
<summary>Expand to view full CLI code</summary>

```azurecli-interactive
# Define variables for Resource Group, Cluster VMs.

rg_name="<ResourceGroupName>"
vm1_name="<ClusterVM1Name>"
vm2_name="<ClusterVM2Name>"

# Define variables for the load balancer that will be use in the creation of the load balancer resource.

lb_name="<LBName>"
bkp_name="<BackendPoolName>"

# Service 1 (ASCS or Hana)
service_1_fip_name="<Service1FrontendIpName>"
service_1_hp_name="<Service1HealthProbeName>"
service_1_hp_port="625<##>"
service_1_rule_name="<Service1LoadBalancerRuleName>"

# Service N (ERS, PAS, etc)
service_n_fip_name="<ServiceNFrontendIpName>"
service_n_hp_name="<ServiceNHealthProbeName>"
service_n_hp_port="625<##>"
service_n_rule_name="<ServiceNLoadBalancerRuleName>"
 
# Command to get VMs network information automatically from the names
 
vm1_primary_nic=$(az vm nic list -g $rg_name --vm-name $vm1_name --query "[?primary == \`true\`].{id:id} || [?primary == \`null\`].{id:id}" -o tsv)
vm1_nic_name=$(basename $vm1_primary_nic)
vm1_ipconfig=$(az network nic ip-config list -g $rg_name --nic-name $vm1_nic_name --query "[?primary == \`true\`].name" -o tsv)
 
vm2_primary_nic=$(az vm nic list -g $rg_name --vm-name $vm2_name --query "[?primary == \`true\`].{id:id} || [?primary == \`null\`].{id:id}" -o tsv)
vm2_nic_name=$(basename $vm2_primary_nic)
vm2_ipconfig=$(az network nic ip-config list -g $rg_name --nic-name $vm2_nic_name --query "[?primary == \`true\`].name" -o tsv)
 
vnet_subnet_id=$(az network nic show -g $rg_name -n $vm1_nic_name --query ipConfigurations[0].subnet.id -o tsv)
vnet_name=$(basename $(dirname $(dirname $vnet_subnet_id)))
subnet_name=$(basename $vnet_subnet_id)

# Create the load balancer resource (it creates 1 Frontend IP by default).  Allocation of private IP address is dynamic using below command. If you want to pass static IP address, include parameter --private-ip-address.
az network lb create -g $rg_name -n $lb_name --sku Standard --vnet-name $vnet_name --subnet $subnet_name --backend-pool-name $bkp_name --frontend-ip-name $service_1_fip_name

# Add Cluster VMs into the Backend Pool
az network nic ip-config address-pool add --address-pool $bkp_name --ip-config-name $vm1_ipconfig --nic-name $vm1_nic_name -g $rg_name --lb-name $lb_name
az network nic ip-config address-pool add --address-pool $bkp_name --ip-config-name $vm2_ipconfig --nic-name $vm2_nic_name -g $rg_name --lb-name $lb_name

# -- Service 1 (ASCS or Hana) --
# Create the health probe for Service 1
az network lb probe create -g $rg_name --lb-name $lb_name -n $service_1_hp_name --protocol tcp --port $service_1_hp_port --interval 5 --probe-threshold 2 -ProbeCount 1

# Create load balancing rule for Service 1
az network lb rule create -g $rg_name --lb-name $lb_name -n $service_1_rule_name --frontend-ip-name $service_1_fip_name --backend-pool-name $bkp_name --probe-name $service_1_hp_name --protocol All --frontend-port 0 --backend-port 0 --idle-timeout-in-minutes 30 --enable-floating-ip

# -- Service N (ERS, PAS, etc) --
# Create a Seperate IP
az network lb frontend-ip create -g $rg_name --lb-name $lb_name -n $service_n_fip_name --vnet-name $vnet_name --subnet $subnet_name

# Create the health probe
az network lb probe create -g $rg_name --lb-name $lb_name -n $service_n_hp_name --protocol tcp --port $service_n_hp_port --interval 5 --probe-threshold 2 -ProbeCount 1

# Create load balancing rule
az network lb rule create -g $rg_name --lb-name $lb_name -n $service_n_rule_name --protocol All --frontend-ip-name $service_n_fip_name --frontend-port 0 --backend-pool-name $bkp_name --backend-port 0 --probe-name $service_n_hp_name --idle-timeout-in-minutes 30 --enable-floating-ip
```

</details>

#### [PowerShell](#tab/lb-powershell)
Use the following commands to create and configure your internal load balancer. Additional command reference can be found at [Create load balancer][azdoc-ilb-create-powershell].

```azurepowershell-interactive
# Get the subnet reference for the load balancer frontend IPs
$vnet = Get-AzVirtualNetwork -Name <VMsVirtualNetworkName> -ResourceGroupName <ResourceGroupName>
$subnet = Get-AzVirtualNetworkSubnetConfig -Name <VMsSubnetName> -VirtualNetwork $vnet

# Create backend pool configuration
$bePool = New-AzLoadBalancerBackendAddressPoolConfig -Name <BackendPoolName>

# Create frontend IP configurations for Service 1. Allocation of private IP address is dynamic using below command. If you want to pass a static IP address, include parameter -PrivateIpAddress.
$service1Fip = New-AzLoadBalancerFrontendIpConfig -Name <Service1FrontendIpName> -SubnetId $subnet.Id

# Create the health probe for Service 1 (ASCS or Hana)
$service1Probe = New-AzLoadBalancerProbeConfig -Name <Service1HealthProbeName> -Protocol Tcp -Port 625<##> -IntervalInSeconds 5 -ProbeThreshold 2 -ProbeCount 1

# Create load balancing rule for Service 1 (ASCS or Hana)
$service1Rule = New-AzLoadBalancerRuleConfig -Name <Service1LoadBalancerRuleName> -FrontendIpConfiguration $service1Fip -BackendAddressPool $bePool -Probe $service1Probe -Protocol All -FrontendPort 0 -BackendPort 0 -IdleTimeoutInMinutes 30 -EnableFloatingIP

# Create the load balancer resource with Service 1 configuration
$lb = New-AzLoadBalancer -ResourceGroupName <ResourceGroupName> -Name <LBName> -Location <Region> -Sku Standard -FrontendIpConfiguration $service1Fip -BackendAddressPool $bePool -LoadBalancingRule $service1Rule -Probe $service1Probe

# Add Cluster VMs into the Backend Pool
$vm1Nic = Get-AzNetworkInterface -Name <ClusterVM1-NicName> -ResourceGroupName <ResourceGroupName>
$vm1Nic.IpConfigurations[0].LoadBalancerBackendAddressPools = $lb.BackendAddressPools[0]
Set-AzNetworkInterface -NetworkInterface $vm1Nic

$vm2Nic = Get-AzNetworkInterface -Name <ClusterVM2-NicName> -ResourceGroupName <ResourceGroupName>
$vm2Nic.IpConfigurations[0].LoadBalancerBackendAddressPools = $lb.BackendAddressPools[0]
Set-AzNetworkInterface -NetworkInterface $vm2Nic

# Service N (ERS, PAS, etc)
# Create separate frontend IP
$lb | Add-AzLoadBalancerFrontendIpConfig -Name <ServiceNFrontendIpName> -SubnetId $subnet.Id | Set-AzLoadBalancer
$lb = Get-AzLoadBalancer -Name <LBName> -ResourceGroupName <ResourceGroupName>

# Create the health probe for Service N
$lb | Add-AzLoadBalancerProbeConfig -Name <ServiceNHealthProbeName> -Protocol Tcp -Port 625<##> -IntervalInSeconds 5 -ProbeThreshold 2 -ProbeCount 1 | Set-AzLoadBalancer
$lb = Get-AzLoadBalancer -Name <LBName> -ResourceGroupName <ResourceGroupName>

# Create load balancing rule for Service N
$serviceNFip = $lb.FrontendIpConfigurations | Where-Object { $_.Name -eq '<ServiceNFrontendIpName>' }
$serviceNProbe = $lb.Probes | Where-Object { $_.Name -eq '<ServiceNHealthProbeName>' }
$serviceNBePool = $lb.BackendAddressPools[0]
$lb | Add-AzLoadBalancerRuleConfig -Name <ServiceNLoadBalancerRuleName> -FrontendIpConfiguration $serviceNFip -BackendAddressPool $serviceNBePool -Probe $serviceNProbe -Protocol All -FrontendPort 0 -BackendPort 0 -IdleTimeoutInMinutes 30 -EnableFloatingIP | Set-AzLoadBalancer
```

</br>
<details>
<summary>Expand to view full PowerShell code</summary>

```azurepowershell-interactive
# Define variables for Resource Group, and Database VMs.

$rg_name = "<ResourceGroupName>"
$vm1_name = "<ClusterVM1Name>"
$vm2_name = "<ClusterVM2Name>"

# Define variables for the load balancer that will be utilized in the creation of the load balancer resource.
$lb_name = "<LBName>"
$bkp_name = "<BackendPoolName>"

# Service 1 (ASCS or Hana)
$service_1_fip_name = "<Service1FrontendIpName>"
$service_1_hp_name = "<Service1HealthProbeName>"
$service_1_hp_port = "625<##>"
$service_1_rule_name = "<Service1LoadBalancerRuleName>"

# Service N (ERS, PAS, etc)
$service_n_fip_name = "<ServiceNFrontendIpName>"
$service_n_hp_name = "<ServiceNHealthProbeName>"
$service_n_hp_port = "625<##>"
$service_n_rule_name = "<ServiceNLoadBalancerRuleName>"
 
# Command to get VMs network information automatically from the names 
 
$vm1 = Get-AzVM -ResourceGroupName $rg_name -Name $vm1_name
$vm1_primarynic = $vm1.NetworkProfile.NetworkInterfaces | Where-Object {($_.Primary -eq "True") -or ($_.Primary -eq $null)}
$vm1_nic_name = $vm1_primarynic.Id.Split('/')[-1]
 
$vm1_nic_info = Get-AzNetworkInterface -Name $vm1_nic_name -ResourceGroupName $rg_name
$vm1_primaryip = $vm1_nic_info.IpConfigurations | Where-Object -Property Primary -EQ -Value "True"
 
$vm2 = Get-AzVM -ResourceGroupName $rg_name -Name $vm2_name
$vm2_primarynic = $vm2.NetworkProfile.NetworkInterfaces | Where-Object {($_.Primary -eq "True") -or ($_.Primary -eq $null)}
$vm2_nic_name = $vm2_primarynic.Id.Split('/')[-1]
 
$vm2_nic_info = Get-AzNetworkInterface -Name $vm2_nic_name -ResourceGroupName $rg_name
$vm2_primaryip = $vm2_nic_info.IpConfigurations | Where-Object -Property Primary -EQ -Value "True"
 
$location = $vm1.Location
 
# Create backend pool configuration
$bePool = New-AzLoadBalancerBackendAddressPoolConfig -Name $bkp_name

# Create frontend IP configurations for Service 1. Allocation of private IP address is dynamic using below command. If you want to pass a static IP address, include parameter -PrivateIpAddress.
$service1Fip = New-AzLoadBalancerFrontendIpConfig -Name $service_1_fip_name -SubnetId $vm1_primaryip.Subnet.Id

# Create the health probe for Service 1 (ASCS or Hana)
$service1Probe = New-AzLoadBalancerProbeConfig -Name $service_1_hp_name -Protocol Tcp -Port $service_1_hp_port -IntervalInSeconds 5 -ProbeThreshold 2 -ProbeCount 1

# Create load balancing rule for Service 1 (ASCS or Hana)
$service1Rule = New-AzLoadBalancerRuleConfig -Name $service_1_rule_name -FrontendIpConfiguration $service1Fip -BackendAddressPool $bePool -Probe $service1Probe -Protocol All -FrontendPort 0 -BackendPort 0 -IdleTimeoutInMinutes 30 -EnableFloatingIP

# Create the load balancer resource with Service 1 configuration
$lb = New-AzLoadBalancer -ResourceGroupName $rg_name -Name $lb_name -Location $location -Sku Standard -FrontendIpConfiguration $service1Fip -BackendAddressPool $bePool -LoadBalancingRule $service1Rule -Probe $service1Probe

# Add Cluster VMs into the Backend Pool
$vm1_nic_info.IpConfigurations[0].LoadBalancerBackendAddressPools.Add($lb.BackendAddressPools[0])
Set-AzNetworkInterface -NetworkInterface $vm1_nic_info

$vm2_nic_info.IpConfigurations[0].LoadBalancerBackendAddressPools.Add($lb.BackendAddressPools[0])
Set-AzNetworkInterface -NetworkInterface $vm2_nic_info

# Service N (ERS, PAS, etc)
# Create separate frontend IP
$lb | Add-AzLoadBalancerFrontendIpConfig -Name $service_n_fip_name -SubnetId $vm1_primaryip.Subnet.Id | Set-AzLoadBalancer
$lb = Get-AzLoadBalancer -Name $lb_name -ResourceGroupName $rg_name

# Create the health probe for Service N
$lb | Add-AzLoadBalancerProbeConfig -Name $service_n_hp_name -Protocol Tcp -Port $service_n_hp_port -IntervalInSeconds 5 -ProbeThreshold 2 -ProbeCount 1| Set-AzLoadBalancer
$lb = Get-AzLoadBalancer -Name $lb_name -ResourceGroupName $rg_name

# Create load balancing rule for Service N
$serviceNFip = $lb.FrontendIpConfigurations | Where-Object { $_.Name -eq $service_n_fip_name }
$serviceNProbe = $lb.Probes | Where-Object { $_.Name -eq $service_n_hp_name }
$serviceNBePool = $lb.BackendAddressPools[0]
$lb | Add-AzLoadBalancerRuleConfig -Name $service_n_rule_name -FrontendIpConfiguration $serviceNFip -BackendAddressPool $serviceNBePool -Probe $serviceNProbe -Protocol All -FrontendPort 0 -BackendPort 0 -IdleTimeoutInMinutes 30 -EnableFloatingIP | Set-AzLoadBalancer 
```

</details>

---

> [!NOTE]
> When VMs without public IP addresses are added to the back-end pool of an internal Standard Azure Load Balancer, they lack outbound internet connectivity. Further configuration is needed to enable routing to public endpoints. For details on how to achieve outbound connectivity, see [Public endpoint connectivity for virtual machines using Azure Standard Load Balancer in SAP high-availability scenarios][azdoc-sap-ilb-outbound].

> [!IMPORTANT]
>
> Don't enable TCP time stamps on Azure VMs placed behind Azure Load Balancer. Enabling TCP timestamps causes the health probes to fail. Set the `net.ipv4.tcp_timestamps` parameter to `0`. For details, see [Load Balancer health probes][azdoc-ilb-health-probe].

[azdoc-ilb-create-portal]: ../../articles/load-balancer/quickstart-load-balancer-standard-internal-portal.md#create-load-balancer
[azdoc-ilb-create-azcli]: ../../articles/load-balancer/quickstart-load-balancer-standard-internal-cli.md#create-the-load-balancer
[azdoc-ilb-create-powershell]: ../../articles/load-balancer/quickstart-load-balancer-standard-internal-powershell.md#create-load-balancer
[azdoc-ilb-health-probe]: ../../articles/load-balancer/load-balancer-custom-probe-overview.md
[azcli-lb-probe-update]: /cli/azure/network/lb/probe#az-network-lb-probe-update
[azps-setlb-probe-update]: /powershell/module/az.network/set-azloadbalancerprobeconfig#-probethreshold

[azdoc-sap-ilb-outbound]: ../../articles/sap/workloads/high-availability-guide-standard-load-balancer-outbound-connections.md