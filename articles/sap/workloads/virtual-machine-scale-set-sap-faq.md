---
title: FAQs for Virtual Machine Scale Set for SAP workload
description: List of frequently asked questions (FAQs) about virtual machine scale set with flexible orchestration for SAP workload
author: dennispadia
manager: rdeltcheva
ms.author: depadia
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: conceptual
ms.date: 03/20/2024
---

# FAQs for Virtual Machine Scale Set for SAP workload

Get answers to frequently asked questions about Virtual Machine Scale Sets for SAP workload.

## SAP workload deployment

### Can I create flexible scale set with scaling or scaling profile for SAP workload to use autoscaling feature for SAP application servers?

Use of flexible scale set with scaling profile isn't recommended, as the scaling feature doesn't work out-of-the-box for SAP workload. Currently, virtual machines scale set with flexible orchestration can only be used as a deployment framework for SAP workload.

### Does setting FD=1 for flexible scale set zonal deployment imply that all VMs within the scale set would belong to a single fault domain?

Setting FD=1 for flexible scale set zonal deployment means that the scale set would attempt to max spread instances across multiple fault domains on best effort basis.

### Flexible virtual machine scale set with FD=1 is used for zonal deployment, what is the method for deploying flexible scale set in a region that doesn't have any zones?

Deploying a flexible scale set in a region without zones is essentially the same as deploying one with zones, except that you don't need to specify any zones for that region. However, it's important to avoid creating a scale set with a `platformFaultDomainCount` value greater than 1.

### Which data disks can be used with VMs deployed with flexible scale set?

For new SAP deployment in flexible scale set with FD=1, VMs deployed within the scale set can utilize any data disks that are listed as supported in this [reference list](../../virtual-machine-scale-sets/virtual-machine-scale-sets-faq.yml#are-data-disks-supported-within-scale-sets-). For more information on migrating a deployment that involves pinned storage volumes (such as ANF), see the [Migration of SAP Workload](#migration-of-sap-workload) FAQ section.

### What are the limitations of assigning capacity reservation to VMs deployed in flexible scale set?

If you're deploying VMs in flexible scale set without a scaling profile for SAP workloads, it's not possible to assign capacity reservation group at the scale set level. Attempting to do so would result in deployment failure. Instead, you would need to enable capacity reservation for each individual VM. For more information, see the [limitations and restrictions](../../virtual-machines/capacity-reservation-overview.md#limitations-and-restrictions) section as not all SKUs are currently supported for capacity reservation.

## High Availability and Disaster Recovery of SAP workload

### How can I use Azure Site Recovery for VMs deployed in flexible scale set for disaster recovery?

You can use [PowerShell](../../site-recovery/azure-to-azure-powershell.md) to set up Azure Site Recovery for disaster recovery of VMs that are deployed in a flexible scale set. Currently, it's the only method available to configure disaster recovery for VMs deployed in scale set.

### I want to use Azure fence agent with managed-system identity (MSI). How could I enable managed system identity on the VMs deployed in flexible scale set without a scaling profile?

You can enable managed system identity at the VM level after a VM is manually deployed in the scale set.

## Migration of SAP workload

### How can I migrate my current Availability set or Availability zone deployment of SAP workload to flexible scale set with zonal deployment (FD=1)?

To migrate SAP VMs to a flexible scale set, you need to re-create the VMs and the disks with zone constraints (if necessary) from existing resources. There's no direct way to migrate SAP workloads deployed in availability sets or availability zones to flexible scale with FD=1. An [open-source project](https://github.com/Azure/SAP-on-Azure-Scripts-and-Utilities/tree/main/Move-VM-from-AvSet-to-AvZone/Move-Regional-SAP-HA-To-Zonal-SAP-HA-WhitePaper) includes PowerShell functions that you can use as a sample, and a [blog post](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/how-to-easily-migrate-an-existing-sap-system-vms-to-flexible/ba-p/3833548) shows you how to modify a HA or non-HA SAP system deployed in availability set or availability zone to flexible scale set with FD=1.

### How can an existing deployment of SAP HANA, which is [pinned](../../azure-netapp-files/application-volume-group-considerations.md#best-practices-about-proximity-placement-groups) to Azure NetApp Files, be migrated to flexible scale set with FD=1?

To move an existing SAP HANA deployment that is currently pinned with Azure NetApp Files to zonal deployment with flexible scale set (FD=1), you must redeploy or migrate the SAP HANA VMs with flexible scale set (FD=1). Additionally, you would need to configure Azure NetApp Files with the [availability zones volume placement feature](../../azure-netapp-files/manage-availability-zone-volume-placement.md) and transfer data to new volumes using backup/restore.

Keep in mind that the availability zone volume placement feature is still in preview. Therefore, it's essential to thoroughly review the documentation on [managing availability zone volume placement for Azure NetApp Files](../../azure-netapp-files/use-availability-zones.md) for additional consideration.

### How to configure SAP HANA using Azure NetApp Files (ANF) Application Volume Groups (AVG) in a specific availability zone?

You can create new volumes in your preferred logical availability zone as described in [availability zones volume placement feature](../../azure-netapp-files/manage-availability-zone-volume-placement.md) guide. For configuring AVG for SAP HANA, follow the steps described in the article [Configuring Azure NetApp Files (ANF) Application Volume Group (AVG) for zonal SAP HANA deployment](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/configuring-azure-netapp-files-anf-application-volume-group-avg/ba-p/3943801).
