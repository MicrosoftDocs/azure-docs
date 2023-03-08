---
title: View Azure Arc data controller resource in Azure portal
description: View Azure Arc data controller resource in Azure portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# View Azure Arc data controller resource in the Azure portal

To view the Azure Arc data controller in the  Azure portal, you must export at least one type of data (usage data, metrics, or logs) from your Kubernetes cluster and upload it to Azure.

## Direct connected mode

If the Azure Arc data controller is deployed in **direct** connected mode, usage data is automatically uploaded to Azure, and the Kubernetes resources are projected into Azure.

## Indirect connected mode

In the **indirect** connected mode, you must export and upload at least one type of data (usage data, metrics, or logs) to Azure. For more information on this process, see [Upload usage data, metrics, and logs to Azure](upload-metrics-and-logs-to-azure-monitor.md). This action creates the appropriate resources in Azure.

## Azure portal

After you complete your first [metrics or logs upload to Azure](upload-metrics-and-logs-to-azure-monitor.md) or [usage data upload](view-billing-data-in-azure.md), you can see the Azure Arc data controller and any Azure Arc-enabled SQL managed instances or Azure Arc-enabled PostgreSQL server resources in the [Azure portal](https://portal.azure.com).

To find your data controller, search for it by name in the search bar and then select it.
