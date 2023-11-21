---
title: An overview of Dynamic Scoping 
description: This article provides information about Dynamic Scoping, its purpose and advantages.
ms.service: azure-update-manager
ms.date: 09/18/2023
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# About Dynamic Scoping

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs :heavy_check_mark: Azure Arc-enabled servers.

Dynamic Scoping is an advanced capability of schedule patching that allows users to: 

- Group machines based on criteria such as subscription, resource group, location, resource type, OS Type, and Tags. This becomes the definition of the scope. 
- Associate the scope to a schedule/maintenance configuration to apply updates at scale as per a pre-defined scope. 

The criteria will be evaluated at the scheduled run time, which will be the final list of machines that will be patched by the schedule. The machines evaluated during create or edit phase may differ from the group at schedule run time. 

## Key benefits

**At Scale and simplified patching** - You don't have to manually change associations between machines and schedules. For example, if you want to remove a machine from a schedule and your scope was defined based on tag(s) criteria, removing the tag on the machine will automatically drop the association. These associations can be dropped and added for multiple machines at scale.
  > [!NOTE]
  > Subscription is mandatory for the creation of dynamic scope and you can't edit it after the dynamic scope is created.

**Reusability of the same schedule** - You can associate a schedule to multiple machines dynamically, statically, or both. 
  > [!NOTE]
  > You can associate one dynamic scope to one schedule.


[!INCLUDE [dynamic-scope-prerequisites.md](includes/dynamic-scope-prerequisites.md)]

## Permissions

For Dynamic Scoping and configuration assignment, ensure that you have the following permissions:

- Write permissions at subscription level to create or modify a schedule.
- Read permissions at subscription level to assign or read a schedule.

## Service limits

The following are the Dynamic scope limits for **each dynamic scope**.

| Resource    | Limit          |
|----------|----------------------------|
| Resource associations     | 1000  |
| Number of tag filters | 50 |
| Number of Resource Group filters    | 50 |

> [!NOTE]
> The above limits are for Dynamic scope in the Guest scope only.

For more information, see [service limits for scheduled patching](scheduled-patching.md#service-limits).

## Next steps

 Learn about deploying updates to your machines to maintain security compliance by reading [deploy updates](deploy-updates.md)