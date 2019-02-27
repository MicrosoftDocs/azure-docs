---
title: Azure infrastructure integrity
description: This article addresses the integrity of the Azure infrastructure.
services: security
documentationcenter: na
author: TerryLanfear
manager: barbkess
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

## Software installation
All components in the software stack that are installed in the Azure environment are custom built following the Microsoft Security Development Lifecycle (SDL) process. All software components, including operating system (OS) images and SQL Database, are deployed as part of the change management and release management process. The OS that runs on all nodes is a customized version of Windows Server 2008 or Windows Server 2012. The exact version is chosen by the fabric controller (FC) according to the role it intends for the OS to play. In addition, the host OS does not allow installation of any unauthorized software components.

Some Azure components are deployed as Azure customers on a guest VM running on a guest OS.

## Virus scans on builds
Azure software component (including OS) builds have to undergo a virus scan that uses the Endpoint Protection anti-virus tool. Each virus scan creates a log within the associated build directory, detailing what was scanned and the results of the scan. The virus scan is part of the build source code for every component within Azure. Code is not moved to production without having a clean and successful virus scan. If any issues are noted, the build is frozen and then goes to the security teams within Microsoft Security to identify where the "rogue" code entered the build.

## Closed and locked environment
By default, Azure infrastructure nodes and guest VMs do not have user accounts created on them. In addition, default Windows administrator accounts are also disabled. Administrators from Azure live support can, with proper authentication, log into these machines and administer the Azure production network for emergency repairs.

## Azure SQL Database authentication
As with any implementation of SQL Server, user account management must be tightly controlled. Azure SQL Database supports only SQL Server authentication. To complement a customer's data security model, user accounts with strong passwords and configured with specific rights should be used as well.

## ACLs and firewalls between the Microsoft corporate network and an Azure cluster
Access-control lists (ACLs) and firewalls between the service platform and the Microsoft corporate network protect SQL Database instances from unauthorized insider access. Further, only users from IP address ranges from the Microsoft corporate network can access the Windows Fabric platform-management endpoint.

## ACLs and firewalls between nodes in a SQL Database cluster
As an additional protection, as part of the defense-in depth-strategy, ACLs and a firewall have been implemented between nodes in a SQL Database cluster. All communication inside the Windows Fabric platform cluster as well as all running code is trusted.

## Custom monitoring agents
SQL Database employs custom monitoring agents (MAs), also called watchdogs, to monitor the health of the SQL Database cluster.

## Web protocols

### Role instance monitoring and restart
Azure ensures that all deployed, running roles (internet-facing web, or back-end processing worker roles) are subject to sustained health monitoring to ensure that they effectively and efficiently deliver the services for which they’ve been provisioned. If a role becomes unhealthy, by either a critical fault in the application that's being hosted or an underlying configuration problem within the role instance itself, the FC detects the problem within the role instance and initiates a corrective state.

### Compute connectivity
Azure ensures that the deployed application or service is reachable via standard web-based protocols. Virtual instances of internet-facing web roles have external internet connectivity and are reachable directly by web users. To protect the sensitivity and integrity of the operations that worker roles perform on behalf of the publicly-accessible web role virtual instances, virtual instances of back-end processing worker roles have external internet connectivity but cannot be accessed directly by external web users.

## Next steps
To learn more about what Microsoft does to secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](azure-physical-security.md)
- [Azure infrastructure availability](azure-infrastructure-availability.md)
- [Azure information system components and boundaries](azure-infrastructure-components.md)
- [Azure network architecture](azure-infrastructure-network.md)
- [Azure production network](azure-production-network.md)
- [Azure SQL Database security features](azure-infrastructure-sql.md)
- [Azure production operations and management](azure-infrastructure-operations.md)
- [Azure infrastructure monitoring](azure-infrastructure-monitoring.md)
- [Azure customer data protection](azure-protection-of-customer-data.md)
