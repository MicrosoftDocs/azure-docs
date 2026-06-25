---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 06/19/2026
ms.author: dobett
ms.service: azure-iot-operations
ms.custom:
  - include file
---

| Transform | Artifact | Description |
|-----------|----------|-------------|
| [Map](../connect-to-cloud/howto-dataflow-graphs-map.md) | `azureiotoperations/graph-dataflow-map:1.0.0` | Rename, restructure, compute, and copy fields. |
| [Filter](../connect-to-cloud/howto-dataflow-graphs-filter-route.md) | `azureiotoperations/graph-dataflow-filter:1.0.0` | Drop messages that match a condition. |
| [Branch](../connect-to-cloud/howto-dataflow-graphs-filter-route.md#branch-transform) | `azureiotoperations/graph-dataflow-branch:1.0.0` | Route each message to a `true` or `false` path based on a condition. |
| [Concatenate](../connect-to-cloud/howto-dataflow-graphs-filter-route.md#merge-paths-with-concatenate) | `azureiotoperations/graph-dataflow-concatenate:1.0.0` | Merge two or more paths back into one. |
| [Window](../connect-to-cloud/howto-dataflow-graphs-window.md) | `azureiotoperations/graph-dataflow-window:1.0.0` | Collect messages over a time interval, then aggregate. |
