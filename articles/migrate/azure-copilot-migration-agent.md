---
title: Azure Copilot Migration Agent
description: Azure Copilot Migration Agent is a planning‑focused Copilot experience that helps you analyze migrations using Azure Migrate data, including readiness, strategy, ROI, and landing zone insights.
ms.topic: overview
author: SujayJDesai
ms.author: sudesai
ms.service: azure-migrate
ms.reviewer: v-gajeronika
ms.date: 10/13/2026
ms.update-cycle: 180-days
monikerRange: migrate 
# Customer intent: Use this article to learn how Azure Copilot Migration Agent helps you plan and analyze migrations by reasoning over Azure Migrate data, including supported scenarios, available capabilities, and example interactions.
---

# Azure Copilot Migration Agent

This article provides an overview of Azure Copilot Migration Agent and explains how it helps you plan, modernize, and migrate applications and workloads to Azure. 

Azure Copilot Migration Agent helps you discover, assess, plan, modernize, and migrate applications and workloads to Azure. It uses inventory, assessments, business cases, and other data available in your Azure Migrate project to provide contextual guidance throughout your migration and modernization journey. 

You can use natural language to explore and enrich your inventory, identify application boundaries, interpret business cases and assessments, and compare migration and modernization strategies. The agent helps you understand Azure readiness and remediation needs, identify modernization opportunities, and evaluate target Azure services for your applications and workloads. It also generates Azure landing zone configurations, recommends migration waves, and guides migration execution.

Azure Copilot Migration Agent is available through Azure Copilot and Azure Migrate in the Azure portal.

In this article, you learn how to access Azure Copilot Migration Agent and use it throughout the migration lifecycle.

## Get started

Before you begin, verify that you meet the prerequisites to access and use Azure Copilot Migration Agent in Azure Migrate.

###  Prerequisites

Before you begin, ensure that you have:

