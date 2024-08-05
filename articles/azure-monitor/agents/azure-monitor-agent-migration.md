---
title: Migrate to Azure Monitor Agent from Log Analytics agent 
description: Guidance for migrating to Azure Monitor Agent from MMA
author: EdB-MSFT
ms.author: edbaynash
ms.reviewer: guywild
ms.topic: conceptual 
ms.date: 06/16/2024

# Customer intent: As an azure administrator, I want to understand the process of migrating from the MMA agent to the AMA agent.

---

# Migrate to Azure Monitor Agent from Log Analytics agent

[Azure Monitor Agent (AMA)](./agents-overview.md) replaces the Log Analytics agent, also known as Microsoft Monitor Agent (MMA) and OMS, for Windows and Linux machines, in Azure and non-Azure environments, on-premises and other clouds. The agent introduces a simplified, flexible method of configuring data collection using [Data Collection Rules (DCRs)](../essentials/data-collection-rule-overview.md). This article provides guidance on how to implement a successful migration from the Log Analytics agent to Azure Monitor Agent.

Migration is a complex task. Start planning your migration to Azure Monitor Agent using the information in this article as a guide.

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **August 31, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). You can expect the following when you use the MMA or OMS agent after this date.
> - **Data upload:** Cloud ingestion services will gradually reduce support for MMA agents, which may result in decreased support and potential compatibility issues for MMA agents over time.  Ingestion for MMA will be unchanged until February 1 2025.
> - **Installation:** The ability to install the legacy agents will be removed from the Azure Portal and installation policies for legacy agents will be removed. You can still install the MMA agents extension as well as perform offline installations.
> - **Customer Support:** You will not be able to get support for legacy agent issues.
> - **OS Support:** Support for new Linux or Windows distros, including service packs, won't be added after the deprecation of the legacy agents.

## Benefits
Using Azure Monitor agent, you get immediate benefits as shown below:

:::image type="content" source="media/azure-monitor-agent-overview/azure-monitor-agent-benefits.png" lightbox="media/azure-monitor-agent-overview/azure-monitor-agent-benefits.png" alt-text="Diagram of the Azure Monitor Agent benefits at a glance. This is described in more details below.":::

- **Cost savings** by [using data collection rules](./azure-monitor-agent-data-collection.md):
  - Enables targeted and granular data collection for a machine or subset(s) of machines, as compared to the "all or nothing" approach of legacy agents.
  - Allows filtering rules and data transformations to reduce the overall data volume being uploaded, thus lowering ingestion and storage costs significantly.
- **Security and Performance**
  - Enhanced security through Managed Identity and Microsoft Entra tokens (for clients).
  - Higher event throughput that is 25% better than the legacy Log Analytics (MMA/OMS) agents.
- **Simpler management** including efficient troubleshooting:
  - Supports data uploads to multiple destinations (multiple Log Analytics workspaces, i.e. *multihoming* on Windows and Linux) including cross-region and cross-tenant data collection (using Azure LightHouse).
  - Centralized agent configuration "in the cloud" for enterprise scale throughout the data collection lifecycle, from onboarding to deployment to updates and changes over time.
  - Any change in configuration is rolled out to all agents automatically, without requiring a client side deployment.
  - Greater transparency and control of more capabilities and services, such as Microsoft Sentinel, Defender for Cloud, and VM Insights.
- **A single agent** that serves all data collection needs across [supported](./azure-monitor-agent-supported-operating-systems.md) servers and client devices. A single agent is the goal, although Azure Monitor Agent is currently converging with the Log Analytics agents.

## Before you begin

