---
title: Use Confluent Connectors in Azure (Preview)
description: Learn how to use Confluent Connectors in Azure (preview) to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud to Azure Blob Storage.
ms.topic: how-to
ms.date: 05/28/2024
ms.author: malev
author: maud-lv

#customer intent: As a developer, I want learn how to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud to Azure Blob Storage so that I can use Confluent Connectors in Azure.
---

# Use Confluent Connectors in Azure (preview)

Confluent Cloud helps you connect your Confluent clusters to popular data sources and sinks. The solution is available on Azure by using the Confluent Connectors feature.

> [!NOTE]
> Currently, Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service, supports only Confluent Connectors for Azure Blob Storage. It supports both source and sink connectors in Azure Blob Storage.

In this article, learn how to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud to Azure Blob Storage.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* An [Azure Blob Storage](/azure/storage/blobs/storage-quickstart-blobs-portal) resource.
* A [Confluent organization](./create.md) created in Azure Native Integrations.
* The Owner or Contributor role for the Azure subscription. You might need to ask your subscription administrator to assign you one of these roles.  
* A [configured environment, cluster, and topic](https://docs.confluent.io/cloud/current/get-started/index.html) inside the Confluent organization. If you don't have one already, go to Confluent to create these components.

## Create a Confluent sink connector for Azure Blob Storage (preview)

To create a sink connector for Azure Blob Storage:

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent** > **Confluent Connectors (Preview)**.

   :::image type="content" source="./media/confluent-connectors/create-new-connector.png" alt-text="Screenshot that shows the Confluent Connectors menu in the Azure portal.":::

1. Select **Create new connector**.
1. On the **Create a new connector** pane, configure the settings that are described in the next sections.

### Basics

On the **Basics** tab, enter or select values for the following settings:

| Name | Action |
| --- | --- |
| **Connector Type**  | Select **Sink**. |
| **Connector Class** | Select **Azure Blob Storage Sink**. |
| **Connector Name**  | Enter a name for your connector. For example, *blob-sink-connector*.     |
| **Environment** | Select the environment where you want to create this connector. For example, *env1*. |
| **Cluster** | Select the cluster where you want to create this connector. For example, *cluster1*. |
| **Topics** | Select one or more topics to pull data from. If there are no topics in the selected cluster, create one by selecting **new topic** to go to the Confluent website. For example, *topic_1*. |
| **Subscription** | Select the Azure subscription of the Azure Blob Storage instance to pull data from. For example, *My subscription*. |
| **Storage Account** |  Select the storage account to pull the data from. For example, *storageaccount1*. Optionally, you can select **Create new** to create a new [storage account](../../storage/common/storage-account-create.md#basics-tab). |
| **Container** | Select the container within the storage account to push data to. For example, *container1*. Optionally, you can [create a new container](../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container). |

:::image type="content" source="./media/confluent-connectors/basic-sink.png" alt-text="Screenshot that shows the Basics tab and creating a sink connector in the Azure portal.":::

Then, select **Next**.

### Authentication

On the **Authentication** tab, you can configure the authentication of your Kafka cluster via API keys. By default, **Create New** is selected and API keys are automatically generated and configured when the connector is created.

Leave the default values and select the **Configuration** tab.

:::image type="content" source="./media/confluent-connectors/authentication.png" alt-text="Screenshot that shows the Authentication tab in the Azure portal.":::

### Configuration

On the **Configuration** tab, enter or select the following values, and then select **Next**.

| Setting | Action |
| --- | --- |
| **Input Data Format**  | Select an input Kafka record data format type: AVRO, JSON, string, or Protobuf. |
| **Output Data Format** | Select an output data format: AVRO, JSON, string, or Protobuf. |
| **Time Interval**      | Select the time interval in which to group the data. Choose between hourly and daily. |
| **Flush size**         | Optionally, you can enter a flush size. The default flush size is 1,000. |
| **Number of tasks**    | Optionally, you can enter the maximum number of simultaneous tasks you want your connector to support. The default is 1. |

:::image type="content" source="./media/confluent-connectors/configuration-sink.png" alt-text="Screenshot that shows the Configuration tab for a sink connector in the Azure portal.":::

Select **Review + create** to continue.

### Review + create

Review your settings for the connector to ensure that the details are accurate and complete. Then, select **Create** to begin the connector deployment.

In the upper-right corner of the Azure portal, a notification displays the deployment status. When it shows the status *Completed*, refresh the **Confluent Connectors (Preview)** pane and check for the new connector tile on this pane.  

## Create a Confluent source Connector for Azure Blob Storage (preview)

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent** > **Confluent Connectors (Preview)**.

   :::image type="content" source="./media/confluent-connectors/create-new-connector.png" alt-text="Screenshot that shows the Confluent Connectors menu in the Azure portal.":::

1. On the **Create a new connector** pane, select **Create new connector**.

### Basics

On the **Basics** tab, enter or select values for the following settings:

| Name | Action |
| --- | --- |
| **Connector Type**  | Select **Source**. |
| **Connector Class** | Select **Azure Blob Storage**. |
| **Connector Name**  | Enter a name for your connector. For example, *blob-source-connector*. |
| **Environment** | Select the environment where you want to create this connector. For example, *env1*. |
| **Cluster** | Select the cluster where you want to create this connector. For example, *cluster1*. |
| **Subscription** | Select the Azure subscription of the Azure Blob Storage instance to pull data from. For example, *My subscription*. |
| **Storage Account** |  Select the storage account to pull the data from. For example, *storageaccount1*. Optionally, you can select **Create new** to create a new [storage account](../../storage/common/storage-account-create.md#basics-tab). |
| **Container** | Select the container within the storage account to push data to. For example, *container1*. Optionally, you can [create a new container](../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container). |

:::image type="content" source="./media/confluent-connectors/basic-source.png" alt-text="Screenshot that shows the Basics tab and creating a source connector in the Azure portal.":::

Then, select **Next**.

### Authentication

On the **Authentication** tab, you can configure the authentication of your Kafka cluster via API keys. By default, **Create New** is selected and API keys are automatically generated and configured when the connector is created.

Leave the default values and select the **Configuration** tab.

:::image type="content" source="./media/confluent-connectors/authentication.png" alt-text="Screenshot that shows the Authentication tab in the Azure portal.":::

### Configuration

On the **Configuration** tab, enter or select values for the following settings:

| Name | Action |
| --- | --- |
| **Input Data Format**  | Select an input Kafka record data format type: AVRO, JSON, string, Protobuf. |
| **Output Data Format** | Select an output data format: AVRO, JSON, string, or Protobuf. |
| **Topic name and regex** | Configure the topic name and the regex pattern of your messages to ensure they're mapped. For example, `*my-topic:.*\.json+` moves all the files that have the `.json` extension into `my-topic`. |
| **Flush size**         | (Optional) Enter a flush size. The default flush size is 1,000. |
| **Number of tasks**    | (Optional) Enter the maximum number of simultaneous tasks you want your connector to support. The default is 1. |

:::image type="content" source="./media/confluent-connectors/configuration-source.png" alt-text="Screenshot that shows the Configuration tab and creating a source connector in the Azure portal.":::

Select **Review + create** to continue.

### Review + create

Review your settings for the connector to ensure that the details are accurate and complete. Then, select **Create** to begin the connector deployment.

In the upper-right corner of the Azure portal, a notification displays the deployment status. When it shows the status *Completed*, refresh the **Confluent Connectors (Preview)** pane and check for the new connector tile on this pane.  

## Manage Azure Confluent Connectors (preview)

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent** > **Confluent Connectors**.
1. Select your environment and cluster.

The Azure portal shows a list of Azure connectors for the environment and cluster.

You can also complete the following optional actions:

* Filter connectors by **Type** (**Source** or **Sink**) and **Status** (**Running**, **Failed**, **Provisioning**, or **Paused**).
* Search for a connector by name.

   :::image type="content" source="./media/confluent-connectors/display-connectors.png" alt-text="Screenshot that shows a list of existing connectors on the Confluent Connectors tab in the Azure portal." lightbox="./media/confluent-connectors/display-connectors.png":::

   To learn more about a connector, select the connector tile to open Confluent. In the Confluent UI, you can see the connector health, throughput, and other information. You also can edit and delete the connector.

## Related content

* [Troubleshoot Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md)
* Get started with Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service:

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
