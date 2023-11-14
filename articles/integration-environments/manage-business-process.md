---
title: Manage business processes
description: Learn how to edit details, duplicate, undeploy, or discard pending changes for a business process in an application group.
ms.service: azure
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

After you create a business process in an application group to describe the stages that show the flow through a real-world business scenario, you can manage various aspects of that process. This guide shows how to perform the following tasks:

- Edit the description for the business process.
- Duplicate the business process by providing a new name.
- Delete the deployment resource and tracking profile for a business process, but not the process itself.
- Delete any pending or draft changes that you made to a deployed business process.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [integration environment](create-integration-environment.md) that contains an [application group](create-application-group.md), which has at least the [Standard logic app resources, workflows, and operations](../logic-apps/create-single-tenant-workflows-azure-portal.md) that you mapped to your business process stages

- A [business process](create-business-process.md) that can be either undeployed or deployed

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

The following steps copy an existing business process using a new name.

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

The following steps delete any pending or draft changes that you made to a deployed business process.

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

<a name="delete-deployment"></a>

## Delete deployment for a business process

The following steps remove only the deployment resource and tracking profile for a deployed business process, leaving the actual business process untouched in the application group.

1. In the [Azure portal](https://portal.azure.com), find and open your integration environment.

1. On your integration environment menu, under **Environment**, select **Applications**.

1. On the **Applications** page, select the application group that has the business process that you want.

1. On the application group menu, under **Business process tracking**, select **Business processes**.

1. In the **Business processes** list, find the business process that you want.

1. In business process row, open the ellipses (**...**) menu, select **Undeploy**.

1. in the confirmation box, select **Undeploy** to confirm.

## Next steps

- [What is Azure Integration Environments](overview.md)?