- Review the [prerequisites](/azure/azure-monitor/agents/azure-monitor-agent-manage#prerequisites) for installing Azure Monitor Agent.
To monitor non-Azure and on-premises servers, you must install the Azure Arc agent. The Arc agent makes your on-premises servers visible to Azure as a resource it can target. You don't incur any additional cost for installing the Azure Arc agent.

- Verify that Azure Monitor Agent can address all of your needs. Azure Monitor Agent is General Availability (GA) for data collection and is used for data collection by various Azure Monitor features and other Azure services.
-  Verify that you have the necessary permissions to install the Azure Monitor Agent. You must have the necessary permissions to install the agent on the machines you want to monitor. For more information, see [Permissions required to install the Azure Monitor Agent](/azure/azure-monitor/agents/azure-monitor-agent-manage#permissions-required-to-install-the-azure-monitor-agent).

## High level guidance

Use the following guidance to plan and execute your migration:

- Understand your agents and how many you have to migrate.
- Understand how you're using your workspaces.
- Understand which solutions, insights, and data collections that are configured.
- Configure your data collections and validate the collections.
- Understand additional dependencies and services.
- Remove the legacy agents.

The **Azure Monitor Agent Migration Helper** workbook is a workbook-based Azure Monitor solution that can help you at each of the steps outlined above. This guide references the workbook and other tools at each stage of the migration process. For more information, see [Azure Monitor Agent Migration Helper workbook](./azure-monitor-agent-migration-helper-workbook.md).

## Understand your agents

Use the [DCR generator](./azure-monitor-agent-migration-tools.md#installing-and-using-dcr-config-generator) to convert your legacy agent configuration into [data collection rules](../essentials/data-collection-rule-overview.md) automatically.<sup>1</sup> 
To help understand your agents, review the following questions:

|**Question**|**Actions**|
|---|---|
|**How many agents do you have to migrate ?**|Understand the number of agents you have to migrate.|
|**Do you have any agents that are deployed outside of Azure?** <p>Are these agents deployed in your own data center or in another cloud environment? |     For servers that are outside of Azure, you must first deploy the Azure ARC Connected Machine Agent. For more information, see [Overview of Azure Connected Machine agent](/azure/azure-arc/servers/agent-overview).|
|**Are you using System Center Operations Manager (SCOM) ?**<p> What your intended plan for SCOM going forward?|If you're planning on continuing to use SCOM, start evaluating SCOM Managed Instance. For more information, see [SCOM Managed Instance](/system-center/scom/operations-manager-managed-instance-overview).|
|**How are you deploying your agents today?**|  If you're using any automated methods to deploy the legacy agent, consider when to stop those automated deployments for new servers, and start focusing on deploying the new agent. Stopping automated deployment for new servers helps ensure that you don't keep adding to your migration effort and lets you focus on the existing inventory of agents to migrate.

The Azure Monitor Agent Migration Helper Workbook can help you understand how many agents you have to migrate. For more information, see [Azure Monitor Agent migration helper workbook- Agents](./azure-monitor-agent-migration-helper-workbook.md#using-the-ama-workbook).|


## Understand your workspaces, solutions, insights, and data collections

Before migration, understand how your Log Analytics workspaces are being used. Check if they're all in use and which agents are sending their telemetry to which workspaces. Many workspaces get created over time, and it can become unclear which workspaces are actually in use, which workspaces are being used to collect telemetry, and from which servers. Migration is a good opportunity to clean up and consolidate your workspaces.

When looking at your workspaces, note which solutions are configured. This information is important to understand what data you're collecting and how you're using it. 

The Azure Monitor Agent Migration Helper Workbook can help you understand which workspaces you have, and the solutions implemented in each workspace, and when you last used the solution. Each solution has a migration recommendation. For more information, see [Azure Monitor Agent migration helper workbook- Workspaces](./azure-monitor-agent-migration-helper-workbook.md#workspaces)

You can also use the Azure Monitor Workspace Auditing workbook to help you understand your workspaces.  To use the Azure Monitor Workspace Auditing workbook, copy the workbook from the [GitHub repository](https://github.com/microsoft/AzureMonitorCommunity/blob/master/Azure%20Services/Log%20Analytics%20workspaces/Workbooks/Workspace%20Audit.json) and import it into your Log Analytics workspace. 

This workbook collects all of your Log Analytics workspaces and shows you the following for each workspace:
- All data sources that are sending data to the workspace.
- The agents that are sending heartbeats to the workspace. 
- The resources that are sending data to the workspace.
- Any Application Insights resources that are sending data to the workspace.

For more information, see [Azure Monitor Workspace Auditing workbook](./azure-monitor-agent-migration-helper-workbook.md#workspace-auditing-workbook).


## Configure your data collections and validate the collections

When configuring your data collections, consider the following steps:

- Identify a pilot group of servers that you can use for this process. Use the pilot servers to validate the data before you deploy at scale.

- Use the DCR Config Generator to transform the data collections that are configured in the workspace and deploy them as data collection rules back into your environment. For more information on the DCR Config Generator, see [DCR Config Generator](./azure-monitor-agent-migration-data-collection-rule-generator.md).
- Migrate VM Insights or Azure Monitor for Virtual Machines to the Azure Monitor Agent. Validate the migrated data collections for the pilot group of servers compared with what was collected before migration. To avoid double ingestion, you can disable data collection from legacy agents during the testing phase without uninstalling the agents yet, by removing the workspace configurations for legacy agents. For more information, see [Log Analytics agent data sources in Azure Monitor](/azure/azure-monitor/agents/agent-data-sources#configure-data-sources)

- Validate the new data to ensure there are no gaps. Compare the data ingested by legacy agent data to Azure Monitor Agent. Use KQL to compare equivalent data from each agent based on agent type.

- Plan deployment at scale using Azure policy. Use built-in policies to deploy extensions and DCR associations at scale. Using policy also ensures automatic deployment of extensions and DCR associations for new machines. For more information on deploying at scale, see [Manage Azure Monitor Agent - Use Azure policies](/azure/azure-monitor/agents/azure-monitor-agent-manage#use-azure-policy).



## Understand additional dependencies and services

Before migration it's important to understand how your other services are impacted.

|Service|Impact|
|---|---|
|Update Management|If you're using Update Management under Azure Automation, you must migrate to Azure Update Manager.<p> Azure Update Manager has its own agent and is decoupled from the Azure Monitor agent.<p>Update Management will be deprecated at the end of August 2024. We recommend migrating to Azure Update Manager.<p>For more information, see [Move from Automation Update Management to Azure Update Manager](/azure/update-manager/guidance-migration-automation-update-management-azure-update-manager).<p>The AMA migration Helper workbook shows you which of your machines are using the update Management solution today and how to migrate them. For more information, see [Azure Monitor Agent migration helper workbook- Update management](./azure-monitor-agent-migration-helper-workbook.md#automation-update-management).|
|Change Tracking and Inventory|If you're using Change Tracking and Inventory, you must migrate to Azure Automation.<p>Change Tracking and Inventory are also part of Azure Automation. While Azure Monitor Agent has a change tracking and inventory solution, you must create a data collection rule. For more information, see [Manage change tracking and inventory using Azure Monitoring Agent](/azure/automation/change-tracking/manage-change-tracking-monitoring-agent).|
|Defender for cloud|If you're using Defender for Cloud for your service or Defender for servers and you have P2 enabled or plan to enable P2 for your servers, change your agent deployment in Defender for Cloud from the legacy agent deployment to agent-less scanning.<p>If you're using Defender for Cloud to collect security events, create a custom data collection rule to collect those events.|
|Microsoft Sentinel|If you're using Microsoft Sentinel, the solutions that were using the legacy agent have been converted to Azure Monitor Agent based solutions, and can be updated.|

## Remove the legacy agents

As part of your migration planning, plan to remove the legacy agent once migration is complete to avoid duplication of data collection.

If you don't need to retain the MMA on any of your machines, use the MMA Discovery and Removal tool to remove the agent at scale.  For more information on the MMA Discovery and Removal tool, see [MMA Discovery and Removal tool](/azure/azure-monitor/agents/azure-monitor-agent-mma-removal-tool?tabs=single-tenant%2Cdiscovery). 

If however you're using System Center Operations Manager (SCOM), keep the MMA agent deployed to the machines that you'll continue managing with System Center Operations Manager.

A SCOM Admin Management Pack exists and can help you remove the workspace configurations at scale while retaining the SCOM Management Group configuration. For more information on the SCOM Admin Management Pack, see [SCOM Admin Management Pack](https://github.com/thekevinholman/SCOM.Management).


## Known parity gaps that may impact your migration

- IIS Logs: When IIS log collection is enabled, AMA might not populate the `sSiteName` column of the `W3CIISLog` table. This field gets collected by default when IIS log collection is enabled for the legacy agent. If you need to collect the `sSiteName` field using AMA, enable the `Service Name (s-sitename)` field in W3C logging of IIS. For steps to enable this field, see [Select W3C Fields to Log](/iis/manage/provisioning-and-managing-iis/configure-logging-in-iis#select-w3c-fields-to-log).

- Sentinel: Windows Firewall logs aren't generally available (GA) yet.
- SQL Assessment Solution: This is now part of SQL best practice assessment. The deployment policies require one Log Analytics Workspace per subscription, which isn't the best practice recommended by the AMA team.
- Microsoft Defender for cloud: Some features for the new agent-less solution are in development. Your migration maybe impacted if you use File Integrity Monitoring (FIM), Endpoint protection discovery recommendations, OS Misconfigurations (Azure Security Benchmark (ASB) recommendations) and Adaptive Application controls.


## Next steps

- [Azure Monitor Agent migration helper workbook](./azure-monitor-agent-migration-helper-workbook.md)
- [DCR Config Generator](./azure-monitor-agent-migration-data-collection-rule-generator.md)
- [MMA Discovery and Removal tool](/azure/azure-monitor/agents/azure-monitor-agent-mma-removal-tool?tabs=single-tenant%2Cdiscovery)
