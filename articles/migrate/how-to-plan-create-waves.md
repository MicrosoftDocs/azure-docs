---
title: Create Migration Waves in Azure Migrate for Efficient Cloud Migration Planning
description: Learn how to create migration waves in Azure Migrate to group workloads, sequence migrations, and reduce risk. Follow step-by-step guidance for efficient cloud migration planning.
author: shubhamJain1992
ms.author: shuj
ms.service: azure-migrate
ms.topic: how-to
ms.date: 09/01/2026
ms.update-cycle: 365-days
monikerRange: migrate 
# Customer intent: how to plan and execute cloud migration efficiently using Azure Migrate by creating migration waves that group workloads logically, sequence them based on priority, and optionally leverage assessments for optimized migration paths.
---

# Create waves in Azure Migrate for efficient planning (preview)

This article explains how to create migration waves in Azure Migrate to organize and sequence workloads for migration. 

Migration waves are logical groups of applications and workloads that you migrate together. Organizing workloads into waves helps you migrate in smaller, manageable batches, reduce risk, and improve migration efficiency. 

When you plan migration waves, take these key actions:

- **Distribute workloads into waves**: Group workloads and applications that share dependencies or business requirements. This grouping helps ensure that they migrate together without disturbing application functionality.
- **Sequence waves**: Prioritize waves based on factors such as business criticality, complexity, and migration impact.
- **Parallelize where safe:** Run independent waves in parallel to accelerate migration without introducing risk.

In Azure Migrate, you can create and organize migration waves manually based on your migration strategy and workload requirements. Alternatively, you can use automatically generated recommended migration waves based on workload inventory, application dependencies, business criticality, migration readiness, assessment data, and planning conditions.

For more information about grouping and sequencing, see [Azure Cloud Adoption Framework – Migration Wave Planning](/azure/cloud-adoption-framework/migrate/migration-wave-planning).

## Create waves by using the Azure portal

To manually create migration waves by using the Azure Migrate portal, follow these steps:

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

In a few seconds, Azure Migrate creates the wave project. To view it, select **View Waves** in the Project overview.

The created wave includes the workloads and applications you selected. If you selected an assessment, the workloads and applications default to the migration targets and configurations defined in that assessment.

## Create waves by using automated wave planning

Auto wave planning generates a recommended migration waves from your assessment. It groups workloads and applications into migration waves, applies dependency and business rules, and assigns priority scores based on priority, confidence, and risk.

### Prerequisites

Before you generate a wave plan, ensure that you have:

- An Azure Migrate project exists and completed discovery.
- At least one assessment for the workloads you want to include in the wave plan.
- Assigned the **Azure Migrate Owner** or **Azure Migrate Decide and Plan** role on the project.

### Generate your wave plan

Generate a migration wave plan to organize workloads and applications into recommended migration waves based on assessment data, workload dependencies, and migration priorities.

