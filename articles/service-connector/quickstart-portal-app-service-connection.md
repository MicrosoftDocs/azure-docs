---
title: Quickstart - Create a service connection in App Service from the Azure portal
description: Quickstart showing how to create a service connection in App Service from the Azure portal
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: quickstart
ms.date: 01/27/2022
ms.custom: ignite-fall-2021
# Customer intent: As an app developer, I want to connect several services together so that I can ensure I have the right connectivity to access my Azure resources.
---

# Quickstart: Create a service connection in App Service from the Azure portal

Get started with Service Connector by using the Azure portal to create a new service connection in Azure App Service.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- An application deployed to App Service in a [Region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create and deploy an app to App Service](../app-service/quickstart-dotnetcore.md).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Create a new service connection in App Service

You'll use Service Connector to create a new service connection in App Service.

1. Select the **All resources** button on the left of the Azure portal. Type **App Service** in the filter and select the name of the App Service you want to use in the list.
2. Select **Service Connector (Preview)** from the left table of contents. Then select **Create**.
3. Select or enter the following settings.

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Service type** | Blob Storage | Target service type. If you don't have a Storage Blob container, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type. |
    | **Subscription** | One of your subscriptions | The subscription where your target service (the service you want to connect to) is. The default value is the subscription that this App Service is in. |
    | **Connection name** | Generated unique name | The connection name that identifies the connection between your App Service and target service  |
    | **Storage account** | Your storage account | The target storage account you want to connect to. If you choose a different service type, select the corresponding target service instance. |
    | **Client type** | The same app stack on this App Service | Your application stack that works with the target service you selected. The default value comes from the App Service runtime stack. |

4. Select **Next: Authentication** to select the authentication type. Then select **Connection string** to use access key to connect your Blob storage account.

5. Then select **Next: Review + Create**  to review the provided information. Then select **Create** to create the service connection. It might take 1 minute to complete the operation.

## View service connections in App Service

1. In **Service Connector (Preview)**, you see an App Service connection to the target service.

1. Select the **>** button to expand the list. You can see the environment variables required by your application code.

1. Select the **...** button and select **Validate**. You can see the connection validation details in the pop-up panel on the right.

## Next steps

Follow the tutorials listed below to start building your own application with Service Connector.

> [!div class="nextstepaction"]
> [Tutorial: WebApp + Storage with Azure CLI](./tutorial-csharp-webapp-storage-cli.md)

> [!div class="nextstepaction"]
> [Tutorial: WebApp + PostgreSQL with Azure CLI](./tutorial-django-webapp-postgres-cli.md)
