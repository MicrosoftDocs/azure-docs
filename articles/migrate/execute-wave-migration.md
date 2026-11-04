---
title: Execute a migration wave in Azure Migrate
description: Start a migration wave, approve workloads, complete manual steps, and recover from execution failures in Azure Migrate.
author: snehithm
ms.author: snmuvva
ms.service: azure-migrate
ms.topic: how-to
ms.date: 10/28/2026

#CustomerIntent: As a migration engineer, I want to execute a wave so that I can migrate its workloads and resolve issues during execution.

---
# Execute a migration wave in Azure Migrate (preview)

Start a configured migration wave, respond to approvals and manual work, and recover from failures as migration progresses. This article also covers pausing, canceling, and completing a run.

## Prerequisites

- Ensure your wave's **Execution status** is **Not Started**, not **Pending configuration**. If it's **Pending configuration**, then [configure and customize your wave](configure-customize-wave.md) first.
- You have the **Azure Migrate Owner** or **Azure Migrate Execute Expert** role on the Azure Migrate project for execution actions, including starting, pausing, resuming, canceling, retrying, approving, and completing manual work.
- Ensure the Azure Migrate project's managed identity has both **Azure Migrate Execute Expert** and **Contributor** at each required scope: the Azure Migrate resource group and every target subscription used by the wave. See [Permissions](reference-wave-migrations.md#permissions).
- Review the preparation required by your selected migration methods. Tool readiness varies by method: some migration methods set up a tool, while others validate an existing setup.

## Start the run

Start the wave after completing configuration and stakeholder review.

