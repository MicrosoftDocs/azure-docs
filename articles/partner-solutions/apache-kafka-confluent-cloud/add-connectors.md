---
title: Connect a Confluent organization to other Azure resources
description: Learn how to connect an instance of Apache Kafka® & Apache Flink® on Confluent Cloud™ to other Azure services using Service Connector.
# customerIntent: As a developer I want connect Confluent Cloud to Azure services.
ms.topic: how-to
ms.date: 04/09/2024
ms.custom: ai-gen-docs-bap, ai-gen-desc, ai-seo-date:04/09/2024
---

# Connect a Confluent organization to other Azure resources

In this guide, learn how to connect an instance of Apache Kafka® & Apache Flink® on Confluent Cloud™ - An Azure Native ISV Service, to other Azure services, using Service Connector. This page also introduces Azure Cosmos DB connectors and the Azure Functions Kafka trigger extension.

Service Connector is an Azure service designed to simplify the process of connecting Azure resources together. Service Connector manages your connection's network and authentication settings to simplify the operation.

This guide shows step by step instructions to connect an app deployed to Azure App Service to a Confluent organization. You can apply a similar method to connect your Confluent organization to other services supported by Service Connector.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
* An existing Confluent organization. If you don't have one yet, refer to [create a Confluent organization](./create-cli.md)
* An app deployed to [Azure App Service](/azure/app-service/quickstart-dotnetcore), [Azure Container Apps](/azure/container-apps/quickstart-portal), [Azure Spring Apps](/azure/spring-apps/enterprise/quickstart), or [Azure Kubernetes Services (AKS)](/azure/aks/learn/quick-kubernetes-deploy-portal).

## Create a new connection

Follow these steps to connect an app to Apache Kafka & Apache Flink on Confluent Cloud.

1. Open your App Service, Container Apps, or Azure Spring Apps, or AKS resource. If using Azure Spring Apps, you must then open the **Apps** menu and select your app.

1. Open **Service Connector** from the left menu and select **Create**.

     :::image type="content" source="./media/connect/create-connection.png" alt-text="Screenshot from the Azure portal showing the Create button.":::

1. Enter or select the following information.

    | Setting             | Example                                          | Description                                                                                                                                                                                                                                                                                              |
    |---------------------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**    | *Apache Kafka on Confluent Cloud*                | Select **Apache Kafka on Confluent Cloud** to generate a connection to a Confluent. organization.                                                                                                                                                                                                        |
    | **Connection name** | *Confluent_d0fcp*                                | The connection name that identifies the connection between your App Service and Confluent organization service. Use the connection name provided by Service Connector or enter your own connection name. Connection names can only contain letters, numbers (0-9), periods ("."), and underscores ("_"). |
    | **Source**          | *Azure marketplace Confluent resource (preview)* | Select **Azure marketplace Confluent resource (preview)**.                                                                                                                                                                                                                                                         |

     :::image type="content" source="./media/connect/confluent-source.png" alt-text="Screenshot from the Azure portal showing the Source options.":::

1. Refer to the two tabs below for instructions to connect to a Confluent resource deployed via Azure Marketplace or deployed directly on the Confluent user interface.

    > [!IMPORTANT]
    > Service Connector for Azure Marketplace Confluent resources is currently in PREVIEW.
    > See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

    ### [Azure marketplace Confluent resource](#tab/marketplace-confluent)

    If your Confluent resource is deployed through Azure Marketplace, enter or select the following information.

    | Setting                                                             | Example            | Description                                                                             |
    |---------------------------------------------------------------------|--------------------|-----------------------------------------------------------------------------------------|
    | **Subscription**                                                    | *my subscription*  | Select the subscription that holds your Confluent organization.                         |
    | **Confluent Service**                                               | *my-confluent-org* | Select the subscription that holds your Confluent organization.                         |
    | **Environment**                                                     | *demoenv1*         | Select your Confluent organization environment.                                         |
    | **Cluster**                                                         | *ProdKafkaCluster* | Select your Confluent organization cluster.                                             |
    | **Create connection for Schema Registry** | Unchecked          | This option is unchecked by default. Optionally check the box to create a connection for the schema registry. |
    | **Client type**                                                     | *Node.js*          | Select the app stack that's on your compute service instance.                           |

    :::image type="content" source="./media/connect/marketplace-basic.png" alt-text="Screenshot from the Azure portal showing Service Connector basic creation fields for an Azure Marketplace Confluent resource.":::

    ### [Azure non-marketplace Confluent resource](#tab/non-marketplace-confluent)

    If your Confluent resource is deployed directly through Azure services, rather than through Azure Marketplace, select or enter the following information.

    | Setting                                   | Example                                  | Description                                                                             |
    |-------------------------------------------|------------------------------------------|-----------------------------------------------------------------------------------------|
    | **Kafka bootstrap server URL**            | *xxxx.eastus.azure.confluent.cloud:9092* | Enter your Kafka bootstrap server URL.                                                  |
     | **Create connection for Schema Registry** | Unchecked                                | This option is unchecked by default. Optionally check the box to use a schema registry. |
    | **Client type**                           | *Node.js*                                | Select the app stack that's on your compute service instance.                           |

    :::image type="content" source="./media/connect/non-marketplace-basic.png" alt-text="Screenshot from the Azure portal showing Service Connector basic creation fields for an Azure Marketplace Confluent resource.":::

    ---

