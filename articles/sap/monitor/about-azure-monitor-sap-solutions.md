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

When you have critical SAP applications and business processes that rely on Azure resources, you might want to monitor those resources for availability, performance, and operation. Azure Monitor for SAP solutions is an Azure-native monitoring product for SAP landscapes that run on Azure. It uses specific parts of the [Azure Monitor](../../azure-monitor/overview.md) infrastructure. 

You can use Azure Monitor for SAP solutions with both [SAP on Azure virtual machines (VMs)](../../virtual-machines/workloads/sap/hana-get-started.md) and [SAP on Azure Large Instances](../../virtual-machines/workloads/sap/hana-overview-architecture.md).

## What can you monitor?

You can use Azure Monitor for SAP solutions to collect data from Azure infrastructure and databases in one central location. Then, you can visually correlate the data for faster troubleshooting.

To monitor components of an SAP landscape, add the corresponding [provider](providers.md). These components include Azure VMs, high-availability (HA) clusters, SAP HANA databases, and SAP NetWeaver. For more information, see [Quickstart: Deploy Azure Monitor for SAP solutions in Azure portal](quickstart-portal.md).

Azure Monitor for SAP solutions uses the [Azure Monitor](../../azure-monitor/overview.md) capabilities of [Log Analytics](../../azure-monitor/logs/log-analytics-overview.md) and [workbooks](../../azure-monitor/visualize/workbooks-overview.md). With it, you can:

- Create [custom visualizations](../../azure-monitor/visualize/workbooks-overview.md) by editing the default that Azure Monitor for SAP solutions provides.
- Write [custom queries](../../azure-monitor/logs/log-analytics-tutorial.md).
- Create [custom alerts](../../azure-monitor/alerts/alerts-log.md) by using Log Analytics workspaces.
- Take advantage of the [flexible retention period](../../azure-monitor/logs/data-retention-archive.md) in Azure Monitor Logs and Log Analytics.
- Connect monitoring data with your ticketing system.

## What data is collected?

Azure Monitor for SAP solutions doesn't collect Azure Monitor metrics or resource log data, like some other Azure resources do. Instead, it sends custom logs directly to the Azure Monitor Logs system. There, you can use the built-in features of Log Analytics.

Data collection in Azure Monitor for SAP solutions depends on the providers that you configure. The following data is collected for each provider.

### HA Pacemaker cluster data

- Node, resource, and SBD status
- Pacemaker location constraints
- Quorum votes and ring status

