---
title: Anomaly Detection in Azure Usage Guide  (Preview)| Microsoft Docs
description: Use stream analytics and machine learning to detect anomalies.
services: stream-analytics
documentationcenter: ''
author: dubansal
manager: jhubbard

ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 08/28/2017
ms.author: dubansal
---

# Using the ANOMALYDETECTION operator

> [!IMPORTANT]
> This functionality is in preview. We do not recommend use in production.

The **ANOMALYDETECTION** operator can be used to detect anomalies in event streams.
For example, a slow decrease in free memory over a long time can be indicative
of a memory leak, or the number of web service requests that are stable in a
range might dramatically increase or decrease.

It checks for the following types of anomalies over the specified duration:

- Bidirectional level change
- Slow positive trend
- Slow negative trend

The time interval for how far back in history from the current event needs to be
looked at is limited using the **LIMIT DURATION** clause. **ANOMALYDETECTION** can
optionally be limited to only events that match a certain property or condition
using the **WHEN** clause.

It can also optionally process groups of events separately based on the key
specified in the **PARTITION BY** clause. Training and prediction occur
independently in each partition.

## Syntax

`ANOMALYDETECTION(\<scalar_expression\>) OVER ([PARTITION BY \<partition key\>] LIMIT DURATION(\<unit\>, \<length\>) [WHEN boolean_expression])` 


## Example usage

`SELECT id, val, ANOMALYDETECTION(val) OVER(PARTITION BY id LIMIT DURATION(hour, 1) WHEN id \> 100) FROM input`|


## Arguments

- **scalar_expression**

  The scalar expression over which the anomaly detection would be performed. It is
an expression of float or bigint type that returns a single (scalar) value. The
wildcard expression **\*** is not allowed. **scalar_expression** cannot contain other
analytic functions or external functions.

- **OVER ( [ partition_by_clause ] limit_duration_clause [when_clause])**

- **partition_by_clause** 

  The `PARTITION BY \<partition key\>` clause divides the
learning and training across separate partitions. In other words, a separate
model would be used per value of `\<partition key\>` and only events with that
value would be used for learning and training in that model. For example,

  `SELECT sensorId, reading, ANOMALYDETECTION(reading) OVER(PARTITION BY sensorId LIMIT DURATION(hour, 1)) FROM input`

  will train and score a reading against other readings of the same sensor only.

- **limit_duration clause** DURATION(\<unit\>, \<length\>)

  Specifies how much of the history from the current event is considered in the
**ANOMALYDETECTION** computation. See DATEDIFF for a detailed description of
supported units and their abbreviations.

- **when_clause** 

  Specifies a Boolean condition for the events considered in the
**ANOMALYDETECTION** computation.

## Return Types

The function returns a Record containing all three scores as its output. The
properties associated with the different types of anomaly detectors are called:

- BiLevelChangeScore
- SlowPosTrendScore
- SlowNegTrendScore

To extract the individual values out of the record, use the
**GetRecordPropertyValue** function. For example:

`SELECT id, val FROM input WHERE (GetRecordPropertyValue(ANOMALYDETECTION(val) OVER(LIMIT DURATION(hour, 1)), 'BiLevelChangeScore')) \> 3.25` 


An anomaly of a particular type is detected when one of these anomaly scores
crosses a threshold. The threshold can be any floating point number \>= 0. The
threshold is a tradeoff between sensitivity and confidence. For example, a lower
threshold would make detection more sensitive to changes and generate more
alerts, whereas a higher threshold could make detection less sensitive and more
confident but mask some anomalies. The exact threshold value to use depends on
the scenario. There is no upper limit but the recommended range is 3.25-5.

## Algorithm

**ANOMALYDETECTION** uses sliding window semantics, which means that the computation
executes per event that enters the function and a score is produced for that
event. The computation is based on Exchangeability Martingales, which operate by
checking if the distribution of the event values has changed. If so, a potential
anomaly has been detected. The returned score is an indication of the confidence
level of that anomaly. As an internal optimization, **ANOMALYDETECTION** computes
the anomaly score of an event based on *d* to *2d* worth of events, where *d* is
the specified detection window size.

