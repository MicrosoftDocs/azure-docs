---
title: Azure Monitor workspace overview (preview)
description: Overview of Azure Monitor workspace, which is a unique environment for data collected by Azure Monitor.
author: EdB-MSFT
ms.author: edbaynash 
ms.reviewer: poojaa
ms.topic: conceptual
ms.date: 01/22/2023
---

# Azure Monitor workspace (preview)
An Azure Monitor workspace is a unique environment for data collected by Azure Monitor. Each workspace has its own data repository, configuration, and permissions.

> [!Note]
> Log Analytics workspaces contain logs and metrics data from multiple Azure resources, whereas Azure Monitor workspaces contain only metrics related to Prometheus.
  
## Contents of Azure Monitor workspace
Azure Monitor workspaces will eventually contain all metric data collected by Azure Monitor. Currently, only Prometheus metrics are data hosted in an Azure Monitor workspace.

## Azure Monitor workspace architecture 

While a single Azure Monitor workspace may be sufficient for many use cases using Azure Monitor, many organizations create multiple workspaces to better meet their needs. This article presents a set of criteria for deciding whether to use a single Azure Monitor workspace, multiple Azure Monitor workspaces, and the configuration and placement of those workspaces. 

### Design criteria 

As you identify the right criteria to create additional Azure Monitor workspaces, your design should use the lowest number of workspaces that will match your requirements, while optimizing for minimal administrative management overhead. 

The following table presents criteria to consider when designing an Azure Monitor workspace architecture.  

|Criteria|Description|
|---|---|
|Segregate by logical boundaries |Create separate Azure Monitor workspaces for operational data based on logical boundaries, for example, a role, application type, type of metric etc.|
|Azure tenants | For multiple Azure tenants, create an Azure Monitor workspace in each tenant. Data sources can only send monitoring data to an Azure Monitor workspace in the same Azure tenant. |
|Azure regions |Each Azure Monitor workspace resides in a particular Azure region. Regulatory or compliance requirements may dictate the storage of data in particular locations. |
|Data ownership |Create separate Azure Monitor workspaces to define data ownership, for example by subsidiaries or affiliated companies.| 

### Considerations when creating an Azure Monitor workspace 

* Azure Monitor workspaces are regional. When you create a new Azure Monitor workspace, you provide a region, setting the location in which the data is stored.  

* Start with a single workspace to reduce the complexity of managing and querying data from multiple Azure resources.

* The default Azure Monitor workspace limit is 1 million active times series and 1 million events per minute ingested. 

* There's no reduction in performance due to the amount of data in your Azure Monitor workspace. Multiple services can send data to the same account simultaneously. There is, however, a limit on how large an Azure Monitor workspace can scale as explained below.

### Growing account capacity  

Azure Monitor workspaces have default quotas and limitations for metrics. As your product grows and you need more metrics, you can request an increase to 50 million events or active time series. If your capacity needs grow exceptionally large, and your data ingestion needs can no longer be met by a single Azure Monitor workspace, consider creating multiple Azure Monitor workspaces. 

### Multiple Azure Monitor workspaces  

When an Azure Monitor workspace reaches 80% of its maximum capacity, or depending on your current and forecasted metrics volume, it's recommended to split the Azure Monitor workspace into multiple workspaces. Split the workspace based on how the data in the workspace is used by your applications and business processes, and how you want to access that data in the future.  
  
In certain circumstances, splitting Azure Monitor workspace into multiple workspaces can be necessary. For example: 
* Monitoring data in sovereign clouds – Create Azure Monitor workspace(s) in each sovereign cloud.  
* Compliance or regulatory requirements that mandate storage of data in specific regions – Create an Azure Monitor workspace per region as per requirements. There may be a need to manage the scale of metrics for large services or financial institutions with regional accounts. 
* Separating metric data in test, pre-production, and production environments 

>[!Note] 
> A single query cannot access multiple Azure Monitor workspaces. Keep data that you want to retrieve in a single query in same workspace. For presentation purposes, setting up Grafana with each workspace as a dedicated data source will allow for querying multiple workspaces in a single Grafana panel. 


## Limitations
See [Azure Monitor service limits](../service-limits.md#prometheus-metrics) for performance related service limits for Azure Monitor managed service for Prometheus.
- Private Links aren't supported for Prometheus metrics collection into Azure monitor workspace.
- Azure monitor workspaces are currently only supported in public clouds.
- Azure monitor workspaces don't currently support being moved into a different subscription or resource group once created.


## Next steps

- Learn more about the [Azure Monitor data platform](../data-platform.md).
- [Manage an Azure Monitor workspace (preview)](./azure-monitor-workspace-manage.md)
