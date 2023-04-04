---
title: Manage workflow runs
description: This article outlines how to manage workflow runs.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-workflows
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/23/2023
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Manage workflow runs

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article outlines how to manage workflows that are already running.

1. To view workflow runs you triggered, sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/), select the Management center, and select **Workflow runs**. 

    :::image type="content" source="./media/how-to-workflow-manage-runs/select-workflow-runs.png" alt-text="Screenshot of the management menu in the Microsoft Purview governance portal. The Workflow runs tab is highlighted.":::

1. You'll be presented with the list of workflow runs and their statuses.

    :::image type="content" source="./media/how-to-workflow-manage-runs/workflow-runs.png" alt-text="Screenshot of the workflow runs page, showing a list of all workflow runs, their status, and their run IDs.":::

1. You can filter the results by using workflow name, status, or time.

    :::image type="content" source="./media/how-to-workflow-manage-runs/filters.png" alt-text="Screenshot of the workflow runs page, with the keyword, name, status, and time filters highlighted above the list of workflows.":::

1. Select a workflow name to see the details of the workflow run.

1. This will present a window that shows all the actions that are completed, actions that are in-progress, and the next action for that workflow run.

    :::image type="content" source="./media/how-to-workflow-manage-runs/workflow-details.png" alt-text="Screenshot of the workflow runs page, with an example workflow name selected, and the workflow details page overlaid, showing workflow run, submission time, run ID, status, and a list of all steps in the request timeline.":::

1. You can select any of the actions in the request timeline to see the specific status and sub steps details.

    :::image type="content" source="./media/how-to-workflow-manage-runs/select-stages.png" alt-text="Screenshot of the workflow runs page, with the workflow details page overlaid. Some workflow run actions in the request timeline have been expanded to show more information and sub steps.":::

1. You can cancel a running workflow by selecting **Cancel workflow run**.

    :::image type="content" source="./media/how-to-workflow-manage-runs/cancel-workflows-inline.png" alt-text="Screenshot of the workflow runs page, with the workflow details page overlaid and cancel button to cancel the workflow run." lightbox="./media/how-to-workflow-manage-runs/cancel-workflows.png":::

    > [!NOTE]
    > You can only cancel workflows that are in progress.


## Next steps

- [What are Microsoft Purview workflows](concept-workflow.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Self-service data access workflow for hybrid data estates](how-to-workflow-self-service-data-access-hybrid.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)