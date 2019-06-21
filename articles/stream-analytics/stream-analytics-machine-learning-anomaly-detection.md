---
title: Anomaly detection in Azure Stream Analytics
description: This article describes how to use Azure Stream Analytics and Azure Machine Learning together to detect anomalies.
services: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 06/21/2019
---

# Anomaly detection in Azure Stream Analytics

Available in both the cloud and Azure IoT Edge, Azure Stream Analytics offers built-in machine learning based anomaly detection capabilities that can be used to monitor the two most commonly occurring anomalies: temporary and persistent. With the **AnomalyDetection_SpikeAndDip** and **AnomalyDetection_ChangePoint** functions, you can perform anomaly detection directly in your Stream Analytics job.

The machine learning models assume a uniformly sampled time series. If the time series is not uniform, you may insert an aggregation step with a tumbling window prior to calling anomaly detection.

The machine learning operations do not support seasonality trends or multi-variate correlations at this time.

## Model accuracy and performance

Generally, the model's accuracy improves with more data in the sliding window. The data in the specified sliding window is treated as part of its normal range of values for that time frame. The model only considers event history over the sliding window to check if the current event is anomalous. As the sliding window moves, old values are evicted from the model’s training.

The functions operate by establishing a certain normal based on what they have seen so far. Outliers are identified by comparing against the established normal, within the confidence level. The window size should be based on the minimum events required to train the model for normal behavior so that when an anomaly occurs, it would be able to recognize it.

The model's response time increases with history size because it needs to compare against a higher number of past events. It is recommended to only include the necessary number of events for better performance.

Gaps in the time series can be a result of the model not receiving events at certain points in time. This situation is handled by Stream Analytics using imputation logic. The history size, as well as a time duration, for the same sliding window is used to calculate the average rate at which events are expected to arrive.

## Spike and dip

Temporary anomalies in a time series event stream are known as spikes and dips. Spikes and dips can be monitored using the Machine Learning based operator, [AnomalyDetection_SpikeAndDip](https://docs.microsoft.com/stream-analytics-query/anomalydetection-spikeanddip-azure-stream-analytics
).

![Example of spike and dip anomaly](./media/stream-analytics-machine-learning-anomaly-detection/anomaly-detection-spike-dip.png)

In the same sliding window, if a second spike is smaller than the first one, the computed score for the smaller spike is probably not significant enough compared to the score for the first spike within the confidence level specified. You can try decreasing the model's confidence level to detect such anomalies. However, if you start to get too many alerts, you can use a higher confidence interval.

The following example query assumes a uniform input rate of one event per second in a 2-minute sliding window with a history of 120 events. The final SELECT statement extracts and outputs the score and anomaly status with a confidence level of 95%.

```SQL
WITH AnomalyDetectionStep AS
(
    SELECT
        EVENTENQUEUEDUTCTIME AS time,
        CAST(temperature AS float) AS temp,
        AnomalyDetection_SpikeAndDip(CAST(temperature AS float), 95, 120, 'spikesanddips')
            OVER(LIMIT DURATION(second, 120)) AS SpikeAndDipScores
    FROM input
)
SELECT
    time,
    temp,
    CAST(GetRecordPropertyValue(SpikeAndDipScores, 'Score') AS float) AS
    SpikeAndDipScore,
    CAST(GetRecordPropertyValue(SpikeAndDipScores, 'IsAnomaly') AS bigint) AS
    IsSpikeAndDipAnomaly
INTO output
FROM AnomalyDetectionStep
```

## Change point

