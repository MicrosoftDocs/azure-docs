---
title: include file
description: include file
services: lighthouse
author: JnHs
ms.service: lighthouse
ms.topic: include
ms.date: 03/30/2020
ms.author: jenhayes
ms.custom: include file
---

These samples show how to use Azure Monitor to create alerts for subscriptions that have been onboarded for Azure delegated resource management.

| **Template** | **Description** |
|---------|---------|
| [monitor-delegation-changes](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/tools/monitor-delegation-changes) | Queries the past 1 day of activity in a managing tenant and [reports on any added or removed delegations](../articles/lighthouse/how-to/monitor-delegation-changes.md) (or attempts that were not successful).|
| [alert-using-actiongroup](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/alert-using-actiongroup) | This template creates an Azure alert and connects to an existing Action Group.|
| [multiple-loganalytics-alerts](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/multiple-loganalytics-alerts) | Creates multiple Log alerts based on Kusto queries.|
| [delegation-alert-for-customer](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/delegation-alert-for-customer) | Deploys an alert in a tenant when a user delegates a subscription to a managing tenant.|
