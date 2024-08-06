---
title: Metrics for Akri services
description: Available observability metrics for Akri services to monitor the health and performance of your solution.
author: kgremban
ms.author: kgremban
ms.topic: reference
ms.custom:
  - ignite-2023
ms.date: 11/1/2023

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Metrics for Akri services

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Akri services provide a set of observability metrics that you can use to monitor and analyze the health of your solution.  This article lists the available metrics, and describes the meaning and usage details of each metric.

## Available metrics

| Metric name | Definition |
| ----------- | ---------- |
| instance_count | The number of OPC UA assets that Akri services detects and adds as a custom resource to the cluster at the edge. | 
| discovery_response_result | The success or failure of every discovery request that the Agent sends to the Discovery Handler.| 
| discovery_response_time | The time in seconds from the point when Akri services apply the configuration, until the Agent makes the first discovery request.| 


## Related content

- [Configure observability](../configure-observability-monitoring/howto-configure-observability.md)
