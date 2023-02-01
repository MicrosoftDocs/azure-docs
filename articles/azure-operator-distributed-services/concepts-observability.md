---
title: "Azure Operator Distributed Services: observability using Azure Monitor"
description: AODS uses Azure Monitor and collects and aggregates data in Azure Log Analytics Workspace. The analysis, visualization, and alerting is performed on this collected data.
author: mukesh-dua #Required; your GitHub user alias, with correct capitalization.
ms.author: mukeshdua #Required; microsoft alias of author; optional team alias.
ms.service: Azure Operator Distributed Services #Required

ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 01/31/2023 #Required; mm/dd/yyyy format.
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Azure Operator Distributed Services observability

This article helps you understand AODS observability using Azure Monitor. AODS consists of a stack of components. Azure Monitor collects and aggregates logging data from the AODS components into a common Azure Log Analytics Workspace. Log data from multiple Azure subscriptions and tenants can also be collected and aggregated. Analysis, visualization, and alerting is performed on the aggregated log data. The AODS observability framework supports logging, monitoring and alerting (LMA).

:::image type="content" source="media/AODS-LMA-Framework.png" alt-text="AODS Logging, Monitoring and Alerting (LMA) Framework":::
Figure: AODS Logging, Monitoring and Alerting (LMA) Framework

The key highlights of the AODS observability are:

* Centralized data collection: AODS observability solution is based on collection of all the data in a central place. You can observe the monitoring data from all of your AODS instances here.
* Well-defined and tested tooling: The solution relies on Azure Monitor that collects, analyzes, and acts on telemetry data from your cloud and on-premises instances.
* Easy to learn and use: The solution makes it easy for you to analyze and debug problems with the ability to search the data from within or across all of your cloud and on-premises instances.
* Visualization tools: You create customized dashboards and workbooks per your needs.
* Integrated Alert tooling: You create alerts based on custom thresholds. You can create and reuse alert templates across all of your instances.

## Platform Monitoring

