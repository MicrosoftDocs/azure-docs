---
title: An Overview of Dynamic Scoping
description: This article provides information about Dynamic Scoping, its purpose and advantages.
ms.service: azure-update-manager
ms.date: 08/21/2025
ms.topic: overview
author: habibaum
ms.author: v-uhabiba
# Customer intent: "As an IT administrator managing multiple virtual machines, I want to utilize dynamic scoping for scheduled patching, so that I can efficiently manage and automate updates across various environments without manual intervention."
---

# About Dynamic Scoping

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs :heavy_check_mark: Azure Arc-enabled servers.

Dynamic Scoping is a capability of schedule patching that allows users to:

- Group machines based on criteria such as subscription, resource group, location, resource type, OS Type, and Tags. This becomes the definition of the scope.
- Associate the scope to a maintenance configuration to apply updates at scale as per a pre-defined scope.

The criteria will be evaluated at the scheduled run time, which will be the final list of machines that will be patched by the schedule. The machines evaluated during create or edit phase may differ from the group at schedule run time.

## Key benefits

**At Scale and simplified patching** - You don't have to manually change associations between machines and schedules. For example, if you want to remove a machine from a schedule and your scope was defined based on tag(s) criteria, removing the tag on the machine will automatically drop the association. These associations can be dropped and added for multiple machines at scale.

**Reusability of the same schedule** - You can associate a schedule to multiple machines dynamically, statically, or both.



[!INCLUDE [dynamic-scope-prerequisites.md](includes/dynamic-scope-prerequisites.md)]

## Permissions

For Dynamic Scoping and configuration assignment, ensure that you have the following permissions:

- Write permissions at subscription level to create or modify a schedule.
- Read permissions at subscription level to assign or read a schedule.

## Service limits

The following are the Dynamic scope recommended limits for **each dynamic scope**.

| Resource    | Limit          |
|----------|----------------------------|
| Resource associations     | 1000  |
| Number of tag filters | 50 |
| Number of Resource Group filters    | 50 |

> [!NOTE]
> The above limits are for Dynamic scope in the Guest scope only.

For more information, see [service limits for scheduled patching](scheduled-patching.md#service-limits).

## Next steps

- Follow the instructions on how to [manage various operations of Dynamic scope](manage-dynamic-scoping.md)
- Learn on how to [automatically installs the updates according to the created schedule both for a single VM and at scale](scheduled-patching.md).
- Learn about [pre and post events](pre-post-scripts-overview.md) to automatically perform tasks before and after a scheduled maintenance configuration.
