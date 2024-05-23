---
title: Overview of Azure Monitor pipeline
description: Description of the Azure Monitor pipeline which provides data ingestion for Azure Monitor.
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: bwren
author: bwren
---

# Overview of Azure Monitor pipeline




 



## Data collection scenarios
The following table describes the data collection scenarios that are currently supported using the Azure Monitor pipeline. See the links in each entry for details.

| Scenario | Description |
| --- | --- |
| Virtual machines | Install the [Azure Monitor agent](../agents/agents-overview.md) on a VM and associate it with one or more DCRs that define the events and performance data to collect from the client operating system. You can perform this configuration using the Azure portal so you don't have to directly edit the DCR.<br><br>See [Collect events and performance counters from virtual machines with Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md). |
| | When you enable [VM insights](../vm/vminsights-overview.md) on a virtual machine, it deploys the Azure Monitor agent to telemetry from the VM client. The DCR is created for you automatically to collect a predefined set of performance data.<br><br>See [Enable VM Insights overview](../vm/vminsights-enable-overview.md). |
| Container insights | When you enable [Container insights](../containers/container-insights-overview.md) on your Kubernetes cluster, it deploys a containerized version of the Azure Monitor agent to send logs from the cluster to a Log Analytics workspace. The DCR is created for you automatically, but you may need to modify it to customize your collection settings.<br><br>See [Configure data collection in Container insights using data collection rule](../containers/container-insights-data-collection-dcr.md).  | 
| Log ingestion API | The [Logs ingestion API](../logs/logs-ingestion-api-overview.md) allows you to send data to a Log Analytics workspace from any REST client. The API call specifies the DCR to accept its data and specifies the DCR's endpoint. The DCR understands the structure of the incoming data, includes a transformation that ensures that the data is in the format of the target table, and specifies a workspace and table to send the transformed data.<br><br>See [Logs Ingestion API in Azure Monitor](../logs/logs-ingestion-api-overview.md). |
| Azure Event Hubs | Send data to a Log Analytics workspace from [Azure Event Hubs](../../event-hubs/event-hubs-about.md). The DCR defines the incoming stream and defines the transformation to format the data for its destination workspace and table.<br><br>See [Tutorial: Ingest events from Azure Event Hubs into Azure Monitor Logs (Public Preview)](../logs/ingest-logs-event-hub.md). |
| Workspace transformation DCR | The workspace transformation DCR is a special DCR that's associated with a Log Analytics workspace and allows you to perform transformations on data being collected using other methods. You create a single DCR for the workspace and add a transformation to one or more tables. The transformation is applied to any data sent to those tables through a method that doesn't use a DCR.<br><br>See [Workspace transformation DCR in Azure Monitor](./data-collection-transformations-workspace.md). |


## Next steps

- [Read more about data collection rules and the scenarios that use them](./data-collection-rule-overview.md).
- [Read more about transformations and how to create them](./data-collection-transformations.md).
- [Deploy an edge pipeline in your environment](./edge-pipeline-configure.md).

