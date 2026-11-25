---
title: Perform impact analysis with Run Oracle Agent
titleSuffix: Azure Workload Center for Oracle
description: Learn how to use the Run Oracle Agent to find which Azure virtual machines in an Oracle workload an Azure platform issue affected.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: how-to
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Perform impact analysis with Run Oracle Agent

Use impact analysis to troubleshoot an Oracle workload when its Azure virtual machines are impacted, such as by a restart or a migration for repair. The Azure Copilot Run Oracle Agent checks the events of the Azure virtual machines that are mapped to the Workload Virtual Instance (WVI). It shows which resources were impacted, why, and which components were affected.

> [!NOTE]  
> Impact analysis covers impacts on Azure virtual machines in the WVI. It doesn't yet show how an issue in another resource, such as a database, affects other resources.

## Prerequisites

- Enroll the Oracle system as a WVI. Impact analysis works only for Azure virtual machines that are mapped to a component.

- On the top bar of the Azure portal, select **Copilot**.

:::image type="content" source="media/impact-analysis/copilot-new-chat-run-oracle.png" alt-text="Screenshot that shows the New chat menu in Copilot with Run Oracle selected under Agents." lightbox="media/impact-analysis/copilot-new-chat-run-oracle.png":::

- Select the arrow next to **New chat**, and then select **Run Oracle** under **Agents**.

:::image type="content" source="media/impact-analysis/run-oracle-start-page.png" alt-text="Screenshot that shows the Run Oracle start page with suggested prompts." lightbox="media/impact-analysis/run-oracle-start-page.png":::

## Use Azure Copilot Run Oracle Agent for impact analysis

You can ask the agent to:

- Find the reason that an Azure virtual machine of a WVI was impacted

- List the Azure virtual machines and components that an issue affected

- Show the impact of an issue on Azure virtual machines across WVIs in a region

Include the WVI name or the region, and the date and time of the impact, in your prompt.

## What the answer contains

When the agent finishes, it shows a summary of the impact and a list of impacted resources. Select **Show activity** to see each step.

The answer has a table with one row for each impacted resource. The table has these columns:

- **WVI Name**: the WVI that contains the resource

- **Workload Type**: the workload type, such as `oracle`

- **Environment Type**: the environment, such as production

- **Component Type**: the component that contains the resource, such as applicationservices

- **Affected Resource**: the resource ID of the impacted Azure virtual machine

- **Reason For Impact**: why the Azure virtual machine was impacted, such as VirtualMachineMigrationInitiatedForRepair

The agent also creates a JSON file with the full blast radius of the impact. You can open or download it.

:::image type="content" source="media/impact-analysis/impact-analysis-answer.png" alt-text="Screenshot that shows an impact analysis answer with the affected resource, the reason for the impact, and the blast radius JSON file." lightbox="media/impact-analysis/impact-analysis-answer.png":::

## Example prompts

- My Oracle WVI \<WVI name> app component seems to be degraded on \<timestamp\>. Can you determine what happened and what other components are affected?

- What was the reason for impact in WVI \<WVI name> on \<timestamp\>?

- The Azure virtual machine \<virtual machine name> was impacted in \<Azure region> on \<timestamp\>. What is the complete blast radius of the impact?

- List all impacted non-production WVIs and their affected Azure virtual machines in \<Azure region> on \<timestamp\>.

- List all my impacted workloads in the last hour.

## Test impact analysis

To test impact analysis, use a recent platform issue, or create a controlled impact on a non-production Azure virtual machine.

**Option 1: Use a recent Azure platform issue**

1.  Find a recent issue that affected an Azure virtual machine of a WVI.

2.  Note the time of the issue.

3.  Run an impact analysis prompt for that time.

**Option 2: Create an impact on an Azure virtual machine**

1.  Stop or restart an Azure virtual machine of a non-production WVI.

2.  Note the time and the virtual machine name.

3.  Wait for 5 to 15 minutes for telemetry to arrive.

4.  Run an impact analysis prompt with the WVI name and the time.
