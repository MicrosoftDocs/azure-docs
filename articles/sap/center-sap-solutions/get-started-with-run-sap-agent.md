---
title: Get started with Run SAP agent in Azure Copilot
description: Get started with Run SAP agent to manage SAP workloads using natural-language prompts in Azure Copilot. Learn setup steps and prerequisites.
ms.date: 11/06/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
author: vaidehikher18
ms.author: vaidehikher
ms.reviewer: mattmcinnes
ai-usage: ai-assisted
---

# Get started with Run SAP agent

Azure Copilot Run SAP agent provides a natural-language experience for working with SAP workloads onboarded to Azure Workloads Center for SAP.

This article introduces Run SAP agent, the key scenarios it supports, prerequisites for using the agent, and how to get started.

## Prerequisites for using Run SAP agent

Before you use Run SAP agent, ensure you meet the following prerequisites:

- **Azure Copilot access:** You must have access to Azure Copilot. By default, Azure Copilot is available to all users in a tenant unless the tenant admin restricts access.

- **SAP workload onboarding:** The SAP workload that you want to investigate must be onboarded to Azure Workloads Center for SAP as a workload virtual instance (WVI).

- **Resource access:** You must have the required permissions to access the workload and the Azure resources that you want to investigate.

Individual Run SAP agent scenarios can have additional prerequisites. Review the prerequisites for the scenario that you want to use before you begin.

Run SAP agent is available through Azure Copilot in the Azure portal.

1.  Sign in to the **Azure portal**.

2.  Open **Azure Workloads Center for SAP**.

3.  From the top bar, select **Copilot**.

4.  From the agent picker, select **Run SAP**.

    :::image type="content" source="media/run-agent/copilot-agent-picker-run-sap.png" alt-text="Screenshot of Copilot agent picker with Run SAP highlighted in the Agents list." lightbox="media/run-agent/copilot-agent-picker-run-sap.png":::

    :::image type="content" source="media/run-agent/run-sap-agent-chat-interface.png" alt-text="Screenshot of Run SAP agent in Copilot with suggested prompts for workload scenarios." lightbox="media/run-agent/run-sap-agent-chat-interface.png":::

5.  Enter your request in natural language.

> [!IMPORTANT]
> Select **Run SAP** when you start a new Copilot conversation to ensure Run SAP agent handles your request.

After you select Run SAP, enter a prompt for one of the supported SAP workload scenarios.

Where applicable, include the WVI or resource that you want to investigate in your prompt. Some scenarios might require additional context, such as the time of an operational impact.

For scenario-specific guidance, see:

- [Retrieve and remediate configuration drift with Run SAP agent](retrieve-remediate-configuration-drift-with-run-sap.md).

- [Perform impact analysis with Run SAP agent](perform-impact-analysis-with-azure-copilot-run-sap.md).
