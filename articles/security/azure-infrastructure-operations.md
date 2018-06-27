---
title: Azure production operations and management
description: This article provides a general description of the management and operation of the Azure production network.
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
ms.date: 06/27/2018
ms.author: terrylan

---

# Azure production operations and management    
Management and operation of the Azure Production network is a coordinated effort between the operations teams of Azure and Azure SQL Database. Several system and application performance monitoring tools are used in the environment. Network devices, servers, services, and application processes are monitored with appropriate tools.

Multiple levels of monitoring, logging, and reporting are implemented to ensure secure execution of services running in the Microsoft Azure environment, including the following actions:

- Primarily, the Microsoft Azure Monitoring Agent (MA) gathers monitoring and diagnostic log information from many places including the FC and the root OS and writes it to log files. It eventually pushes a digested subset of the information into a pre-configured Azure Storage Account. In addition, the Monitoring and Diagnostic Service (MDS) is a freestanding service that reads various monitoring and diagnostic log data and summarizes the information. MDS writes the information to an integrated log. Azure uses the custom-built Azure Security Monitoring (ASM), which is an extension to the Azure monitoring system. It has components that observe, analyze, and report on security-pertinent events from various points in the platform.
- Microsoft Azure SQL Database WinFabric platform provides management, deployment, development, and operational oversight services for Microsoft Azure SQL Database. It offers distributed, multi-step deployment services, health monitoring, automatic repairs, and service version compliance. It provides the following services:

   - Service modeling capabilities with high-fidelity development environment (datacenter clusters are expensive and scarce).
   - One-click deployment and upgrade workflows for service bootstrap and maintenance.
   - Health reporting with automated repair workflows to enable self-healing.
   - Real time monitoring, alerting and debugging facilities across the nodes of a distributed system.
   - Centralized collection of operational data and metrics for distributed root cause analysis and service insight.
   - Operational tooling for deployment, change management, and monitoring.
   - Microsoft Azure SQL Database WinFabric platform and watchdog scripts run continuously and monitor in real time.

If any anomalies occur, the Incident Response process followed by the Azure Incident Triage team is activated. The appropriate Azure support personnel is notified to respond to the incident. Issue tracking and resolution are documented and managed in a centralized ticketing system. System uptime metrics are available under the Non-Disclosure Agreement (NDA) and upon request.

## Corporate Network and Multi-Factor Access to Production
The Corporate network user base includes Microsoft Azure Support personnel. The Corporate network supports internal corporate functions and includes access to internal applications that are used for Azure customer support. The Corporate network is both logically and physically separated from the Azure Production network. Microsoft Azure personnel access the corporate network using Microsoft Azure workstations and laptops. All users must have an Active Directory (AD) account, including a username and password, to access corporate network resources. CorpNet access uses AD accounts, which are issued to all Microsoft personnel, contractors, vendors, and managed by MSIT. Unique user identifiers distinguish personnel based on their employment status at Microsoft.

Access to internal Azure applications is controlled through authentication with Active Directory Federation Services (ADFS). ADFS is a service hosted by MSIT that provides authentication of CorpNet users through applying a secure token and user claims. ADFS enables internal Microsoft Azure applications to authenticate users against the Microsoft corporate AD domain. To access the Production network from the CorpNet environment, the user must authenticate using multi-factor authentication.

## Next steps
