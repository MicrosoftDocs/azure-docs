---
title: Create Windows Server Failover Cluster
description: "Learn to create a Windows Server Failover Cluster for SQL Server on Azure VMs" 
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

# Create Windows Server Failover Cluster - SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

In this article, learn to configure a Windows Server Failover for SQL Server on Azure VMs.

## Prerequisites

## Manually

## PowerShell

## Az PowerShell

## Az CLI

## Azure Quickstart Templates

## Validate cluster

## Configure quorum 

### Cloud witness

### File share witness

### Forgot the third type of witness name

## Set cluster parameters

for more info, see [cluster parameters](hadr-cluster-best-practices.md)


For Windows Server 2012 or later

Following PowerShell changes both SameSubnetThreshold and CrossSubnetThreshold to 40, when run as administrator.
C:\Windows\system32> (get-cluster).SameSubnetThreshold = 40
C:\Windows\system32> (get-cluster).CrossSubnetThreshold = 40


For Windows Server 2008 or 2008 R2  

Following PowerShell changes SameSubnetThreshold to 10 and CrossSubnetThreshold to 20 and SameSubnetDelay to 2 seconds and CrossSubnetDelay to 2 seconds when run as administrator
C:\Windows\system32> (get-cluster).SameSubnetThreshold = 10
C:\Windows\system32> (get-cluster).CrossSubnetThreshold = 20 C:\Windows\system32> (get-cluster). SameSubnetDelay = 2000
C:\Windows\system32> (get-cluster). CrossSubnetDelay = 2000

Note
Changing the cluster threshold will take effect immediately, you don't have to restart the cluster or any resources.


To verify changes, you can run following PowerShell as administrator 
C:\Windows\system32> get-cluster | fl *subnet*
