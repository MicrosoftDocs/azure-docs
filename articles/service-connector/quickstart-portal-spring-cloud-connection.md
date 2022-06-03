---
title: Create a service connection in Spring Cloud from Azure portal
description: This quickstart shows you how to create a service connection in Spring Cloud from the Azure portal.
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: quickstart
ms.date: 5/25/2022
ms.custom:
- ignite-fall-2021
- kr2b-contr-experiment
- event-tier1-build-2022
---

# Quickstart: Create a service connection in Spring Cloud from the Azure portal

This quickstart shows you how to create a new service connection with Service Connector in Spring Cloud from the Azure portal.

## Prerequisites

- An Azure account with an active subscription. [Create an Azure account for free](https://azure.microsoft.com/free/dotnet).
- A Spring Cloud application running on Azure. If you don't have one yet, [create a Spring Cloud application](../spring-cloud/quickstart.md).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Create a new service connection in Azure Spring Cloud

1. Select the **All resources** button from the left menu. Type **Azure Spring Cloud** in the filter and select the name of the Spring Cloud resource you want to use from the list.
1. Select **Apps** and select the application name from the list.
1. Select **Service Connector** from the left table of contents. Then select **Create**.
1. Select or enter the following settings.

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Subscription** | One of your subscriptions | The subscription where your target service is located. The target service is the service you want to connect to. The default value is the subscription for the App Service. |
    | **Service Type** | Azure Blob Storage | Target service type. If you don't have an Azure Blob storage, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type. |
    | **Connection Name** | Generated unique name | The connection name that identifies the connection between your App Service and target service  |
    | **Storage account** | Your storage account | The target storage account you want to connect to. If you choose a different service type, select the corresponding target service instance. |

1. Select **Next: Authentication** to select the authentication type. Then select **Connection string** to use access key to connect your Blob storage account.
1. Then select **Next: Review + Create** to review the provided information. Then select **Create** to create the service connection. It might take one minute to complete the operation.

## View service connections in Spring Cloud

1. Select **Service Connector** to view the Spring Cloud connection to the target service.

1. Select **>**  to expand the list and access the properties required by your Spring boot application.

1. Select the ellipsis **...** and **Validate**. You can see the connection validation details in the context pane from the right.

## Next steps

Follow the tutorials listed below to start building your own application with Service Connector.

> [!div class="nextstepaction"]
> - [Tutorial: Spring Cloud + MySQL](./tutorial-java-spring-mysql.md)
> - [Tutorial: Spring Cloud + Apache Kafka on Confluent Cloud](./tutorial-java-spring-confluent-kafka.md)
