---
title: Azure Copilot Run Oracle Agent
description: Learn what the Azure Copilot Run Oracle Agent is, its supported scenarios, and where you can use it.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: concept-article
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Azure Copilot Run Oracle Agent

Use Azure Copilot Run Oracle Agent to investigate configuration deviations and assess the impact of Azure platform issues on your Oracle workloads.

## What is Azure Copilot Run Oracle Agent?

Azure Copilot Run Oracle Agent adds workload-aware capabilities for Oracle systems to Azure Copilot, the AI assistant in the Azure portal. The agent uses the context of your Workload Virtual Instances (WVIs) to answer questions in natural language. You don't have to inspect each resource of the system yourself.

## Supported scenarios

- **Configuration deviation analysis**: Review the configuration deviations of an Oracle workload and get the steps to fix them.

- **Impact analysis**: Find out which virtual machines (VMs) of a *Workload Virtual Instance (WVI)* an Azure platform issue affected, why, and which components were affected.

## Where you can use the agent

You can open the agent from these places in the Azure portal:

- On the top bar of the portal, select **Copilot**, and then select **Run Oracle** under **Agents**.

- On the **Overview** page of Azure Workload Center for Oracle, select **View drifts** on the **Configuration checks** card.

- On the detail page of a check result, select **Click here for more suggestions**.

- When you open Run Oracle, select one of its suggested prompts, such as "List all my impacted workloads in last 1 hour".

For the steps, see [Get started with Run Oracle Agent](run-oracle-agent-get-started.md).
