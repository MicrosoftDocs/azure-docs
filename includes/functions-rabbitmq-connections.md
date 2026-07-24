---
author: ggailey777
ms.author: glenga
ms.service: azure-functions
ms.topic: include
ms.date: 08/08/2025
---
### Connections

> [!IMPORTANT]
> The RabbitMQ binding doesn't support Microsoft Entra authentication and managed identities. You can use Azure Key Vault to centrally managed your RabbitMQ connection strings. To learn more, see [Manage Connections](../articles/azure-functions/manage-connections.md). 
>
> Starting with version 2.x of the extension, `hostName`, `userNameSetting`, and `passwordSetting` are no longer supported to define a connection to the RabbitMQ server. You must instead use `connectionStringSetting`.

The `connectionStringSetting` property can only accept the name of a key-value pair in app settings. You can't directly set a connection string value in the binding. 

For example, when you have set `connectionStringSetting` to `rabbitMQConnection` in your binding definition, your function app must have an app setting named `rabbitMQConnection` that returns either a connection value like `amqp://myuser:***@contoso.rabbitmq.example.com:5672` or an [Azure Key Vault reference](../articles/app-service/app-service-key-vault-references.md).

When running locally, you must also have the key value for `connectionStringSetting` defined in your *local.settings.json* file. Otherwise, your app can't connect to the service from your local computer and an error occurs.