---
title: Build an Azure Migrate Report 
description: Build Azure Migrate reports to analyze discovered on-premises servers and workloads and generate insights for migration planning.
author: habibaum
ms.author: v-uhabiba
ms.topic: how-to
ms.service: azure-migrate
ms.date: 03/25/2026
monikerRange:
# Customer intent: As an IT administrator managing migration resources, I want to tag workloads with relevant attributes, so that I can enhance resource organization and visibility during the migration process.
---

# Build a report (preview) 

This article explains how to build a report (preview) for on‑premises servers and workloads by using Azure Migrate. After completing this article, you’ll be able to generate a report by selecting the appropriate report type, migration preferences, and configuration options in an Azure Migrate project.  

In this article, you’ll learn how to:

- Create a report on Azure Migrate.
- Select the appropriate report type, migration preferences, and configuration options.
- Generate the report to review insights about your discovered servers and workloads.
- After completing this section, you can generate migration and modernization reports.

## Prerequisites 

Before you build a report, ensure the following:

- You’ve created an Azure Migrate project. You can use an existing project if it is available.
After the project is created, the Azure Migrate: Discovery and assessment tool is automatically added. 
- You’ve discovered your IT estate using one of the supported discovery sources for your scenario. 
- All discovery errors are resolved.

### Recommendation

To improve the report accuracy, we recommend the following actions:

- Enrich your data by defining the environment, migration intent, and application.
- Define environment and migration for your [workloads to enrich your data](resource-tagging.md).
- Specify [associated applications](define-manage-applications.md).
- Enable application auto‑discovery and review the [discovered applications](resource-tagging.md) for accuracy.

## Build report

To build a report, follow these steps:

1. From **All projects**, select your project. 

    :::image type="content" source="./media/how-to-build-a-report/migrate-projects.png" alt-text="The screenshot shows how to select your project from the Migrate projects." lightbox="./media/how-to-build-a-report/migrate-projects.png":::

1. On the left pane go to **Manage**, and then select **Reports** (Preview).

    :::image type="content" source="./media/how-to-build-a-report/manage-section.png" alt-text="The screenshot shows how to access and select reports." lightbox="./media/how-to-build-a-report/manage-section.png":::

1. On the **Generate Report** page, do the following:
    1. **Name**: Enter a name for the report. The report name must be unique within the project.  

    :::image type="content" source="./media/how-to-build-a-report/generate-report.png" alt-text="The screenshot shows how to generate report." lightbox="./media/how-to-build-a-report/generate-report.png":::

    1. **Type**: Select the report type to generate. For more information, see the [supported report types](reports-overview.md#types-of-reports). 
    1. **Migration preference**: Select the required migration preference. For more information, see [migration preferences](reports-overview.md#migration-preferences-in-azure-migrate-reports).
    1. **Configuration**: Choose the required configuration to generate the report. For more information, see [report configuration](reports-overview.md#report-configuration).
    1. Review your selections, and then select **Build report**. 

1. Creating a report by using configurations from an existing assessment takes approximately 15 minutes. Creating a report by defining configurations from scratch takes approximately 1 hour.

### Download the report

To download a report, follow these steps:

1. Go to the **Reports** section to view the list of reports created so far.
1. For the report you want to download, select **Download**.  

    :::image type="content" source="./media/how-to-build-a-report/download-report.png" alt-text="The screenshot shows how to download report." lightbox="./media/how-to-build-a-report/download-report.png":::

1. Select the required report type, and then select **Download**.

    :::image type="content" source="./media/how-to-build-a-report/report-types.png" alt-text="The screenshot shows how to select the report types and download." lightbox="./media/how-to-build-a-report/report-types.png":::

 