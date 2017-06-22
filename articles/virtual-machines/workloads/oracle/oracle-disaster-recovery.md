---
title: Overview of Oracle disaster recovery scenario in your Azure environment | Microsoft Docs
description: A disaster recovery scenario of Oracle Database 12c in your Azure environment.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: v-shiuma
manager: timlt
editor: 
tags: azure-resource-manager
ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 6/2/2017
ms.author: rclaus
---

# Disaster Recovery (DR) of Oracle 12c database on an Azure environment

## Assumptions

- Understanding of Oracle Data Guard design and Azure environment


## Goals
- Design the topology and configuration that meet your performance and availability/DR requirements.

## DR Scenario

A customer has an on-premises Oracle database setup on the primary site. A DR site is on a different region. Oracle Data Guard is used for quick recovery between these sites. The primary site also has a secondary database for reporting and other use. 

Customer plan to migrate the on-premises Oracle database to Azure. The following steps could be used for the migration.

### Topology

Similar to the customer's existing setup. Here is a summary of the Azure setup.

- Two sites (Primary and DR site)
- Two Virtual Network (Vnet)
- Two Oracle database with Data Guard (primary and standby)
- Two Oracle database with Golden Gate or Data Guard (primary site only)
- Two Application service on primary and one on DR site
- 'Availability set' are used for database and application service on primary site
- One Jumpbox on each site, which restricts access to private network, only allows sign in by administrator
- Jumpbox, application service, database, and VPN gateway are on separate subnets
- NSG is enforced on application and database subnets

![Screenshot of the DR topology page](./media/oracle-topology/oracle_topology_01.png)

Once you decided what topology to use, the next step is sizing the resources, such as VM, storage, and VPN.

## Component selection (sizing)

The sizing of VMs, network, and Storage types can be done with the following steps:

![Screenshot of the DR topology page](./media/oracle-topology/sizing_flowchat.png)

### Generate AWR report

A quick way to gather your database/network information is created an AWR report. Or you can contact your infrastructure team to get similar information. Following is an example of how to generate an AWR report.

```bash
$ sqlplus / as sysdba
SQL> EXEC DBMS_WORKLOAD_REPOSITORY.CREATE_SNAPSHOT;
SQL> @?/rdbms/admin/awrrpt.sql
```

### Key metrics

The followings are the metrics that can be obtained from the AWR report.

- Total number of Core
- CPU clock speed
- Total memory in GB
- CPU utilization
- Peak data transfer rate
- Rate of IO changes (Read/Write)
- Redo log rate (MBPs)
- Network throughput
- Network latency rate (low/high)
- Database size in GB
- bytes received via SQL*Net from/to client




## Additional readings:

- [Configure Oracle Data Guard](configuring-oracle-dataguard.md)
- [Configure Oracle Golden Gate](configure-oracle-golden-gate.md)
- [Oracle Backup and Recovery](oracle-backup-recovery.md)


## Next steps

[Tutorial: Create highly available VMs](../../linux/create-cli-complete.md)

[Explore VM deployment Azure CLI samples](../../linux/cli-samples.md)