You need visibility into the performance of your AODS deployments. Your AODS instance consists of [infrastructure resources](./concepts-resource-types.md#platform-components). You need the logs and metrics to be collected and analyzed from these platform resources. You gain valuable insights from the collation and aggregation of  data from all of the resources. You also gain automated insights into this data.

These logs and metrics are used to observe the state of the platform. You can see the performance and analyze what's wrong. You can analyze what caused the situation. You can configure what alerts are generated and under what conditions. For example, you can configure the alerts to be generated when resources are behaving abnormally, or when thresholds have been reached. You can use the collected logs and analytics to debug any problems in the environment.

### Monitoring Data

AODS observability allows you to collect the same kind of data as other Azure
resources as described in
 [monitor Azure resource](../azure-monitor/essentials/monitor-azure-resource.md#monitoring-data).

You can view the detailed information on the metrics collected from each AODS instance in the [AODS observability data reference]()

### Collection and Routing

AODS observability allows you to collect data for each infrastructure resource.
The set of infrastructure components includes:

* Network Fabric that includes CEs, TORs, NPBs, management switches, and the terminal server.
* Compute that includes Bare Metal Servers.
* Undercloud Control Plane (Kubernetes cluster responsible for deployment and managing lifecycle of overall Platform).

Collection of log data from these layers is enabled by default during AODS
instance creation. These collected logs are routed to your Azure Monitor Log
Analytics Workspace.

You can also collect data from the tenant layers
created for running Containerized and Virtualized Network Functions. The log data that can be collected includes:

* Collection of syslog from Virtual Machines (used for either VNFs or CNF workloads).
* Collection of logs from AKS-Hybrid clusters and the applications deployed on top.

You'll need to enable the collection of the logs from the tenant AKS-Hybrid clusters and Virtual Machines.
You should follow the steps to deploy the [Azure monitoring agents](../azure-monitor/agents/agents-overview.md#install-the-agent-and-configure-data-collection). The data would be collected in your Azure Log
Analytics Workspace.

### Analyzing Logs

Data in Azure Monitor Logs is stored in tables where each table has its own set
of unique properties.

All resource logs in Azure Monitor have the same fields followed by service-specific fields; see the [common schema](../azure-monitor/essentials/resource-logs-schema.md#top-level-common-schema).

The logs from AODS platform are stored in the following tables:

| Table                  | Description                                                                      |
| ---------------------- | -------------------------------------------------------------------------------- |
| Syslog                 | Syslog events on Linux computers using the Log Analytics agent                   |
| ContainerInventory     | Details and current state of each container.                                     |
| ContainerLog           | Log lines collected from stdout and stderr streams for containers                |
| ContainerNodeInventory | Details of nodes that serve as container hosts.                                  |
| InsightMetrics         | Metrics collected from Server, K8s, Containers.                                  |
| KubeEvents             | Kubernetes events and their properties.                                          |
| KubeMonAgentEvents     | Events logged by Azure Monitor Kubernetes agent for errors and warnings.         |
| KubeNodeInventory      | Details for nodes that are part of Kubernetes cluster                            |
| KubePodInventory       | Kubernetes pods and their properties                                             |
| KubePVInventory        | Kubernetes persistent volumes and their properties.                              |
| KubeServices           | Kubernetes services and their properties                                         |
| Heartbeat              | Records logged by Log Analytics agents once per minute to report on agent health |

To view these tables, navigate to Log Analytics Workspace configured at the time of AODS instance creation and select *'Logs'* on left navigation panel.

More information about the schema for these tables can be found at <https://github.com/azure/azure-monitor/reference/tables/tables-resourcetype.md#azure-arc-enabled-kubernetes>.

To perform log analytics, there are multiple options. Each starts with a different scope. For access to all data in workspace, on Monitoring Menu, select logs. To limit to a single Undercloud cluster, select scope to Resource Type set as 'Kubernetes – Azure Arc' and select the Cluster resource under Hosted Resource Group associated to your cluster.

:::image type="content" source="media/AODS_Logs_Option_A.png" alt-text="Logs Option A.":::
Figure: Logs Option A

Another option is to select the Log Analytics Workspace used with AODS instance creation.

:::image type="content" source="media/AODS_Logs_Option_B.png" alt-text="Logs Option B.":::
Figure: Logs Option B

There's yet another option to directly select the Log Analytics Workspace that was provided during AODS instance creation. Go to that Log Analytics Workspace and select 'Logs' on the left navigation pane.

:::image type="content" source="media/AODS_Logs_Option_C.png" alt-text="Logs Option C.":::
Figure: Logs Option C

You can run log analytic queries on data collected in the Log Analytics Workspace as shown in these [sample queries](../azure-monitor/containers/container-insights-log-query.md).

#### Analyzing Metrics

The 'InsightMetrics' table in the Logs section contains the metrics collected from bare metal machines and the undercloud Kubernetes cluster. In addition, a few selected metrics collected from the undercloud can be observed by opening the Metrics tab from the Azure Monitor menu.

:::image type="content" source="media/AODS_Azure_Monitor_Metrics_Selection.png" alt-text="Azure Monitor Metrics Selection.":::
Figure: Azure Monitor Metrics Selection

See **[Getting Started with Azure Metrics Explorer](../azure-monitor/essentials/metrics-getting-started.md)** for details on using this tool.

#### Workbooks

You can use the sample Azure Resource Manager workbook templates for [AODS Logging, and Monitoring](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Operator%20Distributed%20Services) to deploy Azure Workbooks within your Azure Log Analytics Workspace.

#### Alerts

You can use the sample Azure Resource Manager alarm templates for [AODS alerting rules](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Operator%20Distributed%20Services#alert-rules). You should specify thresholds and conditions for the alerts. You can then deploy these alert templates on your on-premises environment.

## Log Analytic Workspace

A [Log Analytics Workspace (LAW)](../azure-monitor/logs/log-analytics-workspace-overview.md)
is a unique environment to log data from Azure Monitor and
other Azure services. Each workspace has its own data repository and configuration but may
combine data from multiple services. Each workspace consists of multiple data tables.

A single Log Analytics Workspace can be created to collect all relevant data or multiple Log
Analytics Workspaces based on operator requirements.

## Logging and Metrics Collection (TBD)

### CNF Logging and Metrics Collection

### VNF Logging and Metrics Collection
