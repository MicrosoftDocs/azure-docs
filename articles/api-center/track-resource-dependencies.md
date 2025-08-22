---
title: Track API Resource Dependencies - Azure API Center
description: Learn how to track dependencies between APIs and related resources in your Azure API center.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 08/21/2025
ms.author: danlep
author: dlepow
ms.custom: 
# Customer intent: As an API developer or API program manager, I want to understand the dependencies between API resources in my organization's API center.
---

# Track API resource dependencies in your API center 

This article explains how to track the relationships or dependencies between APIs and associated resources in your [Azure API center](overview.md). Use the dependency tracker (preview) to map relationships across APIs, environments, and deployments in your catalog. Also track dependencies on external components including GitHub repositories and other resources in Azure and other cloud platforms.

By tracking dependencies between source and target resources, you can:

* **Troubleshoot and resolve issues** more effectively by providing visibility into the relationships between components

* **Improve the reliability of systems** by identifying risks such as circular dependencies or over-reliance on single points of failure

* **Improve effectiveness of AI agents** such as using mapped dependencies for automatic discovery of valid endpoints for tasks and validating toolchain compatibility

## Prerequisites

* An [Azure API center](overview.md) resource in your Azure subscription.
* Register one or more APIs in your API center. For instructions, see [Register APIs in your API inventory](register-apis.md).

## Add a dependency

Use the dependency tracker in the Azure portal to add and manage dependencies between your API resources. 

To add a dependency:

1. In the [Azure portal][https://portal.azure.com], navigate to your API center.
1. In the left menu, under **Assets**, select **Dependency tracker (preview)**.
1. Select **+ Add Dependency**.
1. In the **Dependency Manager** window, enter a **Title** and optionally a **Description** of the dependency.
1. In **Source details**, select a **Source Type** (for example, an API or a related resource). Depending on the type, enter or select identifying information such as a name or ID.
1. In **Target details**, select a **Target Type** (for example, an API or a related resource). Depending on the type, enter or select identifying information such as a name or ID.
1. **Save** the dependency.

:::image type="content" source="media/track-resource-dependencies/create-dependency.png" alt-text="Screenshot of addinng a dependency in the portal.":::



## View dependencies in the Azure portal




## Related content

[TBD]