---
title: Deploy Continuous Threat Monitoring for SAP in Microsoft Sentinel | Microsoft Docs
description: This article introduces you to the process of deploying the Microsoft Sentinel Continuous Threat Monitoring solution for SAP.
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 04/12/2022
---

# Deploy Continuous Threat Monitoring for SAP in Microsoft Sentinel

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

This article introduces you to the process of deploying the Microsoft Sentinel Continuous Threat Monitoring solution for SAP. The full process is detailed in a whole set of articles linked under [Deployment milestones](#deployment-milestones) below.

> [!IMPORTANT]
> The Microsoft Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Overview

**Continuous Threat Monitoring for SAP** is a [Microsoft Sentinel solution](../sentinel-solutions.md) that you can use to monitor your SAP systems and detect sophisticated threats throughout the business logic and application layers. The solution includes the following components:
- The SAP data connector for data ingestion.
- Analytics rules and watchlists for threat detection.
- Workbooks for interactive data visualization. 

The SAP data connector is an agent, installed on a VM or a physical server, that collects application logs from across the entire SAP system landscape. It then sends those logs to your Log Analytics workspace in Microsoft Sentinel. You can then use the other content in the SAP Continuous Threat Monitoring solution – the analytics rules, workbooks, and watchlists – to gain insight into your organization's SAP environment and to detect and respond to security threats.

## Deployment milestones

Follow your deployment journey through this series of articles, in which you'll learn how to navigate each of the following steps:

| Milestone | Article |
| --------- | ------- |
| **1. Deployment overview** | **YOU ARE HERE** |
| **2. Deployment prerequisites** | [Prerequisites for deploying SAP continuous threat monitoring](prerequisites-for-deploying-sap-continuous-threat-monitoring.md) |
| **3. Prepare SAP environment** | [Deploying SAP CRs and configuring authorization](preparing-sap.md) |
| **4. Deploy data connector agent** | [Deploy and configure the data connector agent container](deploy-data-connector-agent-container.md) |
| **5. Deploy SAP security content** | [Deploy SAP security content](deploy-sap-security-content.md)
| **6. Optional steps** | - [Configure auditing](configure-audit.md)<br>- [Configure SAP data connector to use SNC](configure-snc.md)

## Next steps

Begin the deployment of SAP continuous threat monitoring solution by reviewing the Prerequisites
> [!div class="nextstepaction"]
> [Prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
