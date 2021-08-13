---
title: Azure Monitor for SAP Solutions overview and architecture| Microsoft Docs
description: This article provides answers to frequently asked questions about Azure monitor for SAP solutions
author: rdeltcheva
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: article
ms.date: 07/06/2021
ms.author: radeltch

---

# Azure Monitor for SAP Solutions (preview)

## Overview

This article gives an overview of how Azure Monitor for SAP Solution works and its capabilities.

Azure Monitor for SAP Solutions is an Azure-native monitoring product for anyone running their SAP landscapes on Azure. The product works with both [SAP on Azure Virtual Machines](./hana-get-started.md) and [SAP on Azure Large Instances](./hana-overview-architecture.md).

With Azure Monitor for SAP Solutions, you can collect telemetry data from Azure infrastructure and databases in one central location and visually correlate telemetry data for faster troubleshooting.

Azure Monitor for SAP Solutions is offered through Azure Marketplace. It provides a simple, intuitive setup experience and takes only a few clicks to deploy the resource for Azure Monitor for SAP Solutions (known as **SAP monitor resource**).

You can monitor different components of an SAP landscape, such as Azure virtual machines (VMs), high-availability cluster, SAP HANA database, SAP NetWeaver, and so on, by adding the corresponding **provider** for that component.

Supported infrastructure:

- Azure virtual machine
- Azure Large Instance

Supported databases:
- SAP HANA Database
- Microsoft SQL server

