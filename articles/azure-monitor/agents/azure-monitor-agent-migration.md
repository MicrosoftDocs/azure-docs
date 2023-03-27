---
title: Migrate from legacy agents to Azure Monitor Agent
description: This article provides guidance for migrating from the existing legacy agents to the new Azure Monitor Agent (AMA) and data collection rules (DCRs).
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: shseth
ms.date: 2/22/2023 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
# Customer intent: As an IT manager, I want to understand how I should move from using legacy agents to Azure Monitor Agent.
---

# Migrate to Azure Monitor Agent from Log Analytics agent

[Azure Monitor Agent (AMA)](./agents-overview.md) replaces the Log Analytics agent (also known as MMA and OMS) for Windows and Linux machines, in Azure and non-Azure (on-premises and third-party clouds) environments. It introduces a simplified, flexible method of configuring data collection using [data collection rules (DCRs)](../essentials/data-collection-rule-overview.md). This article outlines the benefits of migrating to Azure Monitor Agent and provides guidance on how to implement a successful migration.

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **August 31, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you're currently using the Log Analytics agent with Azure Monitor or other supported features and services, we recommend you start planning your migration to Azure Monitor Agent by using the information in this article.

## Benefits

In addition to consolidating and improving upon legacy Log Analytics agents, Azure Monitor Agent provides [a variety of immediate benefits](./azure-monitor-agent-overview.md#benefits), including **cost savings, a simplified management experience, and enhanced security and performance.**


## Migration guidance

### Before you begin

1. Make sure you meet the [prerequisites](./azure-monitor-agent-manage.md#prerequisites) for installing Azure Monitor Agent, including permissions, authentication, and networking requirements. 

    To monitor non-Azure and on-premises servers, you must [install the Azure Arc agent](../../azure-arc/servers/agent-overview.md). You won't incur an additional cost for installing the Azure Arc agent and you don't necessarily need to use Azure Arc to manage your non-Azure virtual machines. 

1. Understand your current needs.

    Use the **Workspace overview** tab of the [AMA Migration Helper](./azure-monitor-agent-migration-tools.md#using-ama-migration-helper) to discover solutions enabled on your Log Analytics workspaces that use legacy agents, including per-solution migration recommendations<sup>1</sup>. 

1. Ensure that Azure Monitor Agent can address all of your needs.

    Check the [Azure Monitor Agent supported services and features](../agents/agents-overview.md#supported-services-and-features).

    If you use Microsoft Sentinel, see [Gap analysis for Microsoft Sentinel](../../sentinel/ama-migrate.md#gap-analysis-between-agents) for a comparison of the extra data collected by Microsoft Sentinel.  

1. Consider installing Azure Monitor Agent together with a legacy agent for a transition period.

    You can **run Azure Monitor Agent alongside the legacy Log Analytics agent on the same machine** to continue using existing functionality during evaluation or migration.

    If you're setting up a new environment with resources, such as deployment scripts and onboarding templates, install Azure Monitor Agent together with a legacy agent in your new environment to decrease the migration effort later.
    
    **Limitations:**

    - Be careful when you collect duplicate data from the same machine, as this could skew query results, affect downstream features like alerts, dashboards, and workbooks, and generate more charges for data ingestion and retention. To avoid data duplication, ensure the agents are *collecting data from different machines* or *sending the data to different destinations*.
    
        - For Defender for Cloud, [you'll be billed once per machine](../../defender-for-cloud/auto-deploy-azure-monitoring-agent.md#impact-of-running-with-both-the-log-analytics-and-azure-monitor-agents) when you rung both agents side by side. 
        - For Sentinel, you can easily [disable the legacy connector](../../sentinel/ama-migrate.md#recommended-migration-plan) to stop ingestion of logs from legacy agents.    
    - Running two agents on the same machine consumes double the resources, including but not limited to CPU, memory, storage space, and network bandwidth.

<sup>1</sup> Start testing your scenarios during the preview phase. This will save time, avoid surprises later, and ensure you're ready to deploy to production as soon as the service becomes generally available. You also benefit from added security and reduced costs immediately.  

### Migration steps
![Flow diagram that shows the steps involved in agent migration and how the migration tools help in generating DCRs and tracking the entire migration process.](media/azure-monitor-agent-migration/mma-to-ama-migration-steps.png)  

1. **[Create data collection rules](./data-collection-rule-azure-monitor-agent.md#create-a-data-collection-rule)**. You can use the [DCR generator](./azure-monitor-agent-migration-tools.md#installing-and-using-dcr-config-generator)<sup>1</sup> to **convert your legacy agent configuration into data collection rule templates automatically**. Review the generated rules before you create them, to leverage benefits like [filtering](../essentials/data-collection-transformations.md), granular targeting (per machine), and other optimizations.  

1. Deploy agent extensions and DCR associations: 
    1. **Test first** by deploying agent extensions<sup>2</sup> and DCR associations on a few non-production machines. As explained in [Before you begin](#before-you-begin), you can also deploy Azure Monitor Agent side-by-side with a legacy agent on the same machine.
    1. Compare the data ingested by Azure Monitor Agent it with legacy agent data to ensure there are no gaps. You can do this by joining with the `Category` column in the [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) table, which indicates 'Azure Monitor Agent' for data collected by the new agent.
    1. After testing, d<sup>3</sup> use [built-in policies](../agents/azure-monitor-agent-manage.md#built-in-policies) for at-scale deployment of extensions and DCR associations. Using policy will also ensure automatic deployment of extensions and DCR associations for new machines.
    1. Use the [AMA Migration Helper](./azure-monitor-agent-migration-tools.md#using-ama-migration-helper) to **monitor the at-scale migration** across your machines.  
    
3. **Validate** that Azure Monitor Agent is collecting data as expected and all **downstream dependencies**, such as dashboards, alerts, and workbooks, function properly:
    1. Look at the **Overview** and **Usage** tabs of [Log Analytics Workspace Insights](../logs/log-analytics-workspace-insights-overview) for spikes or dips in ingestion rates following the migration. Check both the overall workspace ingestion and the table-level ingestion rates.  
    1. Check your workbooks, dashboards, and alerts for variances from typical behavior following the migration.   
1. Clean up: After you confirm that Azure Monitor Agent is collecting data properly, you can **either disable or uninstall the legacy Log Analytics agents**.
    1. If you've migrated to Azure Monitor Agent for all your requirements, you may [uninstall the Log Analytics agent](./agent-manage.md#uninstall-agent) from monitored resources. Clean up any configuration files, workspace keys, or certificates that were used previously by the Log Analytics agent. Continue using the legacy Log Analytics for features and solutions that Azure Monitor Agent doesn't support.     
    1. Don't uninstall the legacy agent if you need to use it to upload data to System Center Operations Manager.

<sup>1</sup> The DCR generator only converts configurations for Windows event logs, Linux syslog, and performance counters. Support for additional features and solutions will be available soon.  
<sup>2</sup> In addition to the Azure Monitor Agent extension, you might need to deploy additional extensions required for specific solutions. See [other extensions to be installed here](./agents-overview.md#supported-services-and-features)  
<sup>3</sup> Before you deploy a large number of agents, consider [configuring the workspace](agent-data-sources.md) to disable data collection for the Log Analytics agent. If you leave data collection for the Log Analytics agent enabled, you might collect duplicate data and increase your costs. You might choose to collect duplicate data for a short period during migration until you verify that you've deployed and configured Azure Monitor Agent correctly.  

## Next steps

For more information, see:

- [Azure Monitor Agent overview](agents-overview.md)
- [Azure Monitor Agent migration for Microsoft Sentinel](../../sentinel/ama-migrate.md)
- [Frequently asked questions for Azure Monitor Agent migration](/azure/azure-monitor/faq#azure-monitor-agent)
