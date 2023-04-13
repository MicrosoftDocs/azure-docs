---
title: "Elastic Agent (Standalone) connector for Microsoft Sentinel"
description: "Learn how to install the connector Elastic Agent (Standalone) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Elastic Agent (Standalone) connector for Microsoft Sentinel

The [Elastic Agent](https://www.elastic.co/security) data connector provides the capability to ingest Elastic Agent logs, metrics, and security data into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ElasticAgentLogs_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Devices**
   ```kusto
ElasticAgentEvent
 
   | summarize count() by DvcIpAddr
 
   | top 10 by count_
   ```



## Prerequisites

To integrate with Elastic Agent (Standalone) make sure you have: 

- **Include custom pre-requisites if the connectivity requires - else delete customs**: Description for any custom pre-requisite


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**ElasticAgentEvent**](https://aka.ms/sentinel-ElasticAgent-parser) which is deployed with the Microsoft Sentinel Solution.


> [!NOTE]
   >  This data connector has been developed using **Elastic Agent 7.14**.

1. Install and onboard the agent for Linux or Windows

Install the agent on the Server where the Elastic Agent logs are forwarded.

> Logs from Elastic Agents deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.




2. Configure Elastic Agent (Standalone)

[Follow the instructions](https://www.elastic.co/guide/en/fleet/current/elastic-agent-configuration.html) to configure Elastic Agent to output to Logstash

3. Configure Logstash to use Microsoft Logstash Output Plugin

Follow the steps to configure Logstash to use microsoft-logstash-output-azure-loganalytics plugin:

3.1) Check if the plugin is already installed:
> ./logstash-plugin list | grep 'azure-loganalytics'
**(if the plugin is installed go to step 3.3)**

3.2) Install plugin:
> ./logstash-plugin install microsoft-logstash-output-azure-loganalytics

3.3) [Configure Logstash](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/microsoft-logstash-output-azure-loganalytics) to use the plugin

4. Validate log ingestion

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using custom table specified in step 3.3 (e.g. ElasticAgentLogs_CL).

>It may take about 30 minutes until the connection streams data to your workspace.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-elasticagent?tab=Overview) in the Azure Marketplace.
