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

This article introduces you to the process of deploying the Microsoft Sentinel Continuous Threat Monitoring solution for SAP.  The full process is detailed in a whole set of articles linked under [Deployment milestones](#deployment-milestones) below.

> [!IMPORTANT]
> The Microsoft Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Overview

**Continuous Threat Monitoring for SAP** is a [Microsoft Sentinel solution](../sentinel-solutions.md) that you can use to monitor your SAP systems and detect sophisticated threats throughout the business logic and application layers. The solution includes the following components:
- The SAP data connector for data ingestion.
- Analytics rules and watchlists for threat detection.
- Workbooks for interactive data visualization. 

The SAP data connector is an agent, installed on a VM or a physical server, that collects application logs from across the entire SAP system landscape. It then sends those logs to your Log Analytics workspace in Microsoft Sentinel. You can then use the other content in the SAP Continuous Threat Monitoring solution – the analytics rules, workbooks, and watchlists – to gain insight into your organization's SAP environment and to detect and respond to security threats.

Unlike other solutions available in the Content Hub, in this case the data connector is deployed separately from the rest of the solution.

To ingest SAP logs into Microsoft Sentinel, the  SAP data connector needs to be installed and connected to your SAP environment. The connector is packaged as a Docker container. We recommend deploying the container onto an Azure virtual machine, although deployment to an on-premises physical or virtual machine is also supported.

After the SAP data connector is deployed, deploy the  SAP solution security content to gain insight into organization's SAP environment and improve any related security operation capabilities.

In this series of articles, you'll learn how to:


- Prepare your SAP system for the SAP data connector deployment.
- Deploy the SAP data connector.
- Deploy the SAP solution security content in Microsoft Sentinel.
- Configure auditing.
- Configure data connector to connect to SAP using SNC and X.509 certificate authentication.

> [!NOTE]
> Extra steps are required to configure communications between SAP data connector and SAP over a Secure Network Communications (SNC) connection. This is covered in [Deploy the Microsoft Sentinel SAP data connector with SNC](configure_snc.md) section of the guide.


## Deployment milestones
Deployment of the SAP continuous threat monitoring solution is divided into the following sections

1. **Deployment overview (*You are here*)**

1. [Prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Prepare SAP environment by deploying SAP CRs, configure Authorization and create user](preparing_sap.md)

1. [Deploy and configure the data connector agent container](deploy_data_connector_agent_container.md)

1. [Deploy SAP security content](deploy_sap_security_content.md)

1. Optional deployment steps
   - [Configure auditing](configure_audit.md)
   - [Configure SAP data connector to use SNC](configure_snc.md)

## Next steps

Begin the deployment of SAP continuous threat monitoring solution by reviewing the Prerequisites
> [!div class="nextstepaction"]
> [Prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
