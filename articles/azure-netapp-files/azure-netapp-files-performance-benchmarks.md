---
title: Performance benchmarks for Azure NetApp Files | Microsoft Docs
description: Describes results of performance benchmark tests for Azure NetApp Files at the volume level.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 04/22/2019
ms.author: b-juche
---
# Performance benchmarks for Azure NetApp Files

This article describes results of performance benchmark tests for Azure NetApp Files at the volume level. 

## Sample application used for the tests

Performance tests were run with a sample application using Azure NetApp Files. The application has the following characteristics: 

* A Linux-based application built for the cloud
* Can scale linearly with added virtual machines (VMs) to increase compute power as needed
* Requires rapid accessibility of the data lake
* Has I/O patterns that are sometimes random and sometimes sequential 
    * A random pattern requires low latency for large amounts of I/O. 
    * A sequential pattern requires large amounts of bandwidth. 

## About the workload generator

The results come from Vdbench summary files. [Vdbench](https://www.oracle.com/technetwork/server-storage/vdbench-downloads-1901681.html) is a command-line utility that generates disk I/O workloads for validating storage performance. The client-server configuration used is scalable.  It includes a single mixed master/client and 14 dedicated client VMs.

## About the tests

The tests were designed to identify the limits that the sample application might have and the response time that curves up to the limits.  

The following tests were run: 

* 100% 8 KiB random read
* 100% 8 KiB random write
* 100% 64 KiB sequential read
* 100% 64 KiB sequential write
* 50% 64 KiB sequential read, 50% 64 KiB sequential write
* 50% 8 KiB random read, 50% 8 KiB random write

## Bandwidth

Azure NetApp Files offers multiple [service levels](azure-netapp-files-service-levels.md). Each service level offers a different amount of bandwidth per TiB of provisioned capacity (volume quota). The bandwidth limit for a volume is provisioned based on the combination of the service level and the volume quota. Note that the bandwidth limit is only one factor in determining the actual amount of throughput that will be realized.  

Currently, 4,500 MiB is the highest throughput that has been achieved by a workload against a single volume in testing.  With the Premium service level, a volume quota of 70.31 TiB will provision enough bandwidth to realize this throughput per the calculation below: 

![Bandwidth formula](../media/azure-netapp-files/azure-netapp-files-bandwidth-formula.png)

![Quota and service level](../media/azure-netapp-files/azure-netapp-files-quota-service-level.png)

## Throughput-intensive workloads

The throughput test used Vdbench and a combination of 12xD32s V3 storage VMs. The sample volume in the test achieved the following throughput numbers:

![Throughput test](../media/azure-netapp-files/azure-netapp-files-throughput-test.png)

## I/O-intensive workloads

The I/O test used Vdbench and a combination of 12xD32s V3 storage VMs. The sample volume in the test achieved the following I/O numbers:

![I/O test](../media/azure-netapp-files/azure-netapp-files-io-test.png)

## Latency

The distance between the test VMs and the Azure NetApp Files volume has an impact on the I/O performance.  The chart below compares the IOPS versus latency response curves for two different sets of VMs.  One set of VMs is near Azure NetApp Files and the other set is further away.  Note that the increased latency for the further set of VMs has an impact on the amount of IOPS achieved at a given level of parallelism.  Regardless, reads against a volume can exceed 300,000 IOPS as illustrated below: 

![Latency study](../media/azure-netapp-files/azure-netapp-files-latency-study.png)

## Summary

Latency-sensitive workloads (databases) can have a one millisecond response time. The transactional performance can be over 300k IOPS for a single volume.

Throughput-sensitive applications (for streaming and imaging) can have 4.5GiB/s throughput.
