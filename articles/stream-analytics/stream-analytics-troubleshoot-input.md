---
title: Troubleshooting Inputs for Azure Stream Analytics
description: This article describes techniques to troubleshoot your input connections in Azure Stream Analytics jobs.
author: an-emma
ms.author: raan
ms.service: stream-analytics
ms.topic: troubleshooting
ms.date: 01/17/2023
ms.custom: seodec18
---

# Troubleshoot input connections

This article describes common issues with Azure Stream Analytics input connections, how to troubleshoot input issues, and how to correct the issues. Many troubleshooting steps require resource logs to be enabled for your Stream Analytics job. If you do not have resource logs enabled, see [Troubleshoot Azure Stream Analytics by using resource logs](stream-analytics-job-diagnostic-logs.md).

## Input events not received by job 

1.  Test your input and output connectivity. Verify connectivity to inputs and outputs by using the **Test Connection** button for each input and output.

2.  Examine your input data.

    1. Use the [**Sample Data**](./stream-analytics-test-query.md) button for each input. Download the input sample data.
        
    1. Inspect the sample data to understand the schema and [data types](/stream-analytics-query/data-types-azure-stream-analytics).
    
    1. Check [Event Hub metrics](../event-hubs/event-hubs-metrics-azure-monitor.md) to ensure events are being sent. Message metrics should be greater than zero if Event Hubs is receiving messages.

3.  Ensure that you have selected a time range in the input preview. Choose **Select time range**, and then enter a sample duration before testing your query.

## Malformed input events causes deserialization errors 

Deserialization issues are caused when the input stream of your Stream Analytics job contains malformed messages. For example, a malformed message could be caused by a missing parenthesis, or brace, in a JSON object or an incorrect timestamp format in the time field. 
 
When a Stream Analytics job receives a malformed message from an input, it drops the message and notifies you with a warning. A warning symbol is shown on the **Inputs** tile of your Stream Analytics job. The following warning symbol exists as long as the job is in running state:

![Azure Stream Analytics inputs tile](media/stream-analytics-malformed-events/stream-analytics-inputs-tile.png)

