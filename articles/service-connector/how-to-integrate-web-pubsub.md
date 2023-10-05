---
title: Integrate Azure Web PubSub with service connector
description: Integrate Azure Web PubSub into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 08/11/2022
---

# Integrate Azure Web PubSub with service connector

This page shows all the supported compute services, clients, and authentication types to connect services to Azure Web PubSub instances, using Service Connector. This page also shows the default environment variable names and application properties needed to create service connections. You might still be able to connect to an Azure Web PubSub instance using other programming languages, without using Service Connector. Learn more about the [service connector environment variable naming conventions](concept-service-connector-internals.md).

## Supported compute services

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

Supported authentication and clients for App Service, Container Apps and Azure Spring Apps:

### [Azure App Service](#tab/app-service)

| Client type |   System-assigned managed identity   |    User-assigned managed identity    |       Secret/connection string       |           Service principal          |
|-------------|:------------------------------------:|:------------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Container Apps](#tab/container-apps)

| Client type |   System-assigned managed identity   |    User-assigned managed identity    |       Secret/connection string       |           Service principal          |
|-------------|:------------------------------------:|:------------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Spring Apps](#tab/spring-apps)

| Client type |   System-assigned managed identity   | User-assigned managed identity |       Secret/connection string       |           Service principal          |
|-------------|:------------------------------------:|:------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET        | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) |                                | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |


---

## Default environment variable names or application properties

Use the environment variable names and application properties listed below to connect an Azure service to Web PubSub using .NET, Java, Node.js, or Python. For each example below, replace the placeholder texts `<name>`, `<client-id>`, `<client-secret`, `<access-key>`, and `<tenant-id>` with your own resource name, client ID, client secret, access-key, and tenant ID.

### System-assigned managed identity

| Default environment variable name | Description           | Sample value                 |
| --------------------------------- | --------------------- | ---------------------------- |
| AZURE_WEBPUBSUB_HOST              | Azure Web PubSub host | `<name>.webpubsub.azure.com` |

### User-assigned managed identity

| Default environment variable name | Description                          | Sample value                      |
| --------------------------------- | ------------------------------------ | --------------------------------- |
| AZURE_WEBPUBSUB_HOST              | Azure Web PubSub host                | `<name>.webpubsub.azure.com`      |
| AZURE_WEBPUBSUB_CLIENTID          | Azure Web PubSub client ID           | `<client-id>`                     |

### Secret/connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description                              | Sample value |
> | --------------------------------- | -----------------------------------------| -------------|
> | AZURE_WEBPUBSUB_CONNECTIONSTRING  | Azure Web PubSub connection string       | `Endpoint=https://<name>.webpubsub.azure.com;AccessKey=<access-key>;Version=1.0;` |

### Service principal

| Default environment variable name | Description                          | Sample value                 |
| --------------------------------- | -------------------------------------| -----------------------------|
| AZURE_WEBPUBSUB_HOST              | Azure Web PubSub host                | `<name>.webpubsub.azure.com` |
| AZURE_WEBPUBSUB_CLIENTID          | Azure Web PubSub client ID           | `<client-id>`                |
| AZURE_WEBPUBSUB_CLIENTSECRET      | Azure Web PubSub client secret       | `<client-secret>`            |
| AZURE_WEBPUBSUB_TENANTID          | Azure Web PubSub tenant ID           | `<tenant-id>`                |

## Next steps

Read the article listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
