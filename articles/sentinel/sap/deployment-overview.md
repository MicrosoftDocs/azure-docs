---
title: Deploy Microsoft Sentinel solution for SAP applications
description: Get an introduction to the process of deploying the Microsoft Sentinel solution for SAP applications.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 06/19/2023

# customer intent: As a business user or decision maker, I want to get an overview of how to deploy the Microsoft Sentinel solution for SAP applications so that I know the scope of the information I need and how to access it.
---

# Deploy Microsoft Sentinel solution for SAP applications

This article introduces you to the process of deploying the Microsoft Sentinel solution for SAP applications. The full process is detailed in a set of articles linked under [Deployment milestones](#deployment-milestones).

> [!TIP]
> Learn how to [monitor the health and role of your SAP systems](../monitor-sap-system-health.md).

Microsoft Sentinel solution for SAP applications is certified for SAP S/4HANA Cloud, Private Edition RISE with SAP, and SAP S/4 on-premises. Learn more about this [certification](solution-overview.md#certification).

> [!NOTE]
> [Update an existing Microsoft Sentinel for SAP data connector](update-sap-data-connector.md) to the latest version.

## What is the Microsoft Sentinel solution for SAP applications?

The Microsoft Sentinel solution for SAP applications is a [Microsoft Sentinel solution](../sentinel-solutions.md) that you can use to monitor your SAP systems. Use the solution to detect sophisticated threats throughout the business logic and application layers of your SAP applications. The solution includes the following components:

- The Microsoft Sentinel for SAP data connector for data ingestion.
- Analytics rules and watchlists for threat detection.
- Functions that you can use for easy data access.
- Workbooks that you can use to create interactive data visualization.
- Watchlists for customization of the built-in solution parameters.
- Playbooks that you can use to automate responses to threats.

> [!NOTE]
> The Microsoft Sentinel for SAP solution is free to install, but there is an [additional hourly charge](https://azure.microsoft.com/pricing/offers/microsoft-sentinel-sap-promo/) for activating and using the solution on production systems.
>
> - The additional hourly charge applies to connected production systems only.
> - Microsoft Sentinel identifies a production system by looking at the configuration on the SAP system. To do this, Microsoft Sentinel searches for a production entry in the T000 table.
>
> For more information, see [View the roles of your connected production systems](../monitor-sap-system-health.md).

The Microsoft Sentinel for SAP data connector is an agent that's installed on a virtual machine (VM), physical server, or Kubernetes cluster. The agent collects application logs for all of your SAP SIDs from across the entire SAP system landscape, and then sends those logs to your Log Analytics workspace in Microsoft Sentinel. Use the other content in the [Threat Monitoring for SAP solution](sap-solution-security-content.md), including the analytics rules, workbooks, and watchlists, to gain insight into your organization's SAP environment and to detect and respond to security threats.

For example, the following image shows a multi-SID SAP landscape with a split between production and nonproduction systems, including the SAP Business Technology Platform. All the systems in this image are onboarded to Microsoft Sentinel for the SAP solution.

:::image type="content" source="media/deployment-overview/sap-sentinel-multi-sid-overview.png" alt-text="Diagram that shows a multi-SID SAP landscape with Microsoft Sentinel." lightbox="media/deployment-overview/sap-sentinel-multi-sid-overview.png" border="false":::

## Deployment milestones

Follow your deployment journey through this series of articles, in which you learn how to navigate each of the following steps.

> [!NOTE]
> [Update an existing Microsoft Sentinel for SAP data connector](update-sap-data-connector.md) to the latest version.

| Milestone | Article |
| --------- | ------- |
| **1. Deployment overview** | *YOU ARE HERE* |
| **2. Plan your architecture** | Learn how to [work with the solution in multiple workspaces](cross-workspace.md) (preview) |
| **3. Deployment prerequisites** | [Prerequisites for deploying the Microsoft Sentinel solution for SAP](prerequisites-for-deploying-sap-continuous-threat-monitoring.md) |
| **4. Prepare your SAP environment** | [Deploy SAP change requests and configure authorization](preparing-sap.md) |
| **5. Configure auditing** | [Configure auditing](configure-audit.md) |
| **6. Deploy the solution content from the content hub** | [Deploy the Microsoft Sentinel solution for SAP applications from the content hub](deploy-sap-security-content.md) |
| **7. Deploy the data connector agent** | [Deploy and configure the container hosting the data connector agent](deploy-data-connector-agent-container.md) |
| **8. Configure the Microsoft Sentinel solution for SAP** | [Configure the Microsoft Sentinel solution for SAP](deployment-solution-configuration.md) |
| **9. Optional steps** | - [Configure the Microsoft Sentinel for SAP data connector to use SNC](configure-snc.md)<br>- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)<br>- [Configure audit log monitoring rules](configure-audit-log-rules.md)<br>- [Deploy SAP connector manually](sap-solution-deploy-alternate.md)<br>- [Select SAP ingestion profiles](select-ingestion-profiles.md) |

## Next step

Begin the deployment of the Microsoft Sentinel solution for SAP applications by reviewing the prerequisites:

> [!div class="nextstepaction"]
> [Prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
