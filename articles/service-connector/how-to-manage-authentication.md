---
title: Manage authentication
description: Learn how to select and manage authentication parameters in Service Connector. 
author: maud-lv
ms.service: service-connector
ms.topic: how-to
ms.date: 02/23/2023
ms.author: malev
---

# Manage authentication within Service Connector

In this guide, learn about the different authentication options available in Service Connector, and how to customize environment variables.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free).
- An Azure App Service, Azure Container Apps or Azure Spring Apps instance.
- This guide assumes that you already know how the basics of connecting services using Service Connector. To review our quickstarts, go to [App Service,](quickstart-portal-app-service-connection.md), [Container Apps](quickstart-portal-container-apps.md) or [Azure Spring Apps](quickstart-portal-spring-cloud-connection.md).

## Start creating a new connection

1. Within your App Service, Container Apps or Azure Spring Apps instance, open Service Connector and fill out the form in the **Basics** tab with the required information about your compute and target services.
1. Select **Next : Authentication**. 

## Select an authentication option

Select one of the four different authentication options offered by Service Connector to connect your Azure services together:

- System assigned managed identity: provides an automatically managed identity tied to the resource in Azure Active Directory (Azure AD)
- User assigned managed identity: provides an identity that can be used on multiple resources
- Connection string: provides one or multiple key-value pairs with secrets or tokens
- Service principal: creates a service principal that defines the access policy and permissions for the user/application in the Azure AD tenant

Different authentication options are available for different services:

| Target resource           | System assigned managed identity     | User assigned managed identity       | Connection string                    | Service principal                    |
|---------------------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| Postgres single server    | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) |                                      |
| Postgres, flexible server | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) |                                      |
| MySQL single server       | ![yes icon](./media/green-check.png) |                                      |                                      |                                      |
| MySQL flexible server           | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) |                                      |
| Azure SQL                       | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) |                                      | 
| Azure Cache for Redis                     |                                      |                                      | ![yes icon](./media/green-check.png) |                                      |
| Azure Cache for Redis Enterprise          |                                      |                                      | ![yes icon](./media/green-check.png) |                                      |
| Azure Cosmos DB - Cassandra          | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | 
| Azure Cosmos - Gremlin            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Azure Cosmos DB for MongoDB              | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Azure Cosmos Table              | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Azure Cosmos - SQL                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Blob storage              | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Storage Queue             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Storage File              |                                      | ![yes icon](./media/green-check.png) |                                      |                                      |
| Storage Table             |                                      | ![yes icon](./media/green-check.png) |                                      |                                      |
| Storage Queue             | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Keyvault                  | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) |
| App Configuration         | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Event Hubs                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Service Bus               | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| SignalR                   | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| WebPub Sub                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Confluent Cloud           |                                      |                                      | ![yes icon](./media/green-check.png) |                                      |

## System assigned managed identity


1. In the Authentication tab, select **Advanced**
1. 
:::image type="content" source="./media/manage-authentication/managed-identity-advanced.png" alt-text="Screenshot of the Azure portal, selecting Advanced in the Authentication tab.":::

## Next steps

> [!div class="nextstepaction"]
> [Service Connector internals](./concept-service-connector-internals.md)
