---
title: Best practices for configuring an Elastic SAN Preview
description: Elastic SAN best practices
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: sample
ms.date: 10/12/2022
ms.author: rogarana
ms.custom: ignite-2022, devx-track-azurepowershell
---

# Elastic SAN Preview best practices

 This article provides some general guidance and best practices for Azure Elastic SAN configurations and other Azure resources used with Elastic SAN.

## Elastic SAN

Keeping your Azure virtual machine (VM) and Elastic SAN in the same zone and same region minimizes latency and helps ensure you get the best performance.

When deploying an elastic SAN, ensure you allocate enough base capacity so that all your applications and workloads can meet their performance needs. To best determine your needs, collect performance metrics of your current workloads that you'd like to migrate. Examine the combined maximum IOPS and throughput for all these workloads over a period of time. Add some buffer to these figures if the data have any on-premises bottlenecks and to account for higher performance needs during spikes. After you've determined your needs, create an elastic SAN with enough base capacity that provides you the IOPS and throughput your workloads require. If you need more capacity but not more performance, use additional capacity, which costs less than base capacity. 

For best performance with your volumes, use multi-session connections.  multi-session connectivity has been optimized (32 sessions) through scripts on portal and documentation for providing best performance. Based on further performance improvements we will update this recommendation. NOTE: Windows software iSCSI initiator has a limit of maximum 256 sessions. Reduce # of sessions to each volume if you need to connect to more volumes from the client.

Elastic SAN uses VM network bandwidth, disk throughput limits on a VM do not apply. Choose a VM that can provide sufficient bandwidth for both production/VM-to-VM traffic and iSCSI traffic to attached Elastic SAN volume(s). 

iSCSI traffic isolation using a second vNIC - iSCSI traffic to Elastic SAN volumes cannot be redirected to a different vNIC on the VM due to lack of SendTargets support. Please redirect other production or VM to VM traffic to the secondary vNIC and use default (primary) vNIC for iSCSI throughput to attached Elastic SAN volumes. 

Enable “Accelerated Networking”. 


## MPIO

### Windows

### Linux

## iSCSI

### Windows

### Linux

