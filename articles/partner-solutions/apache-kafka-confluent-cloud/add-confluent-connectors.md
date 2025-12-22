---
title: Create a Confluent Connector for Azure Blob Storage (Preview)
description: Learn how to use Confluent Connectors in Azure (preview) to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud to Azure Blob Storage.
ms.topic: how-to
ms.date: 10/30/2025
ms.author: malev
author: maud-lv

#customer intent: As a developer, I want to learn how to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud to Azure Blob Storage so that I can use Confluent Connectors in Azure.
---

# Create a Confluent Connector to Azure Blob Storage (preview)

Confluent Cloud helps you connect your Confluent clusters to popular data sources and sinks. You can take advantage of this solution on Azure by using the Confluent Connectors feature.

In this article, you'll learn how to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud to Azure Blob Storage.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
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
1. In the **Create a new connector** pane, configure the settings that are described in the next sections.

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

Select **Next**.

### Authentication

On the **Authentication** tab, select an authentication method: **User** or **Service account**. 

- To use a service account (recommended for production), enter a **Service account** name and continue. A new service account will be provisioned in Confluent cloud when the connector is created. 
- To use a user account, leave **User** selected and continue. A user API key and secret will be created for the specific user in Confluent cloud when the connector is created. 

:::image type="content" source="./media/confluent-connectors/authentication.png" alt-text="Screenshot that shows the Authentication tab in the Azure portal.":::

### Configuration

On the **Configuration** tab, enter or select the following values, and then select **Next**.

| Setting | Action |
| --- | --- |
| **Input Data Format**  | Select an input Kafka record data format type: **AVRO**, **JSON**, **string**, or **Protobuf**. |
| **Output Data Format** | Select an output data format: **AVRO**, **JSON**, **string**, or **Protobuf**. |
| **Time Interval**      | Select the time interval in which to group the data. Choose between hourly and daily. |
| **Flush size**         | Optionally, you can enter a flush size. The default flush size is 1,000. |
| **Number of tasks**    | Optionally, you can enter the maximum number of simultaneous tasks you want your connector to support. The default is **1**. |

:::image type="content" source="./media/confluent-connectors/configuration-sink.png" alt-text="Screenshot that shows the Configuration tab for a sink connector in the Azure portal.":::

Select **Review + create** to continue.

### Review + create

Review your settings for the connector to ensure that the details are accurate and complete. Then select **Create** to begin the connector deployment.

In the upper-right corner of the Azure portal, a notification displays the deployment status. When the status is **Completed**, refresh the **Confluent Connectors (Preview)** pane and check for the new connector tile on this pane.  

## Create a Confluent source Connector for Azure Blob Storage (preview)

1. In the Azure portal, go to your Confluent organization.
1. In the left pane, select **Confluent** > **Confluent Connectors (Preview)**.

   :::image type="content" source="./media/confluent-connectors/create-new-connector.png" alt-text="Screenshot that shows the Confluent Connectors menu in the Azure portal.":::

1. In the **Create a new connector** pane, select **Create new connector**.

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

Select **Next**.

### Authentication

On the **Authentication** tab, select an authentication method: **User** or **Service account**. 

- To use a service account (recommended for production), enter a **Service account** name and continue. A new service account will be provisioned in Confluent cloud when the connector is created. 
- To use a user account, leave **User** selected and continue. A user API key and secret will be created for the specific user in Confluent cloud when the connector is created. 

:::image type="content" source="./media/confluent-connectors/authentication.png" alt-text="Screenshot that shows the Authentication tab in the Azure portal.":::

### Configuration

On the **Configuration** tab, enter or select values for the following settings:

| Name | Action |
| --- | --- |
| **Input Data Format**  | Select an input Kafka record data format type: **AVRO**, **JSON**, **string**, **Protobuf**. |
| **Output Data Format** | Select an output data format: **AVRO**, **JSON**, **string**, or **Protobuf**. |
| **Topic name and regex** | Configure the topic name and the regex pattern of your messages to ensure they're mapped. For example, `*my-topic:.*\.json+` moves all the files that have the `.json` extension into `my-topic`. |
| **Flush size**         | (Optional) Enter a flush size. The default flush size is 1,000. |
| **Number of tasks**    | (Optional) Enter the maximum number of simultaneous tasks you want your connector to support. The default is **1**. |

:::image type="content" source="./media/confluent-connectors/configuration-source.png" alt-text="Screenshot that shows the Configuration tab and creating a source connector in the Azure portal.":::

Select **Review + create** to continue.

### Review + create

Review your settings for the connector to ensure that the details are accurate and complete. Then select **Create** to begin the connector deployment.

In the upper-right corner of the Azure portal, a notification displays the deployment status. When the status is **Completed**, refresh the **Confluent Connectors (Preview)** pane and check for the new connector tile on this pane.

## Related content

* [Troubleshoot Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md)
* Get started with Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service:

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
