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
- Design the topology and configuration that meet your DR requirements.

## Scenario 1 (Primary site on-premises and DR site on Azure)

A customer has an on-premises Oracle database setup on the primary site. A DR site is on Azure. Oracle Data Guard is used for quick recovery between these sites. The primary site also has a secondary database for reporting and other use. 






## Scenario 2 (Primary and DR sites on Azure)

A customer has an Oracle database setup on the primary site. A DR site is on a different region. Oracle Data Guard is used for quick recovery between these sites. The primary site also has a secondary database for reporting and other use. 

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

![Screenshot of the DR topology page](./media/oracle-disaster-recovery/oracle_topology_01.png)



## Additional readings:

- [Design and implement Oracle database on Azure](oracle-design.md)
- [Configure Oracle Data Guard](configuring-oracle-dataguard.md)
- [Configure Oracle Golden Gate](configure-oracle-golden-gate.md)
- [Oracle Backup and Recovery](oracle-backup-recovery.md)


## Next steps

[Tutorial: Create highly available VMs](../../linux/create-cli-complete.md)

[Explore VM deployment Azure CLI samples](../../linux/cli-samples.md)
