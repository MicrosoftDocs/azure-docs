---
title: Designing your Azure Monitor Logs deployment | Microsoft Docs
description: This article describes the considerations and recommendations for customers preparing to deploy a workspace in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/20/2019

---

# Designing your Azure Monitor Logs deployment

Azure Monitor stores [log data](data-platform-logs.md) in a Log Analytics workspace, which is a container where data is collected and aggregated. While you can deploy one or more workspaces in your Azure subscription, there are several considerations you should understand in order to ensure your initial deployment is following our guidelines to provide you with a cost effective, manageable, and scalable deployment meeting your organization's needs.

A Log Analytics workspace defines:

* A geographic location for data storage.
* Data isolation by granting different users access rights following one of our recommended design strategies.
* Scope for configuration of settings such as [pricing tier](./manage-cost-storage.md#changing-pricing-tier), [retention](./manage-cost-storage.md#change-the-data-retention-period), and [data capping](./manage-cost-storage.md#manage-your-maximum-daily-data-volume).

Workspaces are hosted on physical Azure Data Explorer clusters, but these clusters are creating and managed by Azure Monitor. You do have the option of using a [dedicated cluster](logs-dedicated-clusters.md) 



## Considerations

Identifying the number of workspaces you need is influenced by one or more of the following requirements:

* You are a global company and you need log data stored in specific regions for data sovereignty or compliance reasons.
* You are using Azure and you want to avoid outbound data transfer charges by having a workspace in the same region as the Azure resources it manages.
* You manage multiple departments or business groups, and you want each to see their own data, but not data from others. Also, there is no business requirement for a consolidated cross department or business group view.

## Typical models
The following workspace deployment models have been commonly used to map to one of these organizational structures:


* **Centralized**: All logs are stored in a central workspace and administered by a single team, with Azure Monitor providing differentiated access per-team. In this scenario, it is easy to manage, search across resources, and cross-correlate logs. The workspace can grow significantly depending on the amount of data collected from multiple resources in your subscription, with additional administrative overhead to maintain access control to different users.
* **Decentralized**: Each team has their own workspace created in a resource group they own and manage, and log data is segregated per resource. In this scenario, the workspace can be kept secure and access control is consistent with resource access, but it's difficult to cross-correlate logs. Users who need a broad view of many resources cannot analyze the data in a meaningful way.
* **Hybrid**: Security audit compliance requirements further complicate this scenario because many organizations implement both deployment models in parallel. This commonly results in a complex, expensive, and hard-to-maintain configuration with gaps in logs coverage.

## Agent limitations

When using the Log Analytics agents to collect data, you need to understand the following in order to plan your agent deployment:

* To collect data from Windows agents, you can [configure each agent to report to one or more workspaces](./../agents/agent-windows.md), even while it is reporting to a System Center Operations Manager management group. The Windows agent can report up to four workspaces.
* The Linux agent does not support multi-homing and can only report to a single workspace.

If you are using System Center Operations Manager 2012 R2 or later:

* Each Operations Manager management group can be [connected to only one workspace](../agents/om-agents.md). 
* Linux computers reporting to a management group must be configured to report directly to a Log Analytics workspace. If your Linux computers are already reporting directly to a workspace and you want to monitor them with Operations Manager, follow these steps to [report to an Operations Manager management group](../agents/agent-manage.md#configure-agent-to-report-to-an-operations-manager-management-group). 
* You can install the Log Analytics Windows agent on the Windows computer and have it report to both Operations Manager integrated with a workspace, and a different workspace.


## Scale and ingestion volume rate limit
Azure Monitor is a high scale data service that serves thousands of customers sending petabytes of data each month at a growing pace. Workspaces are not limited in their storage space and can grow to petabytes of data. There is no need to split workspaces due to scale.

To protect and isolate Azure Monitor customers and its backend infrastructure, there is a default ingestion rate limit that is designed to protect from spikes and floods situations. The current rate limit default is about **6 GB/minute** and is designed to enable normal ingestion. For more details on ingestion volume limit measurement, see [Azure Monitor service limits](../service-limits.md#data-ingestion-volume-rate).

Customers that ingest less than 4TB/day will typically not meet these limits. Customers that ingest higher volumes or that have spikes as part of their normal operations should consider moving to [dedicated clusters](./logs-dedicated-clusters.md) where the ingestion rate limit can be raised.

When the ingestion rate limit is activated or reaches 80% of the threshold, an event is added to the *Operation* table in your workspace. It is recommended to monitor it and create an alert. See more details in [data ingestion volume rate](../service-limits.md#data-ingestion-volume-rate).


## Recommendations

![Resource-context design example](./media/design-logs-deployment/workspace-design-resource-context-01.png)


All resources, monitoring solutions, and Insights such as Application Insights and VM insights, supporting infrastructure and applications maintained by the different teams are configured to forward their collected log data to the IT organization's centralized shared workspace. Users on each team are granted access to logs for resources they have been given access to.


## Azure Policy
Once you have deployed your workspace architecture, you can enforce this on Azure resources with [Azure Policy](../../governance/policy/overview.md). It provides a way to define policies and ensure compliance with your Azure resources so they send all their resource logs to a particular workspace. For example, with Azure virtual machines or virtual machine scale sets, you can use existing policies that evaluate workspace compliance and report results, or customize to remediate if non-compliant.  

## Next steps

To implement the security permissions and controls recommended in this guide, review [manage access to logs](./manage-access.md).
