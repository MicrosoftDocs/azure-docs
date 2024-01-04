---
title: Prepare for deprecation of the Log Analytics MMA agent 
description: Learn how to prepare for the deprecation of the Log Analytics MMA agent in Microsoft Defender for Cloud
author: AlizaBernstein
ms.author: v-bernsteina
ms.topic: how-to
ms.date: 12/28/2023
---

# Prepare for deprecation of the Log Analytics agent

The Log Analytics agent, also known as the Microsoft Monitoring Agent (MMA) is [set to be retired in August 2024](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation), and is replaced by the Azure Monitoring Agent (AMA).  These agents are used by the Defender for Servers and Defender for SQL Server on Machines plans in Microsoft Defender for Cloud. If you have these plans deployed, follow the instructions in this article to prepare for the Log Analytics agent deprecation.

## Preparing Defender for Servers

The Defender for Servers plan uses the Log Analytics agent and AMA (in public preview) for [a number of capabilities](plan-defender-for-servers-agents.md). 

- After August 2024, we're deprecating the use of the Log Analytics agent for Defender for Servers features.
- Going forward, all Defender for Servers capabilities will be provided by integration with Microsoft Defender for Endpoint, and agentless machine scanning.
- By enabling Defender for Endpoint integration and agentless scanning early, you ensure that your Defender for Servers deployment stays up to date and supported.

> [!NOTE]
> Defender for Servers features that use AMA in public preview won't be released in GA with AMA support. Their use with AMA will remain supported until the features are fully supported by Defender for Endpoint integration or agentless scanning.

## Preparing Defender for SQL on Machines

A new SQL-targeted AMA auto provisioning process replaces the use of the Log Analytics agent in Defender for SQL on Machines. Migration to AMA auto provisioning is seamless, and ensures continuous VM protection.

## Planning the migration schedule

Most of the features currently supported by the Log Analytics agent/AMA in Defender for Servers and Defender for SQL on Machines are already generally available with Microsoft Defender for Endpoint integration or agentless scanning. The rest of the features will be provided by August 2024, or will be deprecated. The following table summarizes how agent provisioning will be deprecated.

| Agent auto-provisioning | Plan | Details |
| --- | --- | --- |
| Log Analytics agent | Defender for Servers, Defender for SQL on Machines | Log Analytics auto-provisioning and its related policy initiative remains optional and supported in Defender for Cloud until August 2024.|
| AMA | Defender for SQL on Machines | Available with a new deployment policy. |
| AMA | Defender for Servers | The AMA policy in public preview remain supported until August 2024 |

Based on these dates, here's how we recommend that you schedule the migration.

| AMA agent (Defender for SQL on Machines or other scenarios)? | Defender for Servers with one or more of these features: Foundational security posture recommendations, file integrity monitoring, endpoint protection with integrated Defender for Endpoint, adaptive application control | Migration schedule |
| --- | --- | --- |
| No | Yes | For GA of all features with Defender for Endpoint integration or agentless scanning, remove Log Analytics agent after August 2024.<br/>Public preview of features available earlier.|
| No | No | Remove the Log Analytics agent now.|
| Yes | No | Migrate from the Log Analytics agent to AMA now.|
| Yes | Yes | Use the Log Analytics agent and AMA side-by-side to ensure all capabilities are GA. [Learn more](auto-deploy-azure-monitoring-agent.md) about running side-by-side.<br/> Alternatively, start migration from Log Analytics agent to AMA now. |

## Migration steps

The following table summarizes the migration steps you need to take. Select the scenario that's appropriate for your environment.

| Scenario | Recommended action |
| --- | --- |
|:::image type="icon" source="./media/icons/yes-icon.png"::: Defender for SQL on Machines is enabled.<br/>:::image type="icon" source="./media/icons/no-icon.png"::: Defender for Servers isn't enabled. | [Migrate to SQL autoprovisioning for AMA](defender-for-sql-autoprovisioning.md). |
| :::image type="icon" source="./media/icons/yes-icon.png"::: Defender for SQL on Machines is enabled.<br/>:::image type="icon" source="./media/icons/yes-icon.png"::: Defender for Servers is enabled.<br/><br/>You need one or more of these Defender for Server features: Foundational security posture recommendations, file integrity monitoring, endpoint protection with integrated Defender for Endpoint, adaptive application control.| [1. Enable Defender for Endpoint integration in Defender for Servers.](integration-defender-for-endpoint.md)<br/>[2. Enable agentless scanning in Defender for Servers.](concept-agentless-data-collection.md)<br/>[3. Migrate to SQL auto provisioning for AMA in Defender for SQL on Machines.](defender-for-sql-autoprovisioning.md).<br/>[4. Disable the Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/> 5. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud.|
| :::image type="icon" source="./media/icons/yes-icon.png"::: Defender for SQL on Machines is enabled.<br/>:::image type="icon" source="./media/icons/yes-icon.png"::: Defender for Servers is enabled.<br/><br/>You don't need any Defender for Server features described in the row above. | [1. Migrate to SQL auto provisioning for AMA in Defender for SQL on Machines.](defender-for-sql-autoprovisioning.md).<br/>[2. Disable the Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/> 3. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |
| :::image type="icon" source="./media/icons/no-icon.png"::: Defender for SQL on Machines isn't enabled.<br/>:::image type="icon" source="./media/icons/yes-icon.png"::: Defender for Servers is enabled.<br/><br/>You need one or more of these Defender for Server features: Foundational security posture recommendations, file integrity monitoring, endpoint protection with integrated Defender for Endpoint, adaptive application control. | [1. Enable Defender for Endpoint integration in Defender for Servers.](integration-defender-for-endpoint.md)<br/>[2. Enable agentless scanning in Defender for Servers.](concept-agentless-data-collection.md)<br/>[3. Disable the Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>4. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |
| :::image type="icon" source="./media/icons/no-icon.png"::: Defender for SQL on Machines isn't enabled<br/>:::image type="icon" source="./media/icons/yes-icon.png"::: Defender for Servers is enabled.<br/><br/>You don't need any Defender for Servers features described in the row above. | [1. Enable Defender for Endpoint integration in Defender for Servers.](integration-defender-for-endpoint.md)<br/>[2. Enable agentless scanning in Defender for Servers.](concept-agentless-data-collection.md)<br/>[3. Disable the Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>4. Uninstall the Log Analytics agent and the AMA on all machines protected by Defender for Cloud. |

## Next steps

See the [upcoming changes for the Defender for Cloud plan and strategy for the Log Analytics agent deprecation](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).
