---
title: Management and operation of the Azure production network
description: This article describes how Microsoft manages and operates the Azure production network to secure the Azure datacenters.
author: msmbaldwin
ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 07/20/2026
ms.author: mbaldwin
ai-usage: ai-assisted
---

# Management and operation of the Azure production network
This article describes how Microsoft manages and operates the Azure production network to secure the Azure datacenters.

## Monitor, log, and report

Management and operation of the Azure production network are a coordinated effort between the operations teams of Azure and Azure SQL Database. The teams use several system and application performance-monitoring tools in the environment. They also use appropriate tools to monitor network devices, servers, services, and application processes.

To ensure the secure execution of services running in the Azure environment, the operations teams implement multiple levels of monitoring, logging, and reporting, including the following actions:

- The Microsoft Monitoring Agent (MMA) gathers monitoring and diagnostic log information from many places, including the fabric controller (FC) and the root operating system (OS), and writes it to log files. The agent eventually pushes a digested subset of the information into a preconfigured Azure storage account. In addition, the freestanding monitoring and diagnostic service reads various monitoring and diagnostic log data and summarizes the information. The monitoring and diagnostic service writes the information to an integrated log. Azure uses the custom-built Azure security monitoring, which is an extension to the Azure monitoring system. This extension has components that observe, analyze, and report on security-pertinent events from various points in the platform.

- The Azure SQL Database Windows Fabric platform provides management, deployment, development, and operational oversight services for Azure SQL Database. The platform offers distributed, multistep deployment services, health monitoring, automatic repairs, and service version compliance. The platform provides the following services:

   - Service modeling capabilities with high-fidelity development environment (datacenter clusters are expensive and scarce).
   - One-click deployment and upgrade workflows for service bootstrap and maintenance.
   - Health reporting with automated repair workflows that support self-healing.
   - Real-time monitoring, alerting, and debugging facilities across the nodes of a distributed system.
   - Centralized collection of operational data and metrics for distributed root cause analysis and service insight.
   - Operational tooling for deployment, change management, and monitoring.
   - The Azure SQL Database Windows Fabric platform and watchdog scripts run continuously and monitor in real time.

If any anomalies occur, Azure activates the incident response process followed by the Azure incident triage team. Azure notifies the appropriate support personnel to respond to the incident. A centralized ticketing system documents and manages problem tracking and resolution. Microsoft makes system uptime metrics available under the nondisclosure agreement (NDA) and upon request.

## Corporate network and multifactor access to production
The corporate network user base includes Azure support personnel. The corporate network supports internal corporate functions and includes access to internal applications for Azure customer support. Microsoft logically and physically separates the corporate network from the Azure production network. Azure personnel access the corporate network by using Azure workstations and laptops. All users must have a Microsoft Entra account, including a username and password, to access corporate network resources. Microsoft Information Technology issues and manages the Microsoft Entra accounts for all personnel, contractors, and vendors who access the corporate network. Unique user identifiers distinguish personnel based on their employment status at Microsoft.

Active Directory Federation Services (AD FS) controls access to internal Azure applications through authentication. Microsoft Information Technology hosts AD FS to authenticate corporate network users by applying a secure token and user claims. AD FS helps internal Azure applications authenticate users against the Microsoft corporate Active Directory domain. To access the production network from the corporate network environment, users must authenticate by using multifactor authentication.

## Next steps
To learn more about what Microsoft does to secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](physical-security.md)
- [Azure infrastructure availability](infrastructure-availability.md)
- [Azure information system components and boundaries](infrastructure-components.md)
- [Azure network architecture](infrastructure-network.md)
- [Azure production network](production-network.md)
- [Azure SQL Database security features](infrastructure-sql.md)
- [Azure infrastructure monitoring](infrastructure-monitoring.md)
- [Azure infrastructure integrity](infrastructure-integrity.md)
- [Azure customer data protection](protection-customer-data.md)
