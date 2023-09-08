---
title: "Citrix ADC (former NetScaler) connector for Microsoft Sentinel"
description: "Learn how to install the connector Citrix ADC (former NetScaler) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Citrix ADC (former NetScaler) connector for Microsoft Sentinel

The [Citrix ADC (former NetScaler)](https://www.citrix.com/products/citrix-adc/) data connector provides the capability to ingest Citrix ADC logs into Microsoft Sentinel. If you want to ingest Citrix WAF logs into Microsoft Sentinel, refer this [documentation](/azure/sentinel/data-connectors/citrix-waf-web-app-firewall).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Event Types**
   ```kusto
CitrixADCEvent
 
   | where isnotempty(EventType)
    
   | summarize count() by EventType
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  1. This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias CitrixADCEvent and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Citrix%20ADC/Parsers/CitrixADCEvent.txt), this function maps Citrix ADC (former NetScaler) events to Advanced Security Information Model [ASIM](/azure/sentinel/normalization). The function usually takes 10-15 minutes to activate after solution installation/update. 

> [!NOTE]
   >  2. This parser requires a watchlist named **`Sources_by_SourceType`** with fields **`SourceType`** and **`Source`**. To create this watchlist and populate it with SourceType and Source data, follow the instructions [here](/azure/sentinel/normalization-manage-parsers#configure-the-sources-relevant-to-a-source-specific-parser). 

> The SourceType value for CitrixADC is **`CitrixADC`**.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.
 1. Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
 2. Select **Apply below configuration to my machines** and select the facilities and severities.
 3.  Click **Save**.


3. Configure Citrix ADC to forward logs via Syslog

3.1 Navigate to **Configuration tab > System > Auditing > Syslog > Servers tab**

 3.2 Specify **Syslog action name**.

 3.3 Set IP address of remote Syslog server and port.

 3.4 Set **Transport type** as **TCP** or **UDP** depending on your remote Syslog server configuration.

 3.5 You can refer Citrix ADC (former NetScaler) [documentation](https://docs.netscaler.com/) for more details.

4. Check logs in Microsoft Sentinel

Open Log Analytics to check if the logs are received using the Syslog schema.

>**NOTE:** It may take up to 15 minutes before new logs will appear in Syslog table.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-citrixadc?tab=Overview) in the Azure Marketplace.
