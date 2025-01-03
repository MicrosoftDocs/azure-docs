---
title: include file
description: include file
services: load-balancer
ms.service: sap-on-azure
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 01/17/2024
author: dennispadia
ms.author: depadia
---

To create Azure standard load balancer for high availability setup of SAP system using Azure CLI, follow below steps.

```azurecli-interactive
# Create the load balancer resource and another frontend IP resource for ERS. Allocation of private IP address is dynamic using below command. If you want to pass static IP address, include parameter --private-ip-address.
az network lb create -g MyResourceGroup -n MyLB --sku Standard --vnet-name MyVMsVirtualNetwork --subnet MyVMsSubnet --backend-pool-name MyBackendPool --frontend-ip-name MyASCSFrontendIpName
az network lb frontend-ip create -g MyResourceGroup --lb-name MyLB -n MyERSFrontendIpName --vnet-name MyVMsVirtualNetwork --subnet MyVMsSubnet

# Create the health probe for ASCS and ERS
az network lb probe create -g MyResourceGroup --lb-name MyLB -n MyASCSHealthProbe --protocol tcp --port MyASCSHealthProbePort --interval 5 --probe-threshold 2
az network lb probe create -g MyResourceGroup --lb-name MyLB -n MyERSHealthProbe --protocol tcp --port MyERSHealthProbePort --interval 5 --probe-threshold 2
 
# Create load balancing rule for ASCS and ERS
az network lb rule create -g MyResourceGroup --lb-name MyLB -n MyASCSRuleName --protocol All --frontend-ip-name MyASCSFrontendIpName --frontend-port 0 --backend-pool-name MyBackendPool --backend-port 0 --probe-name MyASCSHealthProbe --idle-timeout-in-minutes 30 --enable-floating-ip 
az network lb rule create -g MyResourceGroup --lb-name MyLB -n MyERSRuleName --protocol All --frontend-ip-name MyERSFrontendIpName --frontend-port 0 --backend-pool-name MyBackendPool --backend-port 0 --probe-name MyERSHealthProbe --idle-timeout-in-minutes 30 --enable-floating-ip  

# Add ASCS and ERS VMs in backend pool
az network nic ip-config address-pool add --address-pool MyBackendPool --ip-config-name ASCSVmIpConfigName --nic-name ASCSVmNicName -g MyResourceGroup --lb-name MyLB
az network nic ip-config address-pool add --address-pool MyBackendPool --ip-config-name ERSVmIpConfigName --nic-name ERSVmNicName -g MyResourceGroup --lb-name MyLB
```

</br>
<details>
<summary>Expand to view full CLI code</summary>

```azurecli-interactive
# Define variables for Resource Group, ASCS/ERS VMs.

rg_name="resourcegroup-name"
vm1_name="ascs-vm-name"
vm2_name="ers-vm-name"

# Define variables for the load balancer that will be use in the creation of the load balancer resource.

lb_name="sap-ci-sid-ilb"
bkp_name="ascs-ers-backendpool"
ascs_fip_name="ascs-frontendip"
ers_fip_name="ers-frontendip"

ascs_hp_name="ascs-healthprobe"
ascs_hp_port="62000"
ers_hp_name="ers-healthprobe"
ers_hp_port="62101"

ascs_rule_name="ascs-lb-rule"
ers_rule_name="ers-lb-rule"
 
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
 
# Create the load balancer resource and another frontend IP resource for ERS.
# Allocation of private IP address is dynamic using below command. If you want to pass static IP address, include parameter --private-ip-address. 
  
az network lb create -g $rg_name -n $lb_name --sku Standard --vnet-name $vnet_name --subnet $subnet_name --backend-pool-name $bkp_name --frontend-ip-name $ascs_fip_name
az network lb frontend-ip create -g $rg_name --lb-name $lb_name -n $ers_fip_name --vnet-name $vnet_name --subnet $subnet_name
 
# Create the health probe for ASCS and ERS
 
az network lb probe create -g $rg_name --lb-name $lb_name -n $ascs_hp_name --protocol tcp --port $ascs_hp_port --interval 5 --probe-threshold 2
az network lb probe create -g $rg_name --lb-name $lb_name -n $ers_hp_name --protocol tcp --port $ers_hp_port --interval 5 --probe-threshold 2
 
# Create load balancing rule for ASCS and ERS
  
az network lb rule create -g $rg_name --lb-name $lb_name -n  $ascs_rule_name --protocol All --frontend-ip-name $ascs_fip_name --frontend-port 0 --backend-pool-name $bkp_name --backend-port 0 --probe-name $ascs_hp_name --idle-timeout-in-minutes 30 --enable-floating-ip 
az network lb rule create -g $rg_name --lb-name $lb_name -n  $ers_rule_name --protocol All --frontend-ip-name $ers_fip_name --frontend-port 0 --backend-pool-name $bkp_name --backend-port 0 --probe-name $ers_hp_name --idle-timeout-in-minutes 30 --enable-floating-ip 
 
# Add ASCS and ERS VMs in backend pool
 
az network nic ip-config address-pool add --address-pool $bkp_name --ip-config-name $vm1_ipconfig --nic-name $vm1_nic_name -g $rg_name --lb-name $lb_name
az network nic ip-config address-pool add --address-pool $bkp_name --ip-config-name $vm2_ipconfig --nic-name $vm2_nic_name -g $rg_name --lb-name $lb_name

# [OPTIONAL] Change the assignment of frontend IP address from dynamic to static
afip=$(az network lb frontend-ip show --lb-name $lb_name -g $rg_name -n $ascs_fip_name --query "{privateIPAddress:privateIPAddress}" -o tsv)
az network lb frontend-ip update --lb-name $lb_name -g $rg_name -n $ascs_fip_name --private-ip-address $afip

efip=$(az network lb frontend-ip show --lb-name $lb_name -g $rg_name -n $ers_fip_name --query "{privateIPAddress:privateIPAddress}" -o tsv)
az network lb frontend-ip update --lb-name $lb_name -g $rg_name -n $ers_fip_name --private-ip-address $efip
```

</details>
