---
title: "Threat Intelligence Upload Indicators API (Preview) connector for Microsoft Sentinel"
description: "Learn how to install the connector Threat Intelligence Upload Indicators API (Preview) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 06/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Threat Intelligence Upload Indicators API (Preview) connector for Microsoft Sentinel

Microsoft Sentinel offer a data plane API to bring in threat intelligence from your Threat Intelligence Platform (TIP), such as Threat Connect, Palo Alto Networks MineMeld, MISP, or other integrated applications. Threat indicators can include IP addresses, domains, URLs, file hashes and email addresses.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ThreatIntelligenceIndicator<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**All Threat Intelligence APIs Indicators**
   ```kusto
ThreatIntelligenceIndicator 
   | where SourceSystem !in ('SecurityGraph', 'Azure Sentinel', 'Microsoft Sentinel')
   | sort by TimeGenerated desc
   ```



## Vendor installation instructions

You can connect your threat intelligence data sources to Microsoft Sentinel by either: 


- Using an integrated Threat Intelligence Platform (TIP), such as Threat Connect, Palo Alto Networks MineMeld, MISP, and others. 

- Calling the Microsoft Sentinel data plane API directly from another application. 

Follow These Steps to Connect to your Threat Intelligence: 

Get AAD Access Token

To send request to the APIs, you need to acquire Azure Active Directory access token. You can follow instruction in this page: [Get Azure AD tokens for users by using MSAL](/azure/databricks/dev-tools/api/latest/aad/app-aad-token#get-an-azure-ad-access-token). 
  - Notice: Please request AAD access token with appropriate scope value.


You can send indicators by calling our Upload Indicators API. For more information about the API, click [here](/azure/sentinel/upload-indicators-api). 

```http

HTTP method: POST 

Endpoint: https://sentinelus.azure-api.net/workspaces/[WorkspaceID]/threatintelligenceindicators:upload?api-version=2022-07-01  

WorkspaceID: the workspace that the indicators are uploaded to.  


Header Value 1: "Authorization" = "Bearer [AAD Access Token from step 1]" 


Header Value 2: "Content-Type" = "application/json"  
 
Body: The body is a JSON object containing an array of indicators in STIX format.'title : 2. Send indicators to Sentinel'
```


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-threatintelligence-taxii?tab=Overview) in the Azure Marketplace.
