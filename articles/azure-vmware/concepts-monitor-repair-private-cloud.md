---
title: Concepts - Monitoring and repair of Azure VMware Solution private clouds
description: Learn how Azure VMware Solution monitors and repairs VMware ESXi servers allocated to an Azure VMware Solution private cloud.
ms.topic: conceptual
ms.date: 09/16/2020
---

# Monitoring and repair of Azure VMware Solution private clouds

Azure VMware Solution continuously monitors the VMware ESXi servers allocated to an Azure VMware Solution private cloud. 

## What does Azure VMware Solution monitor?

Azure VMware Solution monitors the following for failure conditions on the host:  

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

When Azure VMware Solution monitoring detects a degradation or failure on an Azure VMware Solution node that is allocated to a tenant’s private cloud, Azure VMware Solution triggers the host remediation process. Host remediation involves replacing the faulty node with a new healthy node.  

The host remediation process starts by adding a new healthy node in the cluster. Then, when possible, the faulty host is placed in VMware vSphere maintenance mode. VMware vMotion is used to move the VMs off the faulty host to other available servers in the cluster, potentially allowing for zero downtime live migration of workloads. In scenarios where the faulty host cannot be placed in maintenance mode, the host is removed from the cluster.

## Next steps

[Learn about Azure VMware Solution private cloud upgrades](concepts-upgrades.md).  
