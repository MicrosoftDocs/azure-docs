---
title: Azure SQL database monitoring-log analytics | Microsoft Docs
description: Learn about streaming Azure SQL Database metrtics and diagnostic logs into log analytics
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: 

ms.assetid: 
ms.service: sql-database
ms.custom: secure and protect
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/21/2017
ms.author: carlrab

---
# Azure SQL Database metrics and diagnostics logging 
Azure SQL Database metrics and diagnostic logs can be streamed into Log Analytics using the built-in “Export to Log Analytics” option in the portal, or by enabling Log Analytics in a diagnostic setting via Azure PowerShell cmdlets, Azure CLI or Azure Monitor REST API.

To enable metrics and diagnostic logs collection, see [Enable metrics and diagnostic logging](sql-database-metrics-diag-logging.md#enable-metrics-and-diagnostics-logging).

## Installation overview

Monitoring Azure SQL Database fleet is very simple with Log Analytics. Three steps are required:

1.	Create Log Analytics resource
2.	Configure databases to record metrics and diagnostic logs into the created Log Analytics
3.	Install **Azure SQL DB Monitoring** solution from gallery in Log Analytics

## Create Log Analytics resource

1. Click **New** in the left-hand menu.
2. Click **Monitoring + Management**
3. Click **Log Analytics**
4. Fill in the Log Analytics form with the additional information required: workspace name, subscription, resource group, location, and pricing tier.

   <img src="./media/sql-database-monitoring-log-analytics/log-analytics.png" alt="log analytics" style="width: 780px;" />

## Configure databases to record metrics and diagnostic logs

The easiest way to configure where databases will record their metrics is through the Azure ortal. Navigate to your Azure SQL Database resource and find **Diagnostic configuration**. For more information, please read how to [Enable metrics and diagnostic logging](sql-database-metrics-diag-logging.md#enable-metrics-and-diagnostics-logging).

Install the Azure SQL DB Monitoring solution from gallery  

## Next steps
