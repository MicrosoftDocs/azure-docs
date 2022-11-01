---
title: 'Delete a Lifecycle workflow - Azure Active Directory'
description: Describes how to delete a Lifecycle Workflow using.
services: active-directory
author: owinfreyATL
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/20/2022
ms.subservice: compliance
ms.author: owinfrey
ms.reviewer: krbain
ms.collection: M365-identity-device-management
---

# Delete a Lifecycle workflow (Preview)

You can remove workflows that are no longer needed. Deleting these workflows allows you to make sure your lifecycle strategy is up to date. When a workflow is deleted, it enters a soft delete state. During this period, it's still able to be viewed within the deleted workflows list, and can be restored if needed. 30 days after a workflow enters a soft delete state it will be permanently removed. If you don't wish to wait 30 days for a workflow to permanently delete you can always manually delete it yourself.


## Delete a workflow using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure Active Directory** and then select **Identity Governance**.

1. In the left menu, select **Lifecycle Workflows (Preview)**.

1. select **Workflows (Preview)**.

1. On the workflows screen, select the workflow you want to delete.

     :::image type="content" source="media/delete-lifecycle-workflow/delete-button.png" alt-text="Screenshot of list of Workflows to delete.":::

1. With the workflow highlighted, select **Delete**.

1. Confirm you want to delete the selected workflow. 
 
     :::image type="content" source="media/delete-lifecycle-workflow/delete-workflow.png" alt-text="Screenshot of confirming to delete a workflow.":::

## View deleted workflows

After deleting workflows, you can view them on the **Deleted Workflows (Preview)** page.


1. On the left of the screen, select **Deleted Workflows (Preview)**.

1. On this page, you'll see a list of deleted workflows, a description of the workflow, what date it was deleted, and its permanent delete date. By default the permanent delete date for a workflow is always 30 days after it was originally deleted.

     :::image type="content" source="media/delete-lifecycle-workflow/deleted-list.png" alt-text="Screenshot of a list of deleted workflows.":::
 
1. To restore a deleted workflow, select the workflow you want to restore and select **Restore workflow**.

1. To permanently delete a workflow immediately, you select the workflow you want to delete from the list, and select **Delete permanently**.


 

## Delete a workflow using Microsoft Graph

To delete a workflow using API via Microsoft Graph, see: [Delete workflow (lifecycle workflow)](/graph/api/identitygovernance-workflow-delete?view=graph-rest-beta).


To view

Workflows can be deleted by running the following call:
```http
DELETE https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/workflows/<id> 
```
## View deleted workflows using Microsoft Graph

To View a list of deleted workflows using API via Microsoft Graph, see: [List deleted workflows](/graph/api/identitygovernance-lifecycleworkflowscontainer-list-deleteditems).


## Permanently delete a workflow using Microsoft Graph

To permanently delete a workflow using API via Microsoft Graph, see: [Permanently delete a deleted workflow](/graph/api/identitygovernance-deleteditemcontainer-delete)

## Restore deleted workflows using Microsoft Graph

To restore a deleted workflow using API via Microsoft Graph, see: [Restore a deleted workflow](/graph/api/identitygovernance-workflow-restore)
> [!NOTE]
> Permanently deleted workflows are not able to be restored.

## Next steps

- [What are Lifecycle Workflows?](what-are-lifecycle-workflows.md)
- [Manage Lifecycle Workflow Versions](manage-workflow-tasks.md)
