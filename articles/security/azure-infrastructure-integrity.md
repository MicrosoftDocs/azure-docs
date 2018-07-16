---
title: Azure infrastructure integrity
description: This article addresses integrity of the Azure infrastructure.
services: security
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: TomSh

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/06/2018
ms.author: terrylan

---

# Azure infrastructure integrity

## Software Installation
All components in the software stack that are installed in the Azure environment are custom built following the Microsoft’s Security Development Lifecycle (SDL) process. All software components (including OS images and SQL Database) are deployed as part of the Change and Release Management process. The OS that runs on all nodes is a customized version of Windows Server 2008 or Windows Server 2012. The exact version is chosen by the FC according to the role it intends for the OS to play. In addition, the Host OS does not allow installation of any unauthorized software components.

Some Microsoft Azure components (for example, RDFE, Developer Portal, etc.) are deployed as Azure customers on Guest VM running on Guest OS.

## Virus Scans on Builds
Azure software component (including OS) builds have to go through a virus scan using the Microsoft Endpoint Protection (MEP) anti-virus tool. Each virus scan will create a log within the associated build directory, detailing what was scanned and the results of the scan. The virus scan is part of the build source code for every component within Azure. Code will not be moved to Production without having a clean and successful virus scan. If there are any issues noted, the build is frozen, and will then go to the Security teams within Microsoft Security to identify where the "rogue" code entered the build.

## Closed/Locked Environment
By default, Azure infrastructure nodes and guest VMs do not have any user accounts created on them. In addition, default Windows administrator accounts are also disabled. Administrators from Microsoft Azure Live Support (WALS) can – with proper authentication – log into these machines and administer the Azure Production network for emergency repairs.

## Microsoft Azure SQL Database Authentication
As with any implementation of SQL Server, user account management must be tightly controlled. Microsoft Azure SQL Database only supports SQL Server authentication. User accounts with strong passwords and configured with specific rights should be used as well to complement the customer’s data security model.

## Firewall/ACLs between MSFT CorpNet and Microsoft Azure Cluster
ACLs/Firewall between the Service Platform and MS Corporate Network protect Microsoft Azure SQL Database from unauthorized insider access. Further, only users from IP address ranges from Microsoft CorpNet can access the WinFabric platform management endpoint.

## Firewall/ACLs between nodes in an Azure SQL DB cluster
As an additional protection, as part of the defense-in depth-strategy, ACLs/Firewall have been implemented in between nodes in a Microsoft Azure SQL DB cluster. All communication inside the WinFabric platform cluster as well as all running code is trusted.

## Custom MAs (Watchdogs)
Microsoft Azure SQL Database employs custom MAs called watchdogs to monitor the health of the Microsoft Azure SQL DB cluster.

## Web protocols

### Role instance monitoring and restart
Azure ensures all running roles (Internet-facing web, or back-end processing worker roles) deployed are subject to sustained health monitoring to ensure that they are effectively and efficiently delivering the services in which they’ve been provisioned. In the event a role becomes unhealthy, by either a critical fault in the application being hosted or underlying configuration problem within the role instance itself, Microsoft Azure FC will detect the problem within the role instance and initiate a corrective state.

### Compute connectivity
Azure ensures that the application/service deployed is reachable via standard web-based protocols. Internet-facing web role virtual instances will have external Internet connectivity and will be reachable directly by web users. Back-end processing worker role virtual instances have external Internet connectivity but cannot be accessed directly by an external web user, in order to protect the sensitivity and integrity of the operations that worker roles perform on behalf of the publicly-accessible web role virtual instances.

## Next steps
To learn more about what Microsoft does to secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](azure-physical-security.md)
- [Azure infrastructure availability](azure-infrastructure-availability.md)
- [Azure information system components and boundaries](azure-infrastructure-components.md)
- [Azure network architecture](azure-infrastructure-network.md)
- [Azure production network](azure-production-network.md)
- [Microsoft Azure SQL Database security features](azure-infrastructure-sql.md)
- [Azure production operations and management](azure-infrastructure-operations.md)
- [Monitoring of Azure infrastructure](azure-infrastructure-monitoring.md)
- [Protection of customer data in Azure](azure-protection-of-customer-data.md)
