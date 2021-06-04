---
title: Maintenance control for OS image upgrades on Azure virtual machine scale sets using Azure CLI
description: Learn how to control when automatic OS image upgrades are rolled out to your Azure virtual machine scale sets using Maintenance control and Azure CLI.
author: ju-shim
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 06/01/2021
ms.author: jushiman 
ms.custom: devx-track-azurepowershell
#pmcontact: shants
---

# Preview: Maintenance control for OS image upgrades on Azure virtual machine scale sets using Azure CLI

Maintenance control lets you decide when to apply automatic guest OS image upgrades to your virtual machine scale sets. This topic covers the Azure CLI options for Maintenance control. For more information on using Maintenance control, see [Maintenance control for Azure virtual machine scale sets](virtual-machine-scale-sets-maintenance-control.md).

> [!IMPORTANT]
> Maintenance control for OS image upgrades on Azure virtual machine scale sets is currently in Public Preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Create a maintenance configuration

Use `az maintenance configuration create` to create a maintenance configuration. This example creates a maintenance configuration named *myConfig* scoped to the osimage. 

```azurecli-interactive
az group create \
   --location eastus \
   --name myMaintenanceRG
az maintenance configuration create \
   -g myMaintenanceRG \
   --resource-name myConfig \
   --maintenance-scope osimage\
   --location eastus
```

Copy the configuration ID from the output to use later.

Using `--maintenance-scope osimage` ensures that the maintenance configuration is used for controlling updates to the guest OS.

If you try to create a configuration with the same name, but in a different location, you will get an error. Configuration names must be unique to your resource group.

You can query for available maintenance configurations using `az maintenance configuration list`.

```azurecli-interactive
az maintenance configuration list --query "[].{Name:name, ID:id}" -o table 
```

### Create a maintenance configuration with scheduled window
You can also declare a scheduled window when Azure will apply the updates on your resources. This example creates a maintenance configuration named myConfig with a scheduled window of 5 hours on the fourth Monday of every month. Once you create a scheduled window you no longer have to apply the updates manually.

```azurecli-interactive
az maintenance configuration create \
   -g myMaintenanceRG \
   --resource-name myConfig \
   --maintenance-scope osimage \
   --location eastus \
   --maintenance-window-duration "05:00" \
   --maintenance-window-recur-every "Month Fourth Monday" \
   --maintenance-window-start-date-time "2020-12-30 08:00" \
   --maintenance-window-time-zone "Pacific Standard Time"
```

> [!IMPORTANT]
> Maintenance **duration** must be *2 hours* or longer. Maintenance **recurrence** must be set to at least occur once in 35-days.

Maintenance recurrence can be expressed as daily, weekly or monthly. Some examples are:
- **daily**- maintenance-window-recur-every: "Day" **or** "3Days"
- **weekly**- maintenance-window-recur-every: "3Weeks" **or** "Week Saturday,Sunday"
- **monthly**- maintenance-window-recur-every: "Month day23,day24" **or** "Month Last Sunday" **or** "Month Fourth Monday"


## Assign the configuration

Use `az maintenance assignment create` to assign the configuration to your isolated VM or Azure Dedicated Host.

### Isolated VM

Apply the configuration to a VM using the ID of the configuration. Specify `--resource-type virtualMachines` and supply the name of the VM for `--resource-name`, and the resource group for to the VM in `--resource-group`, and the location of the VM for `--location`. 

```azurecli-interactive
az maintenance assignment create \
   --resource-group myMaintenanceRG \
   --location eastus \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute \
   --configuration-assignment-name myConfig \
   --maintenance-configuration-id "/subscriptions/1111abcd-1a11-1a2b-1a12-123456789abc/resourcegroups/myMaintenanceRG/providers/Microsoft.Maintenance/maintenanceConfigurations/myConfig"
```

### Dedicated host

To apply a configuration to a dedicated host, you need to include `--resource-type hosts`, `--resource-parent-name` with the name of the host group, and `--resource-parent-type hostGroups`. 

The parameter `--resource-id` is the ID of the host. You can use [az vm host get-instance-view](/cli/azure/vm/host#az_vm_host_get_instance_view) to get the ID of your dedicated host.

```azurecli-interactive
az maintenance assignment create \
   -g myDHResourceGroup \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --configuration-assignment-name myConfig \
   --maintenance-configuration-id "/subscriptions/1111abcd-1a11-1a2b-1a12-123456789abc/resourcegroups/myDhResourceGroup/providers/Microsoft.Maintenance/maintenanceConfigurations/myConfig" \
   -l eastus \
   --resource-parent-name myHostGroup \
   --resource-parent-type hostGroups 
```

## Check configuration

You can verify that the configuration was applied correctly, or check to see what configuration is currently applied using `az maintenance assignment list`.

### Isolated VM

```azurecli-interactive
az maintenance assignment list \
   --provider-name Microsoft.Compute \
   --resource-group myMaintenanceRG \
   --resource-name myVM \
   --resource-type virtualMachines \
   --query "[].{resource:resourceGroup, configName:name}" \
   --output table
```

### Dedicated host 

```azurecli-interactive
az maintenance assignment list \
   --resource-group myDHResourceGroup \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --resource-parent-name myHostGroup \
   --resource-parent-type hostGroups 
   --query "[].{ResourceGroup:resourceGroup,configName:name}" \
   -o table
```

## Enable automatic OS upgrade

You can enable automatic OS upgrades for each virtual machine scale set that is going to use maintenance control. Refer to document [Azure virtual machine scale set automatic OS image upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) for enabling automatic OS upgrades on your virtual machine scale set. 


## Next steps

Learn about Maintenance and updates for virtual machines running in Azure.

> [!div class="nextstepaction"]
> [Maintenance and updates](maintenance-and-updates.md)
