---
title: Track API resource dependencies - Azure API Center
description: Learn how to track dependencies between API resources in your API center.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 08/18    /2025
ms.author: danlep
author: dlepow
ms.custom: 
# Customer intent: As an API developer or API program manager, I want to understand the dependencies between API resources in my organization's API center.
---

# Track API resource dependencies in your API center 

This article explains how to track the relationships or dependencies between APIs and associated resources in your [Azure API center](overview.md). Use the dependency tracker (preview) to map relationships across APIs, tracked environments and deployments, and external components including GitHub repositories and other resources in Azure and other cloud platforms.

By tracking dependencies, you can: 

* **Troubleshoot and resolve** issues more effectively by providing visibility into the relationships between components

* **Improve the reliability** of systems by identifying risks such as circular dependencies or over-reliance on single points of failure

* **Improve effectiveness of AI agents** such as using mapped dependencies for automatic discovery of valid endpoints for tasks and validating toolchain compatibility

## Prerequisites

* An [Azure API center](overview.md) resource in your Azure subscription.
* Register one or more APIs in your API center. For instructions, see [Register APIs in your API inventory](register-apis.md).

## Add a dependency

Use the dependency tracker in the Azure portal to add and manage dependencies between your API resources. 

To add a dependency:

1. In the [Azure portal], navigate to your API center.
1. In the left menu, under **Assets** Go to the "Dependency Tracker" section.
1. Click on "Add Dependency".
1. Select the source API resource and the target resource it depends on.
1. Provide any additional details or metadata about the dependency.
1. Save the dependency.





## View dependencies in the Azure portal




## Related content

[TBD]