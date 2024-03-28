---
title: Connect a Confluent organization to Azure resources
titlesuffix: partner-solutions
description: This article describes how to connect a Confluent organization to other Azure resources using Service Connector.
ms.service: partner-services
subservice: confluent
ms.topic: how-to
ms.custom: service-connector
ms.date: 03/27/2024
# CustomerIntent: As a Confluent developer, I want learn about the quickest way to connect a Confluent organization to other Azure services.
---

# How to connect a Confluent organization to other Azure resources using Service Connector

In this guide, learn how to connect an instance of Apache Kafka® & Apache Flink® on Confluent Cloud™ - An Azure Native ISV Service, to other Azure services, using Service Connector.

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
    | **Source**          | *Azure marketplace Confluent resource (preview)* | Select **Azure marketplace Confluent resource**.                                                                                                                                                                                                                                                         |

     :::image type="content" source="./media/connect/confluent-source.png" alt-text="Screenshot from the Azure portal showing the Create button.":::

1. Refer to the two tabs below for instructions to connect to an Azure marketplace or an Azure non-marketplace Confluent resource.

    > [!IMPORTANT]
    > Service Connector for Azure marketplace Confluent resource is currently in PREVIEW.
    > See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

    ### [Azure marketplace Confluent resource](#tab/marketplace-confluent)

    If your Confluent resource is deployed through Azure Marketplace, enter or select the following information.

    | Setting                                                             | Example            | Description                                                                             |
    |---------------------------------------------------------------------|--------------------|-----------------------------------------------------------------------------------------|
    | **Subscription**                                                    | *my subscription*  | Select the subscription that holds your Confluent organization.                         |
    | **Confluent Service**                                               | *my-confluent-org* | Select the subscription that holds your Confluent organization.                         |
    | **Environment**                                                     | *demoenv1*         | Select your Confluent organization environment.                                         |
    | **Cluster**                                                         | *ProdKafkaCluster* | Select your Confluent organization cluster.                                             |
    | **Create connection for Schema Registry Stream Governance Package** | Unchecked          | This option is unchecked by default. Optionally check the box to use a schema registry. |
    | **Client type**                                                     | *Node.js*          | Select the app stack that's on your compute service instance.                           |

    :::image type="content" source="./media/connect/marketplace-basic.png" alt-text="Screenshot from the Azure portal showing Service Connector basic creation fields for an Azure marketplace Confluent resource.":::

    ### [Azure non-marketplace Confluent resource](#tab/non-marketplace-confluent)

    If your Confluent resource is deployed directly through Azure services, select or enter the following information.

    | Setting                                   | Example                                  | Description                                                                             |
    |-------------------------------------------|------------------------------------------|-----------------------------------------------------------------------------------------|
    | **Kafka bootstrap server URL**            | *xxxx.eastus.azure.confluent.cloud:9092* | Enter your Kafka bootstrap server URL.                                                  |
    | **Cluster**                               | *ProdKafkaCluster*                       | Select your Confluent organization cluster.                                             |
    | **Create connection for Schema Registry** | Unchecked                                | This option is unchecked by default. Optionally check the box to use a schema registry. |
    | **Client type**                           | *Node.js*                                | Select the app stack that's on your compute service instance.                           |

    :::image type="content" source="./media/connect/non-marketplace-basic.png" alt-text="Screenshot from the Azure portal showing Service Connector basic creation fields for an Azure marketplace Confluent resource.":::

    ---

1. Select **Next: Authentication**.

    * The **Connection string** authentication type is selected by default.
    * For **API Keys**, choose **Create New**. If you already have an API key, you can alternatively select **Select Existing**, then enter the API key and secret under **Kafka API-Key (key)** and **Kafka API Key (secret)**. If you're using an existing API key and selected **Enable Schema registry** in the previous step, enter the schema registry URL, schema registry API key and schema registry API secret. If your environment doesn't contain any schema registry, you can create one by selecting **Create new**.
    * An **Advanced** option also lets you edit the configuration variable names.

    :::image type="content" source="./media/connect/authentication.png" alt-text="Screenshot from the Azure portal showing connection authentication settings.":::

1. Select **Next: Networking** to configure the network access to your Confluent organization. **Configure firewall rules to enable access to your target service** is selected by default. Optionally also configure the webapp's outbound traffic to intergate with Virtual Network.

   :::image type="content" source="./media/connect/networking.png" alt-text="Screenshot from the Azure portal showing connection networking settings.":::

1. Select **Next: Review + Create**  to review the provided information and select **Create**.


## Review connections to Apache Kafka & Apache Flink on Confluent Cloud

To review your existing connections, in the Azure portal, go to your application deployed to Azure App Service, Azure Container Apps, Azure Spring Apps, or AKS and open Service Connector from the left menu.

Select a connection's checkbox and explore the following options:

* Select **>** to view a connection details.
* Select **Validate** to prompt Service Connector to check your connection.
* Select **Edit** to edit connection details.
* Select **Delete** to remove a connection.

## Related content

* For help with troubleshooting, see [Troubleshooting Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md).
* If you need to contact support, see [Get support for Confluent Cloud resource](get-support.md).
* To learn more about managing Confluent Cloud, go to [Manage the Confluent Cloud resource](manage.md).
