---
title: Add connectors for Confluent Cloud - Azure partner solutions
description: This article describes how to install connectors for Confluent Cloud that you use with Azure resources.
ms.service: partner-services
ms.topic: conceptual
ms.date: 08/31/2021
author: tfitzmac
ms.author: tomfitz
---

# Add connectors for Confluent Cloud

This article describes how to install connectors to Azure resources for Confluent Cloud.

## Connector to Azure Cosmos DB

[Azure Cosmos DB Sink Connector fully managed connector](https://docs.confluent.io/cloud/current/connectors/cc-azure-cosmos-sink.html) is generally available within Confluent Cloud. The fully managed connector eliminates the need for the development and management of custom integrations. It reduces the overall operational burden of connecting your data between Confluent Cloud and Azure Cosmos DB. The Microsoft Azure Cosmos Sink Connector for Confluent Cloud reads from and writes data to a Microsoft Azure Cosmos database. The connector polls data from Kafka and writes to database containers.

From within the Confluent Hub client, install the Cosmos DB Connector as recommended in the [Confluent Hub listing](https://www.confluent.io/hub/microsoftcorporation/kafka-connect-cosmos). 

To install the connector manually, first download an uber JAR from the [Cosmos DB Releases page](https://github.com/microsoft/kafka-connect-cosmosdb/releases). Or, you can [build your own uber JAR directly from the source code](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/README_Sink.md#install-sink-connector). Complete the installation by following the guidance described in the Confluent documentation for [installing connectors manually](https://docs.confluent.io/home/connect/install.html#install-connector-manually).  

## Next steps

For help with troubleshooting, see [Troubleshooting Apache Kafka for Confluent Cloud solutions](troubleshoot.md).
