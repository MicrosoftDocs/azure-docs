---
title: Azure Application Insights | Microsoft Docs
description: Correlate data from Application Insights to other datasets, such as data enrichment or lookup tables, non-Application Insights data sources, and custom data.
ms.topic: conceptual
author: eternovsky
ms.author: evternov
ms.date: 08/08/2018

ms.reviewer: mbullwin
---

# Correlating Application Insights data with custom data sources

Application Insights collects several different data types: exceptions, traces, page views, and others. While this is often sufficient to investigate your application's performance, reliability, and usage, there are cases when it is useful to correlate the data stored in Application Insights to other completely custom datasets.

Some situations where you might want custom data include:

- Data enrichment or lookup tables: for example, supplement a server name with the owner of the server and the lab location in which it can be found 
- Correlation with non-Application Insights data sources: for example, correlate data about a purchase on a web-store with information from your purchase-fulfillment service to determine how accurate your shipping time estimates were 
- Completely custom data: many of our customers love the query language and performance of the Azure Monitor log platform that backs Application Insights, and want to use it to query data that is not at all related to Application Insights. For example, to track the solar panel performance as part of a smart home installation as outlined [here](https://www.catapultsystems.com/blogs/using-log-analytics-and-a-special-guest-to-forecast-electricity-generation/).

## How to correlate custom data with Application Insights data 

Since Application Insights is backed by the powerful Azure Monitor log platform, we are able to use the full power of Azure Monitor to ingest the data. Then, we will write queries using the "join" operator that will correlate this custom data with the data available to us in Azure Monitor logs. 

## Ingesting data

In this section, we will review how to get your data into Azure Monitor logs.

If you don't already have one, provision a new Log Analytics workspace by following [these instructions](../learn/quick-collect-azurevm.md) through and including the "create a workspace" step.

To start sending log data into Azure Monitor. Several options exist:

- For a synchronous mechanism, you can either directly call the [data collector API](https://docs.microsoft.com/azure/log-analytics/log-analytics-data-collector-api) or use our Logic App connector – simply look for "Azure Log Analytics" and pick the "Send Data" option:

  ![Screenshot choose and action](./media/custom-data-correlation/01-logic-app-connector.png)  

- For an asynchronous option, use the Data Collector API to build a processing pipeline. See [this article](https://docs.microsoft.com/azure/log-analytics/log-analytics-create-pipeline-datacollector-api) for details.

## Correlating data

Application Insights is based on the Azure Monitor log platform. We can therefore use [cross-resource joins](https://docs.microsoft.com/azure/log-analytics/log-analytics-cross-workspace-search) to correlate any data we ingested into Azure Monitor with our Application Insights data.

For example, we can ingest our lab inventory and locations into a table called "LabLocations_CL" in a Log Analytics workspace called "myLA". If we then wanted to review our requests tracked in Application Insights app called "myAI" and correlate the machine names that served the requests to the locations of these machines stored in the previously mentioned custom table, we can run the following query from either the Application Insights or Azure Monitor context:

```
app('myAI').requests
| join kind= leftouter (
    workspace('myLA').LabLocations_CL
    | project Computer_S, Owner_S, Lab_S
) on $left.cloud_RoleInstance == $right.Computer
```

## Next Steps

- Check out the [Data Collector API](https://docs.microsoft.com/azure/log-analytics/log-analytics-data-collector-api) reference.
- For more information on [cross-resource joins](https://docs.microsoft.com/azure/log-analytics/log-analytics-cross-workspace-search).
