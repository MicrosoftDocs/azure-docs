---
title: Tags in Azure Migrate
description: Learn how to tag resources with relevant attributes in Azure Migrate.
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: how-to
ms.service: azure-migrate
ms.date: 04/17/2025
monikerRange: migrate
# Customer intent: As an IT administrator managing migration resources, I want to tag workloads with relevant attributes, so that I can enhance resource organization and visibility during the migration process.
---

# Tags in Azure Migrate

In any cloud transformation journey, a comprehensive current-state analysis of the IT landscape is essential. That analysis includes infrastructure, workloads, applications, and dependencies.

The new tagging feature in Azure Migrate enhances this analysis. You can use tags to group and visualize related resources based on specific properties, such as environment, department, or criticality. These meaningful groupings can help you manage resources throughout your migration process and beyond.

## Key benefits

- **Enhanced resource grouping and organization**: Tagging resources with relevant attributes helps you categorize, track, and manage your assets. For example, you can collectively manage and analyze resources tagged by department (like HR or finance), which improves oversight and streamlines operations.

- **Improved visibility and control**: You gain an organized view of how resources interrelate. This view supports better management of resources that share a common purpose, application, or organizational unit.

- **Resource management and governance**: Tags enable easy filtering and sorting of resources, so IT administrators can quickly find and manage assets. Tags also support governance practices to help enforce consistent management practices and resource tracking.

- **Simplified migration planning**: You can use tags as selection filters when you create your reports for business cases and assessments.

## Use cases

- **Department-based grouping**: Tagging resources by department (for example, finance and marketing) helps you allocate resources appropriately and track department-specific assets.

- **Environment and criticality identification**: Tags such as production, development, or high criticality simplify the management of environments and critical workloads.

- **Application and purpose grouping**: Tags can identify resources tied to a specific application or service, so you can more easily assess the impact of changes or migrations.

## Add tags to workloads

1. Select the workloads that you intend to tag from the inventory.

2. Select **Tags** > **Add and edit tags**.

3. Assign a tag by adding the key and value details.

## View tags

- Select the workload for which you want to view the assigned tags.

## Filter by using tags

1. Select **Add filter** beside the search bar.

2. Select the tag key that you want to filter with.

3. Select the values for the tag that you want to filter with.

## Import tags

1. Select **Tags** > **Import tags**.

2. Choose the file with the tags that you want to import.
