---
title: include file
description: include file
services: load-balancer
ms.service: sap-on-azure
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 01/16/2024
author: dennispadia
ms.author: depadia
---

```azurecli-interactive
# Create the load balancer resource with frontend IP. Allocation of private IP address is dynamic using below command. If you want to pass static IP address, include parameter --private-ip-address.
az network lb create -g MyResourceGroup -n MyLB --sku Standard --vnet-name MyVMsVirtualNetwork --subnet MyVMsSubnet --backend-pool-name MyBackendPool --frontend-ip-name MyDBFrontendIpName

# Create the health probe
az network lb probe create -g MyResourceGroup --lb-name MyLB -n MyDBHealthProbe --protocol tcp --port MyDBHealthProbePort --interval 5 --probe-threshold 2
 
# Create load balancing rule
az network lb rule create -g MyResourceGroup --lb-name MyLB -n MyDBRuleName --protocol All --frontend-ip-name MyDBFrontendIpName --frontend-port 0 --backend-pool-name MyBackendPool --backend-port 0 --probe-name MyDBHealthProbe --idle-timeout-in-minutes 30 --enable-floating-ip 

# Add database VMs in backend pool
az network nic ip-config address-pool add --address-pool MyBackendPool --ip-config-name DBVm1IpConfigName --nic-name DBVm1NicName -g MyResourceGroup --lb-name MyLB
az network nic ip-config address-pool add --address-pool MyBackendPool --ip-config-name DBVm2IpConfigName --nic-name DBVm2NicName -g MyResourceGroup --lb-name MyLB
```

</br>
<details>
<summary>Expand to view full CLI code</summary>

```azurecli-interactive
# Define variables for Resource Group, and Database VMs.

rg_name="resourcegroup-name"
vm1_name="db1-name"
vm2_name="db2-name"

# Define variables for the load balancer that will be utilized in the creation of the load balancer resource.

lb_name="sap-db-sid-ilb"
bkp_name="db-backendpool"
db_fip_name="db-frontendip"

db_hp_name="db-healthprobe"
db_hp_port="625<instance-no>"

db_rule_name="db-lb-rule"
 
# Command to get VMs network information like primary NIC name, primary IP configuration name, virtual network name, and subnet name. 
 
vm1_primary_nic=$(az vm nic list -g $rg_name --vm-name $vm1_name --query "[?primary == \`true\`].{id:id} || [?primary == \`null\`].{id:id}" -o tsv)
vm1_nic_name=$(basename $vm1_primary_nic)
vm1_ipconfig=$(az network nic ip-config list -g $rg_name --nic-name $vm1_nic_name --query "[?primary == \`true\`].name" -o tsv)
 
vm2_primary_nic=$(az vm nic list -g $rg_name --vm-name $vm2_name --query "[?primary == \`true\`].{id:id} || [?primary == \`null\`].{id:id}" -o tsv)
vm2_nic_name=$(basename $vm2_primary_nic)
vm2_ipconfig=$(az network nic ip-config list -g $rg_name --nic-name $vm2_nic_name --query "[?primary == \`true\`].name" -o tsv)
 
vnet_subnet_id=$(az network nic show -g $rg_name -n $vm1_nic_name --query ipConfigurations[0].subnet.id -o tsv)
vnet_name=$(basename $(dirname $(dirname $vnet_subnet_id)))
subnet_name=$(basename $vnet_subnet_id)
 
# Create the load balancer resource with frontend IP.
# Allocation of private IP address is dynamic using below command. If you want to pass static IP address, include parameter --private-ip-address. 
  
az network lb create -g $rg_name -n $lb_name --sku Standard --vnet-name $vnet_name --subnet $subnet_name --backend-pool-name $bkp_name --frontend-ip-name $db_fip_name
 
# Create the health probe
 
az network lb probe create -g $rg_name --lb-name $lb_name -n $db_hp_name --protocol tcp --port $db_hp_port --interval 5 --probe-threshold 2
 
# Create load balancing rule
  
az network lb rule create -g $rg_name --lb-name $lb_name -n  $db_rule_name --protocol All --frontend-ip-name $db_fip_name --frontend-port 0 --backend-pool-name $bkp_name --backend-port 0 --probe-name $db_hp_name --idle-timeout-in-minutes 30 --enable-floating-ip 
 
# Add database VMs in backend pool
 
az network nic ip-config address-pool add --address-pool $bkp_name --ip-config-name $vm1_ipconfig --nic-name $vm1_nic_name -g $rg_name --lb-name $lb_name
az network nic ip-config address-pool add --address-pool $bkp_name --ip-config-name $vm2_ipconfig --nic-name $vm2_nic_name -g $rg_name --lb-name $lb_name

# [OPTIONAL] Change the assignment of frontend IP address from dynamic to static
dbfip=$(az network lb frontend-ip show --lb-name $lb_name -g $rg_name -n $db_fip_name --query "{privateIPAddress:privateIPAddress}" -o tsv)
az network lb frontend-ip update --lb-name $lb_name -g $rg_name -n $db_fip_name --private-ip-address $dbfip
```

</details>
