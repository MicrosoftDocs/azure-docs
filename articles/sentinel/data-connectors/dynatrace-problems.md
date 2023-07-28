---
title: "Dynatrace Problems connector for Microsoft Sentinel"
description: "Learn how to install the connector Dynatrace Problems to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Dynatrace Problems connector for Microsoft Sentinel

This connector uses the [Dynatrace Problem REST API](https://www.dynatrace.com/support/help/dynatrace-api/environment-api/problems-v2) to ingest problem events into Microsoft Sentinel Log Analytics

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | {{graphQueriesTableName}}<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Dynatrace](https://www.dynatrace.com/services-support/) |

## Query samples

**All Problem Events**
   ```kusto
DynatraceProblems

   | summarize  arg_max(StartTime, *) by ProblemId

   |  take 10
   ```

**All Open Problem Events**
   ```kusto
DynatraceProblems

   | summarize  arg_max(EndTime, *) by ProblemId

   | where isnull(EndTime) or Status == "OPEN"

   |  take 10
   ```

**Error Problem Events**
   ```kusto
DynatraceProblems

   | where SeverityLevel == "ERROR"

   | summarize  arg_max(StartTime, *) by ProblemId

   |  take 10
   ```

**Availability Problem Events**
   ```kusto
DynatraceProblems

   | where SeverityLevel == "AVAILABILITY"

   | summarize  arg_max(StartTime, *) by ProblemId

   |  take 10
   ```

**Performance Problem Events**
   ```kusto
DynatraceProblems

   | where SeverityLevel == "PERFORMANCE"

   | summarize  arg_max(StartTime, *) by ProblemId

   |  take 10
   ```

**Count Problem Events by impact level**
   ```kusto
DynatraceProblems

   | summarize  arg_max(StartTime, *) by ProblemId

   | summarize count() by ImpactLevel

   | take 10
   ```

**Count Problem Events by severity level**
   ```kusto
DynatraceProblems

   | summarize  arg_max(StartTime, *) by ProblemId

   | summarize count() by SeverityLevel

   | take 10
   ```



## Prerequisites

To integrate with Dynatrace Problems make sure you have: 

- **Dynatrace tenant (ex. xyz.dynatrace.com)**: You need a valid Dynatrace Tenant, to learn more about the Dynatrace platform [Start your free trial](https://www.dynatrace.com/trial).
- **Dynatrace Access Token**: You need a Dynatrace Access Token, the token should have ***Read problems*** (problems.read) scope.


## Vendor installation instructions

Dynatrace Problem Events to Microsoft Sentinel

Follow [these instructions](https://www.dynatrace.com/support/help/get-started/access-tokens#create-api-token) to generate an access token.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/dynatrace.dynatrace_azure_sentinel?tab=Overview) in the Azure Marketplace.
