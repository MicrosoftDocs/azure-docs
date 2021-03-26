---
title: Windows Server Failover Cluster overview
description: "Learn about the Windows Serer Failover Cluster technology when used for high availability solutions with SQL Server on Azure VMs, such as availability groups, and failover cluster instances. " 
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management
ms.service: virtual-machines-sql
ms.subservice: hadr
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "06/02/2020"
ms.author: mathoma

---

# Windows Server Failover Cluster with SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]


This article provides a high-level overview of the Windows Server Failover Cluster feature when used for high availability solutions with SQL Server on Azure VMs, such as Always On availability groups and failover cluster instances. For a more detailed description, see the [Windows Server Failover Cluster documentation](/windows-server/failover-clustering/failover-clustering-overview). 

## Overview

SQL Server high availability solutions on Windows, such as Always On Availability Group (AG) or SQL Server failover Cluster Instance (FCI), require Windows Server Failover Clustering (WSFC). 
Windows Server Failover Clustering is constantly monitoring the network connections and health of the nodes in a cluster.  Besides Windows Cluster, SQL AG and FCI have their own health checks. If a node is not reachable or AG or FCI is not healthy, then recovery action is taken to recover and bring applications and services online on the same or on another node in the cluster.
By default, these checks are configured to deliver the highest levels of availability, with the smallest amount of downtime. To accomplish this fast recovery from any failures, the default settings for health monitoring are fairly aggressive.

## Azure VM differences

For Windows cluster on Azure Virtual Machine (Infrastructure as a Service -IaaS), participating cluster nodes may be physically apart within the same Azure region or in different regions. This can introduce network latency.  Moreover, some other factors like physical and virtual components, number of hops, etc. also can contribute to increased latency    
Azure platform maintenance 
Moreover, like any other cloud services, Azure periodically updates its platform to improve the reliability, performance, and security of the host infrastructure for virtual machines. The purpose of these updates ranges from patching software components in the hosting environment to upgrading networking components or decommissioning hardware.
Most platform updates don't affect customer VMs. When a no-impact update isn't possible, Azure chooses the update mechanism that's least impactful to customer VMs. Most nonzero-impact maintenance pauses the VM for less than 10 seconds. In certain cases, Azure uses memory-preserving maintenance mechanisms. These mechanisms pause the VM for up to 30 seconds and preserve the memory in RAM. The VM is then resumed, and its clock is automatically synchronized.
Memory-preserving maintenance works for more than 90 percent of Azure VMs. It doesn't work for G, M, N, and H series. Azure increasingly uses live-migration technologies and improves memory-preserving maintenance mechanisms to reduce the pause durations. When the VM is live-migrated to a different host, some sensitive workloads like SQL Server, might show a slight performance degradation in the few minutes leading up to the VM pause.
Moreover, if there is resource bottleneck   (please see section ‘Resource limits of VM and Disks purchased’ below), the node or the AG/FCI might appear to be down by the cluster service.

## Monitoring

There are two types of monitoring -
•	Aggressive Monitoring – Provides the fastest failure detection and recovery of hard failures, which delivers the highest levels of availability.  Clustering/SQL HA is less forgiving of transient failures and may in some situations prematurely failover resources when there are transient outages. Please note that once failure is detected the corrective action that follows, may take additional time.

•	Relaxed Monitoring – Provides more forgiving failure detection which provides greater tolerance of brief transient network issues. While this will avoid transient failures, it will introduce the risk of taking longer to detect an actual problem.
The optimized setting varies by your specific business requirements and the environment you operate in.   


## Recovery actions

When a failure is detected, Windows cluster takes a corrective action. This can be a restart of the AG/FCI on the same node or failover to another node. It is important to understand that corrective measures once initiated, can take some time to complete. Let’s take SQL Always On Availability groups (AG) with VNN as an example. Once AG is restarted or failed oved over to another node, because of the dependency, resources come online per the following sequence:
Listener IP comes online => Listener network name online => AG online => individual AG databases online => new connection through load balancer to the AG database
Each step can take some time but online of AG database can be the longest and can take minuets depending on factors such as how much Redo is lagging.  Please review Estimating failover time (RTO) for details. 
This means an aggressive monitoring set to detect a failure in 20 seconds can result in an outage of minutes if a transient event like a memory-preserving Azure VM maintenance happens (which can take up to 30 seconds). Setting the monitoring to relaxed value such as 40 seconds could have avoided this long interruption all together.  

## Cluster heartbeat

The primary settings that affect cluster heartbeating and health detection between nodes.
Delay – This defines the frequency at which cluster heartbeats are sent between nodes.  The delay is the number of seconds before the next heartbeat is sent.  Within the same cluster there can be different delays between nodes on the same subnet, between nodes which are on different subnets.
Threshold – This defines the number of heartbeats which are missed before the cluster takes recovery action.  The threshold is a number of heartbeats.  Within the same cluster there can be different thresholds between nodes on the same subnet, between nodes which are on different subnet.
These settings were lower in Windows server 2012 R2 or earlier which resulted in unnecessary failure due to transient network issues. To be more tolerant of transient failures it is recommended on Win2008 / Win2008 R2 / Win2012 / Win2012 R2 to increase the SameSubnetThreshold and CrossSubnetThreshold values to the higher Win2016 values can be done through hotfix 3153887. In Windows 2019 these values were further relaxed further -


## Resource limits 

On a cloud environment like on Azure VM, when you select a particular VM size or a particular disk, it offers you a limited amount computing resources such as the CPU, memory and IO limits like IOPS and throughput (MBPS).

If your application and workload (for example load on SQL Server) requires more resources anytime than the Azure VM/disk purchased limits such as IOS/MBPS/CPU/memory, the response time of the VM will be slower resulting in health check failure of Windows cluster or SQL AG/FCI. If there is resource bottleneck, the node or the AG/FCI might appear to be down by the cluster service.

This is specifically true IO SQL intensive operations or maintenance operations like backup, Index or statistics maintenance. Once the IOPS or MBPS limit of the disk or VM is reached, additional IOs will be throttled making IO operations too slow.  At this point AG/FCI or the cluster node may appear unresponsive resulting in IsAlive/LooksAlive failure.   It is not unusual to find these failures happening even in the off-peak hours when maintenance jobs are usually scheduled.