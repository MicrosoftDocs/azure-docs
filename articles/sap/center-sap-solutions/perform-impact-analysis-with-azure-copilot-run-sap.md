---
title: Perform Impact Analysis with Azure Copilot Run SAP Agent
description: Perform impact analysis with Azure Copilot Run SAP Agent to pinpoint workload degradation causes across correlated Azure VM events. Learn how.
ms.date: 11/06/2026
ms.topic: concept-article
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
author: vaidehikher18
ms.author: vaidehikher
ms.reviewer: mattmcinnes
ai-usage: ai-assisted
---

# Perform impact analysis with Azure Copilot Run SAP Agent

The Azure Copilot Run SAP Agent helps identify the underlying cause of workload degradation by correlating workload impact signals across Azure services. It correlates Azure platform signals, such as virtual machine (VM) availability events, with the Workload Virtual Instance (WVI) topology. It provides an evidence-based view of platform events along with a clear blast radius analysis to help you understand which components were impacted and why.
  
> [!IMPORTANT]
> Currently, the agent only analyzes impacts on Azure Virtual Machines.

## Using the Azure Copilot Run SAP Agent for impact analysis

The **Azure Copilot Run SAP Agent** provides natural language access to event correlation data. You can ask the agent to:

- Find the reason for the impact on a VM in a WVI.

- List all VMs and components that an issue affected.

- Show the blast radius of an issue across WVIs in a region.

- Summarize the findings and the impact.

> [!NOTE]
> Include the WVI name, or the region and the date and time of the impact in your prompt.

> [!IMPORTANT]
> Impact analysis is a point-in-time snapshot. You might need to prompt again for updated results.

:::image type="content" source="media/impact-analysis/run-sap-agent-root-cause-analysis-chat.png" alt-text="Illustration reconstructed from a Run SAP Agent screenshot showing completed reasoning activity with RCA fetching steps for WVI CONTOSO_ZP1." lightbox="media/impact-analysis/run-sap-agent-root-cause-analysis-chat.png":::

## What the Azure Copilot Run SAP Agent response contains

When the agent finishes, it shows the impact summary and a list of impacted resources. The list has one row for each affected resource, with these columns:

- **WVI Name:** the WVI that contains the resource.

- **Workload Type:** SAP

- **Component Type:** the component that contains the resource, such as applicationservices or centralservices.

- **Affected Resource:** the resource ID of the impacted VM.

- **Reason For Impact:** why the VM was impacted, such as VirtualMachineRestarted.

:::image type="content" source="media/impact-analysis/run-sap-agent-impact-analysis-results.png" alt-text="Illustration reconstructed from a Run SAP Agent results table showing affected Azure VMs in contoso_zp1, with resource IDs redacted and VirtualMachineRestarted as the reason for impact." lightbox="media/impact-analysis/run-sap-agent-impact-analysis-results.png":::

The agent also creates a JSON file with the full blast radius of the impact. You can open or download it.

:::image type="content" source="media/impact-analysis/run-sap-agent-impact-assessment.png" alt-text="Screenshot of Run SAP Agent summarizing affected Azure VMs and workload virtual instances." lightbox="media/impact-analysis/run-sap-agent-impact-assessment.png":::

:::image type="content" source="media/impact-analysis/blast-radius-json-artifact-view.png" alt-text="Screenshot of Azure Copilot showing the downloadable JSON artifact for the affected Azure VMs." lightbox="media/impact-analysis/blast-radius-json-artifact-view.png":::

## Sample prompts

- What was the reason for impact in WVI \<*WVI name*\> on \<timestamp\>?

- The VM \<*name*\> was impacted in \<*Azure region*\> on \<*timestamp*\>. Can you provide complete blast radius of impact?

- List all impacted non-production WVIs and their affected VMs in \<*Azure region*\> on *\<timestamp\>.*

## Limitations during limited preview using Azure Copilot Run SAP Agent for Impact Analysis

- The agent needs the following required inputs: impact time, time zone, region, or VM name.

- If you don't specify a time zone in your prompt, the agent uses UTC by default.

- If you don't provide an impact time, the agent uses a window of one hour before or after the current UTC time.

- The agent can only retrieve results for events that occurred within the last 30 days.

- WVI coverage across more than three regions can cause the agent to select only the first three regions.

## Simulate and test impact analysis by using Azure Copilot Run SAP Agent

To try the impact analysis prompts, test them by using controlled or simulated impacts on your VMs.

**Option 1: Use existing Azure platform issue that impacts WVI**

- Find a recent issue that affected a VM in nonproduction or production WVI.

- Capture the timestamp when the issue occurred.

- Run the impact analysis prompt for that time.

**Option 2: Create an impact on Virtual Machines of WVI**

- Stop or restart a VM in a nonproduction WVI.

- Note the timestamp and the VM name.

- Wait 10-15 minutes for telemetry to be available.

- Run the impact analysis prompt with the WVI name and the time.
