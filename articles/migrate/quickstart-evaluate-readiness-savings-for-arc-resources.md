---
title: Quickstart to evaluate migration readiness and savings for Arc resources
description: In this quickstart, you'll learn how you to use Azure Migrate evaluate migration of your Arc enabled servers to Azure. 
author: snehithm
ms.author: snmuvva
ms.service: azure-migrate
ms.topic: quickstart
ms.date: 10/21/2025
monikerRange: migrate
# Customer intent: "As a IT admin, I want to evaluate the readiness and potential savings of migrating my Arc-enabled on-premises servers to Azure."
---

# Quickstart: Evaluate readiness and identify potential savings of migrating your Arc enabled servers to Azure (Preview)

In this quickstart, you'll use Azure Migrate's new [Arc-based discovery](concepts-arc-resource-discovery.md) to evaluate migration readiness and identify potential migration savings of your Arc-enabled servers. 

To view potential savings and readiness of your Arc-enabled servers, you must first create an Azure Migrate project. 

An Azure Migrate project is used to store discovery, assessment, and migration metadata collected from the environment you're assessing or migrating. In a project, you can track discovered assets, create assessments, and orchestrate migrations to Azure.

 
> [!IMPORTANT]
> This feature is currently in preview. As a preview feature, the capabilities presented in this article are subject to [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- You must have the **Azure Migrate Owner** or **Owner** role on at least one resource group where you'll create the Migrate project. 
    - Ensure the `Microsoft.OffAzure` and `Microsoft.Migrate` resource providers are registered on the subscription. Learn how to [register resource providers](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider-1).
- You must have the **Migrate Arc Discovery Reader - Preview** role or a custom role with equivalent permissions on the subscriptions with Arc resources. 
    - Ensure subscriptions with Arc resources that you want to include in the project also have `Microsoft.OffAzure` resource provider registered. 
- Your Arc-enabled Server machines are running connected machine agents of version [1.46 (September 2024 release)](/azure/azure-arc/servers/agent-release-notes-archive#version-146---september-2024) or newer. Machines with older agent versions are excluded from the project as they don’t include all the necessary information for migration assessments.


## Create a migrate project with your Arc resources

1. In the Azure portal, search for *Azure Arc*.
2. In **Services**, select **Azure Arc**.
3. Under **Migration**, select **Savings and Readiness (Preview)**.

    :::image type="content" source="./media/quickstart-evaluate-readiness-savings-for-arc-resources/arc-center-migration-savings-readiness.png" alt-text="Screenshot of Azure portal showing Savings and Readiness pane under Migration in Arc Center." lightbox="./media/quickstart-evaluate-readiness-savings-for-arc-resources/arc-center-migration-savings-readiness.png":::

4. Select **Create a migration project**. 
 
5. Provide a **name** for your migration project
    :::image type="content" source="./media/quickstart-evaluate-readiness-savings-for-arc-resources/create-project-form.png" alt-text="Screenshot of Azure portal showing the form to 'Create a migration project'." lightbox="./media/quickstart-evaluate-readiness-savings-for-arc-resources/create-project-form.png":::
 
6.	Select **Subscription**, **Resource group**, and **Region** for your project. All migration related metadata is stored in this region.
 
7.	Under **Scope**, select one or more **Subscriptions with Arc resources** that you want to include in this project. 
 
8.	Select a **Target region**. This region is where you *plan* to migrate these Arc resources. Target region determines Azure SKU availability and costs in assessment and business case calculations.  

9.	Select **Create**. 

The project will now be created along with default business cases and assessment. Depending on the number of Arc resources, this could take up to an hour. 

## View default business cases

When you create a project with Arc resources, two default business cases are generated, each considering a different migration strategy:

- Modernize strategy (named *default-modernize*)
- Faster migration to Azure strategy (named *default-faster-mgn-az-vm*)

To view the business cases:

1. Navigate to **Savings and Readiness (Preview)** pane in Azure Arc Center as described in previous section. By default, you're taken to the **Business case** tab. 

2. View potential savings at a glance on the cards in the **Recently created** section

    :::image type="content" source="./media/quickstart-evaluate-readiness-savings-for-arc-resources/default-business-cases.png" alt-text="Screenshot of Savings and Readiness showing the business case tab. The cards highlight potential savings from the default business cases." lightbox="./media/quickstart-evaluate-readiness-savings-for-arc-resources/default-business-cases.png":::

3. Select **View** on the card or the name of the business case in the list.

4. Review the report. To learn more about various reports, see [View a business case](how-to-view-a-business-case.md).

## View default assessment

Similarly, when you create an Azure Migrate project with Arc resources, a default assessment named *default-all-workloads* is created. This assessment  evaluates all workloads (servers and SQL Server instances) in scope.

To view the default assessment:

1. Navigate to **Savings and Readiness (Preview)** pane in Azure Arc center as described in the [Create a migrate project with your Arc resources section](#create-a-migrate-project-with-your-arc-resources) section. By default, you're taken to the **Business case** tab.

2. Switch to the **Assessment** tab.

3. View migration readiness percentage for your Arc-enabled resources at a glance on the cards in the **Recently created** section

    :::image type="content" source="./media/quickstart-evaluate-readiness-savings-for-arc-resources/default-assessment.png" alt-text="Screenshot of Savings and Readiness showing the assessment tab. The cards highlight migration readiness percentage calculated from the assessment." lightbox="./media/quickstart-evaluate-readiness-savings-for-arc-resources/default-assessment.png":::

3. Select **View all strategies** on the card or the name of the assessment in the list.

4. Review the report. For details about the information that an assessment provides, see [Assessment report](assessment-report.md).

## Create custom business cases or assessments
Along with default business cases and assessments, you can also create custom business cases and assessments. For example, you might want to generate a business case or assessment scoped to a specific application or use different settings. 

To create a custom business case:

1. Navigate to **Savings and Readiness (Preview)** pane in Azure Arc center as described in the [Create a migrate project with your Arc resources section](#create-a-migrate-project-with-your-arc-resources) section. 

2. Select **+Create**

3. Select **Business case**

4. Follow the steps in [Build a business case](how-to-build-a-business-case.md)


To create a custom assessment:

1. Navigate to **Savings and Readiness (Preview)** pane in Azure Arc center as described in the [Create a migrate project with your Arc resources section](#create-a-migrate-project-with-your-arc-resources) section. 

2. Select **+Create**

3. Select **Assessment**

4. Follow the steps in [Create an application assessment](create-application-assessment.md)


## Delete the project

If you no longer need the project, delete it by following these steps:

1. In Azure portal, search for *Azure Migrate*
2. Under **Services**, select **Azure Migrate**.
3. In **Azure Migrate**, select **All projects**.
4. In **All projects**, search and select the project you want to delete. 
5. Select **Delete** in the toolbar. 
6. In the **Select associated resources** tab, ensure all resources are selected and select **Review**
7. In the **Review** tab, enter the name of the project to confirm deletion
8. Select **Delete**

## Next steps

- Learn how [Arc-based discovery works](concepts-arc-resource-discovery.md)
- [Manage Arc resource data sync in Azure Migrate](how-to-manage-arc-resource-sync.md)
- [Enable additional data collection for more accurate recommendations](how-to-enable-additional-data-collection-for-arc-servers.md)
