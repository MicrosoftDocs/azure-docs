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

As part of your migration journey to Azure, assess your on-premises SAP inventory and workloads.

This tutorial explains how you can perform import-based assessments for your on-premises SAP systems using Azure Migrate to generate an assessment report, featuring cost, and sizing recommendations based on cost and performance. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Upload CSV with the server details.
> * Review an assessment.

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario and use default options. 

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.
- Before you follow this tutorial to assess your SAP systems for migration to Azure, make sure you've [discovered the SAP systems](./tutorial-assess-sap-systems.md) you want to assess using the Azure Migrate.
- If you want to try out this feature in an existing project, ensure you are currently within the same project.

## Create an assessment

Create an assessment for the discovered SAP systems as follows:

1. On the **Overview** page > **Servers, databases and web apps**, select **Discover, assess and migrate**.
1. On **Azure Migrate: Discovery and assessment**, select **Assess** and choose the assessment type as **SAP® Systems (Preview)**.
1. In **Assessment name**, enter the name for your assessment.
1. Select **Edit** to review the assessment properties.
    :::image type="content" source="./media/tutorial-assess-sap-systems/edit-settings.png" alt-text="Screenshot that shows how to edit the settings." lightbox="./media/tutorial-assess-sap-systems/edit-settings.png":::
1. In **Target settings**, select the following options:

     **Property** | **Details**
    --- | --- 
    **Primary location** | Select Azure region to which you want to migrate. Azure SAP systems configuration and cost recommendations are based on the location that you specify.
    **Is DR Environment required** | Select **Yes** to enable Disaster Recovery (DR) for your SAP systems.
    **DR location** | Select DR location if DR is enabled.

1. In **Pricing settings**, select the following options:

    **Property** | **Details**
    --- | ---         
    **Currency** | Select the currency you want to use for cost view in assessment.
    **OS license** | Select the OS license.
    **Operating system** | Select the operating system information for the target systems in Azure. You can choose between Windows and Linux OS.
    **OS type** | Select the type of OS.

1. In **Availability settings**, select the following options:
    - For **Production**: 
        - In **Deployment type**, select **Distributed with high availability (HA)** or **Distributed**.
        - In **Compute availability**, for HA system type, select between available zone and available set options for the assessment.
    - For **Non-production**:
        - In **Deployment type**, select **Distributed with high availability (HA)**,  **Distributed**, or **Single server**.

1. In **Storage settings (non hana only)**, if you intend to conduct the assessment for Non-HANA DB, select from the available storage settings.
1. In **Environment update**, select the Uptime % and sizing criteria for the different environments in your SAP estate.
1. Select **Save**.
1. Go to **Azure Migrate: Discovery and assessment** > **Assess**, select **SAP® Systems (Preview)**.
1. On the **Create assessment** page, select **Review + create assessment** to create the assessment.
1. After the assessment is created, go to **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**. Refresh the tile data by selecting the **Refresh** option on top of the tile. Wait for the data to refresh.
1. Select the image next to **SAP® Systems (Preview)** in the **Assessment** section. 
1. Select the assessment name that you wish to view.

## Review an assessment

To view an assessment, use these steps:

1. In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment** > **Assess**, select **SAP® Systems (Preview)**.
1. Select the assessment name that you wish to view.
1. On the **Overview** screen, you can view the details of **Essentials**, **Assessed entities** and **SAP® on Azure** cost estimates.
1. Select **SAP on Azure** from the left pane to view the drill-down assessment details at the System ID (SID) level.
1. Select any SID to further drill-down to the cost view of the SID, including its ASCS, App, and DB server assessments. Additionally, you can view the storage details for the DB server assessments.
1. Review the assessment summary. You can also edit the assessment properties or recalculate the assessment.
> [!NOTE]
> When adjusting the assessment settings, a new assessment is triggered, which takes a few minutes to complete and update the results on the screen.

