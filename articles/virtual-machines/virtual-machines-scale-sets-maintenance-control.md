---
title: Overview of Maintenance control for Azure virtual machines scale sets
description: Learn how to control when maintenance is applied to your Azure virtual machine scale sets using Maintenance Control.
author: cynthn
ms.service: virtual-machine-scale-sets
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 09/11/2020
ms.author: cynthn
#pmcontact: shants
---

# Managing platform updates with Maintenance Control 

Manage your virtual machine scale sets OS image updates, that don't require a reboot, using maintenance control. 

Maintenance control lets you decide when to apply updates to OS disks in your virtual machine scale sets through an easier and more predictable experience.

With maintenance control, you can:
- Batch updates into one update package. 
- Maintenance configurations work across subscriptions and resource groups. 

The entire workflow comes down to these steps: 
- Create a maintenance configuration.
- Associate a virtual machine scale set to a maintenance configuration.
- Enable automatic OS upgrades.


## Limitations

- VMs must be in a scale set.
- User must have **Resource Contributor** access.


## Management options

You can create and manage maintenance configurations using any of the following options:

- [Azure PowerShell](virtual-machines-scale-sets-maintenance-control-powershell.md)


## Next steps

Learn how to control when maintenance is applied to your Azure virtual machines scale sets using Maintenance control and PowerShell.

> [!div class="nextstepaction"]
> [VMSS Maintenance control using PowerShell](virtual-machines-scale-sets-maintenance-control-powershell.md)
