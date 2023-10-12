---
title: Migrate from legacy agents to Azure Monitor Agent
description: This article provides guidance for migrating from the existing legacy agents to the new Azure Monitor Agent (AMA) and data collection rules (DCRs).
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: jeffwo
ms.date: 7/19/2023 
ms.custom:
# Customer intent: As an IT manager, I want to understand how I should move from using legacy agents to Azure Monitor Agent.
---

# Migrate to Azure Monitor Agent from Log Analytics agent

[Azure Monitor Agent (AMA)](./agents-overview.md) replaces the Log Analytics agent (also known as MMA and OMS) for Windows and Linux machines, in Azure and non-Azure environments, including on-premises and third-party clouds. The agent introduces a simplified, flexible method of configuring data collection using [data collection rules (DCRs)](../essentials/data-collection-rule-overview.md). This article provides guidance on how to implement a successful migration from the Log Analytics agent to Azure Monitor Agent.

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **August 31, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). After this date, Microsoft will no longer provide any support for the Log Analytics agent. If you're currently using the Log Analytics agent with Azure Monitor or [other supported features and services](#migrate-additional-services-and-features), start planning your migration to Azure Monitor Agent by using the information in this article.

## Benefits

In addition to consolidating and improving on the legacy Log Analytics agents, Azure Monitor Agent provides [a variety of immediate benefits](./azure-monitor-agent-overview.md#benefits), including **cost savings, a simplified management experience, and enhanced security and performance.**

## Migration guidance

Before you begin migrating from the Log Analytics agent to Azure Monitor Agent, review the checklist below.

### Before you begin 

> [!div class="checklist"]
> - **Check the [prerequisites](./azure-monitor-agent-manage.md#prerequisites) for installing Azure Monitor Agent.**<br>To monitor non-Azure and on-premises servers, you must [install the Azure Arc agent](../../azure-arc/servers/agent-overview.md). You won't incur an additional cost for installing the Azure Arc agent and you don't necessarily need to use Azure Arc to manage your non-Azure virtual machines. 
> - **Understand your current needs.**<br>Use the **Workspace overview** tab of the [AMA Migration Helper](./azure-monitor-agent-migration-tools.md#using-ama-migration-helper) to see connected agents and discover solutions enabled on your Log Analytics workspaces that use legacy agents, including per-solution migration recommendations. 
> - **Verify that Azure Monitor Agent can address all of your needs.**<br>Azure Monitor Agent is generally available for data collection and is used for data collection by various Azure Monitor features and other Azure services. For details, see [Supported services and features](#migrate-additional-services-and-features). 
> - **Consider installing Azure Monitor Agent together with a legacy agent for a transition period.**<br>Run Azure Monitor Agent alongside the legacy Log Analytics agent on the same machine to continue using existing functionality during evaluation or migration. Keep in mind that running two agents on the same machine doubles resource consumption, including but not limited to CPU, memory, storage space, and network bandwidth.<br>
>     - If you're setting up a new environment with resources, such as deployment scripts and onboarding templates, install Azure Monitor Agent together with a legacy agent in your new environment to decrease the migration effort later.
>     - If you have two agents on the same machine, avoid collecting duplicate data.<br> Collecting duplicate data from the same machine can skew query results, affect downstream features like alerts, dashboards, and workbooks, and generate extra charges for data ingestion and retention.<br> 
>    **To avoid data duplication:**
>        - Configure the agents to send the data to different workspaces or different tables in the same workspace.
>        - Disable duplicate data collection from legacy agents by [removing the workspace configurations](./agent-data-sources.md#configure-data-sources).
>        - Defender for Cloud natively deduplicates data when you use both agents, and [you'll be billed once per machine](../../defender-for-cloud/auto-deploy-azure-monitoring-agent.md#impact-of-running-with-both-the-log-analytics-and-azure-monitor-agents) when you run the agents side by side. 
>        - For Sentinel, you can easily [disable the legacy connector](../../sentinel/ama-migrate.md#recommended-migration-plan) to stop ingestion of logs from legacy agents.    

### Migration steps

:::image type="content" source="media/azure-monitor-agent-migration/mma-to-ama-migration-steps.png" lightbox="media/azure-monitor-agent-migration/mma-to-ama-migration-steps.png" alt-text="Flow diagram that shows the steps involved in agent migration and how the migration tools help in generating DCRs and tracking the entire migration process.":::  

1. Use the [DCR generator](./azure-monitor-agent-migration-tools.md#installing-and-using-dcr-config-generator) to convert your legacy agent configuration into [data collection rules](./data-collection-rule-azure-monitor-agent.md#create-a-data-collection-rule) automatically.<sup>1</sup> 

    Review the generated rules before you create them, to leverage benefits like [filtering](../essentials/data-collection-transformations.md), granular targeting (per machine), and other optimizations. There are special steps needed to[ migrate MMA custom logs to AMA custom logs](./azure-monitor-agent-custom-text-log-migration.md)

1. Test the new agent and data collection rules on a few nonproduction machines: 

    1. Deploy the generated data collection rules and associate them with a few machines, as described in [Installing and using DCR Config Generator](./azure-monitor-agent-migration-tools.md#installing-and-using-dcr-config-generator).   
    
        To avoid double ingestion, you can disable data collection from legacy agents during the testing phase without uninstalling the agents yet, by [removing the workspace configurations for legacy agents](./agent-data-sources.md#configure-data-sources).

    1. Compare the data ingested by Azure Monitor Agent with legacy agent data to ensure there are no gaps. You can do this on any table by using the [join operator](/azure/data-explorer/kusto/query/joinoperator?pivots=azuremonitor) to add the `Category` column from the [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) table, which indicates `Azure Monitor Agent` for data collected by the Azure Monitor Agent.
    
        For example, this query adds the `Category` column from the `Heartbeat` table to data retrieved from the `Event` table:
    
        ```kusto
        Heartbeat
        | distinct Computer, SourceComputerId, Category
        | join kind=inner (
            Event
        | extend d=parse_xml(EventData)
            | extend sourceHealthServiceId = tostring(d.DataItem.["@sourceHealthServiceId"])
            | project-reorder TimeGenerated, Computer, EventID, sourceHealthServiceId, ParameterXml, EventData
            ) on $left.SourceComputerId==$right.sourceHealthServiceId
        | project TimeGenerated, Computer, Category, EventID, sourceHealthServiceId, ParameterXml, EventData
        ```
    
1. Use [built-in policies](../agents/azure-monitor-agent-manage.md#built-in-policies) to deploy extensions and DCR associations at scale. Using policy also ensures automatic deployment of extensions and DCR associations for new machines.<sup>3</sup>
    
    Use the [AMA Migration Helper](./azure-monitor-agent-migration-tools.md#using-ama-migration-helper) to **monitor the at-scale migration** across your machines.  
    
1. **Validate** that Azure Monitor Agent is collecting data as expected and all **downstream dependencies**, such as dashboards, alerts, and workbooks, function properly:
    1. Look at the **Overview** and **Usage** tabs of [Log Analytics Workspace Insights](../logs/log-analytics-workspace-overview.md) for spikes or dips in ingestion rates following the migration. Check both the overall workspace ingestion and the table-level ingestion rates.  
    1. Check your workbooks, dashboards, and alerts for variances from typical behavior following the migration.   
    
1. Clean up: After you confirm that Azure Monitor Agent is collecting data properly, **disable or uninstall the legacy Log Analytics agents**.
    - If you have need to continue using both agents, [disable data collection with the Log Analytics agent](./agent-data-sources.md#configure-data-sources).
    - If you've migrated to Azure Monitor Agent for all your requirements, [uninstall the Log Analytics agent](./agent-manage.md#uninstall-agent) from monitored resources. Clean up any configuration files, workspace keys, or certificates that were used previously by the Log Analytics agent. Continue using the legacy Log Analytics for features and solutions that Azure Monitor Agent doesn't support.     
    - Don't uninstall the legacy agent if you need to use it to upload data to System Center Operations Manager.

<sup>1</sup> The DCR generator only converts the configurations for Windows event logs, Linux syslog and performance counters. Support for more features and solutions will be available soon  
<sup>2</sup> You might need to deploy [extensions required for specific solutions](#migrate-additional-services-and-features) in addition to the Azure Monitor Agent extension.  

## Migrate additional services and features

Azure Monitor Agent is generally available for data collection. Most services that used Log Analytics agent for data collection have migrated to Azure Monitor Agent. 

The following features and services now have and Azure Monitor Agent version (some are still in Public Preview). This means you can already choose to use Azure Monitor Agent to collect data when you enable the feature or service.
    
|	Service or feature	|	Migration recommendation	|	Other extensions installed	|	More information	|
|	:---	|	:---	|	:---	|	:---	|
|	[VM insights](../vm/vminsights-overview.md)	|	Generally Available 	|	Dependency Agent extension, if you’re using the Map Services feature	|	[Enable VM Insights](../vm/vminsights-enable-overview.md)	|
|	[Container insights](../containers/container-insights-overview.md)	|	Public preview 	|	Containerized Azure Monitor agent	|	[Enable Container Insights](../containers/container-insights-onboard.md)	|
|   [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md)	| Moving to an agentless solution	|		| Many features available now all will be available by April 2024|
|   [Microsoft Sentinel](../../sentinel/overview.md)	| <ul><li>Windows Security Events: [GA](../../sentinel/connect-windows-security-events.md?tabs=AMA)</li><li>Windows Forwarding Event (WEF): [GA](../../sentinel/data-connectors/windows-forwarded-events.md)</li><li>Windows DNS logs: [Public preview](../../sentinel/connect-dns-ama.md)</li><li>Linux Syslog CEF: [Public preview](../../sentinel/connect-cef-ama.md#set-up-the-common-event-format-cef-via-ama-connector)</li></ul> |	Sentinel DNS extension, if you’re collecting DNS logs. For all other data types, you just need the Azure Monitor Agent extension. |  See [Gap analysis for Microsoft Sentinel](../../sentinel/ama-migrate.md#gap-analysis-between-agents) for a comparison of the extra data collected by Microsoft Sentinel.  |
|	 [Change Tracking and Inventory Management](../../automation/change-tracking/overview.md) |	 Moving to an agentless solution 	|	|	Available Novermber 2023 |
|	[Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md)	|	New service called Connection Monitor: Public preview with Azure Monitor Agent	|	Azure NetworkWatcher extension	|	[Monitor network connectivity by using Azure Monitor Agent](../../network-watcher/azure-monitor-agent-with-connection-monitor.md)	|
|	Azure Stack HCI Insights	|	Private preview	|	|	[Sign up here](https://aka.ms/amadcr-privatepreviews)	|
|	Azure Virtual Desktop (AVD) Insights |	Generally Available	|	|	|

> [!NOTE]
> Features and services listed above in preview **may not be available in Azure Government and China clouds**. They will be available typically within a month *after* the features/services become generally available.

When you migrate the following services, which currently use Log Analytics agent, to their respective replacements (v2), you no longer need either of the monitoring agents:

|	Service	|	Migration recommendation	|	Other extensions installed	|	More information	|
|	:---	|	:---	|	:---	|	:---	|
|	 [Update Management](../../automation/update-management/overview.md)	|	 Update Manager - Public preview (no dependency on Log Analytics agents or Azure Monitor Agent)	|	None	|	[Update Manager (Public preview with Azure Monitor Agent) documentation](../../update-center/index.yml)	|
|	 [Automation Hybrid Runbook Worker overview](../../automation/automation-hybrid-runbook-worker.md)	|	 Automation Hybrid Worker Extension - Generally available (no dependency on Log Analytics agents or Azure Monitor Agent)	|	None	|	[Migrate an existing Agent based to Extension based Hybrid Workers](../../automation/extension-based-hybrid-runbook-worker-install.md#migrate-an-existing-agent-based-to-extension-based-hybrid-workers)	|

## Next steps

For more information, see:

- [Azure Monitor Agent overview](agents-overview.md)
- [Azure Monitor Agent migration for Microsoft Sentinel](../../sentinel/ama-migrate.md)
- [Frequently asked questions for Azure Monitor Agent migration](/azure/azure-monitor/faq#azure-monitor-agent)
