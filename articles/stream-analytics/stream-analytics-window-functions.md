<properties
	pageTitle="Introduction to Stream Analytics Window functions | Microsoft Azure"
	description="Learn about the three Window functions in Stream Analytics (tumbling, hopping, sliding)."
	keywords="tumbling window, sliding window, hopping window"
	documentationCenter=""
	services="stream-analytics"
	authors="jeffstokes72"
	manager="paulettm"
	editor="cgronlun"
/>

<tags
	ms.service="stream-analytics"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="data-services"
	ms.date="07/29/2016"
	ms.author="jeffstok"
/>


# Introduction to Stream Analytics Window functions

In some data stream analysis scenarios, it is a requirement to view a continuous data stream in a specific time period and apply some sort of set-based operation against the data contained within. Be it count, aggregation or any other function, the ability to see a data stream as some unit of time is generally needed to make sense of the data. In Azure Stream Analytics, three types of [Window functions](https://msdn.microsoft.com/library/dn835019.aspx) are provided to reduce development time for temporal functions. They are [**Tumbling**](https://msdn.microsoft.com/library/dn835055.aspx), [**Hopping**](https://msdn.microsoft.com/library/dn835041.aspx) and [**Sliding**](https://msdn.microsoft.com/library/dn835051.aspx). It is worth noting that all window operations output results at the **end** of the window. The output of the window will be single event based on the aggregate function used. The event will have the time stamp of the end of the window and all Window functions are defined with a fixed length. Lastly it is important to note that all Window functions should be used in a [**GROUP BY**](https://msdn.microsoft.com/library/dn835023.aspx) clause.

![Stream Analytics Window functions concepts](media/stream-analytics-window-functions/stream-analytics-window-functions-conceptual.png)

## Tumbling Window

Tumbling window functions are used to segment a data stream into distinct time segments and perform a function against them, such as the example below. The key differentiators of a Tumbling window are that they repeat, do not overlap and an event cannot belong to more than one tumbling window.

![Stream Analytics Window functions tumbling intro](media/stream-analytics-window-functions/stream-analytics-window-functions-tumbling-intro.png)

## Hopping Window

Hopping window functions hop forward in time by a fixed period. It may be easy to think of them as Tumbling windows that can overlap, so events can belong to more than one Hopping window result set. To make a Hopping window the same as a Tumbling window one would simply specify the hop size to be the same as the window size. 

![Stream Analytics Window functions hopping intro](media/stream-analytics-window-functions/stream-analytics-window-functions-hopping-intro.png)

## Sliding Window

Sliding window functions, unlike Tumbling or Hopping windows, produce an output **only**  when an event occurs. Every window will have at least one event and the window continuously moves forward by an € (epsilon). Like Hopping Windows, events can belong to more than one Sliding Window.

![Stream Analytics Window functions sliding intro](media/stream-analytics-window-functions/stream-analytics-window-functions-sliding-intro.png)

## Getting help with Window functions

For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
