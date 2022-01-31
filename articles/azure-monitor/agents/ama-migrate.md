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

## Deploying the AMA at scale with Azure Policy

Use an Azure policy to deploy the AMA at scale, as described in the main [Azure Monitor agent migration](/azure/azure-monitor/agents/azure-monitor-agent-migration) documentation. As the guidance there describes, you must first create a Data Collection Rule (DCR) to select the events you want to collect as well as the destination. When working with Microsoft Sentinel, the instructions will vary per connector. For more information, see:

- **Microsoft Sentinel-specific events**: [Windows agent-based connections](connect-azure-windows-microsoft-services.md#windows-agent-based-connections)
- **Events that are not specific to Microsoft Sentinel**, such as performance counters: [Data collection rules in Azure Monitor](/azure/azure-monitor/agents/data-collection-rule-overview)

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

## FAQs

### Why should I use the AMA or migrate my MMA to AMA?

The AMA replaces the [Log Analytics agent](/azure/azure-monitor/agents/log-analytics-agent), the [Azure Diagnostics extension](/azure/azure-monitor/agents/diagnostics-extension-overview), and the [Telegraf Agent](/azure/azure-monitor/essentials/collect-custom-metrics-linux-telegraf). The AMA offers a higher rate of EPS with a lower footprint, providing enhanced filtering features, scalable deployment management and configuration using DCRs and Azure policies.

While the AMA has not yet reached full parity with the MMA, we continue to add features and support and the MMA will be retired on August 31, 2024.

For more information, see the [Azure Monitor Agent overview](/azure/azure-monitor/agents/azure-monitor-agent-overview).
### Is Azure Arc required for AAD-joined machines?

Yes, any on-prem server, or non-Azure cloud server, must be on Azure Arc to run the AMA. For more information, see [About Azure Arc](/azure/azure-arc/overview).

### Will I duplicate events if I use the Security Events via Legacy Agent and Windows Security Events via AMA connectors at the same time? How can I avoid duplication?

If you are collecting the same events with both agents, yes, there will be duplication.  We recommend duplicating events only while you transition from one agent to the other.

After you've fully tested the DCR that sends events to Microsoft Sentinel, we recommend disconnecting the MMA data connector that works specifically with Microsoft Sentinel.

### What happens if I run both MMA/OMS and AMA in parallel in my Microsoft Sentinel deployment?

Both the AMA and MMA/OMS agents can co-exist on the same machine. If they both send data, from the same data source to an Microsoft Sentinel workspace, at the same time, from a single host, duplicate events and double ingestion charges will occur.

For your production rollout, we recommend that you configure *either* an MMA/OMS agent *or* the AMA for each data source.

### Does AMA work with on-premises and other cloud machines?

Yes, but you need to install the Azure Arc Connected Machine agent on these machines for the AMA to function. Azure Arc is free of charge for this purpose. For more information, see [Pricing – Azure Arc](https://azure.microsoft.com/pricing/details/azure-arc/).

### Why do I need to install the Azure Arc Connected Machine agent to use AMA?

The AMA authenticates to your workspace via managed identity, which is created when you install the Connected Machine agent. The legacy Log Analytics agent authenticate using the workspace ID and key instead, and therefore did not need Azure Arc.

### What impact does installing the Azure Arc Connected Machine agent have on my non-Azure machine?

There is no impact to the machine once the Azure Arc is installed. It hardly uses system or network resources, and is designed to have a low footprint on the host where it’s run.

### The AMA doesn’t yet have the features my Microsoft Sentinel deployment needs to work. Should I migrate yet?

The legacy Log Analytics agent will be retired on 31 August 2024.

We recommend that you keep up to date with the new features being released for the AMA over time, as it reaches towards parity with the MMA/OMS. Aim to migrate as soon as the features you need to run your Microsoft Sentinel deployment are available in the AMA.

While you can run the MMA and AMA simultaneously, you may want to migrate each connector, one at a time, while running both agents. <!-- unclear when this will result in duplicate costs / data ingested-->

### How can I validate my XPATH queries on the AMA?

Use the [Get-WinEvent](/powershell/module/microsoft.powershell.diagnostics/get-winevent) PowerShell cmdlet **-FilterXPath** parameter to test the validity of an XPath query. For more information, see the tip provided in the [Windows agent-based connections](connect-azure-windows-microsoft-services.md#instructions-3) instructions.

> [!NOTE]
> The [Get-WinEvent](/powershell/module/microsoft.powershell.diagnostics/get-winevent) PowerShell cmdlet supports up to 23 expressions, which Azure Monitor DCRs support up to 20. Also `>` and `<` characters must be encoded as `&gt;` and `&lt;` in your DCR.

### What roles do I need to create a DCR that collects events from my servers?

 - [Monitoring contributor](/azure/role-based-access-control/built-in-roles#monitoring-contributor): Required to create a DCR and an association between the DCR and the machine. If your DCR, your server, and your Log Analytics workspace are in different resource groups, you will need to have a Monitoring contributor role in each resource group.

- [Contributor](/azure/role-based-access-control/built-in-roles#contributor): You must have a Contributor role in the resource group where you are creating the DCR.

- [Virtual machine contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor): The AMA is automatically deployed when you first deploy a DCR in a VM, if it was not already installed. Therefore, if you don't yet have the AMA installed, you must have a Virtual machine contributor role in the server in order to install the agent.

### If I create DCRs that contain the same event ID and associate it to the same VM, will the events be duplicated?

Yes. To avoid duplication, please make sure the event selection you make in your Data Collection Rules does not contain duplicate events.

## Next steps

For more information, see:

- [Overview of the Azure Monitor agents](/azure/azure-monitor/agents/agents-overview)
- [Migrate from Log Analytics agents](/azure/azure-monitor/agents/azure-monitor-agent-migration)
- [Windows Security Events via AMA](data-connectors-reference.md#windows-security-events-via-ama)
- [Security events via Legacy Agent (Windows)](data-connectors-reference.md#security-events-via-legacy-agent-windows)
- [Windows agent-based connections](connect-azure-windows-microsoft-services.md#windows-agent-based-connections)