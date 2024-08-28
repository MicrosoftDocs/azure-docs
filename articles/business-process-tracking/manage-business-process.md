---
title: Manage business processes
description: Edit a business process, make a copy, discard pending changes, or undeploy a business process in Azure Business Process Tracking.
ms.service: azure-business-process-tracking
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 06/07/2024
# CustomerIntent: As a business analyst or business SME, I want to learn ways to manage an existing business process, for example, edit the details, discard pending changes, copy a business process, or remove the deployment for a business process.
---

# Manage a business process in an application group (Preview)

> [!NOTE]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you create or deploy a business process that shows the flow through a real-world business scenario and tracks real-world data that moves through that flow, you can manage various aspects of that business process.

This guide shows how to perform the following tasks:

- [Edit a business process or stage](#edit-process-or-stage).
- [Discard any unsaved changes that you made to a deployed business process](#discard-pending-changes).
- [Undeploy a business process, which removes the deployment artifacts but preserves the business process](#undeploy-process).

## Prerequisites

- The deployed or undeployed **Business process** resource that you want to manage.

- Access to the Azure account and subscription associated with the **Business process** resource.

<a name="process-states"></a>

## Business process states

A business process exists in one of the following states:

| State | Description |
|------|-------------|
| Draft | An unsaved or saved business process before deployment. |
| Deployed | A business process that records specified data during workflow run time. |
| Deployed with pending changes | A business process that has both a deployed version and version with pending changes. |

<a name="edit-process-or-stage"></a>

## Edit business process or stage

1. In the [Azure portal](https://portal.azure.com), find and open your business process.

1. On the resource menu, under **Business process tracking**, select **Editor**.

1. On the process editor, add, update, or delete stages in your business process. To update the details for a stage, select that stage on the editor.

1. When you're done, save your changes. On the toolbar, select **Save**.

<a name="discard-pending-changes"></a>

## Discard pending changes

The following steps remove any pending changes for a deployed business process, leaving the deployed version unchanged.

> [!NOTE]
>
> To discard pending changes while the process editor is open, on the toolbar, select **Discard changes**.

1. In the [Azure portal](https://portal.azure.com), find and open your business process.

1. In resource menu, under **Business process tracking**, select **Editor**.

1. On the editor toolbar, select **Discard changes**.

<a name="undeploy-process"></a>

## Undeploy a business process

The following steps remove only the deployment artifacts and tracking profile for a deployed business process. This action leaves the business process unchanged, but the process no longer records and tracks the specified data. Any previously recorded data remains stored in your Azure Data Explorer database.

1. In the [Azure portal](https://portal.azure.com), find and open your business process.

1. On the resource menu, select **Overview**.

1. On the **Overview** page toolbar, select **Undeploy**.

## Related content

[What is Azure Business Process Tracking](overview.md)?
