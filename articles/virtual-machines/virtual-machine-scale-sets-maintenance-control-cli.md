---
title: Maintenance control for OS image upgrades on Azure Virtual Machine Scale Sets using Azure CLI
description: Learn how to control when automatic OS image upgrades are rolled out to your Azure Virtual Machine Scale Sets using Maintenance control and Azure CLI.
author: ju-shim
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 11/22/2022
ms.author: jushiman 
ms.custom: devx-track-azurecli
ms.devlang: azurecli
#pmcontact: PPHILLIPS
---

# Maintenance control for OS image upgrades on Azure Virtual Machine Scale Sets using Azure CLI

Maintenance control lets you decide when to apply automatic guest OS image upgrades to your Virtual Machine Scale Sets. This topic covers the Azure CLI options for Maintenance control. For more information on using Maintenance control, see [Maintenance control for Azure Virtual Machine Scale Sets](virtual-machine-scale-sets-maintenance-control.md).


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

### Create a maintenance configuration with a scheduled window
You can also declare a scheduled window when Azure will apply the updates on your resources. This example creates a maintenance configuration named *myConfig* with a scheduled window of 5 hours on the fourth Monday of every month. Once you create a scheduled window, you no longer have to apply the updates manually.

> [!IMPORTANT]
> Maintenance **duration** must be *5 hours* or longer. Maintenance **recurrence** must be set to *Day*.

```azurecli-interactive
az maintenance configuration create \
   -g myMaintenanceRG \
   --resource-name myConfig \
   --maintenance-scope osimage \
   --location eastus \
   --maintenance-window-duration "05:00" \
   --maintenance-window-recur-every "Day" \
   --maintenance-window-start-date-time "2020-12-30 08:00" \
   --maintenance-window-time-zone "Pacific Standard Time"
```

## Assign the configuration

Use `az maintenance assignment create` to assign the configuration to your Virtual Machine Scale Set.


## Enable automatic OS upgrade

You can enable automatic OS upgrades for each Virtual Machine Scale Set that is going to use maintenance control. For more information about enabling automatic OS upgrades on your Virtual Machine Scale Set, see [Azure Virtual Machine Scale Set automatic OS image upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md).


## Next steps

> [!div class="nextstepaction"]
> [Learn about Maintenance and updates for virtual machines running in Azure](maintenance-and-updates.md)
