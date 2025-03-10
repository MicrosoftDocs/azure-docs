---
title: FAQs for Virtual Machine Scale Set for SAP workload
description: List of frequently asked questions (FAQs) about virtual machine scale set with flexible orchestration for SAP workload
author: dennispadia
manager: rdeltcheva
ms.author: depadia
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: conceptual
ms.date: 10/15/2024
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

### Which data disks can be used with Virtual Machine (VM) deployed with flexible scale set?

For new SAP deployment in flexible scale set with FD=1, VMs deployed within the scale set can utilize any data disks that are listed as supported in this [reference list](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-faq#are-data-disks-supported-within-scale-sets-). For more information on migrating a deployment that involves pinned storage volumes (such as ANF), see the [Migration of SAP Workload](#migration-of-sap-workload) FAQ section.

### What are the limitations of assigning capacity reservation to VMs deployed in flexible scale set?

If you're deploying VMs in flexible scale set without a scaling profile for SAP workloads, it's not possible to assign capacity reservation group at the scale set level. Attempting to do so would result in deployment failure. Instead, you would need to enable capacity reservation for each individual VM. For more information, see the [limitations and restrictions](/azure/virtual-machines/capacity-reservation-overview#limitations-and-restrictions) section as not all SKUs are currently supported for capacity reservation.

## High Availability and Disaster Recovery of SAP workload

### How can I use Azure Site Recovery for VMs deployed in flexible scale set for disaster recovery?

You can use [PowerShell](../../site-recovery/azure-to-azure-powershell.md) to set up Azure Site Recovery for disaster recovery of VMs that are deployed in a flexible scale set. Currently, it's the only method available to configure disaster recovery for VMs deployed in scale set.

### I want to use Azure fence agent with managed-system identity (MSI). How could I enable managed system identity on the VMs deployed in flexible scale set without a scaling profile?

You can enable managed system identity at the VM level after a VM is manually deployed in the scale set.

## Migration of SAP workload

### How can I migrate my current Availability set or Availability zone deployment of SAP workload to flexible scale set with zonal deployment (FD=1)?

To migrate SAP VMs deployed in availability set to a flexible scale set, you need to re-create the VMs and the disks with zone constraints (if necessary) from existing resources. There's no direct way to migrate SAP workloads deployed in availability sets to flexible scale with FD=1. An [open-source project](https://github.com/Azure/SAP-on-Azure-Scripts-and-Utilities/tree/main/Move-VM-from-AvSet-to-AvZone/Move-Regional-SAP-HA-To-Zonal-SAP-HA-WhitePaper) includes PowerShell functions that you can use as a sample, and a [blog post](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/how-to-easily-migrate-an-existing-sap-system-vms-to-flexible/ba-p/3833548) shows you how to modify a HA or non-HA SAP system deployed in availability set to flexible scale set with FD=1.

For VMs deployed in an availability zone, you can attach the VM directly to a scale set with FD=1 in the same zone. For example, if your VM is deployed in availability zone 1, you can attach it to a scale set FD=1 in the same zone. For more details on how to attach a VM to a scale set and the limitations, see [Attach or detach a Virtual Machine to or from a Virtual Machine Scale Set](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-attach-detach-vm)

### How can an existing deployment of SAP HANA configured with availability set pinning and proximity placement group, currently utilizing application volume group be migrated to flexible scale set with FD=1?

The volumes (/hana/data, /hana/log, and /hana/shared) configured for SAP HANA can be populated with availability zone information as described in [Populate an existing volume with availability zone information](../../azure-netapp-files/manage-availability-zone-volume-placement.md#populate-an-existing-volume-with-availability-zone-information). Since all the volumes for SAP HANA are configured using an application volume group, they would populate on the same availability zone. Once you have the availability zone information for your volume, you could redeploy or migrate SAP HANA VMs with flexible scale set (FD=1) into the same zone as your Azure NetApp File volumes.

> [!IMPORTANT]
> Availability zone information can only be populated as provided. You can't select an availability zone or move the volume to another availability zone by using "populate availability zone" feature. If you want to move volume to another availability zone, consider using [cross-zone replication](../../azure-netapp-files/create-cross-zone-replication.md) (after populating the volume with the availability zone information).

### I have my SAP workload deployed in an availability zone. Can I use the attach or detach feature of a scale set to attach my VMs deployed in an availability zone to a scale set with FD=1?

To attach an existing VM deployed in availability zones to a scale set with FD=1, see [Attach an existing Virtual Machine to a Virtual Machine Scale Set](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-attach-detach-vm?tabs=portal-1%2Cportal-2%2Cportal-3#attach-an-existing-virtual-machine-to-a-virtual-machine-scale-set). The scale set created without a scaling profile default to having the singlePlacementGroup property set to null. To attach VMs to a scale set without a scaling profile, you need to create a scale set with singlePlacementGroup property explicitly set to false. Additionally, refer to [Limitations for attaching an existing Virtual Machine to a scale set](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-attach-detach-vm?tabs=portal-1%2Cportal-2%2Cportal-3#limitations-for-attaching-an-existing-virtual-machine-to-a-scale-set)

### How to configure SAP HANA using Azure NetApp Files (ANF) Application Volume Groups (AVG) in a specific availability zone?

You can create new volumes in your preferred logical availability zone as described in [availability zones volume placement feature](../../azure-netapp-files/manage-availability-zone-volume-placement.md) guide. For configuring AVG for SAP HANA, follow the steps described in the article [Configuring Azure NetApp Files (ANF) Application Volume Group (AVG) for zonal SAP HANA deployment](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/configuring-azure-netapp-files-anf-application-volume-group-avg/ba-p/3943801).
