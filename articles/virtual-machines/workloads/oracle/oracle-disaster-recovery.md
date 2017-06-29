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

## Scenario 1 (Primary and DR sites on Azure)

A customer has an Oracle database setup on the primary site. A DR site is on a different region. Oracle Data Guard is used for quick recovery between these sites. The primary site also has a secondary database for reporting and other use. 

### Topology

Here is a summary of the Azure setup.

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

## Scenario 2 (Primary site on-premises and DR site on Azure)

A customer has an on-premises Oracle database setup (primary site). A DR site is on Azure. Oracle Data Guard is used for quick recovery between these sites. The primary site also has a secondary database for reporting and other use. 

There are 2 approach for this setup.

### 1. Direct connections between On-Premises and Azure, required open TCP ports on firewall. This approch is not recommended as it expose the TCP ports to outside world.

### Topology

Here is a summary of the Azure setup.

- One sites (DR site)
- One Virtual Network (Vnet)
- One Oracle database with Data Guard (Active)
- One Application service on DR site
- One Jumpbox is used, which restricts access to private network, only allows sign in by administrator
- Jumpbox, application service, database, and VPN gateway are on separate subnets
- NSG is enforced on application and database subnets
- Add NSG policy/rule to allow inbound TCP port 1521 (or user defined)
- Add NSG policy/rule to restrict only the IP address/addresses on-premises (DB or application) to access the Vnet.

![Screenshot of the DR topology page](./media/oracle-disaster-recovery/oracle_topology_02.png)

### 2. A better approach is using Site-to-Site VPN. More information about setting up VPN is available from this [link](https://docs.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-cli)

### Topology

Here is a summary of the Azure setup.

- One sites (DR site)
- One Virtual Network (Vnet)
- One Oracle database with Data Guard (Active)
- One Application service on DR site
- One Jumpbox is used, which restricts access to private network, only allows sign in by administrator
- Jumpbox, application service, database, and VPN gateway are on separate subnets
- NSG is enforced on application and database subnets
- Site-to-Site VPN connection between on-premises and Azure

![Screenshot of the DR topology page](./media/oracle-disaster-recovery/oracle_topology_03.png)

## Additional readings:

- [Design and implement Oracle database on Azure](oracle-design.md)
- [Configure Oracle Data Guard](configuring-oracle-dataguard.md)
- [Configure Oracle Golden Gate](configure-oracle-golden-gate.md)
- [Oracle Backup and Recovery](oracle-backup-recovery.md)


## Next steps

[Tutorial: Create highly available VMs](../../linux/create-cli-complete.md)

[Explore VM deployment Azure CLI samples](../../linux/cli-samples.md)
