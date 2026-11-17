---
title: Azure Catalyst agent
description: Azure Catalyst agent helps you analyze migrations using Azure Catalyst project data, including readiness, strategy, ROI, and landing zone insights.
ms.topic: overview
author: SujayJDesai
ms.author: sudesai
ms.service: azure-migrate
ms.reviewer: v-gajeronika
ms.date: 10/27/2026
ms.update-cycle: 180-days
monikerRange: migrate 
# Customer intent: Use this article to learn how Azure Catalyst agent helps you plan and analyze migrations by reasoning over Azure Catalyst project data, including supported scenarios, available capabilities, and example interactions.
---


# Azure Catalyst agent

This article provides an overview of Azure Catalyst agent (formerly Azure Copilot Migration Agent) and explains how it helps you plan, modernize, and migrate applications and workloads to Azure.

Azure Catalyst agent helps you discover, assess, plan, modernize, and migrate applications and workloads to Azure. It uses inventory, assessments, business cases, and other data available in your Azure Catalyst project to provide contextual guidance throughout your migration and modernization journey.

You can use natural language to explore and enrich your inventory, identify application boundaries, interpret business cases and assessments, and compare migration and modernization strategies. The agent helps you understand Azure readiness and remediation needs, identify modernization opportunities, and evaluate target Azure services for your applications and workloads. It also generates Azure landing zone configurations, recommends migration waves, and guides migration execution.

Azure Catalyst agent is available through Azure Copilot and Azure Catalyst in the Azure portal.

In this article, you learn how to access Azure Catalyst agent and use it throughout the migration lifecycle.

## Get started

Before you begin, verify that you meet the prerequisites to access and use Azure Catalyst agent in Azure Catalyst.

###  Prerequisites

Before you begin, ensure that you have:

