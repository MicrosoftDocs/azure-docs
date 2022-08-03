---
title: Data collection endpoints in Azure Monitor 
description: Overview of data collection endpoints (DCEs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.topic: conceptual
ms.date: 03/16/2022
ms.custom: references_region
ms.reviwer: nikeist

---

# Data collection endpoints in Azure Monitor 
Data Collection Endpoints (DCEs)  provide a connection for certain data sources of Azure Monitor. This article provides an overview of data collection endpoints including their contents and structure and how you can create and work with them.

## Data sources that use DCEs
The following data sources currently use DCEs:

- [Azure Monitor agent when network isolation is required](../agents/azure-monitor-agent-data-collection-endpoint.md)
- [Custom logs](../logs/logs-ingestion-api-overview.md)

## Components of a data collection endpoint
A data collection endpoint includes the following components.

| Component | Description |
|:---|:---|
| Configuration access endpoint | The endpoint used to access the configuration service to fetch associated data collection rules (DCR) for Azure Monitor agent.<br>Example: `<unique-dce-identifier>.<regionname>.handler.control` |
| Logs ingestion endpoint | The endpoint used to ingest logs to Log Analytics workspace(s).<br>Example: `<unique-dce-identifier>.<regionname>.ingest` |
| Network Access Control Lists (ACLs) | Network access control rules for the endpoints


## Regionality
Data collection endpoints are ARM resources created within specific regions. An endpoint in a given region can only be **associated with machines in the same region**, although you can have more than one endpoint within the same region as per your needs.

## Limitations
Data collection endpoints only support Log Analytics workspaces as a destination for collected data. [Custom Metrics (preview)](../essentials/metrics-custom-overview.md) collected and uploaded via the Azure Monitor Agent are not currently controlled by DCEs nor can they be configured over private links.

## Create data collection endpoint 

> [!IMPORTANT]
> If agents will connect to your DCE, it must be created in the same region. If you have agents in different regions, then you'll need multiple DCEs.

# [Azure portal](#tab/portal)


1. In the **Azure Monitor** menu in the Azure portal, select **Data Collection Endpoint** from the **Settings** section. Click **Create** to create a new Data Collection Rule and assignment.

  [![Data Collection Endpoints](media/data-collection-endpoint-overview/data-collection-endpoint-overview.png)](media/data-collection-endpoint-overview/data-collection-endpoint-overview.png#lightbox)

2. Click **Create** to create a new endpoint. Provide a **Rule name** and specify a **Subscription**, **Resource Group** and **Region**. This specifies where the DCE will be created.

  [![Data Collection Rule Basics](media/data-collection-endpoint-overview/data-collection-endpoint-basics.png)](media/data-collection-endpoint-overview/data-collection-endpoint-basics.png#lightbox)

3. Click **Review + create** to review the details of the data collection endpoint. Click **Create** to create it.

# [REST API](#tab/restapi)


Create data collection endpoint(s) using the [DCE REST APIs](/cli/azure/monitor/data-collection/endpoint).

Create associations between endpoints to your target machines or resources, using the [DCRA REST APIs](/rest/api/monitor/datacollectionruleassociations/create#examples).

---

## Sample data collection endpoint
See [Sample data collection endpoint](data-collection-endpoint-sample.md) for a sample data collection endpoint.

## Next steps
- [Associate endpoint to machines](../agents/data-collection-rule-azure-monitor-agent.md#create-data-collection-rule-and-association)
- [Add endpoint to AMPLS resource](../logs/private-link-configure.md#connect-azure-monitor-resources) 
