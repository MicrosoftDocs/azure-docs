---
title: What is Azure Monitor for SAP solutions?
description: Learn about how to monitor your SAP resources on Azure for availability, performance, and operation.
author: lauradolan
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: overview
ms.custom: subject-monitoring
ms.date: 10/27/2022
ms.author: ladolan
#Customer intent: As a developer, I want to learn how to monitor my SAP resources on Azure so that I can better understand their availability, performance, and operation.
---

# What is Azure Monitor for SAP solutions?


When you have critical SAP applications and business processes that rely on Azure resources, you might want to monitor those resources for availability, performance, and operation. *Azure Monitor for SAP solutions* is an Azure-native monitoring product for SAP landscapes that run on Azure. Azure Monitor for SAP solutions uses specific parts of the [Azure Monitor](../../azure-monitor/overview.md) infrastructure. You can use Azure Monitor for SAP solutions with both [SAP on Azure Virtual Machines (Azure VMs)](../../virtual-machines/workloads/sap/hana-get-started.md) and [SAP on Azure Large Instances](../../virtual-machines/workloads/sap/hana-overview-architecture.md).

## What can you monitor?

You can use Azure Monitor for SAP solutions to collect data from Azure infrastructure and databases in one central location. Then, you can visually correlate the data for faster troubleshooting.

To monitor different components of an SAP landscape (such as Azure VMs, high-availability clusters, SAP HANA databases, SAP NetWeaver, etc.), add the corresponding *[provider](providers.md)*. For more information, see [how to deploy Azure Monitor for SAP solutions through the Azure portal](quickstart-portal.md).


Azure Monitor for SAP solutions uses the [Azure Monitor](../../azure-monitor/overview.md) capabilities of [Log Analytics](../../azure-monitor/logs/log-analytics-overview.md) and [Workbooks](../../azure-monitor/visualize/workbooks-overview.md). With it, you can:

- Create [custom visualizations](../../azure-monitor/visualize/workbooks-overview.md) by editing the default workbooks provided by Azure Monitor for SAP solutions.
- Write [custom queries](../../azure-monitor/logs/log-analytics-tutorial.md).
- Create [custom alerts](../../azure-monitor/alerts/alerts-log.md) by using Azure Log Analytics workspace.
- Take advantage of the [flexible retention period](../../azure-monitor/logs/data-retention-archive.md) in Azure Monitor Logs/Log Analytics.
- Connect monitoring data with your ticketing system.

## What data is collected?

Azure Monitor for SAP solutions doesn't collect Azure Monitor metrics or resource log data, like some other Azure resources do. Instead, Azure Monitor for SAP solutions sends custom logs directly to the Azure Monitor Logs system. There, you can then use the built-in features of Log Analytics.

Data collection in Azure Monitor for SAP solutions depends on the providers that you configure. The following data is collected for each of the provider.

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

Some important points about the architecture include:

- The architecture is **multi-instance**. You can monitor multiple instances of a given component type across multiple SAP systems (SID) within a virtual network with a single resource of Azure Monitor for SAP solutions. For example, you can monitor multiple HANA databases, high availability (HA) clusters, Microsoft SQL servers, SAP NetWeaver systems of multiple SID's etc., as part of one AMS monitor.
- The architecture is **multi-provider**. The architecture diagram shows the SAP HANA provider as an example. Similarly, you can configure more providers for corresponding components to collect data from those components. For example multiple providers of different types like HANA DB, HA cluster, Microsoft SQL server, and SAP NetWeaver as part of one AMS monitor.

### Azure Monitor for SAP solutions architecture

The following diagram shows, at a high level, how Azure Monitor for SAP solutions collects data from the SAP HANA database. The architecture is the same if SAP HANA is deployed on Azure VMs or Azure Large Instances.

:::image type="complex" source="./media/about-azure-monitor-sap-solutions/azure-monitor-sap-architecture.png" lightbox="./media/about-azure-monitor-sap-solutions/azure-monitor-sap-architecture.png" alt-text="Diagram showing the new Azure Monitor for SAP solutions architecture.":::
   Diagram of the new Azure Monitor for SAP solutions architecture. The customer connects to the Azure Monitor for SAP solutions resource through the Azure portal. There's a managed resource group containing Log Analytics, Azure Functions, Key Vault, and Storage queue. The Azure function connects to the providers. Providers include SAP NetWeaver (ABAP and JAVA), SAP HANA, Microsoft SQL Server, IBM Db2, Pacemaker clusters, and Linux OS.
