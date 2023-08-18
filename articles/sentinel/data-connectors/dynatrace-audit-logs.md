---
title: "Dynatrace Audit Logs connector for Microsoft Sentinel"
description: "Learn how to install the connector Dynatrace Audit Logs to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Dynatrace Audit Logs connector for Microsoft Sentinel

This connector uses the [Dynatrace Audit Logs REST API](https://www.dynatrace.com/support/help/dynatrace-api/environment-api/audit-logs) to ingest tenant audit logs into Microsoft Sentinel Log Analytics

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | {{graphQueriesTableName}}<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Dynatrace](https://www.dynatrace.com/services-support/) |

## Query samples

**All Audit Log Events**
   ```kusto
DynatraceAuditLogs

   | take 10
   ```

**User Login Events**
   ```kusto
DynatraceAuditLogs

   | where EventType == "LOGIN"
 and Category == "WEB_UI"
 
   | take 10
   ```

**Access Token Creation Events**
   ```kusto
DynatraceAuditLogs

   | where EventType == "CREATE"
 and Category == "TOKEN"
 
   | take 10
   ```



## Prerequisites

To integrate with Dynatrace Audit Logs make sure you have: 

- **Dynatrace tenant (ex. xyz.dynatrace.com)**: You need a valid Dynatrace Tenant, to learn more about the Dynatrace platform [Start your free trial](https://www.dynatrace.com/trial).
- **Dynatrace Access Token**: You need a Dynatrace Access Token, the token should have ***Read audit logs*** (auditLogs.read) scope.


## Vendor installation instructions

Dynatrace Audit Log Events to Microsoft Sentinel

Enable Dynatrace Audit [Logging](https://www.dynatrace.com/support/help/how-to-use-dynatrace/data-privacy-and-security/configuration/audit-logs#enable-audit-logging). 
 Follow [these instructions](https://www.dynatrace.com/support/help/get-started/access-tokens#create-api-token) to generate an access token.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/dynatrace.dynatrace_azure_sentinel?tab=Overview) in the Azure Marketplace.
