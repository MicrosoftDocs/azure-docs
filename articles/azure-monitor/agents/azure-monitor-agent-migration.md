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

[Azure Monitor Agent (AMA)](./agents-overview.md) replaces the Log Analytics agent (also known as MMA and OMS) for both Windows and Linux machines, in both Azure and non-Azure (on-premises and third-party clouds) environments. It introduces a simplified, flexible method of configuring collection configuration called [data collection rules (DCRs)](../essentials/data-collection-rule-overview.md). This article outlines the benefits of migrating to Azure Monitor Agent and provides guidance on how to implement a successful migration.

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **August 31, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you're currently using the Log Analytics agent with Azure Monitor or [other supported features and services](./agents-overview.md#supported-services-and-features), you should start planning your migration to Azure Monitor Agent by using the information in this article and the availability of other solutions/services.

## Benefits

In addition to consolidating and improving upon legacy Log Analytics agents, Azure Monitor Agent provides additional immediate benefits for **cost savings, simplified management experience, security and performance.** [Learn more about these benefits](./azure-monitor-agent-overview.md#benefits)


## Migration guidance

### Before you begin
1. Review and follow the **[prerequisites](./azure-monitor-agent-manage.md#prerequisites)** for use with Azure Monitor Agent. 
    - For non-Azure and on premises servers, [installing the Azure Arc agent](../../azure-arc/servers/agent-overview.md) is required though it's not mandatory to use Azure Arc for management overall. As such, this should incur no additional cost for Arc. 
2. Service (legacy Solutions) requirements - The legacy Log Analytics agents are used by various Azure services to collect required data. If you're not using any additional Azure service, you may skip this step altogether.   
    - Use the [AMA Migration Helper](./azure-monitor-agent-migration-tools.md#using-ama-migration-helper) to **discover solutions enabled** on your workspace(s) that use the legacy agents, including the **per-solution migration recommendation<sup>1</sup>** shown under `Workspace overview` tab. 
    - If you use Microsoft Sentinel, see [Gap analysis for Microsoft Sentinel](../../sentinel/ama-migrate.md#gap-analysis-between-agents) for a comparison of the extra data collected by Microsoft Sentinel.  
3. **Agent coexistence:** 
    - If you're setting up a *new environment* with resources, such as deployment scripts and onboarding templates, install Azure Monitor Agent together with a legacy agent in your new environment to decrease the migration effort later.
    - Azure Monitor Agent **can run alongside the legacy Log Analytics agents on the same machine** so that you can continue to use existing functionality during evaluation or migration. You can begin the transition, but ensure you understand the **limitations below**:
        - Be careful when you collect **duplicate data** from the same machine, as this could skew query results, affect downstream features like alerts, dashboards, workbooks and generate **additional cost/charges** for data ingestion and retention. Here are some things that can help:
            - Configure the agents to *send the data to different destinations*, i.e. either different workspaces or different tables in same workspace
            - Disable the duplicate data collection from legacy agents by [removing the workspace configurations](./agent-data-sources.md#configure-data-sources)
            - For **Defender for Cloud**, the experiences natively deduplicate data if using both agents. Also you will only be [billed once per machine](../../defender-for-cloud/auto-deploy-azure-monitoring-agent.md#impact-of-running-with-both-the-log-analytics-and-azure-monitor-agents) when running both agents 
            - For **Sentinel**, you can easily [disable the legacy connector](../../sentinel/ama-migrate.md#recommended-migration-plan) to stop ingestion of logs from legacy agents.    
        - Running two telemetry agents on the same machine consumes double the resources, including but not limited to CPU, memory, storage space, and network bandwidth.

<sup>1</sup> Start testing your scenarios during the preview phase. This will save time, avoid surprises later and ensure you're ready to deploy to production as soon as the service becomes generally available. Moreover you benefit from added security and reduced cost immediately.  

### Migration steps
![Flow diagram that shows the steps involved in agent migration and how the migration tools help in generating DCRs and tracking the entire migration process.](media/azure-monitor-agent-migration/mma-to-ama-migration-steps.png)  

1. **[Create data collection rules](./data-collection-rule-azure-monitor-agent.md#create-a-data-collection-rule)**. You can use the [DCR generator](./azure-monitor-agent-migration-tools.md#installing-and-using-dcr-config-generator)<sup>1</sup> to **automatically convert your legacy agent configuration into data collection rule templates**. Review the generated rules before you create them, to leverage benefits like filtering, granular targeting (per machine), and other optimizations.  

2. Deploy extensions and DCR-associations: 
    1. **Test first** by deploying extensions<sup>2</sup> and DCR-Associations on a few non-production machines. You can also deploy side-by-side on machines running legacy agents (see [agent coexistence](#before-you-begin) section above)
    2. Once data starts flowing via Azure Monitor agent, **compare it with legacy agent data** to ensure there are no gaps. You can do this by joining with the `Category` column in the [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) table which indicates 'Azure Monitor Agent' for the new data collection. 
    3. If you are required to run both agents and wish to **avoid double ingestion**, you can disable data collection from legacy agents without uninstalling them yet, by simply [removing the workspace configurations for legacy agents](./agent-data-sources.md#configure-data-sources)
    4. Post testing, you can **roll out broadly** using [built-in policies](./azure-monitor-agent-manage.md#use-azure-policy) for at-scale deployment of extensions and DCR-associations. **Using policy will also ensure automatic deployment of extensions and DCR-associations for any new machines in future.**
    5. Throughout this process, use the [AMA Migration Helper](./azure-monitor-agent-migration-tools.md#using-ama-migration-helper) to **monitor the at-scale migration** across your machines  
    
3. **Validate** that Azure Monitor Agent is collecting data as expected and all **downstream dependencies**, such as dashboards, alerts, and workbooks, function properly. You can do this by joining with/looking at the `Category` column in the [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) table which indicates 'Azure Monitor Agent' vs 'Direct Agent' (for legacy). 

4. Clean up: After you confirm that Azure Monitor Agent is collecting data properly, you may **choose to either disable or uninstall the legacy Log Analytics agents**
    1. If you have need to continue using both agents, skip uninstallation and only [disable the legacy data collection](./agent-data-sources.md#configure-data-sources), also described above.
    2. If you've migrated to Azure Monitor agent for all your requirements, you may [uninstall the Log Analytics agent](./agent-manage.md#uninstall-agent) from monitored resources. Clean up any configuration files, workspace keys, or certificates that were used previously by the Log Analytics agent.
    3. Don't uninstall the legacy agent if you need to use it for uploading data to System Center Operations Manager.


<sup>1</sup> The DCR generator only converts the configurations for Windows event logs, Linux syslog and performance counters. Support for additional features and solutions will be available soon  
<sup>2</sup> In addition to the Azure Monitor agent extension, you need to deploy additional extensions required for specific solutions. See [other extensions to be installed here](./agents-overview.md#supported-services-and-features)  



## Next steps

For more information, see:

- [Azure Monitor Agent overview](agents-overview.md)
- [Azure Monitor Agent migration for Microsoft Sentinel](../../sentinel/ama-migrate.md)
- [Frequently asked questions for Azure Monitor Agent migration](/azure/azure-monitor/faq#azure-monitor-agent)
