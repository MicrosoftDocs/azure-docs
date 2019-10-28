---
title: Troubleshoot failback to on-premises during VMware VM disaster recovery to Azure with Azure Site Recovery | Microsoft Docs
description: This article describes ways to troubleshoot failback and reprotection issues during VMware VM disaster recovery to Azure with Azure Site Recovery.
author: rajani-janaki-ram
manager: gauravd
ms.service: site-recovery
ms.topic: conceptual
ms.date: 11/27/2018
ms.author: rajanaki

---

# Troubleshoot failback to on-premises from Azure

This article describes how to troubleshoot issues you might encounter when you fail back Azure VMs to your on-premises VMware infrastructure, after failover to Azure by using [Azure Site Recovery](site-recovery-overview.md).

Failback essentially involves two main steps. For the first step, after failover, you need to reprotect Azure VMs to on-premises so that they start replicating. The second step is to run a failover from Azure to fail back to your on-premises site.

## Troubleshoot reprotection errors

This section details common reprotection errors and how to correct them.

### Error code 95226

**Reprotect failed as the Azure virtual machine was not able to reach the on-premises configuration server.**

This error occurs when:

* The Azure VM can't reach the on-premises configuration server. The VM can't be discovered and registered to the configuration server.
* The InMage Scout application service isn't running on the Azure VM after failover. The service is needed for communications with the on-premises configuration server.

To resolve this issue:

* Check that the Azure VM network allows the Azure VM to communicate with the on-premises configuration server. You can either set up a site-to-site VPN to your on-premises datacenter or configure an Azure ExpressRoute connection with private peering on the virtual network of the Azure VM.
* If the VM can communicate with the on-premises configuration server, sign in to the VM. Then check the InMage Scout application service. If you see that it's not running, start the service manually. Check that the service start type is set to **Automatic**.

### Error code 78052

**Protection couldn't be completed for the virtual machine.**

This issue can happen if there's already a VM with the same name on the master target server to which you're failing back.

To resolve this issue:

* Select a different master target server on a different host so that reprotection creates the machine on a different host, where the names don't collide.
* You also can use vMotion to move the master target to a different host where the name collision won't happen. If the existing VM is a stray machine, rename it so that the new VM can be created on the same ESXi host.


### Error code 78093

**The VM is not running, in a hung state, or not accessible.**

To resolve this issue:

To reprotect a failed-over VM, the Azure VM must be running so that Mobility Service registers with the configuration server on-premises and can start replicating by communicating with the process server. If the machine is on an incorrect network or isn't running (not responding or shut down), the configuration server can't reach Mobility Service on the VM to begin reprotection.

* Restart the VM so that it can start communicating back on-premises.
* Restart the reprotect job after you start the Azure virtual machine.

### Error code 8061

**The datastore is not accessible from ESXi host.**

Check the [master target prerequisites and supported data stores](vmware-azure-reprotect.md#deploy-a-separate-master-target-server) for failback.


## Troubleshoot failback errors

This section describes common errors you might encounter during failback.

### Error code 8038

**Failed to bring up the on-premises virtual machine due to the error.**

This issue happens when the on-premises VM is brought up on a host that doesn't have enough memory provisioned. 

To resolve this issue:

* Provision more memory on the ESXi host.
* In addition, you can use vMotion to move the VM to another ESXi host that has enough memory to boot the VM.
