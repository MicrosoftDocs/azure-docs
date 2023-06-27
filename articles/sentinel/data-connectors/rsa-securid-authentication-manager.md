---
title: "RSA® SecurID (Authentication Manager) connector for Microsoft Sentinel"
description: "Learn how to install the connector RSA® SecurID (Authentication Manager) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 06/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# RSA® SecurID (Authentication Manager) connector for Microsoft Sentinel

The [RSA® SecurID Authentication Manager](https://www.securid.com/) data connector provides the capability to ingest [RSA® SecurID Authentication Manager events](https://community.rsa.com/t5/rsa-authentication-manager/rsa-authentication-manager-log-messages/ta-p/630160) into Microsoft Sentinel. Refer to [RSA® SecurID Authentication Manager documentation](https://community.rsa.com/t5/rsa-authentication-manager/getting-started-with-rsa-authentication-manager/ta-p/569582) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (RSASecurIDAMEvent)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Sources**
   ```kusto
RSASecurIDAMEvent
 
   | summarize count() by tostring(DvcHostname)
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**RSASecurIDAMEvent**](https://aka.ms/sentinel-rsasecuridam-parser) which is deployed with the Microsoft Sentinel Solution.


> [!NOTE]
   >  This data connector has been developed using RSA SecurID Authentication Manager version: 8.4 and 8.5

1. Install and onboard the agent for Linux or Windows

Install the agent on the Server where the RSA® SecurID Authentication Manager logs are forwarded.

> Logs from RSA® SecurID Authentication Manager Server deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.




2. Configure RSA® SecurID Authentication Manager event forwarding

Follow the configuration steps below to get RSA® SecurID Authentication Manager logs into Microsoft Sentinel.
1. [Follow these instructions](https://community.rsa.com/t5/rsa-authentication-manager/configure-the-remote-syslog-host-for-real-time-log-monitoring/ta-p/571374) to forward alerts from the Manager to a syslog server.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-securid?tab=Overview) in the Azure Marketplace.
