---
title: Questions about Wave Planning in Azure Migrate
description: Get answers to common questions about wave planning in Azure Migrate.
author: shubhamJain1992
ms.author: shuj
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.topic: concept-article
ms.date: 11/04/2025
monikerRange: migrate 
# Customer intent: As a cloud migration specialist, this article help understand and clarify common questions about using Azure Migrate Wave Planning for migration projects.
---


# Wave Planning - Common questions (preview)

This article answers common questions about Wave Planning in Azure Migrate. 

## Is wave planning mandatory for migrations?

No, wave planning isn't a mandatory to migrate with Azure Migrate. It's a guided, step-by-step process that helps you plan and execute large scale migrations on time. 

## How do I ensure waves show latest data? 

Create, edit, or delete, and other wave operations can take time depending on the size of the wave. To see the latest data, follow the steps:

1. Ensure deployments for each operation are complete. 

:::image type="content" source="./media/common-questions-wave-planning/notifications.png" alt-text="The screenshot shows the notifications." lightbox="./media/common-questions-wave-planning/notifications.png":::

2. Select **Refresh** to update the page.

## Why can't I add an application to a wave?

Each workload in a migration wave can have a unique  migration plan and be part of only one wave. If any workload of an application is part of another wave, you can add the entire application to a different wave. 

Alternatively, switch to **Workload selection** view, filter by the application name, and add the remaining workloads to the wave.  

## Why does the number of workloads or apps in a wave differ from the count added to the wave?

Following are the reasons why the workloads/apps selected for the wave may vary from the count:

1. The workload is part of multiple applications. Migrating this workload moves parts of various applications, so the complete list of applications appears in the wave.
1. The application contains an unsupported workload. This application is split into multiple workloads, and the remaining workloads are added to the wave. 

## Which migration executions are supported in Wave planning?

There are two types of category tracking in Azure Migrate: 

1. **Automated tracking**: When Azure Migrate supports the migration tool and approach (for example, Server Migration), you can perform migration and modernization tasks through Waves, and the status gets updated automatically.

1. **Manually tracking**: When Azure Migrate doesn't natively support migration tooling (for example, DMS or other tools), you manually update task status (for example, select **Mark as complete**). This keeps Waves status up to date and reflects the current stage in the migration and modernization journey.

## How can I export the Wave? 

All Azure Migrate data, including waves, is available in Azure Resource Graph (ARG). It includes the following wave planning data:

 - Wave: `microsoft.migrate/migrateprojects/waves`
 - Workload in wave: `microsoft.migrate/migrateprojects/migrationentities`
 - Application in wave: `microsoft.migrate/migrateprojects/migrationentitygroups`

You can build queries as needed by using the Azure portal, Azure CLI, PowerShell, REST APIs, or the Power BI connector to generate reports. For more information, see [Azure Resource Graph](/azure/governance/resource-graph/overview).