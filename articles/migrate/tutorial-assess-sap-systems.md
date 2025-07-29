---
title: Assess SAP systems for the migration 
description: Learn how to assess SAP systems with Azure Migrate.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 02/06/2025
ms.custom: engagement-fy25
monikerRange: migrate-classic

# Customer intent: As an IT administrator, I want to assess my on-premises SAP systems for migration to Azure, so that I can understand the cost and performance requirements for a successful transition.
---

# Tutorial: Assess SAP systems for migration to Azure (preview)

As part of your migration journey to Azure, assess the appropriate environment on Azure that meets the need of your on-premises SAP inventory and workloads.

This tutorial explains how to perform assessments for your on-premises SAP systems using import option for Discovery. This assessment helps to generate an assessment report, featuring cost, and sizing recommendations based on cost and performance. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an assessment
> * Review an assessment

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario and using default options. 

## Prerequisites

Before you get started, ensure that you've:

- An Azure subscription. If not, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.
- [Discovered the SAP systems](./tutorial-discover-sap-systems.md) you want to assess using the Azure Migrate.

> [!NOTE]
> - If you want to try this feature in an existing project, ensure you are currently within the same project.
> - If you want to create a new project for assessment, [create a new project](./create-manage-projects.md#create-a-project-for-the-first-time).
> - For SAP discovery and assessment to be accessible, you must create the project either in the Asia or United States geographies. The location selected for the project **doesn't limit** the target regions that you can select in the assessment settings, see [Create an assessment](#create-an-assessment). You can select any Azure region as the target for your assessments.


## Create an assessment

To create an assessment for the discovered SAP systems, follow these steps:

1. Sign into the [Azure portal](https://ms.portal.azure.com/#home) and search for **Azure Migrate**.
1. On the **Azure Migrate** page, under **Migration goals**, select **Servers, databases and web apps**.
1. On the **Servers, databases and web apps** page, under **Assessments tools**, select **SAP® Systems (Preview)** from the **Assess** dropdown menu.

    :::image type="content" source="./media/tutorial-assess-sap-systems/assess-sap-systems.png" alt-text="Screenshot that shows assess option." lightbox="./media/tutorial-assess-sap-systems/assess-sap-systems.png":::

1. On the **Create assessment** page, under **Basics** tab, do the following:
    1. **Assessment name**: Enter the name for your assessment.
    2. Select **Edit** to review the assessment properties.
        :::image type="content" source="./media/tutorial-assess-sap-systems/edit-settings.png" alt-text="Screenshot that shows how to edit the settings." lightbox="./media/tutorial-assess-sap-systems/edit-settings.png":::
1. On **Edit settings** page, do the following:
    1. **Target settings**:
        1. **Primary location**: Select Azure region to which you want to migrate. Azure SAP systems configuration and cost recommendations are based on the location that you specify.
        1. **is Disaster Recovery (DR) environment required?**: Select **Yes** to enable Disaster Recovery (DR) for your SAP systems.
        1. **Disaster Recovery (DR) location**: Select DR location if DR is enabled.

            :::image type="content" source="./media/tutorial-assess-sap-systems/target-settings-edit.png" alt-text="Screenshot that shows the fields in target settings." lightbox="./media/tutorial-assess-sap-systems/target-settings-edit.png":::

    1. **Pricing settings**:
         1.  **Currency**: Select the currency you want to use for cost view in assessment.
         1. **OS license**: Select the OS license.
         1. **Operating system**: Select the operating system information for the target systems in Azure. You can choose between Windows and Linux OS.
             
            :::image type="content" source="./media/tutorial-assess-sap-systems/pricing-settings-edit.png" alt-text="Screenshot that shows the fields in pricing settings." lightbox="./media/tutorial-assess-sap-systems/pricing-settings-edit.png":::

    1. **Availability settings**:
        1. **Production**:
            1. **Deployment type**: Select a desired deployment type.
            1. **Compute availability**: For High Availability (HA) system type, select a desired compute availability option for the assessment.
        1. **Non-production**:
            1. **Deployment type**: Select a desired deployment type.                       
        
        :::image type="content" source="./media/tutorial-assess-sap-systems/availability-settings-edit.png" alt-text="Screenshot that shows the fields in availability settings." lightbox="./media/tutorial-assess-sap-systems/availability-settings-edit.png":::

    1. **Environment uptime**: Select the uptime % and sizing criteria for the different environments in your SAP estate.
    1. **Storage settings (non hana only)**: if you intend to conduct the assessment for Non-HANA DB, select from the available storage settings.
1. Select **Save**.

## Run an assessment

To run an assessment, follow these steps:

1. Navigate to the **Create assessment** page and select **Review + create assessment** tab to review your assessment settings.
1. Select **Create assessment**.

> [!NOTE]
> After you select **Create assessment**, wait for 5 to 10 minutes and refresh the page to check if the assessment computation is completed.


## Next steps
Find server dependencies using [dependency mapping](concepts-dependency-visualization.md).

