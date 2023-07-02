---
title: An overview of Dynamic scoping (preview) 
description: This article provides information about dynamic scoping (preview), its purpose and advantages.
ms.service: update-management-center
ms.date: 06/27/2023
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# About Dynamic Scoping (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

Dynamic scoping (preview) is an advanced capability of schedule patching that allows users to: 

- Group machines based on criteria such as subscription, resource group, location, resource type, OS Type, and Tags. This becomes the definition of the scope. 
- Associate the scope to a schedule/maintenance configuration to apply updates at scale as per a pre-defined scope. 

The criteria will be evaluated at the scheduled run time, which will be the final list of machines that will be patched by the schedule. The machines evaluated during create or edit phase may differ from the group at schedule run time. 

## Key benefits

- **Simplified patching** - Users do not have to change associations between machines and schedules manually. For example, if you want to remove a machine from a schedule and your scope was defined based on tag(s) criteria, removing the tag on the machine will automatically drop the association.  
- **Multiple criteria** - You can specify one or more criteria, which includes, subscription(s), resource group(s), tag(s), location(s), resource type(s), and OS type. Subscription is a mandatory criterion for dynamic scoping. 
- **Multiple schedules** - You can associate a schedule to multiple machines either dynamically or statically or both.

> [!NOTE]
> You can associate one dynamic scope to one schedule.

## Permissions

For dynamic scoping (preview) and configuration assignment, ensure that you have the following permissions:

- Write permissions to create or modify a schedule.
- Read permissions to assign or read a schedule.

## Maximum VM limit

- 2000 VMs per Dynamic scope 
- 10,000 VMs per Schedule 

## Prerequisites for Azure VMs

1. Patch orchestration should be **Customer Managed Schedules (Preview)/ (AutomaticByPlatform and ByPassPlatformSafetyChecksOnUserSchedule = TRUE)**.  
1. Associate the VM with a Schedule. 

> [!NOTE]
> For Arc VMs, there are no patch orchestration pre-requisites. However, you must associate a schedule with the VM for Schedule patching. For more information, see [Configure schedule patching on Azure VMs to ensure business continuity](prerequsite-for-schedule-patching.md).


## Next steps

 Learn about deploying updates to your machines to maintain security compliance by reading [deploy updates](deploy-updates.md)