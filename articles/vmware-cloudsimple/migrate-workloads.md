--- 
title: Azure VMware Solution by CloudSimple - Migrate workload VMs to Private Cloud 
description: Describes how to migrate virtual machines from on-premises vCenter to CloudSimple Private Cloud vCenter
author: shortpatti 
ms.author: v-patsho
ms.date: 08/20/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Migrate workload VMs from on-premises vCenter to Private Cloud vCenter environment

To migrate VMs from an on-premises datacenter to your CloudSimple Private Cloud, several options are available.  The Private Cloud provides native access to VMware vCenter, and tools supported by VMware can be used for workload migration. This article describes some of the vCenter migration options.

## Prerequisites

Migration of VMs and data from your on-premises datacenter requires network connectivity from the datacenter to your Private Cloud environment.  Use either of the following methods to establish network connectivity:

* [Site-to-Site VPN connection](vpn-gateway.md#set-up-a-site-to-site-vpn-gateway) between your on-premises environment and your Private Cloud.
* ExpressRoute Global Reach connection between your on-premises ExpressRoute circuit and a CloudSimple ExpressRoute circuit.

The network path from your on-premises vCenter environment to your Private Cloud must be available for migration of VMs using vMotion.  The vMotion network on your on-premises vCenter must have routing abilities.  Verify that your firewall allows all vMotion traffic between your on-premises vCenter and Private Cloud vCenter. (On the Private Cloud, routing on the vMotion network is configured by default.)

## Migrate ISOs and templates

To create new virtual machines on your Private Cloud, use ISOs and VM templates.  To upload the ISOs and templates to your Private Cloud vCenter and make them available, use the following method.

1. Upload the ISO to the Private Cloud vCenter from vCenter UI.
2. [Publish a content library](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-2A0F1C13-7336-45CE-B211-610D39A6E1F4.html) on your Private Cloud vCenter:

    1. Publish your on-premises content library.
    2. Create a new content library on the Private Cloud vCenter.
    3. Subscribe to the published on-premises content library.
    4. Synchronize the content library for access to subscribed contents.

## Migrate VMs using PowerCLI

To migrate VMs from the on-premises vCenter to the Private Cloud vCenter, use VMware PowerCLI or the Cross vCenter Workload Migration Utility available from VMware Labs.  The following sample script shows the PowerCLI migration commands.

```
$sourceVC = Connect-VIServer -Server <source-vCenter name> -User <source-vCenter user name> -Password <source-vCenter user password>
$targetVC = Connect-VIServer -Server <target-vCenter name> -User <target-vCenter user name> -Password <target-vCenter user password>
$vmhost = <name of ESXi host on destination>
$vm = Get-VM -Server $sourceVC <name of VM>
Move-VM -VM $vm -VMotionPriority High -Destination (Get-VMhost -Server $targetVC -Name $vmhost) -Datastore (Get-Datastore -Server $targetVC -Name <name of tgt vc datastore>)
```

> [!NOTE]
> To use the names of the destination vCenter server and ESXi hosts, configure DNS forwarding from on-premises to your Private Cloud.

## Migrate VMs using NSX Layer 2 VPN

This option enables live migration of workloads from your on-premises VMware environment to the Private Cloud in Azure.  With this stretched Layer 2 network, the subnet from on-premises will be available on the Private Cloud.  After migration, new IP address assignment is not required for the VMs.

[Migrate workloads using Layer 2 stretched networks](migration-layer-2-vpn.md) describes how to use a Layer 2 VPN to stretch a Layer 2 network from your on-premises environment to your Private Cloud.

## Migrate VMs using backup and disaster recovery tools

Migration of VMs to Private Cloud can be done using backup/restore tools and disaster recovery tools.  Use the Private Cloud as a target for restore from backups that are created using a third-party tool.  The Private Cloud can also be used as a target for disaster recovery using VMware SRM or a third-party tool.

For more information using these tools, see the following topics:

* [Back up workload virtual machines on CloudSimple Private Cloud using Veeam B&R](backup-workloads-veeam.md)
* [Set up CloudSimple Private Cloud as a disaster recovery site for on-premises VMware workloads](disaster-recovery-zerto.md)
