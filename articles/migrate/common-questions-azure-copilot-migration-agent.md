---
title: Common Questions About Azure Copilot Migration Agent
description: Get answers to common questions for Azure Copilot migration agent.
author: piyushdhore-microsoft
ms.author: piyushdhore
ms.manager: vijain
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 03/12/2026
ms.reviewer: v-uhabiba
ms.custom: engagement-fy25
monikerRange: migrate 
# Customer intent: "To understand how Azure Copilot migration agent works, what data it uses, how customer data is handled, and whether the service is safe, compliant, and trustworthy to use during migration planning."
---

# Azure Copilot migration agent (preview): Common questions

Azure Copilot migration agent is built with Microsoft’s Responsible AI principles. This article answers common questions about the **Azure Copilot migration agent**. 

## What is the Azure Copilot migration agent?

Azure Copilot migration agent is a Copilot-powered, conversational experience designed to help customers plan, analyze, and reason about cloud migrations by using data from Azure Migrate.

## What data does the migration agent access and process? 

The migration agent accesses only data necessary for migration guidance, such as infrastructure metadata and chat inputs. The agent doesn't access external customer data sources outside the Azure Migrate project.

## Does the migration agent store my prompts, responses, or migration data? 

Yes. Prompts, responses, and related data are stored to provide contextual responses. Data is isolated per user.  

## How is my data used within the migration agent? 

Data is used only for migration recommendations, assessments, and business case analysis. It is not used for profiling or unrelated purposes.  

## Who can access my data? 

Only users with appropriate Azure role-based access can access the data. Microsoft Support may access the data only with explicit permission.  

## Is my data used to train Microsoft’s AI models? 

No. The migration agent doesn't use your data to train Microsoft’s AI models. 

## How does ACMA ensure responsible and ethical AI use? 

The migration agent follows Microsoft’s Responsible AI principles and is regularly evaluated for safety and relevance. 

## Can I opt out of data collection or storage? 

You can opt out by leaving the preview or contacting Microsoft Support to request data deletion.  

## How is feedback collected and used? 

Feedback (thumbs up/down) is collected where permitted by your organization. Feedback is used only to improve the tool, isn't linked to users unless consented, and isn't used for advertising or external analytics.  

## Does the Azure Copilot migration agent process data outside my selected geography?  

For EU customers, both processing and storage of migration‑related data occur within EU regions. 

For all other geographies, Azure Copilot migration agent may process and store migration‑related data in any Azure region, depending on service architecture and optimization. This applies only to Azure Migrate related conversational data used by the agent.  

Azure Migrate project data such as discovery metadata, assessment metadata, and project configuration is always stored in a region within the geography that you selected when creating the project. Azure Migrate doesn't move or store customer data outside of the region allocated, guaranteeing data residency and resiliency in the same geography. [Learn more](resources-faq.md#what-does-azure-migrate-do-to-ensure-data-residency).