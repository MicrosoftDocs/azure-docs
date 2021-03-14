---
title: Overview of Maintenance control for OS image upgrades on Azure virtual machine scale sets
description: Learn how to control when automatic OS image upgrades are rolled out to your Azure virtual machine scale sets using Maintenance control.
author: ju-shim
ms.service: virtual-machine-scale-sets
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 09/11/2020
ms.author: jushiman
#pmcontact: shants
---

# Preview: Maintenance control for Azure virtual machine scale sets 

Manage [automatic OS image upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) for your virtual machine scale sets using maintenance control.

Maintenance control lets you decide when to apply updates to OS disks in your virtual machine scale sets through an easier and more predictable experience. 

Maintenance configurations work across subscriptions and resource groups.

The entire workflow comes down to these steps: 
- Create a maintenance configuration.
- Associate a virtual machine scale set to a maintenance configuration.
- Enable automatic OS upgrades.

> [!IMPORTANT]
> Maintenance control for OS image upgrades on Azure virtual machine scale sets is currently in Public Preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Limitations

- VMs must be in a scale set.
- User must have **Resource Contributor** access.
- Maintenance duration must be 5 hours or longer in the maintenance configuration.
- Maintenance recurrence must be set to 'Day' in the maintenance configuration


## Management options

You can create and manage maintenance configurations using any of the following options:

- [Azure PowerShell](virtual-machine-scale-sets-maintenance-control-powershell.md)


## Next steps

Learn how to control when maintenance is applied to your Azure virtual machine scale sets using Maintenance control and PowerShell.

> [!div class="nextstepaction"]
> [Virtual machine scale set maintenance control by using PowerShell](virtual-machine-scale-sets-maintenance-control-powershell.md)
