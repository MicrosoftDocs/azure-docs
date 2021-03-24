---
title: Platform updates for Azure VMware Solution
description: Learn about the platform updates to Azure VMware Solution.
ms.topic: reference
ms.date: 03/16/2021
---

# Platform updates for Azure VMware Solution

Important updates to Azure VMware Solution will be applied starting in March 2021. You'll receive notification through Azure Service Health that includes the timeline of the maintenance. For more details about the key upgrade processes and features in Azure VMware Solution, see [Azure VMware Solution private cloud updates and upgrades](concepts-upgrades.md).

## March 15, 2021 

- Azure VMware Solution service will perform maintenance work through March 19, 2021, to update vCenter server in your private cloud to vCenter Server 6.7 Update 3l version.

- During this time, VMware vCenter will be unavailable, and you won't be able to manage VMs (stop, start, create, delete). Private cloud scaling (adding/removing servers and clusters) will also be unavailable. VMware High Availability (HA) will continue to operate to provide protection for existing VMs. 
 
For more information on this vCenter version, see [VMware vCenter Server 6.7 Update 3l Release Notes](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/vsphere-vcenter-server-67u3l-release-notes.html).

## March 4, 2021

- Azure VMware Solutions will apply patches through March 15, 2021, to ESXi in existing private clouds to [VMware ESXi 6.7, Patch Release ESXi670-202011002](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/esxi670-202011002.html).

- Documented workarounds for the vSphere stack, as per [VMSA-2021-0002](https://www.vmware.com/security/advisories/VMSA-2021-0002.html), will also be applied through March 15, 2021.

>[!NOTE]
>This is non-disruptive and should not impact Azure VMware Services or workloads. During maintenance, various VMware alerts, such as _Lost network connectivity on DVPorts_ and _Lost uplink redundancy on DVPorts_, appear in vCenter and clear automatically as the maintenance progresses.

## Post update
Once complete, newer versions of VMware components appear. If you notice any issues or have any questions, contact our support team by opening a support ticket.