1. An Azure subscription with permissions to use Azure Catalyst.
1. Azure Copilot enabled for the tenant. For more information, see [Manage access to Azure Copilot](/azure/copilot/manage-access#manage-user-access-to-azure-copilot).

>[!NOTE]
> - Administrators control access to Azure Catalyst agent. If the agent isn't available when you start a new chat, contact your administrator to verify that access is enabled.
> - All regions listed in Azure Catalyst supported geographies are supported. For more information, see [Azure Catalyst supported geographies](supported-geographies.md#public-cloud).

### Start a migration from Azure Copilot

Use the Azure Catalyst agent to plan and manage your migration with natural language prompts. Start with an existing Azure Catalyst project or create a new project to begin.

1. Open **Azure Copilot** in the Azure portal.
1. Select **New chat** > **Catalyst agent**.
1. Select an existing Azure Catalyst project or create a new project. Then describe what you want to migrate or the outcome that you want to achieve.
1. If you're using an existing project, ask questions about inventory, readiness, migration strategy, ROI analysis, or landing zone requirements.

    :::image type="content" source="./media/azure-copilot-migration-agent/agent-landing-page.png" alt-text="Screenshot shows how to access the Azure Catalyst agent." lightbox="./media/azure-copilot-migration-agent/agent-landing-page.png" :::

<a name="start-with-azure-copilot-migration-agent-in-azure-migrate"></a>

### Start with Azure Catalyst agent in Azure Catalyst

This section explains how to open the Azure Catalyst agent from your Azure Catalyst project. You can ask planning and analysis questions based on your discovered inventory, assessments, and business case artifacts.

To open the agent experience in Azure Catalyst, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Catalyst**, and then open the **Catalyst** dashboard.

    :::image type="content" source="./media/azure-copilot-migration-agent/migrate-agent.png" alt-text="Screenshot shows how to open the agent experience in Azure Catalyst." lightbox="./media/azure-copilot-migration-agent/migrate-agent.png" :::

1. On the service menu, select **All projects**, and then select your project.
1. Select **View summary**. 
1. After the project summary is displayed, ask questions about inventory, readiness, migration strategy, ROI analysis, and landing zone requirements.

    :::image type="content" source="./media/azure-copilot-migration-agent/view-summary.png" alt-text="Screenshot shows how to view the summary of the project." lightbox="./media/azure-copilot-migration-agent/view-summary.png" :::

## Key capabilities

Azure Catalyst agent provides comprehensive analysis and guidance for the following phases of your migration journey:

- [Discovery and inventory analysis](#discovery-and-inventory-analysis) 
- [Application discovery and analysis (preview)](#application-discovery-and-analysis-preview)
- [Business case and ROI analysis (preview)](#business-case-and-roi-analysis-preview) 
- [Migration strategy and readiness analysis](#migration-strategy-and-readiness-analysis) 
- [Wave planning and execution (preview)](#wave-planning-and-execution-preview) 
- [Azure landing zone generation](#azure-landing-zone-generation) 

### Discovery and inventory analysis 

Azure Catalyst agent guides you to select the most appropriate discovery approach for your environment. The agent provides guidance on available discovery methods, setup requirements, credentials, and workload coverage.

After discovery, the agent can help you explore and analyze your inventory using available workload properties, such as operating system, support status, environment, and location. You can ask questions in natural language to find specific workloads, identify patterns, and summarize groups of assets without manually filtering large inventories.

The agent helps you enrich your inventory by adding business context, such as environment classifications (development, test, or production) and migration intent (retain or retire). These insights help you better understand your estate, organize workloads, and prepare for migration planning.

### Application discovery and analysis (preview) 

Azure Catalyst agent automatically identifies related workloads and groups them into applications using workload metadata, software inventory, and network dependencies. The agent classifies applications as custom or packaged and provides insights into their business criticality and complexity. Use these insights to understand your application portfolio, review application groupings, and make informed migration and modernization decisions.

### Business case and ROI analysis (preview) 

Azure Catalyst agent helps you understand the financial and business value of migrating to Azure by using business cases in your Azure Catalyst project. With a multi-strategy business case, you can compare options such as rehosting workloads on Azure virtual machines (lift and shift), modernizing workloads with Azure platform as a service (PaaS), or using a recommended combination of both approaches.

The agent summarizes on-premises costs, estimated Azure costs, projected savings, and return on investment. It also explains the factors that contribute to savings, including rightsizing, Azure Hybrid Benefit, and reduced datacenter and licensing costs.

Azure value uplift estimates benefits beyond infrastructure cost savings, including improvements in productivity, resiliency, and business agility. Based on your goals, the agent can recommend a strategy and guide you through the process of creating a business case in Azure Catalyst.

### Migration strategy and readiness analysis 

Azure Catalyst agent helps you interpret Azure Migrate assessment results and evaluate the best migration and modernization path for your workloads. The agent summarizes Azure readiness, identifies migration blockers and compatibility issues, and recommends remediation actions. It also explains the rationale behind the recommended target sizing and estimated costs.

You can compare modernization strategies, such as rehosting workloads on Azure virtual machines (lift-and-shift) or modernizing them with Azure platform as a service (PaaS). Based on your goals, priorities, constraints, timeline, and budget, the agent evaluates the 6R migration strategies and recommends the approach that best meets your requirements.

When code analysis results are available, the agent can also highlight code readiness, modernization opportunities, estimated refactoring effort, and suitable Azure services. These insights help teams plan remediation, make informed migration decisions, and prepare workloads for wave planning and execution.

### Wave planning and execution (preview) 

Azure Catalyst agent automatically groups applications and workloads into a proposed wave plan. It explains the factors behind the grouping and sequencing, highlighting dependencies, risks, and other considerations that influence migration planning. For the plan sections and planning engine, see [Wave planning overview](wave-plan-overview.md).

Review and configure the proposed waves before committing them. For the portal workflow, see [Configure a wave plan](how-to-configure-wave-plan.md). Wave planning ends at commitment; migration method selection, execution prerequisites, and tracking are separate activities.

During execution, the agent provides contextual guidance and summarizes the migration status of applications and workloads. It helps you track replication and migration status, troubleshoot issues, and determine appropriate next steps.

### Azure landing zone generation 

Azure Catalyst agent helps you generate an Azure landing zone configuration based on your requirements, such as target regions, compliance needs, and connectivity preferences. The agent helps you understand the different parts of the configuration and how they align with Azure landing zone best practices.

## Migration sample prompts

The following examples show prompts that you can use with the Azure Catalyst agent. Adapt them to your scenario or create your own.

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

### Application discovery and analysis (preview)

- Show all applications discovered in my data center.
- How many applications were discovered automatically?
- Show applications with low confidence scores.
- Show details for the Contoso_ERP application.
- Show applications with high criticality.

### Business case and ROI analysis (preview)

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

### Wave planning and execution (preview)

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

- [Learn about how to plan and analyze migration with Azure Catalyst agent](how-to-plan-analyze-migration-with-agent.md).
- [Learn about Azure landing zones](platform-landing-zone.md).
- [Learn about business case in Azure Catalyst](how-to-build-a-business-case.md).
