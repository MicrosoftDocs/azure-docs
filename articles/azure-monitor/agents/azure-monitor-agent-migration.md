---
title: Migrate from legacy agents to Azure Monitor Agent
description: This article provides guidance for migrating from the existing legacy agents to the new Azure Monitor Agent (AMA) and data collection rules (DCRs).
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: shseth
ms.date: 4/3/2023 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
# Customer intent: As an IT manager, I want to understand how I should move from using legacy agents to Azure Monitor Agent.
---

# Migrate to Azure Monitor Agent from Log Analytics agent

[Azure Monitor Agent (AMA)](./agents-overview.md) replaces the Log Analytics agent (also known as MMA and OMS) for Windows and Linux machines, in Azure and non-Azure environments, including on-premises and third-party clouds. The agent introduces a simplified, flexible method of configuring data collection using [data collection rules (DCRs)](../essentials/data-collection-rule-overview.md). This article provides guidance on how to implement a successful migration from the Log Analytics agent to Azure Monitor Agent.

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **August 31, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you're currently using the Log Analytics agent with Azure Monitor or [other supported features and services](./agents-overview.md#supported-services-and-features), you should start planning your migration to Azure Monitor Agent by using the information in this article and the availability of other solutions/services.

## Benefits

In addition to consolidating and improving on the legacy Log Analytics agents, Azure Monitor Agent provides [a variety of immediate benefits](./azure-monitor-agent-overview.md#benefits), including **cost savings, a simplified management experience, and enhanced security and performance.**

## Migration guidance

Before you begin migrating from the Log Analytics agent to Azure Monitor Agent, review the migration plan checklist.

### Before you begin 

> [!div class="checklist"]
> - **Make sure you meet the [prerequisites](./azure-monitor-agent-manage.md#prerequisites) for installing Azure Monitor Agent.**<br>To monitor non-Azure and on-premises servers, you must [install the Azure Arc agent](../../azure-arc/servers/agent-overview.md). You won't incur an additional cost for installing the Azure Arc agent and you don't necessarily need to use Azure Arc to manage your non-Azure virtual machines. 
> - **Understand your current needs.**<br>Use the **Workspace overview** tab of the [AMA Migration Helper](./azure-monitor-agent-migration-tools.md#using-ama-migration-helper) to discover solutions enabled on your Log Analytics workspaces that use legacy agents, including per-solution migration recommendations. 
> - **Check that Azure Monitor Agent can address all of your needs.**<br>Check the [Azure Monitor Agent supported services and features](../agents/agents-overview.md#supported-services-and-features).<br>If you use Microsoft Sentinel, see [Gap analysis for Microsoft Sentinel](../../sentinel/ama-migrate.md#gap-analysis-between-agents) for a comparison of the extra data collected by Microsoft Sentinel.  
> - **Consider installing Azure Monitor Agent together with a legacy agent for a transition period.**<br>You can run Azure Monitor Agent alongside the legacy Log Analytics agent on the same machine to continue using existing functionality during evaluation or migration.<br>
>     If you're setting up a new environment with resources, such as deployment scripts and onboarding templates, install Azure Monitor Agent together with a legacy agent in your new environment to decrease the migration effort later.<br>
>    **If you have two agents on the same machine, avoid collecting duplicate data.**
>    - Collecting duplicate data from the same machine can skew query results, affect downstream features like alerts, dashboards, and workbooks, and generate extra charges for data ingestion and retention. To avoid data duplication, ensure that the agents collect data from different machines or send the data to different destinations.
>    - Running two agents on the same machine consumes double the resources, including but not limited to CPU, memory, storage space, and network bandwidth.<br>
>    To avoid data duplication:
>    - Configure the agents to send the data to different workspaces or different tables in the same workspace.
>    - Disable duplicate data collection from legacy agents by [removing the workspace configurations](./agent-data-sources.md#configure-data-sources)
>    - Defender for Cloud natively deduplicates data when you use both agents, and [you'll be billed once per machine](../../defender-for-cloud/auto-deploy-azure-monitoring-agent.md#impact-of-running-with-both-the-log-analytics-and-azure-monitor-agents) when you run the agents side by side. 
>    - For Sentinel, you can easily [disable the legacy connector](../../sentinel/ama-migrate.md#recommended-migration-plan) to stop ingestion of logs from legacy agents.    

### Migration steps
![Flow diagram that shows the steps involved in agent migration and how the migration tools help in generating DCRs and tracking the entire migration process.](media/azure-monitor-agent-migration/mma-to-ama-migration-steps.png)  

1. Use the [DCR generator](./azure-monitor-agent-migration-tools.md#installing-and-using-dcr-config-generator) to convert your legacy agent configuration into [data collection rules](./data-collection-rule-azure-monitor-agent.md#create-a-data-collection-rule) automatically.<sup>1</sup> 

    Review the generated rules before you create them, to leverage benefits like [filtering](../essentials/data-collection-transformations.md), granular targeting (per machine), and other optimizations.  

1. Test the new agent and data collection rules on a few non-production machines: 

    1. Deploy the generated data collection rules and associate them with a few machines, as described in [Installing and using DCR Config Generator](./azure-monitor-agent-migration-tools.md#installing-and-using-dcr-config-generator). Associating a machine with a data collection rule installs Azure Monitor Agent on the machine automatically.  
    
        As explained in [Before you begin](#before-you-begin), you can install Azure Monitor Agent side-by-side with legacy agents on the same machine.  To avoid double ingestion, you can disable data collection from legacy agents without uninstalling them yet, by [removing the workspace configurations for legacy agents](./agent-data-sources.md#configure-data-sources).

    1. Compare the data ingested by Azure Monitor Agent with legacy agent data to ensure there are no gaps. You can do this by joining with the `Category` column in the [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) table, which indicates `Azure Monitor Agent` for data collected by the Azure Monitor Agent.
    
1. Use [built-in policies](../agents/azure-monitor-agent-manage.md#built-in-policies) to deploy extensions and DCR associations at scale. Using policy will also ensure automatic deployment of extensions and DCR associations for new machines.<sup>3</sup>
    
    Use the [AMA Migration Helper](./azure-monitor-agent-migration-tools.md#using-ama-migration-helper) to **monitor the at-scale migration** across your machines.  
    
1. **Verify** that Azure Monitor Agent is collecting data as expected and all **downstream dependencies**, such as dashboards, alerts, and workbooks, function properly:
    1. Look at the **Overview** and **Usage** tabs of [Log Analytics Workspace Insights](../logs/log-analytics-workspace-insights-overview) for spikes or dips in ingestion rates following the migration. Check both the overall workspace ingestion and the table-level ingestion rates.  
    1. Check your workbooks, dashboards, and alerts for variances from typical behavior following the migration.   
    
1. Clean up: After you confirm that Azure Monitor Agent is collecting data properly, you can **either disable or uninstall the legacy Log Analytics agents**.
    1. If you have need to continue using both agents, [disable data collection with the Log Analytics agent](./agent-data-sources.md#configure-data-sources).
    1. If you've migrated to Azure Monitor Agent for all your requirements, you can [uninstall the Log Analytics agent](./agent-manage.md#uninstall-agent) from monitored resources. Clean up any configuration files, workspace keys, or certificates that were used previously by the Log Analytics agent. Continue using the legacy Log Analytics for features and solutions that Azure Monitor Agent doesn't support.     
    1. Don't uninstall the legacy agent if you need to use it to upload data to System Center Operations Manager.

<sup>1</sup> The DCR generator only converts the configurations for Windows event logs, Linux syslog and performance counters. Support for additional features and solutions will be available soon  
<sup>2</sup> You might need to deploy [extensions required for specific solutions](./agents-overview.md#supported-services-and-features) in addition to the Azure Monitor Agent extension.  


## Next steps

For more information, see:

- [Azure Monitor Agent overview](agents-overview.md)
- [Azure Monitor Agent migration for Microsoft Sentinel](../../sentinel/ama-migrate.md)
- [Frequently asked questions for Azure Monitor Agent migration](/azure/azure-monitor/faq#azure-monitor-agent)
