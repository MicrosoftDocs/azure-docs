---
title: Troubleshoot failures during failback of Azure VMs to on-premises VMware with Azure Site Recovery | Microsoft Docs
description: This article describes ways to troubleshoot common failback and reprotection errors during failback to VMware from Azure, using Azure Site Recovery.    
services: site-recovery
documentationcenter: ''
author: rajani-janaki-ram
manager: gauravd
ms.service: site-recovery
ms.topic: article
ms.date: 02/27/2017
ms.author: rajanaki
 
---

# Troubleshoot failback from Azure to VMware

This article describes how to troubleshoot issues you might encounter when you fail back Azure VMs to your on-premises VMware infrastructure, after failover to Azure using [Azure Site Recovery](site-recovery-overview.md).

Failback essentially involves two main steps. After failover, you need to reprotect Azure VMs to on-premises, so that they start replicating. The second step is to run a failover from Azure, to fail back to your on-premises site. 

## Troubleshoot reprotection errors

This section details common reprotection errors, and how to correct them.

### Error code 95226

**Reprotect failed as the Azure virtual machine was not able to reach the on-premises configuration server.**

This error occurs when:

1. The Azure VM can't reach the on-premises configuration server. The VM can't be discovered, and registered to the configuration server. 
2. The InMage Scout Application service isn't running on the Azure VM after failover. The service is needed for communications with the on-premises configuration server.

To resolve this issue:

1. Check that the Azure VM network allows the Azure VM to communicate with the on-premises configuration server. To do this, either set up a site-to-site VPN to your on-premises datacenter, or configure an ExpressRoute connection with private peering on the virtual network of the Azure VM. 
2. If the VM can communicate with the on-premises configuration server, then log onto the VM, and check the 'InMage Scout Application Service'. If you see that it's not running, start the service manually, and check that the service start type is set to Automatic.

### Error code 78052

***Protection couldn't be completed for the virtual machine.**

This can happen if there's already a VM with the same name on the master target server to which you're failing back.

To resolve this issue do the following:
1. Select a different master target server on a different host, so that reprotection will create the machine on a different host, where the names do not collide. 
2. You can also vMotion the master target to a different host on which the name collision won't happen. If the existing VM is a stray machine,  rename it so that the new VM can be created on the same ESXi host.

### Error code 78093

**The VM is not running, in a hung state, or not accessible.**

To reprotect a failed over VM, the Azure VM must be running. This is so that the Mobility service registers with the configuration server on-premises, and can start replicating by communicating with the process server. If the machine is on an incorrect network, or isn't running (hung state or shutdown), then the configuration server can't reach the Mobility service on the VM, to begin reprotection. 

1. Restart the VM so that it can start communicating back on-premises.
2. Restart the reprotect job after starting the Azure virtual machine

### Error code 8061

**The datastore is not accessible from ESXi host.**

Check the [master target prerequisites](site-recovery-how-to-reprotect.md#common-things-to-check-after-completing-installation-of-the-master-target-server) and the [supported datastores](site-recovery-how-to-reprotect.md#what-datastore-types-are-supported-on-the-on-premises-esxi-host-during-failback) for failback.


## Troubleshoot failback errors

This section describes common errors you might encounter during failback.

### Error code 8038

**Failed to bring up the on-premises virtual machine due to the error**

This happens when the on-premises VM is brought up on a host that doesn't have enough memory provisioned. To resolve this issue:

1. Provision more memory on the ESXi host.
2. In addition, you can vMotion the VM to another ESXi host that has enough memory to boot the VM.
