---
title: Data collection endpoints in Azure Monitor 
description: Overview of how data collection endpoints work and how to create and set them up based on your deployment.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/17/2023
ms.custom: references_region
ms.reviwer: nikeist

---

# Data collection endpoints in Azure Monitor

A data collection endpoint (DCE) is a connection that the [Logs ingestion API](../logs/logs-ingestion-api-overview.md) uses to send collected data for processing and ingestion into Azure Monitor. [Azure Monitor Agent](../agents/agents-overview.md) also uses data collection endpoints to receive configuration files from Azure Monitor and to send collected log data for processing and ingestion. 

This article provides an overview of data collection endpoints and explains how to create and set them up based on your deployment.

## Components of a data collection endpoint

A data collection endpoint includes components required to ingest data into Azure Monitor and send configuration files to Azure Monitor Agent. 

[How you set up endpoints for your deployment](#how-to-set-up-data-collection-endpoints-based-on-your-deployment) depends on whether your monitored resources and Log Analytics workspaces are in one or more regions.

This table describes the components of a data collection endpoint, related regionality considerations, and how to  set up the data collection endpoint when you create a data collection rule using the portal:

| Component | Description | Regionality considerations |Data collection rule configuration |
|:---|:---|:---|
| Configuration access endpoint | The endpoint from which Azure Monitor Agent retrieves data collection rules (DCRs).<br>Example: `<unique-dce-identifier>.<regionname>-1.handler.control`. | Same region as the monitored resources. | Set on the **Basics** tab when you create a data collection rule using the portal. | 
| Logs ingestion endpoint | The endpoint that ingests logs into the data ingestion pipeline. Azure Monitor transforms the data and sends it to the defined destination Log Analytics workspace and table based on a DCR ID sent with the collected data.<br>Example: `<unique-dce-identifier>.<regionname>-1.ingest`. |Same region as the destination Log Analytics workspace. |Set on the **Resources** tab when you create a data collection rule using the portal.|


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

## Create a data collection endpoint

# [Azure portal](#tab/portal)

1. On the **Azure Monitor** menu in the Azure portal, select **Data Collection Endpoints** under the **Settings** section. Select **Create** to create a new DCR and assignment.
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
For a sample DCE, see [Sample data collection endpoint](data-collection-endpoint-sample.md).


## Limitations
- Data collection endpoints only support Log Analytics workspaces as a destination for collected data. [Custom metrics (preview)](../essentials/metrics-custom-overview.md) collected and uploaded via Azure Monitor Agent aren't currently controlled by DCEs. Data collection endpoints also can't be configured over private links.

- Data collection endpoints are where [Logs ingestion API ingestion limits](../service-limits.md#logs-ingestion-api) are applied.

## Next steps
- [Associate endpoints to machines](../agents/data-collection-rule-azure-monitor-agent.md#create-a-data-collection-rule)
- [Add an endpoint to an Azure Monitor Private Link Scope resource](../logs/private-link-configure.md#connect-azure-monitor-resources)
