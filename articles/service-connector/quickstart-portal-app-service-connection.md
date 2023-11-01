---
title: Quickstart - Create a service connection in App Service from the Azure portal
description: Quickstart showing how to create a service connection in App Service from the Azure portal
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: quickstart
ms.date: 10/05/2023
#Customer intent: As an app developer, I want to connect several services together so that I can ensure I have the right connectivity to access my Azure resources.
---

# Quickstart: Create a service connection in App Service from the Azure portal

Get started with Service Connector by using the Azure portal to create a new service connection in Azure App Service.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An application deployed to App Service in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create and deploy an app to App Service](../app-service/quickstart-dotnetcore.md).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Create a new service connection in App Service

1. To create a new service connection in App Service, select the **Search resources, services and docs (G +/)** search bar at the top of the Azure portal, type ***App Services***, and select **App Services**.

    :::image type="content" source="./media/app-service-quickstart/select-app-services.png" alt-text="Screenshot of the Azure portal, selecting App Services.":::

1. Select the Azure App Services resource you want to connect to a target resource.
1. Select **Service Connector** from the left table of contents. Then select **Create**.

    :::image type="content" source="./media/app-service-quickstart/select-service-connector.png" alt-text="Screenshot of the Azure portal, selecting Service Connector and creating new connection.":::

1. Select or enter the following settings.

    | Setting             | Example                                | Description                                                                                                                                                             |
    |---------------------|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**    | Storage -  Blob                        | The target service type. If you don't have a Microsoft Blob Storage, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type. |
    | **Connection name** | *my_connection*                        | The connection name that identifies the connection between your App Service and target service. Use the connection name provided by Service Connector or choose your own connection name.                                                                          |
    | **Subscription**    | My subscription                        | The subscription for your target service (the service you want to connect to). The default value is the subscription for this App Service resource.          |
    | **Storage account** | *my_storage_account*                   | The target storage account you want to connect to. Target service instances to choose from vary according to the selected service type.                                 |
    | **Client type**     | The same app stack on this App Service | The default value comes from the App Service runtime stack. Select the app stack that's on this App Service instance.                                                    |

1. Select **Next: Authentication** to choose an authentication method.

    ### [System-assigned managed identity](#tab/SMI)

    System-assigned managed identity is the recommended authentication option. Select **System-assigned managed identity** to connect through an identity that's generated in Microsoft Entra ID and tied to the lifecycle of the service instance.

    ### [User-assigned managed identity](#tab/UMI)

    Select **User-assigned managed identity** to authenticate through a standalone identity assigned to one or more instances of an Azure service.

    ### [Connection string](#tab/CS)

    Select **Connection string** to generate or configure one or multiple key-value pairs with pure secrets or tokens.

    ### [Service principal](#tab/SP)

    Select **Service principal** to use a service principal that defines the access policy and permissions for the user/application in Microsoft Entra ID.

1. Select **Next: Networking** to configure the network access to your target service and select **Configure firewall rules to enable access to your target service**.

1. Select **Next: Review + Create**  to review the provided information. Then select **Create** to create the service connection. This operation might take a minute to complete.

> [!NOTE]
> You need enough permissions to create connection successfully, for more details, see [Permission requirements](./concept-permission.md).

## View service connections in App Service

1. Once the connection has successfully been created, the **Service Connector** page displays existing App Service connections.

1. Select the **>** button to expand the list and see the environment variables required by your application code. Select **Hidden value** to view the hidden value.

    :::image type="content" source="./media/app-service-quickstart/show-values.png" alt-text="Screenshot of the Azure portal, viewing connection details.":::

1. Select **Validate** to check your connection. Select **Learn more** to see the connection validation details in the panel on the right.

    :::image type="content" source="./media/app-service-quickstart/validation.png" alt-text="Screenshot of the Azure portal, validating the connection.":::

## Next steps

Follow the tutorials listed below to start building your own application with Service Connector.

> [!div class="nextstepaction"]
> [Tutorial: WebApp + Storage with Azure CLI](./tutorial-csharp-webapp-storage-cli.md)

> [!div class="nextstepaction"]
> [Tutorial: WebApp + PostgreSQL with Azure CLI](./tutorial-django-webapp-postgres-cli.md)
