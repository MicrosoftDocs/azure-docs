---
title: Data collection endpoints in Azure Monitor 
description: Overview of data collection endpoints (DCEs) in Azure Monitor, including their contents and structure and how you can create and work with them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/17/2023
ms.custom: references_region
ms.reviwer: nikeist

---

# Data collection endpoints in Azure Monitor
Data collection endpoints (DCEs) provide a connection for certain data sources of Azure Monitor. This article provides an overview of DCEs, including their contents and structure and how you can create and work with them.

## Data sources that use DCEs
The following data sources currently use DCEs:

- [Azure Monitor Agent when network isolation is required](../agents/azure-monitor-agent-data-collection-endpoint.md#enable-network-isolation-for-azure-monitor-agent)
- [Logs ingestion API](../logs/logs-ingestion-api-overview.md)

## Components of a data collection endpoint
A DCE includes the following components:

| Component | Description |
|:---|:---|
| Configuration access endpoint | The endpoint used to access the configuration service to fetch associated data collection rules (DCRs) for Azure Monitor Agent.<br>Example: `<unique-dce-identifier>.<regionname>-1.handler.control`. |
| Logs ingestion endpoint | The endpoint used to ingest logs to Log Analytics workspaces.<br>Example: `<unique-dce-identifier>.<regionname>-1.ingest`. |
| Network access control lists | Network access control rules for the endpoints.

## Regionality
Data collection endpoints are Azure Resource Manager resources created within specific regions. An endpoint in a given region *can only be associated with machines in the same region*. However, you can have more than one endpoint within the same region according to your needs.

## Limitations
Data collection endpoints only support Log Analytics workspaces as a destination for collected data. [Custom metrics (preview)](../essentials/metrics-custom-overview.md) collected and uploaded via Azure Monitor Agent aren't currently controlled by DCEs. Data collection endpoints also can't be configured over private links.

## Create a data collection endpoint

> [!IMPORTANT]
> If agents will connect to your DCE, it must be created in the same region. If you have agents in different regions, you'll need multiple DCEs.

# [Azure portal](#tab/portal)

1. On the **Azure Monitor** menu in the Azure portal, select **Data Collection Endpoints** under the **Settings** section. Select **Create** to create a new DCR and assignment.

   [![Screenshot that shows data collection endpoints.](media/data-collection-endpoint-overview/data-collection-endpoint-overview.png)](media/data-collection-endpoint-overview/data-collection-endpoint-overview.png#lightbox)

1. Select **Create** to create a new endpoint. Provide a **Rule name** and specify a **Subscription**, **Resource Group**, and **Region**. This information specifies where the DCE will be created.

   [![Screenshot that shows data collection rule basics.](media/data-collection-endpoint-overview/data-collection-endpoint-basics.png)](media/data-collection-endpoint-overview/data-collection-endpoint-basics.png#lightbox)

1. Select **Review + create** to review the details of the DCE. Select **Create** to create it.

# [REST API](#tab/restapi)

Create DCRs by using the [DCE REST APIs](/cli/azure/monitor/data-collection/endpoint).

Create associations between endpoints to your target machines or resources by using the [DCRA REST APIs](/rest/api/monitor/datacollectionruleassociations/create#examples).

---

## Sample data collection endpoint
For a sample DCE, see [Sample data collection endpoint](data-collection-endpoint-sample.md).

## Next steps
- [Associate endpoints to machines](../agents/data-collection-rule-azure-monitor-agent.md#create-a-data-collection-rule)
- [Add an endpoint to an Azure Monitor Private Link Scope resource](../logs/private-link-configure.md#connect-azure-monitor-resources)
