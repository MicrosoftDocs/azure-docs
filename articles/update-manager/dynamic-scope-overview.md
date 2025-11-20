---
title: Overview of Dynamic Scoping
description: This article provides information about the purpose and advantages of dynamic scoping.
ms.service: azure-update-manager
ms.date: 08/21/2025
ms.topic: conceptual
author: habibaum
ms.author: v-uhabiba
# Customer intent: "As an IT administrator who manages multiple virtual machines, I want to use dynamic scoping for scheduled patching so that I can efficiently manage and automate updates across various environments without manual intervention."
---

# About dynamic scoping

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs :heavy_check_mark: Azure Arc-enabled servers.

Dynamic scoping is a capability of scheduled patching in Azure Update Manager. You can use it to:

- Group machines based on criteria such as subscription, resource group, location, resource type, OS type, and tags. This grouping becomes the definition of the scope.
- Associate the scope to a maintenance configuration to apply updates at scale.

The criteria are evaluated at the scheduled run time to produce a final list of machines for scheduled patching. The machines evaluated during the create or edit phase might differ from the group at the scheduled run time.

## Key benefits

**At scale and simplified patching**. You don't have to manually change associations between machines and schedules. For example, if you want to remove a machine from a schedule and your scope was defined based on tag criteria, removing the tag on the machine automatically drops the association. You can drop and add these associations for multiple machines at scale.

**Reusability of the same schedule**. You can associate a schedule with multiple machines dynamically, statically, or both.

[!INCLUDE [dynamic-scope-prerequisites.md](includes/dynamic-scope-prerequisites.md)]

## Permissions

For dynamic scoping and configuration assignment, ensure that you have:

- Write permissions at the subscription level to create or modify a schedule.
- Read permissions at the subscription level to assign or read a schedule.

## Service limits

The following recommended limits are for *each dynamic scope in the guest scope only*.

| Resource    | Limit          |
|----------|----------------------------|
| Resource associations     | 1,000  |
| Number of tag filters | 50 |
| Number of resource group filters    | 50 |

For more information, see [Service limits for scheduled patching](scheduled-patching.md#service-limits).

## Related content

- Follow the instructions on [how to manage various operations of dynamic scope](manage-dynamic-scoping.md).
- Learn [how to automatically install updates according to the created schedule for a single VM and at scale](scheduled-patching.md).
- Learn about [pre-maintenance and post-maintenance events](pre-post-scripts-overview.md) to automatically perform tasks before and after a scheduled maintenance configuration.
