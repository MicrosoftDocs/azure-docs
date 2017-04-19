---
title:  Azure Stream Analytics - using the resource health blade | Microsoft Docs
description: How to pinpoint issues when troubleshooting Stream Analytics jobs.
keywords: troubleshoot flowchart, resource blade
documentationcenter: ''
services: stream-analytics
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 04/20/2017
ms.author: jeffstok

---

# Stream Analytics troubleshooting workflow

Azure Resource Health shows the health of Azure Stream Analytics jobs and provides actionable guidance to troubleshoot problems. The goal of the Resource Health blade is to reduce the time spent in determining if the root of the problem lays inside the application or if it is caused by an event inside the Azure platform.

If the problem is on with a managed service, such as Azure Event Hub availability, customer efforts towards troubleshooting the issue may not produce results and delay problem resolution.  Therefore, the resource health check blade helps ensure that customers do not needlessly spend time troubleshooting issues that they cannot directly fix and need to open a support case to receive assistance.

## Troubleshooting workflow

Resource Health can be seen by clocking on the “Resource Health” blade. 

![Stream Analytics troubleshooting flow](media/stream-analytics-resource-health/stream-analytics-access-troubleshooting.png)

With this in mind the following flow chart should help with making educated decisions on what to look for and when to open a support case.

![Stream Analytics troubleshooting flow](media/stream-analytics-resource-health/stream-analytics-troubleshooting-map.png)

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)