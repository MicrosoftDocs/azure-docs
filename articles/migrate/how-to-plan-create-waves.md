---
title: Create Migration Waves in Azure Migrate for Efficient Cloud Migration Planning
description: Learn how to create migration waves in Azure Migrate to group workloads, sequence migrations, and reduce risk. Follow step-by-step guidance for efficient cloud migration planning.
author: shubhamJain1992
ms.author: shuj
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.topic: how-to
ms.date: 11/04/2025
monikerRange: migrate 
# Customer intent: how to plan and execute cloud migration efficiently using Azure Migrate by creating migration waves that group workloads logically, sequence them based on priority, and optionally leverage assessments for optimized migration paths.
---

# Create waves in Azure Migrate for efficient planning (preview)

This article explains how to create migration waves in Azure Migrate to group workloads, sequence migrations, and plan execution efficiently for reduced risk and improved migration speed.

To create migration waves, group your applications and workloads into logical sets that you can be migrated together. These groups called **waves** help you execute migrations in smaller, manageable batches, reduce risk and improving efficiency. The key planning actions include:

- **Distribute workloads into waves**: Group workloads and applications that share dependencies or business requirements. This ensures they migrate together without breaking the application's functionality.
- **Sequence waves**: Prioritize waves based on factors such as business criticality, complexity, and migration impact.
- **Parallelize where safe:** Run independent waves in parallel to accelerate migration speed without introducing risk.

For more information on grouping and sequencing, see, [Azure Cloud Adoption Framework – Migration Wave Planning](/azure/cloud-adoption-framework/migrate/migration-wave-planning).

## Create Waves using Azure portal

To create Migration Waves manually using Azure Migrate portal, follow these steps:

1. Select your project from **All Projects** in Azure portal.

     :::image type="content" source="./media/how-to-plan-create-waves/project-listing-page.png" alt-text="The screenshot shows the project listing page." lightbox="./media/how-to-plan-create-waves/project-listing-page.png":::

1. In **Overview** pane, select **Create Wave**

    :::image type="content" source="./media/how-to-plan-create-waves/project-overview.png" alt-text="The screenshot shows the overview of the project." lightbox="./media/how-to-plan-create-waves/project-overview.png":::

1. Enter a unique name in **Wave name** for execution and tracking.
1. Enter the **Planned start date** for the wave migration.
1. *Optional* Select an **Assessment** to get recommendations on the Azure targets and workload configurations. Use an assessment to accelerate wave planning.  
1. Select the **Migration path** from the assessment based on your business strategy. If the assessment includes only a single path, this option isn't available.

     :::image type="content" source="./media/how-to-plan-create-waves/wave-create.png" alt-text="The screenshot shows how to create wave." lightbox="./media/how-to-plan-create-waves/wave-create.png":::

1. Review, add, and remove workloads and applications that you want to include in the wave. You can use filters to refine the selection.  
    If you select an assessment, workloads and applications are limited to its scope of that assessment. You can add more workloads and applications later.

8. After you finalized the wave components, select **Create Wave**.

:::image type="content" source="./media/how-to-plan-create-waves/wave-create-completion.png" alt-text="The screenshot shows the completion of the wave creation." lightbox="./media/how-to-plan-create-waves/wave-create-completion.png":::

In few seconds, Azure Migrate creates the wave project. To view it, select **View Waves** in the Project overview.

The created wave includes the workloads and applications you selected. If you selected an assessment, the workloads and applications default to the migration targets and configurations defined in that assessment.

## Next steps

Learn more about [complete your wave planning in Azure Migrate](how-to-complete-wave-plan.md).