1. Select **Next: Authentication**.

    * The **Connection string** authentication type is selected by default.
    * For **API Keys**, choose **Create New**. If you already have an API key, alternatively select **Select Existing**, then enter the Kafka API key and secret.  If you're using an existing API key and selected the option to enable schema registry in the previous tab, enter the schema registry URL, schema registry API key and schema registry API secret.
    * An **Advanced** option also lets you edit the configuration variable names.

    :::image type="content" source="./media/connect/authentication.png" alt-text="Screenshot from the Azure portal showing connection authentication settings.":::

1. Select **Next: Networking** to configure the network access to your Confluent organization. **Configure firewall rules to enable access to your target service** is selected by default. Optionally also configure the webapp's outbound traffic to intergate with Virtual Network.

   :::image type="content" source="./media/connect/networking.png" alt-text="Screenshot from the Azure portal showing connection networking settings.":::

1. Select **Next: Review + Create**  to review the provided information and select **Create**.

## View and edit connections

To review your existing connections, in the Azure portal, go to your application deployed to Azure App Service, Azure Container Apps, Azure Spring Apps, or AKS and open Service Connector from the left menu.

Select a connection's checkbox and explore the following options:

* Select **>** to access connection details.
* Select **Validate** to prompt Service Connector to check your connection.
* Select **Edit** to edit connection details.
* Select **Delete** to remove a connection.

## Other solutions

### Azure Cosmos DB connectors

**Azure Cosmos DB Sink Connector fully managed connector** is generally available within Confluent Cloud. The fully managed connector eliminates the need for the development and management of custom integrations, and reduces the overall operational burden of connecting your data between Confluent Cloud and Azure Cosmos DB. The Azure Cosmos DB Sink Connector for Confluent Cloud reads from and writes data to an Azure Cosmos DB database. The connector polls data from Kafka and writes to database containers.

To set up your connector, see [Azure Cosmos DB Sink Connector for Confluent Cloud](https://docs.confluent.io/cloud/current/connectors/cc-azure-cosmos-sink.html).

**Azure Cosmos DB Self Managed connector** must be installed manually. First download an uber JAR from the [Azure Cosmos DB Releases page](https://github.com/microsoft/kafka-connect-cosmosdb/releases). Or, you can [build your own uber JAR directly from the source code](https://github.com/microsoft/kafka-connect-cosmosdb/blob/dev/doc/README_Sink.md#install-sink-connector). Complete the installation by following the guidance described in the Confluent documentation for [installing connectors manually](https://docs.confluent.io/home/connect/install.html#install-connector-manually).

### Azure Functions Kafka trigger extension

**Azure Functions Kafka trigger extension** is used to run your function code in response to messages in Kafka topics. You can also use a Kafka output binding to write from your function to a topic. For information about setup and configuration details, see [Apache Kafka bindings for Azure Functions overview](../../azure-functions/functions-bindings-kafka.md).

## Next steps

- For help with troubleshooting, see [Troubleshooting Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md).
- Get started with Apache Kafka & Apache Flink on Confluent Cloud - An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
