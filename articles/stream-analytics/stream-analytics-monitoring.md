---
title: Understand job monitoring in Azure Stream Analytics
description: This article describes how to monitor jobs in Azure Stream Analytics
services: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 11/21/2018
---
# Understand Stream Analytics job monitoring and how to monitor queries

## Introduction: The monitor page
The Azure portal both surface key performance metrics that can be used to monitor and troubleshoot your query and job performance. To see these metrics, browse to the Stream Analytics job you are interested in seeing metrics for and view the **Monitoring** section on the Overview page.  

![Monitoring link](./media/stream-analytics-monitoring/02-stream-analytics-monitoring-block.png)

The window will appear as shown:

![Monitoring job Dashboard](./media/stream-analytics-monitoring/01-stream-analytics-monitoring.png)  

## Metrics available for Stream Analytics
| Metric                 | Definition                               |
| ---------------------- | ---------------------------------------- |
| Backlogged Input Events       | Number of input events that are`` backlogged. |
| Data Conversion Errors | Number of output events that could not be converted to the expected output schema. |
| Early Input Events       | Number of events received early. |
| Failed Function Requests | Number of failed Azure Machine Learning function calls (if present). |
| Function Events        | Number of events sent to the Azure Machine Learning function (if present). |
| Function Requests      | Number of calls to the Azure Machine Learning function (if present). |
| Input Deserialization Errors       | Number of events that could not be deserialized.  |
| Input Event Bytes      | Amount of data received by the Stream Analytics job, in bytes. This can be used to validate that events are being sent to the input source. |
| Input Events           | Amount of data received by the Stream Analytics job, in number of events. This can be used to validate that events are being sent to the input source. |
| Input Sources Received       | Number of events coming from an input source. |
| Late Input Events      | Number of events arriving late from the source which have either been dropped or their timestamp has been adjusted, based on the Event Ordering Policy configuration of the Late Arrival Tolerance Window setting. |
| Out-of-Order Events    | Number of events received out of order that were either dropped or given an adjusted timestamp, based on the Event Ordering Policy. This can be impacted by the configuration of the Out of Order Tolerance Window setting. |
| Output Events          | Amount of data sent by the Stream Analytics job to the output target, in number of events. |
| Runtime Errors         | Total number of errors related to query processing (excluding errors found while ingesting events or outputing results) |
| SU % Utilization       | The utilization of the Streaming Unit(s) assigned to a job from the Scale tab of the job. Should this indicator reach 80%, or above, there is high probability that event processing may be delayed or stopped making progress. |
| Watermark Delay       | The maximum watermark delay across all partitions of all outputs in the job. |

## Customizing Monitoring in the Azure portal
You can adjust the type of chart, metrics shown, and time range in the Edit Chart settings. For details, see [How to Customize Monitoring](../monitoring-and-diagnostics/insights-how-to-customize-monitoring.md).

  ![Query Monitor Time graph](./media/stream-analytics-monitoring/08-stream-analytics-monitoring.png)  


## Latest output
Another interesting data point to monitor your job is the time of the last output, shown in the Overview page.
This time is the application time (i.e. the time using the timestamp from the event data) of the latest output of your job.

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureStreamAnalytics)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

