---
title: Tags in Azure Catalyst
description: Azure Catalyst tags help you organize and manage migration resources efficiently. Discover how to group workloads for better visibility and control.
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: how-to
ms.service: azure-migrate
ms.reviewer: v-gajeronika
ms.update-cycle: 365-days
ms.date: 04/17/2025
# Customer intent: As an IT administrator managing migration resources, I want to tag workloads with relevant attributes, so that I can enhance resource organization and visibility during the migration process.
---

# Understand tags in Azure Catalyst

In any cloud migration journey, organizing and understanding your on-premises environment is critical. Azure Catalyst provides tagging capabilities that help you group, organize, and analyze discovered workloads based on business and technical attributes.

Tags in Azure Catalyst let you apply key value metadata to servers and workloads so you can manage large inventories more effectively, scope assessments, and plan migrations aligned to business priorities.

This article provides a high-level overview of tagging in Azure Catalyst and links to detailed guidance for common tagging scenarios and tasks.

<a name="what-are-tags-in-azure-migrate"></a>

## What are tags in Azure Catalyst?

Tags are custom key value pairs that you assign to discovered workloads in Azure Catalyst. You can use tags to group workloads based on attributes such as:

- Application or service
- Department or cost center
- Environment (production, test, development)
- Business criticality
After you apply tags, use them across Azure Catalyst experiences to filter inventory, scope assessments, and generate reports.

## Why use tags during migration?

Using tags helps you:

- Organize large inventories by grouping related workloads
- Improve visibility into applications, environments, and ownership
- Simplify migration planning by scoping assessments and reports
- Align technical data with business context, such as departments or priorities
- Tags are especially useful when managing complex environments with multiple applications, business units, or migration waves.

## Types of Tags

Azure Catalyst supports two types of tags:

**Reserved tags**: Environment and Migration Intent. These tags add operational and migration context to workloads and applications. They affect cost modeling, SKU recommendations, assessment scoping, and wave planning.

**Custom tags**: User-defined key-value pairs that help organize workloads and applications by attributes such as department, cost center, owner, or compliance. Custom tags support filtering, scoping, chargebacks, and reporting, but they don’t affect cost modeling or sizing.

## Next steps

- [Create and manage Tags](how-to-create-manage-tags.md).
- [Modify and delete tags for workloads in Azure Catalyst](how-to-modify-delete-tags.md).
