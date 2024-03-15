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

# Tutorial: Assess SAP systems for migration to Azure (preview)

As part of your migration journey to Azure, discover your on-premises SAP inventory and workloads.

This tutorial explains how to perform import-based assessments for your on-premises SAP systems using import option to generate an assessment report, featuring cost, and sizing recommendations based on cost and performance. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an assessment
> * Review an assessment

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario and using default options. 

## Prerequisites

Before you get started, ensure the following:

- You've an Azure subscription. If not, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.
- You've [discovered the SAP systems](./tutorial-discover-sap-systems.md) you want to assess using the Azure Migrate.

> [!NOTE]
> If you want to try out this feature in an existing project, ensure you are currently within the same project.
> If you want to create a new project for assessment, [create a new project](./create-manage-projects.md).


## Create an assessment

To create an assessment for the discovered SAP systems, follow these steps:

1. Sign into the [Azure portal](https://ms.portal.azure.com/#home) and search for **Azure Migrate**.
1. On the **Azure Migrate** page, under **Migration goals**, select **Servers, databases and web apps**.
1. On the **Servers, databases and web apps** page, under **Assessments tools**, from the **Assess** dropdown menu, select **SAP® Systems (Preview)**.

    :::image type="content" source="./media/tutorial-assess-sap-systems/assess-sap-systems.png" alt-text="Screenshot that shows assess option." lightbox="./media/tutorial-assess-sap-systems/assess-sap-systems.png":::

1. On the **Create assessment** page, unser **Basics** tab, do the following:
    1. **Assessment name**: Enter the name for your assessment.
    2. Select **Edit** to review the assessment properties.
        :::image type="content" source="./media/tutorial-assess-sap-systems/edit-settings.png" alt-text="Screenshot that shows how to edit the settings." lightbox="./media/tutorial-assess-sap-systems/edit-settings.png":::
1. On **Edit settings** page, do the following:
    1. **Target settings**:
        1. **Primary location**: Select Azure region to which you want to migrate. Azure SAP systems configuration and cost recommendations are based on the location that you specify.
        1. **Is Disaster Recovery (DR) Environment required?**: Select **Yes** to enable Disaster Recovery (DR) for your SAP systems.
        1. **Disaster Recovery (DR) location**: Select DR location if DR is enabled.

            :::image type="content" source="./media/tutorial-assess-sap-systems/target-settings.png" alt-text="Screenshot that shows the fields in target settings." lightbox="./media/tutorial-assess-sap-systems/target-settings.png":::

    1. **Pricing settings**:
         1.  **Currency**: Select the currency you want to use for cost view in assessment.
         1. **OS license**: Select the OS license.
         1. **Operating system**: Select the operating system information for the target systems in Azure. You can choose between Windows and Linux OS.
             
            :::image type="content" source="./media/tutorial-assess-sap-systems/pricing-settings.png" alt-text="Screenshot that shows the fields in pricing settings." lightbox="./media/tutorial-assess-sap-systems/pricing-settings.png":::

    1. **Availability settings**:
        1. **Production**:
            1. **Deployment type**: Select a desired deployment type.
            1. **Compute availability**: For HA system type, select a desired compute availability option for the assessment.
        1. **Non-production**:
            1. **Deployment type**: Select a desired deployment type.                       
        
        :::image type="content" source="./media/tutorial-assess-sap-systems/availability-settings.png" alt-text="Screenshot that shows the fields in availability settings." lightbox="./media/tutorial-assess-sap-systems/availability-settings.png":::

    1. **Environment uptime**: Select the uptime % and sizing criteria for the different environments in your SAP estate.
    1. **Storage settings (non hana only)**, if you intend to conduct the assessment for Non-HANA DB, select from the available storage settings.
1. Select **Save**.

## Run an assessment

To run the assessment, follow these steps:
    1. Navigate to the **Create assessment** page and select **Review + create assessment** tab to review your assessment settings.
    1. Select **Create assessment**.

## Review an assessment

To view an assessment, follow these steps:

1. On the **Azure Migrate** page, under **Migration goals**, select **Servers, databases and web apps**.
1. On the **Servers, databases and web apps** page, under **Assessment tools**, select the number associated with **SAP® Systems (Preview)** under **Assessments**.

    :::image type="content" source="./media/tutorial-assess-sap-systems/review-assess.png" alt-text="Screenshot that shows the option to access assess." lightbox="./media/tutorial-assess-sap-systems/review-assess.png":::

1. On the **Assessments** page, select a desired assessment name that you wish to view from the list of assessments. <br/>On the **Overview** page, you can view the SAP system details of **Essentials**, **Assessed entities** and **SAP® on Azure** cost estimates.
1. Select **SAP on Azure** from the left pane to view the drill-down assessment details at the System ID (SID) level.
1. On the **SAP on Azure** page, select any SID to further drill-down to the cost view of the SID, including its ASCS, App, and DB server assessments. Additionally, you can view the storage details for the DB server assessments.
1. Review the assessment summary. You can also edit the assessment properties or recalculate the assessment.
> [!NOTE]
> When adjusting the assessment settings, a new assessment is triggered, which takes a few minutes to complete and update the results on the screen.

