---
title: Deploy Microsoft Sentinel Solution for SAP in Microsoft Sentinel
description: This article introduces you to the process of deploying the Microsoft Sentinel Solution for SAP.
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 04/12/2022
---

# Deploy Microsoft Sentinel Solution for SAP

This article introduces you to the process of deploying the Microsoft Sentinel Solution for SAP. The full process is detailed in a whole set of articles linked under [Deployment milestones](#deployment-milestones) below.

## Overview

**Microsoft Sentinel Solution for SAP** is a [Microsoft Sentinel solution](../sentinel-solutions.md) that you can use to monitor your SAP systems and detect sophisticated threats throughout the business logic and application layers. The solution includes the following components:
- The Microsoft Sentinel for SAP data connector for data ingestion.
- Analytics rules and watchlists for threat detection.
- Functions for easy data access. 
- Workbooks for interactive data visualization. 
- Watchlists for customization of the built-in solution parameters.  

The solution is free until February 2023, when an additional cost will be added on top of the ingested data. [Learn more about pricing](https://azure.microsoft.com/pricing/offers/microsoft-sentinel-sap-promo/).  

The Microsoft Sentinel for SAP data connector is an agent, installed on a VM or a physical server, that collects application logs from across the entire SAP system landscape. It then sends those logs to your Log Analytics workspace in Microsoft Sentinel. You can then use the other content in the Threat Monitoring for SAP solution – the analytics rules, workbooks, and watchlists – to gain insight into your organization's SAP environment and to detect and respond to security threats.

## Deployment milestones

Follow your deployment journey through this series of articles, in which you'll learn how to navigate each of the following steps:

| Milestone | Article |
| --------- | ------- |
| **1. Deployment overview** | **YOU ARE HERE** |
| **2. Deployment prerequisites** | [Prerequisites for deploying the Microsoft Sentinel Solution for SAP](prerequisites-for-deploying-sap-continuous-threat-monitoring.md) |
| **3. Prepare SAP environment** | [Deploying SAP CRs and configuring authorization](preparing-sap.md) |
| **4. Deploy data connector agent** | [Deploy and configure the container hosting the data connector agent](deploy-data-connector-agent-container.md) |
| **5. Deploy SAP security content** | [Deploy SAP security content](deploy-sap-security-content.md)
| **6. Microsoft Sentinel Solution for SAP** | [Configure Microsoft Sentinel Solution for SAP](deployment-solution-configuration.md)
| **7. Optional steps** | - [Configure auditing](configure-audit.md)<br>- [Configure Microsoft Sentinel for SAP data connector to use SNC](configure-snc.md)<br>- [Configure audit log monitoring rules](configure-audit-log-rules.md)

## Next steps

Begin the deployment of the Microsoft Sentinel Solution for SAP by reviewing the prerequisites:
> [!div class="nextstepaction"]
> [Prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
