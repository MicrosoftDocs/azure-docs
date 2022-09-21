---
title: What is Azure Monitor for SAP solutions? (preview)
description: Learn about how to monitor your SAP resources on Azure for availability, performance, and operation.
author: lauradolan
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: overview
ms.custom: subject-monitoring
ms.date: 07/28/2022
ms.author: ladolan
#Customer intent: As a developer, I want to learn how to monitor my SAP resources on Azure so that I can better understand their availability, performance, and operation.
---

# What is Azure Monitor for SAP solutions? (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

When you have critical SAP applications and business processes that rely on Azure resources, you might want to monitor those resources for availability, performance, and operation. *Azure Monitor for SAP solutions (AMS)* is an Azure-native monitoring product for SAP landscapes that run on Azure. AMS uses specific parts of the [Azure Monitor](../../../azure-monitor/overview.md) infrastructure. You can use AMS with both [SAP on Azure Virtual Machines (Azure VMs)](./hana-get-started.md) and [SAP on Azure Large Instances](./hana-overview-architecture.md). 

There are currently two versions of this product, *AMS* and *AMS (classic)*.

## What can you monitor?

You can use AMS to collect data from Azure infrastructure and databases in one central location. Then, you can visually correlate the data for faster troubleshooting.

To monitor different components of an SAP landscape (such as Azure VMs, high-availability clusters, SAP HANA databases, SAP NetWeaver, etc.), add the corresponding *[provider](./azure-monitor-providers.md)*. For more information, see [how to deploy AMS through the Azure portal](azure-monitor-sap-quickstart.md).

The following table provides a quick comparison of the AMS (classic) and AMS. 

| AMS | AMS (classic) |
| ------------------------------- | ----------------------------------------- |
| Azure Functions-based collector architecture | VM-based collector architecture |
| Support for Microsoft SQL Server, SAP HANA, and IBM Db2 databases | Support for Microsoft SQL Server, and SAP HANA databases |

AMS uses the [Azure Monitor](../../../azure-monitor/overview.md) capabilities of [Log Analytics](../../../azure-monitor/logs/log-analytics-overview.md) and [Workbooks](../../../azure-monitor/visualize/workbooks-overview.md). With it, you can:

- Create [custom visualizations](../../../azure-monitor/visualize/workbooks-overview.md) by editing the default workbooks provided by AMS. 
- Write [custom queries](../../../azure-monitor/logs/log-analytics-tutorial.md).
- Create [custom alerts](../../../azure-monitor/alerts/alerts-log.md) by using Azure Log Analytics workspace. 
- Take advantage of the [flexible retention period](../../../azure-monitor/logs/data-retention-archive.md) in Azure Monitor Logs/Log Analytics. 
- Connect monitoring data with your ticketing system.

## What data is collected?

AMS doesn't collect Azure Monitor metrics or resource log data, like some other Azure resources do. Instead, AMS sends custom logs directly to the Azure Monitor Logs system. There, you can then use the built-in features of Log Analytics.

Data collection in AMS depends on the providers that you configure. During public preview, the following data is collected.

### Pacemaker cluster data

High availability (HA) Pacemaker cluster data includes:

- Node, resource, and SBD status
- Pacemaker location constraints
- Quorum votes and ring status

