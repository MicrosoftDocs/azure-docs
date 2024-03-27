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
* An existing Confluent organization.
* An app deployed to Azure App Service, Azure Container Apps, or Azure Spring Apps. This guide shows an example using App Service.

## Create a new connection

Follow these steps to connection an app to Apache Kafka & Apache Flink on Confluent Cloud.

1. Open your App Service, Container Apps, or Azure Spring Apps resource. To connect an app deployed to Azure Spring Apps, open the **Apps** menu and select your app.

1. Open **Service Connector** from the left menu and select **Create**.

1. Enter the following or select the following information.

    | Setting             | Example                                          | Description                                                                                                                                                                                                                                                                                              |
    |---------------------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**    | *Apache Kafka on Confluent Cloud*                | Select **Apache Kafka on Confluent Cloud** to generate a connection to a Confluent. organization.                                                                                                                                                                                                        |
    | **Connection name** | *Confluent_d0fcp*                                | The connection name that identifies the connection between your App Service and Confluent organization service. Use the connection name provided by Service Connector or enter your own connection name. Connection names can only contain letters, numbers (0-9), periods ("."), and underscores ("_"). |
    | **Source**          | *Azure marketplace Confluent resource (preview)* | Select **Azure marketplace Confluent resource**.                                                                                                                                                                                                                                                         |

1. Follow the appropriate tab below for instructions to connect to an Azure marketplace Confluent resource or to connect to an Azure non-marketplace Confluent resource.

    ### [Azure marketplace Confluent resource](#tab/marketplace-confluent)

    If your Confluent resource is deployed through Azure Marketplace, select or enter the following settings.

    | Setting               | Example                                          | Description                                                                                                                                                                                                                                                                                              |
    |-----------------------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**      | *Apache Kafka on Confluent Cloud*                | Select **Apache Kafka on Confluent Cloud** to generate a connection to a Confluent. organization.                                                                                                                                                                                                        |
    | **Connection name**   | *Confluent_d0fcp*                                | The connection name that identifies the connection between your App Service and Confluent organization service. Use the connection name provided by Service Connector or enter your own connection name. Connection names can only contain letters, numbers (0-9), periods ("."), and underscores ("_"). |
    | **Source**            | *Azure marketplace Confluent resource (preview)* | Select **Azure marketplace Confluent resource**.                                                                                                                                                                                                                                                         |
    | **Subscription**      | *My subscription*                                | Select the subscription that holds your Confluent organization.                                                                                                                                                                                                                                          |
    | **Confluent Service** | *confluent-service*                              | Select the subscription that holds your Confluent organization.                                                                                                                                                                                                                                          |    
    | **Environment**       | *my-environment*                                 | Select your Confluent organization environment.                                                                                                                                                                                                                                                          |
    | **Cluster**           | *my-cluster*                                     | Select your Confluent organization cluster.                                                                                                                                                                                                                                                              |
    | **Client type**       | *JavaScript*                                     | Select the app stack that's on your compute service instance.                                                                                                                                                                                                                                            |

    1. Optionally check the box **Enable Schema registry** to use a schema registry, and enter the schema registry URL, API key and API secret.

    1. Select **Next: Authentication** to set up authentication.
        1. For **API keys**, choose **Select existing** to use an existing API key. Enter an API key and secret under **kafka API-key (Key)** and **kafka API key (Secret)**. If you don't have an API key, create a new one by selecting **Create new**.
        1. If you selected **Enable Schema registry** in the previous step, enter the schema registry URL, schema registry API key and schema registry API secret in the appropriate fields. If your environment doesn't contain any schema registry, you can create one by selecting **Create new**.

    1. Select **Next: Networking** to configure the network access to your Confluent organization and select **Configure firewall rules to enable access to your target service**.

    1. Select **Next: Review + Create**  to review the provided information and select **Create**.

    ### [Azure non-marketplace Confluent resource](#tab/non-marketplace-confluent)

    If your Confluent resource is deployed directly through Azure services, select or enter the following settings.

    1. Enter the Kafka bootstrap server URL. For example: *xxxx.eastus.azure.confluent.cloud:9092                                                                                                                                                                                                                                                                    |
    1. Optionally check the box **Enable Schema registry** to use a schema registry, and enter the schema registry URL, API key and API secret.
    1. Select the client type. The client type corresponds to the app stack that's on your compute service instance.
    1. Select **Next: Authentication** to set up authentication.

        1. Enter an API key and secret under **kafka API-key (Key)** and **kafka API-key (Secret)**.
        1. Under **Client type**, select the app stack that's on your compute service instance.
        1. If you selected **Enable Schema registry** in the previous step, e If your environment doesn't contain any schema registry, you can create one by selecting **Create new**.

    1. Select **Next: Networking** to configure the network access to your Confluent organization and select **Configure firewall rules to enable access to your target service**.

    1. Select **Next: Review + Create** to review the provided information and select **Create**.

---

## Review connections to Apache Kafka & Apache Flink on Confluent Cloud

To review your existing connections, in the Azure portal, go to your application deployed to App Service, Container Apps or Azure Spring Apps, and open Service Connector from the left menu.

The following actions are available:

* Get connection details: select **>** to view a connection's details.
* Validate a connection: select a connection's checkbox and **Validate** to prompt Service Connector to check your connection.
* Delete a connection: select a connection's checkbox and **Delete** to remove a connection.

## Related content

* For help with troubleshooting, see [Troubleshooting Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md).
* If you need to contact support, see [Get support for Confluent Cloud resource](get-support.md).
* To learn more about managing Confluent Cloud, go to [Manage the Confluent Cloud resource](manage.md).
