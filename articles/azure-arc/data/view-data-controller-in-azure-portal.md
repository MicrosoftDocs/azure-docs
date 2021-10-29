---
title: View Azure Arc data controller resource in Azure portal
description: View Azure Arc data controller resource in Azure portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# View Azure Arc data controller resource in Azure portal

In order to view the Azure Arc data controller in your Azure portal, one of usage/metrics/logs data from your kubernetes cluster must be exported and uploaded to Azure. 

## Direct connected mode
If the Azure Arc data controller is deployed in **direct** connected mode, usage data is automatically uploaded to Azure, and the kubernetes resources are projected into Azure.

## Indirect connected mode
In the **indirect** connected mode, at least one of usage/metrics/logs data must be exported and uploaded to Azure as described in [Upload usage data, metrics, and logs to Azure](upload-metrics-and-logs-to-azure-monitor.md). This will create the appropriate resources in Azure.

## Azure Portal
Once you have completed your first [metrics or logs upload to Azure](upload-metrics-and-logs-to-azure-monitor.md) or [uploaded usage](view-billing-data-in-azure.md), you will be able to see the Azure Arc data controller and any Azue Arc enabled SQL managed instances or Azure Arc enabled Postgres Hyperscale server resources in the Azure portal.

Open the Azure portal using the URL:  [https://portal.azure.com](https://portal.azure.com).

Search for your data controller by name in the search bar and click on it.

