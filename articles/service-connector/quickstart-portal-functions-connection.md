---
title: Quickstart - Create a service connection in a function app from the Azure portal
description: Quickstart showing how to create a service connection in a function app from the Azure portal
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.topic: quickstart
ms.date: 10/25/2023
---
# Quickstart: Create a service connection in a function app from the Azure portal

Get started with Service Connector by using the Azure portal to create a new service connection for Azure Functions in a function app.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- A Function App in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create one](../azure-functions/create-first-function-cli-python.md).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Create a new service connection in Function App

1. To create a new service connection in Function App, select the **Search resources, services and docs (G +/)** search bar at the top of the Azure portal, type ***Function App***, and select **Function App**.

   :::image type="content" source="./media/function-app-quickstart/select-function-app.png" alt-text="Screenshot of the Azure portal, selecting Function App.":::
2. Select the Function App resource you want to connect to a target resource.
3. Select **Service Connector** from the left table of contents. Then select **Create**.

   :::image type="content" source="./media/function-app-quickstart/select-service-connector.png" alt-text="Screenshot of the Azure portal, selecting Service Connector and creating new connection.":::
4. Select or enter the following settings.

   | Setting                   | Example                                 | Description                                                                                                                                                                                |
   | ------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Service type**    | Storage -  Blob                         | The target service type. If you don't have a Microsoft Blob Storage, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type.                    |
   | **Subscription**    | My subscription                         | The subscription for your target service (the service you want to connect to). The default value is the subscription for this Function App resource.                                       |
   | **Connection name** | *my_connection*                       | The connection name that identifies the connection between your Function App and target service. Use the connection name provided by Service Connector or choose your own connection name. |
   | **Storage account** | *my_storage_account*                  | The target storage account you want to connect to. Target service instances to choose from vary according to the selected service type.                                                    |
   | **Client type**     | The same app stack on this Function App | The default value comes from the Function App runtime stack. Select the app stack that's on this Function App instance.                                                                    |
5. Select **Next: Authentication** to choose an authentication method.

   ### [System-assigned managed identity](#tab/SMI)

   System-assigned managed identity is the recommended authentication option. Select **System-assigned managed identity** to connect through an identity that's generated in Azure Active Directory and tied to the lifecycle of the service instance.

   ### [User-assigned managed identity](#tab/UMI)

   Select **User-assigned managed identity** to authenticate through a standalone identity assigned to one or more instances of an Azure service.

   ### [Connection string](#tab/CS)

   Select **Connection string** to generate or configure one or multiple key-value pairs with pure secrets or tokens.

   ### [Service principal](#tab/SP)

   Select **Service principal** to use a service principal that defines the access policy and permissions for the user/application in Azure Active Directory.
6. Select **Next: Networking** to configure the network access to your target service and select **Configure firewall rules to enable access to your target service**.
7. Select **Next: Review + Create**  to review the provided information. Then select **Create** to create the service connection. This operation may take a minute to complete.

## View service connections in Function App

1. The **Service Connector** tab displays existing function app connections.
2. Select **Validate** to check your connection. You can see the connection validation details in the panel on the right.

   :::image type="content" source="./media/function-app-quickstart/list-and-validate.png" alt-text="Screenshot of the Azure portal, listing and validating the connection.":::

## Next steps

Follow the tutorials to start building your own function application with Service Connector.

> [!div class="nextstepaction"]
> [Tutorial: Python function with Azure Queue Storage as trigger](./tutorial-python-functions-storage-queue-as-trigger.md)

> [!div class="nextstepaction"]
> [Tutorial: Python function with Azure Blob Storage as input](./tutorial-python-functions-storage-blob-as-input.md)

> [!div class="nextstepaction"]
> [Tutorial: Python function with Azure Table Storage as output](./tutorial-python-functions-storage-table-as-output.md)
