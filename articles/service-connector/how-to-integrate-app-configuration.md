---
title: Integrate Azure App Configuration with Service Connector
description: Integrate Azure App Configuration into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 08/11/2022
---

# Integrate Azure App Configuration with Service Connector

This page shows the supported authentication types and client types of Azure App Configuration using Service Connector. You might still be able to connect to App Configuration in other programming languages without using Service Connector. You can learn more about the [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute services

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps and Azure Spring Apps:

### [Azure App Service](#tab/app-service)

| Client type |   System-assigned managed identity   |    User-assigned managed identity    |       Secret/connection string       |           Service principal          |
|-------------|:------------------------------------:|:------------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Container Apps](#tab/container-apps)

| Client type |   System-assigned managed identity   |    User-assigned managed identity    |       Secret/connection string       |           Service principal          |
|-------------|:------------------------------------:|:------------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

### [Azure Spring Apps](#tab/spring-apps)

| Client type |   System-assigned managed identity   |    User-assigned managed identity    |       Secret/connection string       |           Service principal          |
|-------------|:------------------------------------:|:------------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET        | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None        | ![yes icon](./media/green-check.png) |                                      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties

Use the connection details below to connect compute services to Azure App Configuration stores instances. For each example below, replace the placeholder texts
`<App-Configuration-name>`, `<ID>`, `<secret>`, `<client-ID>`,  `<client-secret>`, and `<tenant-ID>` with your App Configuration store name, ID, secret, client ID, client secret and tenant ID.

### Secret / connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | AZURE_APPCONFIGURATION_CONNECTIONSTRING | Your App Configuration Connection String | `Endpoint=https://<App-Configuration-name>.azconfig.io;Id=<ID>;Secret=<secret>` |

### System-assigned managed identity

| Default environment variable name | Description                  | Sample value                                   |
|-----------------------------------|------------------------------|------------------------------------------------|
| AZURE_APPCONFIGURATION_ENDPOINT   | App Configuration   endpoint | `https://<App-Configuration-name>.azconfig.io` |

### User-assigned managed identity

| Default environment variable name | Description                | Sample value                                  |
|-----------------------------------|----------------------------|-----------------------------------------------|
| AZURE_APPCONFIGURATION_ENDPOINT   | App Configuration Endpoint | `https://App-Configuration-name>.azconfig.io` |
| AZURE_APPCONFIGURATION_CLIENTID   | Your client ID             | `<client-ID>`                                 |

### Service principal

| Default environment variable name   | Description                | Sample value                                 |
|-------------------------------------|----------------------------|----------------------------------------------|
| AZURE_APPCONFIGURATION_ENDPOINT     | App Configuration Endpoint | `https://<AppConfigurationName>.azconfig.io` |
| AZURE_APPCONFIGURATION_CLIENTID     | Your client ID             | `<client-ID>`                                |
| AZURE_APPCONFIGURATION_CLIENTSECRET | Your client secret         | `<client-secret>`                            |
| AZURE_APPCONFIGURATION_TENANTID     | Your tenant ID             | `<tenant-ID>`                                |

## Next steps

Follow the tutorial listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
