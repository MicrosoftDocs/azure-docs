---
title: Microsoft Entra roles assigned by Service Connector
description: Understand RBAC roles assigned by Service Connector when using a managed identity in Microsoft Azure.
#customer intent: As a developer, I want to understand RBAC roles assigned by Service Connector when using a managed identity, so that I can understand access permissions.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: concept-article
ms.date: 06/25/2024
---
# Microsoft Entra roles assigned by Service Connector

Service Connector's purpose is to simplify the process of connecting various Azure services together. When a connection is created using Service Connector, Service Connector configures the authentication between these Azure services.

To do this, Service Connector uses Azure's [role-based access control (RBAC)](../role-based-access-control/overview.md) authorization system that provides access management to Azure resources.

This article provides a summary of the roles assigned by Service Connector by default, and explains how to choose a different role.

## Built-in roles

By default, when a user selects one of the authentication types listed below, Service Connector assigns the managed identity the roles listed in the table that follows.

* System-assigned managed identity
* User-assigned managed identity
* Workload identity
* Service principal

| Target services         | Built-in roles                        | Description                                                                                                           | ID                                   |
|-------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| Azure Cosmos DB         | DocumentDB Account Contributor        | Can manage Azure Cosmos DB accounts. Azure Cosmos DB is formerly known as DocumentDB.                                 | 5bd9cd88-fe45-4216-938b-f97437e15450 |
| Azure Key Vault         | Key Vault Secrets User                | Read secret contents. Only works for key vaults that use the 'Azure role-based access control' permission model.      | 4633458b-17de-408a-b874-0445c86b69e6 |
|                         | Key Vault Certificate User            | Read certificate contents. Only works for key vaults that use the 'Azure role-based access control' permission model. | db79e9a7-68ee-4b58-9aeb-b90e7c24fcba |
| Azure Blob Storage      | Storage Blob Data Contributor         | Read, write, and delete Azure Storage containers and blobs.                                                           | ba92f5b4-2d11-453d-a403-e96b0029c9fe |
| Azure Storage Queue     | Storage Queue Data Contributor        | Read, write, and delete Azure Storage queues and queue messages.                                                      | 974c5e8b-45b9-4653-ba55-5f855dd0fb88 |
| Azure Storage Table     | Storage Table Data Contributor        | Read, write, and delete access to Azure Storage tables and entities.                                                  | 0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3 |
| Azure Event Hubs        | Azure Event Hubs Data Receiver        | Allows receive access to Azure Event Hubs resources.                                                                  | a638d3c7-ab3a-418d-83e6-5f17a39d4fde |
|                         | Azure Event Hubs Data Sender          | Allows send access to Azure Event Hubs resources.                                                                     | 2b629674-e913-4c01-ae53-ef4638d8f975 |
| Azure App Configuration | App Configuration Data Reader         | Allows read access to App Configuration data.                                                                         | 516239f1-63e1-4d78-a4de-a74fb236a071 |
| Azure Service Bus       | Service Bus Data Receiver             | Allows for receive access to Azure Service Bus resources.                                                             | 4f6d3b9b-027b-4f4c-9142-0e5a2a2247e0 |
|                         | Service Bus Data Sender               | Allows for send access to Azure Service Bus resources.                                                                | 69a216fc-b8fb-44d8-bc22-1f3c2cd27a39 |
| Azure SignalR           | SignalR Service Owner                 | Full access to Azure SignalR Service REST APIs.                                                                       | 7e4f1700-ea5a-4f59-8f37-079cfe29dce3 |
| Azure WebPubSub         | SignalR/Web PubSub Contributor        | Create, Read, Update, and Delete SignalR service resources.                                                           | 8cf5e20a-e4b2-4e9d-b3a1-5ceb692c2761 |
| Azure OpenAI Service    | Cognitive Services OpenAI Contributor | Full access including the ability to fine-tune, deploy, and generate text.                                            | a001fd3d-188f-4b5d-821b-7da978bf7442 |
| Azure Cognitive Service | Cognitive Services User               | Lets you read and list keys of Cognitive Services.                                                                    | a97b65f3-24c7-4388-baec-2e87135dc908 |

For more information about these roles, go to [Azure built-in roles](../role-based-access-control/built-in-roles.md)

## Role customization

When creating a new connection in Service connector, users can choose other roles than the default ones. This is done in the Azure portal in the Service Connector menu, in the **Authentication** tab, under **Advanced** > **Role**.

:::image type="content" source="./media/microsoft-entra-roles/customize-role.png" alt-text="Screenshot of the Azure portal, showing how to edit a connection's role.":::

## Related content

* [Service Connector internals](./concept-service-connector-internals.md)
* [Permission requirement for Service Connector](./concept-permission.md)