1. An Azure subscription with permissions to use Azure Migrate. 
1. Azure Copilot enabled for the tenant. For more information, see [Manage access to Azure Copilot](/azure/copilot/manage-access#manage-user-access-to-azure-copilot).

>[!NOTE]
> - Administrators control access to Azure Copilot Migration Agent. If the Migration Agent isn't available when you start a new chat, contact your administrator to verify that access is enabled.
> - All regions listed in Azure Migrate supported geographies are supported. For more information, see [Azure Migrate supported geographies](supported-geographies.md#public-cloud).

### Start a migration from Azure Copilot

Use Azure Copilot Migration Agent to plan and manage your migration with natural language prompts. Start with an existing Azure Migrate project or create a new project to begin.

1. Open **Azure Copilot** in the Azure portal.
1. Select **New chat** > **Migration**.
1. Select an existing Azure Migrate project or create a new project. Then describe what you want to migrate or the outcome that you want to achieve. 
1. If you're using an existing project, ask questions about inventory, readiness, migration strategy, ROI analysis, or landing zone requirements.

    :::image type="content" source="./media/azure-copilot-migration-agent/agent-landing-page.png" alt-text="Screenshot shows how to access the Azure Migration agent." lightbox="./media/azure-copilot-migration-agent/agent-landing-page.png" :::

### Start with Azure Copilot Migration Agent in Azure Migrate

This section explains how to open Azure Copilot Migration Agent from your Azure Migrate project. You can ask planning and analysis questions based on your discovered inventory, assessments, and business case artifacts.

To open the agent experience in Azure Migrate, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Azure Migrate**, and then open the **Migrate** dashboard.

    :::image type="content" source="./media/azure-copilot-migration-agent/migrate-agent.png" alt-text="Screenshot shows how to open the agent experience in Azure Migrate." lightbox="./media/azure-copilot-migration-agent/migrate-agent.png" :::

1. On the service menu, select **All projects**, and then select your project.
1. Select **View summary**. 
1. After the project summary is displayed, ask questions about inventory, readiness, migration strategy, ROI analysis, and landing zone requirements.

    :::image type="content" source="./media/azure-copilot-migration-agent/view-summary.png" alt-text="Screenshot shows how to view the summary of the project." lightbox="./media/azure-copilot-migration-agent/view-summary.png" :::

## Key capabilities

Azure Copilot Migration Agent provides comprehensive analysis and guidance for the following phases of your migration journey:

- [Discovery and inventory analysis](#discovery-and-inventory-analysis) 
- [Application discovery and analysis (Preview)](#application-discovery-and-analysis-preview)
- [Business case and ROI analysis (Preview)](#business-case-and-roi-analysis-preview) 
- [Migration strategy and readiness analysis](#migration-strategy-and-readiness-analysis) 
- [Wave planning and execution (Preview)](#wave-planning-and-execution-preview) 
- [Azure landing zone generation](#azure-landing-zone-generation) 

### Discovery and inventory analysis 

Azure Copilot Migration Agent guides you to select the most appropriate discovery approach for your environment. The agent provides guidance on available discovery methods, setup requirements, credentials, and workload coverage. 

After discovery, the agent can help you explore and analyze your inventory using available workload properties, such as operating system, support status, environment, and location. You can ask questions in natural language to find specific workloads, identify patterns, and summarize groups of assets without manually filtering large inventories.

The agent helps you enrich your inventory by adding business context, such as environment classifications (development, test, or production) and migration intent (retain or retire). These insights help you better understand your estate, organize workloads, and prepare for migration planning.

### Application discovery and analysis (Preview) 

Azure Copilot Migration Agent automatically identifies related workloads and groups them into applications using workload metadata, software inventory, and network dependencies. The agent classifies applications as custom or packaged and provides insights into their business criticality and complexity. Use these insights to understand your application portfolio, review application groupings, and make informed migration and modernization decisions.

### Business case and ROI analysis (Preview) 

Azure Copilot Migration Agent helps you understand the financial and business value of migrating to Azure by using business cases in your Azure Migrate project. With a multi-strategy business case, you can compare options such as rehosting workloads on Azure virtual machines (lift and shift), modernizing workloads with Azure platform as a service (PaaS), or using a recommended combination of both approaches.

The agent summarizes on-premises costs, estimated Azure costs, projected savings, and return on investment. It also explains the factors that contribute to savings, including rightsizing, Azure Hybrid Benefit, and reduced datacenter and licensing costs.

Azure value uplift estimates benefits beyond infrastructure cost savings, including improvements in productivity, resiliency, and business agility. Based on your goals, the agent can recommend a strategy and guide you through the process of creating a business case in Azure Migrate.

### Migration strategy and readiness analysis 

Azure Copilot Migration Agent helps you interpret Azure Migrate assessment results and evaluate the best migration and modernization path for your workloads. The agent summarizes Azure readiness, identifies migration blockers and compatibility issues, and recommends remediation actions. It also explains the rationale behind the recommended target sizing and estimated costs. 

You can compare modernization strategies, such as rehosting workloads on Azure virtual machines (lift-and-shift) or modernizing them with Azure platform as a service (PaaS). Based on your goals, priorities, constraints, timeline, and budget, the agent evaluates the 6R migration strategies and recommends the approach that best meets your requirements.

When code analysis results are available, the agent can also highlight code readiness, modernization opportunities, estimated refactoring effort, and suitable Azure services. These insights help teams plan remediation, make informed migration decisions, and prepare workloads for wave planning and execution.

### Wave planning and execution (Preview) 

Azure Copilot Migration Agent automatically groups applications and workloads into a proposed wave plan. It explains the factors behind the grouping and sequencing, highlighting dependencies, risks, and other considerations that influence migration planning.

After you review the wave plan, the agent helps you create migration waves and provides guidance for wave operations, including editing waves, selection of migration methods and prerequisites to proceed with the migration. 

During execution, the agent provides contextual guidance and summarizes the migration status of applications and workloads. It helps you track replication and migration status, troubleshoot issues, and determine appropriate next steps.

### Azure landing zone generation 

Azure Copilot Migration Agent helps you generate an Azure landing zone configuration based on your requirements, such as target regions, compliance needs, and connectivity preferences. The agent helps you understand the different parts of the configuration and how they align with Azure landing zone best practices.

## Migration sample prompts

The following examples show prompts that you can use with the Migration Agent. Adapt them to your scenario or create your own.

### Migration planning and discovery

- How should I plan the migration of my VMware workloads to Azure?
- What discovery methods are available for my environment?
- Tell me more about the prerequisites for Azure Migrate Collector.
- What data does appliance-based discovery collect?

### Inventory analysis and organization

- Summarize my discovered inventory.
- Show workloads that are running end-of-support operating systems.
- I want to enrich my inventory. How does tagging work?
- List workloads tagged as Environment: Production.

### Application discovery and analysis (Preview)

- Show all applications discovered in my data center.
- How many applications were discovered automatically?
- Show applications with low confidence scores.
- Show details for the Contoso_ERP application.
- Show applications with high criticality.

### Business case and ROI analysis (Preview)

- Summarize my business case.
- Compare the migration strategies in my business case side by side.
- Which strategy provides the best return on investment?
- What are the biggest drivers of savings in this business case?
- What business value will I gain beyond cost savings?
- How will moving to Azure improve the resilience and productivity of my applications?
- How does Azure Hybrid Benefit affect my Azure costs?

### Azure readiness assessment interpretation

- I want to identify all possible migration options for my applications.
- Show me the top five insights from this assessment.
- Show me details of all migration paths and help me compare them.
- Which migration path should I choose?
- Show me the readiness breakdown.
- List the not ready servers and their blockers.
- Which servers were downsized the most in the recommendation?
- Tell me about the readiness of server ABC.

### Wave planning and execution (Preview)

- What is a wave plan?
- Generate a wave plan for this assessment.
- How are applications grouped and sequenced?
- Proceed to create the first wave of this wave plan.
- What is the migration status of my first wave?
- Which migration method should I use?
- What are the prerequisites for enabling replication?
- Replication is taking longer than expected. Help me identify what's slowing it down and how I can expedite it.
- How do I know when my server is ready for migration?

## Landing zone configuration reasoning

- What is an Azure landing zone?
- Help me set up an Azure landing zone.
- Generate a landing zone based on my region and compliance requirements.

## Related content

- [Learn about how to plan and analyze migration with Agent](how-to-plan-analyze-migration-with-agent.md).
- [Learn about Azure landing zones](platform-landing-zone.md).
- [Learn about business case in Azure Migrate](how-to-build-a-business-case.md).

