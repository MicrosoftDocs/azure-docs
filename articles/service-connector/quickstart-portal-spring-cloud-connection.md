---
title: Create a service connection in Azure Spring Apps from the Azure portal
description: This quickstart shows you how to create a service connection in Azure Spring Apps from the Azure portal.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: quickstart
ms.date: 10/04/2023
ms.custom:
- ignite-fall-2021
- kr2b-contr-experiment
- event-tier1-build-2022

#Customer intent: As an app developer, I want to connect an application deployed to Azure Spring Apps to a storage account in the Azure portal.
---

# Quickstart: Create a service connection in Azure Spring Apps from the Azure portal

This quickstart shows you how to connect Azure Spring Apps to other Cloud resources using the Azure portal and Service Connector. Service Connector lets you quickly connect compute services to cloud services, while managing your connection's authentication and networking settings.

> [!NOTE]
> For information on connecting resources using Azure CLI, see [Create a service connection in Azure Spring Apps with the Azure CLI](./quickstart-cli-spring-cloud-connection.md).

## Prerequisites

- An Azure account with an active subscription. [Create an Azure account for free](https://azure.microsoft.com/free).
- An app deployed to [Azure Spring Apps](../spring-apps/quickstart.md) in a [region supported by Service Connector](./concept-region-support.md).
- A target resource to connect Azure Spring Apps to. For example, a [storage account](../storage/common/storage-account-create.md).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Create a new service connection

You'll use Service Connector to create a new service connection in Azure Spring Apps.

1. To create a new connection in Azure Spring Apps, select the **Search resources, services and docs (G +/)** search bar at the top of the Azure portal, type *Azure Spring Apps* in the filter and select **Azure Spring Apps**.

    :::image type="content" source="./media/azure-spring-apps-quickstart/select-azure-spring-apps.png" alt-text="Screenshot of the Azure portal, selecting Azure Spring Apps.":::

1. Select the name of the Azure Spring Apps instance you want to connect to a target resource.

1. Under **Settings**, select **Apps** and select the application from the list.

    :::image type="content" source="./media/azure-spring-apps-quickstart/select-app.png" alt-text="Screenshot of the Azure portal, selecting an app.":::

1. Select **Service Connector** from the left table of contents and select **Create**.
    :::image type="content" source="./media/azure-spring-apps-quickstart/create-connection.png" alt-text="Screenshot of the Azure portal, selecting the button to create a connection.":::

1. Select or enter the following settings.

    | Setting             | Example              | Description                                                                                                                                                                         |
    |---------------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**    | *Storage - Blob*     | The type of service you're going to connect to your app.                                                                                                                            |
    | **Connection name** | *storageblob_17d38*  | The connection name that identifies the connection between your app and target service. Use the connection name provided by Service Connector or enter your own connection name.   |
    | **Subscription**    | *my-subscription*    | The subscription that contains your target service (the service you want to connect to). The default value is the subscription that contains the app deployed to Azure Spring Apps. |
    | **Storage account** | *my-storage-account* | The target storage account you want to connect to. If you choose a different service type, select the corresponding target service instance.                                        |
    | **Client type**     | *SpringBoot*         | The application stack that works with the target service you selected. Besides SpringBoot and Java, other stacks are also supported.                                                |

1. Select **Next: Authentication** to select the authentication type. Then select **Connection string** to use an access key to connect your storage account.
    :::image type="content" source="./media/azure-spring-apps-quickstart/authentication.png" alt-text="Screenshot of the Azure portal, filling out the Authentication tab.":::

1. Select **Next: Networking** to select the network configuration and select **Configure firewall rules to enable access to target service** so that your app can reach the Blob Storage.

    :::image type="content" source="./media/azure-spring-apps-quickstart/networking.png" alt-text="Screenshot of the Azure portal, filling out the Networking tab.":::

1. Select **Next: Review + Create** to review the provided information. Wait a few seconds for Service Connector to validate the information and select **Create** to create the service connection.

## View service connections

Azure Spring Apps connections are displayed under **Settings > Service Connector**.

1. Select **>**  to expand the list and access the properties required by your application.

1. Select **Validate** to check your connection status, and select **Learn more** to review the connection validation details.

   :::image type="content" source="./media/azure-spring-apps-quickstart/validation-result.png" alt-text="Screenshot of the Azure portal, get connection validation result.":::

## Next steps

Check the guides below for more information about Service Connector and Azure Spring Apps:

> [!div class="nextstepaction"]
> [Tutorial: Azure Spring Apps + MySQL](./tutorial-java-spring-mysql.md)

> [!div class="nextstepaction"]
> [Tutorial: Azure Spring Apps + Apache Kafka on Confluent Cloud](./tutorial-java-spring-confluent-kafka.md)