1. In the [Azure portal](https://portal.azure.com), open your **Azure Migrate project**.
1. On the **Project overview** page, select **Assessments**.
1. Select the assessment for which you want to generate a wave plan.
1. For the target migration path, select **Generate wave plan**. The system begins generating your wave plan. During generation, Azure Migrate performs the following actions:

    - Scopes eligible workloads and applications from the assessment.
    - Analyzes dependencies between workloads (if dependency data is available for them).
    - Applies planning conditions such as keeping application components together, separating production from development or test, and more based on the availability of data within the Azure Migrate project.
    - Calculates a Priority score for each workload based on complexity, criticality, readiness, effort, and impact.
    - Optimizes wave sizes and generates a review report with wave planning details.

    :::image type="content" source="./media/how-to-plan-create-waves/assessment.png" alt-text="The screenshot shows how to generate wave plan." lightbox="./media/how-to-plan-create-waves/assessment.png":::

Generation typically completes within three minutes. Large estates might take longer.

When generation completes, the wave plan appears linked from your assessment page. Select it to open the wave plan details.

#### Wave plan for a different migration path

The wave plan can differ for each migration path in an assessment. To view the wave plan for another migration path, select the path and then select **Generate wave plan**. Each migration path has an independent wave plan.

### Review your wave plan

The wave plan details page shows your recommended migration sequence with reasoning.

:::image type="content" source="./media/how-to-plan-create-waves/wave-plan-overview.png" alt-text="The screenshot shows the wave plan overview with recommended waves." lightbox="./media/how-to-plan-create-waves/wave-plan-overview.png":::

The **Wave list** shows each recommended wave with:

- Workload and application count.
- Business criticality and complexity for the wave aggregated from the individual applications or workloads.
- Priority score (0–100, higher indicates earlier migration).
- Per-wave confidence and risk levels.

The **Cross wave dependencies** section shows the dependencies among waves that you need to handle during the migration sequencing.

The **Data Confidence** section reflects the quality of the input data across the categories used by the planning engine. This section displays a confidence level (High, Medium, or Low) for each data category and provides specific recommendations on additional inputs that can help improve the plan. The data categories include:

- **Inventory**: Whether discovered workloads have complete configuration details such as OS, cores, memory, and storage.
- **Dependencies**: Whether dependency analysis data is available for the workloads in scope. Dependency data enables the engine to keep tightly coupled workloads in the same wave.
- **Application mapping**: Whether workloads are grouped into logical applications. When application mappings exist, the engine keeps all components of an application together in a single wave.
- **Business metadata**: Whether attributes such as business criticality, environment (production vs. development and test), and business unit are populated. These attributes drive condition evaluation and priority scoring.

When a category shows Medium or Low confidence, the plan still generates a valid result. Adding the suggested data and regenerating the plan improves grouping accuracy and condition coverage.

The **Risks** section lists the planning conditions that are violated in the current wave plan and require attention. Each risk entry includes:

- **Condition**: The planning rule that isn't fully satisfied, for example, **Separate production and development and test workloads** or **Keep application components together**.
- **Severity**: Whether the violation is critical (blocks safe migration) or advisory (recommended but not required).
- **Impacted waves**: The specific waves where the condition is violated.
- **Mitigation**: A recommended action to resolve the violation, such as moving a workload to a different wave or adding missing data.

Review the risks section before you export or create waves. Address critical risks first, then evaluate advisory risks based on your organization's tolerance. You can resolve risks by [updating the wave plan](#update-the-wave-plan) and reimporting the changes.

#### Regenerate the wave plan

You can regenerate the wave plan, which replaces the existing wave plan for the migration path. When the assessment recalculates, the wave plan becomes outdated. Compare the generation timestamps of the wave plan and the assessment and regenerate the wave plan to keep them in sync.

:::image type="content" source="./media/how-to-plan-create-waves/regenerate-wave-plan.png" alt-text="The screenshot shows the regenerate wave plan action." lightbox="./media/how-to-plan-create-waves/regenerate-wave-plan.png":::

### Export wave plan

You can export the wave plan to download it for offline updates and reviews. To export, select **Export**.

:::image type="content" source="./media/how-to-plan-create-waves/export-wave-plan.png" alt-text="The screenshot shows the wave plan export action." lightbox="./media/how-to-plan-create-waves/export-wave-plan.png":::

The action downloads a ZIP folder that contains three files:

| File | What it contains | What to do with it |
|------|-----------------|-------------------|
| **Inventory to wave mapping** (CSV format) | One row per workload with inventory data and a Wave Name column | Share with stakeholders. Edit the Wave Name column to reassign workloads between waves. |
| **Wave details** (CSV format) | One row per wave with summary properties (cost, confidence, risk, dates, strategy distribution) | Use as a read-only reference during review. |
| **Waveplan report** (md format) | Formatted summary with an executive overview and per-wave rationale | Share with leadership and decision-makers. |

The mapping CSV is the key file for collaboration. Stakeholders can review wave assignments, move workloads between waves by editing the Wave Name column, and return the updated file for reimport.

### Update the wave plan

To update an existing wave plan, follow these steps:

1. Export the **Inventory to wave mapping** CSV file for the wave plan you want to update.
1. Change the **Wave Name** column in the CSV to place the workload in the existing or new wave.
1. Import the updated **Inventory to wave mapping** through the import flow of wave plan.

Follow these rules when you edit the mapping CSV:

**Dos:**

- Change the **Wave Name** column to move workloads between waves.
- Create new wave names. The system accepts them as new waves on import.
- Assign every workload to only one wave.
- Keep all members of the same application in the same wave as a best practice.

**Don't:**

- Add or remove rows. The workload list must match the assessment scope.
- Change inventory columns. The import process ignores these columns and modifying the workload list causes validation failures.
- Leave the **Wave Name** column blank for any workload.

### Import an updated wave plan

After your team reviews and edits the Inventory-to-wave file offline, you can import it back into Azure Migrate to update the wave plan. To import, follow these steps:

1. From the wave plan details page, select **Import wave plan**.
1. Upload your edited mapping CSV.

    :::image type="content" source="./media/how-to-plan-create-waves/import-wave-plan.png" alt-text="The screenshot shows the import wave plan action." lightbox="./media/how-to-plan-create-waves/import-wave-plan.png":::

1. The import replaces the wave plan from where you triggered the import.

Before the plan is updated, the system validates your CSV:

1. **Workload scope**: Every workload in the CSV exists in the assessment scope.
1. **Wave names**: Wave Name values are valid (not empty, no invalid characters).

If validation fails, the existing wave plan isn't modified. You see the failures on the import flow.

When validation passes, the system updates the wave plan directly. The updated plan shows your edited wave assignments preserved exactly as submitted. Because this plan is manually updated, the risks and confidence indicators aren't recalculated.

> [!NOTE]
> Regeneration replaces the current plan. If you import changes and then regenerate, those imported changes are lost. Export before regenerating to keep a backup.

:::image type="content" source="./media/how-to-plan-create-waves/import-success-wave-plan.png" alt-text="The screenshot shows a successfully imported wave plan." lightbox="./media/how-to-plan-create-waves/import-success-wave-plan.png":::

### Create waves from the wave plan

After you review and approve the wave plan, create one or more wave resources to start execution planning. This step creates wave resources from the selected recommendations. To create waves, follow these steps:

1. From the wave plan details page, select **Review and Create Waves**.
1. Select the waves you want to create.
1. Select **Create Waves**.

:::image type="content" source="./media/how-to-plan-create-waves/create-waves.png" alt-text="The screenshot shows the wave creation wizard." lightbox="./media/how-to-plan-create-waves/create-waves.png":::

This selection starts a wave creation flow that you can track in the Azure notification area.

Before creating the wave, the system checks the recommendation against the current inventory:

- **Workloads exist**: All recommended workloads are still in the project inventory.
- **No duplicates**: No workload is assigned to more than one wave.
- **No conflicts**: No workload is already assigned to an existing wave resource.

If the system finds conflicts, the wave creation fails and provides the error details per wave for download. Select the link from the Azure notification or from the ARM activity logs to resolve the issues and try creating the waves again.

After you create waves successfully, you can view the waves in the wave listing page on Azure Migrate. 

## Next steps

Learn more about [complete your wave planning in Azure Migrate](how-to-complete-wave-plan.md).