---
title: Azure Monitor for containers health monitors configuration | Microsoft Docs
description: This article provides content describing the detailed configuration of the health monitors in Azure Monitor for containers. 
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 
ms.assetid: 
ms.service: azure-monitor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 11/12/2019
ms.author: magoedte
---

# Azure Monitor for containers health monitor configuration guide

## Monitors

A monitor measures the health of some aspect of a managed object. Monitors each have either two or three health states. A monitor will be in one and only one of its potential states at any given time. When a monitor loaded by the containerized agent, it is initialized to a healthy state. The state changes only if the specified conditions for another state are detected.

The overall health of a particular object is determined from the health of each of its monitors. This hierarchy is illustrated in the Health Hierarchy pane in Azure Monitor for containers.  

Health Explorer of the Operations console. The policy for how health is rolled up is part of the configuration of the aggregate and dependency monitors.

## Aggregate monitor

Aggregate monitors group multiple monitors to provide a single health aggregated health state. This provides an organization to all of the monitors targeted at a particular class and provides a consolidated health state for specific categories of operation.

### Health rollup policy

Each aggregate monitor defines a health rollup policy which is the logic that is used to determine the health of the aggregate monitor based on the health of the monitors under it. The possible health rollup policies for an aggregate monitor are as follows:

#### Worst state

The state of the aggregate monitor matches the state of the child monitor with the worst health state. This is the most common policy used by aggregate monitors.

#### Best state

The state of the aggregate monitor matches the state of the child monitor with the best health state.

## Unit monitor

Measures some aspect of the application. This might be checking a performance counter to determine the performance of the application, running a script to perform a synthetic transaction, or watch for an event that indicates an error. Classes will typically have multiple unit monitors targeted at them to test different features of the application and to monitor for different problems.