Also see the [metrics specification](https://github.com/ClusterLabs/ha_cluster_exporter/blob/master/doc/metrics.md) for `ha_cluster_exporter`.

### SAP HANA data

SAP HANA data includes:

- CPU, memory, disk, and network use
- HANA system replication (HSR)
- HANA backup
- HANA host status
- Index server and name server roles
- Database growth
- Top tables
- File system use

### Microsoft SQL Server data

Microsoft SQL server data includes: 

- CPU, memory, disk use
- Hostname, SQL instance name, SAP system ID
- Batch requests, compilations, and Page Life Expectancy over time
- Top 10 most expensive SQL statements over time
- Top 12 largest table in the SAP system
- Problems recorded in the SQL Server error log
- Blocking processes and SQL wait statistics over time

### OS (Linux) data 

OS (Linux) data  includes: 

- CPU use, fork's count, running and blocked processes 
- Memory use and distribution among used, cached, buffered 
- Swap use, paging, and swap rate 
- File systems usage, number of bytes read and written per block device 
- Read/write latency per block device 
- Ongoing I/O count, persistent memory read/write bytes 
- Network packets in/out, network bytes in/out 

### SAP NetWeaver data

SAP NetWeaver data includes:

- SAP system and application server availability, including instance process availability of:
    - Dispatcher
    - ICM
    - Gateway
    - Message server
    - Enqueue Server
    - IGS Watchdog
- Work process usage statistics and trends
- Enqueue lock statistics and trends
- Queue usage statistics and trends
- SMON metrics (**/SDF/SMON**)
- SWNC workload, memory, transaction, user, RFC usage (**St03n**)
- Short dumps (**ST22**)
- Object lock (**SM12**)
- Failed updates (**SM13**)
- System logs analysis (**SM21**)
- Batch jobs statistics (**SM37**)
- Outbound queues (**SMQ1**)
- Inbound queues (**SMQ2**)
- Transactional RFC (**SM59**)
- STMS change transport system metrics (**STMS**)

### IBM Db2 data

IBM Db2 data includes:

- DB availability
- Number of connections, logical and physical reads
- Waits and current locks
- Top 20 runtime and executions

## What is the architecture?

There are separate explanations for the [AMS architecture](#ams-architecture) and the [AMS (classic) architecture](#ams-classic-architecture).

Some important points about the architecture include: 

- The architecture is **multi-instance**. You can monitor multiple instances of a given component type across multiple SAP systems (SID) within a virtual network with a single resource of AMS. For example, you can monitor HANA databases, high availability (HA) clusters, Microsoft SQL server, SAP NetWeaver, etc.
- The architecture is **multi-provider**. The architecture diagram shows the SAP HANA provider as an example. Similarly, you can configure more providers for corresponding components to collect data from those components. For example, HANA DB, HA cluster, Microsoft SQL server, and SAP NetWeaver. 
- The architecture has an **extensible query framework**. Write [SQL queries to collect data in JSON](https://github.com/Azure/AzureMonitorForSAPSolutions/blob/master/sapmon/content/SapHana.json). Easily add more SQL queries to collect other data. 


### AMS architecture 

The following diagram shows, at a high level, how AMS collects data from the SAP HANA database. The architecture is the same if SAP HANA is deployed on Azure VMs or Azure Large Instances.

:::image type="complex" source="./media/azure-monitor-sap/azure-monitor-sap-architecture.png" alt-text="Diagram showing the new AMS architecture.":::
   Diagram of the new AMS architecture. The customer connects to the AMS resource through the Azure portal. There's a managed resource group containing Log Analytics, Azure Functions, Key Vault, and Storage queue. The Azure function connects to the providers. Providers include SAP NetWeaver (ABAP and JAVA), SAP HANA, Microsoft SQL Server, IBM Db2, Pacemaker clusters, and Linux OS.
:::image-end:::

The key components of the architecture are:

- The **Azure portal**, where you access the AMS service.
- The **AMS resource**, where you view monitoring data.
- The **managed resource group**, which is deployed automatically as part of the AMS resource's deployment. The resources inside the managed resource group help to collect data. Key resources include:
   - An **Azure Functions resource** that hosts the monitoring code. This logic collects data from the source systems and transfers the data to the monitoring framework. 
   - An **[Azure Key Vault resource](../../../key-vault/general/basic-concepts.md)**, which securely holds the SAP HANA database credentials and stores information about providers.
   - The **Log Analytics workspace**, which is the destination for storing data. Optionally, you can choose to use an existing workspace in the same subscription as your AMS resource at deployment.
   
[Azure Workbooks](../../../azure-monitor/visualize/workbooks-overview.md) provides customizable visualization of the data in Log Analytics. To automatically refresh your workbooks or visualizations, pin the items to the Azure dashboard. The maximum refresh frequency is every 30 minutes.
   
You can also use Kusto Query Language (KQL) to [run log queries](../../../azure-monitor/logs/log-query-overview.md) against the raw tables inside the Log Analytics workspace. 

### AMS (classic) architecture

The following diagram shows, at a high level, how AMS (classic) collects data from the SAP HANA database. The architecture is the same if SAP HANA is deployed on Azure VMs or Azure Large Instances.

:::image type="complex" source="./media/azure-monitor-sap/azure-monitor-sap-classic-architecture.png" alt-text="Diagram showing the AMS classic architecture.":::
   Diagram of the AMS (classic) architecture. The customer connects to the AMS resource through the Azure portal. There's a managed resource group containing Log Analytics, Azure Functions, Key Vault, and Storage queue. The Azure function connects to the providers. Providers include SAP NetWeaver (ABAP and JAVA), SAP HANA, Microsoft SQL Server, Pacemaker clusters, and Linux OS.
:::image-end:::

The key components of the architecture are:

- The **Azure portal**, which is your starting point. You can navigate to marketplace within the Azure portal and discover AMS.
- The **AMS resource**, which is the landing place for you to view monitoring data.
- **Managed resource group**, which is deployed automatically as part of the AMS resource's deployment. The resources deployed within the managed resource group help with the collection of data. Key resources deployed and their purposes are:
   - **Azure VM**, also known as the *collector VM*, which is a **Standard_B2ms** VM. The main purpose of this VM is to host the *monitoring payload*. The monitoring payload is the logic of collecting data from the source systems and transferring the data to the monitoring framework. In the architecture diagram, the monitoring payload contains the logic to connect to the SAP HANA database over the SQL port. You're responsible for patching and maintaining the VM.
   - **[Azure Key Vault](../../../key-vault/general/basic-concepts.md)**: which is deployed to securely hold SAP HANA database credentials and to store information about providers.
   - **Log Analytics Workspace**, which is the destination where the data is stored.
      - Visualization is built on top of data in Log Analytics using [Azure Workbooks](../../../azure-monitor/visualize/workbooks-overview.md). You can customize visualization. You can also pin your Workbooks or specific visualization within Workbooks to Azure dashboard for auto-refresh. The maximum frequency for refresh is every 30 minutes.
      - You can use your existing workspace within the same subscription as SAP monitor resource by choosing this option at deployment.
      - You can use KQL to run [queries](../../../azure-monitor/logs/log-query-overview.md) against the raw tables inside the Log Analytics workspace. Look at **Custom Logs**.
      - You can use an existing Log Analytics workspace for data collection if it's deployed within the same Azure subscription as the resource for AMS.

## Can you analyze metrics?

AMS doesn't support metrics. 

### Analyze logs

AMS doesn't support resource logs or activity logs. For a list of the tables used by Azure Monitor Logs that can be queried by Log Analytics, see [the data reference for monitoring SAP on Azure](monitor-sap-on-azure-reference.md#azure-monitor-logs-tables). 

### Make Kusto queries

When you select **Logs** from the AMS menu, Log Analytics is opened with the query scope set to the current AMS. Log queries only include data from that resource. To run a query that includes data from other accounts or data from other Azure services, select **Logs** from the **Azure Monitor** menu. For more information, see [Log query scope and time range in Azure Monitor Log Analytics](../../../azure-monitor/logs/scope.md) for details.

You can use Kusto queries to help you monitor your AMS resources. The following sample query gives you data from a custom log for a specified time range. You can specify the time range and the number of rows. In this example, you'll get five rows of data for your selected time range. 

```kusto
custom log name 
| take 5
```

## How do you get alerts?

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. You can then identify and address issues in your system before your customers notice them.

You can configure alerts in AMS from the Azure portal. For more information, see [how to configure alerts in AMS with the Azure portal](azure-monitor-alerts-portal.md).

### How can you create AMS resources?

You have several options to deploy AMS and configure providers:

- [Deploy AMS directly from the Azure portal](azure-monitor-sap-quickstart.md)
- [Deploy AMS with Azure PowerShell](azure-monitor-sap-quickstart-powershell.md)
- [Deploy AMS (classic) using the Azure Command-Line Interface (Azure CLI)](https://github.com/Azure/azure-hanaonazure-cli-extension#sapmonitor).

## What is the pricing?

AMS is a free product (no license fee). You're responsible for paying the cost of the underlying components in the managed resource group. You're also responsible for consumption costs associated with data use and retention. For more information, see standard Azure pricing documents:

- [Azure Functions Pricing](https://azure.microsoft.com/pricing/details/functions/#pricing)
- [Azure VM pricing (applicable to AMS (classic))](https://azure.microsoft.com/pricing/details/virtual-machines/linux/)
- [Azure Key vault pricing](https://azure.microsoft.com/pricing/details/key-vault/)
- [Azure storage account pricing](https://azure.microsoft.com/pricing/details/storage/queues/)
- [Azure Log Analytics and alerts pricing](https://azure.microsoft.com/pricing/details/monitor/)

## How do you enable data sharing with Microsoft?

> [!NOTE]
> The following content only applies to the AMS (classic) version.

AMS collects system metadata to provide improved support for SAP on Azure. No PII/EUII is collected.

You can enable data sharing with Microsoft when you create AMS resource by choosing *Share* from the drop-down. We recommend that you enable data sharing. Data sharing gives Microsoft support and engineering teams information about your environment, which helps us provide better support for your mission-critical SAP on Azure solution.

## Next steps

- For a list of custom logs relevant to AMS and information on related data types, see [Monitor SAP on Azure data reference](monitor-sap-on-azure-reference.md).
- For information on providers available for AMS, see [AMS providers](azure-monitor-providers.md).
