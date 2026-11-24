---
title: Common Questions About Azure Catalyst agent
description: Get answers to common questions for Azure Catalyst agent.
author: piyushdhore-microsoft
ms.author: piyushdhore
ms.manager: vijain
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 03/12/2026
ms.reviewer: v-gajeronika
ms.custom: engagement-fy25
ms.update-cycle: 180-days
monikerRange: migrate 
# Customer intent: "To understand how Azure Catalyst agent works, what data it uses, how customer data is handled, and whether the service is safe, compliant, and trustworthy to use during migration planning."
---

# Azure Catalyst agent (preview): Common questions

The Azure Catalyst agent is built with Microsoft’s Responsible AI principles. This article answers common questions about the **Azure Catalyst agent**. 

<a name="what-is-the-azure-copilot-migration-agent"></a>

## What is the Azure Catalyst agent?

Azure Catalyst agent is a Copilot-powered, conversational experience designed to help customers plan, analyze, and reason about cloud migrations by using data from Azure Catalyst.

<a name="what-data-does-the-migration-agent-access-and-process"></a>

## What data does the Azure Catalyst agent access and process? 

The Azure Catalyst agent accesses only data necessary for migration guidance, such as infrastructure metadata and chat inputs. The agent doesn't access external customer data sources outside the Azure Catalyst project.

<a name="does-the-migration-agent-store-my-prompts-responses-or-migration-data"></a>

## Does the Azure Catalyst agent store my prompts, responses, or migration data? 

Yes. Prompts, responses, and related data are stored to provide contextual responses. Data is isolated per user.  

<a name="how-is-my-data-used-within-the-migration-agent"></a>

## How is my data used within the Azure Catalyst agent? 

Data is used only for migration recommendations, assessments, and business case analysis. It is not used for profiling or unrelated purposes.  

## Who can access my data? 

Only users with appropriate Azure role-based access can access the data. Microsoft Support may access the data only with explicit permission.  

## Is my data used to train Microsoft’s AI models? 

No. The Azure Catalyst agent doesn't use your data to train Microsoft’s AI models. 

<a name="how-does-acma-ensure-responsible-and-ethical-ai-use"></a>

## How does Azure Catalyst agent ensure responsible and ethical AI use? 

The Azure Catalyst agent follows Microsoft’s Responsible AI principles and is regularly evaluated for safety and relevance. 

## Can I opt out of data collection or storage? 

You can opt out by leaving the preview or contacting Microsoft Support to request data deletion.  

## How is feedback collected and used? 

Feedback (thumbs up/down) is collected where permitted by your organization. Feedback is used only to improve the tool, isn't linked to users unless consented, and isn't used for advertising or external analytics.  

<a name="does-the-azure-copilot-migration-agent-process-data-outside-my-selected-geography"></a>

## Does the Azure Catalyst agent process data outside my selected geography?  

For EU customers, both processing and storage of migration‑related data occur within EU regions. 

For all other geographies, Azure Catalyst agent may process and store migration‑related data in any Azure region, depending on service architecture and optimization. This applies only to Azure Catalyst related conversational data used by the agent.  

Azure Catalyst project data such as discovery metadata, assessment metadata, and project configuration is always stored in a region within the geography that you selected when creating the project. Azure Catalyst doesn't move or store customer data outside of the region allocated, guaranteeing data residency and resiliency in the same geography. [Learn more](resources-faq.md#what-does-azure-migrate-do-to-ensure-data-residency).