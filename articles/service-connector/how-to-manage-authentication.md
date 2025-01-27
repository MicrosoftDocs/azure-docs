---
title: Manage authentication in Service Connector
description: Learn how to select and manage authentication parameters in Service Connector.
author: maud-lv
ms.service: service-connector
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 10/25/2023
ms.author: malev
---
# Manage authentication within Service Connector

In this guide, learn about the different authentication options available in Service Connector, and how to customize environment variables.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free).
- An Azure App Service, Azure Container Apps or Azure Spring Apps instance.
- This guide assumes that you already know how the basics of connecting services using Service Connector. To review our quickstarts, go to [App Service](quickstart-portal-app-service-connection.md), [Container Apps](quickstart-portal-container-apps.md) or [Azure Spring Apps](quickstart-portal-spring-cloud-connection.md).

## Start creating a new connection

1. Within your App Service, Container Apps or Azure Spring Apps instance, open Service Connector and fill out the form in the **Basics** tab with the required information about your compute and target services.
2. Select **Next : Authentication**.

## Select an authentication option

Select one of the four different authentication options offered by Service Connector to connect your Azure services together:

- **System assigned managed identity**: provides an automatically managed identity tied to the resource in Microsoft Entra ID
- **User assigned managed identity**: provides an identity that can be used on multiple resources
- **Connection string**: provides one or multiple key-value pairs with secrets or tokens
- **Service principal**: creates a service principal that defines the access policy and permissions for the user/application in the Microsoft Entra tenant

Service Connector offers the following authentication options:

| Target resource                               | System assigned managed identity | User assigned managed identity (Workload identity) | Connection string | Service principal |
|-----------------------------------------------|----------------------------------|--------------------------------|-------------------|-------------------|
| Azure AI services                             | Yes                              | Yes                            | Yes               | Yes               |
| Azure App Configuration                       | Yes                              | Yes                            | Yes               | Yes               |
| Azure Blob Storage                            | Yes                              | Yes                            | Yes               | Yes               |
| Azure Cache for Redis                         | No                               | No                             | Yes               | No                |
| Azure Cache for Redis Enterprise              | No                               | No                             | Yes               | No                |
| Azure Cosmos DB for Apache Cassandra          | Yes                              | Yes                            | Yes               | Yes               |
| Azure Cosmos DB for Apache Gremlin            | Yes                              | Yes                            | Yes               | Yes               |
| Azure Cosmos DB for MongoDB                   | Yes                              | Yes                            | Yes               | Yes               |
| Azure Cosmos DB for NoSQL                     | Yes                              | Yes                            | Yes               | Yes               |
| Azure Cosmos DB for Table                     | Yes                              | Yes                            | Yes               | Yes               |
| Azure Database for MySQL single server        | Yes                              | No                             | No                | No                |
| Azure Database for MySQL flexible server      | Yes                              | No                             | Yes               | No                |
| Azure Database for PostgreSQL single server   | Yes                              | No                             | Yes               | No                |
| Azure Database for PostgreSQL flexible server | Yes                              | No                             | Yes               | No                |
| Azure Event Hubs                              | Yes                              | Yes                            | Yes               | Yes               |
| Azure Files                                   | No                               | No                             | Yes               | No                |
| Azure Key Vault                               | Yes                              | Yes                            | No                | Yes               |
| Azure Queue Storage                           | Yes                              | Yes                            | Yes               | Yes               |
| Azure Service Bus                             | Yes                              | Yes                            | Yes               | Yes               |
| Azure SignalR Service                         | Yes                              | Yes                            | Yes               | Yes               |
| Azure SQL Database                            | Yes                              | No                             | Yes               | No                |
| Azure Table Storage                           | No                               | No                             | Yes               | No                |
| Azure Web PubSub                              | Yes                              | Yes                            | Yes               | Yes               |

## Review or update authentication configuration

## [System assigned managed identity](#tab/managed-identity)

When using a system-assigned managed identity, optionally review or update its authentication configuration by following these steps:

1. Select **Advanced** to display more options.
2. Under **Role**, review the default role selected for your source service or choose another one from the list.
3. Under **Configuration information**, Service Connector lists a series of configuration settings that will be generated when you create the connection. This list consists of environment variables or application properties. It varies depending on the target resource and authentication method selected. Optionally select the edit button in front of each configuration setting to edit its key.
4. Select **Done** to confirm.

   :::image type="content" source="./media/manage-authentication/managed-identity-advanced.png" alt-text="Screenshot of the Azure portal, showing advanced authentication configuration for a system-assigned managed identity.":::