Also see the [metrics specification](https://github.com/ClusterLabs/ha_cluster_exporter/blob/master/doc/metrics.md) for `ha_cluster_exporter`.

### SAP HANA data

- CPU, memory, disk, and network use
- HANA system replication
- HANA backup
- HANA host status
- Index server and name server roles
- Database growth
- Top tables
- File system use

### Microsoft SQL Server data

- CPU, memory, and disk use
- Host name, SQL instance name, and SAP system ID
- Batch requests, compilations, and page life expectancy over time
- Top 10 most expensive SQL statements over time
- Top 12 largest tables in the SAP system
- Problems recorded in the SQL Server error log
- Blocking processes and SQL wait statistics over time

### OS (Linux) data

- CPU use, fork count, running processes, and blocked processes
- Memory use and distribution among used, cached, and buffered
- Swap use, paging, and swap rate
- File system usage, along with number of bytes read and written per block device
- Read/write latency per block device
- Ongoing I/O count and persistent memory read/write bytes
- Network packets in/out and network bytes in/out

### SAP NetWeaver data

- SAP system and application server availability, including instance process availability of:
  - Dispatcher
  - ICM
  - Gateway
  - Message server
  - Enqueue server
  - IGS Watchdog
- Work process usage statistics and trends
- Enqueue lock statistics and trends
- Queue usage statistics and trends
- SMON metrics (**/SDF/SMON**)
- SWNC workload, memory, transaction, user, and RFC usage (**St03n**)
- Short dumps (**ST22**)
- Object lock (**SM12**)
- Failed updates (**SM13**)
- System log analysis (**SM21**)
- Batch job statistics (**SM37**)
- Outbound queues (**SMQ1**)
- Inbound queues (**SMQ2**)
- Transactional RFC (**SM59**)
- STMS change transport system metrics (**STMS**)

### IBM Db2 data

- Database availability
- Number of connections, logical reads, and physical reads
- Waits and current locks
- Top 20 runtimes and executions

## What is the architecture?

The following diagram shows, at a high level, how Azure Monitor for SAP solutions collects data from the SAP HANA database. The architecture is the same if SAP HANA is deployed on Azure VMs or Azure Large Instances.

:::image type="complex" source="./media/about-azure-monitor-sap-solutions/azure-monitor-sap-architecture.png" lightbox="./media/about-azure-monitor-sap-solutions/azure-monitor-sap-architecture.png" alt-text="Diagram that shows the architecture of Azure Monitor for SAP solutions.":::
   Diagram of the Azure Monitor for SAP solutions architecture. The customer connects to the Azure Monitor for SAP solutions resource through the Azure portal. A managed resource group contains Log Analytics, Azure Functions, Azure Key Vault, and an Azure Storage account. The Azure function connects to the providers. Providers include SAP NetWeaver (ABAP and JAVA), SAP HANA, Microsoft SQL Server, IBM Db2, Pacemaker clusters, and Linux OS.
:::image-end:::

Important points about the architecture include:

- You can monitor multiple instances of a component type across multiple SAP systems (SIDs) within a virtual network by using a single resource of Azure Monitor for SAP solutions. For example, you can monitor multiple HANA databases, HA clusters, Microsoft SQL Server instances, and SAP NetWeaver systems of multiple SIDs.
- The architecture diagram shows the SAP HANA provider as an example. You can configure multiple providers for corresponding components to collect data from those components. Examples include HANA database, HA cluster, Microsoft SQL Server instance, and SAP NetWeaver.

The key components of the architecture are:

- The Azure portal, where you access Azure Monitor for SAP solutions.
- The Azure Monitor for SAP solutions resource, where you view monitoring data.
- The managed resource group, which is deployed automatically as part of the Azure Monitor for SAP solutions resource's deployment. Inside the managed resource group, resources like these help collect data:
  - An [Azure Functions resource](../../azure-functions/functions-overview.md) hosts the monitoring code. This logic collects data from the source systems and transfers the data to the monitoring framework.
  - An [Azure Key Vault resource](../../key-vault/general/basic-concepts.md) holds the SAP HANA database credentials and stores information about providers.
  - A [Log Analytics workspace](../../azure-monitor/logs/log-analytics-workspace-overview.md) is the destination for storing data. Optionally, you can choose to use an existing workspace in the same subscription as your Azure Monitor for SAP solutions resource at deployment.
  - A [storage account](../../storage/common/storage-account-overview.md) is associated with the Azure Functions resource. It's used to manage triggers and executions of logging functions.

[Azure Monitor workbooks](../../azure-monitor/visualize/workbooks-overview.md) provide customizable visualization of the data in Log Analytics. To automatically refresh your workbooks or visualizations, pin the items to the Azure dashboard. The maximum refresh frequency is every 30 minutes.

You can also use Kusto Query Language (KQL) to [run log queries](../../azure-monitor/logs/log-query-overview.md) against the raw tables inside the Log Analytics workspace.

## How do you analyze logs?

Azure Monitor for SAP solutions doesn't support resource logs or activity logs. For a list of the tables that Azure Monitor Logs uses for querying in Log Analytics, see [the data reference for monitoring SAP on Azure](data-reference.md#azure-monitor-logs-tables).

## How do you make Kusto queries?

When you select **Logs** from the **Azure Monitor for SAP solutions** menu, Log Analytics opens with the query scope set to the current instance of Azure Monitor for SAP solutions. Log queries include only data from that resource. To run a query that includes data from other accounts or data from other Azure services, select **Logs** from the **Azure Monitor** menu. For more information, see [Log query scope and time range in Azure Monitor Log Analytics](../../azure-monitor/logs/scope.md).

You can use Kusto queries to help you monitor your Azure Monitor for SAP solutions resources. The following sample query gives you data from a custom log for a specified time range. You can view the list of custom tables by expanding the **Custom Logs** section. You can specify the time range and the number of rows. In this example, you get five rows of data for your selected time range:

```kusto
Custom_log_table_name
| take 5
```

## How do you get alerts?

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. You can then identify and address problems in your system before your customers notice them.

You can configure alerts in Azure Monitor for SAP solutions from the Azure portal. For more information, see [Configure alerts in Azure Monitor for SAP solutions with the Azure portal](get-alerts-portal.md).

## How can you create Azure Monitor for SAP solutions resources?

You can deploy Azure Monitor for SAP solutions and configure providers by using [the Azure portal](quickstart-portal.md) or [Azure PowerShell](quickstart-powershell.md).

## What is the pricing?

Azure Monitor for SAP solutions is a free product. There's no license fee.

You're responsible for paying the cost of the underlying components in the managed resource group. You're also responsible for consumption costs associated with data use and retention. For more information, see:

- [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/#pricing)
- [Azure Key Vault pricing](https://azure.microsoft.com/pricing/details/key-vault/)
- [Azure storage account pricing](https://azure.microsoft.com/pricing/details/storage/queues/)
- [Azure Log Analytics and alerts pricing](https://azure.microsoft.com/pricing/details/monitor/)

## Next steps

- For a list of custom logs relevant to Azure Monitor for SAP solutions and information on related data types, see [Data reference for Azure Monitor for SAP solutions](data-reference.md).
- For information on providers available for Azure Monitor for SAP solutions, see [Azure Monitor for SAP solutions providers](providers.md).
