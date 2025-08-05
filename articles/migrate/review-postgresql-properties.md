---
title: Review PostgreSQL assessment properties
description: Describes the components of an assessment in Azure Migrate for PostgreSQL workloads.
author: habibaum
ms.author: v-uhabiba
ms.service: azure-migrate 
ms.topic: tutorial-article
ms.date: 08/05/2025
ms.custom: engagement-fy24 
# Customer intent: Customers want to assess on-premises PostgreSQL workloads using Azure Migrate to prepare for migration to Azure Database for PostgreSQL flexible server. They aim to evaluate cloud readiness, risks, and costs through configuration-based assessments.
---

# Tutorial: Review a PostgreSQL assessment

This article explains the key components of a PostgreSQL assessment and how to review the results after the assessment is created.

## View an assessment 

Follow these steps to view the assessment that you created. 

1. Go to the **Assessment** and select **View all reports** under **Overview**, or select **Assessments** under the **Decide and plan**.
1. Select the assessment you want to view, for example, azmigrate-demo.

    :::image type="content" source="./media/review-postgresql-properties/select-assessment.png" alt-text="Screenshot shows how to select the assessment" lightbox="./media/review-postgresql-properties/select-assessment.png":::
1. Review the summary of the assessment. You can also edit the assessment settings or recalculate the assessment.

## Assessed Workloads

This section provides a summary of the assessment, including the following metrics:

- **Servers**: Total number of servers assessed
- **PostgreSQL instances**: Number of PostgreSQL instances discovered
- **Databases**: Total number of databases across all instances
- **Out of support**: Number of instances running unsupported PostgreSQL versions
- **Discovery success**: Percentage of successful discovery operations

## Plan Migration

This indicates the different migration strategies that you can consider for your PostgreSQL deployments. You can review the readiness for target deployment types and the cost estimates for PostgreSQL instances that are marked ready or ready with conditions.

## Recommended target

Azure Database for PostgreSQL provides the best compatibility and cost-effectiveness for your PostgreSQL instance. Choosing a Microsoft-recommended target reduces migration effort.

The recommended option is both cost-effective and migration-ready. It includes readiness checks and monthly cost estimates for instances marked as **Ready** or **Ready with conditions**.

You can view the readiness of PostgreSQL instances for recommended deployment targets, along with monthly cost estimates for instances marked as Ready or Ready with conditions.

Readiness report: 

- Review the recommended Azure Database for PostgreSQL configurations for migrating to Azure Database for PostgreSQL – Flexible Server.
- Understand migration issues and warnings you can resolve before moving to the recommended Azure targets.
- Review the monthly cost of each PostgreSQL instance based on compute and storage.

### Migration strategies