## [User assigned managed identity](#tab/user-assigned-identity)

When using a user-assigned managed identity, review or edit its authentication settings by following these steps:

1. Under **Subscription**, select the Azure subscription that contains your user-assigned managed identity.
2. Under **User assigned managed identity**, select the managed identity you want to use.

   :::image type="content" source="./media/manage-authentication/user-assigned-identity-basic.png" alt-text="Screenshot of the Azure portal, showing basic authentication configuration for a user-assigned managed identity.":::
3. Optionally select **Advanced** to display more options.

   1. Under **Role**, review the default role selected for your source service or choose another one from the list.
   2. Under **Configuration information**, Service Connector lists a series of configuration settings that will be generated when you create the connection. This list consists of environment variables or application properties and varies depending on the target resource and authentication method selected. Optionally select the edit button in front of each configuration setting to edit its key.
   3. Select **Done** to confirm.

   :::image type="content" source="./media/manage-authentication/user-assigned-identity-advanced.png" alt-text="Screenshot of the Azure portal, showing advanced authentication configuration for a user-assigned managed identity.":::

## [Connection string](#tab/connection-string)

When using a connection string, review or edit its authentication settings by following these steps:

1. Optionally select **Store Secret in Key Vault** to save your connection credentials in Azure Key Vault. This option lets you select an existing Key Vault connection from a drop-down list or create a new connection to a new or an existing Key Vault.

   :::image type="content" source="./media/manage-authentication/connection-string-basic-with-key-vault.png" alt-text="Screenshot of the Azure portal, showing basic authentication configuration to authenticate with a connection-string.":::
2. Optionally select **Advanced** to display more options.

   1. Under **Configuration information**, Service Connector lists a series of configuration settings that will be generated when you create the connection. This list consists of environment variables or application properties and varies depending on the target resource and authentication method selected. Optionally select the edit button in front of each configuration setting to edit its key.
   2. Select **Done** to confirm.

   :::image type="content" source="./media/manage-authentication/connection-string-advanced.png" alt-text="Screenshot of the Azure portal, showing advanced authentication configuration to authenticate with a connection-string.":::

## [Service principal](#tab/service-principal)

When connecting Azure services using a service principal, review or edit authentication settings by following these steps:

1. Choose a service principal by entering an object ID or name and selecting your service principal.
2. Under **Secret**, enter the secret of the service principal.
3. Optionally select **Store Secret in Key Vault** to save your connection credentials in Azure Key Vault. This option lets you select an existing Key Vault connection from a drop-down list or create a new connection to a new or an existing Key Vault.

   :::image type="content" source="./media/manage-authentication/service-principal-basic-with-key-vault.png" alt-text="Screenshot of the Azure portal, showing basic authentication configuration to authenticate with a service principal.":::
4. Optionally select **Advanced** to display more options.

   1. Under **Configuration information**, Service Connector lists a series of configuration settings that will be generated when you create the connection. This list consists of environment variables or application properties and varies depending on the target resource and authentication method selected. Optionally select the edit button in front of each configuration setting to edit its key.
   2. Select **Done** to confirm.

   :::image type="content" source="./media/manage-authentication/service-principal-advanced.png" alt-text="Screenshot of the Azure portal, showing advanced authentication configuration to authenticate with a service principal.":::
5. Select **Review + Create** and then **Create** to finalize the creation of the connection.

---

## Check authentication configuration

You can review authentication configuration on the following pages in the Azure portal:

- When creating the connection, select the **Review + Create** tab and check the information listed under **Authentication**.

  :::image type="content" source="./media/manage-authentication/review-authentication.png" alt-text="Screenshot of the Azure portal, showing a summary of connection authentication configuration.":::
- After you've created the connection, in the **Service connector** page, configuration keys are listed.
  :::image type="content" source="./media/manage-authentication/review-keys-after-creation.png" alt-text="Screenshot of the Azure portal, showing a summary of authentication configuration keys.":::

## Next steps

> [!div class="nextstepaction"]
> [Service Connector internals](./concept-service-connector-internals.md)
