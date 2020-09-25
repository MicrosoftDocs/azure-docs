---
title: Troubleshoot Log analytics issues using operation table
description: 
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/19/2020

---

# Monitor issues with Azure Monitor Logs
This article describes how to monitor the health of your Log Analytics workspace using data in the [Operation](/azure-monitor/reference/tables/operation) table. This table is included in every Log Analytics workspace and contains error and warnings that occur in your workspace. You can create alerts based on this data to be proactively notified when there are any important incidents in your workspace.

## _LogsOperation function
Each workspace has a function called *_LogsOperation* that's based on the *Operation* table. 


## Table structure
See [Azure Monitor data reference](/azure-monitor/reference/tables/operation) for a listing and description of the properties of the **Operations** table.


## Query samples
The following sections provide queries that you can use to troubleshoot different conditions.

### Check if a solution was deployed
You may find that a particular solution doesn't appear to be deployed to certain agents. First check if the solution any changes were made to the solution targetting. 

```kusto
Operation
| where OperationCategory == 'ConfigurationScope'
```
You can also check if there were any errors in the solution targetting.

```kusto
Operation
| where OperationCategory == 'ConfigurationScope' and OperationStatus == "InvalidSyntax"
```

### Check if daily collection cap was reached
If you have a workspace using the Free pricing or if they have a customized daily cap configured, you may to validate if the data cap was reached blocking any additional data collection for the day.

```kusto
Operation 
| where TimeGenerated > ago(1d)
| where OperationCategory == "Data Collection Status" and OperationStatus == "Warning" 
| project Detail, TimeGenerated
```

### Validate if custom fields limit is being reached
If you're collecting resource logs from a resource that writes to the AzureDiagnostics table, it could fail if the table reaches its 500 column limit. 

It is common for customers to notice that AzureDiagnotics data stopped ingesting or is missing in the workspace. In some cases, this might be due to the limit we have on the AzureDiagnotics table that is 500 custom field limit.

```kusto
Operation | where OperationStatus == "Failed"
```

### Using correlation ID
Some tables will use a **correlationID** property to relate records that are part of the same operation. Following is an example for the **ActivityFailedEvent** table.

```kusto
let startDateTime = todatetime("2020-06-02 20:00:00.0");
let endDateTime = todatetime("2020-06-02 21:30:00.0");
let correlationID = '86738058-842f-4364-b0a0-e398731e1b18';
ActivityFailedEvent | where TIMESTAMP between (startDateTime .. endDateTime)
| where properties has correlationID
| parse properties with * "DataTypeId=["DataTypeId"]" *
| parse properties with * " ResourceId=[" resourceId "]" *
| parse resourceId with * "/PROVIDERS/" providerName "/" *
| parse properties with * "Fact="TableName"," *
| project TIMESTAMP, DataTypeId, resourceId, providerName, TableName, exception
```

## Alerts
There are a variety of scenarios where you may want to create an alert rule to proactively notify you of particular errors or to also be notified when an important successful event occurs. [Create a log alert rule](../platform/alerts-log.md) that uses a log query with the **Operations** table similar to the following which alerts if there is an error writing a record to the workspace:

```json
Operation 
| where Type == "Operation"
| where OperationCategory == "JSON handler" 
| where SourceSystem == "OpsManager"
| where Solution == "RestAPI"
| where OperationKey == "MICROSOFTWEB_APPSERVICEHTTPLOGS"
| where OperationStatus == "Failed"
```

The following table gives the values for different properties of the **Operations** table to alert on different conditions. Modify the values in the above query to create alert rules for these conditions.


| OperationCategory | SourceSystem | Solution | OperationKey | Type | OperationStatus | Example Detail |
|:---|:---|:---|:---|:---|:---|:---|
| JSON handler | OpsManager | RestAPI | MICROSOFTWEB_APPSERVICEHTTPLOGS | Operation | Failed | Message is being dropped due to incorrect format at lineOffset: -1. Exception message: After parsing a value an unexpected character was encountered: ". Path 'records[0].properties.Result', line 1, position 505. |
| OMS Auditd Plugin issue | OpsManager | Security | | Operation | Error | Auoms service is running, but auomscollect is not running<br>OMS Auditd Plugin needs to be installed |
| Ingestion | OpsManager | | AzureDiagnostics | Operation | Failed | Data of type AzureDiagnostics was dropped: The number of custom fields 501 is above the limit of 500 fields per data type. See https://aka.ms/AA593as to find instructions for removing unnecessary custom fields for this type. |
| Azure Activity Log Collection | OpsManager | AzureActivity | AzureSubscription-00000000-0000-0000-0000-000000000000 | Operation | Failed | The subscription '00000000-0000-0000-0000-000000000000' could not be found. |
| OMS Agent for Linux issue | OpsManager | LogManagement | | Operation | Warning | Two successive configuration applications from OMS Settings failed – please report issue to github.com/Microsoft/PowerShell-DSC-for-Linux/issues |
| Active Directory Group Collection | OpsManager | | | Operation | Failed | The local computer is not joined to a domain or the domain cannot be contacted. |
| Active Directory Group Collection | OpsManager | | | Operation | Succeeded | |
| WSUS Client Group Collection | OpsManager | | | Operation | Succeeded | |
| WSUS Server Group Collection | OpsManager | | | Operation | Succeeded | |
| ConfigurationScope | | | | | InvalidSyntax | |
| Data Collection Status | | | | | Warning | |


## Next steps
