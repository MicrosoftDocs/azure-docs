---
title: Data ingestion time in Log Analytics | Microsoft Docs
description: Data sources define the data that Log Analytics collects from agents and other connected sources.  This article describes the concept of how Log Analytics uses data sources, explains the details of how to configure them, and provides a summary of the different data sources available.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.assetid: 67710115-c861-40f8-a377-57c7fa6909b4
ms.service: log-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/19/2018
ms.author: bwren

---
# Data ingestion time in Log Analytics
Azure Log Analytics is a very high scale data service that serves tens of thousands of customers sending terabytes of data each month at a growing pace. There are often questions about the time that the time that data is created by a monitored resource and when it becomes available in Log Analytics. This article article explains the different factors that affect this latency and helps you understand how 



## Next steps
* Learn about [solutions](log-analytics-add-solutions.md) that add functionality to Log Analytics and also collect data into the workspace.
* Learn about [log searches](log-analytics-log-searches.md) to analyze the data collected from data sources and solutions.  
* Configure [alerts](log-analytics-alerts.md) to proactively notify you of critical data collected from data sources and solutions.
