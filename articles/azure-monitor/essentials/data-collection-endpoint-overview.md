---
title: Data collection endpoints in Azure Monitor 
description: Overview of how data collection endpoints work and how to create and set them up based on your deployment.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/18/2024
ms.custom: references_region
ms.reviwer: nikeist

---

# Data collection endpoints in Azure Monitor

A data collection endpoint (DCE) is a connection where data sources send collected data for processing and ingestion into Azure Monitor. This article provides an overview of data collection endpoints and explains how to create and set them up based on your deployment.

## When is a DCE required?
Prior to March 31, 2024, a DCE was required for all data collection scenarios using a DCR that required an endpoint. Any DCR created after this date includes its own endpoints for logs and metrics. The URL for these endpoints can be found in the [`logsIngestion` and `metricsIngestion`](./data-collection-rule-structure.md#endpoints) properties of the DCR. These endpoints can be used instead of a DCE for any direct ingestion scenarios.

Endpoints cannot be added to an existing DCR, but you can keep using any existing DCRs with existing DCEs. If you want to move to a DCR endpoint, then you must create a new DCR to replace the existing one. A DCR with endpoints can also use a DCE. In this case, you can choose whether to use the DCE or the DCR endpoints for each of the clients that use the DCR.

The following scenarios can currently use DCR endpoints.  A DCE required if private link is used.

- [Logs ingestion API](../logs/logs-ingestion-api-overview.md).


## Components of a DCE

A data collection endpoint includes components required to ingest data into Azure Monitor and send configuration files to Azure Monitor Agent. 

[How you set up endpoints for your deployment](#how-to-set-up-data-collection-endpoints-based-on-your-deployment) depends on whether your monitored resources and Log Analytics workspaces are in one or more regions.

This table describes the components of a data collection endpoint, related regionality considerations, and how to  set up the data collection endpoint when you create a data collection rule using the portal:

| Component | Description | Regionality considerations |Data collection rule configuration |
|:---|:---|:---|:---|
| Logs ingestion endpoint | The endpoint that ingests logs into the data ingestion pipeline. Azure Monitor transforms the data and sends it to the defined destination Log Analytics workspace and table based on a DCR ID sent with the collected data.<br>Example: `<unique-dce-identifier>.<regionname>-1.ingest`. |Same region as the destination Log Analytics workspace. |Set on the **Basics** tab when you create a data collection rule using the portal. |
| Configuration access endpoint | The endpoint from which Azure Monitor Agent retrieves data collection rules (DCRs).<br>Example: `<unique-dce-identifier>.<regionname>-1.handler.control`. | Same region as the monitored resources. | Set on the **Resources** tab when you create a data collection rule using the portal.| 


## How to set up data collection endpoints based on your deployment

- **Scenario: All monitored resources are in the same region as the destination Log Analytics workspace**

    Set up one data collection endpoint to send configuration files and receive collected data.
    
    :::image type="content" source="media/data-collection-endpoint-overview/data-collection-endpoint-one-region.png" alt-text="A diagram that shows resources in a single region sending data and receiving configuration files using a data collection endpoint." lightbox="media/data-collection-endpoint-overview/data-collection-endpoint-one-region.png":::

- **Scenario: Monitored resources send data to a Log Analytics workspace in a different region**

    - Create a data collection endpoint in each region where you have Azure Monitor Agent deployed to send configuration files to the agents in that region.
    
    - Send data from all resources to a data collection endpoint in the region where your destination Log Analytics workspaces are located. 
    
    :::image type="content" source="media/data-collection-endpoint-overview/data-collection-endpoint-regionality.png" alt-text="A diagram that shows resources in two regions sending data and receiving configuration files using data collection endpoints." lightbox="media/data-collection-endpoint-overview/data-collection-endpoint-regionality.png"::: 

- **Scenario: Monitored resources in one or more regions send data to multiple Log Analytics workspaces in different regions**

     - Create a data collection endpoint in each region where you have Azure Monitor Agent deployed to send configuration files to the agents in that region.
     
     - Create a data collection endpoint in each region with a destination Log Analytics workspace to send data to the Log Analytics workspaces in that region.
     
     - Send data from each monitored resource to the data collection endpoint in the region where the destination Log Analytics workspace is located.
      
     :::image type="content" source="media/data-collection-endpoint-overview/data-collection-endpoint-regionality-multiple-workspaces.png" alt-text="A diagram that shows monitored resources in multiple regions sending data to multiple Log Analytics workspaces in different regions using data collection endpoints." lightbox="media/data-collection-endpoint-overview/data-collection-endpoint-regionality-multiple-workspaces.png":::

> [!NOTE]
> By default, the Microsoft.Insights resource provider isnt registered in a Subscription. Ensure to register it successfully before trying to create a Data Collection Endpoint.

## Create a data collection endpoint

# [Azure portal](#tab/portal)

1. On the **Azure Monitor** menu in the Azure portal, select **Data Collection Endpoints** under the **Settings** section. Select **Create** to create a new Data Collection Endpoint.
   <!-- convertborder later -->
   :::image type="content" source="media/data-collection-endpoint-overview/data-collection-endpoint-overview.png" lightbox="media/data-collection-endpoint-overview/data-collection-endpoint-overview.png" alt-text="Screenshot that shows data collection endpoints." border="false":::

1. Select **Create** to create a new endpoint. Provide a **Rule name** and specify a **Subscription**, **Resource Group**, and **Region**. This information specifies where the DCE will be created.
   <!-- convertborder later -->
   :::image type="content" source="media/data-collection-endpoint-overview/data-collection-endpoint-basics.png" lightbox="media/data-collection-endpoint-overview/data-collection-endpoint-basics.png" alt-text="Screenshot that shows data collection rule basics." border="false":::

1. Select **Review + create** to review the details of the DCE. Select **Create** to create it.

# [REST API](#tab/restapi)

Create DCEs by using the [DCE REST APIs](/cli/azure/monitor/data-collection/endpoint).

Create associations between endpoints to your target machines or resources by using the [DCRA REST APIs](/rest/api/monitor/datacollectionruleassociations/create#examples).

---

## Sample data collection endpoint
The sample data collection endpoint (DCE) below is for virtual machines with Azure Monitor agent, with public network access disabled so that agent only uses private links to communicate and send data to Azure Monitor/Log Analytics.

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

## Limitations

- Data collection endpoints only support Log Analytics workspaces as a destination for collected data. [Custom metrics (preview)](../essentials/metrics-custom-overview.md) collected and uploaded via Azure Monitor Agent aren't currently controlled by DCEs.


## Next steps
- [Associate endpoints to machines](../agents/data-collection-rule-azure-monitor-agent.md#create-a-data-collection-rule)
- [Add an endpoint to an Azure Monitor Private Link Scope resource](../logs/private-link-configure.md#connect-azure-monitor-resources)
