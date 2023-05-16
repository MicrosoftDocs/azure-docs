---
title: "Dynatrace Runtime Vulnerabilities connector for Microsoft Sentinel"
description: "Learn how to install the connector Dynatrace Runtime Vulnerabilities to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Dynatrace Runtime Vulnerabilities connector for Microsoft Sentinel

This connector uses the [Dynatrace Security Problem REST API](https://www.dynatrace.com/support/help/dynatrace-api/environment-api/application-security/security-problems) to ingest detected runtime vulnerabilities into Microsoft Sentinel Log Analytics.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | {{graphQueriesTableName}}<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Dynatrace](https://www.dynatrace.com/services-support/) |

## Query samples

**All Vulnerability Events**
   ```kusto
DynatraceSecurityProblems

   | summarize  arg_max(LastUpdatedTimeStamp, *) by SecurityProblemId

   |  take 10
   ```

**All Third-Party Vulnerability Events**
   ```kusto
DynatraceSecurityProblems

   | where VulnerabilityType == "THIRD_PARTY"

   | summarize  arg_max(LastUpdatedTimeStamp, *) by SecurityProblemId

   |  take 10
   ```

**All Code-level Vulnerability Events**
   ```kusto
DynatraceSecurityProblems

   | where VulnerabilityType == "CODE_LEVEL"

   | summarize  arg_max(LastUpdatedTimeStamp, *) by SecurityProblemId

   |  take 10
   ```

**All Runtime Vulnerability Events**
   ```kusto
DynatraceSecurityProblems

   | where VulnerabilityType == "RUNTIME"

   | summarize  arg_max(LastUpdatedTimeStamp, *) by SecurityProblemId

   |  take 10
   ```

**Critical Vulnerability Events**
   ```kusto
DynatraceSecurityProblems

   | where DAVISRiskLevel == "CRITICAL"

   | summarize  arg_max(LastUpdatedTimeStamp, *) by SecurityProblemId

   | take 10
   ```

**High Vulnerability Events**
   ```kusto
DynatraceSecurityProblems

   | where DAVISRiskLevel == "HIGH"

   | summarize  arg_max(LastUpdatedTimeStamp, *) by SecurityProblemId

   | take 10
   ```

**Count Vulnerability Events by Technology and Vulnerability**
   ```kusto
DynatraceSecurityProblems

   | summarize  arg_max(LastUpdatedTimeStamp, *) by SecurityProblemId

   | summarize count() by Technology, ExternalVulnerabilityId

   | take 10
   ```



## Prerequisites

To integrate with Dynatrace Runtime Vulnerabilities make sure you have: 

- **Dynatrace tenant (ex. xyz.dynatrace.com)**: You need a valid Dynatrace tenant with [Application Security](https://www.dynatrace.com/support/help/how-to-use-dynatrace/application-security) enabled, learn more about the [Dynatrace platform](https://www.dynatrace.com/).
- **Dynatrace Access Token**: You need a Dynatrace Access Token, the token should have ***Read security problems*** (securityProblems.read) scope.


## Vendor installation instructions

Dynatrace Vulnerabilities Events to Microsoft Sentinel

Configure and Enable Dynatrace [Application Security](https://www.dynatrace.com/support/help/how-to-use-dynatrace/application-security). 
 Follow [these instructions](https://www.dynatrace.com/support/help/get-started/access-tokens#create-api-token) to generate an access token.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/dynatrace.dynatrace_azure_sentinel?tab=Overview) in the Azure Marketplace.
