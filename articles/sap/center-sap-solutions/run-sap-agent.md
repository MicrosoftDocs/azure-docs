---
title: Azure Copilot Run SAP Agent
description: Azure Copilot Run SAP agent helps you investigate SAP systems on Azure using natural language queries. Learn how it works and what it supports.
ms.date: 11/06/2026
ms.topic: concept-article
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.author: vaidehikher
ms.reviewer: mattmcinnes
---

# Azure Copilot Run SAP agent

Azure Copilot Run SAP agent extends Azure Copilot with workload-aware capabilities for SAP systems running on Azure. Use it to investigate configuration, retrieve current settings, and analyze the impact of Azure VM events in the context of your SAP workload.

## What is Azure Copilot Run SAP agent?

The agent uses the workload context available through Azure Workload Center for SAP to help you investigate your SAP systems and the Azure resources associated with them. You can ask questions in natural language and use the agent to analyze configuration or investigate operational issues without navigating individually across the resources that make up the SAP workload.

The context comes from a [workload virtual instance (WVI)](workload-virtual-instance-overview.md), which represents the SAP system, its components, and its supporting Azure resources. Include the WVI name in your request so that the agent can focus the investigation on the workload you want to examine.

## Supported scenarios

Run SAP agent currently supports the following key scenarios:

- **Configuration drift analysis:** Investigate configuration deviations identified for an SAP workload and get guidance to help remediate them.

- **Configuration retrieval:** Retrieve configuration information for an SAP workload and compare configuration values across workloads.

- **Impact analysis:** Investigate Azure VM-related workload degradation and understand the affected resources and workload impact.

## Choose a scenario

| Your task | What to include in your request | Guidance |
| --- | --- | --- |
| Retrieve or compare configuration values | The WVI name or names and the configuration item, such as a kernel version or SAP profile parameter. | [Retrieve configuration values](retrieve-remediate-configuration-drift-with-run-sap.md#configuration-retrieval-by-using-azure-copilot-run-sap-agent). |
| Generate remediation steps for configuration deviations | The WVI name and the check or deviations you want to address. | [Generate and review a remediation script](retrieve-remediate-configuration-drift-with-run-sap.md#workload-aware-remediation). |
| Investigate the impact of an Azure VM event | The WVI or VM name, region, and time of the impact, including the time zone. | [Perform impact analysis](perform-impact-analysis-with-azure-copilot-run-sap.md). |

For example, ask the agent to compare the kernel versions of two WVIs, retrieve the current value of a profile parameter, or explain which components an Azure VM restart affected. The scenario articles provide sample prompts and describe the information the agent returns.

## Get started

1. Review the [prerequisites and resource access requirements](get-started-with-run-sap-agent.md#prerequisites-for-using-run-sap-agent).
1. Open Azure Copilot from Azure Workload Center for SAP in the Azure portal.
1. Select **Run SAP** from the agent picker.
1. Enter a request that identifies the workload and the setting or event you want to investigate.

> [!IMPORTANT]
> Select **Run SAP** each time you start a new Copilot conversation. Otherwise, general Azure Copilot handles your request instead of the Run SAP agent.

## Review results before taking action

Configuration retrieval is read-only. For remediation, the agent generates a script for you to download and review; it doesn't run the script automatically. Review the steps, distinguish disruptive changes from nondisruptive changes, and test generated scripts on nonproduction systems before you run them.

Impact analysis provides a point-in-time view of correlated Azure platform events and the affected workload components. Prompt again when you need updated results. During limited preview, impact analysis covers Azure VMs and events from the past 30 days. See the [impact analysis limitations](perform-impact-analysis-with-azure-copilot-run-sap.md#limitations-during-limited-preview-using-azure-copilot-run-sap-agent-for-impact-analysis) before planning an investigation.

## Next steps

- [Get started with Run SAP agent](get-started-with-run-sap-agent.md).
- [Retrieve and remediate configuration drift](retrieve-remediate-configuration-drift-with-run-sap.md).
- [Perform impact analysis](perform-impact-analysis-with-azure-copilot-run-sap.md).
