---
title: "Squid Proxy connector for Microsoft Sentinel"
description: "Learn how to install the connector Squid Proxy to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Squid Proxy connector for Microsoft Sentinel

The [Squid Proxy](http://www.squid-cache.org/) connector allows you to easily connect your Squid Proxy logs with Microsoft Sentinel. This gives you more insight into your organization's network proxy traffic and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | SquidProxy_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**Top 10 Proxy Results**
   ```kusto
SquidProxy 
 
   | where isnotempty(ResultCode) 
 
   | summarize count() by ResultCode 
 
   | top 10 by count_
   ```

**Top 10 Peer Host**
   ```kusto
SquidProxy 
 
   | where isnotempty(PeerHost) 
 
   | summarize count() by PeerHost 

   | top 10 by count_
   ```



## Vendor installation instructions


**NOTE:** This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias Squid Proxy and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/SquidProxy/Parsers/SquidProxy.txt), on the second line of the query, enter the hostname(s) of your SquidProxy device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux or Windows

Install the agent on the Squid Proxy server where the logs are generated.

> Logs from Squid Proxy deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.




2. Configure the logs to be collected

Configure the custom log directory to be collected



1. Select the link above to open your workspace advanced settings 
2. From the left pane, select **Data**, select **Custom Logs** and click **Add+**
3. Click **Browse** to upload a sample of a Squid Proxy log file(e.g. access.log or cache.log). Then, click **Next >**
4. Select **New line** as the record delimiter and click **Next >**
5. Select **Windows** or **Linux** and enter the path to Squid Proxy logs. Default paths are: 
 - **Windows** directory: `C:\Squid\var\log\squid\*.log`
 - **Linux** Directory:  `/var/log/squid/*.log` 
6. After entering the path, click the '+' symbol to apply, then click **Next >** 
7. Add **SquidProxy_CL** as the custom log Name and click **Done**



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-squidproxy?tab=Overview) in the Azure Marketplace.
