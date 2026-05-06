---
title: Azure Copilot Migration Agent (preview)
description: Azure Copilot migration agent is a planning‑focused Copilot experience that helps you analyze migrations using Azure Migrate data, including readiness, strategy, ROI, and landing zone insights (preview).
ms.topic: overview
author: ankurgupta2212
ms.author: ankug
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 04/15/2026
monikerRange: migrate 
# Customer intent: Use this article to learn how Azure Copilot migration agent helps you plan and analyze migrations by reasoning over Azure Migrate data, including supported scenarios, available capabilities, and example interactions.
---

# Azure Copilot migration agent (preview)

Azure Copilot migration agent is a planning‑focused experience that helps you plan and analyze migrations by reasoning over Azure Migrate data.

The migration agent supports migration planning, analysis, and decision making, but not migration execution. You can interact with the Agent using natural language prompts to explore inventory, migration readiness, strategies, ROI considerations, and landing zone requirements. 

**Migration planning and analysis capabilities**: Azure Copilot migration agent provides comprehensive analysis and guidance across the following phases of your migration journey: 

- [Migration strategy analysis](#migration-strategy-analysis) 
- [Discovery and inventory analysis](#discovery-and-inventory-analysis) 
- [Business case and ROI analysis](#business-case-and-roi-analysis) 
- [Azure readiness assessment interpretation](#azure-readiness-assessment-interpretation) 
- [Landing zone configuration reasoning](#landing-zone-configuration-reasoning) 

Azure Migrate now offers Azure Copilot Migration Agent for AI‑driven migration and modernization, including automated discovery, ROI insights, landing zone setup, and modernization guidance across infrastructure, databases, and applications. For more insights, see the [Microsoft Community Hub blog](https://techcommunity.microsoft.com/blog/azuremigrationblog/azure-copilot-migration-agent---bringing-agentic-migration-and-modernization-to-/4471329).

## Prerequisites

Before you begin, ensure that you've:

- An Azure subscription with permissions to use Azure Migrate.
- Access the Azure portal and Azure Migrate.
- Access to VMware vCenter.
- Azure Copilot enabled for the tenant. For more information, see [Manage access to Azure Copilot](/azure/copilot/manage-access#manage-user-access-to-azure-copilot).
- Agents (preview) enabled in Azure Copilot. For more information, see [Manage access to Agents (preview) in Azure Copilot](/azure/copilot/manage-access#manage-access-to-agents-preview-in-azure-copilot).

>[!NOTE]
> The Azure Copilot migration agent isn't supported when Bring your own storage (BYOS) is enabled for conversation history. For more information, see [Bring your own storage for conversation history in Azure Copilot](/azure/copilot/bring-your-own-storage).

## Get started with Azure Copilot migration agent in Azure Migrate

This section explains how to open the **Azure Copilot migration agent** from your **Azure Migrate** project. You can ask planning and analysis questions based on your discovered inventory, assessments, and business case artifacts. 

To open the agent experience in Azure Migrate, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the **Azure portal**, search for **Azure Migrate**, and then go to **Migrate** dashboard.

    :::image type="content" source="./media/azure-copilot-migration-agent/migrate-agent.png" alt-text="Screenshot shows how to access the Azure Migration agent." lightbox="./media/azure-copilot-migration-agent/migrate-agent.png" :::

3. In **Get started**, select **Accelerate migration**.

>[!NOTE]
> To use the Azure Copilot migration agent, you must enable the agent preview in Azure Copilot.


:::image type="content" source="./media/azure-copilot-migration-agent/accelerate-migration.png" alt-text="Screenshot shows how to accelerate migration agent." lightbox="./media/azure-copilot-migration-agent/accelerate-migration.png" :::

4. In the **Azure Migrate Project**, select either **Existing project** or **New project**, and then select subscription, resource group, and geography.

    :::image type="content" source="./media/azure-copilot-migration-agent/azure-migrate-project.png" alt-text="Screenshot shows how to select the project and other related fields." lightbox="./media/azure-copilot-migration-agent/azure-migrate-project.png" :::

5. Select **Continue** to go to the Migration Agent.

    :::image type="content" source="./media/azure-copilot-migration-agent/migration-agent.png" alt-text="Screenshot shows the migration agent experience." lightbox="./media/azure-copilot-migration-agent/migration-agent.png" :::

### Migration strategy analysis 

Azure Copilot migration agent analyzes migration strategies by evaluating infrastructure characteristics, migration objectives, and available Azure Migrate data. It explains trade-offs between different approaches, such as lift‑and‑shift and modernization strategies, and provides guidance tailored to your environment and goals. This enables you to evaluate migration paths and understand implications before committing to a strategy.  

### Discovery and inventory analysis 

Azure Copilot migration agent interprets and summarizes discovered infrastructure inventory from Azure Migrate discovery sources, including appliance-based discovery, Azure Migrate collector-based discovery, and RVTools imports. It highlights key attributes such as operating system details and support status, helping you understand and organize workloads for migration planning.  

### Business case and ROI analysis 

The agent supports the creation, summarization, and comparison of Azure Migrate business cases. It explains cost estimates, savings drivers, and return-on-investment insights, and enables comparisons across different migration preferences using business case outputs. This helps you understand the financial implications of migration decisions using existing Azure Migrate artifacts. You can also download business case outputs as a PowerPoint presentation for leadership discussions. 

### Azure readiness assessment interpretation 

Azure Copilot migration agent interprets Azure Migrate assessment results by summarizing readiness signals, identifying blockers, and explaining sizing recommendations and cost estimates. It compares assessment outputs across workload groupings and migration strategies, helping you understand readiness factors and constraints before migration planning.  

### Landing zone configuration reasoning 

The agent generates landing zone configuration by considering your inputs such as target regions, compliance needs, and connectivity preferences. These configurations are ready for  deployment workflows, though actual deployment execution occurs outside the agent.  

## Azure Copilot migration agent functionality

Azure Copilot migration agent is a conversational experience that helps plan migrations using Azure Migrate data. Use natural language prompts to explore inventory, readiness, strategy, ROI, and landing zone requirements.

Azure Copilot migration agent helps you:

- Answer migration‑related questions using Azure Migrate data.
- Summarize large business case and assessment artifacts.
- Compare different migration strategies.
- Generate planning‑level insights to support informed decision‑making.

The migration agent complements Azure Migrate by helping you interpret and synthesize migration data. Migration execution is carried out in the Azure Migrate portal.

During the conversations, the migration agent uses data from your Azure Migrate project—such as discovered inventory metadata, business cases, and assessment reports—to tailor responses to your stated goals. Conversation history preserves context and provides more relevant guidance throughout your migration journey.

## Azure migration agent - Supported scenarios

This section explains how Azure Copilot migration agent supports multiple migration scenarios to help you plan and analyze migrations using Azure Migrate data:

Azure Copilot migration agent currently supports the following scenarios:

- VMware workload migrations.
- Hyper‑V and Physical server migration planning.

| **Migration scenario** | **Azure Copilot migration agent support** |
| --- | --- | 
| VMware workload migrations  | Supports end‑to‑end planning and analysis for VMware workloads migrating to Azure. Helps interpret discovered inventory, compare migration strategies, analyze business case and assessment outputs, and customize platform landing zone templates that can be downloaded and deployed in the Azure environment.| 
| Hyper‑V and Physical server migration planning  | Complements discovery performed through the Azure Migrate portal. Provides guidance for inventory analysis, migration strategy comparison, and Azure readiness assessment interpretation for Hyper‑V and Physical server environments.|   

## Migration agent example scenarios
 
**Example 1: Plan VMware Lift‑and‑Shift Migrations with Azure Copilot migration agent**: You can use Azure Copilot migration agent to plan a lift-and-shift migration of VMware workloads to Azure. You discover servers using RVTools, Azure Migrate collector, or the Azure Migrate appliance, analyze inventory, and create and compare business cases to evaluate migration options.

**Sample prompts**:

- How should I plan moving VMware workloads to Azure?
- Proceed with discovery.
- What discovery methods are available?
- Use RVTools or the Azure Migrate appliance.
- I have deployed the RVTools or appliance and uploaded the data. Summarize the discovered inventory.
- Show servers that are out of support.
- Tag these servers as `upgraderequired: yes`.
- Provide the ROI summary for lift-and-shift.
- What are the other options for moving workloads to Azure?
- Compare the ROI between lift-and-shift and modernization.
- Summarize the ROI comparison across migration preferences.

**Example 2: Plan VMware Modernization and Readiness Using Azure Copilot migration agent**: You can use Azure Copilot migration agent to evaluate modernization opportunities for VMware workloads. You discover servers and databases, group them into applications, assess cloud readiness, and generate an Azure platform landing zone (PLZ) template.

**Sample prompts**:

- I want to move my servers and PostgreSQL database to Azure. How should I proceed?
- Proceed with the recommended migration preference.
- Discover using the Azure Migrate appliance.
- I have finished deploying the appliance and discovering data. Summarize the inventory.
- Assign the tag `application:ZavaOrderProcessingApp` to the server `vm-web-tier` and `vm-app-tier`.
- Yes, proceed with tagging.
- Assign the tag `application:ZavaOrderProcessingApp` to the PostgreSQL database `WIN-PG-04` (version `17.5`).
- List all workloads tagged with `application:ZavaOrderProcessingApp`.
- What is the cloud readiness of workloads tagged with `application:ZavaOrderProcessingApp`? Create an assessment if required.
- Show the readiness summary of my assessment.
- I'm ready to migrate to Azure. What are the next steps?
- Generate a new Azure platform landing zone.
- Generate a platform landing zone with default values.
- Thanks. How can I execute the actual migration now?

## Interact with Azure Copilot migration agent

Azure Copilot migration agent enables conversational interaction with Azure Migrate planning and assessment data. You can use natural language prompts to request summaries, comparisons, and explanations of migration artifacts throughout the planning and analysis phases.  

### Migration planning and discovery 

You can ask the agent for guidance on planning migrations and selecting appropriate discovery approaches. Based on your stated migration intent, the agent surfaces relevant discovery options and summarizes the discovered inventory.  

**Sample prompts**: 

- How should I plan to move my VMware workloads to Azure? 
- What discovery methods are available for my environment? 
- Tell me more about the prerequisites of deploying the Azure Migrate collector? 
- Summarize the discovered inventory. 

### Inventory analysis and organization 

After inventory data is discovered or imported, you can ask the agent to analyze and organize workloads. This includes highlighting attributes such as operating system details and support status, and grouping workloads using tags. 

**Sample prompts**:

- Show servers that are out of support. 
- Summarize my inventory discovered using RVTools. 
- List workloads tagged for a specific application. 

### Business case and ROI analysis 

The agent supports create, summarize, and compare Azure Migrate business cases. You can ask it to explain cost estimates, highlight savings drivers, and compare return‑on‑investment across migration strategies.  

**Sample prompts**:

- Provide the ROI summary for lift‑and‑shift. 
- Compare the ROI between lift‑and‑shift and modernization. 
- Explain how the savings in this business case are achieved. 

### Azure readiness assessment interpretation 

You can use the agent to interpret Azure readiness assessment outputs, summarize readiness signals, identify blockers, and review sizing and cost estimates across workload groupings.  

**Sample prompts**: 

- What is the readiness of my workloads for Azure VMs? 
- Summarize the readiness assessment for my tagged workloads. 
- Tell me about the readiness of this specific workload: WorkloadXYZ. 

### Landing zone configuration reasoning 

Based on migration requirements such as target region, compliance needs, and connectivity preferences, the agent helps generate Azure platform landing zone configurations for downstream deployment workflows. Actual deployment occurs outside the agent's experience. 

**Sample prompts**:

- What is an Azure landing zone? 
- Generate a landing zone based on my region and compliance requirements. 

## Scenarios supported only in the Azure Migrate portal

**Migration task execution**: Migration execution tasks, including server replication, test migrations, cutover, and workload move operations, aren’t performed by the Azure Copilot migration agent and must be completed through the Azure Migrate portal.

## Related content

- [Learn about how to plan and analyze migration with Agent](how-to-plan-analyze-migration-with-agent.md).
 