:::image-end:::

The key components of the architecture are:

- The **Azure portal**, where you access the Azure Monitor for SAP solutions service.
- The **Azure Monitor for SAP solutions resource**, where you view monitoring data.
- The **managed resource group**, which is deployed automatically as part of the Azure Monitor for SAP solutions resource's deployment. The resources inside the managed resource group help to collect data. Key resources include:
   - An **[Azure Functions resource](../../azure-functions/functions-overview.md)** that hosts the monitoring code. This logic collects data from the source systems and transfers the data to the monitoring framework.
   - An **[Azure Key Vault resource](../../key-vault/general/basic-concepts.md)**, which securely holds the SAP HANA database credentials and stores information about providers.
   - The **[Log Analytics workspace](../../azure-monitor/logs/log-analytics-workspace-overview.md)**, which is the destination for storing data. Optionally, you can choose to use an existing workspace in the same subscription as your Azure Monitor for SAP solutions resource at deployment.
   - The **[Storage account](../../storage/common/storage-account-overview.md)**, which is associated with Azure functions resource, it's used to manage triggers and logging function executions.

[Azure Workbooks](../../azure-monitor/visualize/workbooks-overview.md) provides customizable visualization of the data in Log Analytics. To automatically refresh your workbooks or visualizations, pin the items to the Azure dashboard. The maximum refresh frequency is every 30 minutes.

You can also use Kusto Query Language (KQL) to [run log queries](../../azure-monitor/logs/log-query-overview.md) against the raw tables inside the Log Analytics workspace.

## Analyze logs

Azure Monitor for SAP solutions doesn't support resource logs or activity logs. For a list of the tables used by Azure Monitor Logs that can be queried in Log Analytics, see [the data reference for monitoring SAP on Azure](data-reference.md#azure-monitor-logs-tables).

## Make Kusto queries

When you select **Logs** from the Azure Monitor for SAP solutions menu, Log Analytics is opened with the query scope set to the current Azure Monitor for SAP solutions. Log queries only include data from that resource. To run a query that includes data from other accounts or data from other Azure services, select **Logs** from the **Azure Monitor** menu. For more information, see [Log query scope and time range in Azure Monitor Log Analytics](../../azure-monitor/logs/scope.md) for details.

You can use Kusto queries to help you monitor your Azure Monitor for SAP solutions resources. The following sample query gives you data from a custom log for a specified time range. You can view the list of custom tables by expanding the Custom Logs section. You can specify the time range and the number of rows. In this example, you get five rows of data for your selected time range.

```kusto
Custom_log_table_name
| take 5
```

## How do you get alerts?

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. You can then identify and address issues in your system before your customers notice them.

You can configure alerts in Azure Monitor for SAP solutions from the Azure portal. For more information, see [how to configure alerts in Azure Monitor for SAP solutions with the Azure portal](get-alerts-portal.md).

### How can you create Azure Monitor for SAP solutions resources?

You have several options to deploy Azure Monitor for SAP solutions and configure providers:

- [Deploy Azure Monitor for SAP solutions directly from the Azure portal](quickstart-portal.md)
- [Deploy Azure Monitor for SAP solutions with Azure PowerShell](quickstart-powershell.md)
## What is the pricing?

Azure Monitor for SAP solutions is a free product (no license fee). You're responsible for paying the cost of the underlying components in the managed resource group. You're also responsible for consumption costs associated with data use and retention. For more information, see standard Azure pricing documents:

- [Azure Functions Pricing](https://azure.microsoft.com/pricing/details/functions/#pricing)

- [Azure Key vault pricing](https://azure.microsoft.com/pricing/details/key-vault/)
- [Azure storage account pricing](https://azure.microsoft.com/pricing/details/storage/queues/)
- [Azure Log Analytics and alerts pricing](https://azure.microsoft.com/pricing/details/monitor/)

## Next steps

- For a list of custom logs relevant to Azure Monitor for SAP solutions and information on related data types, see [Monitor SAP on Azure data reference](data-reference.md).
- For information on providers available for Azure Monitor for SAP solutions, see [Azure Monitor for SAP solutions providers](providers.md).
