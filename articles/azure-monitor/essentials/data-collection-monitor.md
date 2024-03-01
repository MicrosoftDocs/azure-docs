---
author: Ivan Varnitski
ms.date: 02/29/2024
---

# Monitor and troubleshoot data collection in Azure Monitor
This article provides detailed metrics and logs that you can use to monitor performance and troubleshoot any issues related to data collection in Azure Monitor. This telemetry is currently available for data collection scenarios defined by a [data collection rules (DCR)](./data-collection-rule-overview.md) such as Azure Monitor agent and Logs ingestion API.

This includes:

- Logs ingested using Log Ingestion API
- Logs collected using Azure Monitor Agent (AMA)
- Logs collected by legacy MMA agent and platform logs, when an ingestion-time transformation is set up for them.

> [!IMPORTANT]
> This article only refers to data collection scenarios that use DCRs. See the documentation for other scenarios for any monitoring and troubleshooting information that may be available.

DCR diagnostic features include metrics and error logs emitted during log processing. [DCR metrics](#dcr-metrics) provide information about the volume of data being ingested, the number and nature of any processing errors, and statistics related to data transformation. [DCR error logs](#dcr-metrics) are generated any time data processing is not successful and the data doesn’t reached its destination.

## DCR Error Logs

Error logs are generated when data reaches the Azure Monitor ingestion pipeline but fails to reach its destination. Examples of error conditions include:

- Log delivery errors
- [Transformation](./data-collection-transformations.md) errors where the structure of the logs make the transformation KQL invalid
- Log Ingestion API calls:
  - with any HTTP response other than 200/202
  - with payload containing malformed data
  - with payload over any [ingestion limits](/azure/azure-monitor/service-limits#logs-ingestion-api)
  - throttling due to overage of API call limits

To avoid excessive logging of persistent errors related to the same data flow, some errors will be logged only a limited number of times each hour followed by a summary error message. The error is then muted until the end of the hour. The number of times a given error is logged may very depending on the region where DCR is deployed. 

Some log ingestion errors will not be logged because they can't be associated with a DCR. The following errors may not be logged:

- Failures caused by malformed call URI (HTTP response code 404)
- Certain internal server errors (HTTP response code 500)

### Enable DCR error logs
DCR error logs are implemented as [resource logs](./resource-logs.md) in Azure Monitor. Enable log collection by creating a [diagnostic setting](./diagnostic-settings.md) for the DCR. Each DCR will require its own diagnostic setting.

See [Create diagnostic settings in Azure Monitor](./create-diagnostic-settings.md) for the detailed process. Select **Send to Log Analytics workspace** as the destination and select a workspace. You may want to select the same workspace that's used by the DCR, or you may want to consolidate all of your error logs in a single workspace.

### Retrieve DCR error logs
Error logs are written to the [DCRLogErrors](/azure/azure-monitor/reference/tables/dcrlogerrors) table in the Log Analytics workspace you specified in the diagnostic setting. 

## DCR Metrics
DCR metrics are collected automatically for all DCRs, and you can analyze them using [metrics explorer](./analyze-metrics.md) like the platform metrics for other Azure resources. *Input stream* is included as a dimension so if you have a DCR with multiple input streams, you can analyze each by [filtering or splitting](./analyze-metrics.md#use-dimension-filters-and-splitting). Some metrics include other dimensions as shown in the table below.


The following table describes the metrics collected for each DCR.

| Metric | Dimensions | Description |
|---|---|---|
| Logs Ingestion Bytes per Min | Input Stream | Total number of bytes received per minute. |
| Logs Ingestion Requests per Min | Input stream<br>HTTP response code | Number of calls received per minute  |
| Logs Rows Dropped per Min | Input stream | Number of log rows dropped during processing per minute. This includes rows dropped both due to filtering criteria in KQL transformation and rows dropped due to errors. |
| Logs Rows Received per Min | Input stream | Number of log rows received for processing per minute. |
| Logs Transformation Duration per Min | Input stream | Average KQL transformation runtime per minute. Represents KQL transformation code efficiency. Data flows with longer transformation run time can experience delays in data processing and greater data latency. |
| Logs Transformation Errors per Min | Input stream<br>Error type | Number of processing errors encountered per minute |

## Alerts

- Error count
- Error logs
- Sudden changes of rows dropped
- Number of API calls approaching service limits.

## Troubleshooting common issues

| Symptom | Signals to examine | Troubleshooting procedure |
|---|---|---|
| I'm sending custom logs using Logs ingestion API, but nothing appears in the destination Log Analytics workspace | `Log transformation errors per minute`<br>`DCRLogErrors` | 1. Enable DCR error logging.<br>2. Examine `DCRLogErrors` for common ingestion errors.<br>3. Correct identified issues.<br>4. If no errors found in `DCRLogErrors`, move to the next troubleshooting step. |
| | `Logs Ingestion Bytes per Min`<br>`Logs Rows Received per Min`<br>`Logs Rows Dropped per Min`. | 1. Examine received metrics to ensure the data is actually sent and accepted for processing.<br>2. Examine rows dropped metric. If all rows are dropped, determine whether the filtering criteria set in the KQL transformation work as expected. |
| I'm sending custom logs using Logs ingestion API or collecting logs using AMA, but some logs I am sending do not show up in the destination LA workspace. | Bytes received per minute<br>Log rows received per minute | Ensure that missing logs were indeed ingested.<br> Examine Bytes/Rows received metrics for input stream and timeline of interest and determine, whether Logs ingestion API calls or AMA collection events did happen for them.<br>If respective events were found, or if it is impossible to determine, whether or not they are present, proceed to the next step. |
| | Log rows dropped per minute<br>Log transformation errors per minute | If the rows were dropped during processing, check that log rows under consideration were not dropped due to filtering criteria set in KQL transformation.If transformation errors were present at the same time the log rows were dropped, proceed to the next step. |
| | DCRErrorLogs | Enable DCR error logging.Examine DCRErrorLogs for transformation errors around the time of ingestion or collection of data. If relevant log entries found, correct problems in KQL transformation or data structure. |

## Monitoring your log ingestion

The following signals could be useful for monitoring the health of your log collection with DCRs. Alerts could be set up based on the conditions described below.

| **Signal** | **Possible cause, suggested action** |
|---|---|
| New entries in** **DCRErrorLogs** **or  sudden change in Log Transform Errors metric** | |
| Sudden change in Bytes per minute metric** | |
| Sudden change in Buter per minute to Rows per minute ratio** | Changes in the structure of logs sent. It might be useful to examine the changes to make sure the data is properly processed with KQL transformation |
| Sudden change in Rows dropped per minute** | Changes in the structure of logs sent affect the efficiency of log filtering criteria set in KQL transformation. It might be usefule to examine the changes to make sure the data is properly processed with KQL transformation |
| Bytes per minute or Calls per minute metric approaching Log Ingestion API service limits for maximum data sent/ API calls per minute per DCR | Examine and optimize your DCR configuration to avoid throttling. |

1. Problems with Log Ingestion API setup, typically related to data ingestion: authentication, access to DCR/DCE, call payload issues;
2. Changes in data structure causing KQL transformation failures;
3. Changes in data destination configuration, causing data delivery failures.
4. Changes in configuration of log ingestion on the client side, or AMA settings
5. Changes in structure of logs sent

