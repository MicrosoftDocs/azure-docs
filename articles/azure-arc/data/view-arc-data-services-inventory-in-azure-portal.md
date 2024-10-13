---
title: View inventory of your instances in the Azure portal
description: View inventory of your instances in the Azure portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Inventory of Arc enabled data services

You can view your Azure Arc-enabled data services in the Azure portal or in your Kubernetes cluster.

## View resources in Azure portal

After you upload your [metrics, logs](upload-metrics-and-logs-to-azure-monitor.md), or [usage](view-billing-data-in-azure.md), you can view your deployments of SQL Managed Instance enabled by Azure Arc or Azure Arc-enabled PostgreSQL servers in the Azure portal. To view your resource in the [Azure portal](https://portal.azure.com), follow these steps:

1. Go to **All services**.
1. Search for your database instance type.
1. Add the type to your favorites.
1. In the left menu, select the instance type.
1. View your instances in the same view as your other Azure SQL or Azure PostgreSQL server resources (use filters for a granular view).

## View resources in your Kubernetes cluster

If the Azure Arc data controller is deployed in **indirect** connectivity mode, you can run the below command to get a list of all the Azure Arc SQL managed instances:

```
az sql mi-arc list --k8s-namespace <namespace> --use-k8s
#Example
az sql mi-arc list --k8s-namespace arc --use-k8s
```

If the Azure Arc data controller is deployed in **direct** connectivity mode, you can run the below command to get a list of all the Azure Arc SQL managed instances:

```
az sql mi-arc list --resource-group <resourcegroup>
#Example
az sql mi-arc list --resource-group myResourceGroup
```
