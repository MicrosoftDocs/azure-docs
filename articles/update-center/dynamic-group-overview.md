---
title: An overview of Dynamic grouping
description: This article provides information about dynamic grouping, its purpose and advantages.
ms.service: update-management-center
ms.date: 02/07/2023
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# About Dynamic Grouping

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

Dynamic grouping allows you to group any number of virtual machines and apply updates at scale as per a pre-defined scope.

## Key benefits
- **Simplified patching** - Scheduled patching is enabled on all the newly added machines as per the attached schedule.
- **Multiple criteria** - You can specify one or more criteria, which includes, subscription(s), resource group(s), tag(s), location(s), resource type(s), and OS type.
- **Multiple schedules** - You can associate a machine to multiple schedules either dynamically or statically or both.

## Permissions
For dynamic scope and configuration assignment, ensure that you have write permissions to create or modify a schedule.

## Prerequisites
- **Patch Orchestration is set to Azure orchestration** - It enables Auto patching on the VM, else the schedule updates wouldn't be applied.
- **Set the Bypass platform safety checks on user schedule = *True*** - It allows you to define your own patching methods such as time, duration, and type of patching. This VM property ensures that auto patching isn't applied and that patching on the VM(s) runs as per the schedule you've defined.
- **Associate a Schedule with a VM** - It suppresses the auto patching to ensure that patching on the VM(s) runs as per the schedule you've defined.

### Common scenarios
>[!NOTE]
> Subscription is a mandatory criteria for dynamic grouping.

|Scenario  | Patch type  |
|-----|-----|
|Patch mode is set to Azure orchestrated.</br></br> Scheduled patch flag is set. </br></br> Schedule is attached. | </br> Scheduled patching </br> |
|Patch mode is set to Azure orchestrated.</br></br> Scheduled patch flag isn't set.</br></br> Schedule isn't attached. | </br> Error </br> |
|Patch mode is set to Azure orchestrated.</br></br> Scheduled patch flag isn't set.</br></br> Schedule is attached. | </br> Error </br> |
|Patch mode is set to Azure orchestrated.</br></br> Scheduled patch flag isn't set.</br></br> Schedule isn't attached. | </br> Auto patching </br> |
|Patch mode isn't set to Azure orchestrated.</br></br> Scheduled patch flag is set.</br></br> Schedule is attached. | </br>Error </br></br> Both schedule patching and auto patching will not run irrespective of whether a schedule is associated. The VMs are patched by other patch modes such as AutomaticByOS, Image Default, or Manual.|
|Patch mode isn't set to Azure orchestrated.</br></br> Scheduled patch flag is set.</br></br> Schedule isn't attached | </br> Error </br> Both schedule patching and auto patching will not run irrespective of whether a schedule is associated. The VMs are patched by other patch modes such as AutomaticByOS, Image Default, or Manual.|
|Patch mode isn't set to Azure orchestrated.</br></br> Scheduled patch flag isn't set.</br></br> Schedule isn't attached | </br> Error </br> Both schedule patching and auto patching will not run irrespective of whether a schedule is associated. The VMs are patched by other patch modes such as AutomaticByOS, Image Default, or Manual.|

## Workflow of scheduled patching through Dynamic grouping

The workflow of scheduled patching through dynamic grouping consists of the following:
- **Azure Account** - An Azure account with an active subscription. If you don't have one yet, sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- **Prerequisites** - Ensure that you have the [permissions](quickstart-dynamic-grouping.md#permissions) and met the [prerequisites](quickstart-dynamic-grouping.md#prerequisites) for dynamic grouping.
- **Maintenance configuration** - In the Update management center (preview) portal, using the create a maintenance configuration option, you schedule updates within a defined maintenance window.
  > [!NOTE]
  > One dynamic group cannot have more than one schedule.
- **Create groups** -  To implement dynamic grouping, you must create a group, criteria and assign the VMs as per the criteria. It ensures that all the new VMs included or the old VMs excluded are either automatically patched or not patched as per the schedule
- **Obtain consent** - You must provide consent if the machines must be patched as per Azure determined schedule.
- **Updates selection** - Specify the types of updates to include/exclude for the machines.
- **Preview** - Run a query to view the set of machines that match the criteria for dynamic grouping.

## Next steps

 Learn about deploying updates to your machines to maintain security compliance by reading [deploy updates](deploy-updates.md)