---
title: "Prerequisites: Migrate to SQL Server VM using distributed AG" 
titleSuffix: SQL Server on Azure VMs
description: Review the prerequisites to migrate your SQL Server to SQL Server on Azure VMs using a distributed availability group. 
ms.service: virtual-machines-sql
ms.subservice: migration-guide
author: MashaMSFT
ms.topic: how-to
ms.date: 12/15/2021
ms.author: mathoma
---
# Prerequisites: Migrate to SQL Server VM using distributed AG

Use a [distributed availability group (AG)](/sql/database-engine/availability-groups/windows/distributed-availability-groups) to migrate either a [standalone instance](sql-server-distributed-availability-group-migrate-standalone-instance.md) of SQL Server or an [Always On availability group](sql-server-distributed-availability-group-migrate-ag.md) to SQL Server on Azure Virtual Machines (VMs). 

This article describes the prerequisites to prepare your source and target environments to migrate your SQL Server instance or availability group to SQL Server VMs using a distributed ag.

Migrating a database (or multiple databases) from a standalone instance using a distributed availability group is a simple solution that does not require a Windows Server Failover Cluster, or an availability group listener on either the source or the target. Migrating an availability group requires a cluster, and a listener on both source and target. 

## Source SQL Server  

To migrate your instance or availability group, your source SQL Server should meet the following prerequisites: 

- For a standalone instance migration, the minimum supported version is SQL Server 2017. For an availability group migration, SQL Server 2016 or later is supported. 
- Your SQL Server edition should be enterprise. 
- You must enable the [Always On feature](/sql/database-engine/availability-groups/windows/enable-and-disable-always-on-availability-groups-sql-server). 
- The databases you intend to migrate have been backed up in full mode. 
- If you already have an availability group, it must be in a healthy state. If you create an availability group as part of this process, it must be in a healthy state before you start the migration. 
- Ports used by the SQL Server instance (1433 by default) and the database mirroring endpoint (5022 by default) must be open in the firewall. To migrate databases in an availability group, make sure the port used by the listener is also open in the firewall. 

## Target SQL Server VM 

Before your target SQL Server VMs are ready for migration, make sure they meet the following prerequisites: 

- The Azure account performing the migration is assigned as the owner or contributor to the resource group that contains target the SQL Server VMs. 
- To use automatic seeding to create your distributed availability group (DAG), the instance name for the global primary (source) of the DAG must match the instance name of the forwarder (target) of the DAG. If there is an instance name mismatch between the global primary and forwarder, then you must use manual seeding to create the DAG, and manually add any additional database files in the future.
- For simplicity, the target SQL Server instance should match the version of the source SQL Server instance. If you choose to upgrade during the migration process by using a higher version of SQL Server on the target, then you will need to manually seed your database rather than relying on autoseeding as is  provided in this series of articles. Review [Migrate to higher SQL Server versions](/sql/database-engine/availability-groups/windows/distributed-availability-groups#cautions-when-using-distributed-availability-groups-to-migrate-to-higher-sql-server-versions) for more details. 
- The SQL Server edition should be enterprise. 
- You must enable the [Always On feature](/sql/database-engine/availability-groups/windows/enable-and-disable-always-on-availability-groups-sql-server). 
- Ports used by the SQL Server instance (1433 by default) and the database mirroring endpoint (5022 by default) must be open in the firewall. To migrate databases in an availability group, make sure the port used by the listener is also open in the firewall. 

## Connectivity 

The source and target SQL Server instance must have an established network connection. 

If the source SQL Server instance is located on an on-premises network, configure a [Site-to-site VPN connection](/microsoft-365/enterprise/connect-an-on-premises-network-to-a-microsoft-azure-virtual-network) or an [Azure ExpressRoute connection](../../../expressroute/expressroute-introduction.md) between the on-premises network and the virtual network where your target SQL Server VM resides. 

If your source SQL Server instance is located on an Azure virtual network that is different than the target SQL Server VM, then configure [virtual network peering](../../../virtual-network/virtual-network-peering-overview.md). 

## Authentication 

To simplify authentication between your source and target SQL Server instance, join both servers to the same domain, preferably with the domain being on the source side and apply domain-based authentication. Since this is the recommended approach, the steps in this tutorial series assume both source and target SQL Server instance are part of the same domain. 

If the source and target servers are part of different domains, configure [federation](../../../active-directory/hybrid/whatis-fed.md) between the two domains, or configure a [domain-independent availability group](../../virtual-machines/windows/availability-group-clusterless-workgroup-configure.md). 


## Next steps

Once you have configured both source and target environment to meet the prerequisites, you're ready to migrate either your [standalone instance](sql-server-distributed-availability-group-migrate-standalone-instance.md) of SQL Server or an [Always On availability group](sql-server-distributed-availability-group-migrate-ag.md) to your target SQL Server VM(s). 