Enable resource logs to view the details of the error and the message (payload) that caused the error. There are multiple reasons why deserialization errors can occur. For more information regarding specific deserialization errors, see [Input data errors](data-errors.md#input-data-errors). If resource logs are not enabled, a brief notification will be available in the Azure portal.

![Input details warning notification](media/stream-analytics-malformed-events/warning-message-with-offset.png)

In cases where the message payload is greater than 32 KB or is in binary format, run the CheckMalformedEvents.cs code available in the [GitHub samples repository](https://github.com/Azure/azure-stream-analytics/tree/master/Samples/CheckMalformedEventsEH). This code reads the partition ID, offset, and prints the data that's located in that offset. 

Other common reasons that result in input deserialization errors are:
1. Integer column having a value greater than 9223372036854775807.
2. Strings instead of array of objects or line separated objects. Valid example : *[{'a':1}]*. Invalid example : *"'a' :1"*. 
3. Using Event Hub capture blob in Avro format as input in your job.
4. Having two columns in a single input event that differ only in case. Example: *column1* and *COLUMN1*.

## Partition count changes
Partition count of Event Hub can be changed. The Stream Analytics job needs to be stopped and started again if the partition count of Event Hub is changed. 

The following errors are shown when the partition count of Event Hub is changed when the job is running.
Microsoft.Streaming.Diagnostics.Exceptions.InputPartitioningChangedException

## Job exceeds maximum Event Hub receivers

A best practice for using Event Hubs is to use multiple consumer groups for job scalability. The number of readers in the Stream Analytics job for a specific input affects the number of readers in a single consumer group. The precise number of receivers is based on internal implementation details for the scale-out topology logic and is not exposed externally. The number of readers can change when a job is started or during job upgrades.

The following error messages are shown when the number of receivers exceeds the maximum. The error message includes a list of existing connections made to Event Hub under a consumer group. The tag `AzureStreamAnalytics` indicates that the connections are from Azure Streaming Service.

```
The streaming job failed: Stream Analytics job has validation errors: Job will exceed the maximum amount of Event Hub Receivers.

The following information may be helpful in identifying the connected receivers: Exceeded the maximum number of allowed receivers per partition in a consumer group which is 5. List of connected receivers – 
AzureStreamAnalytics_c4b65e4a-f572-4cfc-b4e2-cf237f43c6f0_1, 
AzureStreamAnalytics_c4b65e4a-f572-4cfc-b4e2-cf237f43c6f0_1, 
AzureStreamAnalytics_c4b65e4a-f572-4cfc-b4e2-cf237f43c6f0_1, 
AzureStreamAnalytics_c4b65e4a-f572-4cfc-b4e2-cf237f43c6f0_1, 
AzureStreamAnalytics_c4b65e4a-f572-4cfc-b4e2-cf237f43c6f0_1.
```

> [!NOTE]
> When the number of readers changes during a job upgrade, transient warnings are written to audit logs. Stream Analytics jobs automatically recover from these transient issues.

### Add a consumer group in Event Hubs

To add a new consumer group in your Event Hubs instance, follow these steps:

1. Sign in to the Azure portal.

2. Locate your Event Hub.

3. Select **Event Hubs** under the **Entities** heading.

4. Select the Event Hub by name.

5. On the **Event Hubs Instance** page, under the **Entities** heading, select **Consumer groups**. A consumer group with name **$Default** is listed.

6. Select **+ Consumer Group** to add a new consumer group. 

   ![Add a consumer group in Event Hubs](media/stream-analytics-event-hub-consumer-groups/new-eh-consumer-group.png)

7. When you created the input in the Stream Analytics job to point to the Event Hub, you specified the consumer group there. **$Default** is used when none is specified. Once you create a new consumer group, edit the Event Hub input in the Stream Analytics job and specify the name of the new consumer group.

## Readers per partition exceeds Event Hubs limit

If your streaming query syntax references the same input Event Hub resource multiple times, the job engine can use multiple readers per query from that same consumer group. When there are too many references to the same consumer group, the job can exceed the limit of five and thrown an error. In those circumstances, you can further divide by using multiple inputs across multiple consumer groups using the solution described in the following section. 

Scenarios in which the number of readers per partition exceeds the Event Hubs limit of five include the following:

* Multiple SELECT statements: If you use multiple SELECT statements that refer to **same** event hub input, each SELECT statement causes a new receiver to be created.

* UNION: When you use a UNION, it's possible to have multiple inputs that refer to the **same** event hub and consumer group.

* SELF JOIN: When you use a SELF JOIN operation, it's possible to refer to the **same** event hub multiple times.

The following best practices can help mitigate scenarios in which the number of readers per partition exceeds the Event Hubs limit of five.

### Split your query into multiple steps by using a WITH clause

The WITH clause specifies a temporary named result set that can be referenced by a FROM clause in the query. You define the WITH clause in the execution scope of a single SELECT statement.

For example, instead of this query:

```SQL
SELECT foo 
INTO output1
FROM inputEventHub

SELECT bar
INTO output2
FROM inputEventHub 
…
```

Use this query:

```SQL
WITH data AS (
   SELECT * FROM inputEventHub
)

SELECT foo
INTO output1
FROM data

SELECT bar
INTO output2
FROM data
…
```

### Ensure that inputs bind to different consumer groups

For queries in which three or more inputs are connected to the same Event Hubs consumer group, create separate consumer groups. This requires the creation of additional Stream Analytics inputs.

### Create separate inputs with different consumer groups

You can create separate inputs with different consumer groups for the same Event Hub. The following UNION query is an example where *InputOne* and *InputTwo* refer to the same Event Hub source. Any query can have separate inputs with different consumer groups. The UNION query is only one example.

```sql
WITH 
DataOne AS 
(
SELECT * FROM InputOne 
),

DataTwo AS 
(
SELECT * FROM InputTwo 
),

SELECT foo FROM DataOne
UNION 
SELECT foo FROM DataTwo

```

## Readers per partition exceeds IoT Hub limit

Stream Analytics jobs use IoT Hub's built-in [Event Hub compatible endpoint](../iot-hub/iot-hub-devguide-messages-read-builtin.md) to connect and read events from IoT Hub. If your read per partition exceeds the limits of IoT Hub, you can use the [solutions for Event Hub](#readers-per-partition-exceeds-event-hubs-limit) to resolve it. You can create a consumer group for the built-in endpoint through IoT Hub portal endpoint session or through the [IoT Hub SDK](/rest/api/iothub/IotHubResource/CreateEventHubConsumerGroup).

## Get help

For further assistance, try our [Microsoft Q&A question page for Azure Stream Analytics](/answers/topics/azure-stream-analytics.html).

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](/rest/api/streamanalytics/)
