---
title: Azure infrastructure integrity
description: Learn about Azure infrastructure integrity and the steps Microsoft takes to secure it, such as virus scans on software component builds.
services: security
author: msmbaldwin

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 07/20/2026
ms.author: mbaldwin
ai-usage: ai-assisted

---

# Azure infrastructure integrity

## Software installation
Microsoft custom-builds all components in the software stack installed in the Azure environment by following the Microsoft Security Development Lifecycle (SDL) process. Microsoft deploys all software components, including operating system (OS) images and SQL Database, as part of the change management and release management process. The OS that runs on all nodes is a customized version. The fabric controller (FC) chooses the exact version according to the role it intends for the OS to play. In addition, the host OS doesn't allow installation of any unauthorized software components.

Azure deploys some Azure components as customer workloads on a guest VM running on a guest OS.

## Virus scans on builds
Azure software component builds, including operating system builds, must undergo a virus scan that uses the Endpoint Protection antivirus tool. Each virus scan creates a log within the associated build directory, detailing what was scanned and the results of the scan. The virus scan is part of the build source code for every component within Azure. Azure doesn't move code to production without a clean and successful virus scan. If scans detect problems, Azure freezes the build. The build goes to the security teams within Microsoft Security to identify where the unauthorized code entered the build.

## Closed and locked environment
By default, Azure doesn't create user accounts on Azure infrastructure nodes and guest VMs. In addition, default Windows administrator accounts are also disabled. Administrators from Azure live support can, with proper authentication, sign in to these machines and administer the Azure production network for emergency repairs.

## Azure SQL Database authentication
As with any implementation of SQL Server, tightly control user account management. Azure SQL Database supports SQL authentication and Microsoft Entra authentication. To support a customer's data security model, use user accounts with strong passwords and specific rights.

## ACLs and firewalls between the Microsoft corporate network and an Azure cluster
Access-control lists (ACLs) and firewalls between the service platform and the Microsoft corporate network protect SQL Database instances from unauthorized insider access. Also, only users from IP address ranges from the Microsoft corporate network can access the Windows Fabric platform-management endpoint.

## ACLs and firewalls between nodes in a SQL Database cluster
As part of the defense-in-depth strategy, Microsoft implements ACLs and a firewall between nodes in a SQL Database cluster. All communication inside the Windows Fabric platform cluster and all running code is trusted.

## Custom monitoring agents
SQL Database employs custom monitoring agents (MAs), also called watchdogs, to monitor the health of the SQL Database cluster.

## Web protocols

### Role instance monitoring and restart
Azure ensures that all deployed, running roles (internet-facing web, or back-end processing worker roles) undergo sustained health monitoring. Health monitoring ensures that they effectively and efficiently deliver the services they're provisioned to deliver. If a role becomes unhealthy because of a critical fault in the hosted application or an underlying configuration problem within the role instance itself, the FC detects the problem within the role instance and initiates a corrective state.

### Compute connectivity
Azure ensures that the deployed application or service is reachable through standard web-based protocols. Virtual instances of internet-facing web roles have external internet connectivity and are reachable directly by web users. To protect the sensitivity and integrity of the operations that worker roles perform on behalf of the publicly accessible web role virtual instances, virtual instances of back-end processing worker roles have external internet connectivity, but external web users can't access them directly.

## Next steps
To learn more about what Microsoft does to secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](physical-security.md)
- [Azure infrastructure availability](infrastructure-availability.md)
- [Azure information system components and boundaries](infrastructure-components.md)
- [Azure network architecture](infrastructure-network.md)
- [Azure production network](production-network.md)
- [Azure SQL Database security features](infrastructure-sql.md)
- [Azure production operations and management](infrastructure-operations.md)
- [Azure infrastructure monitoring](infrastructure-monitoring.md)
- [Azure customer data protection](protection-customer-data.md)
