---
title: Infosys supply chain traceability solution using Azure Cosmos DB Gremllin API
description: The supply chain traceability graph solution implemented by Infosys uses the Azure Cosmos DB Gremlin API and other Azure services. It provides global supply chain track and trace capability for finished goods.
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: how-to
ms.date: 10/07/2021
author: manishmsfte
ms.author: mansha
---

# Supply chain traceability solution using Azure Cosmos DB Gremlin API

[!INCLUDE[appliesto-gremlin-api](../includes/appliesto-gremlin-api.md)]

This article provides an overview of [traceability graph solutions implemented by Infosys](https://azuremarketplace.microsoft.com/marketplace/apps/infosysltd.infosys-traceability-knowledge-graph?tab=Overview). These solutions use Azure Cosmos DB Gremlin API and other Azure capabilities to provide global supply chain track and trace capability for finished goods.

After reading this article, you will learn:

* What is traceability in the context of a supply chain?
* Architecture of a global traceability solution delivered using Azure Capabilities.  
* How the Azure Cosmos DB graph database helps intricate relationships between raw material and finished good in a global supply chain?
* How does the Azure integration platform services such as API Management, Event Hub help you to integrate diverse supply chain application ecosystems?
* How can you get help from Infosys to use this solution for your traceability need?

## Overview

In the food supply chain, product traceability is the ability to 'track and trace' them across the supply chain throughout the product’s lifecycle. The supply chain includes supply, manufacturing, and distribution. Traceability is vital for food safety, brand, and regulatory exposure. In the past, some organizations failed to track and trace products effectively in their supply chain, resulting in expensive recalls, fines, and consumer health issues. The traceability solutions had to address the needs of data harmonization, data ingestion at different velocity and veracity, and, more importantly, follow the inventory cycle, objectives that weren't possible with traditional platforms.

Infosys's traceability solution, developed with Azure capabilities such as application services, integration services and database services, provides vital capabilities to:

* Connect to factories, warehouses/distribution centers.
* Ingest/process parallel stock movement events.
* A knowledge graph, which shows connections between raw material, batch, finish goods (FG) pallets, multi-level parent/child relationship of pallets, goods movement.
* User portal with a search capability range of wildcard search to specific keyword search.
* Identify impacts of a quality incident such as impacted raw material batch, pallets affected, location of the pallets.
* Ability to have the history of events captured across multiple markets, including product recall information.

## Solution architecture

Supply chain traceability commonly shares patterns in ingesting pallet movements, handing quality incidents, and tracing/analyzing store data. First, these systems need to ingest bursts of data from factory and warehouse management systems that cross geographies. Next, these systems process and analyze streaming data to derive complex relationships between raw material, production batches, finished good pallets and complex parent/child relationships (co-pack/repack). Then, the system must store information about the intricate relationships between raw material, finished goods, and pallets, all necessary for traceability. A user portal with search capability allows the users to track and trace products in the supply chain network. These services enable the end-to-end traceability solution that supports cloud-native, API-first, and data-driven capabilities.

Microsoft Azure offers rich services that can be applied for traceability use cases, including Azure Cosmos DB, Azure Event Hubs, Azure API Management, Azure App Service, Azure SignalR, Azure Synapse Analytics, and Power BI.

Infosys’s traceability solution provides a pre-baked solution that you can use to improve track and trace capability. The following image explains the architecture used for this traceability solution:

:::image type="content" source="./media/supply-chain-traceability-solution/solution-architecture.png" alt-text="Supply chain traceability solution architecture" lightbox="./media/supply-chain-traceability-solution/solution-architecture.png" border="false":::

Different Azure services used in this architecture help with the following tasks:

* Azure Cosmos DB allows you to scale performance up or down elastically. Gremlin API allows you to create and query complex relationships between raw material, finished goods and warehouses.
* Azure API Management provides APIs for stock movement events to the 3PLs (thirdpParty Logistic Providers) and Warehouse Management Systems (WMS).  
* Azure Event Hub provides the ability to gather large numbers of concurrent events from WMS and 3PLs for further processing.
* Azure Function apps processes events and ingest data to Azure Cosmos DB using Gremlin API.
* Azure Search service allows users to do complex find, filter pallet information.
* Azure Databricks reads change feed and creates models in Synapse Analytics for self-service reporting for users in Power BI.
* Azure Web App and App Service plan allow you to deploy the user portal.
* Azure Storage account stores archived data for long-term regulatory needs.

## Graph DB and its data design

The production and distribution of goods require maintaining a complex and dynamic set of relationships.  An adaptive data model of our traceability graph allows storing such relationships starting from the receipt of raw material, manufacturing the finished goods in a factory, transferring to different warehouses during supply chain, and finally transferring to the customer warehouse. A high-level visualization of the process looks like the following image:

:::image type="content" source="./media/supply-chain-traceability-solution/data-design-visualization.png" alt-text="Supply chain data design visualization" lightbox="./media/supply-chain-traceability-solution/data-design-visualization.png" border="true":::

The above diagram shows a high level and simplified view of a complex supply chain process. However, getting the vital stock movement information from the factories and warehouses in real time makes it possible to create an elaborate graph that connects all these disparate pieces of information.

1. The traceability process starts when the supplier sends raw materials to the factories, and the initial nodes (vertices) of the graph and relationships (edges) gets created.

1. The finished goods (Items) are produced from raw materials and packed into pallets.

1. The pallets are then moved to factory warehouses or the market warehouses as per customer demands/orders.

1. The warehouse could be of company’s owned or 3PL (third-party Logistic Providers). The pallets are then shipped to various other warehouses as per customer orders. As per the customer demands, child pallets or child-of-child pallets are created to accommodate the ordered quantity. Sometimes, a whole new item is made by mixing multiple items. For example, in a copack scenario that produces a variety pack, sometimes same item gets repacked to smaller or larger quantities to a different pallet as part of a customer order.

   :::image type="content" source="./media/supply-chain-traceability-solution/pallet-relationship.png" alt-text="Pallet relationship in supply chain traceability solution" lightbox="./media/supply-chain-traceability-solution/pallet-relationship.png" border="true":::

1. Pallets then travel through the supply chain network and eventually reach the customer warehouse. During that process, the pallets can be further broken down or combine with other pallets to produce new pallets to fulfill customer orders.

1. Eventually, the system creates a complex graph that holds vital relationship information for quality incident management, which we will discuss shortly.

   :::image type="content" source="./media/supply-chain-traceability-solution/supply-chain-object-relationship.png" alt-text="Supply chain object relationship complete architecture" lightbox="./media/supply-chain-traceability-solution/supply-chain-object-relationship.png" border="true":::

1. These intricate relationships are vital in a quality incident where the system can track and trace pallets across the supply chain. Graph and its traversals provide the required information for this. For example, if there is an issue with one raw material, the graph can show the impacted pallets, current location.

## Next steps

* [Infosys traceability graph solution](https://azuremarketplace.microsoft.com/marketplace/apps/infosysltd.infosys-traceability-knowledge-graph?tab=Overview)
* [Infosys Integrate+ for Azure](https://azuremarketplace.microsoft.com/marketplace/apps/infosysltd.infosys-integrate-for-azure)
* To visualize graph data, see the [Gremlin API visualization solutions](graph-visualization-partners.md).
* To model your graph data, see the [Gremlin API modeling solutions](graph-modeling-tools.md).
