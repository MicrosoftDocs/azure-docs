---
title: Prepare for deprecation of the Log Analytics MMA agent 
description: Learn how to prepare for the deprecation of the Log Analytics MMA agent in Microsoft Defender for Cloud
author: AlizaBernstein
ms.author: v-bernsteina
ms.topic: how-to
ms.date: 12/25/2023
---

# Prepare for deprecation of Log Analytics MMA

The Azure Log Analytics, Microsoft Monitor Agent (MMA) is [set to be retired in August 2024](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation). If you deployed the Defender for Servers or Defender for SQL Server on Machines plans within Microsoft Defender for Cloud, you can use the following table to help you prepare for deprecation.

| Are you using Defender for Servers? | Are you using FIM/EPP discovery/Baseline feature in Defender for Servers? | Are you using Defender for SQL servers on Machines? | What do I need to do? |
| --- | --- | --- | --- |
| Yes | No | No | 1. Enable Defender for Endpoint integration/agentless scanning.<br/>2. [Disable Log Analytics/Azure Monitor Agent](#disable-log-analytics-agentazure-monitor-agent-autoprovisioning).<br/>3. Uninstall MMA/AMA. |
|  No | - | Yes | 1. [Migrate to the new SQL autoprovisioning process](#migrate-to-the-sql-server-targeted-ama-autoprovisioning-process).<br/>2. [Disable ‘Log Analytics/Azure Monitor Agent](#disable-log-analytics-agentazure-monitor-agent-autoprovisioning).<br/>3. Uninstall MMA across all servers. |
| Yes | Yes | Yes | 1. [Migrate to the new SQL autoprovisioning process](#migrate-to-the-sql-server-targeted-ama-autoprovisioning-process).<br/>2. Enable Defender for Endpoint integration/agentless scanning.<br/>3. [Disable Log Analytics/Azure Monitor Agent](#disable-log-analytics-agentazure-monitor-agent-autoprovisioning).<br/>4. Uninstall MMA across all servers. |

## Prepare Defender for Servers

Defender for Servers has up until now relied on the Log Analytics agent (Microsoft Monitoring Agent-MMA) as mandatory, and the recommended agent for posture and threat protection capabilities in Azure and multicloud scenarios.

Towards Log Analytics Agent (MMA) deprecation, and as part of an updated deployment strategy  with a goal to simplify onboarding, all Defender for Servers security features and capabilities will be provided via a single agent (Microsoft Defender for Endpoint (MDE)), complemented by agentless scanning, without dependency on Log Analytics Agent (MMA) or Azure Monitoring Agent (AMA), the substitute agent.  

As a result, all Defender for Servers features and capabilities currently relying on Log Analytics Agent (MMA) will be deprecated in their Log Analytics version in August 2024, and delivered over one of the previously mentioned alternative infrastructures.

### Enable Defender for Endpoint integration/agentless scanning

Enable Defender for Endpoint integration and agentless disk scanning on your subscriptions. This step ensures you’ll seamlessly be up-to-date and receive all the alternative deliverables once they're provided, and without any extra migration. Learn more about [endpoint protection](integration-defender-for-endpoint.md) and [agentless scanning](concept-agentless-data-collection.md).

### Plan your migration according to your needs

All Defender for Servers features will be provided via Defender for Endpoint integration and agentless disk scanning, without any dependency on AMA or MMA.  Most of the features are already available in GA (General Availability) through the alternative platforms (MDE/agentless). The rest of the features will be provided in GA by April 2024, or deprecated. Learn about the [strategy for the Log Analytics deprecation plan](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).

Defender for Servers features that are currently provided in AMA's public preview aren't going to be released as GA, and will remain supported until an alternative version is provided based on Defender for Endpoint integration or agentless disk scanning.

We recommend that you plan your agents’ migration plan according to your organization’s requirements:  

| AMA required (for Defender for SQL scenario or other scenarios [e.g: Sentinel])| FIM/EPP discovery/baseline assessment is required as part of Defender for Servers | What should I do? |
|-----|-----|-----|
| No | Yes | You can remove MMA starting April 2024, using the GA version of Defender for Servers capabilities according to your needs (preview versions will be available earlier) |
| No | No | You can remove MMA immediately. |
| Yes | No | You can start migration from MMA to AMA immediately. |
| Yes | Yes | You can either start migration from MMA to AMA starting April 2024 or alternatively, you can immediately use both agents side by side to receive all GA capabilities. |

> [!NOTE]
> You can run both the Log Analytics and Azure Monitor Agents on the same machine. Each machine is billed once in Defender for Cloud. In cases where both agents are running on the machines, we recommend avoiding the collection of duplicate data by sending the data to different workspaces or alternatively disabling security event data collection by MMA. For more information, see the [migration guide](/azure/azure-monitor/agents/azure-monitor-agent-migration) and the [impact of running both agents](auto-deploy-azure-monitoring-agent.md#impact-of-running-with-both-the-log-analytics-and-azure-monitor-agents).

### Agents auto provision

The provisioning process that provided the installation and configuration of both agents (MMA/AMA), has been adjusted according to the plan as previously mentioned:

- Log Analytics Agent (MMA) auto-provisioning mechanism and its related policy initiative remains optional and supported through MDC platform until August 2024.
- Deploying Azure Monitor Agent (AMA) via the Defender for Cloud portal is available for SQL servers on machines, with the new deployment policy.
- The previous Azure Monitor Agent (AMA)-related public preview policy initiative will be supported until August 2024. We recommend migrating to the new [deployment policy](#migrate-to-the-sql-server-targeted-ama-autoprovisioning-process).

For more information about how to plan for this change, [see Microsoft Defender for Cloud - strategy and plan towards Log Analytics Agent (MMA) deprecation](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-strategy-and-plan-towards-log/ba-p/3883341).

> [!NOTE]
> If you have the Defender for SQL servers on machines plan enabled, read how to [prepare Defender for SQL Server on Machines for log analytics agent/Azure monitor agent dependency](#prepare-defender-for-sql-server-on-machines) as part of your migration planning.

## Prepare Defender for SQL Server on machines

Microsoft Monitoring Agent (MMA) is being deprecated in August 2024. As a result, a new SQL server-targeted Azure Monitoring Agent (AMA) autoprovisioning process was released. You can learn more about the [Defender for SQL Server on machines Log Analytics agent's deprecation plan](upcoming-changes.md#defender-for-sql-server-on-machines).

Customers using the current Log Analytics agent/Azure Monitor agent autoprovisioning process should [migrate to the new Azure Monitoring Agent for SQL server on machines autoprovisioning process](#migrate-to-the-sql-server-targeted-ama-autoprovisioning-process). The migration process is seamless and provides continuous protection for all machines.

### Migrate to the SQL server-targeted AMA autoprovisioning process

1. Sign-in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Microsoft Defender for Cloud**.
1. In the Defender for Cloud menu, select **Environment settings**.
1. Select the relevant subscription.
1. Under the Databases plan, select **Action required**.

    :::image type="content" source="media/prepare-deprecation-log-analytics-mma/select-action-required.png" alt-text="Screenshot that shows where to select action required." lightbox="media/prepare-deprecation-log-analytics-mma/select-action-required.png":::

1. In the pop-up window, select **Enable**.

    :::image type="content" source="media/prepare-deprecation-log-analytics-mma/select-enable-popup.png" alt-text="Screenshot that shows where to select enable." lightbox="media/prepare-deprecation-log-analytics-mma/select-enable-popup.png":::

1. Select **Save**.

### Disable Log Analytics agent/Azure Monitor agent autoprovisioning

Once the SQL server-targeted AMA autoprovisioning process has been enabled, you should disable the Log Analytics agent/Azure Monitor agent autoprovisioning process:

1. Sign-in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Microsoft Defender for Cloud**.
1. In the Defender for Cloud menu, select **Environment settings**.
1. Select the relevant subscription.
1. Under the Database plan, select **Settings & monitoring**.
1. Toggle the **Log Analytics agent/Azure Monitor** agent to **Off**.

    :::image type="content" source="media/prepare-deprecation-log-analytics-mma/disable-log-analytics.png" alt-text="Screenshot that shows where to disable Log Analytics agent/Azure Monitor." lightbox="media/prepare-deprecation-log-analytics-mma/disable-log-analytics.png":::

1. Select **Continue**.
1. Select **Save**.

## Next steps

See the [upcoming changes for the Defender for Cloud plan and strategy for the Log Analytics agent deprecation](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).
