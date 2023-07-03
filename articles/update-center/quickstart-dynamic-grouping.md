---
title: Quickstart - configure update settings for groups using update management center in the Azure portal.
description: This quickstart helps you to configure update settings using the Azure portal.
ms.service: update-management-center
ms.date: 01/25/2023
author: SnehaSudhirG
ms.author: sudhirsneha
ms.topic: quickstart
---

# Quickstart: Schedule updates using Dynamic scope

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

Dynamic scoping allows you to include VMs based on the scope and schedule updates at scale. You can modify the scope at any time and the patching requirements are applied at scale without any changes to the deployment schedule.

This quickstart details how to configure schedule updates on a group of Azure virtual machine(s) or Arc-enabled server(s)on-premises or in cloud environments.

## Permissions

Ensure that you have write permissions to create or modify a schedule for a dynamic group.

## Key benefits

- You can now have a simplified patching process for your VMs and reuse the schedule. [Learn more](dynamic-scope-overview.md#key-benefits).
- 

## Prerequisites

- An Azure account with an active subscription. If you don't have one yet, sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Patch Orchestration must be set to Azure orchestration to enable Auto patching on the VM, else the schedule updates wouldn't be applied.
- Set the Bypass platform safety checks on user schedule = *True* allows you to define your own patching methods such as time, duration, and type of patching. This VM property ensures that auto patching isn't applied and that patching on the VM(s) runs as per the schedule you've defined.
- Associate a Schedule with a VM suppresses the auto patching to ensure that patching on the VM(s) runs as per the schedule you've defined.


## Next steps

  Learn more on the [steps to dynamically scope VMs for patching requirements](tutorial-dynamic-grouping-for-scheduled-patching.md).