---
title: Connect a Confluent Organization to Azure Compute Services
description: Learn how to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud to Azure compute services by using Service Connector in Azure.
ms.topic: how-to
ms.date: 09/19/2025
ms.custom: sfi-image-nochange

#customer intent: As a developer I want learn how to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud to Azure compute services so that I can connect Confluent Cloud to Azure services.
---

# Connect a Confluent organization to Azure compute services

In this article, you'll learn how to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service, to Azure compute services by using Service Connector in Azure.

[Service Connector](../../service-connector/overview.md) is an Azure service that simplifies the process of connecting Azure resources. Service Connector manages your connection's network and authentication settings to simplify connection.

Complete the steps in this article to connect an app deployed to Azure App Service, Azure Container Apps, Azure Spring Apps, or Azure Kubernetes Service to a Confluent organization. You can use similar steps to connect your Confluent organization to other [compute services supported by Service Connector](../../service-connector/overview.md#what-services-are-supported-by-service-connector).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* An existing Confluent organization. If you don't have one, see [Create a Confluent organization](./create.md).
* An app deployed to [Azure App Service](/azure/app-service/quickstart-dotnetcore), [Azure Container Apps](/azure/container-apps/quickstart-portal), [Azure Spring Apps](/azure/spring-apps/enterprise/quickstart), or [Azure Kubernetes Service (AKS)](/azure/aks/learn/quick-kubernetes-deploy-portal).

## Create a connection

To connect an app to Apache Kafka & Apache Flink on Confluent Cloud:

1. In the Azure portal, go to your App Service, Container Apps, Azure Spring Apps, or AKS resource.

   If your resource is an Azure Spring Apps resource, on the **Apps** menu, select your app.

1. In the left pane, under **Settings**, select **Service Connector**, and then select **Create**.

     :::image type="content" source="./media/connect/create-connection.png" alt-text="Screenshot that shows the Create button in the Azure portal." lightbox="./media/connect/create-connection.png":::

1. On the **Basics** tab, enter or select values for the following settings:

    | Name | Action |
    | --- | --- |
    | **Service type**    | Select **Apache Kafka on Confluent Cloud** to generate a connection to a Confluent organization. |
    | **Connection name** | Enter a connection name to identify the connection between App Service and your Confluent organization service. Use the connection name provided by Service Connector, or enter your own connection name. For example, *Confluent_d0fcp*. <br/><br/> Connection names can contain only letters, numbers (`0-9`), periods (`.`), and underscores (`_`).                           |
    | **Source**          | Select **Azure Marketplace Confluent resource**. |

     :::image type="content" source="./media/connect/confluent-source.png" alt-text="Screenshot that shows the Source options in the Azure portal.":::

1. To connect to a Confluent resource that you deployed via Azure Marketplace or one that you deployed directly via the Confluent UI, use the information described in the following tables.

    > [!IMPORTANT]
    > Service Connector for Azure Marketplace Confluent resources is currently in preview.
    >
    > See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

    ### [Azure Marketplace Confluent resource](#tab/marketplace-confluent)

    If you deployed your Confluent resource by using Azure Marketplace, enter or select values for the following settings:

    | Name | Action |
    | --- | --- |
    | **Subscription** | Select the subscription where you created your Confluent organization. For example, *my subscription*. |
    | **Confluent Organization** | Select the organization where your Confluent organization is located. For example, *my-confluent-org*. |
    | **Environment** | Select your Confluent organization environment. For example, *demoenv1*. |
    | **Cluster** | Select your Confluent organization cluster. For example, *ProdKafkaCluster*. |
    | **Create connection for Schema Registry** | This checkbox is cleared by default. Optionally, select the checkbox to create a connection for the schema registry. |
    | **Client type** | Select the app stack that's on your compute service instance. For example, select **Node.js**. |

    :::image type="content" source="./media/connect/marketplace-basic.png" alt-text="Screenshot that shows the Service Connector Basics pane an Azure Marketplace Confluent resource in the Azure portal." lightbox="./media/connect/marketplace-basic.png":::

    ### [Azure non-Marketplace Confluent resource](#tab/non-marketplace-confluent)

    If you deployed your Confluent resource directly through Azure services instead of through Azure Marketplace, enter or select values for the following settings:

    | Name | Action |
    | --- | --- |
    | **Kafka bootstrap server URL** | Enter your Kafka bootstrap server URL. For example, *xxx.eastus.azure.confluent.cloud:9092*. |
    | **Create connection for Schema Registry** | This checkbox is cleared by default. Optionally, select the checkbox to use a schema registry. |
    | **Client type** | Select the app stack that's on your compute service instance. For example, select **Node.js**. |

    :::image type="content" source="./media/connect/non-marketplace-basic.png" alt-text="Screenshot that shows the Service Connector Basics settings in an Azure non-Marketplace Confluent resource in the Azure portal." lightbox="./media/connect/non-marketplace-basic.png":::

    ---

1. Select **Next: Authentication**.

   On the **Authentication** tab:

    * The **Connection string** authentication type is selected by default.
    * For **API Keys**, select **Create New**. If you already have an API key, you can click **Select Existing**, and then enter the Kafka API key and secret. If you use an existing API key and select the option to enable schema registry on the **Basics** tab, enter the schema registry URL, schema registry API key, and schema registry API secret.
    * Optionally, you can select **Advanced** to edit the configuration variable names.

    :::image type="content" source="./media/connect/authentication.png" alt-text="Screenshot that shows connection authentication settings in the Azure portal.":::

1. Select **Next: Networking** to configure the network access to your Confluent organization.

   On the **Networking** tab:
  
   * The **Configure firewall rules to enable access to your target service** checkbox is selected by default.
   * Optionally, you can configure your app's outbound traffic to integrate with Azure Virtual Network.

   :::image type="content" source="./media/connect/networking.png" alt-text="Screenshot that shows the connection networking settings in the Azure portal." lightbox="./media/connect/networking.png":::

1. Select **Next: Review + Create**  to review your settings.
1. Select **Create**.

## View and edit connections

To review your existing connections:

1. In the Azure portal, go to your App Service, Container Apps, Azure Spring Apps, or AKS resource.

1. In the left pane, select **Service Connector**.

1. Select a connection and explore the following options:

   * Select **>** to access connection details.
   * Select **Validate** to prompt Service Connector to check your connection.
   * Select **Edit** to edit connection details.
   * Select **Delete** to remove a connection.

## Related content

* [Troubleshoot Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md)
