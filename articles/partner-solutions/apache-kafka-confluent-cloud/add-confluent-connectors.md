---
title: Use Confluent Connectors in Azure (preview)
description: Learn how to use Confluent Connectors in Azure (preview) to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud to Azure Blob Storage.
# customerIntent: As a developer I want use Confluent Connectors in Azure
ms.topic: how-to
ms.date: 05/28/2024
ms.author: malev
author: maud-lv
---

# Use Confluent Connectors in Azure (preview)

Confluent Cloud is a solution that help you connect your Confluent clusters to popular data sources and sinks. The solution is available in Azure by using the Confluent Connectors feature.

> [!NOTE]
> Currently, Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service, supports only Confluent Connectors for Azure Blob Storage, including source and sink connectors.

In this article, learn how to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud to Azure Blob Storage.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* An [Azure Blob Storage](/azure/storage/blobs/storage-quickstart-blobs-portal) resource.
* A [Confluent organization](./create.md) created on Azure Native Integrations.
* The Azure subscription Owner or Contributor role. If necessary, ask your subscription administrator to assign you one of these roles.  
* A [configured environment, cluster, and topic](https://docs.confluent.io/cloud/current/get-started/index.html) inside the Confluent organization. If you don't have one already, go to Confluent to create these components.

## Create a Confluent sink connector for Azure Blob Storage (preview)

To create a sink connector for Azure Blob Storage:

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent** > **Confluent Connectors (Preview)**.

   :::image type="content" source="./media/confluent-connectors/create-new-connector.png" alt-text="Screenshot tthat shows the Confluent Connectors menu in the Azure portal.":::

1. Select **Create new connector**.
1. On the **Create a new connector** pane, configure the settings described in the following sections.

### Basics

On the **Basics** tab, enter or select the following values, and, then select **Next**.

| Setting             | Example value             | Description                                                                                                                                                                                                   |
|---------------------|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Connector Type**  | **Sink**                    | A sink connector pulls data from Kafka topics and pushes it to an external database or system for storage or further processing.                                                                            |
| **Connector Class** | **Azure Blob Storage Sink** | Select the Azure service you want to connect. Currently, Azure Blob Storage is the only available option.                                                                                                      |
| **Connector name**  | **blob-sink-connector**     | Enter a name for your connector.                                                                                                                                                                              |
| **Environment**     | **env1**                    | Select the environment where you want to create the connector.                                                                                                                                         |
| **Cluster**         | **cluster1**                | Select the cluster where you want to create the connector.                                                                                                                                             |
| **Topics**          | **topic_1**                 | Select one or more topics to pull data from. If there are no topics in the cluster in the selected cluster, create one by selecting **new topic** to go to the Confluent website. |
| **Subscription**    | **My subscription**         | Select the Azure subscription of the Azure Blob Storage to push the data to.                                                                                                                   |
| **Storage Account** | **storageaccount1**         | Select the storage account to push the data to. You can also select **Create new** to create a new [storage account](../../storage/common/storage-account-create.md#basics-tab).                  |
| **Container**       | **container1**              | Select the container in the storage account to push the data to. You can also [create a new container](../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container).            |

:::image type="content" source="./media/confluent-connectors/basic-sink.png" alt-text="Screenshot that shows the Basic tab and creating a sink connector in the Azure portal.":::

### Authentication

On the **Authentication** tab, you can configure the authentication of your Kafka cluster via API keys. By default, **Create New** is selected and API keys are automatically generated and configured when the connector is created.

Leave the default values and select the **Configuration** tab.

:::image type="content" source="./media/confluent-connectors/authentication.png" alt-text="Screenshot that shows the Authentication tab in the Azure portal.":::

### Configuration

On the **Configuration** tab, enter or select the following values, and then select **Next**.

| Setting                | Example value | Description                                                                                                         |
|------------------------|---------------|---------------------------------------------------------------------------------------------------------------------|
| **Input Data Format**  | **JSON**        | Select an input Kafka record data format type: AVRO, JSON, string, Protobuf.           |
| **Output Data Format** | **JSON**        | Select an output data format: AVRO, JSON, string, Protobuf.                            |
| **Time interval**      | **Hourly**      | Select the time interval in which to group the data. Choose between hourly and daily.           |
| **Flush size**         | **1000**        | (Optional) Enter a flush size. The default flush size is 1,000.                                                          |
| **Number of tasks**    | **1**           | (Optional) Enter the maximum number of simultanous tasks you want your connector to support. The default is 1. |

:::image type="content" source="./media/confluent-connectors/configuration-sink.png" alt-text="Screenshot that shows the Configuration tab for a sink connector in the Azure portal.":::

Select **Review + create** to continue.

### Review + Create

Review your settings for the connector to ensure that the details are accurate and complete. Then, select **Create** to begin the connector deployment.

In the upper-right corner of the Azure portal, a notification displays the deployment status. When it shows the status *Completed*, refresh the **Confluent Connectors (Preview)** pane and check for the new connector tile on this pane.  

## Create a Confluent source Connector for Azure Blob Storage (preview)

1. Open your Confluent organization and select **Confluent** > **Confluent Connectors (Preview)** from the left menu.

   :::image type="content" source="./media/confluent-connectors/create-new-connector.png" alt-text="Screenshot that shows the Confluent Connectors menu in the Azure portal.":::

1. Select **Create new connector**. In the **Create a new connector** pane.

### Basics

On the **Basics** tab, enter or select the following values, and, then select **Next**.

| Setting             | Example value           | Description                                                                                              |
|---------------------|-------------------------|----------------------------------------------------------------------------------------------------------|
| **Connector Type**  | **Source**                | A source connector pulls data from an external database or system and pushes it into Kafka topics.       |
| **Connector Class** | **Azure Blob Storage**    | Select the Azure service you want to connect. Azure Blob Storage is currently the only available option. |
| **Connector name**  | **blob-source-connector** | Enter a name for your connector.                                                                         |
| **Environment**     | **env1**                  | Select the environment where you would like to create this connector.                                    |
| **Cluster**         | **cluster1**              | Select the cluster where you would like to create this connector.                                        |
| **Subscription**    | **My subscription**       | Select the Azure subscription for the Azure Blob Storage where the data needs to be pulled.              |
| **Storage Account** | **storageaccount1**       | Select the storage account where the data needs to be pulled. If needed, select **Create new** to create a new [storage account](../../storage/common/storage-account-create.md#basics-tab).     |
| **Container**       | **container1**            | Select the container within the storage account where the data needs to be pushed. If needed, [create a new container](../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container). |

:::image type="content" source="./media/confluent-connectors/basic-source.png" alt-text="Screenshot that shows the Basic tab and creating a source connector in the Azure portal.":::

### Authentication

On the **Authentication** tab, you can configure the authentication of your Kafka cluster via API keys. By default, **Create New** is selected and API keys are automatically generated and configured when the connector is created.

Leave the default values and select the **Configuration** tab.

:::image type="content" source="./media/confluent-connectors/authentication.png" alt-text="Screenshot that shows the Authentication tab in the Azure portal.":::

### Configuration

On the **Configuration** tab, enter or select the following values, and then select **Next**.

| Setting                  | Example value         | Description                                                                                                                                                                                    |
|--------------------------|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Input Data Format**    | **JSON**                | Select an input Kafka record data format type: AVRO, JSON, string, Protobuf.                                                                                      |
| **Output Data Format**   | **JSON**                | Select an output data format: AVRO, JSON, string, Protobuf.                                                                                                       |
| **Topic name and regex** | **`my-topic:.*\.json+`** | Configure the topic name and the regex pattern of your messages to ensure they are mapped. For example, `*my-topic:.*\.json+` moves all the files that have the `.json` extension into `my-topic`.   |
| **Number of tasks**      | **1**                   | (Optional) Enter the maximum number of simultaneous tasks you want your connector to support. The default is 1.                                                                            |

:::image type="content" source="./media/confluent-connectors/configuration-source.png" alt-text="Screenshot that shows the Configuration tab and creating a source connector in the Azure portal.":::

Select **Review + create** to continue.

### Review + Create

Review your settings for the connector to ensure that the details are accurate and complete. Then, select **Create** to begin the connector deployment.

In the upper-right corner of the Azure portal, a notification displays the deployment status. When it shows the status *Completed*, refresh the **Confluent Connectors (Preview)** pane and check for the new connector tile on this pane.  

## Manage Azure Confluent Connectors (preview)

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent** > **Confluent Connectors**.
1. Select your environment and cluster.

The Azure portal shows a list of Azure connectors for the environment and cluster.

You can also complete the following optional actions:

* Filter connectors by **Type** (**Source** or **Sink**) and **Status** (**Running**, **Failed**, **Provisioning, or **Paused**).
* Search for a connector by by name.

   :::image type="content" source="./media/confluent-connectors/display-connectors.png" alt-text="Screenshot that shows the Azure platform and a list of existing connectors on the Confluent Connectors (Preview) tab." lightbox="./media/confluent-connectors/display-connectors.png":::

   To learn more about a connector, select the connector tile to open Confluent. In the Confluent UI, you can see the connector health, throughput, and other information. You also can edit and delete the connector.

## Related content

* For help, see [Troubleshoot Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md).
* Get started with Apache Kafka & Apache Flink on Confluent Cloud - An Azure Native ISV Service in:

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
