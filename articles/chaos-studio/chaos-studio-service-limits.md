---
title: Azure Chaos Studio service limits
description: Understand the throttling and usage limits for Azure Chaos Studio
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.date: 11/01/2021
ms.topic: reference
ms.custom: ignite-fall-2021
---

# Azure Chaos Studio service limits
This article provides service limits for Azure Chaos Studio. 
## Experiment and target limits

Chaos Studio applies limits to the number of objects, duration of activities, and retention of data.

| Limit | Value |
| -- | -- |
| Actions per experiment | 9 |
| Branches per experiment | 9 |
| Steps per experiment | 4 |
| Action duration (hours) | 12 |
| Concurrent experiments executing per region and subscription | 5 |
| Total experiment duration (hours) | 12 |
| Number of experiments per region and subscription | 500 |
| Number of targets per action | 50 |
| Number of active agents per target | 1,000 |
| Number of targets per region and subscription | 10,000 |

## API throttling limits

Chaos Studio applies limits to all ARM operations. Requests made over the limit are throttled. All request limits are applied for a five-minute interval unless otherwise specified.

| Operation | Requests |
| -- | -- |
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
| Microsoft.Chaos/targets/capabilities/read | 1800 |
| Microsoft.Chaos/targets/capabilities/delete | 600 |
| Microsoft.Chaos/locations/targetTypes/read | 50 |
| Microsoft.Chaos/locations/targetTypes/capabilityTypes/read | 50 |
