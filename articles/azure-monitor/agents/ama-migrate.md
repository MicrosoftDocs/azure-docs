---
title: Migrate to the Azure Monitor agent (AMA) from the Log Analytics agent (MMA/OMS) for Microsoft Sentinel
description: Learn about migrating from the Log Analytics agent (MMA/OMS) to the Azure Monitor agent (AMA), when working with Microsoft Sentinel.
author: batamig
ms.topic: reference
ms.date: 12/28/2021
ms.author: bagol
---

# AMA migration for Microsoft Sentinel

This article describes the migration process to the Azure Monitor Agent (AMA) when you have an existing Log Analytics Agent (MMA/OMS), and are working with Microsoft Sentinel. Start with the [Azure Monitor documentation](/azure/azure-monitor/agents/azure-monitor-agent-migration) which provides an agent comparison and general information for this migration process. This article provides specific details and differences for Microsoft Sentinel.



> [!IMPORTANT]
> The Log Analytics agent will be [retired on **31 August, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you are using the Log Analytics agent in your Microsoft Sentinel deployment, we recommend that you start planning your migration to the AMA.
>

## Recommended migration plan

Each organization will have different metrics of success and internal migration processes. This section provides suggested guidance to considered when migrating from the Log Analytics MMA/OMS agent to the AMA, specifically for Microsoft Sentinel.

**Include the following steps in your migration process**:

1. Make sure that you've considered your environmental requirements and understand the gaps between the different agents. For more information, see [Plan your migration](#plan-your-migration).

1. Run a proof of concept to test how the AMA sends data to Microsoft Sentinel, ideally in a development or sandbox environment.

    1. To connect your Windows machines to the [Windows Security Event connector](data-connectors-reference.md#windows-security-events-via-ama), start with **Windows Security Events via AMA** data connector page in Microsoft Sentinel. For more information, see [Windows agent-based connections](connect-azure-windows-microsoft-services.md#windows-agent-based-connections).

    1. Go to the **Security Events via Legacy Agent** data connector page. On the **Instructions** tab, under **Configuration** > Step 2, **Select which events to stream**, select **None**. This configures your system so that you won't receive any security events through the MMA/OMS, but other data sources relying on this agent will continue to work. This step affects all machines reporting to your current Log Analytics workspace.

    > [!IMPORTANT]
    > Ingesting data from the same source using two different types of agents will result in double ingestion charges and duplicate events in the Microsoft Sentinel workspace. 
    >
    > If you need to keep both data connectors running simultaneously, we recommend that you do so only for a limited time for a benchmarking, or test comparison activity, ideally in a separate test workspace.
    >

1. Measure the success of your proof of concept. Success criteria should include a statistical analysis and comparison of the quantitative data ingested by the MMA/OMS and AMA agents on the same host:

    - Measure your success over a predefined time period that represents a normal workload for your environment.

    - While testing, make sure to test each new feature provided by the AMA, such as Linux multi-homing, Windows event filtering, and so on.

    - Plan your rollout for AMA agents in your production environment according to your organization's risk profile and change processes.

1. Roll out the new agent on your production environment and run a final test of the AMA functionality.

1. Disconnect any data connectors that rely on the legacy connector, such as Security Events with MMA. Leave the new connector, such as Windows Security Events with AMA, running.

    While you can have both the legacy MMA/OMS and the AMA agents running in parallel, prevent duplicate costs and data by making sure that each data source uses only one agent to send data to Microsoft Sentinel.

1. Check your Microsoft Sentinel workspace to make sure that all your data streams have been replaced using the new AMA-based connectors.

1. Uninstall the legacy agent. For more information, see [Manage the Azure Log Analytics agent ](/azure/azure-monitor/agents/agent-manage#uninstall-agent).



## Next steps

For more information, see:

- [Overview of the Azure Monitor agents](/azure/azure-monitor/agents/agents-overview)
- [Migrate from Log Analytics agents](/azure/azure-monitor/agents/azure-monitor-agent-migration)
- [Windows Security Events via AMA](data-connectors-reference.md#windows-security-events-via-ama)
- [Security events via Legacy Agent (Windows)](data-connectors-reference.md#security-events-via-legacy-agent-windows)
- [Windows agent-based connections](connect-azure-windows-microsoft-services.md#windows-agent-based-connections)