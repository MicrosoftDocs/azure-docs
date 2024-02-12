---
title: Manage business processes
description: Learn how to edit the description, make a copy, discard pending changes, or delete the deployment for a business process in an application group.
ms.service: integration-environments
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 11/15/2023
# CustomerIntent: As a business analyst or business SME, I want to learn ways to manage an existing business process, for example, edit the details, remove a deployed busienss processs, duplicate, or discard pending changes.
---

# Manage a business process in an application group (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't ready yet for production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you create a business process in an application group to show the flow through a real-world business scenario and track real-world data that moves through that flow, you can manage various aspects of that business process.

This guide shows how to perform the following tasks:

- [Edit the description for a business process](#edit-description).
- [Duplicate a business process by providing a new name](#copy-business-process).
- [Discard any pending or draft changes that you made to a deployed business process](#discard-pending-changes).
- [Undeploy a business process, which removes the deployment artifacts but preserves the business process](#undeploy-process).

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [integration environment](create-integration-environment.md) that contains an [application group](create-application-group.md), which has at least the [Standard logic app resources, workflows, and operations](../logic-apps/create-single-tenant-workflows-azure-portal.md) that you mapped to your business process stages

- A [business process](create-business-process.md) that's either not deployed or deployed

<a name="edit-description"></a>

## Edit a business process description

1. In the [Azure portal](https://portal.azure.com), find and open your integration environment.

1. On your integration environment menu, under **Environment**, select **Applications**.

1. On the **Applications** page, select the application group that has the business process that you want.

1. On the application group menu, under **Business process tracking**, select **Business processes**.

1. In the **Business processes** list, find the business process that you want.

1. In business process row, open the ellipses (**...**) menu, select **Edit details**.

1. In the **Edit details** pane, change the **Description** text to the version that you want, and select **Save**.

<a name="copy-business-process"></a>

## Duplicate a business process

The following steps copy an existing business process using a new name. The duplicate that you create remains in [draft state](#process-states) until you deploy the duplicate version.

> [!NOTE]
>
> If you have a deployed business process, and you have pending changes in draft state for that 
> process, these steps duplicate the deployed version, not the draft version with pending changes.

1. In the [Azure portal](https://portal.azure.com), find and open your integration environment.

1. On your integration environment menu, under **Environment**, select **Applications**.

1. On the **Applications** page, select the application group that has the business process that you want.

1. On the application group menu, under **Business process tracking**, select **Business processes**.

1. In the **Business processes** list, find the business process that you want.

1. In business process row, open the ellipses (**...**) menu, select **Duplicate**.

1. In the **Duplicate** pane, provide a name for the duplicate. You can't change this name later.

1. When you're done, select **Duplicate**.

<a name="discard-pending-changes"></a>

## Discard pending changes

The following steps remove any pending changes for a deployed business process, leaving the deployed version unchanged.

> [!NOTE]
>
> To discard pending changes while the process designer is open, on the toolbar, select **Discard changes**.

1. In the [Azure portal](https://portal.azure.com), find and open your integration environment.

1. On your integration environment menu, under **Environment**, select **Applications**.

1. On the **Applications** page, select the application group that has the business process that you want.

1. On the application group menu, under **Business process tracking**, select **Business processes**.

1. In the **Business processes** list, find the business process that you want.

1. In business process row, open the ellipses (**...**) menu, select **Discard pending changes**.

1. In the confirmation box, select **Discard changes** to confirm.

<a name="undeploy-process"></a>

## Undeploy a business process

The following steps remove only the deployment and tracking resources for a deployed business process. This action leaves the business process unchanged in the application group, but the process no longer captures and tracks data. Any previously captured data remains stored in your Azure Data Explorer database.

1. In the [Azure portal](https://portal.azure.com), find and open your integration environment.

1. On your integration environment menu, under **Environment**, select **Applications**.

1. On the **Applications** page, select the application group that has the business process that you want.

1. On the application group menu, under **Business process tracking**, select **Business processes**.

1. In the **Business processes** list, find the business process that you want.

1. In business process row, open the ellipses (**...**) menu, select **Undeploy**.

1. in the confirmation box, select **Undeploy** to confirm.

<a name="process-states"></a>

## Business process states

A business process exists in one of the following states:

| State | Description |
|------|-------------|
| Draft | An unsaved or saved business process before deployment. |
| Deployed | A business process that's tracking data during workflow run time. |
| Deployed with pending changes | A business process that has both a deployed version and draft version with pending changes. |

## Next steps

- [What is Azure Integration Environments](overview.md)?
