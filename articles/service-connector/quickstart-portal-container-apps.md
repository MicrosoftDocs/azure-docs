---
title: Quickstart - Create a service connection in Container Apps from the Azure portal
description: Quickstart showing how to create a service connection in Azure Container Apps from the Azure portal
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: quickstart
ms.date: 05/23/2022
#Customer intent: As an app developer, I want to connect a containerized app to a storage account in the Azure portal using Service Connector.
---

# Quickstart: Create a service connection in Container Apps from the Azure portal

Get started with Service Connector by using the Azure portal to create a new service connection in Azure Container Apps.

> [!IMPORTANT]
> This feature in Container Apps is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- An application deployed to Container Apps in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create and deploy a container to Container Apps](/azure/container-apps/quickstart-portal).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Create a new service connection in Container Apps

You'll use Service Connector to create a new service connection in Container Apps.

1. Select the **All resources** button on the left of the Azure portal. Type **Container Apps** in the filter and select the name of the container app you want to use in the list.
2. Select **Service Connector** from the left table of contents. Then select **Create**.
3. Select or enter the following settings.

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Container** | Your container | Select your Container Apps. |
    | **Service type** | Blob Storage | Target service type. If you don't have a Storage Blob container, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type. |
    | **Subscription** | One of your subscriptions | The subscription where your target service (the service you want to connect to) is located. The default value is the subscription that this container app is in. |
    | **Connection name** | Generated unique name | The connection name that identifies the connection between your container app and target service  |
    | **Storage account** | Your storage account | The target storage account you want to connect to. If you choose a different service type, select the corresponding target service instance. |
    | **Client type** | The app stack in your selected container | Your application stack that works with the target service you selected. The default value is **none**, which will generate a list of configurations. If you know about the app stack or the client SDK in the container you selected, select the same app stack for the client type. |

4. Select **Next: Authentication** to select the authentication type. Then select **Connection string** to use access key to connect your Blob Storage account.

5. Select **Next: Network** to select the network configuration. Then select **Enable firewall settings** to update firewall allowlist in Blob Storage so that your container apps can reach the Blob Storage.

6. Then select **Next: Review + Create**  to review the provided information. Running the final validation takes a few seconds. Then select **Create** to create the service connection. It might take one minute to complete the operation.

## View service connections in Container Apps

1. In **Service Connector**, select **Refresh** and you'll see a Container Apps connection displayed.

1. Select **>** to expand the list. You can see the environment variables required by your application code.

1. Select **...** and then **Validate**. You can see the connection validation details in the pop-up panel on the right.

## Next steps

Follow the tutorials listed below to start building your own application with Service Connector:

> [!div class="nextstepaction"]
> [Service Connector internals](./concept-service-connector-internals.md)