Persistent anomalies in a time series event stream are changes in the distribution of values in the event stream, like level changes and trends. In Stream Analytics, such anomalies are detected using the Machine Learning based [AnomalyDetection_ChangePoint](https://docs.microsoft.com/stream-analytics-query/anomalydetection-changepoint-azure-stream-analytics) operator.

Persistent changes last much longer than spikes and dips and could indicate catastrophic event(s). Persistent changes are not usually visible to the naked eye, but can be detected with the **AnomalyDetection_ChangePoint** operator.

The following image is an example of a level change:

![Example of level change anomaly](./media/stream-analytics-machine-learning-anomaly-detection/anomaly-detection-level-change.png)

The following image is an example of a trend change:

![Example of trend change anomaly](./media/stream-analytics-machine-learning-anomaly-detection/anomaly-detection-trend-change.png)

The following example query assumes a uniform input rate of one event per second in a 20-minute sliding window with a history size of 1200 events. The final SELECT statement extracts and outputs the score and anomaly status with a confidence level of 80%.

```SQL
WITH AnomalyDetectionStep AS
(
    SELECT
        EVENTENQUEUEDUTCTIME AS time,
        CAST(temperature AS float) AS temp,
        AnomalyDetection_ChangePoint(CAST(temperature AS float), 80, 1200) 
        OVER(LIMIT DURATION(minute, 20)) AS ChangePointScores
    FROM input
)
SELECT
    time,
    temp,
    CAST(GetRecordPropertyValue(ChangePointScores, 'Score') AS float) AS
    ChangePointScore,
    CAST(GetRecordPropertyValue(ChangePointScores, 'IsAnomaly') AS bigint) AS
    IsChangePointAnomaly
INTO output
FROM AnomalyDetectionStep

```

## Performance characteristics

The performance of these models is a function of the history size, window duration, event load, and whether function level partitioning is used. Here we discuss these configurations and provide reproducible samples on how to sustain a given ingestion rates of 1K, 5K and 10K events per second.

* History size: These models perform linearly with history size. Thus, longer the history size, longer the models take to score a new event. This is because the models compare the new event with each of the past events in the history buffer.
* Window duration: The window duration should reflect how long it takes to receive as many events as specified by the history size. Without that many events in the window, ASA would impute missing values. Hence, ultimately CPU consumption is a function of the history size.
* Event load: Greater the event load, the more work is performed by the models. Clearly, this would impact the CPU consumption. The job can be scaled out by making it embarrassingly parallel, assuming it makes sense for business logic to use more input partitions.
* Function level partitioning: This is about using ```partition by``` within the anomaly detection function. This type of partitioning adds an overhead, as state needs to be maintained for multiple models at the same time. This is used in scenarios like device level partitioning.

### Relationship
The history size, window duration, and total event load are related in the following way:

windowDuration (in ms) = 1000 * historySize / (Total Input Events Per Sec / Input Partition Count)

When partitioning the function by deviceId, you would also add “partition by deviceId” to the anomaly detection function call.

### Observations
These were our throughput observations for a single node (6 SU) for the non-partitioned case:

| History Size (events)	| Window Duration (ms) | Total Input Events Per Sec |
| --------------------- | -------------------- | -------------------------- |
| 60 | 55 | 2,200 |
| 600 | 728 | 1,650 |
| 6,000 | 10,910 | 1,100 |

These were our throughput observations for a single node (6 SU) for the partitioned case:

| History Size (events) | Window Duration (ms) | Total Input Events Per Sec | Device Count |
| --------------------- | -------------------- | -------------------------- | ------------ |
| 60 | 1,091 | 1,100 | 10 |
| 600 | 10,910 | 1,100 | 10 |
| 6,000 | 218,182 | <550 | 10 |
| 60 | 21,819 | 550 | 100 |
| 600 | 218,182 | 550 | 100 |
| 6,000 | 2,181,819 | <550 | 100 |

Sample code to run the non-partitioned configurations above is located in the Streaming At Scale repo of Azure Samples [here](https://github.com/Azure-Samples/streaming-at-scale/blob/f3e66fa9d8c344df77a222812f89a99b7c27ef22/eventhubs-streamanalytics-eventhubs/anomalydetection/create-solution.sh). The code creates a stream analytics job with no function level partitioning, which uses Event Hub as input and output. The input load is generated using test clients. Each input event is a 1KB json document. Events simulate an IoT device sending JSON data (for up to 1K devices). The history size, window duration, and total event load are varied over 2 input partitions.

> [!Note]
> Please note the configurations mentioned may be outdated despite our regular efforts. Recommend deploying the solutions, customizing and verifying your scenario to come up with more accurate estimates of resources required.

### Identifying bottlenecks
To identify where bottleneck exists in your pipeline, following metrics are critical to monitor. Please use Metrics pane in Stream Analytics , see "Input/Output Events" for throughput and "Watermark Delay" or "Backlogged Events" metrics to see if the job is keeping up with the input rate. For Event Hub Metrics check if there are any "Throttled Requests" and adjust the Threshold Units accordingly.


## Anomaly detection using machine learning in Azure Stream Analytics

The following video demonstrates how to detect an anomaly in real time using machine learning functions in Azure Stream Analytics. 

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Anomaly-detection-using-machine-learning-in-Azure-Stream-Analytics/player]

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.ASpx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

