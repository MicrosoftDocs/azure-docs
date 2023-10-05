#### Determine memory usage 

Under **Monitoring**, select **Logs (Analytics)**, then copy the following telemetry query and paste it into the query window and select **Run**. This query returns the total memory usage at each sampled time.

```
performanceCounters
| where name == "Private Bytes"
| project timestamp, name, value
```

The results look like the following example:

| timestamp \[UTC\]          | name          | value       |
|----------------------------|---------------|-------------|
| 9/12/2019, 1:05:14\.947 AM | Private Bytes | 209,932,288 |
| 9/12/2019, 1:06:14\.994 AM | Private Bytes | 212,189,184 |
| 9/12/2019, 1:06:30\.010 AM | Private Bytes | 231,714,816 |
| 9/12/2019, 1:07:15\.040 AM | Private Bytes | 210,591,744 |
| 9/12/2019, 1:12:16\.285 AM | Private Bytes | 216,285,184 |
| 9/12/2019, 1:12:31\.376 AM | Private Bytes | 235,806,720 |

#### Determine duration 

Azure Monitor tracks metrics at the resource level, which for Functions is the function app. Application Insights integration emits metrics on a per-function basis. Here's an example analytics query to get the average duration of a function:

```
customMetrics
| where name contains "Duration"
| extend averageDuration = valueSum / valueCount
| summarize averageDurationMilliseconds=avg(averageDuration) by name
```

| name                       | averageDurationMilliseconds |
|----------------------------|-----------------------------|
| QueueTrigger AvgDurationMs | 16\.087                     |
| QueueTrigger MaxDurationMs | 90\.249                     |
| QueueTrigger MinDurationMs | 8\.522                      |
