---
title: Plan and Analyze VMware Migrations to Azure Using Azure Catalyst agent
description: Learn how to plan and analyze VMware migrations to Azure using Azure Catalyst agent. Explore inventory, readiness, ROI, and landing zone design before migration execution.
ms.topic: how-to
author: ShubhamJain1992
ms.author: shuj
ms.service: azure-migrate
ms.reviewer: v-gajeronika
ms.date: 03/12/2026
ms.update-cycle: 180-days
monikerRange: migrate 
# Customer intent: Customers plan and analyze VMware migrations to Azure using Azure Catalyst agent, including inventory review, readiness assessment, cost and ROI analysis, and Azure landing zone design—before migration execution in Azure Catalyst.
---

# Plan and analyze VMware migrations using Azure Catalyst agent

This article explains how to plan and analyze a VMware migration to Azure by using Azure Catalyst agent. Use the agent to explore migration paths, review discovered inventory, analyze costs and readiness, and design an Azure landing zone.

>[!NOTE]
> Azure Catalyst agent supports migration planning and analysis only.
> It doesn't perform migration execution. When you're ready to execute the migration, such as starting replication or completing the cutover, perform these actions in the Azure Catalyst portal.

## End-to-end migration workflow with Azure Catalyst agent

The following table walks you through how to use the Azure Catalyst agent to plan and assess a VMware‑to‑Azure migration. The table shows each step, the action you take, the prompt you use, and the response you can expect from the agent.

| Steps | Action | Prompt | Azure Catalyst agent response | Description |
|------|--------|--------|--------------------------|-------------|
| **Step 1: Launch the Catalyst agent and define the migration goal** | Sign in to the Azure portal and launch Azure Catalyst agent. | Help me explore migration paths for VMware workloads moving to Azure quickly. | Explains journey steps, offers step-by-step guidance. | The agent outlines the migration planning journey and suggests next steps based on your goal. |
| **Step 2: Choose discovery method** | **Option 1: Quick discovery using RVTools**<br>Use this option if you want a fast, lightweight inventory.<br> 1. Run RVTools against your VMware environment.<br> 2. Export the inventory to an .xlsx file.<br> 3. Upload the file in the Catalyst agent chat. | Import the RVTools file. | Inventory summary, option to proceed to business case. | The agent summarizes the discovered inventory and confirms that you can proceed with analysis, such as business case creation. |
| | **Option 2: Comprehensive discovery by using Azure Catalyst appliance**<br>Use this option if you want continuous discovery and performance-based insights.<br> 1. Generate a Catalyst project key.<br>2. Deploy the Azure Catalyst appliance (OVA) in VMware.<br>3. Register the appliance by using the project key.<br><br>After deployment, confirm discovery with the agent. | I deployed the appliance. Can you verify? | Connection and discovery verification, workload summary, advisement on performance data collection. | The agent verifies connectivity, confirms discovery status, and summarizes the workloads detected. It also advises collecting performance data when applicable. |
| **Step 3: Review and summarize inventory** | After inventory data is available, ask the agent to analyze and organize your workloads. | Summarize the discovered workloads. | Categorized summary, next steps suggestion. | The agent provides a categorized inventory summary and suggests relevant next analysis steps. |
| **Step 4: Analyze ROI and Business Case** | Use the agent to review ROI, cost drivers, and migration scenarios. | Provide the ROI analysis summary for migration.<br><br>**Optional prompt**: How are the savings achieved? Compare the ROI of moving to AVS instead of Azure VMs. | Business case report (savings, cost breakdowns, drivers), report export.<br><br>Cost driver details, Azure VMs vs. AVS comparison. | The agent generates a business case with cost estimates, savings drivers, and comparison details. You can also compare different target options, such as Azure Virtual Machines versus Azure VMware Solution (AVS). |
| **Step 5: Assess Azure readiness of workloads** | Evaluate whether your VMware workloads are ready to move to Azure. | What is the readiness of my workloads for migrating to Azure VMs?<br><br>**Follow-up prompt**: Summarize the assessment for my workloads. | Triggers assessment, notification on completion.<br><br>Readiness report, blockers, sizing, cost estimates, recommendations. | The agent reports readiness status, blockers, sizing recommendations, and estimated costs. |
| **Step 6: Create and configure Azure landing zone** | Use the agent to reason about Azure landing zone architecture based on your requirements.<br> 1. Ask the agent to explain landing zones.<br> 2. Provide subscription and governance details.<br> 3. Share region, compliance, and networking requirements. | What is a landing zone?<br><br>Here are my subscription IDs: `X` for management and identity, `Y` for connectivity.<br><br>Our workloads are deployed only in the Central India region. Our compliance requires Palo Alto firewall. | Concept explanation, subscription ID request.<br><br>Confirms management structure, asks networking preferences.<br><br>Architecture recommendation, downloadable template (for example,  Terraform), policies, monitoring, identity setup. | The agent recommends an architecture aligned to your input and may provide deployable templates (such as Terraform), along with guidance on identity, networking, policies, and monitoring. |

**Continue the remaining steps in the Azure Catalyst portal**:

- To continue with the remaining steps, go to the Azure Catalyst portal and perform the migration execution there.
- You can continue asking questions about concepts in this chat, but you must complete all migration execution tasks in the Azure Catalyst portal.
- For execution guidance, see [Server migration overview in Azure Catalyst](server-migrate-overview.md).

## Related content

- [Discover servers running in a VMware environment with Azure Catalyst appliance](tutorial-discover-vmware.md)
- [Import VMware inventory using RVTools (preview)](tutorial-import-vmware-using-rvtools-xlsx.md).