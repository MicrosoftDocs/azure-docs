---
title: Concepts - Monitor and repair Azure VMware Solution private clouds
description: Learn how Azure VMware Solution monitors and repairs VMware ESXi servers on an Azure VMware Solution private cloud.
ms.topic: conceptual
ms.custom: contperf-fy21q2
ms.date: 02/16/2021
---

# Monitor and repair Azure VMware Solution private clouds

Azure VMware Solution continuously monitors the VMware ESXi servers on an Azure VMware Solution private cloud. 

## What Azure VMware Solution monitors

Azure VMware Solution monitors the following conditions on the host:  

- Processor status 
- Memory status 
- Connection and power state 
- Hardware fan status 
- Network connectivity loss 
- Hardware system board status 
- Errors occurred on the disk(s) of a vSAN host 
- Hardware voltage 
- Hardware temperature status 
- Hardware power status 
- Storage status 
- Connection failure 

> [!NOTE]
> Azure VMware Solution tenant admins must not edit or delete the above defined VMware vCenter alarms, as these are managed by the Azure VMware Solution control plane on vCenter. These alarms are used by Azure VMware Solution monitoring to trigger the Azure VMware Solution host remediation process.

## Azure VMware Solution host remediation  

When Azure VMware Solution detects a degradation or failure on an Azure VMware Solution node, it triggers the host remediation process. Host remediation involves replacing the faulty node with a new healthy node.  

Host remediation starts by adding a new healthy node in the cluster. Then, when possible, the faulty host is placed in VMware vSphere maintenance mode. VMware vMotion moves the VMs off the faulty host to other available servers in the cluster, potentially allowing zero downtime for live migration of workloads. If the faulty host can't be placed in maintenance mode, the host is removed from the cluster.

## Next steps

Now that you've covered how Azure VMware Solution monitors and repairs private clouds, you may want to learn about:

- [Azure VMware Solution private cloud upgrades](concepts-upgrades.md)
- [How to enable Azure VMware Solution resource](enable-azure-vmware-solution.md)
