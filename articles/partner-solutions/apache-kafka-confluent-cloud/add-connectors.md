---
title: Azure services and Confluent Cloud integration
description: This article describes how to use Azure services and install connectors for Confluent Cloud integration.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 06/24/2022
author: flang-msft
ms.author: franlanglois
---

# Azure services and Confluent Cloud integrations

This article describes how to use Azure services like Azure Functions, and install connectors to Azure resources for Confluent Cloud.

## Azure Cosmos DB connector

**Azure Cosmos DB Sink Connector fully managed connector** is generally available within Confluent Cloud. The fully managed connector eliminates the need for the development and management of custom integrations, and reduces the overall operational burden of connecting your data between Confluent Cloud and Azure Cosmos DB. The Azure Cosmos DB Sink Connector for Confluent Cloud reads from and writes data to an Azure Cosmos DB database. The connector polls data from Kafka and writes to database containers.

To set up your connector, see [Azure Cosmos DB Sink Connector for Confluent Cloud](https://docs.confluent.io/cloud/current/connectors/cc-azure-cosmos-sink.html).

**Azure Cosmos DB Self Managed connector** must be installed manually. First download an uber JAR from the [Azure Cosmos DB Releases page](https://github.com/microsoft/kafka-connect-cosmosdb/releases). Or, you can [build your own uber JAR directly from the source code](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/README_Sink.md#install-sink-connector). Complete the installation by following the guidance described in the Confluent documentation for [installing connectors manually](https://docs.confluent.io/home/connect/install.html#install-connector-manually).

## Azure Functions

**Azure Functions Kafka trigger extension** is used to run your function code in response to messages in Kafka topics. You can also use a Kafka output binding to write from your function to a topic. For information about setup and configuration details, see [Apache Kafka bindings for Azure Functions overview](../../azure-functions/functions-bindings-kafka.md).

## Next steps

- For help with troubleshooting, see [Troubleshooting Apache Kafka on Confluent Cloud solutions](troubleshoot.md).
- Get started with Apache Kafka on Confluent Cloud - Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
