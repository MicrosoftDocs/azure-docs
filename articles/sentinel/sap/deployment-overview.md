---
title: Deploy Microsoft Sentinel solution for SAP® applications in Microsoft Sentinel
description: This article introduces you to the process of deploying the Microsoft Sentinel solution for SAP® applications.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 06/19/2023
---

# Deploy Microsoft Sentinel solution for SAP® applications

This article introduces you to the process of deploying the Microsoft Sentinel solution for SAP® applications. The full process is detailed in a whole set of articles linked under [Deployment milestones](#deployment-milestones).

> [!TIP]
> Learn how to [monitor the health and role of your SAP systems](../monitor-sap-system-health.md).

Microsoft Sentinel solution for SAP® applications is certified for SAP S/4HANA® Cloud, Private Edition RISE with SAP and SAP S/4 on-premises. Learn more about this [certification](solution-overview.md#certification).

> [!NOTE]
> If needed, you can [update an existing Microsoft Sentinel for SAP data connector](update-sap-data-connector.md) to its latest version. 

## Overview

**Microsoft Sentinel solution for SAP® applications** is a [Microsoft Sentinel solution](../sentinel-solutions.md) that you can use to monitor your SAP systems and detect sophisticated threats throughout the business logic and application layers. The solution includes the following components:
- The Microsoft Sentinel for SAP data connector for data ingestion.
- Analytics rules and watchlists for threat detection.
- Functions for easy data access.
- Workbooks for interactive data visualization.
- Watchlists for customization of the built-in solution parameters.
- Playbooks for automating responses to threats.

> [!NOTE]
> The Microsoft Sentinel for SAP solution is free to install, but there will be an [additional hourly charge](https://azure.microsoft.com/pricing/offers/microsoft-sentinel-sap-promo/) for activating and using the solution on production systems starting May 2023. 
>
> - The additional hourly charge applies to connected production systems only. 
> - Microsoft Sentinel identifies a production system by looking at the configuration on the SAP system. To do this, Microsoft Sentinel searches for a production entry in the T000 table. 
> - [View the roles of your connected production systems](../monitor-sap-system-health.md).

The Microsoft Sentinel for SAP data connector is an agent, installed on a VM or a physical server that collects application logs from across the entire SAP system landscape. It then sends those logs to your Log Analytics workspace in Microsoft Sentinel. You can then use the other content in the Threat Monitoring for SAP solution – the analytics rules, workbooks, and watchlists – to gain insight into your organization's SAP environment and to detect and respond to security threats.

## Deployment milestones

Follow your deployment journey through this series of articles, in which you'll learn how to navigate each of the following steps.

> [!NOTE]
> If needed, you can [update an existing Microsoft Sentinel for SAP data connector](update-sap-data-connector.md) to its latest version. 

| Milestone | Article |
| --------- | ------- |
| **1. Deployment overview** | **YOU ARE HERE** |
| **2. Plan architecture** | Learn about [working with the solution across multiple workspaces](cross-workspace.md) (PREVIEW) |
| **3. Deployment prerequisites** | [Prerequisites for deploying the Microsoft Sentinel Solution for SAP](prerequisites-for-deploying-sap-continuous-threat-monitoring.md) |
| **4. Prepare SAP environment** | [Deploying SAP CRs and configuring authorization](preparing-sap.md) |
| **5. Configure auditing** | [Configure auditing](configure-audit.md) |
| **6. Deploy the solution content from the content hub** | [Deploy the Microsoft Sentinel solution for SAP applications® from the content hub](deploy-sap-security-content.md) |
| **7. Deploy data connector agent** | [Deploy and configure the container hosting the data connector agent](deploy-data-connector-agent-container.md) |
| **8. Configure Microsoft Sentinel Solution for SAP** | [Configure Microsoft Sentinel Solution for SAP](deployment-solution-configuration.md) |
| **9. Optional steps** | - [Configure Microsoft Sentinel for SAP data connector to use SNC](configure-snc.md)<br>- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)<br>- [Configure audit log monitoring rules](configure-audit-log-rules.md)<br>- [Deploy SAP connector manually](sap-solution-deploy-alternate.md)<br>- [Select SAP ingestion profiles](select-ingestion-profiles.md) |

## Next steps

Begin the deployment of the Microsoft Sentinel solution for SAP® applications by reviewing the prerequisites:
> [!div class="nextstepaction"]
> [Prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
