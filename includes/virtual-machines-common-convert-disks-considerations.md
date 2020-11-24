---
author: cynthn
ms.service: virtual-machines
ms.topic: include
ms.date: 10/26/2018
ms.author: cynthn
---

* The conversion requires a restart of the VM, so schedule the migration of your VMs during a pre-existing maintenance window. 

* The conversion is not reversible. 

* Be aware that any users with the [Virtual Machine Contributor](../articles/role-based-access-control/built-in-roles.md#virtual-machine-contributor) role will not be able to change the VM size (as they could pre-conversion). This is because VMs with managed disks require the user to have the Microsoft.Compute/disks/write permission on the OS disks.

* Be sure to test the conversion. Migrate a test virtual machine before you perform the migration in production.

* During the conversion, you deallocate the VM. The VM receives a new IP address when it is started after the conversion. If needed, you can [assign a static IP address](../articles/virtual-network/public-ip-addresses.md) to the VM.

* Review the minimum version of the Azure VM agent required to support the conversion process. For information on how to check and update your agent version, see [Minimum version support for VM agents in Azure](https://support.microsoft.com/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support)