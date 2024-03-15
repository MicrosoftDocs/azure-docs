---
title: Assess SAP systems for the migration 
description: Learn how to assess SAP systems with the Azure Migrate Discovery and assessment.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 03/07/2024
ms.custom: 

---

# Tutorial: Assess SAP systems for migration to Azure

As part of your migration journey to Azure, discover your on-premises SAP inventory and workloads.

This tutorial explains how to perform import-based assessments for your on-premises SAP systems using import option to generate an assessment report, featuring cost, and sizing recommendations based on cost and performance. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Upload XLS with the server details.
> * Review an assessment.

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario and use default options. 

## Prerequisites

- Ensure you've an Azure subscription. If not, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.
- Ensure you've [discovered the SAP systems](./tutorial-discover-sap-systems.md) you want to assess using the Azure Migrate.

> [!NOTE]
> If you want to try out this feature in an existing project, ensure you are currently within the same project.
> If you want to create a new project for assessment, [create a new project](./create-manage-projects.md).


## Create an assessment

To create an assessment for the discovered SAP systems, follow these steps:

1. On the **Azure Migrate** page, and under **Migration goals**, select **Servers, databases and web apps**.
1. Under **Assessments tools** section, select **SAP® Systems (Preview)** from the **Assess** dropdown menu.
1. On the **Create assessment** page, do the following:
    1. **Assessment name**: enter the name for your assessment.
    2. Select **Edit** to review the assessment properties.
        :::image type="content" source="./media/tutorial-assess-sap-systems/edit-settings.png" alt-text="Screenshot that shows how to edit the settings." lightbox="./media/tutorial-assess-sap-systems/edit-settings.png":::
1. On **Edit settings** page, do the following:
    1. Under **Target settings**,
        1. **Primary location**: Select Azure region to which you want to migrate. Azure SAP systems configuration and cost recommendations are based on the location that you specify.
        1. **Is DR Environment required**: Select **Yes** to enable Disaster Recovery (DR) for your SAP systems.
        1. **DR location**: Select DR location if DR is enabled.

    1. Under **Pricing settings**, do the following:
         1.  **Currency**: Select the currency you want to use for cost view in assessment.
         1. **OS license**: Select the OS license.
         1. **Operating system**: Select the operating system information for the target systems in Azure. You can choose between Windows and Linux OS.
         1. **OS type**: Select the type of OS
    1. Under **Availability settings**, do the following:
        1. Under **Production**:
            1. **Deployment type**: Select **Distributed with high availability (HA)** or **Distributed**.
            1. **Compute availability**: For HA system type, select either available zone or available set options for the assessment.
        1. Under **Non-production**:
            1. **Deployment type**: Select **Distributed with high availability (HA)**,  **Distributed**, or **Single server**.
            1. **Storage settings (non hana only)**: If you intend to conduct the assessment for Non-HANA DB, select from the available storage settings.
            1. **Environment update**: Select the Uptime % and sizing criteria for the different environments in your SAP estate.
1. Select **Save**.

## Run an assessment

To run the assessment, do the following:
    1. Navigate to the **Create assessment** page, select **Review + create assessment** tab.
    1. Review your assessment settings.
    1. Select **Create Assessment**.
1. After the assessment is created, go to **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**. Refresh the tile data by selecting the **Refresh** option on top of the tile. Wait for the data to refresh.
1. Select the image next to **SAP® Systems (Preview)** in the **Assessment** section. 
1. Select the assessment name that you wish to view.

## Review an assessment

To view an assessment, use these steps:

1. Navigate to the **Servers, databases and web apps** page.
1. Within **Assessment tools** section, select the image next to **SAP® Systems (Preview)** under **Assessments**.
1. Select the assessment name that you wish to view.
1. On the **Overview** screen, you can view the details of **Essentials**, **Assessed entities** and **SAP® on Azure** cost estimates.
1. Select **SAP on Azure** from the left pane to view the drill-down assessment details at the System ID (SID) level.
1. Select any SID to further drill-down to the cost view of the SID, including its ASCS, App, and DB server assessments. Additionally, you can view the storage details for the DB server assessments.
1. Review the assessment summary. You can also edit the assessment properties or recalculate the assessment.
> [!NOTE]
> When adjusting the assessment settings, a new assessment is triggered, which takes a few minutes to complete and update the results on the screen.

