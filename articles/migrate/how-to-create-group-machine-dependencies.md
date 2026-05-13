---
title: Set up agent-based dependency analysis in Azure Migrate
description: This article describes how to set up agent-based dependency analysis in Azure Migrate.
ms.topic: how-to
ms.service: azure-migrate
ms.date: 09/09/2024
ms.reviewer: v-uhabiba
ms.custom:
  - engagement-fy25
  - sfi-image-nochange
# Customer intent: "As a cloud migration specialist, I want to set up agent-based dependency analysis in Azure Migrate, so that I can effectively identify and visualize server dependencies for successful assessment and migration to Azure."
---

# Set up dependency visualization

Azure Migrate recommends the use of agentless dependency analysis and no longer provides support for agent based dependency visualization. However, if you still want to use agent-based dependency visualization, you can do it outside of Azure migrate purview.  
Note that agent-based dependency analysis is not free, and Log Analytics workspace usage charges will apply. For pricing details, see [Azure Monitor pricing](pricing/details/monitor/).

## Before you start

Requirement | Details
--- | ---
Before deployment | You should have a project in place with the Azure Migrate: Discovery and assessment tool added to the project.<br /><br />You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises servers.<br /><br />Learn how to [create a project for the first time](create-manage-projects.md).<br /> Learn how to [add a discovery and assessment tool to an existing project](how-to-assess.md).<br /> Learn how to set up the Azure Migrate appliance for assessment of [Hyper-V](how-to-set-up-appliance-hyper-v.md), [VMware](how-to-set-up-appliance-vmware.md), or physical servers.
Supported servers | Supported for all servers in your on-premises.
Log Analytics | Use the [Azure Monitor VM Insights](azure/azure-monitor/vm/monitor-vm) for dependency visualization. VM insights uses Azure Monitor Agent, which replaces the Log Analytics agent used by Service map. For more information about how to enable VM insights for Azure virtual machines and on-premises machines, see [How to enable VM insights using Azure Monitor Agent for Azure virtual machines](/azure/azure-monitor/vm/vm-enable-monitoring?tabs=cli#agents).<br /><br />If you are already using Service Map you need to [migrate from Service map to Azure monitor VM Insights](azure/azure-monitor/vm/vminsights-migrate-from-service-map)
Required agents | On each server that you want to analyze, install the following agents:<br />- Azure Monitor agent (AMA)<br />- [Dependency agent](/azure/azure-monitor/vm/vminsights-dependency-agent-maintenance)<br /><br /> Learn more about installing the [Dependency agent](how-to-create-group-machine-dependencies.md#install-the-dependency-agent) and the Azure Monitor agent.
Cost | [standard charges](https://azure.microsoft.com/pricing/details/log-analytics/) for Log Analytics are applied.<br /><br /> When the project is deleted, the workspace isn't automatically deleted. After you delete the project, Azure Monitor VM insights usage isn't free. Each node is charged according to the paid tier of the Log Analytics workspace.<br /><br />
Management | You can use the Log Analytics workspace outside Azure Migrate and Modernize.<br /><br /> If you delete the associated project, the workspace isn't deleted automatically. [Delete it manually](/azure/azure-monitor/logs/manage-access).<br /><br /> 
Internet connectivity | If servers aren't connected to the internet, install the Log Analytics gateway on the servers.
Azure Government | Agent-based dependency analysis isn't supported.
- Make sure you:
  - Have an Azure Migrate project. If you don't, [create](./create-manage-projects.md) one now.
  - Check that you've [added](how-to-assess.md) the Azure Migrate: Discovery and assessment tool to the project.
  - Set up an [Azure Migrate appliance](migrate-appliance.md) to discover on-premises servers. The appliance discovers on-premises servers, and sends metadata and performance data to Azure Migrate: Discovery and assessment. Set up an appliance for:
    - [Servers in VMware environment](how-to-set-up-appliance-vmware.md)
    - [Servers in Hyper-V environment](how-to-set-up-appliance-hyper-v.md)
    - [Physical servers](how-to-set-up-appliance-physical.md)

## Download and install the AMA agent

To deploy the Azure Monitor agent, it's recommended to first clean up the existing Service Map to avoid duplicates. Learn more.

Review the prerequisites to install the Azure Monitor Agent.

Download and run the script on the host machine as detailed in Installation options. To get the Azure Monitor agent and the Dependency agent deployed on the guest machine, create the Data collection rule (DCR) that maps to the Log analytics workspace ID.

In the transition scenario, the Log analytics workspace would be the same as the one that was configured for Service Map agent. DCR allows you to enable the collection of Processes and Dependencies. By default, it's disabled.

## Estimate the price change
You'll be charged for using a Log Analytics workspace. This was earlier free for the first 180 days. As per the pricing change, you'll be billed against the volume of data gathered by the AMA agent and transmitted to the workspace. To review the volume of data you're gathering, follow these steps:

Sign in to the Log analytics workspace.
Navigate to the Logs section and run the following query:
let AzureMigrateDataTables = dynamic(["ServiceMapProcess_CL","ServiceMapComputer_CL","VMBoundPort","VMConnection","VMComputer","VMProcess","InsightsMetrics"]); Usage  

| where StartTime >= startofday(ago(30d)) and StartTime < startofday(now()) 

| where DataType in (AzureMigrateDataTables)  

| summarize AzureMigrateGBperMonth=sum(Quantity)/1000 
Support for Azure Monitor agent in Azure Migrate
Install and manage Azure Monitor agent as mentioned here. Currently, you can download the Log Analytics agent through the Azure Migrate portal.

Next steps
Learn how to create dependencies for a group.

