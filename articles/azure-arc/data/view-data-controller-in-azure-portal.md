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

# View Azure Arc data controller resource in Azure portal

To view the Azure Arc data controller in your Azure portal, one of usage/metrics/logs data from your kubernetes cluster must be exported and uploaded to Azure. 

## Direct connected mode
If the Azure Arc data controller is deployed in **direct** connected mode, usage data is automatically uploaded to Azure, and the kubernetes resources are projected into Azure.

## Indirect connected mode
In the **indirect** connected mode, you must export and upload at least one of usage data, metrics, or logs to Azure as described in [Upload usage data, metrics, and logs to Azure](upload-metrics-and-logs-to-azure-monitor.md). This action creates the appropriate resources in Azure.

## Azure Portal

After you complete your first [metrics or logs upload to Azure](upload-metrics-and-logs-to-azure-monitor.md) or [uploaded usage](view-billing-data-in-azure.md), you can see the Azure Arc data controller and any Azure Arc-enabled SQL managed instances or Azure Arc-enabled Postgres Hyperscale server resources in the Azure portal.

Open the Azure portal using the URL:  [https://portal.azure.com](https://portal.azure.com).

Search for your data controller by name in the search bar and click on it.

