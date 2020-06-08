---
title: Failover cluster instances 
description: "Learn about failover cluster instances (FCI) with SQL Server on Azure Virtual Machines." 
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management
ms.service: virtual-machines-sql
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "06/02/2020"
ms.author: mathoma

---

# Failover cluster instances with SQL Server on Azure Virtual Machines
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article introduces failover cluster instances for SQL Server on Azure Virtual Machines (VMs). 

## Overview

SQL Server on Azure VMs leverages Windows Server Failover Clustering (WSFC) functionality to provide local high availability through redundancy at the server-instance level - a failover cluster instance (FCI). An FCI is a single instance of SQL Server that is installed across Windows Server Failover Cluster (WSFC) (or simply the cluster) nodes and, possibly, across multiple subnets. On the network, an FCI appears to be an instance of SQL Server running on a single computer, but the FCI provides failover from one WSFC node to another if the current node becomes unavailable.

The rest of the article focuses on the differences for failover cluster instances when used with SQL Server on Azure VMs, but to learn more about the failover clustering technology see: 

- [Windows cluster technologies](https://docs.microsoft.com/windows-server/failover-clustering/failover-clustering-overview)
- [SQL Server Failover Cluster Instances](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)

In a traditional on-premises SQL Server clustered environment, the Windows Failover Cluster uses local shared storage that is accessible by both nodes. Since storage for a virtual machine is not local, there are several solutions available to deploy a failover cluster with SQL Server on Azure VMs. 

The rest of the article explains the storage options available for working with SQL Server FCI in Azure. 

## Azure Shared Disks

[Azure Shared Disks](../../../virtual-machines/windows/disks-shared.md) are a feature of [Azure Virtual Machines](../../../virtual-machines/windows/index.yml), and Windows Server 2019 supports using shared managed disks with a failover cluster instance. 

Benefits: 

Limitations: 
- Only available for Windows Server 2019. 
- Proximity placement group (PPG)
- Has to be in an availability set. 
 
To get started, see [SQL Server failover cluster instance with shared managed disks](failover-cluster-instance-azure-shared-disks-manually-configure.md). 

**Supported OS**:    
**Supported SQL version**:    

## Storage Spaces Direct

[Storage spaces direct](/windows-server/storage/storage-spaces/storage-spaces-direct-overview) are a Windows Server feature that is supported with failover clustering on Azure Virtual Machines. Storage spaces direct provide a software-based virtual SAN. 

Benefits:

Limitations:
- Only available for Windows Server 2016 and later. 
- Filestream is supported. 
 

To get started, see [SQL Server failover cluster instance storage spaces direct](failover-cluster-instance-azure-shared-disks-manually-configure.md). 

**Supported OS**:    
**Supported SQL version**:    

## Premium file share

[Premium file shares](../../../storage/files/storage-how-to-create-premium-fileshare.md) are a feature of [Azure Files](../../../storage/files/index.yml). Premium file shares are SSD-backed, consistently low-latency file shares that are fully supported for use with Failover Cluster Instances for SQL Server 2012 or later on Windows Server 2012 or later. Premium file shares give you greater flexibility, allowing you to resize and scale a file share without any downtime.

Benefits:


Limitations: 
- Only available for Windows Server 2012 and later. 
- Filestream is not supported 


To get started, see [SQL Server failover cluster instance with premium file share](failover-cluster-instance-premium-file-share-manually-configure.md). 

## Third party

There are a number of third-party clustering solutions with supported storage. 

One example uses SIOS Datakeeper as the storage. For more information, see the blog [Failover clustering and SIOS DataKeeper](https://azure.microsoft.com/blog/high-availability-for-a-file-share-using-wsfc-ilb-and-3rd-party-software-sios-datakeeper/)

**Supported OS**:    
**Supported SQL version**:    

## iSCSI and ExpressRoute

You can also expose an iSCSI target shared block storage via ExpressRoute. 

For example, NetApp Private Storage (NPS) exposes an iSCSI target via ExpressRoute with Equinix to Azure VMs.

For third-party shared storage and data replication solutions, you should contact the vendor for any issues related to accessing data on failover.

**Supported OS**:    
**Supported SQL version**:    


## Limitations

### Lightweight resource provider

At this time, SQL Server failover cluster instances on Azure virtual machines are only supported with the [lightweight management mode](sql-vm-resource-provider-register.md#management-modes) of the [SQL Server IaaS Agent Extension](sql-server-iaas-agent-extension-automate-management.md). To change from full extension mode to lightweight, delete the **SQL virtual machine** resource for the corresponding VMs and then register them with the SQL VM resource provider in lightweight mode. When deleting the **SQL virtual machine** resource using the Azure portal, **clear the checkbox next to the correct Virtual Machine**. The full extension supports features such as automated backup, patching, and advanced portal management. These features will not work for SQL Server VMs after the agent is reinstalled in lightweight management mode.


## Next steps

Be sure to review the [high availability and disaster recover best practices](hadr-high-availability-disaster-recovery-best-practices.md) to ensure your cluster has been configured appropriately, and then [prepare your SQL Server VM for FCI](failover-cluster-instance-prepare-vm.md). 

