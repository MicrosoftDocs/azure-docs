---
title: Msv2 and Mdsv2 Isolated Sizes Retirement
description: Migration guide for sizes
author:      iamwilliew # GitHub alias
ms.author: wwilliams
ms.service: virtual-machines
ms.topic: conceptual
ms.date:     01/10/2024
ms.subservice: sizes
---

# Msv2 and Mdsv2 isolated sizes retirement

On March 31, 2027, Azure will retire the Msv2 and Mdsv2-series Medium Memory virtual machines (VM) listed: 

- Msv2 Medium Memory Diskless 

   - Standard_M192is_v2  
   - Standard_M192ims_v2 

- Mdsv2 Medium Memory with Disk 

   - Standard_M192ids_v2 
   - Standard_M192idms_v2 

From now to March 31, 2027, you can continue to use the VMs listed without disruption. On March 31, 2027, the remaining VMs with these specific sizes on your subscription will be set to a deallocated state. These VMs are stopped and removed from the host. These VMs won't be billed in the deallocated state. To avoid service disruptions, refer to the instructions listed to migrate to your selected Mv3 replacement size by March 31, 2027.   

#### Migrate workloads to Mv3 Medium Memory Series VMs 

The [Msv3 and Mdsv3 Medium Memory Series](/azure/virtual-machines/msv3-mdsv3-medium-series), powered by 4th generation Intel® Xeon® Scalable processors, are the next generation of memory-optimized VM sizes delivers faster performance, lower total cost of ownership and improvement to failures, compared to previous generation Mv2 VMs. The Mv3 MM series offers VM sizes of up to 4TB of memory and 4,000 MBps throughout to remote storage and provides up to 25% networking performance improvements over previous generations. 

Follow the instructions listed to migrate your [M192i(d)(m)s VM](/azure/virtual-machines/msv2-mdsv2-series) to your chosen [Msv3 and Mdsv3 Medium Memory Series](/azure/virtual-machines/msv3-mdsv3-medium-series) replacement. 

### Migration steps 

1. Choose a [series and size](/azure/virtual-machines/msv3-mdsv3-medium-series) for migration. Use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) for further insights. 

2. [Get quota for the target VM series](/azure/quotas/per-vm-quota-requests). 

3. Check whether the existing M192i(d)(m)s_v2 VM is part of an [Availability Set](/azure/virtual-machines/availability-set-overview) or [Proximity Placement Group](/azure/virtual-machines/co-location), which can be verified in Azure portal in the VM properties. 

4. If the VM isn't part of an Availability Set nor a Proximity Placement Group, [it can be resized](/azure/virtual-machines/resize-vm?tabs=portal).   

5. If the VM isn't part of an Availability Set, but is part of a Proximity Placement Group, you need to shut down all VMs in the PPG, [resize](/azure/virtual-machines/resize-vm?tabs=portal) then restart the M192i(d)(m)s_v2 VMs, then restart the other VMs in the PPG. 

6. If the VM is part of an Availability Set, check your records to determine if the Availability Set is pinned to a specific M-series compute cluster for proximity purposes (for example, to collocate with services like NFS that shares hosted on Azure NetApp Files). If you aren't sure about pinning having taken place, open an [Azure Support Request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) to confirm. 

7. If your VM is part of a non-pinned Availability Set, you need to shut down all VMs in that particular Availability Set and go through the [resize procedure](/azure/virtual-machines/resize-vm?tabs=portal) for every VM of the Availability Set. 

8. If the VM is part of a non-pinned Availability set and a Proximity Placement Group, you have two options: 

    - Shut down all VMs in the PPG, [resize](/azure/virtual-machines/resize-vm?tabs=portal) then restart the M192i(d)(m)s_v2 VMs, then restart the other VMs in the PPG. 
    - Switch availability options to [Availability Zone](/azure/reliability/availability-zones-overview?toc=%2Fazure%2Fvirtual-machines%2Ftoc.json&tabs=azure-cli) as described using the open source supported  script and procedure linked or setting up Database Replication (for example, HANA System Replication, SQL Server AlwaysOn).  

       - [How to Migrate a Highly Available SAP System in Azure from Availability Set to Availability Zone](https://github.com/Azure/SAP-on-Azure-Scripts-and-Utilities/tree/main/Move-VM-from-AvSet-to-AvZone/Move-Regional-SAP-HA-To-Zonal-SAP-HA-WhitePaper) 

9. If your VM is part of a pinned Availability set or if you can't switch your availability option to Availability Zone (as recommended above), open an Azure Support request to assist with resizing.   

### Help and support 

If you have questions, ask community experts in [Microsoft Q&A](/answers/topics/azure-virtual-machines.html). If you have a support plan and need technical help, create a support request: 

In the [Help + support page](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest), select Create a support request. Follow the New support request page instructions. Use the following values: 

1. For Issue type, select Technical. 

2. For Service, select My services. 

3. For Service type, select Virtual Machine running Windows/Linux or Virtual Machine running SAP in case you run SAP application workloads. 

4. For Resource, select your VM. 

5. For Problem type, select Assistance with resizing my VM. 

6. For Problem subtype, select the option that applies to you. 

7. Follow instructions in the Solutions and Details tabs, as applicable, and then Review + create. 

