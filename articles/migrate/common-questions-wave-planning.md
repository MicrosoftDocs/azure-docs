---
title: Common questions about wave planning in Azure Migrate
description: Get answers to common questions about wave plan recommendations, configuration, downloads, and commitment in Azure Migrate.
author: shubhamJain1992
ms.author: shuj
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 11/02/2026
ms.update-cycle: 365-days
monikerRange: migrate
# Customer intent: As a migration lead, I want answers to common wave planning questions so that I can review recommendations, update proposed assignments, and commit waves with confidence.
---

# Wave planning in Azure Migrate (preview): Common questions

This article answers common questions about wave planning in Azure Migrate. For concepts and planning logic, see [Wave planning overview](wave-plan-overview.md). For portal instructions, see [Configure a wave plan](how-to-configure-wave-plan.md).

## General

### Is wave planning mandatory for migrations?

No. You can use Azure Migrate migration capabilities without generating a wave plan. Wave planning helps you review and configure recommended migration batches before committing waves.

### What is the difference between a wave plan and a committed wave?

A wave plan recommends workload grouping and sequence for an assessment and migration path. You can review and configure proposed waves before accepting them.

A committed wave is a wave you accept for execution. Commitment doesn't start workload migration. For the commitment procedure, see [Commit the wave plan](how-to-configure-wave-plan.md#commit-the-wave-plan).

### What data is required to generate a wave plan?

At a minimum, you need a workload inventory with configuration data and a completed assessment. Dependency data, application mappings, and business metadata help improve grouping and sequence recommendations.

For the inputs and how they're used, see [Data inputs](wave-plan-overview.md#data-inputs). For project and role requirements, see [Prerequisites](how-to-configure-wave-plan.md#prerequisites).

### Can an assessment have multiple wave plans?

An assessment can have a wave plan for each migration path. Check **Planning based on assessment** and **Selected path** before reviewing or changing a plan.

## Generation and recommendations

### How long does wave plan generation take?

Generation typically finishes within three minutes, but large estates can take longer. Wait for processing to complete, then select **Refresh**. If generation fails or doesn't complete, create an Azure support request and include the operation details.

### Why does my plan look outdated?

A plan reflects the project state when it was generated. Assessment updates, newly discovered inventory or dependencies, enriched application details, and changes to migration waves can make it outdated.

Select **Regenerate** to reset proposed waves by using the latest project information. This action overwrites proposed edits, including imported assignments, but leaves committed waves unchanged. Save a copy of reviewed assignments first. See [Regenerate the wave plan](how-to-configure-wave-plan.md#regenerate-the-wave-plan).

### Why can't the engine satisfy every planning condition?

Conditions can conflict, or the data needed to evaluate them might be missing. The engine seeks to satisfy as many applicable conditions as possible, giving precedence to higher-priority conditions. For example, keeping application components together takes precedence over separating environments.

Review the plan reasoning and recommendations for the tradeoffs. See the ordered [Planning conditions](wave-plan-overview.md#planning-conditions).

### Can I change the target number of workloads per wave?

No. Automatically generated waves have a fixed target of 50 workloads per wave. The actual size can differ to account for dependencies and planning conditions, but you can't configure the target.

### Why aren't all communicating servers grouped together?

A network connection alone doesn't mean that servers must migrate together. The engine filters noise, such as DNS connections, and applies thresholding to identify significant dependencies. Strong two-way dependencies define the initial groups.

For the grouping process, see [Identify groups](wave-plan-overview.md#phase-2-identify-groups).

### Why do application counts differ from the full inventory?

Application counts in the waves include applications identified from workloads in scope of the wave plan, even if you didn't directly select the applications in the assessment.

When comparing counts, review the selected assessment, migration path, and [individual wave details](wave-plan-overview.md#individual-wave-details).

## Dependencies and risks

### What is a cross-wave dependency?

A cross-wave dependency exists when a workload in one wave requires a service or workload in another wave. The required workload should migrate in the same wave or an earlier wave.

The **Cross wave dependencies** section identifies the affected waves and explains their relationships. See [Wave plan reasoning](wave-plan-overview.md#wave-plan-reasoning).

### What does the risk count mean, and how do I address risks?

The count identifies migration issues that need review, such as unsatisfied planning conditions, dependency conflicts, or missing input data. It doesn't indicate migration progress.

Review **Risks and recommendations** for the affected workloads and suggested actions. If source data needs updating, correct missing metadata or improve dependency and application mappings, then regenerate the plan. After regeneration, import and save any required changes to proposed assignments. Don't select **Regenerate** after importing assignment changes unless you intend to reset them. Review the resulting dependencies and risks before commitment.

For assignment changes, see [Edit the wave plan](how-to-configure-wave-plan.md#edit-the-wave-plan).

## Configuration and download

### How do I edit proposed wave assignments?

Export the inventory-to-wave mapping CSV file from **Configure waves** and update only the **Wave name** column. Preserve workload rows, identifiers, other inventory values, and column headers. Import and validate the mapping file, then save the configuration.

For the complete procedure and editing rules, see [Edit the wave plan](how-to-configure-wave-plan.md#edit-the-wave-plan).

### What happens if validation fails?

The existing plan remains unchanged. Download the error file, correct the mapping file, and import and validate it again. Keep the **Configure waves** pane open while processing. Save the configuration only after validation succeeds.

See [Import and validate the mapping](how-to-configure-wave-plan.md#step-3-import-and-validate-the-mapping).

### How is saving configurations different from selecting Regenerate?

Saving configurations preserves your imported proposed assignments and reassesses risks. Selecting **Regenerate** resets the proposal by using the latest project information and overwrites imported edits. Neither action changes committed assignments.

After saving, review the resulting assignments, sequence, dependencies, and risks. Successful file validation doesn't replace this review. See [Save the configuration](how-to-configure-wave-plan.md#step-4-save-the-configuration).

### Can I change a committed wave through the configuration file?

No. Configuration imports apply only to proposed waves. Use **Wave status** in the mapping file to identify committed waves; changes to their assignments aren't applied during import.

### What can I download for stakeholder review?

The download is a ZIP file containing the inventory-to-wave mapping CSV file, a wave details CSV file, an overall wave plan report in Markdown format, and a separate Markdown report for each wave. Extract the ZIP file to review the reports offline and share them for stakeholder approval.

Downloading doesn't apply changes or commit waves. See [Download the wave plan](how-to-configure-wave-plan.md#download-the-wave-plan) for file details.

## Wave commitment

### Can I commit some waves while reviewing the rest?

Yes. Commit approved waves in the recommended sequence while continuing to review other proposed waves. Proceed with migration in that sequence so that dependencies are available when later waves need them.

### Where do I go after committing waves?

In your Azure Migrate project, select **Execute** > **Waves**. Migration execution and tracking take place separately from wave planning.

## Related content

- [Wave planning overview](wave-plan-overview.md).
- [Configure a wave plan](how-to-configure-wave-plan.md).