1. In the Azure Migrate project, go to **Execute** > **Waves**, open the wave, and select **Execution plan**. Start from the individual wave, not the **Waves** list page.
2. Complete your review of the current execution plan and inputs, and then select **Start execution** and accept the confirmation.
3. **Execution runs** opens as execution starts. Monitor shared setup and validation in initialization, and workload-specific validation in application step groups. If validation fails, [recover from the failure](#recover-from-failures) before the affected work can proceed.

Start applies to the whole wave, not to individual groups or steps. No step can be skipped. Execution is forward-only: pause or cancellation doesn't provide rollback.

For the execution order, see [Step groups and execution order](wave-migrations.md#step-groups) and [Dependencies and readiness](wave-migrations.md#dependencies-and-parallelism).

While the run is active, the wave's workloads and execution plan are locked. Inputs are frozen except on a failed step being retried.

## Approve ready workloads at approval steps

Approval steps let you release ready workloads individually or in batches.

1. In **Execution runs**, find approval steps with **Execution status** set to **Needs action**.
2. Select the step name to open **Step details** and read the decision it requires. Review the associated **Workloads**.
3. Review which workloads are ready. A workload is eligible for approval when its dependencies are satisfied.
4. When the intended workloads are ready, select **Approve** in the **Action** column or **Step details** to open **Approve step**.
5. Under **Select workloads to approve**, all ready workloads are selected by default. Review and adjust the selection to include only the workloads you want to release now.
6. Select **Approve** to approve the selected workloads.
7. Return to pending approval steps as additional workloads become ready.

:::image type="content" source="./media/execute-wave-migration/approve-step-workloads.png" alt-text="Screenshot of the Approve step pane with step details, workload-selection checkboxes, and the final Approve button." lightbox="./media/execute-wave-migration/approve-step-workloads.png":::

Approval is per workload, not a configurable approve-all policy. For the required roles, see [Permissions](reference-wave-migrations.md#permissions).

If you aren't ready to proceed, **withhold approval**. Fix any issue first, then approve when ready. Dependent work waits; independent work can continue. There's no reject action. If the wave shouldn't proceed at all, [cancel the run](#cancel-and-start-a-new-run-if-needed).

## Complete manual work when requested

Record completion only after finishing the required work outside Azure Migrate.

1. In **Execution runs**, find a manual step showing **Needs action** and open **Step details**. The status is **Needs action** in both views.
2. Read its description and complete the work outside Azure Migrate.
3. Select **Mark as complete** in the **Action** column or **Step details**.
4. In the **Mark as complete** pane, review the step's name and description, and then select **Complete** to record that the work is done so dependent work can continue.

:::image type="content" source="./media/execute-wave-migration/manual-step-completion.png" alt-text="Screenshot of the Mark as complete pane for a manual step, showing its name, description, step group, and Complete button." lightbox="./media/execute-wave-migration/manual-step-completion.png":::

For how manual work differs from an approval step, see [Manual steps vs. approval steps](wave-migrations.md#approvals-and-manual-work).

## Recover from failures

When a step fails, independent work still progresses. [Failure isolation](wave-migrations.md#failures-and-recovery) explains the effect on other workloads.

### Diagnose the failure

1. In **Execution runs**, find a step with **Execution status** set to **Failed** or **Partially succeeded**. **Failed** means all workloads in the step failed; **Partially succeeded** means only some failed.
2. For a **Failed** step, select **Failed** to open **Errors** in **Step details**. For either failure status, you can also open the step and select **Errors** to review the reported issues, affected workloads, and any available details.
3. Open the **Workloads** tab to see which workloads failed.
4. Review the affected workloads' migration-tool diagnostics when the failure information doesn't provide enough detail.
5. Check whether the cause is in the wave's configuration (a wrong input) or in the environment (expired credentials, exhausted disk, missing network rule).

:::image type="content" source="./media/execute-wave-migration/failed-step-workloads.png" alt-text="Screenshot of the Workloads tab in Step details showing affected workloads and their failed execution statuses." lightbox="./media/execute-wave-migration/failed-step-workloads.png":::

:::image type="content" source="./media/execute-wave-migration/failed-step-errors.png" alt-text="Screenshot of a failed migration step with its reported issues, affected workloads, and available failure details in Step details." lightbox="./media/execute-wave-migration/failed-step-errors.png":::

### Retry failed work

1. Resolve any environmental issue. If input values need to change, update them through the failed step's retry flow.
2. Select **Retry** in the **Action** column, or **Retry step** in **Step details**, to open **Retry step**.
3. Choose **Retry with the same parameters** to use the step's existing inputs, or **Retry with different parameters** to correct them. For different parameters, update **Step inputs** and any **Workload level overrides** needed for the workloads being retried. Resolve missing or invalid values before retrying.
4. Review the workloads being retried. A workload-scoped retry runs for all failed workloads in the step; you can't select a subset. Successful workloads aren't retried. A non-workload-scoped step retries as a whole job. Select **Retry step** to run the retry.
5. Review the retry results and confirm that dependent work can proceed.

:::image type="content" source="./media/execute-wave-migration/retry-same-parameters.png" alt-text="Screenshot of Retry step showing the workloads to retry, parameter choices, and the final Retry step button." lightbox="./media/execute-wave-migration/retry-same-parameters.png":::

:::image type="content" source="./media/execute-wave-migration/retry-different-parameters.png" alt-text="Screenshot of retrying with different parameters, showing step input defaults, workload-level overrides, validation feedback, and the Retry step button." lightbox="./media/execute-wave-migration/retry-different-parameters.png":::

You can also retry **Partially succeeded** steps (steps that failed for some workloads but succeeded for others). Retry step always retries only the failed workloads.

For the state checks performed by a fresh run, see [Wave changes](wave-migrations.md#wave-changes).

Retry input changes update only the retried step's values in the parameters file; they don't change the execution spec. You can't edit inputs on other steps during the run, including steps that haven't started, or rerun successful steps within the same run.

If you need to add a step, change a dependency, or correct an input on another step, [cancel, edit, and start a new run](#cancel-and-start-a-new-run-if-needed).

After cutover, fix the target or intervene outside the wave's workflow; rollback isn't available. Prepare any recovery scripts before execution. See [Unsupported execution controls](reference-wave-migrations.md#not-supported).

### Troubleshoot recovery

| Symptom | What to do |
| --- | --- |
| Retry keeps failing the same way | The cause is still present. Check the underlying migration tool's status, not just the step error. |
| The step succeeded but the workload is wrong | Correct the workload outside the wave's workflow, or use the [cancel/edit/restart procedure](#cancel-and-start-a-new-run-if-needed) for a structural fix. |
| A failed step is blocking every workload in a dependent step | Check the [dependency scope](reference-wave-migrations.md#resolution-scopes) to identify whether it creates a shared barrier. |
| The run won't complete | Check for failed steps awaiting retry. The final sign-off gate waits for their resolution. |
| I need to change an input on a step that hasn't run yet | Use the [cancel/edit/restart procedure](#cancel-and-start-a-new-run-if-needed). That input isn't editable during the active run. |

## Pause and resume the wave if needed

Pause the wave to hold new work, then resume scheduling when the migration can continue.

1. In **Execution runs**, select **Pause execution** when you need a business hold or want to stop scheduling new work while investigating. Accept the confirmation.
2. Allow work in progress to reach a logical stopping point. No new work is scheduled while the wave is paused.
3. If an underlying migration-tool operation must stop immediately, use that tool's controls. Pausing the wave doesn't immediately terminate replication or other tool operations already running.
4. When ready to continue, select **Resume execution**. Scheduling restarts for eligible work.

Pause and resume apply only to the whole wave. Individual groups and steps can't be paused or resumed.

Wave execution times out if it doesn't finish within 90 days. This timeout is an overall execution window, not an inactivity timer. Pauses and pending approvals remain subject to this limit. Approval steps have no individual timeout. Only custom scripts expose a configurable timeout input. See [Limits, defaults, and timeouts](reference-wave-migrations.md#limits-defaults-and-timeouts).

## Cancel and start a new run if needed

Use this process when the current run can't continue or when a structural change is necessary.

> [!WARNING]
> Cancellation ends the run and skips remaining steps, including pending approvals. It doesn't immediately terminate underlying migration-tool operations, clean up resources, or roll back completed actions.

Cancellation stops scheduling new work and lets work in progress continue until it reaches a logical stopping point. It applies to the whole wave, not one group, and isn't a skip-and-continue option.

1. In **Execution runs**, select **Cancel execution** and accept the confirmation.
2. Review the environment and migration tools before making changes.
3. If you need to change wave membership, [remove applications or workloads](configure-customize-wave.md#remove-applications-or-workloads) before customizing the execution plan. Removal doesn't delete discovered resources or actual workloads.
4. Open **Execution plan** and [regenerate it if required](configure-customize-wave.md#regenerate-the-execution-plan), then make the necessary changes using [Configure and customize a wave](configure-customize-wave.md). Regeneration creates the execution plan afresh and discards all user edits, so reapply customizations afterward.
5. Review the updated execution plan and [configure required inputs](configure-customize-wave.md#configure-inputs-on-every-step), resolving invalid supplied values on changed or added steps.
6. Start the new run after stakeholder review. Starting approves that version.

Only start the new run after the previous run is canceled. A new run executes the workflow from scratch. Migration steps check the object's state in the migration tool and complete if the intended effect has already taken place. The run doesn't resume from its previous stopping point. See the [run lifecycle](wave-migrations.md#runs-and-execution-controls).

## Complete finalization and sign-off

You need to sign off on the migration wave, and you can't bypass unresolved failures.

> [!IMPORTANT]
> Successful completion permanently locks the wave. You can't change its workloads or configuration, edit its execution plan, or execute it again.

1. After migration groups complete, review the finalization steps.
2. Complete required closure work, such as powering down migrated on-premises resources, updating the configuration management database and asset records, closing change tickets, or producing a migration summary. Add organization-specific manual, approval, or custom script steps before execution.
3. Resolve any failed steps, pending gates, or incomplete manual work.
4. When the remaining work is complete, open the final sign-off step, select **Mark as complete**, and then select **Complete**.
5. Confirm that the wave reports **Completed** and workload status reflects the migration outcome, then [review migration outcomes](track-wave-migrations.md#review-completed-wave-outcomes).

If you can't complete the remaining work, use the [cancellation procedure](#cancel-and-start-a-new-run-if-needed). The run is canceled, and the wave's **Execution status** is **Needs action**, not **Completed**.

## Next step

> [!div class="nextstepaction"]
> [Track wave migrations](track-wave-migrations.md)


