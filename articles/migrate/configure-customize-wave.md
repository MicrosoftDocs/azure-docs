---
title: Configure and customize a migration wave in Azure Migrate (preview)
description: Configure your wave's workload settings, then review and customize its execution plan and configure inputs before execution.
author: snehithm
ms.author: snmuvva
ms.service: azure-migrate
ms.topic: how-to
ms.date: 10/28/2026

#CustomerIntent: As a migration engineer, I want to configure my wave and customize its execution plan so that the migration meets my organization's requirements.
---
# Configure and customize a migration wave (preview)

After creating a wave in Azure Migrate, finalize its workloads and properties. Configure the target Azure service and migration method for each workload before reviewing its execution plan.

Then review and customize the execution plan, including its steps, dependencies, approvals, and step group structure. Configure the required inputs before starting the wave.

## Prerequisites

- Have the **Azure Migrate Owner** or **Azure Migrate Execute Expert** role on the Azure Migrate project. Either role permits changing workload settings, customizing the execution plan, and configuring inputs.
- Confirm that workload settings are editable. You can't edit them when the wave's **Execution status** is **In progress**, or **Needs action** (when execution is paused) or **Completed**.
- Migration tools and the Execution agent don't need to be ready to configure the wave or its execution plan. Preparation depends on the selected migration methods. Review the [execution prerequisites](execute-wave-migration.md#prerequisites) before starting.
- If you plan to add custom script steps, identify the script's relative path within the host's script store. See [Configure a custom script step](#configure-a-custom-script-step) for the default directories and script preparation.

## Configure the wave

Finalize the workloads to include and the wave's properties before customizing its execution plan. Adding or removing workloads, or changing their target Azure services or migration methods, makes an existing execution plan out of date. [Regeneration](#regenerate-the-execution-plan) discards all execution-plan customizations, so make these changes first.

### Add applications or workloads

1. In the Azure Migrate project, go to **Execute** > **Waves**, open the wave, and select **Overview**.
2. Select **Add**, and then choose **Applications** or **Workloads**.

:::image type="content" source="./media/configure-customize-wave/add-applications-workloads-menu.png" alt-text="Screenshot of the wave Overview with the Add menu expanded to show Applications and Workloads." lightbox="./media/configure-customize-wave/add-applications-workloads-menu.png":::

#### Add applications

When you add an application, you also add its member workloads that aren't already assigned to another wave. In the **Workloads** column, a count such as **14/50** means that 14 of the application's 50 workloads aren't assigned to any wave. Applications whose workloads are all assigned to other waves are disabled.

1. On **Select applications**, use search and filters as needed to find the applications you want to add.
2. Select the applications and review the **Workloads** column for their member workloads.
3. Select **Add**. You return to the wave's **Overview**.

:::image type="content" source="./media/configure-customize-wave/select-applications.png" alt-text="Screenshot of Select applications with application checkboxes, the Workloads column, search and filter controls, and the Add button." lightbox="./media/configure-customize-wave/select-applications.png":::

#### Add individual workloads

1. On **Select workloads**, use search and filters as needed to find the workloads you want to add.
2. Select the workloads by using their checkboxes.
3. Select **Add workloads**. You return to the wave's **Overview**.

:::image type="content" source="./media/configure-customize-wave/select-workloads.png" alt-text="Screenshot of Select workloads with workload checkboxes, search and filter controls, and the Add workloads button." lightbox="./media/configure-customize-wave/select-workloads.png":::

After adding workloads, [configure any missing target Azure services and migration methods](#configure-workload-settings). If an execution plan already exists, [regenerate it](#regenerate-the-execution-plan) before customizing it or starting execution.

### Remove applications or workloads

Removal changes only wave membership. It doesn't delete discovered resources or the actual workloads.

If an execution plan already exists, removal makes it out of date. [Regeneration](#regenerate-the-execution-plan) discards all execution-plan customizations, so record changes you need to reapply before proceeding.

1. Open the wave's **Overview**.
2. Select **View by workload** and select the workloads to remove. To remove whole applications, select **View by application** and select the applications instead.
3. Select **Remove**, then confirm **Remove** in **Remove confirmation**.
4. If an execution plan already exists, open **Execution plan** and [regenerate it](#regenerate-the-execution-plan) before customizing it or starting execution.

### Configure workload settings

1. In the Azure Migrate project, go to **Execute** > **Waves**, open the wave, and select **Overview**.
2. Select **Configure settings** > **Configure workload settings**.
3. Select **Export file** to download a ZIP file the current workload settings in a comma-separated values (CSV) file and a readme file with editing instructions.
4. Extract the ZIP file. Follow the readme file to update the target and migration-method columns in the CSV for the workloads you need to configure. Keep the file structure unchanged.
5. Save the edited file in CSV format.
6. In **Configure workload settings**, use **Browse** to upload the edited CSV, not the ZIP.
7. Select **Validate file**. If validation reports errors, download the errors file and use it to correct the settings CSV. Upload the corrected CSV and select **Validate file** again.
8. After validation succeeds, **Save settings** becomes enabled. Select it to save the workload settings.
9. Open **Execution plan**. The initial plan is generated automatically once every workload has a target Azure service and migration method. If you changed either setting after a plan was generated, [regenerate the execution plan](#regenerate-the-execution-plan) before customizing steps or inputs.

:::image type="content" source="./media/configure-customize-wave/configure-workload-settings.png" alt-text="Screenshot of the Configure workload settings pane with export, CSV upload, validation, and save controls." lightbox="./media/configure-customize-wave/configure-workload-settings.png":::

### Edit wave properties

1. From the wave's **Overview**, select **Configure settings** > **Wave properties**.
2. Review or update the wave's name, description, planned start and end dates, and dependencies.
3. Select **Save changes** to apply the updates. No further confirmation is required.

Changes to wave properties update the wave's metadata and don't require execution-plan regeneration.

Wave-level dependencies don't block execution. If you start a wave before its predecessor waves complete, Azure Migrate shows a warning but allows execution to proceed.

:::image type="content" source="./media/configure-customize-wave/wave-properties.png" alt-text="Screenshot of the Wave properties pane showing name, description, planned dates, wave dependencies, and save controls." lightbox="./media/configure-customize-wave/wave-properties.png":::

## Review the execution plan

Waves you create from a wave plan already have target Azure services and migration methods, so Azure Migrate automatically generates their initial execution plans. For a manually created wave, Azure Migrate automatically generates the initial plan once you configure these settings for every workload. For more details, see [When generation happens](wave-migrations.md#execution-plan). The following procedure includes manual generation when automatic generation fails.

1. In the Azure Migrate project, select **Waves** under **Execute**, open the wave, and select **Execution plan**. Complete **Configure workload settings** if requested.
2. A banner indicates when generation is in progress; wait for it to finish. If generation fails, a banner indicates the failure. If the execution plan is out of date, a banner indicates the same. Select **Generate execution plan** or **Regenerate plan**, as applicable, to try again.
4. Once generation completes, review the generated steps. By default, the table shows steps organized per application. Select **View by step group** if you would rather view steps organized by their step group.
5. Review steps and workloads each step applies to. Use filters to view steps for a particular workload or application.
6. Confirm that all wave workloads are covered and have the steps for their selected migration methods. If a workload is missing, check that it belongs to the wave and is present in discovered inventory.
7. Review generated approval steps and identify additional decisions or external work your process requires.
8. Review the **Depends on** column, especially dependencies across groups, to confirm coordinated cutover points. Open **Step details** for the dependency's **Wait for** setting.

:::image type="content" source="./media/configure-customize-wave/generated-execution-plan.png" alt-text="Screenshot of a generated execution plan showing steps grouped by application, step groups, dependencies, and associated workloads." lightbox="./media/configure-customize-wave/generated-execution-plan.png":::

For how Azure Migrate builds the workflow, see [Execution plan](wave-migrations.md#execution-plan).

### Regenerate the execution plan

If the wave's workloads, target Azure services, or migration methods change after generation, its execution plan becomes out of date and must be regenerated before the wave can execute.

> [!IMPORTANT]
> Regeneration creates the execution plan afresh and discards all user edits, including dependency changes on generated steps, added or deleted steps, grouping, names, descriptions, and inputs.

For the lifecycle explanation, see [Locking and regeneration](wave-migrations.md#wave-changes).

1. Note all customizations you need to reapply.
2. On **Execution plan**, select **Regenerate plan** and accept the confirmation.
3. Review the newly generated execution plan, then follow the customization and input procedures in the following section to reapply your changes.

## Add steps if needed

Add the external work, decisions, or scripts your migration process needs before execution starts.

> [!IMPORTANT]
> Finalize the workload selection, step group, and, for custom scripts, the relative script path, execution frequency, and execution location before saving. Once you add the step, you can't edit these settings.

1. Identify where your process needs an external action, a decision, or a script.
2. On **Execution plan**, select **Add step**.
3. Choose **Step type**: **Manual** for external work, **Approval** for a decision, or **Custom script** for your own scripts.
4. Enter **Step name** and **Description**, and then select **Step group**.
5. Configure approval or script settings as described in the following sections.
6. If the new step must wait for other work, under **Depends On (Steps)**, select each preceding **Step** and its **Wait for** value. Leave predecessors unset to let the step run first or in parallel with the group's initial steps when the group can start. Select **Workloads** when the step type requires workload scope.
7. Select **Save** to save the step immediately and create a new execution plan version. No further confirmation is required.
8. If later work must wait for the new step, open the downstream step's **Step details**. Under **Depends On (Steps)**, choose the new step and its **Wait for** value, and then select **Save**.

### Configure an approval step

After choosing **Approval** and completing the common fields:

1. Use **Description** to explain why this approval exists and what it needs to gate.
2. Under **Workloads**, all workloads are selected by default. Change the selection as needed so that it contains the workloads governed by this decision.
3. Under **Depends On (Steps)**, configure any predecessors the approval must wait for and their **Wait for** values. Then finish the [common add-step procedure](#add-steps-if-needed).

:::image type="content" source="./media/configure-customize-wave/add-approval-step.png" alt-text="Screenshot of the Add step pane for an approval step, including workload selection and dependency settings." lightbox="./media/configure-customize-wave/add-approval-step.png":::

During execution, you can [approve one, a few, or all of the ready workloads](execute-wave-migration.md#approve-ready-workloads-at-approval-steps).

### Configure a custom script step

Place the script in the script store folder on Azure Migrate appliance or an execution agent:

| Host operating system | Script store directory |
| --- | --- |
| Windows | `%ProgramData%\Microsoft Azure\ScriptStore\` |
| Linux | `/var/opt/microsoft/azuremigrate/scriptstore` |

You can place scripts directly in the directory or in subfolders. Reference the script by its path relative to the script store, such as `validation\check.ps1` on Windows or `validation/check.sh` on Linux. PowerShell and Bash are supported; you don't need to specify a script type.

Azure Migrate executes the script as provided; you don't need to add status-reporting code. Exit code `0` means success, and every other exit code means failure.

After choosing **Custom script** and completing the common fields:

1. In **Relative script path**, enter the script's path relative to the script store. Script content isn't stored in the execution spec.
2. Use **How often script should run** to choose whether the script runs once for the wave or once per workload. For per-workload execution, select the **Workloads**.
3. If you selected once per workload in the previous step, use **Where should this script run** to choose **On source VM** or **On target VM**. If you select **On target VM**, you must provide the target VM resource ID when you [configure inputs](#configure-inputs-on-every-step) and configure a dependency on the step that creates the target VM so that the script runs only after the target VM is available.
4. If the script must wait for other work, under **Depends On (Steps)**, choose the preceding step and **Wait for** value. Otherwise, leave predecessors unset.
5. Select **Save** to add the step. If it must gate later work, use step 8 of the [common add-step procedure](#add-steps-if-needed) after saving it.
6. Configure the script's required inputs and timeout when you [configure inputs](#configure-inputs-on-every-step). Only custom script steps expose a configurable timeout.

:::image type="content" source="./media/configure-customize-wave/add-custom-script-per-workload.png" alt-text="Screenshot of Add step for a custom script with a relative script path, per-workload execution, source execution location, dependencies, and workload selection." lightbox="./media/configure-customize-wave/add-custom-script-per-workload.png":::

:::image type="content" source="./media/configure-customize-wave/add-custom-script-on-host.png" alt-text="Screenshot of Add step for a custom script configured to run once on the appliance or Execution Agent, with dependency and save controls." lightbox="./media/configure-customize-wave/add-custom-script-on-host.png":::

For notifications or logging that must not gate other work, leave the script without dependent steps. The script can still have predecessors. For a required validation check, make the later steps depend on the script. See [Custom script step properties](reference-wave-migrations.md#custom-script-step-properties).

## Remove or update steps

Generated and user-added steps use the same editing controls. Once you add a step, you can't edit its workload selection or step group. For custom scripts, you also can't edit the relative script path, execution frequency, or execution location. Configure input values separately through **Configure parameters**.

> [!IMPORTANT]
> Required steps can't be deleted, and no step can be skipped during execution. Before deleting an optional step, remove dependencies on it from other steps and save those changes.

1. Review optional steps, such as a test migration step. After removing any dependencies on an unnecessary step, use its row delete icon, and then select **Delete** in the **Delete step** confirmation.
2. Select a retained step's name to open **Step details**. Under **Basics**, update **Name** and **Description** as needed. **Type**, **Step group**, and the workload and affected-application counts are read-only. The **Parameters** section displays input values; use **Configure parameters** to edit them through the shared input-configuration flow.
3. Under **Depends On (Steps)**, choose each preceding **Step** and its **Wait for** value to update user-editable dependencies. The **Wait for** choices are **The whole step** and **Each workload's step completion**. System-defined prerequisites are read-only and can't be changed or removed.
4. Review the remaining dependencies and workload references. Edits must not create circular dependencies, reference workloads outside the wave, or introduce unsupported steps.
5. Select **Save** in **Step details** to save workflow edits and create a new execution plan version. Changes to input values update only the parameters file, not the execution spec.

:::image type="content" source="./media/configure-customize-wave/generated-step-details.png" alt-text="Screenshot of generated Step details with editable name and description, read-only type and group, dependency controls, and displayed input values." lightbox="./media/configure-customize-wave/generated-step-details.png":::

:::image type="content" source="./media/configure-customize-wave/generated-step-prerequisites.png" alt-text="Screenshot of a workload-scoped generated step showing a read-only system-defined prerequisite and controls for user-defined dependencies." lightbox="./media/configure-customize-wave/generated-step-prerequisites.png":::

Delete unnecessary optional steps before execution. Retained steps run according to their dependencies and approvals. You can't delete steps or make structural edits while a run is active.

For other edit types and restrictions, see the [customization capability matrix](reference-wave-migrations.md#customization-capability-matrix).

## Review step group organization

Review the groups and their dependencies with the teams responsible for the migration.

1. Select **View by step group** on **Execution plan** to review the plan's groups.
2. Expand each group and review its steps and associated workloads.
3. Compare the groups with the [default structure](wave-migrations.md#step-groups) and identify the teams responsible for the work.
4. Review the **Depends on** column and open **Step details** to check cross-group dependencies, especially around cutover.
5. Select **View by application** to review the execution plan from application ownership instead.

:::image type="content" source="./media/configure-customize-wave/execution-plan-step-groups.png" alt-text="Screenshot of the execution plan grouped by step group, showing initialization, application, and ungrouped-workload steps with dependencies and associated workloads." lightbox="./media/configure-customize-wave/execution-plan-step-groups.png":::

You can split and merge step groups only through Azure CLI and API, not the portal. Azure Migrate preserves dependencies during these operations. For grouping behavior, see [Customization concepts](wave-migrations.md#customization).

## Configure inputs on every step

The parameters file stores input values separately from the execution spec. Configuring inputs updates that file without changing the spec.

**Configuration Status** is **Not configured** or **Fully configured**. It's separate from the wave's **Execution status**.

Save incomplete configuration and return to it later as needed. Every value you provide must be valid before saving. **Configuration Status** remains **Not configured** while required inputs are missing; saving progress doesn't allow execution to start with incomplete inputs.

1. On **Execution plan**, select **Configure parameters**.
2. Select a step in **Configure parameters**. Review populated values, correct any that don't match your environment, and fill in the remaining inputs.
3. Configure **Step inputs**. These values apply by default to all workloads associated with the step unless a workload-level override is provided. Expand **Optional inputs** to configure any optional values your migration requires.
4. To provide different values for a workload, use **Workload level overrides**, select the **Workload**, and set overrides for the inputs that need different values. Leave other inputs inherited from the step.
5. Repeat for every step, including steps you added. Configure inputs across steps in this shared flow rather than configuring each step in a separate session.
6. Use **Review missing/invalid inputs** to identify any remaining input issues and correct them before execution.
7. Select **Save changes** to save your edits across the steps together. Return to **Execution plan** and check **Configuration Status**. Once all required inputs are complete and supplied values are valid, it should show **Fully configured**.

:::image type="content" source="./media/configure-customize-wave/configure-workload-overrides.png" alt-text="Screenshot of the shared Configure parameters page with a step list, step inputs, optional inputs, input-review action, and Save changes." lightbox="./media/configure-customize-wave/configure-workload-overrides.png":::

:::image type="content" source="./media/configure-customize-wave/configure-workload-overrides.png" alt-text="Screenshot of step-level input defaults alongside Workload level overrides for a selected workload." lightbox="./media/configure-customize-wave/configure-workload-overrides.png":::

:::image type="content" source="./media/configure-customize-wave/configure-custom-script-inputs.png" alt-text="Screenshot of a custom-script step within the shared Configure parameters flow, with step inputs and workload-level overrides." lightbox="./media/configure-customize-wave/configure-custom-script-inputs.png":::

Every required input must be provided and valid before execution starts. Optional inputs can remain unset, but supplied values must pass validation. Partial starts and deferring required inputs aren't supported.

These checks are static, not a verification of live readiness. Live validation happens during wave execution, in initialization for shared checks and in application step groups for some workload-specific checks. For override precedence and validation behavior, see [Inputs and configuration](wave-migrations.md#input-parameters).

## Confirm readiness with stakeholders

Confirm that the execution plan reflects the agreed migration scope and that the people responsible for its work are ready.

1. Review the execution plan with stakeholders, including its steps, dependencies, step group structure, and associated input values you changed.
2. Collect any organizational sign-offs required before starting. If a decision must be recorded during execution, add an approval step at the appropriate point.
3. Confirm that the people handling approvals and manual work know what's expected.
4. Confirm that the execution plan is up to date, all required inputs are complete, and supplied values are valid. Then, [execute your wave](execute-wave-migration.md).

Starting the wave approves its current execution plan. There's no separate approval action or approved-plan state.

If **Start execution** is disabled, check for missing or invalid parameters, incomplete workload settings, and whether the execution plan is out of date. If regeneration is required, reapply customizations and configure inputs again.

## Next step

> [!div class="nextstepaction"]
> [Execute your migration wave](execute-wave-migration.md)