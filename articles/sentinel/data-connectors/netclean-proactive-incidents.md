---
title: "Netclean ProActive Incidents connector for Microsoft Sentinel"
description: "Learn how to install the connector Netclean ProActive Incidents to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Netclean ProActive Incidents connector for Microsoft Sentinel

This connector uses the Netclean Webhook (required) and Logic Apps to push data into Microsoft Sentinel Log Analytics

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Netclean_Incidents_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [NetClean](https://www.netclean.com/contact) |

## Query samples

**Netclean - All Activities.**
   ```kusto
Netclean_Incidents_CL 
   | sort by TimeGenerated desc
   ```



## Vendor installation instructions


> [!NOTE]
   >  The data connector relies on Azure Logic Apps to receive and push data to Log Analytics This might result in additional data ingestion costs.
 It's possible to test this without Logic Apps or NetClean Proactive see option 2



 Option 1: deploy Logic app (requires NetClean Proactive)

1. Download and install the Logic app here:
 https://portal.azure.com/#create/netcleantechnologiesab1651557549734.netcleanlogicappnetcleanproactivelogicapp)
2. Go to your newly created logic app 
  In your Logic app designer, click +New Step and search for “Azure Log Analytics Data Collector” click it and select “Send Data”  
 Enter the Custom Log Name: Netclean_Incidents and a dummy value in the Json request body and click save 
 Go to code view on the top ribbon and scroll down to line ~100  it should start with "Body"  
 replace the line entirly with: 
 
 "body": "{\n\"Hostname\":\"@{variables('machineName')}\",\n\"agentType\":\"@{triggerBody()['value']['agent']['type']}\",\n\"Identifier\":\"@{triggerBody()?['key']?['identifier']}\",\n\"type\":\"@{triggerBody()?['key']?['type']}\",\n\"version\":\"@{triggerBody()?['value']?['incidentVersion']}\",\n\"foundTime\":\"@{triggerBody()?['value']?['foundTime']}\",\n\"detectionMethod\":\"@{triggerBody()?['value']?['detectionHashType']}\",\n\"agentInformatonIdentifier\":\"@{triggerBody()?['value']?['device']?['identifier']}\",\n\"osVersion\":\"@{triggerBody()?['value']?['device']?['operatingSystemVersion']}\",\n\"machineName\":\"@{variables('machineName')}\",\n\"microsoftCultureId\":\"@{triggerBody()?['value']?['device']?['microsoftCultureId']}\",\n\"timeZoneId\":\"@{triggerBody()?['value']?['device']?['timeZoneName']}\",\n\"microsoftGeoId\":\"@{triggerBody()?['value']?['device']?['microsoftGeoId']}\",\n\"domainname\":\"@{variables('domain')}\",\n\"Agentversion\":\"@{triggerBody()['value']['agent']['version']}\",\n\"Agentidentifier\":\"@{triggerBody()['value']['identifier']}\",\n\"loggedOnUsers\":\"@{variables('Usernames')}\",\n\"size\":\"@{triggerBody()?['value']?['file']?['size']}\",\n\"creationTime\":\"@{triggerBody()?['value']?['file']?['creationTime']}\",\n\"lastAccessTime\":\"@{triggerBody()?['value']?['file']?['lastAccessTime']}\",\n\"lastWriteTime\":\"@{triggerBody()?['value']?['file']?['lastModifiedTime']}\",\n\"sha1\":\"@{triggerBody()?['value']?['file']?['calculatedHashes']?['sha1']}\",\n\"nearbyFiles_sha1\":\"@{variables('nearbyFiles_sha1s')}\",\n\"externalIP\":\"@{triggerBody()?['value']?['device']?['resolvedExternalIp']}\",\n\"domain\":\"@{variables('domain')}\",\n\"hasCollectedNearbyFiles\":\"@{variables('hasCollectedNearbyFiles')}\",\n\"filePath\":\"@{replace(triggerBody()['value']['file']['path'], '\\', '\\\\')}\",\n\"m365WebUrl\":\"@{triggerBody()?['value']?['file']?['microsoft365']?['webUrl']}\",\n\"m365CreatedBymail\":\"@{triggerBody()?['value']?['file']?['createdBy']?['graphIdentity']?['user']?['mail']}\",\n\"m365LastModifiedByMail\":\"@{triggerBody()?['value']?['file']?['lastModifiedBy']?['graphIdentity']?['user']?['mail']}\",\n\"m365LibraryId\":\"@{triggerBody()?['value']?['file']?['microsoft365']?['library']?['id']}\",\n\"m365LibraryDisplayName\":\"@{triggerBody()?['value']?['file']?['microsoft365']?['library']?['displayName']}\",\n\"m365Librarytype\":\"@{triggerBody()?['value']?['file']?['microsoft365']?['library']?['type']}\",\n\"m365siteid\":\"@{triggerBody()?['value']?['file']?['microsoft365']?['site']?['id']}\",\n\"m365sitedisplayName\":\"@{triggerBody()?['value']?['file']?['microsoft365']?['site']?['displayName']}\",\n\"m365sitename\":\"@{triggerBody()?['value']?['file']?['microsoft365']?['parent']?['name']}\",\n\"countOfAllNearByFiles\":\"@{variables('countOfAllNearByFiles')}\",\n\n}",  
 click save   
3. Copy the HTTP POST URL
4. Go to your NetClean ProActive web console, and go to settings, Under Webhook configure a new webhook using the URL copied from step 3 
 5. Verify functionality by triggering a Demo Incident.

 Option 2 (Testing only)

Ingest data using a api function. please use the script found on [Send log data to Azure Monitor by using the HTTP Data Collector API](/azure/azure-monitor/logs/data-collector-api?tabs=powershell)  
Replace the CustomerId and SharedKey values with your values
Replace the content in $json variable to the sample data.
Set the LogType varible to **Netclean_Incidents_CL**
Run the script



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/netcleantechnologiesab1651557549734.azure-sentinel-solution-netclean-proactive?tab=Overview) in the Azure Marketplace.
