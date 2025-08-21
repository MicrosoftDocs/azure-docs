---
title: Connect a Confluent Organization to Azure Compute Services
description: Learn how to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud to Azure compute services by using Service Connector in Azure.
ms.topic: how-to
ms.date: 05/28/2024

#customer intent: As a developer I want learn how to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud to Azure compute services so that I know how to connect Confluent Cloud to Azure services.
---

# Connect a Confluent organization to Azure compute services

In this article, learn how to connect an instance of Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service, to Azure compute services by using [Service Connector in Azure](../../service-connector/overview).

Service Connector is an Azure service that simplifies the process of connecting Azure resources. Service Connector manages your connection's network and authentication settings to simplify connection.

Complete the steps in this article to connect an app deployed to Azure App Service to a Confluent organization. You can use similar steps to connect your Confluent organization to other [compute services supported by Service Connector](../../service-connector/overview.md#what-services-are-supported-by-service-connector).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* An existing Confluent organization. If you don't have one, see [Create a Confluent organization](./create.md).
* An app deployed to [Azure App Service](/azure/app-service/quickstart-dotnetcore), [Azure Container Apps](/azure/container-apps/quickstart-portal), [Azure Spring Apps](/azure/spring-apps/enterprise/quickstart), or [Azure Kubernetes Services (AKS)](/azure/aks/learn/quick-kubernetes-deploy-portal).

## Create a new connection

To connect an app to Apache Kafka & Apache Flink on Confluent Cloud:

1. Go to your App Service, Container Apps, Azure Spring Apps, or AKS resource.

   If resource is an Azure Spring Apps resource, in the **Apps** menu, select your app.

1. On the left menu, select **Service Connector**, and then select **Create**.

     :::image type="content" source="./media/connect/create-connection.png" alt-text="Screenshot that shows the Create button in the Azure portal.":::

1. Enter or select values for the following settings:

    | Setting | Action |
    | --- | --- |
    | **Service type**    | Select **Apache Kafka on Confluent Cloud** to generate a connection to a Confluent organization. |
    | **Connection name** | Enter a connection name to identify the connection between your App Service and Confluent organization service. Use the connection name provided by Service Connector, or enter your own connection name. For example, *Confluent_d0fcp*. <br/><br/> Connection names can contain only letters, numbers (`0-9`), periods (`.`), and underscores (`_`).                           |
    | **Source**          | Select **Azure Marketplace Confluent resource (preview)**. |

     :::image type="content" source="./media/connect/confluent-source.png" alt-text="Screenshot that shows the Source options in the Azure portal.":::

1. To connect to a Confluent resource that you deployed via Azure Marketplace or one that you  deployed directly via the Confluent UI, use the information described in the following tables.

    > [!IMPORTANT]
    > Service Connector for Azure Marketplace Confluent resources is currently in PREVIEW.
    >
    > See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

    ### [Azure Marketplace Confluent resource](#tab/marketplace-confluent)

    If you deployed your Confluent resource through Azure Marketplace, enter or select values for the following settings:

    | Setting | Action |
    | --- | --- |
    | **Subscription** | Select the subscription where you created your Confluent organization. For example, *my subscription*. |
    | **Confluent Service** | Select the organization where your Confluent organization is located. For example, *my-confluent-org*. |
    | **Environment** | Select your Confluent organization environment. For example, *demoenv1*. |
    | **Cluster** | Select your Confluent organization cluster. For example, *ProdKafkaCluster*. |
    | **Create connection for Schema Registry** | This checkbox is cleared by default. Optionally, select the checkbox to create a connection for the schema registry. |
    | **Client type** | Select the app stack that's on your compute service instance. |

    :::image type="content" source="./media/connect/marketplace-basic.png" alt-text="Screenshot that shows Service Connector basic creation fields for an Azure Marketplace Confluent resource.":::

    ### [Azure non-Marketplace Confluent resource](#tab/non-marketplace-confluent)

    If you deployed your Confluent resource directly through Azure services instead of through Azure Marketplace, select or enter the following information.

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

1. Select **Next: Networking** to configure the network access to your Confluent organization. **Configure firewall rules to enable access to your target service** is selected by default. Optionally also configure the webapp's outbound traffic to integrate with Virtual Network.

   :::image type="content" source="./media/connect/networking.png" alt-text="Screenshot from the Azure portal showing connection networking settings.":::

1. Select **Next: Review + Create**  to review the provided information and select **Create**.

## View and edit connections

To review your existing connections, in the Azure portal, go to your application deployed to Azure App Service, Azure Container Apps, Azure Spring Apps, or AKS and open Service Connector from the left menu.

Select a connection's checkbox and explore the following options:

* Select **>** to access connection details.
* Select **Validate** to prompt Service Connector to check your connection.
* Select **Edit** to edit connection details.
* Select **Delete** to remove a connection.

## Related content

* [Troubleshoot Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md)
