---
title: "Cognni connector for Microsoft Sentinel"
description: "Learn how to install the connector Cognni to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cognni connector for Microsoft Sentinel

The Cognni connector offers a quick and simple integration with Microsoft Sentinel. You can use Cognni to autonomously map your previously unclassified important information and detect related incidents. This allows you to recognize risks to your important information, understand the severity of the incidents, and investigate the details you need to remediate, fast enough to make a difference.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CognniIncidents_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Cognni](https://cognni.ai/contact-support/) |

## Query samples

**Get all incidents order by time**
   ```kusto
CognniIncidents_CL            
   | order by TimeGenerated desc 
   ```

**Get high risk incidents**
   ```kusto
CognniIncidents_CL            
   | where Severity == 3
   ```

**Get medium risk incidents**
   ```kusto
CognniIncidents_CL            
   | where Severity == 2
   ```

**Get low risk incidents**
   ```kusto
CognniIncidents_CL            
   | where Severity == 1
   ```



## Vendor installation instructions

Connect to Cognni

1. Go to [Cognni integrations page](https://intelligence.cognni.ai/integrations)
2. Click **'Connect'** on the 'Microsoft Sentinel' box
3. Copy and paste **'workspaceId'** and **'sharedKey'** (from below) to the related fields on Cognni's integrations screen
4. Click the **'Connect'** botton to complete the configuration.  
  Soon, all your Cognni-detected incidents will be forwarded here (into Microsoft Sentinel)

Not a Cognni user? [Join us](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/shieldox.appsource_freetrial)


   Shared Key



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/shieldox.cognni_for_microsoft_sentinel?tab=Overview) in the Azure Marketplace.
