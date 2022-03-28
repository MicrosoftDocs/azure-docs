---
title: Deploy Continuous Threat Monitoring for SAP | Microsoft Docs
description: Learn how to deploy the Microsoft Sentinel solution for SAP environments.
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 02/01/2022
---

# Deploy Continuous Threat Monitoring for SAP

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
| **2. Prerequisites** | [Prerequisites for deploying SAP continuous threat monitoring](prerequisites-for-deploying-sap-continuous-threat-monitoring.md) |
| **3. Prepare SAP environment** | [Deploying SAP CRs and configuring authorization](preparing_sap.md) |
| **4. Deploy data connector agent** | [Deploy and configure the data connector agent container](deploy_data_connector_agent_container.md) |
| **5. Deploy SAP security content** | [Deploy SAP security content](deploy_sap_security_content.md)
| **6. Optional steps** | <li>[Configure auditing](configure_audit.md).<li>[Configure SAP data connector to use SNC](configure_snc.md)

> [!NOTE]
> Extra steps are required to configure communications between SAP data connector and SAP over a Secure Network Communications (SNC) connection. This is covered in [Deploy the Microsoft Sentinel SAP data connector with SNC](configure_snc.md) section of the guide.

## Next steps

Begin the deployment of SAP continuous threat monitoring solution by reviewing the Prerequisites
> [!div class="nextstepaction"]
> [Prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
