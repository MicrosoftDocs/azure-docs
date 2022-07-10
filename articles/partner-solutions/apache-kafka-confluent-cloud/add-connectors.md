---
title: Add connectors for Confluent Cloud - Azure partner solutions
description: This article describes how to install connectors for Confluent Cloud that you use with Azure resources.
ms.topic: conceptual
ms.date: 09/03/2021
author: davidsmatlak
ms.author: davidsmatlak
---

# Add connectors for Confluent Cloud

This article describes how to install connectors to Azure resources for Confluent Cloud.

## Connector to Azure Cosmos DB

**Azure Cosmos DB Sink Connector fully managed connector** is generally available within Confluent Cloud. The fully managed connector eliminates the need for the development and management of custom integrations, and reduces the overall operational burden of connecting your data between Confluent Cloud and Azure Cosmos DB. The Microsoft Azure Cosmos Sink Connector for Confluent Cloud reads from and writes data to a Microsoft Azure Cosmos database. The connector polls data from Kafka and writes to database containers.

To set up your connector, see [Azure Cosmos DB Sink Connector for Confluent Cloud](https://docs.confluent.io/cloud/current/connectors/cc-azure-cosmos-sink.html).

**Azure Cosmos DB Self Managed connector** must be installed manually. First download an uber JAR from the [Cosmos DB Releases page](https://github.com/microsoft/kafka-connect-cosmosdb/releases). Or, you can [build your own uber JAR directly from the source code](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/README_Sink.md#install-sink-connector). Complete the installation by following the guidance described in the Confluent documentation for [installing connectors manually](https://docs.confluent.io/home/connect/install.html#install-connector-manually).  

## Next steps

For help with troubleshooting, see [Troubleshooting Apache Kafka for Confluent Cloud solutions](troubleshoot.md).
