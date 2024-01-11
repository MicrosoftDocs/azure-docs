---
title: Health models in Azure Monitor
description: Learn how to register the resource provider, access health models, and create resource models.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/12/2023
---

# Health models in Azure Monitor (preview)

Azure Monitor health models enables you to track the health of your Azure resources and workloads.

## Define your workload
Each health model defines a distinct workload, including the Azure resources it depends on and the relationship between those resources. You use a graphical tool to add resources to the model and to connect those resources that depend on each other. In addition to actual resources, you can add entities to represent business processes and custom groupings to aggregate the health of related entities.


## Existing Azure Monitor telemetry
Health models calculate the health of included resources using data that's already collected by Azure Monitor. This includes platform metrics and resource logs for Azure resources in addition to any data being collected by features such as Container insights and VM insights. Any data stored in Log Analytics workspaces and Azure Monitor workspaces can be used in health calculations.

## Service level
Set a service level for the health model to define your commitment to your customers for the workflow. Azure Monitor will track the availability of the workflow based on the health state of the root entity. You can view the availability of the workflow over time and compare it to the service level you set.

## Alerts
In addition to existing Azure Monitor alert rules that fire on individual signals, you can alert on the health state of any of the entities in a health model or on the health state of the root entity. This allows you to reduce the total number of alerts that you generate and to ensure that you're only firing alerts when the performance of the workload is actually degraded or unhealthy.
