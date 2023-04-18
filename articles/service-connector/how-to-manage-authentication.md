---
title: Manage authentication in Service Connector
description: Learn how to select and manage authentication parameters in Service Connector. 
author: maud-lv
ms.service: service-connector
ms.topic: how-to
ms.date: 03/07/2023
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
1. Select **Next : Authentication**. 

## Select an authentication option

Select one of the four different authentication options offered by Service Connector to connect your Azure services together:

- **System assigned managed identity**: provides an automatically managed identity tied to the resource in Azure Active Directory (Azure AD)
- **User assigned managed identity**: provides an identity that can be used on multiple resources
- **Connection string**: provides one or multiple key-value pairs with secrets or tokens
- **Service principal**: creates a service principal that defines the access policy and permissions for the user/application in the Azure AD tenant

Service Connector offers the following authentication options:

| Target resource                  | System assigned managed identity     | User assigned managed identity       | Connection string                    | Service principal                    |
|----------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| App Configuration                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Azure SQL                        | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) |                                      | 
| Azure Cache for Redis            |                                      |                                      | ![yes icon](./media/green-check.png) |                                      |
| Azure Cache for Redis Enterprise |                                      |                                      | ![yes icon](./media/green-check.png) |                                      |
| Azure Cosmos DB - Cassandra      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | 
| Azure Cosmos - Gremlin           | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Azure Cosmos DB for MongoDB      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Azure Cosmos Table               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Azure Cosmos - SQL               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Blob Storage                     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Confluent Cloud                  |                                      |                                      | ![yes icon](./media/green-check.png) |                                      |
| Event Hubs                       | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Keyvault                         | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) |
| MySQL single server              | ![yes icon](./media/green-check.png) |                                      |                                      |                                      |
| MySQL flexible server            | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) |                                      |
| Postgres single server           | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) |                                      |
| Postgres, flexible server        | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) |                                      |
| Storage Queue                    | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Storage File                     |                                      |                                      | ![yes icon](./media/green-check.png) |                                      |
| Storage Table                    |                                      |                                      | ![yes icon](./media/green-check.png) |                                      |
| Service Bus                      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| SignalR                          | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| WebPub Sub                       | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

## Review or update authentication configuration

## [System assigned managed identity](#tab/managed-identity)

When using a system-assigned managed identity, optionally review or update its authentication configuration by following these steps:

1. Select **Advanced** to display more options.
1. Under **Role**, review the default role selected for your source service or choose another one from the list.
1. Under **Configuration information**, Service Connector lists a series of configuration settings that will be generated when you create the connection. This list consists of environment variables or application properties. It varies depending on the target resource and authentication method selected. Optionally select the edit button in front of each configuration setting to edit its key.
1. Select **Done** to confirm. 

    :::image type="content" source="./media/manage-authentication/managed-identity-advanced.png" alt-text="Screenshot of the Azure portal, showing advanced authentication configuration for a system-assigned managed identity.":::

## [User assigned managed identity](#tab/user-assigned-identity)

When using a user-assigned managed identity, review or edit its authentication settings by following these steps:

1. Under **Subscription**, select the Azure subscription that contains your user-assigned managed identity. 
1. Under **User assigned managed identity**, select the managed identity you want to use.

    :::image type="content" source="./media/manage-authentication/user-assigned-identity-basic.png" alt-text="Screenshot of the Azure portal, showing basic authentication configuration for a user-assigned managed identity.":::

1. Optionally select **Advanced** to display more options.
   1. Under **Role**, review the default role selected for your source service or choose another one from the list.
   1. Under **Configuration information**, Service Connector lists a series of configuration settings that will be generated when you create the connection. This list consists of environment variables or application properties and varies depending on the target resource and authentication method selected. Optionally select the edit button in front of each configuration setting to edit its key.
   1. Select **Done** to confirm. 

    :::image type="content" source="./media/manage-authentication/user-assigned-identity-advanced.png" alt-text="Screenshot of the Azure portal, showing advanced authentication configuration for a user-assigned managed identity.":::

## [Connection string](#tab/connection-string)

When using a connection string, review or edit its authentication settings by following these steps:

1. Optionally select **Store Secret in Key Vault** to save your connection credentials in Azure Key Vault. This option lets you select an existing Key Vault connection from a drop-down list or create a new connection to a new or an existing Key Vault.

    :::image type="content" source="./media/manage-authentication/connection-string-basic-with-key-vault.png" alt-text="Screenshot of the Azure portal, showing basic authentication configuration to authenticate with a connection-string.":::

1. Optionally select **Advanced** to display more options.
   1. Under **Configuration information**, Service Connector lists a series of configuration settings that will be generated when you create the connection. This list consists of environment variables or application properties and varies depending on the target resource and authentication method selected. Optionally select the edit button in front of each configuration setting to edit its key.
   1. Select **Done** to confirm. 

    :::image type="content" source="./media/manage-authentication/connection-string-advanced.png" alt-text="Screenshot of the Azure portal, showing advanced authentication configuration to authenticate with a connection-string.":::

## [Service principal](#tab/service-principal)

When connecting Azure services using a service principal, review or edit authentication settings by following these steps:

1. Choose a service principal by entering an object ID or name and selecting your service principal.
1. Under **Secret**, enter the secret of the service principal.
1. Optionally select **Store Secret in Key Vault** to save your connection credentials in Azure Key Vault. This option lets you select an existing Key Vault connection from a drop-down list or create a new connection to a new or an existing Key Vault.

    :::image type="content" source="./media/manage-authentication/service-principal-basic-with-key-vault.png" alt-text="Screenshot of the Azure portal, showing basic authentication configuration to authenticate with a service principal.":::

1. Optionally select **Advanced** to display more options.
   1. Under **Configuration information**, Service Connector lists a series of configuration settings that will be generated when you create the connection. This list consists of environment variables or application properties and varies depending on the target resource and authentication method selected. Optionally select the edit button in front of each configuration setting to edit its key.
   1. Select **Done** to confirm. 

    :::image type="content" source="./media/manage-authentication/service-principal-advanced.png" alt-text="Screenshot of the Azure portal, showing advanced authentication configuration to authenticate with a service principal.":::

1. Select **Review + Create** and then **Create** to finalize the creation of the connection.

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
