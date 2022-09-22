---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
tags: azure-service-management
ms.prod: devops
ms.topic: "include"
ms.date: 07/22/2019
ms.author: bwren
ms.custom: "include file"
---

### Prometheus remote write
When sending data from a cluster to Azure Monitor managed service for Prometheus using remote write, consider the following calculations and limitations.

### CPU requests and limits

- CPU usage:  0.25 x (number of metrics) + 1.25 x (avg number of series per metric)
- CPU request:  0.75 x (CPU usage)
- CPU limit:  2 x (CPU request)

Calculations were determined using a remote batch size of 500 which is the default.

### Memory request and limits

- Memory request: 150 Mb
- Memory limit: 200 Mb

### Maximum throughput
Remote write container can process up to 150,000 unique time series. The container may throw errors serving requests over 150,000 due to the high number of concurrent connections. This issue can be mitigated by increasing the remote batch size from 500 to 1,000. This reduces the number of open connections.