**ANOMALYDETECTION** expects the input time series to be uniform. An event stream
can be made uniform by aggregating over a tumbling or hopping window. In
scenarios where the gap between events is always smaller than the aggregation
window, a tumbling window is sufficient to make the time series uniform. When
the gap can be larger, the gaps can be filled by repeating the last value using
a hopping window. Both these scenarios can be handled by the example that
follows. Currently, the `FillInMissingValuesStep` step cannot be skipped. Not
having this step will result in a compilation error.

## Performance Guidance

- Use 6 SU for jobs. 
- Send events at least 1 second apart.
- A non-partitioned query using the **ANOMALYDETECTION** function can produce results with a computation latency of about 25ms on average.
- The latency experienced by a partitioned query varies slightly with the number of partitions, as the number of computations is higher. However, the latency is about the same as the non-partitioned case for a comparable total number of events across all partitions.
- While reading non-real-time data, a large amount of data is ingested quickly. Processing this data is currently significantly slower. The latency in such scenarios was found to increase linearly with the number of data points in the window rather than the window size or event interval per se. To reduce the latency in non-real-time cases, consider using a smaller window size. Alternatively, consider starting your job from the current time. A few examples of latencies in a non-partitioned query: 
    - 60 data points in the detection window can result in a latency of 10 seconds with a throughput of 3MBps. 
    - At 600 data points, the latency can reach about 80 seconds with a throughput of 0.4MBps.

## Example

The following query can be used to output an alert if an anomaly is detected.
When the input stream is not uniform, the aggregation step can help transform it
into a uniform time series. The example uses **AVG** but the specific type of
aggregation depends on the user scenario. Furthermore, when a time series has
gaps greater than the aggregation window, there will be no events in the time
series to trigger anomaly detection (as per sliding window semantics). As a
result, the assumption of uniformity will be broken when the next event does
arrive. In such situations, we need a way of filling in the gaps in the time
series. One possible approach is to take the last event in every hop window, as
shown below.

As noted before, do not skip the `FillInMissingValuesStep` step for now. Omitting that step will result in a compilation error.

    WITH AggregationStep AS 
    (
         SELECT
               System.Timestamp as tumblingWindowEnd,

               AVG(value) as avgValue

         FROM input
         GROUP BY TumblingWindow(second, 5)
    ),

    FillInMissingValuesStep AS
    (
          SELECT
                System.Timestamp AS hoppingWindowEnd,

                TopOne() OVER (ORDER BY tumblingWindowEnd DESC) AS lastEvent

         FROM AggregationStep
         GROUP BY HOPPINGWINDOW(second, 300, 5)

    ),

    AnomalyDetectionStep AS
    (

          SELECT
                hoppingWindowEnd,
                lastEvent.tumblingWindowEnd as lastTumblingWindowEnd,
                lastEvent.avgValue as lastEventAvgValue,
                system.timestamp as anomalyDetectionStepTimestamp,

                ANOMALYDETECTION(lastEvent.avgValue) OVER (LIMIT DURATION(hour, 1)) as
                scores

          FROM FillInMissingValuesStep
    )

    SELECT
          alert = 1,
          hoppingWindowEnd,
          lastTumblingWindowEnd,
          lastEventAvgValue,
          anomalyDetectionStepTimestamp,
          scores

    INTO output

    FROM AnomalyDetectionStep

    WHERE

        CAST(GetRecordPropertyValue(scores, 'BiLevelChangeScore') as float) \>= 3.25

        OR CAST(GetRecordPropertyValue(scores, 'SlowPosTrendScore') as float) \>=
        3.25

       OR CAST(GetRecordPropertyValue(scores, 'SlowNegTrendScore') as float) \>=
       3.25

## References

* [Anomaly Detection – Using Machine Learning to Detect Abnormalities in Time Series Data](https://blogs.technet.microsoft.com/machinelearning/2014/11/05/anomaly-detection-using-machine-learning-to-detect-abnormalities-in-time-series-data/)
* [Machine Learning Anomaly Detection API](https://docs.microsoft.com/en-gb/azure/machine-learning/machine-learning-apps-anomaly-detection-api)
* [Time Series Anomaly Detection](https://msdn.microsoft.com/library/azure/mt775197.aspx)

## Get support
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureStreamAnalytics).

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

