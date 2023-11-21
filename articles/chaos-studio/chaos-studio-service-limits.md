---
title: Azure Chaos Studio service limits
description: Understand the throttling and usage limits for Azure Chaos Studio.
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.date: 11/01/2021
ms.topic: reference
ms.custom: 
---

# Azure Chaos Studio service limits
This article provides service limits for Azure Chaos Studio. For more information about Azure-wide service limits and quotas, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).

## Experiment and target limits

Chaos Studio applies limits to the number of resources, duration of activities, and retention of data.

| Limit | Value | Description |
|--|--|--|
| Actions per experiment | 9 | The maximum number of actions (such as faults or time delays) in an experiment. |
| Branches per experiment | 9 | The maximum number of parallel tracks that can execute within an experiment. |
| Steps per experiment | 4 | The maximum number of steps that execute in series within an experiment. |
| Action duration (hours) | 12 | The maximum time duration of an individual action. |
| Total experiment duration (hours) | 12 | The maximum duration of an individual experiment, including all actions. |
| Concurrent experiments executing per region and subscription | 5 | The number of experiments that can run at the same time within a region and subscription. |
| Experiment history retention time (days) | 120 | The time period after which individual results of experiment executions are automatically removed. |
| Number of experiment resources per region and subscription | 500 | The maximum number of experiment resources a subscription can store in a given region. |
| Number of targets per action | 50 | The maximum number of resources an individual action can target for execution. For example, the maximum Virtual Machines that can be shut down by a single Virtual Machine Shutdown fault. |
| Number of agents per target | 1,000 | The maximum number of running agents that can be associated with a single target. For example, the agents running on all instances within a single Virtual Machine Scale Set. |
| Number of targets per region and subscription | 10,000 | The maximum number of target resources within a single subscription and region. |

## API throttling limits

Chaos Studio applies limits to all Azure Resource Manager operations. Requests made over the limit are throttled. All request limits are applied for a **five-minute interval** unless otherwise specified. For more information about Azure Resource Manager requests, see [Throttling Resource Manager requests](../azure-resource-manager/management/request-limits-and-throttling.md).

| Operation | Requests |
|--|--|
| Microsoft.Chaos/experiments/write | 100 | 
| Microsoft.Chaos/experiments/read | 300 |
| Microsoft.Chaos/experiments/delete | 100 |
| Microsoft.Chaos/experiments/start/action | 20 |
| Microsoft.Chaos/experiments/cancel/action | 100 |
| Microsoft.Chaos/experiments/statuses/read | 100 |
| Microsoft.Chaos/experiments/executionDetails/read | 100 |
| Microsoft.Chaos/targets/write | 200 |
| Microsoft.Chaos/targets/read | 600 |
| Microsoft.Chaos/targets/delete | 200 |
| Microsoft.Chaos/targets/capabilities/write | 600 |
| Microsoft.Chaos/targets/capabilities/read | 1,800 |
| Microsoft.Chaos/targets/capabilities/delete | 600 |
| Microsoft.Chaos/locations/targetTypes/read | 50 |
| Microsoft.Chaos/locations/targetTypes/capabilityTypes/read | 50 |

## Recommended actions
If you have feedback on the current quotas and limits, submit a feedback request in [Community Feedback](https://feedback.azure.com/d365community/forum/18f8dc01-dc37-ec11-b6e6-000d3a9c7101). 

Currently, you can't request increases to Chaos Studio quotas, but a request process is in development.

If you expect to exceed the maximum concurrent experiments executing per region and subscription:
* Split your experiments across regions. Experiments can target resources outside the experiment resource's region or target multiple resources across different regions.
* Test more scenarios in each experiment by using more actions, steps, and/or branches (up to the maximum current limits).

If your testing requires longer experiments than the currently supported duration:
* Run multiple experiments in sequence.
 
If you want to see experiment execution history:
* Use Chaos Studio's [REST API](../chaos-studio/chaos-studio-samples-rest-api.md) with the "executionDetails" endpoint, for each experiment ID.