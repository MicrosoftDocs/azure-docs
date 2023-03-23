---
title: "Dynatrace Attacks connector for Microsoft Sentinel"
description: "Learn how to install the connector Dynatrace Attacks to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Dynatrace Attacks connector for Microsoft Sentinel

This connector uses the Dynatrace Attacks REST API to ingest detected attacks into Microsoft Sentinel Log Analytics

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | {{graphQueriesTableName}}<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Dynatrace](https://www.dynatrace.com/services-support/) |

## Query samples

**All Attack Events**
   ```kusto
DynatraceAttacks

   | summarize  arg_max(TimeStamp, *) by AttackId

   |  take 10
   ```

**All Exploited Attack Events**
   ```kusto
DynatraceAttacks

   | where State == "EXPLOITED"

   | summarize  arg_max(TimeStamp, *) by AttackId

   |  take 10
   ```

**Count Attacks by Type**
   ```kusto
DynatraceAttacks

   | summarize  arg_max(TimeStamp, *) by AttackId

   | summarize count() by AttackType

   | take 10
   ```



## Prerequisites

To integrate with Dynatrace Attacks make sure you have: 

- **Dynatrace tenant (ex. xyz.dynatrace.com)**: You need a valid Dynatrace tenant with [Application Security](https://www.dynatrace.com/support/help/how-to-use-dynatrace/application-security) enabled, learn more about the [Dynatrace platform](https://www.dynatrace.com/).
- **Dynatrace Access Token**: You need a Dynatrace Access Token, the token should have ***Read attacks*** (attacks.read) scope.


## Vendor installation instructions

Dynatrace Attack Events to Microsoft Sentinel

Configure and Enable Dynatrace [Application Security](https://www.dynatrace.com/support/help/how-to-use-dynatrace/application-security). 
 Follow [these instructions](https://www.dynatrace.com/support/help/get-started/access-tokens#create-api-token) to generate an access token.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/dynatrace.dynatrace_azure_sentinel?tab=Overview) in the Azure Marketplace.
