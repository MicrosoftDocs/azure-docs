---
title: Track API Resource Dependencies - Azure API Center
description: Learn how to track dependencies between APIs and related resources in your Azure API center.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 08/28/2025


ms.custom: 
# Customer intent: As an API developer or API program manager, I want to understand the dependencies between API resources in my organization's API center.
---

# Track API resource dependencies in your API center 

This article explains how to track the dependencies between APIs and associated resources in your [Azure API center](overview.md). Use the dependency tracker (preview) to map dependencies across APIs, environments, and deployments in your catalog. Also track dependencies on external components including GitHub repositories and other resources in Azure and other cloud platforms.

Each dependency identifies a *source* resource and a related *target* resource that depends on it. By tracking dependencies between source and target resources, you can:

* **Troubleshoot and resolve issues** more effectively by providing visibility into the relationships between components

* **Improve the reliability of systems** by identifying risks such as circular dependencies or over-reliance on single points of failure

* **Improve effectiveness of AI agents** by using mapped dependencies for automatic discovery of valid endpoints for tasks and validating toolchain compatibility

> [!NOTE]
> This is a preview feature and is subject to change. [Limits](/azure/azure-resource-manager/management/azure-subscription-service-limits?toc=/azure/api-center/toc.json&bc=/azure/api-center/breadcrumb/toc.json#azure-api-center-limits) apply.

## Prerequisites

* An [Azure API center](overview.md) resource in your Azure subscription.
* Register one or more APIs in your API center. For instructions, see [Register APIs in your API inventory](./tutorials/register-apis.md).

## Add a dependency

Use the dependency tracker in the Azure portal to add a dependency. 

To add a dependency:

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, under **Assets**, select **Dependency tracker (preview)**.
1. Select **+ Add Dependency**.
1. In the **Dependency Manager** window, enter a **Title** and optionally a **Description** of the dependency.
1. In **Source details**, select a **Source Type** (for example, an API or a related resource). Depending on the type, enter or select identifying information such as a name or ID.
1. In **Target details**, select a **Target Type** (for example, an API or a related resource). Depending on the type, enter or select identifying information such as a name or ID.
1. **Save** the dependency.

:::image type="content" source="media/track-resource-dependencies/create-dependency.png" alt-text="Screenshot of adding a dependency in the portal.":::

The dependency is added. 

## View dependencies 

API Center provides a default table view that lists dependencies, and a graphical view with a holistic representation. Use these views to explore the relationships between your resources.

To see a graphical view:

1. In the left menu, under **Assets**, select **Dependency tracker (preview)**.
1. Select the **Graph View** tab.

In the graphical view, select the box representing any API center resource to see its details.

:::image type="content" source="media/track-resource-dependencies/view-dependency-graph.png" alt-text="Screenshot of the dependency graph in the portal.":::

## Manage dependencies

You can edit or delete dependencies as needed using the table view.

To view or edit dependency details:

1. In the left menu, under **Assets**, select **Dependency tracker (preview)**.
1. Select **Table View**, and find the dependency you want to edit.
1. Select **See details**.
1. To make changes, select **Edit**, and update details.
1. **Save** your changes.

To delete a dependency:

1. In the **Dependency tracker (preview)** table view, find the dependency that you want to delete.
1. Select **Delete dependency** (trash can icon).
1. Confirm the deletion.

> [!NOTE]
> If you delete an API Center resource that is a source or target in a dependency, the dependency isn't automatically deleted. You must delete it yourself.

## Related content

* [Overview of Azure API center](overview.md)
* [Register APIs in your API inventory](./tutorials/register-apis.md)