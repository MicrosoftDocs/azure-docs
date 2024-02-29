---
title: "LastPass Enterprise - Reporting (Polling CCP) connector for Microsoft Sentinel"
description: "Learn how to install the connector LastPass Enterprise - Reporting (Polling CCP) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# LastPass Enterprise - Reporting (Polling CCP) connector for Microsoft Sentinel

The [LastPass Enterprise](https://www.lastpass.com/products/enterprise-password-management-and-sso) connector provides the capability to LastPass reporting (audit) logs into Microsoft Sentinel. The connector provides visibility into logins and activity within LastPass (such as reading and removing passwords).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | {{graphQueriesTableName}}<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [The Collective Consulting](https://thecollective.eu) |

## Query samples

**Password moved to shared folders**
   ```kusto
{{graphQueriesTableName}}
 
   | where Action_s == "Move to Shared Folder"
 
   | extend AccountCustomEntity = Username_s, IPCustomEntity = IP_Address_s, URLCustomEntity = Data_s, TimestampCustomEntity = todatetime(Time_s) 
   ```



## Prerequisites

To integrate with LastPass Enterprise - Reporting (Polling CCP) make sure you have: 

- **LastPass API Key and CID**: A LastPass API key and CID are required. [See the documentation to learn more about LastPass API](https://support.logmeininc.com/lastpass/help/use-the-lastpass-provisioning-api-lp010068).


## Vendor installation instructions

Connect LastPass Enterprise to Microsoft Sentinel

Provide the LastPass Provisioning API Key.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/thecollectiveconsultingbv1584980370320.lastpass-enterprise-monitoring-solution?tab=Overview) in the Azure Marketplace.
