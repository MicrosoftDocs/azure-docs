---
title: Maintenance control for Azure virtual machines using PowerShell
description: Learn how to control when maintenace is applied to your Azure VMs using Maintenance Control and Azure PowerShell.
services: virtual-machines-linux
author: cynthn

ms.service: virtual-machines
ms.topic: article
ms.tgt_pltfrm: vm
ms.workload: infrastructure-services
ms.date: 11/19/2019
ms.author: cynthn
---

# Preview: Control updates with Maintenance Control and the Azure PowerShell

Manage platform updates, that don't require a reboot, using maintenance control. Azure frequently updates its infrastructure to improve reliability, performance, security or launch new features. Most updates are transparent to users. Some sensitive workloads, like gaming, media streaming, and financial transactions, can’t tolerate even few seconds of a VM freezing or disconnecting for maintenance. Maintenance control gives you the option to wait on platform updates and apply them within a 35-day rolling window. 

Maintenance control lets you decide when to apply updates to your isolated VMs.

With maintenance control, you can:
- Batch updates into one update package.
- Wait up to 35 days to apply updates. 
- Automate platform updates for your maintenance window using Azure Functions.
- Maintenance configurations work across subscriptions and resource groups. 

> [!IMPORTANT]
> Maintenance Control is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 

## Limitations

- VMs must be on a [dedicated host](./linux/dedicated-hosts.md), or be created using an [isolated VM size](./linux/isolation.md).
- After 35 days, an update will automatically be applied and availability constraints will not be respected.
- User must have **Resource Owner** access.


## Enable the PowerShell module

Enable the PowerShell module. 

```azurepowershell-interactive

```

If you choose to install the [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps) locally, you need version 2.0.76 or later.

## Create a maintenance configuration

Use `new-AzMaintenanceConfiguration` to create a maintenance configuration. This example creates a maintenance configuration named *myConfig* scoped to the host. 

```azurecli-interactive
New-AzResourceGroup `
   -Location eastus `
   -Name myMaintenanceRG
New-AzMaintenanceConfiguration `
   -ResourceGroup myMaintenanceRG `
   -Name myConfig `
   -MaintenanceScope Host`
   -Location  eastus
```

Copy the configuration ID from the output to use later.

Using `-MaintenanceScope host` will ensure that all VMs on a host will follow the same maintenance configuration.

You can query for available maintenance configurations using [az maintenance configuration list]()

```azurepowershell-interactive
Get-AzMaintenanceConfiguration 
```

## Apply the configuration

Use `az maintenance assignment create` to apply the configuration.

### Isolated VM

Apply the configuration to a VM using the ID of the configuration. Specify `--resource-type virtualMachines` and supply the name of the VM for `--resource-name`, and the resource group for `--resource-group`. 

```azurecli-interactive
az maintenance assignment create \
   --resource-group myMaintenanceRG \
   --location eastus \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute \
   --configuration-assignment-name myConfig \
   --maintenance-configuration-id '/subscriptions/1111abcd-1a11-1a2b-1a12-123456789abc/resourcegroups/myMaintenanceRG/providers/Microsoft.Maintenance/maintenanceConfigurations/myConfig'
```

### Dedicate host

To apply a configuration to a dedicated host, you need to include `--resource-type hosts`, `--resource-parent-name` with the name of the host group, and `--resource-parent-type hostGroups`. 

The parameter `--resource-id` is the ID of the host. You can use [az vm host get-instance-view](/cli/azure/vm/host#az-vm-host-get-instance-view) to get the ID of your dedicated host.

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
   --resource-parent-type hostGroups \
   --resource-id /subscriptions/1111abcd-1a11-1a2b-1a12-123456789abc/re
sourceGroups/myResourceGroup/providers/Microsoft.Compute/hostGroups/myHostGroup/hosts
/myHost
```

## Check for pending updates

Use `az maintenance update list` to see if there are pending updates. Update --subscription to be the ID for the subscription that contains the VM.

### Isolated VM

Check for pending updates for an isolated VM. In this example, the output is formatted as a table for readability.

```azurecli-interactive
az maintenance update list \
   -g myMaintenanceRg \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute \
   -o table
```

### Dedicated host

To check for pending updates for a dedicated host. In this example, the output is formatted as a table for readability. Replace the values for the resources with your own.

```azurecli-interactive
az maintenance update list \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myHostResourceGroup \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --resource-parentname myHostGroup \
   --resource-parent-type hostGroups \
   -o table
```

## Apply updates

Use `az maintenance apply update` to apply pending updates.

### Isolated VM

Create a request to apply updates to an isolated VM.

```azurecli-interactive
az maintenance applyupdate create \
   -g myMaintenanceRG\
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute
```

### Dedicated host

Apply updates to a dedicated host.

```azurecli-interactive
az maintenance applyupdate create \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myHostResourceGroup \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --resource-parent-name myHostGroup \
   --resource-parent-type hostGroups
```

## Delete a maintenance configuration

Use [az maintenance configuration delete]() to delete a maintenance configuration.

```azurecli-interactive
az maintenance configuration delete \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myResourceGroup \
   --name myConfig
```

## Next steps
To learn more, see [Maintenance and updates](maintenance-and-updates.md).