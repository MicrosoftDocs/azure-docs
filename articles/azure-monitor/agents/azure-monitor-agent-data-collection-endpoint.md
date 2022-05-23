---
title: Using data collection endpoints with Azure Monitor agent
description: Use data collection endpoints to uniquely configure ingestion settings for your machines.
ms.topic: conceptual
author: shseth
ms.author: shseth
ms.date: 3/16/2022
ms.custom: references_region

---

# Using data collection endpoints with Azure Monitor agent
[Data Collection Endpoints (DCEs)](../essentials/data-collection-endpoint-overview.md) allow you to uniquely configure ingestion settings for your machines, giving you greater control over your networking requirements. 

## Create data collection endpoint
See [Data collection endpoints in Azure Monitor](../essentials/data-collection-endpoint-overview.md) for details on data collection endpoints and how to create them.

## Create endpoint association in Azure portal
Use **Data collection rules** in the portal to associate endpoints with a resource (e.g. a virtual machine) or a set of resources. Create a new rule or open an existing rule. In the **Resources** tab, click on the **Data collection endpoint** drop-down to associate an existing endpoint for your resource in the same region (or select multiple resources in the same region to bulk-assign an endpoint for them). Doing this creates an association per resource which links the endpoint to the resource. The Azure Monitor agent running on these resources will now start using the endpoint instead for uploading data to Azure Monitor.

[![Data Collection Rule virtual machines](media/data-collection-rule-azure-monitor-agent/data-collection-rule-virtual-machines-with-endpoint.png)](../agents/media/data-collection-rule-azure-monitor-agent/data-collection-rule-virtual-machines-with-endpoint.png#lightbox) 


> [!NOTE]
> The data collection endpoint should be created in the **same region** where your virtual machines exist.  


## Create endpoint and association using REST API

> [!NOTE]
> The data collection endpoint should be created in the **same region** where your virtual machines exist.  

1. Create data collection endpoint(s) using these [DCE REST APIs](/cli/azure/monitor/data-collection/endpoint).
2. Create association(s) to link the endpoint(s) to your target machines or resources, using these [DCRA REST APIs](/rest/api/monitor/datacollectionruleassociations/create#examples).


## Sample data collection endpoint
The sample data collection endpoint below is for virtual machines with Azure Monitor agent, with public network access disabled so that agent only uses private links to communicate and send data to Azure Monitor/Log Analytics.

```json
{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Insights/dataCollectionEndpoints/myCollectionEndpoint",
  "name": "myCollectionEndpoint",
  "type": "Microsoft.Insights/dataCollectionEndpoints",
  "location": "eastus",
  "tags": {
    "tag1": "A",
    "tag2": "B"
  },
  "properties": {
    "configurationAccess": {
      "endpoint": "https://mycollectionendpoint-abcd.eastus-1.control.monitor.azure.com"
    },
    "logsIngestion": {
      "endpoint": "https://mycollectionendpoint-abcd.eastus-1.ingest.monitor.azure.com"
    },
    "networkAcls": {
      "publicNetworkAccess": "Disabled"
    }
  },
  "systemData": {
    "createdBy": "user1",
    "createdByType": "User",
    "createdAt": "yyyy-mm-ddThh:mm:ss.sssssssZ",
    "lastModifiedBy": "user2",
    "lastModifiedByType": "User",
    "lastModifiedAt": "yyyy-mm-ddThh:mm:ss.sssssssZ"
  },
  "etag": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

## Enable network isolation for the Azure Monitor Agent
You can use data collection endpoints to enable the Azure Monitor agent to communicate to the internet via private links. To do so, you must:
1. Create data collection endpoint(s), at least one per region, as shown above
2. Add the data collection endpoints to a new or existing [Azure Monitor Private Link Scopes (AMPLS)](../logs/private-link-configure.md#connect-azure-monitor-resources) resource. This adds the DCE endpoints to your private DNS zone (see [how to validate](../logs/private-link-configure.md#review-and-validate-your-private-link-setup)) and allows communication via private links. You can do this from either the AMPLS resource or from within an existing DCE resource's 'Network Isolation' tab.
	> [!NOTE]
	> Other Azure Monitor resources like the Log Analytics workspace(s) configured in your data collection rules that you wish to send data to, must be part of this same AMPLS resource.
3. For your data collection endpoint(s), ensure **Accept access from public networks not connected through a Private Link Scope** option is set to **No** under the 'Network Isolation' tab of your endpoint resource in Azure portal, as shown below. This ensures that public internet access is disabled, and network communication only happen via private links.
4. Associate the data collection endpoints to the target resources, using the data collection rules experience in Azure portal. This results in the agent using the configured the data collection endpoint(s) for network communications. See [Configure data collection for the Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md).

	![Data collection endpoint network isolation](media/azure-monitor-agent-dce/data-collection-endpoint-network-isolation.png)

## Next steps
- [Associate endpoint to machines](../agents/data-collection-rule-azure-monitor-agent.md#create-rule-and-association-in-azure-portal)
- [Add endpoint to AMPLS resource](../logs/private-link-configure.md#connect-azure-monitor-resources) 