Azure Monitor for SAP Solutions uses the power of existing [Azure Monitor](../../../azure-monitor/overview.md) capabilities such as Log Analytics and [Workbooks](../../../azure-monitor/visualize/workbooks-overview.md) to provide more monitoring capabilities. You can create [custom visualizations](../../../azure-monitor/visualize/workbooks-overview.md#getting-started) by editing the default Workbooks provided by Azure Monitor for SAP Solutions. Write [custom queries](../../../azure-monitor/logs/log-analytics-tutorial.md) and create [custom alerts](../../../azure-monitor/alerts/alerts-log.md) by using Azure Log Analytics workspace. Take advantage of [flexible retention period](../../../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period) and connect monitoring data with your ticketing system.

## What data does Azure Monitor for SAP Solutions collect?

Data collection in Azure Monitor for SAP Solutions depends on the providers that you configure. During Public Preview, the following data is being collected.

High-availability Pacemaker cluster telemetry:
- Node, resource, and STONITH block device (SBD) status
- Pacemaker location constraints
- Quorum votes and ring status
- [Others](https://github.com/ClusterLabs/ha_cluster_exporter/blob/master/doc/metrics.md)

SAP HANA telemetry:
- CPU, memory, disk, and network use
- HANA System Replication (HSR)
- HANA backup
- HANA host status
- Index server and Name server roles

Microsoft SQL server telemetry:
- CPU, memory, disk use
- Hostname, SQL instance name, SAP system ID
- Batch requests, compilations, and Page Life Expectancy over time
- Top 10 most expensive SQL statements over time
- Top 12 largest table in the SAP system
- Problems recorded in the SQL Server error log
- Blocking processes and SQL wait statistics over time

Operating system telemetry (Linux) 
- CPU use, fork's count, running and blocked processes 
- Memory use and distribution among used, cached, buffered 
- Swap use, paging, and swap rate 
- File systems usage, number of bytes read and written per block device 
- Read/write latency per block device 
- Ongoing I/O count, persistent memory read/write bytes 
- Network packets in/out, network bytes in/out 

SAP NetWeaver telemetry:

- SAP system and application server availability, including: instance process availability of dispatcher, ICM, gateway, message server, Enqueue Server, IGS Watchdog
- Work process usage statistics and trends
- Enqueue Lock statistics and trends
- Queue usage statistics and trends

## Data sharing with Microsoft

Azure Monitor for SAP Solutions collects system metadata to provide improved support for SAP on Azure. No PII/EUII is collected.

You can enable data sharing with Microsoft when you create Azure Monitor for SAP Solutions resource by choosing *Share* from the drop-down. We recommend that you enable data sharing. Data sharing gives Microsoft support and engineering teams information about your environment, which helps us provide better support for your mission-critical SAP on Azure solution.

## Architecture overview

The following diagram shows, at a high level, how Azure Monitor for SAP Solutions collects telemetry from SAP HANA database. The architecture is the same whether SAP HANA is deployed on Azure VMs or Azure Large Instances.

![Azure Monitor for SAP solutions architecture](https://user-images.githubusercontent.com/75772258/115046700-62ff3280-9ef5-11eb-8d0d-cfcda526aeeb.png)

The key components of the architecture are:
- Azure portal – your starting point. You can navigate to marketplace within Azure portal and discover Azure Monitor for SAP Solutions.
- Azure Monitor for SAP Solutions resource - a landing place for you to view monitoring telemetry.
- Managed resource group – deployed automatically as part of the Azure Monitor for SAP Solutions resource deployment. The resources deployed within managed resource group help in collection of telemetry. Key resources deployed and their purpose are:
   - Azure virtual machine: Also known as *collector VM*, it is a Standard_B2ms VM. The main purpose of this VM is to host the *monitoring payload*. Monitoring payload refers to the logic of collecting telemetry from the source systems and transferring the data to the monitoring framework. In the above diagram, the monitoring payload contains the logic to connect to SAP HANA database over SQL port.
   - [Azure Key Vault](../../../key-vault/general/basic-concepts.md): This resource is deployed to securely hold SAP HANA database credentials and to store information about [providers](./azure-monitor-providers.md).
   - Log Analytics Workspace: the destination where the telemetry data is stored.
      - Visualization is built on top of telemetry in Log Analytics using [Azure Workbooks](../../../azure-monitor/visualize/workbooks-overview.md). You can customize visualization. You can also pin your Workbooks or specific visualization within Workbooks to Azure dashboard for autorefresh. The maximum frequency for refresh is every 30 minutes.
      - You can use your existing workspace within the same subscription as SAP monitor resource by choosing this option at deployment.
      - You can use Kusto query language (KQL) to run [queries](../../../azure-monitor/logs/log-query-overview.md) against the raw tables inside Log Analytics workspace. Look at *Custom Logs*.

> [!Note]
> You are responsible for patching and maintaining the VM, deployed in the managed resource group.

> [!Tip]
> You can choose to use an existing Log Analytics workspace for telemetry collection, if it is deployed within the same Azure subscription as the resource for Azure Monitor for SAP Solutions.

### Architecture highlights

Here are the key highlights of the architecture:
 - **Multi-instance** - You can create monitor for multiple instances of a given component type (for example, HANA database, high availability (HA) cluster, Microsoft SQL server, SAP NetWeaver) across multiple SAP SIDs within a VNET with a single resource of Azure Monitor for SAP Solutions.
 - **Multi-provider** - The above architecture diagram shows the SAP HANA provider as an example. Similarly, you can configure more providers for corresponding components (for example, HANA DB, HA cluster, Microsoft SQL server, SAP NetWeaver) to collect data from those components.
 - **Open source** - The source code of Azure Monitor for SAP Solutions is available in [GitHub](https://github.com/Azure/AzureMonitorForSAPSolutions). You can refer to the provider code and learn more about the product, contribute, or share feedback.
 - **Extensible query framework** - SQL queries to collect telemetry data are written in [JSON](https://github.com/Azure/AzureMonitorForSAPSolutions/blob/master/sapmon/content/SapHana.json). More SQL queries to collect more telemetry data can be easily added. You can request specific telemetry data to be added to Azure Monitor for SAP Solutions by leaving feedback using the link at the end of this article. You can also leave feedback by contacting your account team.

## Pricing
Azure Monitor for SAP Solutions is a free product (no license fee). You're responsible for paying the cost of the underlying components in the managed resource group and consumption costs associated with data ingestion and data retention. Pleasee see standard Azure pricing documents for more information [Azure VM pricing] (https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/), [Azure Key vault pricing] (https://azure.microsoft.com/en-us/pricing/details/key-vault/), 
[Azure storage account pricing] (https://azure.microsoft.com/en-us/pricing/details/storage/queues/), [Azure Log Analytics and alerts pricing] (https://azure.microsoft.com/en-us/pricing/details/monitor/)

## Next steps

Learn more about Azure Monitor for SAP Solutions providers.

> [!div class="nextstepaction"]
> [Azure monitor for SAP solutions providers](azure-monitor-providers.md)
