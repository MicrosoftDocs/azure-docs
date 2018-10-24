---
title: Understand the life-cycle of an Azure Blueprint
description: Learn about the life-cycle that a blueprint goes through and details about each stage.
services: blueprints
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: conceptual
ms.service: blueprints
manager: carmonm
---
# Understand the life-cycle of an Azure Blueprint

Like many resources within Azure, a blueprint in Azure Blueprints has a typical and natural
life-cycle. They're created, deployed, and finally deleted when no longer needed or relevant.
Blueprints supports traditional CRUD (create/read/update/delete) life-cycle operations, but also
builds upon them to provide additional levels of status that support common continuous integration
/ continuous deployment (CI/CD) pipelines for use by those managing their infrastructure through
code – a key element in DevOps referred to as Infrastructure as Code (IaC).

To fully understand a blueprint and the stages, we'll cover a standard life-cycle:

> [!div class="checklist"]
> - Creating and editing a blueprint
> - Publishing the blueprint
> - Creating and editing a new version of the blueprint
> - Publishing a new version of the blueprint
> - Deleting a specific version of the blueprint
> - Deleting the blueprint

## Creating and editing a blueprint

When creating a blueprint, add artifacts to it, save to a management group, and provided a unique
name and a unique version. At this point, the blueprint is in a **Draft** mode and can't yet be
assigned. However, while in the **Draft** mode it can continue to be updated and changed.

A blueprint in **Draft** mode that has never been published will display a different icon on the
**Blueprint Definitions** page than those that have been **Published**. The **Latest Version** will
also be displayed as **Draft** for these never published blueprints.

Create and edit a blueprint with the [Azure portal](../create-blueprint-portal.md#create-a-blueprint)
or [REST API](../create-blueprint-rest-api.md#create-a-blueprint).

## Publishing a blueprint

Once all desired changes have been made to a blueprint in **Draft** mode, it can be **Published**
and made available for assignment. The **Published** version of the blueprint can't be altered.
Once **Published**, the blueprint displays with a different icon than **Draft** blueprints and
displays the provided version number in the **Latest Version** column.

Publish a blueprint with the [Azure portal](../create-blueprint-portal.md#publish-a-blueprint) or
[REST API](../create-blueprint-rest-api.md#publish-a-blueprint).

## Creating and editing a new version of the blueprint

Although a **Published** version of a blueprint can't be altered, a new version of the blueprint
can be added to the existing blueprint and modified as needed. This is done by making changes to an
existing blueprint. If the blueprint was already **Published**, when these changes are saved, they
show as **Unpublished Changes** in the list of blueprint definitions. Saving the changes saves a
**Draft** version of the blueprint.

Edit a blueprint with the [Azure portal](../create-blueprint-portal.md#edit-a-blueprint).

## Publishing a new version of the blueprint

Just like the first version of a blueprint was **Published** to assign it, each subsequent version
of that same blueprint must be **Published** before it can be assigned. When **Unpublished
Changes** have been made to a blueprint, but they haven't yet been **Published**, the **Publish
Blueprint** button is available on the edit blueprint page. If the button isn't visible, the
blueprint has already been **Published**, but has no **Unpublished Changes**.

> [!NOTE]
> A single blueprint can have multiple **Published** versions that can each be assigned to subscriptions.

The steps to publish a blueprint with **Unpublished Changes** as a new version of an existing
blueprint are the same as the steps to publish a new blueprint.

## Deleting a specific version of the blueprint

Each version of a blueprint is a unique object and can be individually **Published**. This also
means that each version of a blueprint can be deleted. Deleting a version of a blueprint doesn't
have any impact on other versions of that blueprint.

> [!NOTE]
> It's not possible to delete a blueprint that has active assignments. Delete the
> assignments first and then delete the version you wish to remove.

1. Launch the Azure Blueprints service in the Azure portal by clicking on **All services** and searching for and selecting **Policy** in the left pane. On the **Policy** page, click on **Blueprints**.

1. Select **Blueprint Definitions** from the page on the left and use the filter options to locate the blueprint you want to delete a version of. Click on it to open the edit page.

1. Click the **Published versions** tab and locate the version you wish to delete.

1. Right-click on the version to delete and select **Delete This Version**.

## Deleting the blueprint

The core blueprint can also be deleted. Deleting the core blueprint will also delete any blueprint
versions of that blueprint, regardless of **Draft** or **Published** status. As with deleting a
version of a blueprint, deleting the core blueprint doesn't remove the existing assignments of any
of the blueprint versions.

> [!NOTE]
> It's not possible to delete a blueprint that has active assignments. Delete the
> assignments first and then delete the version you wish to remove.

Delete a blueprint with the [Azure portal](../create-blueprint-portal.md#delete-a-blueprint) or
[REST API](../create-blueprint-rest-api.md#delete-a-blueprint).

## Assignments

There are several points during the life-cycle that a blueprint can be assigned to a subscription.
Whenever the mode of a version of the blueprint is **Published**, then that version can be assigned
to a subscription. Even when there's a **Draft** version of the blueprint, if there are one or more
blueprint versions in a **Published** mode, then each of those **Published** versions is available
to assign. This enables versions of a blueprint to be used and actively assigned while a newer
version is being developed.

As versions of blueprints are assigned, it's important to understand where they're assigned and
with what parameters they've been assigned with. The parameters can either be static or dynamic. To
learn more, see [static and dynamic parameters](parameters.md).

### Updating assignments

When a blueprint is assigned, the assignment can be updated. There are several reasons for updating
an existing assignment, including:

- Add or remove [resource locking](resource-locking.md)
- Change the value of [dynamic parameters](parameters.md#dynamic-parameters)
- Upgrade the assignment to a newer **Published** version of the blueprint

To learn how, see [update existing assignments](../how-to/update-existing-assignments.md).

## Next steps

- Understand how to use [static and dynamic parameters](parameters.md)
- Learn to customize the [blueprint sequencing order](sequencing-order.md)
- Find out how to make use of [blueprint resource locking](resource-locking.md)
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md)
- Resolve issues during the assignment of a blueprint with [general troubleshooting](../troubleshoot/general.md)