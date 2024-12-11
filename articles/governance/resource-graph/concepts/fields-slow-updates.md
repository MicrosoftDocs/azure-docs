---
title: Azure Resource Graph fields that have slower update times
description: Learn about ARG fields that are uploaded at a slower cadence than others. 
ms.date: 12/11/2024
ms.topic: conceptual
---

# Understanding Azure Resource Graph fields that have slower update times

There are specific fields, when using Azure Resource Graph, that are updated at a slower cadence. These fields will converge to true values over time, provided there are no updates in between. 

## List of fields affected

**Virtual Machines: VMs are updated asynchronously, which means that the current state does not match the "goal state" (desired state set by customers). However, these VM fields will converge over time.**

- properties.extended.instanceView.osName
- properties.extended.instanceView.osVersion
- properties.extended.instanceView.computerName

